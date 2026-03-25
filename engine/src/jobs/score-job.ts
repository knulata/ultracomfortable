import { clusterTrendItems } from '../scoring/clustering'
import { refreshTrendScores } from '../scoring/trend-scorer'

export async function runScoreJob(): Promise<void> {
  console.log(JSON.stringify({ level: 'info', msg: 'Starting score job' }))

  // Step 1: Cluster new items into trends
  const newTrends = await clusterTrendItems()

  // Step 2: Refresh materialized view with updated scores
  await refreshTrendScores()

  console.log(JSON.stringify({ level: 'info', msg: 'Score job complete', newTrends }))
}
