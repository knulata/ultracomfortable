import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductVariant, Product } from '@/types/database'

export interface CartItemData {
  variantId: string
  quantity: number
  variant: ProductVariant
  product: Product
}

interface CartState {
  items: CartItemData[]
  isOpen: boolean

  // Actions
  addItem: (variant: ProductVariant, product: Product, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (variant, product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.variantId === variant.id)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.variantId === variant.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { variantId: variant.id, quantity, variant, product }],
          })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId),
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        set({
          items: get().items.map(item =>
            item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const price = item.product.sale_price ?? item.product.base_price
          const adjustedPrice = price + item.variant.price_adjustment
          return acc + (adjustedPrice * item.quantity)
        }, 0)
      },
    }),
    {
      name: 'alyanoor-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// Format price in IDR
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
