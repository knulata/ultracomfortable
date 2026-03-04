'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StockAlert {
  id: string
  productId: string
  productSlug: string
  productName: string
  productNameId: string
  variantId: string
  size: string
  color: string
  email?: string
  createdAt: string
  notified: boolean
}

export interface ProductWaitlist {
  productId: string
  variantId: string
  waitlistCount: number
}

interface StockAlertsState {
  // User's subscriptions
  alerts: StockAlert[]

  // Mock waitlist counts for products (in real app, this would come from server)
  waitlistCounts: Record<string, number>

  // Actions
  subscribeToAlert: (alert: Omit<StockAlert, 'id' | 'createdAt' | 'notified'>) => void
  unsubscribeFromAlert: (variantId: string) => void
  isSubscribed: (variantId: string) => boolean
  getAlertForVariant: (variantId: string) => StockAlert | undefined
  getWaitlistCount: (variantId: string) => number
  getUserAlerts: () => StockAlert[]
}

// Mock waitlist counts - simulates other users waiting
const mockWaitlistCounts: Record<string, number> = {
  'v6': 42, // White M - out of stock in mock data
  'v8': 18, // White XL - low stock
  'v12': 7, // Beige XL - low stock
}

export const useStockAlertsStore = create<StockAlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      waitlistCounts: mockWaitlistCounts,

      subscribeToAlert: (alertData) => {
        const alert: StockAlert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          createdAt: new Date().toISOString(),
          notified: false,
        }

        set((state) => ({
          alerts: [...state.alerts, alert],
          // Increment mock waitlist count
          waitlistCounts: {
            ...state.waitlistCounts,
            [alertData.variantId]: (state.waitlistCounts[alertData.variantId] || 0) + 1,
          },
        }))
      },

      unsubscribeFromAlert: (variantId) => {
        set((state) => ({
          alerts: state.alerts.filter((a) => a.variantId !== variantId),
          // Decrement mock waitlist count
          waitlistCounts: {
            ...state.waitlistCounts,
            [variantId]: Math.max(0, (state.waitlistCounts[variantId] || 1) - 1),
          },
        }))
      },

      isSubscribed: (variantId) => {
        return get().alerts.some((a) => a.variantId === variantId && !a.notified)
      },

      getAlertForVariant: (variantId) => {
        return get().alerts.find((a) => a.variantId === variantId)
      },

      getWaitlistCount: (variantId) => {
        return get().waitlistCounts[variantId] || 0
      },

      getUserAlerts: () => {
        return get().alerts.filter((a) => !a.notified)
      },
    }),
    {
      name: 'uc-stock-alerts',
    }
  )
)
