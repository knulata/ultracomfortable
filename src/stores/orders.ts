'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type TrackingEventType =
  | 'order_placed'
  | 'payment_confirmed'
  | 'processing'
  | 'picked_up'
  | 'in_transit'
  | 'arrived_at_hub'
  | 'out_for_delivery'
  | 'delivery_attempted'
  | 'delivered'
  | 'cancelled'
  | 'refund_initiated'
  | 'refund_completed'

export interface TrackingEvent {
  id: string
  type: TrackingEventType
  title: string
  titleId: string
  description?: string
  descriptionId?: string
  location?: string
  timestamp: number
  isCompleted: boolean
}

export interface CourierInfo {
  name: string
  code: string // JNE, JNT, SiCepat, etc.
  trackingNumber: string
  trackingUrl?: string
  estimatedDelivery?: string
  driverName?: string
  driverPhone?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  nameId?: string
  variant: string
  size: string
  color: string
  quantity: number
  price: number
  image?: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  notes?: string
}

export interface Order {
  id: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  paymentMethod: string
  shippingAddress: ShippingAddress
  courier?: CourierInfo
  trackingEvents: TrackingEvent[]
  createdAt: number
  updatedAt: number
  paidAt?: number
  shippedAt?: number
  deliveredAt?: number
  cancelledAt?: number
}

interface OrdersState {
  orders: Order[]

  // Actions
  getOrderById: (id: string) => Order | undefined
  getOrdersByStatus: (status: OrderStatus | 'all') => Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addTrackingEvent: (orderId: string, event: Omit<TrackingEvent, 'id'>) => void

  // Helpers
  getActiveOrders: () => Order[]
  getPastOrders: () => Order[]
}

// Generate tracking events for different order states
function generateTrackingEvents(status: OrderStatus, createdAt: number): TrackingEvent[] {
  const events: TrackingEvent[] = []
  const baseTime = createdAt

  // Order placed
  events.push({
    id: 'evt-1',
    type: 'order_placed',
    title: 'Order Placed',
    titleId: 'Pesanan Dibuat',
    description: 'Your order has been received',
    descriptionId: 'Pesanan Anda telah diterima',
    timestamp: baseTime,
    isCompleted: true,
  })

  if (status === 'pending_payment') return events

  // Payment confirmed
  events.push({
    id: 'evt-2',
    type: 'payment_confirmed',
    title: 'Payment Confirmed',
    titleId: 'Pembayaran Dikonfirmasi',
    description: 'Payment has been verified',
    descriptionId: 'Pembayaran telah diverifikasi',
    timestamp: baseTime + 2 * 60 * 1000, // +2 minutes
    isCompleted: true,
  })

  if (status === 'paid') return events

  // Processing
  events.push({
    id: 'evt-3',
    type: 'processing',
    title: 'Order Processing',
    titleId: 'Pesanan Diproses',
    description: 'Preparing your items for shipment',
    descriptionId: 'Menyiapkan barang untuk pengiriman',
    timestamp: baseTime + 4 * 60 * 60 * 1000, // +4 hours
    isCompleted: true,
  })

  if (status === 'processing') return events

  if (status === 'cancelled') {
    events.push({
      id: 'evt-cancelled',
      type: 'cancelled',
      title: 'Order Cancelled',
      titleId: 'Pesanan Dibatalkan',
      description: 'Order has been cancelled',
      descriptionId: 'Pesanan telah dibatalkan',
      timestamp: baseTime + 5 * 60 * 60 * 1000,
      isCompleted: true,
    })
    return events
  }

  // Picked up by courier
  events.push({
    id: 'evt-4',
    type: 'picked_up',
    title: 'Picked Up by Courier',
    titleId: 'Diambil Kurir',
    description: 'Package picked up from warehouse',
    descriptionId: 'Paket diambil dari gudang',
    location: 'Jakarta Warehouse',
    timestamp: baseTime + 24 * 60 * 60 * 1000, // +1 day
    isCompleted: true,
  })

  // In transit
  events.push({
    id: 'evt-5',
    type: 'in_transit',
    title: 'In Transit',
    titleId: 'Dalam Perjalanan',
    description: 'Package is on the way',
    descriptionId: 'Paket dalam perjalanan',
    location: 'Jakarta Sorting Center',
    timestamp: baseTime + 30 * 60 * 60 * 1000, // +1.25 days
    isCompleted: true,
  })

  if (status === 'shipped') {
    // Add pending events
    events.push({
      id: 'evt-6',
      type: 'arrived_at_hub',
      title: 'Arrived at Local Hub',
      titleId: 'Tiba di Hub Lokal',
      timestamp: 0,
      isCompleted: false,
    })
    events.push({
      id: 'evt-7',
      type: 'out_for_delivery',
      title: 'Out for Delivery',
      titleId: 'Sedang Diantar',
      timestamp: 0,
      isCompleted: false,
    })
    events.push({
      id: 'evt-8',
      type: 'delivered',
      title: 'Delivered',
      titleId: 'Terkirim',
      timestamp: 0,
      isCompleted: false,
    })
    return events
  }

  // Arrived at hub
  events.push({
    id: 'evt-6',
    type: 'arrived_at_hub',
    title: 'Arrived at Local Hub',
    titleId: 'Tiba di Hub Lokal',
    description: 'Package arrived at destination city',
    descriptionId: 'Paket tiba di kota tujuan',
    location: 'Jakarta Selatan Hub',
    timestamp: baseTime + 48 * 60 * 60 * 1000, // +2 days
    isCompleted: true,
  })

  // Out for delivery
  events.push({
    id: 'evt-7',
    type: 'out_for_delivery',
    title: 'Out for Delivery',
    titleId: 'Sedang Diantar',
    description: 'Package is out for delivery',
    descriptionId: 'Paket sedang dalam pengantaran',
    location: 'With courier',
    timestamp: baseTime + 54 * 60 * 60 * 1000, // +2.25 days
    isCompleted: true,
  })

  if (status === 'out_for_delivery') {
    events.push({
      id: 'evt-8',
      type: 'delivered',
      title: 'Delivered',
      titleId: 'Terkirim',
      timestamp: 0,
      isCompleted: false,
    })
    return events
  }

  // Delivered
  events.push({
    id: 'evt-8',
    type: 'delivered',
    title: 'Delivered',
    titleId: 'Terkirim',
    description: 'Package delivered successfully',
    descriptionId: 'Paket berhasil diterima',
    location: 'Received by: Sarah',
    timestamp: baseTime + 56 * 60 * 60 * 1000, // +2.33 days
    isCompleted: true,
  })

  return events
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'UC-20260301001',
    status: 'out_for_delivery',
    items: [
      {
        id: 'item-1',
        productId: 'premium-cotton-tee',
        name: 'Premium Cotton T-Shirt',
        nameId: 'Kaos Katun Premium',
        variant: 'Black / M',
        size: 'M',
        color: 'Black',
        quantity: 2,
        price: 199000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      },
      {
        id: 'item-2',
        productId: 'high-waist-pants',
        name: 'High-Waist Wide Leg Pants',
        nameId: 'Celana Kulot High-Waist',
        variant: 'Beige / S',
        size: 'S',
        color: 'Beige',
        quantity: 1,
        price: 299000,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200',
      },
    ],
    subtotal: 697000,
    shippingCost: 0,
    discount: 50000,
    total: 647000,
    paymentMethod: 'GoPay',
    shippingAddress: {
      fullName: 'Sarah Johnson',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Apt 4B',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
      notes: 'Gerbang hijau, sebelah warung',
    },
    courier: {
      name: 'JNE Express',
      code: 'JNE',
      trackingNumber: 'JNE1234567890123',
      trackingUrl: 'https://www.jne.co.id/id/tracking',
      estimatedDelivery: '2026-03-03',
      driverName: 'Budi Santoso',
      driverPhone: '081298765432',
    },
    trackingEvents: generateTrackingEvents('out_for_delivery', Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    createdAt: Date.now() - 2.5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    paidAt: Date.now() - 2.5 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000,
    shippedAt: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'UC-20260228002',
    status: 'shipped',
    items: [
      {
        id: 'item-3',
        productId: 'flowy-midi-dress',
        name: 'Floral Print Midi Dress',
        nameId: 'Dress Midi Floral',
        variant: 'Blue / M',
        size: 'M',
        color: 'Blue',
        quantity: 1,
        price: 349000,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200',
      },
    ],
    subtotal: 349000,
    shippingCost: 15000,
    discount: 0,
    total: 364000,
    paymentMethod: 'Bank Transfer (BCA)',
    shippingAddress: {
      fullName: 'Sarah Johnson',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Apt 4B',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
    },
    courier: {
      name: 'SiCepat REG',
      code: 'SICEPAT',
      trackingNumber: 'SCP0012345678901',
      trackingUrl: 'https://www.sicepat.com/checkAwb',
      estimatedDelivery: '2026-03-04',
    },
    trackingEvents: generateTrackingEvents('shipped', Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    paidAt: Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
    shippedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'UC-20260225003',
    status: 'delivered',
    items: [
      {
        id: 'item-4',
        productId: 'relaxed-blazer',
        name: 'Relaxed Fit Blazer',
        nameId: 'Blazer Relaxed Fit',
        variant: 'Navy / L',
        size: 'L',
        color: 'Navy',
        quantity: 1,
        price: 549000,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200',
      },
      {
        id: 'item-5',
        productId: 'ribbed-knit-top',
        name: 'Ribbed Knit Top',
        nameId: 'Atasan Rajut Ribbed',
        variant: 'White / M',
        size: 'M',
        color: 'White',
        quantity: 2,
        price: 149000,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200',
      },
    ],
    subtotal: 847000,
    shippingCost: 0,
    discount: 100000,
    total: 747000,
    paymentMethod: 'OVO',
    shippingAddress: {
      fullName: 'Sarah Johnson',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Apt 4B',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
    },
    courier: {
      name: 'J&T Express',
      code: 'JNT',
      trackingNumber: 'JT1234567890',
      trackingUrl: 'https://www.jet.co.id/track',
    },
    trackingEvents: generateTrackingEvents('delivered', Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    paidAt: Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
    shippedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    deliveredAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'UC-20260220004',
    status: 'delivered',
    items: [
      {
        id: 'item-6',
        productId: 'basic-vneck-tee',
        name: 'Basic V-Neck Tee',
        nameId: 'Kaos V-Neck Basic',
        variant: 'White / M',
        size: 'M',
        color: 'White',
        quantity: 3,
        price: 99000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      },
    ],
    subtotal: 297000,
    shippingCost: 15000,
    discount: 0,
    total: 312000,
    paymentMethod: 'QRIS',
    shippingAddress: {
      fullName: 'Sarah Johnson',
      phone: '081234567890',
      address: 'Gedung Graha Niaga Lt. 15',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10310',
    },
    courier: {
      name: 'JNE REG',
      code: 'JNE',
      trackingNumber: 'JNE9876543210',
    },
    trackingEvents: generateTrackingEvents('delivered', Date.now() - 12 * 24 * 60 * 60 * 1000),
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    paidAt: Date.now() - 12 * 24 * 60 * 60 * 1000 + 1 * 60 * 1000,
    shippedAt: Date.now() - 11 * 24 * 60 * 60 * 1000,
    deliveredAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'UC-20260215005',
    status: 'cancelled',
    items: [
      {
        id: 'item-7',
        productId: 'cropped-denim-jacket',
        name: 'Cropped Denim Jacket',
        nameId: 'Jaket Denim Crop',
        variant: 'Light Blue / S',
        size: 'S',
        color: 'Light Blue',
        quantity: 1,
        price: 399000,
        image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=200',
      },
    ],
    subtotal: 399000,
    shippingCost: 15000,
    discount: 0,
    total: 414000,
    paymentMethod: 'Credit Card',
    shippingAddress: {
      fullName: 'Sarah Johnson',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Apt 4B',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
    },
    trackingEvents: generateTrackingEvents('cancelled', Date.now() - 18 * 24 * 60 * 60 * 1000),
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 17 * 24 * 60 * 60 * 1000,
    cancelledAt: Date.now() - 17 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'UC-20260303006',
    status: 'processing',
    items: [
      {
        id: 'item-8',
        productId: 'linen-summer-dress',
        name: 'Linen Summer Dress',
        nameId: 'Dress Linen Musim Panas',
        variant: 'Sage / S',
        size: 'S',
        color: 'Sage',
        quantity: 1,
        price: 429000,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200',
      },
    ],
    subtotal: 429000,
    shippingCost: 0,
    discount: 0,
    total: 429000,
    paymentMethod: 'Dana',
    shippingAddress: {
      fullName: 'Sarah Johnson',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123, Apt 4B',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
    },
    trackingEvents: generateTrackingEvents('processing', Date.now() - 6 * 60 * 60 * 1000),
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    paidAt: Date.now() - 6 * 60 * 60 * 1000 + 3 * 60 * 1000,
  },
]

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id)
      },

      getOrdersByStatus: (status) => {
        if (status === 'all') return get().orders
        return get().orders.filter((o) => o.status === status)
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: Date.now() }
              : order
          ),
        }))
      },

      addTrackingEvent: (orderId, event) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  trackingEvents: [
                    ...order.trackingEvents.filter((e) => e.isCompleted),
                    { ...event, id: `evt-${Date.now()}` },
                    ...order.trackingEvents.filter((e) => !e.isCompleted),
                  ],
                  updatedAt: Date.now(),
                }
              : order
          ),
        }))
      },

      getActiveOrders: () => {
        const activeStatuses: OrderStatus[] = ['pending_payment', 'paid', 'processing', 'shipped', 'out_for_delivery']
        return get().orders.filter((o) => activeStatuses.includes(o.status))
      },

      getPastOrders: () => {
        const pastStatuses: OrderStatus[] = ['delivered', 'cancelled', 'refunded']
        return get().orders.filter((o) => pastStatuses.includes(o.status))
      },
    }),
    {
      name: 'alyanoor-orders',
      partialize: () => ({}), // Don't persist, use mock data
    }
  )
)

// Helper functions
export function getStatusLabel(status: OrderStatus, language: 'en' | 'id' = 'en'): string {
  const labels: Record<OrderStatus, { en: string; id: string }> = {
    pending_payment: { en: 'Pending Payment', id: 'Menunggu Pembayaran' },
    paid: { en: 'Paid', id: 'Dibayar' },
    processing: { en: 'Processing', id: 'Diproses' },
    shipped: { en: 'Shipped', id: 'Dikirim' },
    out_for_delivery: { en: 'Out for Delivery', id: 'Sedang Diantar' },
    delivered: { en: 'Delivered', id: 'Terkirim' },
    cancelled: { en: 'Cancelled', id: 'Dibatalkan' },
    refunded: { en: 'Refunded', id: 'Dikembalikan' },
  }
  return labels[status][language]
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending_payment: 'text-yellow-600 bg-yellow-50',
    paid: 'text-blue-600 bg-blue-50',
    processing: 'text-blue-600 bg-blue-50',
    shipped: 'text-purple-600 bg-purple-50',
    out_for_delivery: 'text-orange-600 bg-orange-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
    refunded: 'text-gray-600 bg-gray-50',
  }
  return colors[status]
}

export function formatOrderDate(timestamp: number, language: 'en' | 'id' = 'en'): string {
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatShortDate(timestamp: number, language: 'en' | 'id' = 'en'): string {
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}
