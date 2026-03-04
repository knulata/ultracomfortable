'use client'

import { create } from 'zustand'

export interface DailyDeal {
  id: string
  productId: string
  slug: string
  name: string
  nameId: string
  description: string
  descriptionId: string
  image: string
  originalPrice: number
  dealPrice: number
  discount: number
  category: string
  categoryId: string
  rating: number
  reviewCount: number
  totalStock: number
  soldCount: number
  limitPerUser: number
  isHero: boolean // Featured deal of the day
}

interface DailyDealsState {
  deals: DailyDeal[]
  lastRefreshed: Date

  // Getters
  getHeroDeal: () => DailyDeal | null
  getRegularDeals: () => DailyDeal[]
  getDealById: (id: string) => DailyDeal | undefined
  getRemainingStock: (deal: DailyDeal) => number
  getSoldPercentage: (deal: DailyDeal) => number
  getTimeUntilRefresh: () => { hours: number; minutes: number; seconds: number }
}

// Get end of current day (midnight)
function getEndOfDay(): Date {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay
}

// Mock daily deals - these would rotate each day in production
const mockDailyDeals: DailyDeal[] = [
  {
    id: 'dd-hero',
    productId: 'prod-dd-1',
    slug: 'premium-linen-blazer',
    name: 'Premium Linen Blazer',
    nameId: 'Blazer Linen Premium',
    description: 'Elegant summer blazer in breathable linen. Perfect for work or casual outings.',
    descriptionId: 'Blazer musim panas elegan dari linen breathable. Sempurna untuk kerja atau jalan-jalan.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
    originalPrice: 899000,
    dealPrice: 449000,
    discount: 50,
    category: 'Outerwear',
    categoryId: 'Jaket',
    rating: 4.9,
    reviewCount: 234,
    totalStock: 50,
    soldCount: 31,
    limitPerUser: 1,
    isHero: true,
  },
  {
    id: 'dd-1',
    productId: 'prod-dd-2',
    slug: 'relaxed-cotton-pants',
    name: 'Relaxed Cotton Pants',
    nameId: 'Celana Katun Relaxed',
    description: 'Comfortable everyday pants',
    descriptionId: 'Celana nyaman untuk sehari-hari',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    originalPrice: 399000,
    dealPrice: 199000,
    discount: 50,
    category: 'Bottoms',
    categoryId: 'Bawahan',
    rating: 4.7,
    reviewCount: 156,
    totalStock: 80,
    soldCount: 52,
    limitPerUser: 2,
    isHero: false,
  },
  {
    id: 'dd-2',
    productId: 'prod-dd-3',
    slug: 'flowy-midi-skirt',
    name: 'Flowy Midi Skirt',
    nameId: 'Rok Midi Flowy',
    description: 'Elegant flowing midi skirt',
    descriptionId: 'Rok midi elegan dan mengalir',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=400',
    originalPrice: 349000,
    dealPrice: 174000,
    discount: 50,
    category: 'Bottoms',
    categoryId: 'Bawahan',
    rating: 4.6,
    reviewCount: 98,
    totalStock: 60,
    soldCount: 38,
    limitPerUser: 2,
    isHero: false,
  },
  {
    id: 'dd-3',
    productId: 'prod-dd-4',
    slug: 'cropped-knit-cardigan',
    name: 'Cropped Knit Cardigan',
    nameId: 'Kardigan Rajut Crop',
    description: 'Soft and cozy cropped cardigan',
    descriptionId: 'Kardigan crop lembut dan nyaman',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    originalPrice: 449000,
    dealPrice: 224000,
    discount: 50,
    category: 'Tops',
    categoryId: 'Atasan',
    rating: 4.8,
    reviewCount: 187,
    totalStock: 45,
    soldCount: 29,
    limitPerUser: 2,
    isHero: false,
  },
  {
    id: 'dd-4',
    productId: 'prod-dd-5',
    slug: 'oversized-denim-jacket',
    name: 'Oversized Denim Jacket',
    nameId: 'Jaket Denim Oversized',
    description: 'Classic denim in trendy oversized fit',
    descriptionId: 'Denim klasik dengan potongan oversized',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400',
    originalPrice: 599000,
    dealPrice: 299000,
    discount: 50,
    category: 'Outerwear',
    categoryId: 'Jaket',
    rating: 4.7,
    reviewCount: 143,
    totalStock: 35,
    soldCount: 22,
    limitPerUser: 1,
    isHero: false,
  },
  {
    id: 'dd-5',
    productId: 'prod-dd-6',
    slug: 'satin-wrap-blouse',
    name: 'Satin Wrap Blouse',
    nameId: 'Blouse Wrap Satin',
    description: 'Luxurious satin wrap top',
    descriptionId: 'Atasan wrap satin mewah',
    image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400',
    originalPrice: 379000,
    dealPrice: 189000,
    discount: 50,
    category: 'Tops',
    categoryId: 'Atasan',
    rating: 4.5,
    reviewCount: 76,
    totalStock: 55,
    soldCount: 41,
    limitPerUser: 2,
    isHero: false,
  },
]

export const useDailyDealsStore = create<DailyDealsState>((set, get) => ({
  deals: mockDailyDeals,
  lastRefreshed: new Date(),

  getHeroDeal: () => {
    return get().deals.find((d) => d.isHero) || null
  },

  getRegularDeals: () => {
    return get().deals.filter((d) => !d.isHero)
  },

  getDealById: (id: string) => {
    return get().deals.find((d) => d.id === id)
  },

  getRemainingStock: (deal: DailyDeal) => {
    return deal.totalStock - deal.soldCount
  },

  getSoldPercentage: (deal: DailyDeal) => {
    return Math.round((deal.soldCount / deal.totalStock) * 100)
  },

  getTimeUntilRefresh: () => {
    const now = new Date()
    const endOfDay = getEndOfDay()
    const diff = endOfDay.getTime() - now.getTime()

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  },
}))

// Utility to format time
export function formatDealTime(value: number): string {
  return value.toString().padStart(2, '0')
}
