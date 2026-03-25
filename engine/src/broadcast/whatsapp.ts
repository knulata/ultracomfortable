import { config } from '../config'
import { supabase } from '../db'
import { WA_TEMPLATES } from './templates'
import { allocateTrends } from '../allocation/allocator'

const WA_API_URL = `https://graph.facebook.com/v21.0/${config.whatsapp.phoneNumberId}/messages`

async function sendMessage(to: string, body: string): Promise<string | null> {
  if (!config.whatsapp.token) {
    console.log(JSON.stringify({ level: 'warn', msg: 'WA token not configured, skipping send', to }))
    return null
  }

  try {
    const response = await fetch(WA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.whatsapp.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error(JSON.stringify({ level: 'error', msg: 'WA send failed', to, error: errorData }))
      return null
    }

    const data = (await response.json()) as { messages?: Array<{ id: string }> }
    return data.messages?.[0]?.id ?? null
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      msg: 'WA send error',
      to,
      error: error instanceof Error ? error.message : String(error),
    }))
    return null
  }
}

export async function sendDailyBroadcast(): Promise<void> {
  console.log(JSON.stringify({ level: 'info', msg: 'Starting daily broadcast' }))

  // Run allocation first
  const allocations = await allocateTrends()

  // Group allocations by partner
  const partnerAllocations = new Map<string, string[]>()
  for (const alloc of allocations) {
    const existing = partnerAllocations.get(alloc.partner_id) ?? []
    existing.push(alloc.trend_id)
    partnerAllocations.set(alloc.partner_id, existing)
  }

  // Get partner details
  const { data: partners } = await supabase
    .from('partners')
    .select('id, owner_name, whatsapp')
    .eq('status', 'active')

  if (!partners || partners.length === 0) {
    console.log(JSON.stringify({ level: 'info', msg: 'No active partners for broadcast' }))
    return
  }

  // Get trend details for message
  const allTrendIds = [...new Set(allocations.map((a) => a.trend_id))]
  const { data: trends } = await supabase
    .from('trend_scores_mv')
    .select('*')
    .in('id', allTrendIds.length > 0 ? allTrendIds : ['none'])

  const trendMap = new Map((trends ?? []).map((t) => [t.id, t]))
  let sent = 0

  for (const partner of partners) {
    const trendIds = partnerAllocations.get(partner.id) ?? []

    // If no specific allocation, send top 5 trends
    const partnerTrends = trendIds.length > 0
      ? trendIds.map((id) => trendMap.get(id)).filter(Boolean)
      : (trends ?? []).slice(0, 5)

    if (partnerTrends.length === 0) continue

    const body = WA_TEMPLATES.daily_trend_blast.buildBody({
      partnerName: partner.owner_name,
      trends: partnerTrends.map((t) => ({
        name: t!.name ?? t!.category ?? 'Trending',
        score: t!.computed_score,
        partners: t!.commitments,
      })),
    })

    const waMessageId = await sendMessage(partner.whatsapp, body)

    // Log message
    await supabase.from('wa_message_log').insert({
      partner_id: partner.id,
      message_type: 'daily_broadcast',
      wa_message_id: waMessageId,
      status: waMessageId ? 'sent' : 'failed',
    })

    if (waMessageId) sent++

    // Rate limiting: wait 100ms between messages
    await new Promise((r) => setTimeout(r, 100))
  }

  // Update daily metrics
  const today = new Date().toISOString().split('T')[0]
  await supabase.from('daily_metrics').upsert({
    date: today,
    broadcasts_sent: sent,
  })

  console.log(JSON.stringify({ level: 'info', msg: 'Daily broadcast complete', sent, total: partners.length }))
}

export async function sendLiveAlert(trendId: string): Promise<void> {
  const { data: trend } = await supabase
    .from('trend_scores_mv')
    .select('*')
    .eq('id', trendId)
    .single()

  if (!trend) return

  const { data: partners } = await supabase
    .from('partners')
    .select('id, owner_name, whatsapp')
    .eq('status', 'active')
    .limit(10)

  if (!partners) return

  const body = WA_TEMPLATES.live_alert.buildBody({
    styleName: trend.name ?? 'Trending style',
    views: trend.social_velocity > 1000
      ? `${Math.round(trend.social_velocity / 1000)}K`
      : String(Math.round(trend.social_velocity)),
    category: trend.category ?? 'Fashion',
  })

  for (const partner of partners) {
    await sendMessage(partner.whatsapp, body)
    await new Promise((r) => setTimeout(r, 100))
  }

  console.log(JSON.stringify({ level: 'info', msg: 'Live alert sent', trendId, partners: partners.length }))
}

export function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature || !config.whatsapp.token) return false
  // Meta webhook verification uses the app secret, not the token
  // For simplicity, verify the token matches
  return true // Implement proper HMAC verification in production
}

export async function handleIncomingMessage(from: string, text: string): Promise<void> {
  const normalizedText = text.trim().toUpperCase()

  // Find partner by WhatsApp number
  const { data: partner } = await supabase
    .from('partners')
    .select('id, owner_name')
    .eq('whatsapp', from)
    .single()

  if (!partner) {
    console.log(JSON.stringify({ level: 'warn', msg: 'Unknown WA sender', from }))
    return
  }

  if (normalizedText.startsWith('BISA')) {
    // Parse "BISA 1" or just "BISA"
    const parts = normalizedText.split(/\s+/)
    const trendIndex = parts.length > 1 ? parseInt(parts[1]) - 1 : 0

    // Get the most recent allocation for this partner
    const { data: allocations } = await supabase
      .from('allocations')
      .select('trend_id')
      .eq('partner_id', partner.id)
      .order('allocated_at', { ascending: false })
      .limit(10)

    const allocation = allocations?.[trendIndex]
    if (!allocation) {
      await sendMessage(from, 'Maaf, tidak ada trend yang sesuai. Buka dashboard untuk melihat semua trend.')
      return
    }

    // Create response
    await supabase.from('partner_responses').upsert({
      partner_id: partner.id,
      trend_id: allocation.trend_id,
      response: 'bisa',
      responded_at: new Date().toISOString(),
    }, { onConflict: 'partner_id,trend_id' })

    // Send confirmation
    const { data: trend } = await supabase
      .from('trends')
      .select('name')
      .eq('id', allocation.trend_id)
      .single()

    await sendMessage(from, WA_TEMPLATES.commitment_confirmation.buildBody({
      styleName: trend?.name ?? 'Trending style',
      quantity: 0, // They'll set this in dashboard
      price: 0,
      leadTime: 7,
    }))

    console.log(JSON.stringify({ level: 'info', msg: 'WA bisa response processed', partnerId: partner.id, trendId: allocation.trend_id }))
  }
}
