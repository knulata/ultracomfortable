'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentlyViewedProduct {
  id: string
  slug: string
  name: string
  nameId?: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  rating?: number
  reviewCount?: number
  viewedAt: number // timestamp
}

interface RecentlyViewedState {
  products: RecentlyViewedProduct[]
  maxItems: number

  // Actions
  addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void
  removeProduct: (productId: string) => void
  clearHistory: () => void

  // Getters
  getRecentProducts: (limit?: number) => RecentlyViewedProduct[]
  hasViewedProduct: (productId: string) => boolean
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      products: [],
      maxItems: 20,

      addProduct: (product) => {
        const { products, maxItems } = get()

        // Remove if already exists (will re-add at front)
        const filtered = products.filter((p) => p.id !== product.id)

        // Add to front with timestamp
        const newProduct: RecentlyViewedProduct = {
          ...product,
          viewedAt: Date.now(),
        }

        // Keep only maxItems
        const updated = [newProduct, ...filtered].slice(0, maxItems)

        set({ products: updated })
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }))
      },

      clearHistory: () => {
        set({ products: [] })
      },

      getRecentProducts: (limit = 10) => {
        const { products } = get()
        return products.slice(0, limit)
      },

      hasViewedProduct: (productId) => {
        return get().products.some((p) => p.id === productId)
      },
    }),
    {
      name: 'alyanoor-recently-viewed',
      partialize: (state) => ({ products: state.products }),
    }
  )
)

// Helper to format "viewed X ago"
export function formatViewedTime(timestamp: number, language: 'en' | 'id' = 'en'): string {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return language === 'id' ? 'Baru saja' : 'Just now'
  }

  if (minutes < 60) {
    return language === 'id'
      ? `${minutes} menit lalu`
      : `${minutes}m ago`
  }

  if (hours < 24) {
    return language === 'id'
      ? `${hours} jam lalu`
      : `${hours}h ago`
  }

  if (days < 7) {
    return language === 'id'
      ? `${days} hari lalu`
      : `${days}d ago`
  }

  return language === 'id'
    ? `${Math.floor(days / 7)} minggu lalu`
    : `${Math.floor(days / 7)}w ago`
}
