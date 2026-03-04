'use client'

import { create } from 'zustand'

export interface BundleProduct {
  id: string
  slug: string
  name: string
  nameId: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  size?: string
  color?: string
}

export interface ProductBundle {
  id: string
  mainProductId: string
  products: BundleProduct[]
  bundleDiscount: number // Percentage discount when buying all together
  timesOrderedTogether: number
}

interface BundlesState {
  // Get bundle for a product
  getBundleForProduct: (productId: string) => ProductBundle | null

  // Calculate bundle price
  calculateBundlePrice: (bundle: ProductBundle, selectedIds: string[]) => {
    originalTotal: number
    discountedTotal: number
    savings: number
    discountPercent: number
  }
}

// Mock bundle data - products frequently bought together
const mockBundles: ProductBundle[] = [
  {
    id: 'bundle-1',
    mainProductId: 'product-1', // Premium Oversized Cotton T-Shirt
    bundleDiscount: 15, // 15% off when buying all together
    timesOrderedTogether: 847,
    products: [
      {
        id: 'bundle-1-item-1',
        slug: 'high-waist-straight-jeans',
        name: 'High Waist Straight Jeans',
        nameId: 'Jeans Lurus High Waist',
        price: 399000,
        originalPrice: 499000,
        category: 'Bottoms',
      },
      {
        id: 'bundle-1-item-2',
        slug: 'minimal-canvas-tote',
        name: 'Minimal Canvas Tote Bag',
        nameId: 'Tas Tote Kanvas Minimalis',
        price: 199000,
        category: 'Accessories',
      },
      {
        id: 'bundle-1-item-3',
        slug: 'chunky-gold-chain-necklace',
        name: 'Chunky Gold Chain Necklace',
        nameId: 'Kalung Rantai Emas Tebal',
        price: 149000,
        originalPrice: 179000,
        category: 'Accessories',
      },
    ],
  },
  {
    id: 'bundle-2',
    mainProductId: 'floral-wrap-dress',
    bundleDiscount: 12,
    timesOrderedTogether: 523,
    products: [
      {
        id: 'bundle-2-item-1',
        slug: 'strappy-block-heels',
        name: 'Strappy Block Heels',
        nameId: 'Heels Block Tali',
        price: 349000,
        category: 'Shoes',
      },
      {
        id: 'bundle-2-item-2',
        slug: 'pearl-drop-earrings',
        name: 'Pearl Drop Earrings',
        nameId: 'Anting Mutiara Jatuh',
        price: 129000,
        category: 'Accessories',
      },
    ],
  },
  {
    id: 'bundle-3',
    mainProductId: 'cropped-denim-jacket',
    bundleDiscount: 10,
    timesOrderedTogether: 312,
    products: [
      {
        id: 'bundle-3-item-1',
        slug: 'basic-white-tee',
        name: 'Basic White T-Shirt',
        nameId: 'Kaos Putih Polos',
        price: 149000,
        category: 'Tops',
      },
      {
        id: 'bundle-3-item-2',
        slug: 'mom-fit-jeans',
        name: 'Mom Fit Jeans',
        nameId: 'Jeans Mom Fit',
        price: 379000,
        originalPrice: 449000,
        category: 'Bottoms',
      },
      {
        id: 'bundle-3-item-3',
        slug: 'white-sneakers',
        name: 'Classic White Sneakers',
        nameId: 'Sneakers Putih Klasik',
        price: 449000,
        category: 'Shoes',
      },
    ],
  },
]

export const useBundlesStore = create<BundlesState>()((set, get) => ({
  getBundleForProduct: (productId) => {
    return mockBundles.find(b => b.mainProductId === productId) || mockBundles[0] // Default to first bundle for demo
  },

  calculateBundlePrice: (bundle, selectedIds) => {
    const selectedProducts = bundle.products.filter(p => selectedIds.includes(p.id))
    const originalTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0)

    // Only apply bundle discount if all items are selected
    const allSelected = selectedIds.length === bundle.products.length
    const discountPercent = allSelected ? bundle.bundleDiscount : 0
    const discountedTotal = originalTotal * (1 - discountPercent / 100)
    const savings = originalTotal - discountedTotal

    return {
      originalTotal,
      discountedTotal: Math.round(discountedTotal),
      savings: Math.round(savings),
      discountPercent,
    }
  },
}))
