import { ApifyClient } from 'apify-client'
import { config } from '../config'
import { normalizeItems } from './normalizer'
import type { RawScraperItem, TrendItemRow } from '../types'

const client = new ApifyClient({ token: config.apify.token })

const SEARCH_TERMS = ['hijab trend 2026', 'gamis terbaru', 'fashion muslim']

export async function scrapeTikTok(): Promise<TrendItemRow[]> {
  const allItems: RawScraperItem[] = []

  for (const term of SEARCH_TERMS) {
    try {
      console.log(JSON.stringify({ level: 'info', msg: 'Scraping TikTok', term }))

      const run = await client.actor('clockworks/tiktok-scraper').call(
        { searchQueries: [term], resultsPerPage: 30 },
        { waitForFinishSecs: 300 }
      )

      const { items } = await client.dataset(run.defaultDatasetId).listItems()

      for (const item of items) {
        const video = item as Record<string, unknown>
        allItems.push({
          external_id: String(video.id ?? ''),
          image_url: String(video.videoMeta?.coverUrl ?? video.coverImageUrl ?? ''),
          caption: String(video.text ?? ''),
          views: Number(video.playCount ?? video.videoMeta?.playCount ?? 0),
          likes: Number(video.diggCount ?? video.videoMeta?.diggCount ?? 0),
          comments: Number(video.commentCount ?? 0),
          shares: Number(video.shareCount ?? 0),
          hashtags: (video.hashtags as Array<{ name: string }>)?.map((h) => h.name) ?? [],
          platform: 'tiktok',
        })
      }
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'TikTok scrape failed',
        term,
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  return normalizeItems(allItems)
}
