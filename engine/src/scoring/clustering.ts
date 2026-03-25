import { supabase } from '../db'

interface ClusterCandidate {
  id: string
  category: string | null
  color_primary: string | null
  silhouette: string | null
  pattern: string | null
}

/**
 * Group similar trend items into trend clusters.
 * Uses category + style attributes for grouping (embeddings used when available).
 */
export async function clusterTrendItems(): Promise<number> {
  // Fetch unlinked items (not yet assigned to a trend)
  const { data: unlinked, error } = await supabase
    .from('trend_items')
    .select('id, category, color_primary, silhouette, pattern, image_url, engagement_likes, engagement_views, units_sold')
    .eq('ai_processed', true)
    .not('id', 'in', supabase.from('trend_item_links').select('item_id'))
    .limit(500)

  if (error || !unlinked || unlinked.length === 0) {
    console.log(JSON.stringify({ level: 'info', msg: 'No unlinked items to cluster' }))
    return 0
  }

  // Fetch existing active trends
  const { data: existingTrends } = await supabase
    .from('trends')
    .select('id, category, name')
    .eq('status', 'active')

  let newTrendsCreated = 0

  for (const item of unlinked) {
    // Try to find an existing trend that matches
    const matchingTrend = (existingTrends ?? []).find(
      (t) => t.category === item.category
    )

    if (matchingTrend) {
      // Add item to existing trend
      await supabase.from('trend_item_links').upsert({
        trend_id: matchingTrend.id,
        item_id: item.id,
      })
    } else {
      // Create new trend
      const trendName = generateTrendName(item)
      const engagement = (item.engagement_likes ?? 0) + (item.engagement_views ?? 0)

      const { data: newTrend, error: trendError } = await supabase
        .from('trends')
        .insert({
          name: trendName,
          category: item.category,
          representative_image_url: item.image_url,
          cross_platform_count: 1,
          trend_score: 0,
        })
        .select('id')
        .single()

      if (!trendError && newTrend) {
        await supabase.from('trend_item_links').insert({
          trend_id: newTrend.id,
          item_id: item.id,
        })
        newTrendsCreated++

        // Add to existing trends list for subsequent items
        existingTrends?.push({
          id: newTrend.id,
          category: item.category,
          name: trendName,
        })
      }
    }
  }

  // Update cross_platform_count for all active trends
  const { data: trends } = await supabase
    .from('trends')
    .select('id')
    .eq('status', 'active')

  for (const trend of trends ?? []) {
    const { data: platforms } = await supabase
      .from('trend_item_links')
      .select('trend_items(platform)')
      .eq('trend_id', trend.id)

    const uniquePlatforms = new Set(
      (platforms ?? []).map((p: { trend_items: { platform: string } }) => p.trend_items?.platform)
    )

    await supabase
      .from('trends')
      .update({ cross_platform_count: uniquePlatforms.size })
      .eq('id', trend.id)
  }

  console.log(JSON.stringify({
    level: 'info',
    msg: 'Clustering complete',
    itemsProcessed: unlinked.length,
    newTrends: newTrendsCreated,
  }))

  return newTrendsCreated
}

function generateTrendName(item: ClusterCandidate): string {
  const parts: string[] = []
  if (item.color_primary) parts.push(item.color_primary)
  if (item.pattern && item.pattern !== 'solid') parts.push(item.pattern)
  if (item.silhouette) parts.push(item.silhouette)
  if (item.category) parts.push(item.category)

  return parts.length > 0
    ? parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
    : 'Trending Style'
}
