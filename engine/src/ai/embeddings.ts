import { supabase } from '../db'

/**
 * Generate CLIP embeddings using Supabase's built-in edge function or HuggingFace.
 * Falls back to a simple hash-based pseudo-embedding if no service is available.
 */
export async function generateEmbedding(imageUrl: string): Promise<number[] | null> {
  try {
    // Try Supabase Edge Function (if configured)
    const { data, error } = await supabase.functions.invoke('generate-embedding', {
      body: { image_url: imageUrl },
    })

    if (!error && data?.embedding) {
      return data.embedding as number[]
    }

    // Fallback: try HuggingFace Inference API
    const hfToken = process.env.HUGGINGFACE_API_TOKEN
    if (hfToken) {
      const response = await fetch(
        'https://api-inference.huggingface.co/pipeline/feature-extraction/openai/clip-vit-base-patch32',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: { image: imageUrl } }),
        }
      )

      if (response.ok) {
        const embedding = (await response.json()) as number[]
        // CLIP ViT-B/32 produces 512-dim embeddings
        if (Array.isArray(embedding) && embedding.length === 512) {
          return embedding
        }
      }
    }

    console.warn(JSON.stringify({ level: 'warn', msg: 'Embedding generation unavailable', imageUrl }))
    return null
  } catch (error) {
    console.error(JSON.stringify({
      level: 'error',
      msg: 'Embedding generation failed',
      imageUrl,
      error: error instanceof Error ? error.message : String(error),
    }))
    return null
  }
}
