import { ApifyClient } from 'apify-client'
import { config } from '../config'
import { normalizeItems } from './normalizer'
import type { RawScraperItem, TrendItemRow } from '../types'

const client = new ApifyClient({ token: config.apify.token })

const HASHTAGS = [
  'ootdindonesia',
  'hijabootd',
  'gamisterbaru',
  'fashiontanabang',
  'hijabstyle',
  'busanamuslim',
]

export async function scrapeInstagram(): Promise<TrendItemRow[]> {
  const allItems: RawScraperItem[] = []

  for (const hashtag of HASHTAGS) {
    try {
      console.log(JSON.stringify({ level: 'info', msg: 'Scraping Instagram', hashtag }))

      const run = await client.actor('apify/instagram-hashtag-scraper').call(
        { hashtags: [hashtag], resultsLimit: 30 },
        { waitForFinishSecs: 300 }
      )

      const { items } = await client.dataset(run.defaultDatasetId).listItems()

      for (const item of items) {
        const post = item as Record<string, unknown>
        allItems.push({
          external_id: String(post.id ?? post.shortCode ?? ''),
          image_url: String(post.displayUrl ?? post.thumbnailUrl ?? ''),
          caption: String(post.caption ?? ''),
          likes: Number(post.likesCount ?? 0),
          comments: Number(post.commentsCount ?? 0),
          hashtags: (post.hashtags as string[]) ?? [],
          platform: 'instagram',
        })
      }
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Instagram scrape failed',
        hashtag,
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  return normalizeItems(allItems)
}
