import { supabase } from '../db'
import { sendLiveAlert } from '../broadcast/whatsapp'

const VIRAL_THRESHOLD = 0.8

export async function runAlertJob(): Promise<void> {
  // Find trends that crossed the viral threshold in the last 30 minutes
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

  const { data: viralTrends } = await supabase
    .from('trend_scores_mv')
    .select('*')
    .gt('computed_score', VIRAL_THRESHOLD)
    .eq('commitments', 0)
    .gt('updated_at', thirtyMinAgo)
    .limit(3)

  if (!viralTrends || viralTrends.length === 0) return

  for (const trend of viralTrends) {
    // Check if we already sent an alert for this trend today
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('wa_message_log')
      .select('*', { count: 'exact', head: true })
      .eq('message_type', 'live_alert')
      .gte('sent_at', `${today}T00:00:00`)

    if ((count ?? 0) >= 5) {
      console.log(JSON.stringify({ level: 'info', msg: 'Max daily alerts reached, skipping' }))
      return
    }

    await sendLiveAlert(trend.id)
  }
}
