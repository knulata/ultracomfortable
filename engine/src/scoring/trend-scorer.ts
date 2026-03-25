import { supabase } from '../db'

/**
 * Refresh the materialized view that computes trend scores.
 * The scoring formula is in the SQL view definition.
 */
export async function refreshTrendScores(): Promise<void> {
  try {
    const { error } = await supabase.rpc('refresh_trend_scores')
    if (error) {
      console.error(JSON.stringify({ level: 'error', msg: 'Failed to refresh trend scores', error: error.message }))
      return
    }

    // Expire old trends (no new items in 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('trends')
      .update({ status: 'declining' })
      .eq('status', 'active')
      .lt('updated_at', sevenDaysAgo)

    // Mark declining trends as expired after 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('trends')
      .update({ status: 'expired' })
      .eq('status', 'declining')
      .lt('updated_at', fourteenDaysAgo)

    // Update daily metrics
    const today = new Date().toISOString().split('T')[0]
    const { count: trendsCount } = await supabase
      .from('trends')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: commitmentsCount } = await supabase
      .from('partner_responses')
      .select('*', { count: 'exact', head: true })
      .eq('response', 'bisa')
      .gte('responded_at', `${today}T00:00:00`)

    const { count: respondedCount } = await supabase
      .from('partner_responses')
      .select('*', { count: 'exact', head: true })
      .gte('responded_at', `${today}T00:00:00`)

    await supabase.from('daily_metrics').upsert({
      date: today,
      trends_detected: trendsCount ?? 0,
      models_committed: commitmentsCount ?? 0,
      partners_responded: respondedCount ?? 0,
    })

    console.log(JSON.stringify({
      level: 'info',
      msg: 'Trend scores refreshed',
      activeTrends: trendsCount,
      todayCommitments: commitmentsCount,
    }))
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      msg: 'Score refresh failed',
      error: error instanceof Error ? error.message : String(error),
    }))
  }
}
