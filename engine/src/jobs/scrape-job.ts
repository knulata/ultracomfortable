import { supabase } from '../db'
import { scrapeShopee } from '../scrapers/shopee'
import { scrapeInstagram } from '../scrapers/instagram'
import { scrapeTikTok } from '../scrapers/tiktok'
import { scrapeTokopedia } from '../scrapers/tokopedia'
import type { TrendItemRow, Platform } from '../types'

const scraperMap: Record<Platform, () => Promise<TrendItemRow[]>> = {
  shopee: scrapeShopee,
  instagram: scrapeInstagram,
  tiktok: scrapeTikTok,
  tokopedia: scrapeTokopedia,
}

export async function runScrapeJob(platforms: Platform[] = ['shopee']): Promise<number> {
  let totalInserted = 0

  for (const platform of platforms) {
    const scraper = scraperMap[platform]
    if (!scraper) continue

    try {
      console.log(JSON.stringify({ level: 'info', msg: 'Running scraper', platform }))
      const items = await scraper()

      if (items.length === 0) {
        console.log(JSON.stringify({ level: 'warn', msg: 'Scraper returned 0 items', platform }))
        continue
      }

      // Upsert items (avoid duplicates by external_id)
      const { data, error } = await supabase
        .from('trend_items')
        .upsert(
          items.map((item) => ({
            ...item,
            created_at: new Date().toISOString(),
          })),
          { onConflict: 'platform,external_id', ignoreDuplicates: true }
        )
        .select('id')

      if (error) {
        console.error(JSON.stringify({ level: 'error', msg: 'Insert failed', platform, error: error.message }))
        continue
      }

      const inserted = data?.length ?? 0
      totalInserted += inserted

      console.log(JSON.stringify({
        level: 'info',
        msg: 'Scrape complete',
        platform,
        scraped: items.length,
        inserted,
      }))
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Scraper crashed',
        platform,
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  return totalInserted
}
