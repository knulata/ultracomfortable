// Meilisearch client for product search
// When MEILISEARCH_HOST is configured, uses Meilisearch
// Otherwise falls back to local filtering

interface SearchOptions {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  offset?: number
}

interface SearchResult {
  id: string
  slug: string
  name: string
  description: string
  price: number
  originalPrice: number | null
  category: string
  sizes: string[]
  colors: string[]
  rating: number
  reviewCount: number
  soldCount: number
  inStock: boolean
}

interface SearchResponse {
  hits: SearchResult[]
  totalHits: number
  processingTimeMs: number
  query: string
}

const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || ''
const MEILISEARCH_KEY = process.env.NEXT_PUBLIC_MEILISEARCH_KEY || ''

export async function searchProducts(options: SearchOptions): Promise<SearchResponse> {
  const { query, category, minPrice, maxPrice, limit = 20, offset = 0 } = options

  // If Meilisearch is configured, use it
  if (MEILISEARCH_HOST) {
    try {
      const filters: string[] = []

      if (category) {
        filters.push(`category = "${category}"`)
      }
      if (minPrice !== undefined) {
        filters.push(`price >= ${minPrice}`)
      }
      if (maxPrice !== undefined) {
        filters.push(`price <= ${maxPrice}`)
      }

      const response = await fetch(`${MEILISEARCH_HOST}/indexes/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MEILISEARCH_KEY}`,
        },
        body: JSON.stringify({
          q: query,
          filter: filters.length > 0 ? filters.join(' AND ') : undefined,
          limit,
          offset,
          attributesToHighlight: ['name', 'description'],
        }),
      })

      if (!response.ok) {
        throw new Error('Meilisearch request failed')
      }

      const data = await response.json()

      return {
        hits: data.hits,
        totalHits: data.estimatedTotalHits || data.hits.length,
        processingTimeMs: data.processingTimeMs,
        query,
      }
    } catch (error) {
      console.error('Meilisearch error, falling back to local search:', error)
      // Fall through to local search
    }
  }

  // Fallback: fetch from local API and filter
  const params = new URLSearchParams()
  if (query) params.set('search', query)
  if (category) params.set('category', category)
  if (minPrice !== undefined) params.set('minPrice', String(minPrice))
  if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice))
  params.set('limit', String(limit))
  params.set('offset', String(offset))

  const startTime = performance.now()
  const response = await fetch(`/api/products?${params.toString()}`)
  const data = await response.json()
  const endTime = performance.now()

  return {
    hits: data.data?.products || [],
    totalHits: data.data?.pagination?.total || 0,
    processingTimeMs: Math.round(endTime - startTime),
    query,
  }
}

// Search suggestions (autocomplete)
export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 2) return []

  // Popular search terms for modest fashion
  const popularTerms = [
    'hijab voal', 'hijab segi empat', 'hijab instan', 'pashmina',
    'gamis daily', 'gamis syari', 'gamis set', 'abaya',
    'khimar pet', 'khimar ceruti', 'khimar jumbo',
    'mukena travel', 'mukena katun', 'mukena anak',
    'bergo', 'inner hijab', 'ciput', 'niqab',
    'kaftan', 'tunik', 'outer', 'cardigan',
  ]

  const lowerQuery = query.toLowerCase()
  return popularTerms
    .filter(term => term.includes(lowerQuery))
    .slice(0, 5)
}

// Trending searches
export function getTrendingSearches(): string[] {
  return [
    'Hijab Voal Premium',
    'Gamis Set Khimar',
    'Mukena Travel',
    'Abaya Arabian',
    'Khimar Pet Ceruti',
  ]
}
