'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Partner = Seller who consigns products with UC Fulfillment
export interface Partner {
  id: string
  // Basic Info
  ownerName: string
  shopName: string
  phone: string
  whatsapp: string
  email?: string
  // Location in Tanah Abang
  shopAddress: string
  block: string // Blok A, B, C, etc.
  floor: string
  shopNumber: string
  // Bank Details for Payout
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  // Agreement
  commissionRate: number // Percentage UC takes (e.g., 15%)
  agreementSignedAt?: string
  // Status
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'rejected'
  statusNote?: string
  // Timestamps
  appliedAt: string
  approvedAt?: string
  // Stats (will be calculated from products/orders)
  totalProducts: number
  totalStock: number
  totalSales: number
  totalEarnings: number
  pendingPayout: number
  lastPayoutAt?: string
}

export interface PartnerProduct {
  id: string
  partnerId: string
  // Product Info
  name: string
  sku: string
  category: string
  description?: string
  images: string[]
  // Pricing
  costPrice: number // Harga dari seller
  sellingPrice: number // Harga jual di platform
  // Stock
  stockReceived: number // Total diterima
  stockAvailable: number // Sisa tersedia
  stockSold: number // Terjual
  stockDefect: number // Cacat/retur
  // Status
  status: 'pending_photo' | 'pending_upload' | 'active' | 'out_of_stock' | 'discontinued'
  // Location in warehouse
  rackLocation?: string
  // Timestamps
  receivedAt: string
  listedAt?: string
}

export interface PartnerPayout {
  id: string
  partnerId: string
  period: string // e.g., "2024-03-01 to 2024-03-07"
  totalSales: number
  commission: number
  deductions: number // Defects, returns, etc.
  netPayout: number
  status: 'pending' | 'processing' | 'paid'
  paidAt?: string
  transferProof?: string
  notes?: string
  createdAt: string
}

interface PartnerState {
  partners: Partner[]
  products: PartnerProduct[]
  payouts: PartnerPayout[]

  // Partner Management
  addPartner: (partner: Omit<Partner, 'id' | 'appliedAt' | 'totalProducts' | 'totalStock' | 'totalSales' | 'totalEarnings' | 'pendingPayout'>) => string
  updatePartnerStatus: (id: string, status: Partner['status'], note?: string) => void
  updatePartnerCommission: (id: string, rate: number) => void
  getPartnerById: (id: string) => Partner | undefined
  getPartnerStats: () => {
    total: number
    pending: number
    active: number
    totalProducts: number
    totalStock: number
    pendingPayouts: number
  }

  // Product Management
  getProductsByPartner: (partnerId: string) => PartnerProduct[]

  // Payout Management
  getPayoutsByPartner: (partnerId: string) => PartnerPayout[]
}

// Mock partners for demo
const mockPartners: Partner[] = [
  {
    id: 'partner-1',
    ownerName: 'Haji Muhammad Yusuf',
    shopName: 'Toko Kain Berkah',
    phone: '081234567001',
    whatsapp: '081234567001',
    email: 'berkah@gmail.com',
    shopAddress: 'Blok A Lt. 2 No. 15-16',
    block: 'A',
    floor: '2',
    shopNumber: '15-16',
    bankName: 'BCA',
    bankAccountNumber: '1234567890',
    bankAccountName: 'Muhammad Yusuf',
    commissionRate: 15,
    agreementSignedAt: '2024-01-15T00:00:00Z',
    status: 'active',
    appliedAt: '2024-01-10T00:00:00Z',
    approvedAt: '2024-01-15T00:00:00Z',
    totalProducts: 45,
    totalStock: 320,
    totalSales: 28500000,
    totalEarnings: 24225000,
    pendingPayout: 3200000,
    lastPayoutAt: '2024-02-28T00:00:00Z',
  },
  {
    id: 'partner-2',
    ownerName: 'Ibu Siti Rahayu',
    shopName: 'Rahayu Fashion',
    phone: '081234567002',
    whatsapp: '081234567002',
    shopAddress: 'Blok B Lt. 1 No. 22',
    block: 'B',
    floor: '1',
    shopNumber: '22',
    bankName: 'Mandiri',
    bankAccountNumber: '0987654321',
    bankAccountName: 'Siti Rahayu',
    commissionRate: 12,
    agreementSignedAt: '2024-02-01T00:00:00Z',
    status: 'active',
    appliedAt: '2024-01-25T00:00:00Z',
    approvedAt: '2024-02-01T00:00:00Z',
    totalProducts: 32,
    totalStock: 180,
    totalSales: 15800000,
    totalEarnings: 13904000,
    pendingPayout: 1850000,
    lastPayoutAt: '2024-02-28T00:00:00Z',
  },
  {
    id: 'partner-3',
    ownerName: 'Pak Ahmad Fauzan',
    shopName: 'Fauzan Collection',
    phone: '081234567003',
    whatsapp: '081234567003',
    email: 'fauzan.collection@gmail.com',
    shopAddress: 'Blok C Lt. 3 No. 8',
    block: 'C',
    floor: '3',
    shopNumber: '8',
    bankName: 'BRI',
    bankAccountNumber: '1122334455',
    bankAccountName: 'Ahmad Fauzan',
    commissionRate: 15,
    status: 'pending',
    appliedAt: '2024-03-01T00:00:00Z',
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
    totalEarnings: 0,
    pendingPayout: 0,
  },
  {
    id: 'partner-4',
    ownerName: 'Ny. Linda Wijaya',
    shopName: 'Linda Boutique',
    phone: '081234567004',
    whatsapp: '081234567004',
    shopAddress: 'Blok A Lt. 1 No. 5',
    block: 'A',
    floor: '1',
    shopNumber: '5',
    bankName: 'BCA',
    bankAccountNumber: '9988776655',
    bankAccountName: 'Linda Wijaya',
    commissionRate: 10,
    agreementSignedAt: '2024-02-15T00:00:00Z',
    status: 'active',
    appliedAt: '2024-02-10T00:00:00Z',
    approvedAt: '2024-02-15T00:00:00Z',
    totalProducts: 28,
    totalStock: 95,
    totalSales: 8200000,
    totalEarnings: 7380000,
    pendingPayout: 920000,
    lastPayoutAt: '2024-02-28T00:00:00Z',
  },
]

export const usePartnerStore = create<PartnerState>()(
  persist(
    (set, get) => ({
      partners: mockPartners,
      products: [],
      payouts: [],

      addPartner: (partnerData) => {
        const id = `partner-${Date.now()}`
        const newPartner: Partner = {
          ...partnerData,
          id,
          appliedAt: new Date().toISOString(),
          totalProducts: 0,
          totalStock: 0,
          totalSales: 0,
          totalEarnings: 0,
          pendingPayout: 0,
        }

        set((state) => ({
          partners: [...state.partners, newPartner],
        }))

        return id
      },

      updatePartnerStatus: (id, status, note) => {
        set((state) => ({
          partners: state.partners.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  statusNote: note,
                  approvedAt: status === 'approved' || status === 'active'
                    ? new Date().toISOString()
                    : p.approvedAt,
                  agreementSignedAt: status === 'active' && !p.agreementSignedAt
                    ? new Date().toISOString()
                    : p.agreementSignedAt,
                }
              : p
          ),
        }))
      },

      updatePartnerCommission: (id, rate) => {
        set((state) => ({
          partners: state.partners.map((p) =>
            p.id === id ? { ...p, commissionRate: rate } : p
          ),
        }))
      },

      getPartnerById: (id) => {
        return get().partners.find((p) => p.id === id)
      },

      getPartnerStats: () => {
        const partners = get().partners
        const active = partners.filter((p) => p.status === 'active')

        return {
          total: partners.length,
          pending: partners.filter((p) => p.status === 'pending').length,
          active: active.length,
          totalProducts: active.reduce((sum, p) => sum + p.totalProducts, 0),
          totalStock: active.reduce((sum, p) => sum + p.totalStock, 0),
          pendingPayouts: active.reduce((sum, p) => sum + p.pendingPayout, 0),
        }
      },

      getProductsByPartner: (partnerId) => {
        return get().products.filter((p) => p.partnerId === partnerId)
      },

      getPayoutsByPartner: (partnerId) => {
        return get().payouts.filter((p) => p.partnerId === partnerId)
      },
    }),
    {
      name: 'alyanoor-partners',
    }
  )
)
