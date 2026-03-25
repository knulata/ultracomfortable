import { ApifyClient } from 'apify-client'
import { config } from '../config'
import { normalizeItems } from './normalizer'
import type { RawScraperItem, TrendItemRow } from '../types'

const client = new ApifyClient({ token: config.apify.token })

const SHOPEE_SEARCH_TERMS = [
  'gamis terbaru',
  'hijab trending',
  'abaya modern',
  'mukena premium',
  'khimar syari',
  'busana muslim wanita',
]

export async function scrapeShopee(): Promise<TrendItemRow[]> {
  const allItems: RawScraperItem[] = []

  for (const searchTerm of SHOPEE_SEARCH_TERMS) {
    try {
      console.log(JSON.stringify({ level: 'info', msg: 'Scraping Shopee', term: searchTerm }))

      const run = await client.actor('apify/shopee-scraper').call(
        {
          search: searchTerm,
          country: 'id',
          maxItems: 50,
          sort: 'relevancy',
        },
        { waitForFinishSecs: 300 }
      )

      const { items } = await client.dataset(run.defaultDatasetId).listItems()

      for (const item of items) {
        const shopeeItem = item as Record<string, unknown>
        allItems.push({
          external_id: String(shopeeItem.itemid ?? shopeeItem.shopid ?? ''),
          image_url: String(shopeeItem.image ?? shopeeItem.images?.[0] ?? ''),
          title: String(shopeeItem.name ?? ''),
          price: Number(shopeeItem.price ?? 0) / 100000, // Shopee prices are in micro-units
          units_sold: Number(shopeeItem.historical_sold ?? shopeeItem.sold ?? 0),
          rating: Number(shopeeItem.item_rating?.rating_star ?? 0),
          platform: 'shopee',
        })
      }

      console.log(JSON.stringify({
        level: 'info',
        msg: 'Shopee scrape complete',
        term: searchTerm,
        count: items.length,
      }))
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Shopee scrape failed',
        term: searchTerm,
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  return normalizeItems(allItems)
}
