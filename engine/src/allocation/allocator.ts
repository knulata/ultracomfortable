import { supabase } from '../db'
import type { AllocationResult, PartnerRow } from '../types'

/**
 * Intelligent production allocation engine.
 * Assigns trending styles to specific partners based on:
 * 1. Category specialty match
 * 2. Available weekly capacity
 * 3. Fulfillment rate (higher = priority)
 * 4. No existing commitment to this trend
 * 5. Avoid over-allocating one trend
 */
export async function allocateTrends(): Promise<AllocationResult[]> {
  // Get active trends without enough partners (gap)
  const { data: trends } = await supabase
    .from('trend_scores_mv')
    .select('*')
    .gt('computed_score', 0.1)
    .lt('commitments', 3)
    .order('computed_score', { ascending: false })
    .limit(20)

  if (!trends || trends.length === 0) {
    console.log(JSON.stringify({ level: 'info', msg: 'No trends to allocate' }))
    return []
  }

  // Get active partners with capacity
  const { data: partners } = await supabase
    .from('partners')
    .select('id, owner_name, shop_name, whatsapp, specialties, weekly_capacity, fulfillment_rate, status')
    .eq('status', 'active')
    .order('fulfillment_rate', { ascending: false })

  if (!partners || partners.length === 0) {
    console.log(JSON.stringify({ level: 'info', msg: 'No active partners for allocation' }))
    return []
  }

  // Get existing allocations for today to avoid duplicates
  const today = new Date().toISOString().split('T')[0]
  const { data: existingAllocations } = await supabase
    .from('allocations')
    .select('trend_id, partner_id')
    .gte('allocated_at', `${today}T00:00:00`)

  const existingPairs = new Set(
    (existingAllocations ?? []).map((a) => `${a.trend_id}:${a.partner_id}`)
  )

  // Get this week's commitments per partner (for capacity check)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: weeklyCommits } = await supabase
    .from('partner_responses')
    .select('partner_id')
    .eq('response', 'bisa')
    .gte('responded_at', weekAgo)

  const weeklyCommitCounts = new Map<string, number>()
  for (const commit of weeklyCommits ?? []) {
    weeklyCommitCounts.set(
      commit.partner_id,
      (weeklyCommitCounts.get(commit.partner_id) ?? 0) + 1
    )
  }

  const allocations: AllocationResult[] = []

  for (const trend of trends) {
    // Find best partners for this trend
    const candidates = partners
      .filter((partner) => {
        // Skip if already allocated today
        if (existingPairs.has(`${trend.id}:${partner.id}`)) return false

        // Check capacity
        const used = weeklyCommitCounts.get(partner.id) ?? 0
        if (used >= (partner as PartnerRow).weekly_capacity) return false

        return true
      })
      .map((partner) => {
        let score = 0
        const p = partner as PartnerRow

        // Specialty match bonus
        if (trend.category && p.specialties.includes(trend.category)) {
          score += 30
        }

        // Fulfillment rate bonus
        score += p.fulfillment_rate * 0.5

        // Capacity headroom bonus
        const used = weeklyCommitCounts.get(p.id) ?? 0
        const headroom = (p.weekly_capacity - used) / p.weekly_capacity
        score += headroom * 20

        return { partner: p, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Max 3 partners per trend

    for (const { partner, score } of candidates) {
      const reason = buildAllocationReason(partner, trend.category, score)
      allocations.push({
        trend_id: trend.id,
        partner_id: partner.id,
        reason,
      })
    }
  }

  // Insert allocations
  if (allocations.length > 0) {
    const { error } = await supabase.from('allocations').upsert(
      allocations.map((a) => ({
        trend_id: a.trend_id,
        partner_id: a.partner_id,
        reason: a.reason,
      })),
      { onConflict: 'trend_id,partner_id' }
    )

    if (error) {
      console.error(JSON.stringify({ level: 'error', msg: 'Allocation insert failed', error: error.message }))
    }
  }

  console.log(JSON.stringify({
    level: 'info',
    msg: 'Allocation complete',
    trendsAllocated: trends.length,
    allocationsCreated: allocations.length,
    partnersInvolved: new Set(allocations.map((a) => a.partner_id)).size,
  }))

  return allocations
}

function buildAllocationReason(partner: PartnerRow, category: string | null, score: number): string {
  const reasons: string[] = []
  if (category && partner.specialties.includes(category)) {
    reasons.push(`spesialisasi ${category}`)
  }
  if (partner.fulfillment_rate > 80) {
    reasons.push(`pemenuhan ${Math.round(partner.fulfillment_rate)}%`)
  }
  reasons.push(`skor kecocokan ${Math.round(score)}`)
  return reasons.join(', ')
}
