import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config'
import type { VisionResult } from '../types'

const client = new Anthropic({ apiKey: config.anthropic.apiKey })

const VISION_PROMPT = `Analyze this fashion product image. Extract the following attributes as JSON.
Return ONLY valid JSON, no other text.

{
  "category": "gamis" | "hijab" | "abaya" | "mukena" | "khimar" | "outer",
  "silhouette": "A-line" | "straight" | "mermaid" | "balloon" | "loose" | "fitted",
  "color_primary": "#hex",
  "color_secondary": "#hex or null",
  "pattern": "solid" | "floral" | "geometric" | "polkadot" | "abstract" | "striped" | "plaid",
  "fabric": "satin" | "chiffon" | "cotton" | "jersey" | "voal" | "silk" | "polyester" | "linen",
  "sleeve_style": "long" | "3/4" | "bell" | "puff" | "raglan" | "none",
  "details": ["embroidery", "pearl", "ruffle", "pleats", "lace", "sequin", "bow", "button"],
  "occasion": "daily" | "formal" | "casual" | "party" | "office",
  "price_segment": "economy" | "mid" | "premium"
}`

export async function analyzeImage(imageUrl: string, retries = 2): Promise<VisionResult | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'url', url: imageUrl } },
              { type: 'text', text: VISION_PROMPT },
            ],
          },
        ],
      })

      const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
      if (!text) {
        console.error(JSON.stringify({ level: 'warn', msg: 'Empty vision response', imageUrl }))
        continue
      }

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error(JSON.stringify({ level: 'warn', msg: 'No JSON in vision response', text: text.slice(0, 200) }))
        continue
      }

      const parsed = JSON.parse(jsonMatch[0]) as VisionResult
      return parsed
    } catch (error) {
      const isRateLimit = error instanceof Anthropic.RateLimitError
      const isTimeout = error instanceof Error && error.message.includes('timeout')

      if (isRateLimit && attempt < retries) {
        const backoff = Math.pow(2, attempt + 1) * 1000
        console.log(JSON.stringify({ level: 'warn', msg: 'Rate limited, backing off', backoff }))
        await new Promise((r) => setTimeout(r, backoff))
        continue
      }

      console.error(JSON.stringify({
        level: 'error',
        msg: 'Vision analysis failed',
        imageUrl,
        attempt,
        error: error instanceof Error ? error.message : String(error),
        isRateLimit,
        isTimeout,
      }))

      if (attempt === retries) return null
    }
  }

  return null
}
