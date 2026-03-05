import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore, formatPrice } from '@/stores/cart'
import type { Product, ProductVariant } from '@/types/database'

const mockProduct: Product = {
  id: 'prod-1',
  brand_id: 'brand-1',
  category_id: 'cat-1',
  seller_id: null,
  name: 'Test Product',
  slug: 'test-product',
  description: 'A test product',
  base_price: 200000,
  sale_price: null,
  images: [],
  tags: [],
  is_active: true,
  is_featured: false,
  total_sold: 0,
  rating_avg: 0,
  rating_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockVariant: ProductVariant = {
  id: 'var-1',
  product_id: 'prod-1',
  sku: 'TEST-S-BLK',
  size: 'S',
  color: 'Black',
  color_hex: '#000000',
  price_adjustment: 0,
  stock: 10,
  images: [],
  is_active: true,
  created_at: new Date().toISOString(),
}

const mockVariant2: ProductVariant = {
  ...mockVariant,
  id: 'var-2',
  sku: 'TEST-M-BLK',
  size: 'M',
  price_adjustment: 50000,
}

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('starts with empty cart', () => {
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('adds item to cart', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].variantId).toBe('var-1')
    expect(items[0].quantity).toBe(1)
  })

  it('increments quantity for existing item', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct)
    useCartStore.getState().addItem(mockVariant, mockProduct, 2)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(3)
  })

  it('adds different variants as separate items', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct)
    useCartStore.getState().addItem(mockVariant2, mockProduct)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(2)
  })

  it('removes item from cart', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct)
    useCartStore.getState().addItem(mockVariant2, mockProduct)
    useCartStore.getState().removeItem('var-1')
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].variantId).toBe('var-2')
  })

  it('updates item quantity', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct)
    useCartStore.getState().updateQuantity('var-1', 5)
    const { items } = useCartStore.getState()
    expect(items[0].quantity).toBe(5)
  })

  it('removes item when quantity set to 0', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct)
    useCartStore.getState().updateQuantity('var-1', 0)
    const { items } = useCartStore.getState()
    expect(items).toHaveLength(0)
  })

  it('calculates item count correctly', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct, 3)
    useCartStore.getState().addItem(mockVariant2, mockProduct, 2)
    expect(useCartStore.getState().getItemCount()).toBe(5)
  })

  it('calculates subtotal with base price', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct, 2)
    // 200000 * 2 = 400000
    expect(useCartStore.getState().getSubtotal()).toBe(400000)
  })

  it('calculates subtotal with price adjustment', () => {
    useCartStore.getState().addItem(mockVariant2, mockProduct, 1)
    // (200000 + 50000) * 1 = 250000
    expect(useCartStore.getState().getSubtotal()).toBe(250000)
  })

  it('calculates subtotal with sale price', () => {
    const saleProduct = { ...mockProduct, sale_price: 150000 }
    useCartStore.getState().addItem(mockVariant, saleProduct, 2)
    // 150000 * 2 = 300000
    expect(useCartStore.getState().getSubtotal()).toBe(300000)
  })

  it('clears cart', () => {
    useCartStore.getState().addItem(mockVariant, mockProduct, 3)
    useCartStore.getState().addItem(mockVariant2, mockProduct, 2)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})

describe('formatPrice', () => {
  it('formats price in IDR', () => {
    const formatted = formatPrice(200000)
    expect(formatted).toContain('200')
    expect(formatted).toMatch(/Rp|IDR/)
  })

  it('formats zero price', () => {
    const formatted = formatPrice(0)
    expect(formatted).toContain('0')
  })

  it('formats large price', () => {
    const formatted = formatPrice(1500000)
    expect(formatted).toContain('1.500.000')
  })
})
