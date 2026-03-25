import { createClient } from './client'
import type { TrendScoreView, TrendFilters, CommitData, DailyMetrics, TrendItem } from '@/types/trends'

const supabase = createClient()

export async function fetchTrends(filters?: TrendFilters): Promise<TrendScoreView[]> {
  let query = supabase
    .from('trend_scores_mv')
    .select('*')

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  switch (filters?.sortBy) {
    case 'newest':
      query = query.order('first_seen_at', { ascending: false })
      break
    case 'most_sold':
      query = query.order('marketplace_sales_signal', { ascending: false })
      break
    default:
      query = query.order('computed_score', { ascending: false })
  }

  const { data, error } = await query.limit(100)
  if (error) throw error
  return data ?? []
}

export async function fetchTrendItems(trendId: string): Promise<TrendItem[]> {
  const { data, error } = await supabase
    .from('trend_item_links')
    .select('item_id, trend_items(*)')
    .eq('trend_id', trendId)

  if (error) throw error
  return (data ?? []).map((row: { trend_items: TrendItem }) => row.trend_items)
}

export async function fetchPartnerAllocations(partnerId: string) {
  const { data, error } = await supabase
    .from('allocations')
    .select('*, trends(*)')
    .eq('partner_id', partnerId)
    .order('allocated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function fetchPartnerResponses(partnerId: string) {
  const { data, error } = await supabase
    .from('partner_responses')
    .select('*')
    .eq('partner_id', partnerId)

  if (error) throw error
  return data ?? []
}

export async function commitToTrend(commit: CommitData) {
  const { data, error } = await supabase
    .from('partner_responses')
    .upsert({
      partner_id: commit.partner_id,
      trend_id: commit.trend_id,
      response: 'bisa',
      price_offered: commit.price_offered,
      quantity_offered: commit.quantity_offered,
      lead_time_days: commit.lead_time_days,
      responded_at: new Date().toISOString(),
    }, { onConflict: 'partner_id,trend_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchDailyMetrics(): Promise<DailyMetrics | null> {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('date', today)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function fetchGapAnalysis(): Promise<TrendScoreView[]> {
  const { data, error } = await supabase
    .from('trend_scores_mv')
    .select('*')
    .eq('commitments', 0)
    .order('computed_score', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function searchSimilarTrends(embedding: number[], limit = 10) {
  const { data, error } = await supabase
    .rpc('match_trend_items', {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: limit,
    })

  if (error) throw error
  return data ?? []
}

export async function uploadPartnerPhoto(partnerId: string, file: File, photoType: 'stock' | 'fabric') {
  const fileName = `${partnerId}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('partner-photos')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('partner-photos')
    .getPublicUrl(fileName)

  const { data, error } = await supabase
    .from('partner_stock_photos')
    .insert({
      partner_id: partnerId,
      image_url: urlData.publicUrl,
      photo_type: photoType,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
