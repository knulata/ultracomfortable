'use client'

import { create } from 'zustand'

export interface RecommendedProduct {
  id: string
  slug: string
  name: string
  nameId: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  rating: number
  reviewCount: number
  soldCount: number
  isNew?: boolean
}

export type RecommendationType =
  | 'similar'           // Similar products (same category/style)
  | 'also_bought'       // Customers also bought
  | 'also_viewed'       // Customers also viewed
  | 'trending'          // Trending in category
  | 'personalized'      // Based on user history

interface RecommendationsState {
  // Cache for recommendations by product ID
  productRecommendations: Record<string, {
    similar: RecommendedProduct[]
    alsoBought: RecommendedProduct[]
    alsoViewed: RecommendedProduct[]
  }>

  // Actions
  getRecommendations: (productId: string, type: RecommendationType, category?: string) => RecommendedProduct[]
  getSimilarProducts: (productId: string, category: string) => RecommendedProduct[]
  getAlsoBoughtProducts: (productId: string) => RecommendedProduct[]
  getTrendingInCategory: (category: string) => RecommendedProduct[]
  getPersonalizedPicks: () => RecommendedProduct[]
}

// Mock product data for recommendations
const mockProducts: RecommendedProduct[] = [
  {
    id: 'rec-1',
    slug: 'relaxed-fit-cotton-tee',
    name: 'Relaxed Fit Cotton Tee',
    nameId: 'Kaos Katun Relaxed Fit',
    price: 179000,
    originalPrice: 229000,
    category: 'tops',
    rating: 4.6,
    reviewCount: 189,
    soldCount: 892,
    isNew: false,
  },
  {
    id: 'rec-2',
    slug: 'vintage-wash-tshirt',
    name: 'Vintage Wash T-Shirt',
    nameId: 'Kaos Vintage Wash',
    price: 199000,
    category: 'tops',
    rating: 4.8,
    reviewCount: 234,
    soldCount: 1250,
    isNew: true,
  },
  {
    id: 'rec-3',
    slug: 'cropped-boxy-tee',
    name: 'Cropped Boxy Tee',
    nameId: 'Kaos Boxy Crop',
    price: 159000,
    originalPrice: 199000,
    category: 'tops',
    rating: 4.5,
    reviewCount: 156,
    soldCount: 678,
    isNew: false,
  },
  {
    id: 'rec-4',
    slug: 'high-waist-straight-jeans',
    name: 'High Waist Straight Jeans',
    nameId: 'Jeans Lurus High Waist',
    price: 399000,
    originalPrice: 499000,
    category: 'bottoms',
    rating: 4.7,
    reviewCount: 312,
    soldCount: 2100,
    isNew: false,
  },
  {
    id: 'rec-5',
    slug: 'wide-leg-palazzo-pants',
    name: 'Wide Leg Palazzo Pants',
    nameId: 'Celana Palazzo Wide Leg',
    price: 349000,
    category: 'bottoms',
    rating: 4.4,
    reviewCount: 98,
    soldCount: 430,
    isNew: true,
  },
  {
    id: 'rec-6',
    slug: 'pleated-midi-skirt',
    name: 'Pleated Midi Skirt',
    nameId: 'Rok Midi Lipit',
    price: 279000,
    category: 'bottoms',
    rating: 4.6,
    reviewCount: 167,
    soldCount: 789,
    isNew: false,
  },
  {
    id: 'rec-7',
    slug: 'floral-wrap-dress',
    name: 'Floral Wrap Dress',
    nameId: 'Dress Wrap Bunga',
    price: 449000,
    originalPrice: 549000,
    category: 'dresses',
    rating: 4.9,
    reviewCount: 203,
    soldCount: 567,
    isNew: false,
  },
  {
    id: 'rec-8',
    slug: 'linen-midi-dress',
    name: 'Linen Midi Dress',
    nameId: 'Dress Midi Linen',
    price: 399000,
    category: 'dresses',
    rating: 4.7,
    reviewCount: 145,
    soldCount: 456,
    isNew: true,
  },
  {
    id: 'rec-9',
    slug: 'chunky-knit-cardigan',
    name: 'Chunky Knit Cardigan',
    nameId: 'Kardigan Rajut Tebal',
    price: 449000,
    originalPrice: 549000,
    category: 'outerwear',
    rating: 4.8,
    reviewCount: 189,
    soldCount: 890,
    isNew: false,
  },
  {
    id: 'rec-10',
    slug: 'cropped-denim-jacket',
    name: 'Cropped Denim Jacket',
    nameId: 'Jaket Denim Crop',
    price: 499000,
    category: 'outerwear',
    rating: 4.6,
    reviewCount: 123,
    soldCount: 345,
    isNew: true,
  },
  {
    id: 'rec-11',
    slug: 'minimal-canvas-tote',
    name: 'Minimal Canvas Tote',
    nameId: 'Tote Bag Kanvas Minimal',
    price: 199000,
    category: 'accessories',
    rating: 4.5,
    reviewCount: 87,
    soldCount: 234,
    isNew: false,
  },
  {
    id: 'rec-12',
    slug: 'gold-hoop-earrings',
    name: 'Gold Hoop Earrings',
    nameId: 'Anting Hoop Emas',
    price: 149000,
    category: 'accessories',
    rating: 4.7,
    reviewCount: 156,
    soldCount: 567,
    isNew: false,
  },
]

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const useRecommendationsStore = create<RecommendationsState>()((set, get) => ({
  productRecommendations: {},

  getRecommendations: (productId, type, category) => {
    switch (type) {
      case 'similar':
        return get().getSimilarProducts(productId, category || 'tops')
      case 'also_bought':
        return get().getAlsoBoughtProducts(productId)
      case 'trending':
        return get().getTrendingInCategory(category || 'tops')
      case 'personalized':
        return get().getPersonalizedPicks()
      default:
        return shuffleArray(mockProducts).slice(0, 6)
    }
  },

  getSimilarProducts: (productId, category) => {
    // Filter by same category, exclude current product
    const similar = mockProducts
      .filter((p) => p.category === category && p.id !== productId)
      .slice(0, 6)

    // If not enough in same category, add from other categories
    if (similar.length < 6) {
      const others = mockProducts
        .filter((p) => p.category !== category && p.id !== productId)
        .slice(0, 6 - similar.length)
      return [...similar, ...others]
    }

    return similar
  },

  getAlsoBoughtProducts: (productId) => {
    // Simulate "frequently bought together" - return products from different categories
    return shuffleArray(mockProducts)
      .filter((p) => p.id !== productId)
      .slice(0, 4)
  },

  getTrendingInCategory: (category) => {
    // Return products sorted by sold count
    return mockProducts
      .filter((p) => p.category === category)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 6)
  },

  getPersonalizedPicks: () => {
    // In real app, this would use user's browsing/purchase history
    // For now, return mix of high-rated and new products
    return shuffleArray(mockProducts)
      .sort((a, b) => {
        // Prioritize new items and high ratings
        const aScore = (a.isNew ? 1 : 0) + a.rating
        const bScore = (b.isNew ? 1 : 0) + b.rating
        return bScore - aScore
      })
      .slice(0, 8)
  },
}))
