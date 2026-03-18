import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  nameId?: string
  price: number
  originalPrice?: number
  image: string
  slug: string
  addedAt: Date
  // Price tracking fields
  priceWhenAdded: number
  lowestPrice: number
  priceHistory: { price: number; date: string }[]
  priceAlertEnabled: boolean
}

export interface PriceDropInfo {
  hasPriceDrop: boolean
  currentPrice: number
  priceWhenAdded: number
  lowestPrice: number
  savingsFromAdded: number
  savingsPercent: number
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt' | 'priceWhenAdded' | 'lowestPrice' | 'priceHistory' | 'priceAlertEnabled'>) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getItemCount: () => number

  // Price alert methods
  updateItemPrice: (id: string, newPrice: number) => void
  togglePriceAlert: (id: string) => void
  getPriceDropInfo: (id: string) => PriceDropInfo | null
  getItemsWithPriceDrops: () => WishlistItem[]
  getPriceDropCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        if (!exists) {
          const now = new Date()
          set((state) => ({
            items: [...state.items, {
              ...item,
              addedAt: now,
              priceWhenAdded: item.price,
              lowestPrice: item.price,
              priceHistory: [{ price: item.price, date: now.toISOString() }],
              priceAlertEnabled: true, // Enable by default
            }],
          }))
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.length
      },

      updateItemPrice: (id, newPrice) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item

            const now = new Date().toISOString()
            const newLowest = Math.min(item.lowestPrice, newPrice)

            return {
              ...item,
              price: newPrice,
              lowestPrice: newLowest,
              priceHistory: [
                ...item.priceHistory.slice(-9), // Keep last 10 entries
                { price: newPrice, date: now },
              ],
            }
          }),
        }))
      },

      togglePriceAlert: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, priceAlertEnabled: !item.priceAlertEnabled }
              : item
          ),
        }))
      },

      getPriceDropInfo: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (!item) return null

        const hasPriceDrop = item.price < item.priceWhenAdded
        const savingsFromAdded = item.priceWhenAdded - item.price
        const savingsPercent = hasPriceDrop
          ? Math.round((savingsFromAdded / item.priceWhenAdded) * 100)
          : 0

        return {
          hasPriceDrop,
          currentPrice: item.price,
          priceWhenAdded: item.priceWhenAdded,
          lowestPrice: item.lowestPrice,
          savingsFromAdded: Math.max(0, savingsFromAdded),
          savingsPercent,
        }
      },

      getItemsWithPriceDrops: () => {
        return get().items.filter((item) => item.price < item.priceWhenAdded)
      },

      getPriceDropCount: () => {
        return get().items.filter((item) => item.price < item.priceWhenAdded).length
      },
    }),
    {
      name: 'alyanoor-wishlist',
    }
  )
)
