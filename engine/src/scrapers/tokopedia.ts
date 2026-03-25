import { ApifyClient } from 'apify-client'
import { config } from '../config'
import { normalizeItems } from './normalizer'
import type { RawScraperItem, TrendItemRow } from '../types'

const client = new ApifyClient({ token: config.apify.token })

const SEARCH_TERMS = ['gamis wanita terbaru', 'hijab premium', 'busana muslim trending']

export async function scrapeTokopedia(): Promise<TrendItemRow[]> {
  const allItems: RawScraperItem[] = []

  for (const term of SEARCH_TERMS) {
    try {
      console.log(JSON.stringify({ level: 'info', msg: 'Scraping Tokopedia', term }))

      const run = await client.actor('jupri/tokopedia-scraper').call(
        { search: term, maxItems: 50 },
        { waitForFinishSecs: 300 }
      )

      const { items } = await client.dataset(run.defaultDatasetId).listItems()

      for (const item of items) {
        const product = item as Record<string, unknown>
        allItems.push({
          external_id: String(product.id ?? product.url ?? ''),
          image_url: String(product.imageUrl ?? product.image ?? ''),
          title: String(product.name ?? product.title ?? ''),
          price: Number(product.price ?? 0),
          units_sold: Number(product.sold ?? product.countSold ?? 0),
          rating: Number(product.rating ?? 0),
          platform: 'tokopedia',
        })
      }
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Tokopedia scrape failed',
        term,
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  return normalizeItems(allItems)
}
