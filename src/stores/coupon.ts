import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CouponType = 'percentage' | 'fixed' | 'free_shipping'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number // percentage (0-100) or fixed amount in IDR
  description: string
  descriptionId: string
  minOrderValue: number
  maxDiscount?: number // cap for percentage discounts
  validFrom: Date
  validUntil: Date
  usageLimit: number
  usedCount: number
  isActive: boolean
  applicableCategories?: string[] // empty = all categories
  applicableProducts?: string[] // empty = all products
  isFirstOrderOnly: boolean
  isNewUserOnly: boolean
}

export interface AppliedCoupon {
  coupon: Coupon
  discountAmount: number
}

interface CouponState {
  // Available coupons for the user
  availableCoupons: Coupon[]

  // Applied coupon at checkout
  appliedCoupon: AppliedCoupon | null

  // Coupon history (used coupons)
  usedCoupons: { couponId: string; usedAt: Date; orderId: string }[]

  // Actions
  applyCoupon: (code: string, cartTotal: number, cartItems?: { categoryId?: string; productId?: string }[]) => { success: boolean; message: string; messageId: string }
  removeCoupon: () => void
  validateCoupon: (code: string, cartTotal: number, cartItems?: { categoryId?: string; productId?: string }[]) => { valid: boolean; message: string; messageId: string; coupon?: Coupon }
  calculateDiscount: (coupon: Coupon, cartTotal: number) => number
  markCouponAsUsed: (couponId: string, orderId: string) => void
  addCoupon: (coupon: Coupon) => void
  getCouponByCode: (code: string) => Coupon | undefined
}

// Mock coupons for demo
const mockCoupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: '10% off your first order',
    descriptionId: 'Diskon 10% untuk pesanan pertama',
    minOrderValue: 100000,
    maxDiscount: 50000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    usageLimit: 1,
    usedCount: 0,
    isActive: true,
    isFirstOrderOnly: true,
    isNewUserOnly: true,
  },
  {
    id: 'coupon-2',
    code: 'UCFAM20',
    type: 'percentage',
    value: 20,
    description: '20% off - UC Family exclusive',
    descriptionId: 'Diskon 20% - Eksklusif UC Family',
    minOrderValue: 300000,
    maxDiscount: 100000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    usageLimit: 3,
    usedCount: 1,
    isActive: true,
    isFirstOrderOnly: false,
    isNewUserOnly: false,
  },
  {
    id: 'coupon-3',
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    description: 'Free shipping on any order',
    descriptionId: 'Gratis ongkir untuk semua pesanan',
    minOrderValue: 200000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    usageLimit: 5,
    usedCount: 2,
    isActive: true,
    isFirstOrderOnly: false,
    isNewUserOnly: false,
  },
  {
    id: 'coupon-4',
    code: 'SAVE50K',
    type: 'fixed',
    value: 50000,
    description: 'Rp 50.000 off orders over Rp 500.000',
    descriptionId: 'Potongan Rp 50.000 untuk pesanan di atas Rp 500.000',
    minOrderValue: 500000,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    usageLimit: 2,
    usedCount: 0,
    isActive: true,
    isFirstOrderOnly: false,
    isNewUserOnly: false,
  },
  {
    id: 'coupon-5',
    code: 'FLASH30',
    type: 'percentage',
    value: 30,
    description: '30% off - Flash Sale special',
    descriptionId: 'Diskon 30% - Spesial Flash Sale',
    minOrderValue: 250000,
    maxDiscount: 150000,
    validFrom: new Date('2026-03-01'),
    validUntil: new Date('2026-03-07'),
    usageLimit: 1,
    usedCount: 0,
    isActive: true,
    isFirstOrderOnly: false,
    isNewUserOnly: false,
  },
  {
    id: 'coupon-6',
    code: 'BIRTHDAY',
    type: 'percentage',
    value: 25,
    description: '25% off - Birthday special',
    descriptionId: 'Diskon 25% - Spesial Ulang Tahun',
    minOrderValue: 150000,
    maxDiscount: 75000,
    validFrom: new Date('2026-03-01'),
    validUntil: new Date('2026-03-31'),
    usageLimit: 1,
    usedCount: 0,
    isActive: true,
    isFirstOrderOnly: false,
    isNewUserOnly: false,
  },
]

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      availableCoupons: mockCoupons,
      appliedCoupon: null,
      usedCoupons: [],

      getCouponByCode: (code: string) => {
        return get().availableCoupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        )
      },

      validateCoupon: (code, cartTotal, cartItems = []) => {
        const coupon = get().getCouponByCode(code)

        if (!coupon) {
          return {
            valid: false,
            message: 'Invalid coupon code',
            messageId: 'Kode kupon tidak valid',
          }
        }

        // Check if active
        if (!coupon.isActive) {
          return {
            valid: false,
            message: 'This coupon is no longer active',
            messageId: 'Kupon ini sudah tidak aktif',
          }
        }

        // Check validity period
        const now = new Date()
        if (now < new Date(coupon.validFrom)) {
          return {
            valid: false,
            message: 'This coupon is not yet valid',
            messageId: 'Kupon ini belum berlaku',
          }
        }

        if (now > new Date(coupon.validUntil)) {
          return {
            valid: false,
            message: 'This coupon has expired',
            messageId: 'Kupon ini sudah kadaluarsa',
          }
        }

        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
          return {
            valid: false,
            message: 'This coupon has reached its usage limit',
            messageId: 'Kupon ini sudah mencapai batas penggunaan',
          }
        }

        // Check minimum order value
        if (cartTotal < coupon.minOrderValue) {
          return {
            valid: false,
            message: `Minimum order of Rp ${coupon.minOrderValue.toLocaleString('id-ID')} required`,
            messageId: `Minimal pembelian Rp ${coupon.minOrderValue.toLocaleString('id-ID')}`,
          }
        }

        // Check applicable categories/products if specified
        if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
          const hasApplicableItem = cartItems.some(
            (item) => item.categoryId && coupon.applicableCategories!.includes(item.categoryId)
          )
          if (!hasApplicableItem) {
            return {
              valid: false,
              message: 'This coupon is not applicable to items in your cart',
              messageId: 'Kupon ini tidak berlaku untuk produk di keranjang',
            }
          }
        }

        if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
          const hasApplicableItem = cartItems.some(
            (item) => item.productId && coupon.applicableProducts!.includes(item.productId)
          )
          if (!hasApplicableItem) {
            return {
              valid: false,
              message: 'This coupon is not applicable to items in your cart',
              messageId: 'Kupon ini tidak berlaku untuk produk di keranjang',
            }
          }
        }

        return {
          valid: true,
          message: 'Coupon applied successfully',
          messageId: 'Kupon berhasil diterapkan',
          coupon,
        }
      },

      calculateDiscount: (coupon, cartTotal) => {
        if (coupon.type === 'free_shipping') {
          // Return a fixed shipping cost as discount (e.g., 15000)
          return 15000
        }

        if (coupon.type === 'fixed') {
          return Math.min(coupon.value, cartTotal)
        }

        if (coupon.type === 'percentage') {
          const discount = (cartTotal * coupon.value) / 100
          if (coupon.maxDiscount) {
            return Math.min(discount, coupon.maxDiscount)
          }
          return discount
        }

        return 0
      },

      applyCoupon: (code, cartTotal, cartItems = []) => {
        const validation = get().validateCoupon(code, cartTotal, cartItems)

        if (!validation.valid || !validation.coupon) {
          return {
            success: false,
            message: validation.message,
            messageId: validation.messageId,
          }
        }

        const discountAmount = get().calculateDiscount(validation.coupon, cartTotal)

        set({
          appliedCoupon: {
            coupon: validation.coupon,
            discountAmount,
          },
        })

        return {
          success: true,
          message: validation.message,
          messageId: validation.messageId,
        }
      },

      removeCoupon: () => {
        set({ appliedCoupon: null })
      },

      markCouponAsUsed: (couponId, orderId) => {
        set((state) => ({
          availableCoupons: state.availableCoupons.map((c) =>
            c.id === couponId ? { ...c, usedCount: c.usedCount + 1 } : c
          ),
          usedCoupons: [
            ...state.usedCoupons,
            { couponId, usedAt: new Date(), orderId },
          ],
          appliedCoupon: null,
        }))
      },

      addCoupon: (coupon) => {
        set((state) => ({
          availableCoupons: [...state.availableCoupons, coupon],
        }))
      },
    }),
    {
      name: 'uc-coupon-storage',
    }
  )
)

// Helper function to format coupon value
export const formatCouponValue = (coupon: Coupon, language: 'en' | 'id' = 'en'): string => {
  if (coupon.type === 'percentage') {
    return `${coupon.value}% OFF`
  }
  if (coupon.type === 'fixed') {
    return `Rp ${coupon.value.toLocaleString('id-ID')} OFF`
  }
  if (coupon.type === 'free_shipping') {
    return language === 'id' ? 'GRATIS ONGKIR' : 'FREE SHIPPING'
  }
  return ''
}

// Helper to check if coupon is expiring soon (within 3 days)
export const isExpiringSoon = (coupon: Coupon): boolean => {
  const now = new Date()
  const expiry = new Date(coupon.validUntil)
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 3 && diffDays > 0
}

// Helper to get remaining uses
export const getRemainingUses = (coupon: Coupon): number => {
  return coupon.usageLimit - coupon.usedCount
}
