import type { RawScraperItem, TrendItemRow } from '../types'

export function normalizeItems(items: RawScraperItem[]): TrendItemRow[] {
  const seen = new Set<string>()

  return items
    .filter((item) => {
      if (!item.image_url || !item.external_id) return false
      const key = `${item.platform}:${item.external_id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((item) => ({
      platform: item.platform,
      external_id: item.external_id,
      image_url: item.image_url,
      engagement_likes: item.likes ?? 0,
      engagement_comments: item.comments ?? 0,
      engagement_shares: item.shares ?? 0,
      engagement_views: item.views ?? 0,
      units_sold: item.units_sold,
      price: item.price,
      caption: item.caption ?? item.title,
      hashtags: item.hashtags ?? [],
      scraped_at: new Date().toISOString(),
      ai_processed: false,
    }))
}
