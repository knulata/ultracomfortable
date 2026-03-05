'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  discount: number
  total: number
  paymentMethod: 'cash' | 'transfer' | 'qris' | 'cod' | 'credit'
  customerName?: string
  customerPhone?: string
  isReseller: boolean
  resellerId?: string
  createdAt: string
  notes?: string
}

export interface DailySummary {
  date: string
  totalSales: number
  totalTransactions: number
  totalItems: number
  avgTransactionValue: number
  topProducts: { productName: string; quantity: number; revenue: number }[]
  byPaymentMethod: Record<string, { count: number; total: number }>
  resellerSales: number
  retailSales: number
}

interface SalesState {
  sales: Sale[]
  dailyTarget: number

  // Actions
  addSale: (sale: Omit<Sale, 'id' | 'createdAt'>) => void
  setDailyTarget: (target: number) => void

  // Getters
  getSalesForDate: (date: Date) => Sale[]
  getDailySummary: (date: Date) => DailySummary
  getWeeklySummary: () => { date: string; total: number; transactions: number }[]
  getTodayVsYesterday: () => {
    today: DailySummary
    yesterday: DailySummary
    salesChange: number
    salesChangePercent: number
    transactionsChange: number
  }
  getTargetProgress: () => { current: number; target: number; percent: number; remaining: number }
}

// Generate mock sales data for the past 7 days
function generateMockSales(): Sale[] {
  const sales: Sale[] = []
  const products = [
    { id: 'p1', name: 'Kaos Polos Katun', price: 35000 },
    { id: 'p2', name: 'Kaos Oversized', price: 55000 },
    { id: 'p3', name: 'Celana Cargo', price: 125000 },
    { id: 'p4', name: 'Dress Midi Bunga', price: 95000 },
    { id: 'p5', name: 'Kemeja Flanel', price: 85000 },
    { id: 'p6', name: 'Jaket Jeans', price: 175000 },
    { id: 'p7', name: 'Rok Plisket', price: 65000 },
    { id: 'p8', name: 'Sweater Rajut', price: 95000 },
  ]

  const paymentMethods: Sale['paymentMethod'][] = ['cash', 'transfer', 'qris', 'cod', 'credit']
  const customerNames = ['Bu Ani', 'Pak Budi', 'Ibu Siti', 'Mas Joko', 'Mbak Rina', 'Pak Hendra', null]

  // Generate sales for last 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date()
    date.setDate(date.getDate() - dayOffset)
    date.setHours(0, 0, 0, 0)

    // Random number of transactions per day (more on recent days for realism)
    const numTransactions = dayOffset === 0
      ? Math.floor(Math.random() * 8) + 12 // Today: 12-20 transactions
      : Math.floor(Math.random() * 10) + 8 // Other days: 8-18 transactions

    for (let i = 0; i < numTransactions; i++) {
      // Random time during business hours (8am - 8pm)
      const hour = Math.floor(Math.random() * 12) + 8
      const minute = Math.floor(Math.random() * 60)
      const saleDate = new Date(date)
      saleDate.setHours(hour, minute)

      // Random 1-4 items per transaction
      const numItems = Math.floor(Math.random() * 4) + 1
      const items: SaleItem[] = []
      let subtotal = 0

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 6) + 1 // 1-6 pcs
        const totalPrice = product.price * quantity
        subtotal += totalPrice

        items.push({
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.price,
          totalPrice,
        })
      }

      const isReseller = Math.random() > 0.6 // 40% reseller orders
      const discount = isReseller ? Math.round(subtotal * 0.1) : 0 // 10% reseller discount

      sales.push({
        id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items,
        subtotal,
        discount,
        total: subtotal - discount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)] || undefined,
        isReseller,
        createdAt: saleDate.toISOString(),
      })
    }
  }

  return sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const mockSales = generateMockSales()

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      sales: mockSales,
      dailyTarget: 5000000, // Rp 5 juta default target

      addSale: (saleData) => {
        const newSale: Sale = {
          ...saleData,
          id: `sale-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          sales: [newSale, ...state.sales],
        }))
      },

      setDailyTarget: (target) => {
        set({ dailyTarget: target })
      },

      getSalesForDate: (date) => {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        return get().sales.filter((sale) => {
          const saleDate = new Date(sale.createdAt)
          return saleDate >= startOfDay && saleDate <= endOfDay
        })
      },

      getDailySummary: (date) => {
        const sales = get().getSalesForDate(date)

        const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
        const totalTransactions = sales.length
        const totalItems = sales.reduce((sum, s) => sum + s.items.reduce((i, item) => i + item.quantity, 0), 0)
        const avgTransactionValue = totalTransactions > 0 ? Math.round(totalSales / totalTransactions) : 0

        // Top products
        const productMap = new Map<string, { quantity: number; revenue: number }>()
        sales.forEach((sale) => {
          sale.items.forEach((item) => {
            const existing = productMap.get(item.productName) || { quantity: 0, revenue: 0 }
            productMap.set(item.productName, {
              quantity: existing.quantity + item.quantity,
              revenue: existing.revenue + item.totalPrice,
            })
          })
        })
        const topProducts = Array.from(productMap.entries())
          .map(([productName, data]) => ({ productName, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        // By payment method
        const byPaymentMethod: Record<string, { count: number; total: number }> = {}
        sales.forEach((sale) => {
          if (!byPaymentMethod[sale.paymentMethod]) {
            byPaymentMethod[sale.paymentMethod] = { count: 0, total: 0 }
          }
          byPaymentMethod[sale.paymentMethod].count++
          byPaymentMethod[sale.paymentMethod].total += sale.total
        })

        // Reseller vs retail
        const resellerSales = sales.filter((s) => s.isReseller).reduce((sum, s) => sum + s.total, 0)
        const retailSales = sales.filter((s) => !s.isReseller).reduce((sum, s) => sum + s.total, 0)

        return {
          date: date.toISOString().split('T')[0],
          totalSales,
          totalTransactions,
          totalItems,
          avgTransactionValue,
          topProducts,
          byPaymentMethod,
          resellerSales,
          retailSales,
        }
      },

      getWeeklySummary: () => {
        const summary: { date: string; total: number; transactions: number }[] = []

        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dailySummary = get().getDailySummary(date)
          summary.push({
            date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
            total: dailySummary.totalSales,
            transactions: dailySummary.totalTransactions,
          })
        }

        return summary
      },

      getTodayVsYesterday: () => {
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const todaySummary = get().getDailySummary(today)
        const yesterdaySummary = get().getDailySummary(yesterday)

        const salesChange = todaySummary.totalSales - yesterdaySummary.totalSales
        const salesChangePercent = yesterdaySummary.totalSales > 0
          ? Math.round((salesChange / yesterdaySummary.totalSales) * 100)
          : 0

        const transactionsChange = todaySummary.totalTransactions - yesterdaySummary.totalTransactions

        return {
          today: todaySummary,
          yesterday: yesterdaySummary,
          salesChange,
          salesChangePercent,
          transactionsChange,
        }
      },

      getTargetProgress: () => {
        const today = get().getDailySummary(new Date())
        const target = get().dailyTarget
        const percent = target > 0 ? Math.min(100, Math.round((today.totalSales / target) * 100)) : 0
        const remaining = Math.max(0, target - today.totalSales)

        return {
          current: today.totalSales,
          target,
          percent,
          remaining,
        }
      },
    }),
    {
      name: 'uc-sales',
      partialize: (state) => ({ dailyTarget: state.dailyTarget }),
    }
  )
)
