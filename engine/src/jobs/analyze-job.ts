import { supabase } from '../db'
import { analyzeImage } from '../ai/vision'
import { generateEmbedding } from '../ai/embeddings'

const BATCH_SIZE = 20
const CONCURRENCY = 3

export async function runAnalyzeJob(): Promise<number> {
  // Fetch unprocessed items
  const { data: items, error } = await supabase
    .from('trend_items')
    .select('id, image_url')
    .eq('ai_processed', false)
    .order('scraped_at', { ascending: false })
    .limit(BATCH_SIZE)

  if (error || !items || items.length === 0) {
    console.log(JSON.stringify({ level: 'info', msg: 'No items to analyze' }))
    return 0
  }

  let processed = 0

  // Process in batches with concurrency limit
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)

    const results = await Promise.allSettled(
      batch.map(async (item) => {
        const [vision, embedding] = await Promise.all([
          analyzeImage(item.image_url),
          generateEmbedding(item.image_url),
        ])

        if (!vision) {
          console.log(JSON.stringify({ level: 'warn', msg: 'Vision failed, marking processed', itemId: item.id }))
        }

        const updateData: Record<string, unknown> = {
          ai_processed: true,
          ai_processed_at: new Date().toISOString(),
        }

        if (vision) {
          Object.assign(updateData, {
            category: vision.category,
            silhouette: vision.silhouette,
            color_primary: vision.color_primary,
            color_secondary: vision.color_secondary,
            pattern: vision.pattern,
            fabric: vision.fabric,
            sleeve_style: vision.sleeve_style,
            details: vision.details,
            occasion: vision.occasion,
            price_segment: vision.price_segment,
          })
        }

        if (embedding) {
          updateData.embedding = embedding
        }

        const { error: updateError } = await supabase
          .from('trend_items')
          .update(updateData)
          .eq('id', item.id)

        if (updateError) {
          throw new Error(`Update failed for ${item.id}: ${updateError.message}`)
        }

        return item.id
      })
    )

    for (const result of results) {
      if (result.status === 'fulfilled') processed++
      else {
        console.error(JSON.stringify({ level: 'error', msg: 'Item analysis failed', error: result.reason }))
      }
    }

    // Brief pause between batches to respect rate limits
    if (i + CONCURRENCY < items.length) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  console.log(JSON.stringify({ level: 'info', msg: 'Analysis batch complete', processed, total: items.length }))
  return processed
}
