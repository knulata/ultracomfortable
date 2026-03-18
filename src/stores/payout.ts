'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PayoutStatus = 'draft' | 'pending' | 'processing' | 'paid' | 'failed'
export type PayoutPeriod = 'weekly' | 'biweekly' | 'monthly'

export interface PayoutLineItem {
  id: string
  orderId: string
  orderNumber: string
  productName: string
  quantity: number
  sellingPrice: number
  costPrice: number
  lineTotal: number // sellingPrice * quantity
  partnerEarning: number // lineTotal - commission
  date: string
}

export interface PayoutDeduction {
  id: string
  type: 'return' | 'defect' | 'damage' | 'penalty' | 'adjustment'
  description: string
  amount: number
  orderId?: string
  date: string
}

export interface Payout {
  id: string
  partnerId: string
  partnerName: string
  shopName: string
  // Period
  periodStart: string
  periodEnd: string
  periodLabel: string // e.g., "1-7 Mar 2024"
  // Sales
  lineItems: PayoutLineItem[]
  totalSales: number
  totalItems: number
  totalQuantity: number
  // Commission
  commissionRate: number
  commissionAmount: number
  // Deductions
  deductions: PayoutDeduction[]
  totalDeductions: number
  // Net
  netPayout: number
  // Bank
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  // Status
  status: PayoutStatus
  statusNote?: string
  // Transfer
  transferDate?: string
  transferProof?: string
  transferReference?: string
  // Timestamps
  createdAt: string
  approvedAt?: string
  paidAt?: string
  // Approval
  approvedBy?: string
  paidBy?: string
}

export interface PayoutSummary {
  partnerId: string
  partnerName: string
  shopName: string
  totalSales: number
  commission: number
  deductions: number
  netPayout: number
  itemCount: number
  commissionRate: number
}

interface PayoutState {
  payouts: Payout[]

  // Payout Management
  createPayout: (payout: Omit<Payout, 'id' | 'createdAt' | 'status'>) => string
  updatePayoutStatus: (id: string, status: PayoutStatus, note?: string) => void
  approvePayout: (id: string, approvedBy: string) => void
  markAsPaid: (id: string, transferRef: string, transferProof: string, paidBy: string) => void
  getPayoutById: (id: string) => Payout | undefined
  getPayoutsByPartner: (partnerId: string) => Payout[]
  getPayoutsByStatus: (status: PayoutStatus) => Payout[]

  // Calculations
  calculatePartnerSummary: (partnerId: string, startDate: string, endDate: string) => PayoutSummary | null

  // Stats
  getPayoutStats: () => {
    totalPending: number
    totalPendingAmount: number
    totalPaidThisMonth: number
    totalPaidAmount: number
    partnersWithPending: number
  }
}

// Helper to format period label
const formatPeriodLabel = (start: string, end: string): string => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const month = endDate.toLocaleDateString('id-ID', { month: 'short' })
  const year = endDate.getFullYear()
  return `${startDay}-${endDay} ${month} ${year}`
}

// Mock payouts for demo
const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    partnerId: 'partner-1',
    partnerName: 'Haji Muhammad Yusuf',
    shopName: 'Toko Kain Berkah',
    periodStart: '2024-02-26T00:00:00Z',
    periodEnd: '2024-03-03T23:59:59Z',
    periodLabel: '26 Feb - 3 Mar 2024',
    lineItems: [
      {
        id: 'line-1',
        orderId: 'order-101',
        orderNumber: 'UC240228001',
        productName: 'Gamis Syari Brukat Premium',
        quantity: 2,
        sellingPrice: 329000,
        costPrice: 185000,
        lineTotal: 658000,
        partnerEarning: 559300,
        date: '2024-02-28T10:00:00Z',
      },
      {
        id: 'line-2',
        orderId: 'order-102',
        orderNumber: 'UC240301005',
        productName: 'Tunik Batik Kombinasi',
        quantity: 3,
        sellingPrice: 215000,
        costPrice: 125000,
        lineTotal: 645000,
        partnerEarning: 548250,
        date: '2024-03-01T14:30:00Z',
      },
      {
        id: 'line-3',
        orderId: 'order-103',
        orderNumber: 'UC240302008',
        productName: 'Gamis Syari Brukat Premium',
        quantity: 1,
        sellingPrice: 329000,
        costPrice: 185000,
        lineTotal: 329000,
        partnerEarning: 279650,
        date: '2024-03-02T09:15:00Z',
      },
    ],
    totalSales: 1632000,
    totalItems: 3,
    totalQuantity: 6,
    commissionRate: 15,
    commissionAmount: 244800,
    deductions: [
      {
        id: 'ded-1',
        type: 'return',
        description: 'Retur - Gamis Motif Bunga (cacat jahitan)',
        amount: 275000,
        orderId: 'order-95',
        date: '2024-03-01T00:00:00Z',
      },
    ],
    totalDeductions: 275000,
    netPayout: 1112200,
    bankName: 'BCA',
    bankAccountNumber: '1234567890',
    bankAccountName: 'Muhammad Yusuf',
    status: 'pending',
    createdAt: '2024-03-04T00:00:00Z',
  },
  {
    id: 'payout-2',
    partnerId: 'partner-2',
    partnerName: 'Ibu Siti Rahayu',
    shopName: 'Rahayu Fashion',
    periodStart: '2024-02-26T00:00:00Z',
    periodEnd: '2024-03-03T23:59:59Z',
    periodLabel: '26 Feb - 3 Mar 2024',
    lineItems: [
      {
        id: 'line-4',
        orderId: 'order-104',
        orderNumber: 'UC240227012',
        productName: 'Hijab Voal Premium',
        quantity: 5,
        sellingPrice: 89000,
        costPrice: 45000,
        lineTotal: 445000,
        partnerEarning: 391600,
        date: '2024-02-27T11:00:00Z',
      },
      {
        id: 'line-5',
        orderId: 'order-105',
        orderNumber: 'UC240301002',
        productName: 'Outer Cardigan Rajut',
        quantity: 2,
        sellingPrice: 165000,
        costPrice: 95000,
        lineTotal: 330000,
        partnerEarning: 290400,
        date: '2024-03-01T08:45:00Z',
      },
    ],
    totalSales: 775000,
    totalItems: 2,
    totalQuantity: 7,
    commissionRate: 12,
    commissionAmount: 93000,
    deductions: [],
    totalDeductions: 0,
    netPayout: 682000,
    bankName: 'Mandiri',
    bankAccountNumber: '0987654321',
    bankAccountName: 'Siti Rahayu',
    status: 'paid',
    createdAt: '2024-03-04T00:00:00Z',
    approvedAt: '2024-03-04T10:00:00Z',
    paidAt: '2024-03-04T14:30:00Z',
    approvedBy: 'Admin',
    paidBy: 'Finance',
    transferDate: '2024-03-04T14:30:00Z',
    transferReference: 'TRF-20240304-001',
  },
  {
    id: 'payout-3',
    partnerId: 'partner-4',
    partnerName: 'Ny. Linda Wijaya',
    shopName: 'Linda Boutique',
    periodStart: '2024-02-26T00:00:00Z',
    periodEnd: '2024-03-03T23:59:59Z',
    periodLabel: '26 Feb - 3 Mar 2024',
    lineItems: [
      {
        id: 'line-6',
        orderId: 'order-106',
        orderNumber: 'UC240228015',
        productName: 'Rok Plisket Panjang Premium',
        quantity: 4,
        sellingPrice: 145000,
        costPrice: 85000,
        lineTotal: 580000,
        partnerEarning: 522000,
        date: '2024-02-28T16:20:00Z',
      },
    ],
    totalSales: 580000,
    totalItems: 1,
    totalQuantity: 4,
    commissionRate: 10,
    commissionAmount: 58000,
    deductions: [],
    totalDeductions: 0,
    netPayout: 522000,
    bankName: 'BCA',
    bankAccountNumber: '9988776655',
    bankAccountName: 'Linda Wijaya',
    status: 'processing',
    createdAt: '2024-03-04T00:00:00Z',
    approvedAt: '2024-03-05T09:00:00Z',
    approvedBy: 'Admin',
  },
]

export const usePayoutStore = create<PayoutState>()(
  persist(
    (set, get) => ({
      payouts: mockPayouts,

      createPayout: (payoutData) => {
        const id = `payout-${Date.now()}`
        const newPayout: Payout = {
          ...payoutData,
          id,
          status: 'draft',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          payouts: [...state.payouts, newPayout],
        }))

        return id
      },

      updatePayoutStatus: (id, status, note) => {
        set((state) => ({
          payouts: state.payouts.map((payout) =>
            payout.id === id
              ? { ...payout, status, statusNote: note }
              : payout
          ),
        }))
      },

      approvePayout: (id, approvedBy) => {
        set((state) => ({
          payouts: state.payouts.map((payout) =>
            payout.id === id
              ? {
                  ...payout,
                  status: 'processing' as PayoutStatus,
                  approvedAt: new Date().toISOString(),
                  approvedBy,
                }
              : payout
          ),
        }))
      },

      markAsPaid: (id, transferRef, transferProof, paidBy) => {
        const now = new Date().toISOString()
        set((state) => ({
          payouts: state.payouts.map((payout) =>
            payout.id === id
              ? {
                  ...payout,
                  status: 'paid' as PayoutStatus,
                  paidAt: now,
                  transferDate: now,
                  transferReference: transferRef,
                  transferProof: transferProof,
                  paidBy,
                }
              : payout
          ),
        }))
      },

      getPayoutById: (id) => {
        return get().payouts.find((payout) => payout.id === id)
      },

      getPayoutsByPartner: (partnerId) => {
        return get().payouts.filter((payout) => payout.partnerId === partnerId)
      },

      getPayoutsByStatus: (status) => {
        return get().payouts.filter((payout) => payout.status === status)
      },

      calculatePartnerSummary: (partnerId, startDate, endDate) => {
        // This would normally fetch from orders/fulfillment store
        // For demo, return mock data
        return null
      },

      getPayoutStats: () => {
        const payouts = get().payouts
        const thisMonth = new Date().getMonth()
        const thisYear = new Date().getFullYear()

        const pending = payouts.filter((p) => ['draft', 'pending'].includes(p.status))
        const processing = payouts.filter((p) => p.status === 'processing')
        const paidThisMonth = payouts.filter((p) => {
          if (p.status !== 'paid' || !p.paidAt) return false
          const paidDate = new Date(p.paidAt)
          return paidDate.getMonth() === thisMonth && paidDate.getFullYear() === thisYear
        })

        const uniquePartners = new Set(pending.map((p) => p.partnerId))

        return {
          totalPending: pending.length + processing.length,
          totalPendingAmount: [...pending, ...processing].reduce((sum, p) => sum + p.netPayout, 0),
          totalPaidThisMonth: paidThisMonth.length,
          totalPaidAmount: paidThisMonth.reduce((sum, p) => sum + p.netPayout, 0),
          partnersWithPending: uniquePartners.size,
        }
      },
    }),
    {
      name: 'alyanoor-payouts',
    }
  )
)

export { formatPeriodLabel }
