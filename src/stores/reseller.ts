'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Reseller tier definitions
export interface ResellerTier {
  id: string
  name: string
  nameId: string
  minOrdersPerMonth: number
  minTotalSpent: number
  discountPercent: number
  benefits: string[]
  benefitsId: string[]
  color: string
  badge: string
}

export const RESELLER_TIERS: ResellerTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Reseller',
    nameId: 'Reseller Bronze',
    minOrdersPerMonth: 0,
    minTotalSpent: 0,
    discountPercent: 5,
    benefits: ['5% off all orders', 'Access to reseller prices', 'Monthly price list'],
    benefitsId: ['Diskon 5% semua pesanan', 'Akses harga reseller', 'Daftar harga bulanan'],
    color: 'text-amber-700 bg-amber-100',
    badge: '🥉',
  },
  {
    id: 'silver',
    name: 'Silver Reseller',
    nameId: 'Reseller Silver',
    minOrdersPerMonth: 5,
    minTotalSpent: 5000000,
    discountPercent: 10,
    benefits: ['10% off all orders', 'Priority stock access', 'Free shipping on orders >Rp500k', 'Dedicated support'],
    benefitsId: ['Diskon 10% semua pesanan', 'Prioritas akses stok', 'Gratis ongkir pesanan >Rp500k', 'Dukungan khusus'],
    color: 'text-gray-600 bg-gray-200',
    badge: '🥈',
  },
  {
    id: 'gold',
    name: 'Gold Reseller',
    nameId: 'Reseller Gold',
    minOrdersPerMonth: 15,
    minTotalSpent: 20000000,
    discountPercent: 15,
    benefits: ['15% off all orders', 'First access to new products', 'Free shipping all orders', 'Credit terms (Net 7)', 'WhatsApp priority'],
    benefitsId: ['Diskon 15% semua pesanan', 'Akses pertama produk baru', 'Gratis ongkir semua pesanan', 'Tempo pembayaran (Net 7)', 'Prioritas WhatsApp'],
    color: 'text-yellow-700 bg-yellow-100',
    badge: '🥇',
  },
  {
    id: 'platinum',
    name: 'Platinum Reseller',
    nameId: 'Reseller Platinum',
    minOrdersPerMonth: 30,
    minTotalSpent: 50000000,
    discountPercent: 20,
    benefits: ['20% off all orders', 'Exclusive products', 'Free shipping + priority delivery', 'Credit terms (Net 14)', 'Personal account manager', 'Custom product requests'],
    benefitsId: ['Diskon 20% semua pesanan', 'Produk eksklusif', 'Gratis ongkir + prioritas kirim', 'Tempo pembayaran (Net 14)', 'Account manager pribadi', 'Request produk custom'],
    color: 'text-purple-700 bg-purple-100',
    badge: '💎',
  },
]

// Wholesale pricing tiers
export interface WholesalePriceTier {
  minQuantity: number
  discountPercent: number
  label: string
  labelId: string
}

export const WHOLESALE_PRICE_TIERS: WholesalePriceTier[] = [
  { minQuantity: 1, discountPercent: 0, label: 'Retail', labelId: 'Eceran' },
  { minQuantity: 6, discountPercent: 5, label: '½ Dozen', labelId: '½ Lusin' },
  { minQuantity: 12, discountPercent: 10, label: '1 Dozen', labelId: '1 Lusin' },
  { minQuantity: 24, discountPercent: 15, label: '2 Dozen', labelId: '2 Lusin' },
  { minQuantity: 60, discountPercent: 20, label: '5 Dozen', labelId: '5 Lusin' },
  { minQuantity: 120, discountPercent: 25, label: '10 Dozen (Kodi)', labelId: '1 Kodi' },
]

export interface Reseller {
  id: string
  name: string
  businessName: string
  phone: string
  whatsapp: string
  email?: string
  address: string
  city: string
  tierId: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  joinedAt: string
  totalOrders: number
  totalSpent: number
  ordersThisMonth: number
  lastOrderAt?: string
  notes?: string
}

export interface ResellerOrder {
  id: string
  resellerId: string
  items: { productId: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }[]
  subtotal: number
  resellerDiscount: number
  wholesaleDiscount: number
  totalDiscount: number
  finalTotal: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
}

interface ResellerState {
  resellers: Reseller[]
  orders: ResellerOrder[]

  // Reseller management
  getResellerById: (id: string) => Reseller | undefined
  getResellerTier: (reseller: Reseller) => ResellerTier
  addReseller: (reseller: Omit<Reseller, 'id' | 'joinedAt' | 'totalOrders' | 'totalSpent' | 'ordersThisMonth'>) => void
  updateResellerStatus: (id: string, status: Reseller['status']) => void
  updateResellerNotes: (id: string, notes: string) => void

  // Stats
  getResellerStats: () => {
    total: number
    pending: number
    approved: number
    byTier: Record<string, number>
    topResellers: Reseller[]
    totalRevenue: number
    revenueThisMonth: number
  }

  // Wholesale pricing
  getWholesalePrice: (basePrice: number, quantity: number, resellerTierId?: string) => {
    unitPrice: number
    totalPrice: number
    wholesaleDiscount: number
    resellerDiscount: number
    totalDiscount: number
    savings: number
    priceTier: WholesalePriceTier
  }

  // Orders
  getOrdersForReseller: (resellerId: string) => ResellerOrder[]
  addOrder: (order: Omit<ResellerOrder, 'id' | 'createdAt'>) => void
}

// Mock resellers for demo
const mockResellers: Reseller[] = [
  {
    id: 'r1',
    name: 'Ibu Siti Aminah',
    businessName: 'Toko Berkah Jaya',
    phone: '081234567890',
    whatsapp: '081234567890',
    email: 'siti@tokoberkah.com',
    address: 'Blok A No. 123, Tanah Abang',
    city: 'Jakarta Pusat',
    tierId: 'gold',
    status: 'approved',
    joinedAt: '2023-06-15T00:00:00Z',
    totalOrders: 156,
    totalSpent: 45000000,
    ordersThisMonth: 18,
    lastOrderAt: '2024-02-28T10:30:00Z',
  },
  {
    id: 'r2',
    name: 'Pak Hendra Wijaya',
    businessName: 'Grosir Murah Meriah',
    phone: '082345678901',
    whatsapp: '082345678901',
    address: 'Blok B No. 45, Tanah Abang',
    city: 'Jakarta Pusat',
    tierId: 'platinum',
    status: 'approved',
    joinedAt: '2023-01-10T00:00:00Z',
    totalOrders: 312,
    totalSpent: 125000000,
    ordersThisMonth: 35,
    lastOrderAt: '2024-03-01T14:20:00Z',
  },
  {
    id: 'r3',
    name: 'Ibu Dewi Lestari',
    businessName: 'Dewi Fashion',
    phone: '083456789012',
    whatsapp: '083456789012',
    address: 'Pasar Baru No. 78',
    city: 'Jakarta Pusat',
    tierId: 'silver',
    status: 'approved',
    joinedAt: '2023-09-20T00:00:00Z',
    totalOrders: 45,
    totalSpent: 12000000,
    ordersThisMonth: 8,
    lastOrderAt: '2024-02-25T09:15:00Z',
  },
  {
    id: 'r4',
    name: 'Pak Ahmad Fauzi',
    businessName: 'Fauzi Collection',
    phone: '084567890123',
    whatsapp: '084567890123',
    address: 'Blok C No. 12, Tanah Abang',
    city: 'Jakarta Pusat',
    tierId: 'bronze',
    status: 'approved',
    joinedAt: '2024-01-05T00:00:00Z',
    totalOrders: 8,
    totalSpent: 2500000,
    ordersThisMonth: 3,
    lastOrderAt: '2024-02-20T16:45:00Z',
  },
  {
    id: 'r5',
    name: 'Ibu Rina Marlina',
    businessName: 'Rina Boutique',
    phone: '085678901234',
    whatsapp: '085678901234',
    address: 'Jl. Kebon Kacang No. 56',
    city: 'Jakarta Pusat',
    tierId: 'bronze',
    status: 'pending',
    joinedAt: '2024-02-28T00:00:00Z',
    totalOrders: 0,
    totalSpent: 0,
    ordersThisMonth: 0,
    notes: 'Baru daftar, belum verifikasi',
  },
]

export const useResellerStore = create<ResellerState>()(
  persist(
    (set, get) => ({
      resellers: mockResellers,
      orders: [],

      getResellerById: (id) => {
        return get().resellers.find((r) => r.id === id)
      },

      getResellerTier: (reseller) => {
        return RESELLER_TIERS.find((t) => t.id === reseller.tierId) || RESELLER_TIERS[0]
      },

      addReseller: (resellerData) => {
        const newReseller: Reseller = {
          ...resellerData,
          id: `r-${Date.now()}`,
          joinedAt: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0,
          ordersThisMonth: 0,
        }

        set((state) => ({
          resellers: [...state.resellers, newReseller],
        }))
      },

      updateResellerStatus: (id, status) => {
        set((state) => ({
          resellers: state.resellers.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }))
      },

      updateResellerNotes: (id, notes) => {
        set((state) => ({
          resellers: state.resellers.map((r) =>
            r.id === id ? { ...r, notes } : r
          ),
        }))
      },

      getResellerStats: () => {
        const resellers = get().resellers
        const approved = resellers.filter((r) => r.status === 'approved')

        const byTier: Record<string, number> = {}
        RESELLER_TIERS.forEach((tier) => {
          byTier[tier.id] = approved.filter((r) => r.tierId === tier.id).length
        })

        const topResellers = [...approved]
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5)

        const totalRevenue = approved.reduce((sum, r) => sum + r.totalSpent, 0)

        // Simulate this month's revenue (30% of total for demo)
        const revenueThisMonth = Math.round(totalRevenue * 0.3)

        return {
          total: resellers.length,
          pending: resellers.filter((r) => r.status === 'pending').length,
          approved: approved.length,
          byTier,
          topResellers,
          totalRevenue,
          revenueThisMonth,
        }
      },

      getWholesalePrice: (basePrice, quantity, resellerTierId) => {
        // Find applicable wholesale tier
        const priceTier = [...WHOLESALE_PRICE_TIERS]
          .reverse()
          .find((tier) => quantity >= tier.minQuantity) || WHOLESALE_PRICE_TIERS[0]

        // Get reseller tier discount
        const resellerTier = resellerTierId
          ? RESELLER_TIERS.find((t) => t.id === resellerTierId)
          : null

        const wholesaleDiscountPercent = priceTier.discountPercent
        const resellerDiscountPercent = resellerTier?.discountPercent || 0

        // Calculate prices
        const afterWholesale = basePrice * (1 - wholesaleDiscountPercent / 100)
        const unitPrice = Math.round(afterWholesale * (1 - resellerDiscountPercent / 100))
        const totalPrice = unitPrice * quantity

        const originalTotal = basePrice * quantity
        const wholesaleDiscount = Math.round((basePrice - afterWholesale) * quantity)
        const resellerDiscount = Math.round((afterWholesale - unitPrice) * quantity)
        const totalDiscount = wholesaleDiscount + resellerDiscount
        const savings = originalTotal - totalPrice

        return {
          unitPrice,
          totalPrice,
          wholesaleDiscount,
          resellerDiscount,
          totalDiscount,
          savings,
          priceTier,
        }
      },

      getOrdersForReseller: (resellerId) => {
        return get().orders.filter((o) => o.resellerId === resellerId)
      },

      addOrder: (orderData) => {
        const newOrder: ResellerOrder = {
          ...orderData,
          id: `ro-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          orders: [...state.orders, newOrder],
        }))

        // Update reseller stats
        const reseller = get().resellers.find((r) => r.id === orderData.resellerId)
        if (reseller) {
          set((state) => ({
            resellers: state.resellers.map((r) =>
              r.id === orderData.resellerId
                ? {
                    ...r,
                    totalOrders: r.totalOrders + 1,
                    totalSpent: r.totalSpent + orderData.finalTotal,
                    ordersThisMonth: r.ordersThisMonth + 1,
                    lastOrderAt: new Date().toISOString(),
                  }
                : r
            ),
          }))
        }
      },
    }),
    {
      name: 'uc-reseller',
    }
  )
)
