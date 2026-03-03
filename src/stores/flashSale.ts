'use client'

import { create } from 'zustand'

// Simplified product type for flash sales (matches UI needs)
export interface FlashProduct {
  id: string
  slug: string
  name: string
  description: string | null
  base_price: number
  sale_price: number | null
  images: string[]
  category_id: string
  brand_id: string
  rating: number
  review_count: number
  is_featured: boolean
  is_new: boolean
}

export interface FlashSaleProduct {
  id: string
  productId: string
  product: FlashProduct
  flashPrice: number
  originalPrice: number
  discount: number // percentage
  totalStock: number
  soldCount: number
  limitPerUser: number
}

export interface FlashSale {
  id: string
  name: string
  nameId: string
  description: string
  descriptionId: string
  startTime: Date
  endTime: Date
  bannerImage?: string
  bannerColor: string
  products: FlashSaleProduct[]
  isActive: boolean
}

export type FlashSaleStatus = 'upcoming' | 'active' | 'ended'

interface FlashSaleState {
  flashSales: FlashSale[]
  getActiveFlashSale: () => FlashSale | null
  getUpcomingFlashSales: () => FlashSale[]
  getEndedFlashSales: () => FlashSale[]
  getFlashSaleStatus: (sale: FlashSale) => FlashSaleStatus
  getFlashSaleById: (id: string) => FlashSale | undefined
  getRemainingStock: (product: FlashSaleProduct) => number
  getSoldPercentage: (product: FlashSaleProduct) => number
}

// Helper to create dates relative to now
const hoursFromNow = (hours: number) => {
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date
}

const hoursAgo = (hours: number) => {
  const date = new Date()
  date.setHours(date.getHours() - hours)
  return date
}

// Mock flash sale products
const mockFlashProducts: FlashSaleProduct[] = [
  {
    id: 'fp1',
    productId: 'prod-1',
    product: {
      id: 'prod-1',
      slug: 'oversized-cotton-tee-white',
      name: 'Oversized Cotton Tee',
      description: 'Premium cotton oversized t-shirt',
      base_price: 299000,
      sale_price: null,
      images: ['/products/tee-white.jpg'],
      category_id: 'tops',
      brand_id: 'uc',
      rating: 4.8,
      review_count: 245,
      is_featured: true,
      is_new: false,
    },
    flashPrice: 149000,
    originalPrice: 299000,
    discount: 50,
    totalStock: 100,
    soldCount: 78,
    limitPerUser: 2,
  },
  {
    id: 'fp2',
    productId: 'prod-2',
    product: {
      id: 'prod-2',
      slug: 'high-waist-wide-leg-jeans',
      name: 'High Waist Wide Leg Jeans',
      description: 'Trendy wide leg denim jeans',
      base_price: 459000,
      sale_price: null,
      images: ['/products/jeans-wide.jpg'],
      category_id: 'bottoms',
      brand_id: 'uc',
      rating: 4.6,
      review_count: 189,
      is_featured: true,
      is_new: false,
    },
    flashPrice: 229000,
    originalPrice: 459000,
    discount: 50,
    totalStock: 50,
    soldCount: 42,
    limitPerUser: 1,
  },
  {
    id: 'fp3',
    productId: 'prod-3',
    product: {
      id: 'prod-3',
      slug: 'floral-midi-dress',
      name: 'Floral Midi Dress',
      description: 'Beautiful floral print midi dress',
      base_price: 399000,
      sale_price: null,
      images: ['/products/dress-floral.jpg'],
      category_id: 'dresses',
      brand_id: 'uc',
      rating: 4.9,
      review_count: 312,
      is_featured: true,
      is_new: true,
    },
    flashPrice: 199000,
    originalPrice: 399000,
    discount: 50,
    totalStock: 80,
    soldCount: 65,
    limitPerUser: 2,
  },
  {
    id: 'fp4',
    productId: 'prod-4',
    product: {
      id: 'prod-4',
      slug: 'cropped-cardigan-beige',
      name: 'Cropped Cardigan',
      description: 'Soft knit cropped cardigan',
      base_price: 349000,
      sale_price: null,
      images: ['/products/cardigan-beige.jpg'],
      category_id: 'tops',
      brand_id: 'uc',
      rating: 4.7,
      review_count: 156,
      is_featured: false,
      is_new: true,
    },
    flashPrice: 174000,
    originalPrice: 349000,
    discount: 50,
    totalStock: 60,
    soldCount: 33,
    limitPerUser: 2,
  },
  {
    id: 'fp5',
    productId: 'prod-5',
    product: {
      id: 'prod-5',
      slug: 'pleated-mini-skirt',
      name: 'Pleated Mini Skirt',
      description: 'Classic pleated mini skirt',
      base_price: 279000,
      sale_price: null,
      images: ['/products/skirt-pleated.jpg'],
      category_id: 'bottoms',
      brand_id: 'uc',
      rating: 4.5,
      review_count: 98,
      is_featured: false,
      is_new: false,
    },
    flashPrice: 139000,
    originalPrice: 279000,
    discount: 50,
    totalStock: 40,
    soldCount: 28,
    limitPerUser: 2,
  },
  {
    id: 'fp6',
    productId: 'prod-6',
    product: {
      id: 'prod-6',
      slug: 'linen-blazer-cream',
      name: 'Linen Blazer',
      description: 'Lightweight linen summer blazer',
      base_price: 599000,
      sale_price: null,
      images: ['/products/blazer-cream.jpg'],
      category_id: 'outerwear',
      brand_id: 'uc',
      rating: 4.8,
      review_count: 87,
      is_featured: true,
      is_new: false,
    },
    flashPrice: 299000,
    originalPrice: 599000,
    discount: 50,
    totalStock: 30,
    soldCount: 24,
    limitPerUser: 1,
  },
]

// Mock upcoming sale products
const upcomingProducts: FlashSaleProduct[] = [
  {
    id: 'up1',
    productId: 'prod-7',
    product: {
      id: 'prod-7',
      slug: 'satin-slip-dress',
      name: 'Satin Slip Dress',
      description: 'Elegant satin slip dress',
      base_price: 449000,
      sale_price: null,
      images: ['/products/dress-satin.jpg'],
      category_id: 'dresses',
      brand_id: 'uc',
      rating: 4.9,
      review_count: 203,
      is_featured: true,
      is_new: false,
    },
    flashPrice: 179000,
    originalPrice: 449000,
    discount: 60,
    totalStock: 50,
    soldCount: 0,
    limitPerUser: 1,
  },
  {
    id: 'up2',
    productId: 'prod-8',
    product: {
      id: 'prod-8',
      slug: 'denim-jacket-vintage',
      name: 'Vintage Denim Jacket',
      description: 'Classic vintage wash denim jacket',
      base_price: 549000,
      sale_price: null,
      images: ['/products/jacket-denim.jpg'],
      category_id: 'outerwear',
      brand_id: 'uc',
      rating: 4.7,
      review_count: 167,
      is_featured: true,
      is_new: false,
    },
    flashPrice: 219000,
    originalPrice: 549000,
    discount: 60,
    totalStock: 40,
    soldCount: 0,
    limitPerUser: 1,
  },
]

// Mock flash sales data
const mockFlashSales: FlashSale[] = [
  {
    id: 'fs1',
    name: 'Mega Monday Sale',
    nameId: 'Promo Mega Senin',
    description: 'Up to 50% off on selected items!',
    descriptionId: 'Diskon hingga 50% untuk produk pilihan!',
    startTime: hoursAgo(2),
    endTime: hoursFromNow(4),
    bannerColor: 'from-red-500 to-orange-500',
    products: mockFlashProducts,
    isActive: true,
  },
  {
    id: 'fs2',
    name: 'Super Tuesday Flash',
    nameId: 'Flash Super Selasa',
    description: 'Up to 60% off - Limited stock!',
    descriptionId: 'Diskon hingga 60% - Stok terbatas!',
    startTime: hoursFromNow(6),
    endTime: hoursFromNow(12),
    bannerColor: 'from-purple-500 to-pink-500',
    products: upcomingProducts,
    isActive: true,
  },
  {
    id: 'fs3',
    name: 'Weekend Warriors',
    nameId: 'Promo Akhir Pekan',
    description: 'Best weekend deals!',
    descriptionId: 'Penawaran terbaik akhir pekan!',
    startTime: hoursFromNow(48),
    endTime: hoursFromNow(72),
    bannerColor: 'from-blue-500 to-cyan-500',
    products: mockFlashProducts.slice(0, 4),
    isActive: true,
  },
]

export const useFlashSaleStore = create<FlashSaleState>((set, get) => ({
  flashSales: mockFlashSales,

  getFlashSaleStatus: (sale: FlashSale): FlashSaleStatus => {
    const now = new Date()
    if (now < new Date(sale.startTime)) return 'upcoming'
    if (now > new Date(sale.endTime)) return 'ended'
    return 'active'
  },

  getActiveFlashSale: () => {
    const { flashSales, getFlashSaleStatus } = get()
    return flashSales.find((sale) => getFlashSaleStatus(sale) === 'active') || null
  },

  getUpcomingFlashSales: () => {
    const { flashSales, getFlashSaleStatus } = get()
    return flashSales
      .filter((sale) => getFlashSaleStatus(sale) === 'upcoming')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  },

  getEndedFlashSales: () => {
    const { flashSales, getFlashSaleStatus } = get()
    return flashSales
      .filter((sale) => getFlashSaleStatus(sale) === 'ended')
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
  },

  getFlashSaleById: (id: string) => {
    return get().flashSales.find((sale) => sale.id === id)
  },

  getRemainingStock: (product: FlashSaleProduct) => {
    return product.totalStock - product.soldCount
  },

  getSoldPercentage: (product: FlashSaleProduct) => {
    return Math.round((product.soldCount / product.totalStock) * 100)
  },
}))

// Utility function for formatting time
export function formatTimeUnit(value: number): string {
  return value.toString().padStart(2, '0')
}

// Calculate time remaining
export function getTimeRemaining(endTime: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const total = new Date(endTime).getTime() - new Date().getTime()

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  }
}

// Calculate time until start
export function getTimeUntilStart(startTime: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  return getTimeRemaining(startTime)
}
