'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Fulfillment workflow:
// 1. PENDING - New order received
// 2. PICKING - Items being picked from warehouse
// 3. QC - Quality check in progress
// 4. PACKING - Being packed
// 5. READY_TO_SHIP - Packed and ready
// 6. SHIPPED - Handed to courier
// 7. DELIVERED - Customer received
// 8. RETURNED - Customer returned item
// 9. COMPLETED - Order closed (delivered or returned processed)

export type FulfillmentStatus =
  | 'pending'
  | 'picking'
  | 'qc'
  | 'packing'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'completed'
  | 'cancelled'

export type ShippingCourier = 'jne' | 'jnt' | 'sicepat' | 'anteraja' | 'ninja' | 'gosend' | 'grab'

export interface FulfillmentItem {
  productId: string
  productName: string
  sku: string
  partnerId: string
  partnerName: string
  quantity: number
  rackLocation: string
  costPrice: number
  sellingPrice: number
  // Pick status
  picked: boolean
  pickedAt?: string
  // QC status
  qcPassed?: boolean
  qcNote?: string
}

export interface FulfillmentOrder {
  id: string
  orderId: string
  orderNumber: string
  // Customer
  customerName: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerProvince: string
  customerPostalCode: string
  // Items
  items: FulfillmentItem[]
  totalItems: number
  totalQuantity: number
  // Pricing
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  // Shipping
  courier: ShippingCourier
  shippingService: string // REG, YES, OKE, etc.
  awbNumber?: string
  weight: number // in grams
  // Status
  status: FulfillmentStatus
  statusNote?: string
  // Priority
  priority: 'normal' | 'express' | 'same_day'
  // Timestamps
  orderedAt: string
  pickedAt?: string
  qcAt?: string
  packedAt?: string
  shippedAt?: string
  deliveredAt?: string
  returnedAt?: string
  completedAt?: string
  // Fulfillment staff
  pickedBy?: string
  packedBy?: string
  // Return info
  returnReason?: string
  returnNote?: string
}

export interface ReturnItem {
  id: string
  orderId: string
  orderNumber: string
  productId: string
  productName: string
  sku: string
  partnerId: string
  partnerName: string
  quantity: number
  reason: 'defect' | 'wrong_item' | 'not_as_described' | 'damaged' | 'customer_change_mind'
  condition: 'good' | 'damaged' | 'unusable'
  refundAmount: number
  status: 'pending' | 'inspecting' | 'approved' | 'rejected' | 'refunded' | 'restocked'
  note?: string
  images?: string[]
  createdAt: string
  processedAt?: string
  processedBy?: string
}

interface FulfillmentState {
  orders: FulfillmentOrder[]
  returns: ReturnItem[]

  // Order Management
  addOrder: (order: Omit<FulfillmentOrder, 'id' | 'status' | 'orderedAt'>) => string
  updateOrderStatus: (id: string, status: FulfillmentStatus, note?: string) => void
  getOrderById: (id: string) => FulfillmentOrder | undefined
  getOrdersByStatus: (status: FulfillmentStatus) => FulfillmentOrder[]

  // Pick & Pack
  markItemPicked: (orderId: string, productId: string) => void
  markAllItemsPicked: (orderId: string) => void
  startQC: (orderId: string) => void
  completeQC: (orderId: string, passed: boolean, note?: string) => void
  completePacking: (orderId: string, packedBy: string) => void

  // Shipping
  setAWB: (orderId: string, awbNumber: string) => void
  markShipped: (orderId: string) => void
  markDelivered: (orderId: string) => void

  // Returns
  createReturn: (returnData: Omit<ReturnItem, 'id' | 'status' | 'createdAt'>) => string
  updateReturnStatus: (id: string, status: ReturnItem['status'], note?: string) => void
  getReturnsByStatus: (status: ReturnItem['status']) => ReturnItem[]

  // Stats
  getFulfillmentStats: () => {
    pending: number
    picking: number
    packing: number
    readyToShip: number
    shipped: number
    todayOrders: number
    todayShipped: number
    pendingReturns: number
  }

  // Pick List
  getPickList: () => {
    orderId: string
    orderNumber: string
    items: FulfillmentItem[]
    priority: string
  }[]
}

const courierNames: Record<ShippingCourier, string> = {
  jne: 'JNE',
  jnt: 'J&T Express',
  sicepat: 'SiCepat',
  anteraja: 'AnterAja',
  ninja: 'Ninja Express',
  gosend: 'GoSend',
  grab: 'GrabExpress',
}

// Generate AWB number
const generateAWB = (courier: ShippingCourier): string => {
  const prefix = courier.toUpperCase().substring(0, 2)
  const timestamp = Date.now().toString().slice(-10)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${timestamp}${random}`
}

// Mock orders for demo
const mockOrders: FulfillmentOrder[] = [
  {
    id: 'ful-1',
    orderId: 'order-1',
    orderNumber: 'UC240306001',
    customerName: 'Dewi Kartika',
    customerPhone: '081234567890',
    customerAddress: 'Jl. Sudirman No. 123, Kelurahan Menteng',
    customerCity: 'Jakarta Pusat',
    customerProvince: 'DKI Jakarta',
    customerPostalCode: '10310',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gamis Syari Brukat Premium',
        sku: 'UC-GAM-ABC123',
        partnerId: 'partner-1',
        partnerName: 'Toko Kain Berkah',
        quantity: 1,
        rackLocation: 'A-05-2',
        costPrice: 185000,
        sellingPrice: 329000,
        picked: false,
      },
      {
        productId: 'prod-2',
        productName: 'Hijab Voal Premium',
        sku: 'UC-HIJ-DEF456',
        partnerId: 'partner-2',
        partnerName: 'Rahayu Fashion',
        quantity: 2,
        rackLocation: 'B-12-1',
        costPrice: 45000,
        sellingPrice: 89000,
        picked: false,
      },
    ],
    totalItems: 2,
    totalQuantity: 3,
    subtotal: 507000,
    shippingCost: 15000,
    discount: 0,
    total: 522000,
    courier: 'jne',
    shippingService: 'REG',
    weight: 500,
    status: 'pending',
    priority: 'normal',
    orderedAt: '2024-03-06T08:30:00Z',
  },
  {
    id: 'ful-2',
    orderId: 'order-2',
    orderNumber: 'UC240306002',
    customerName: 'Rina Wulandari',
    customerPhone: '082345678901',
    customerAddress: 'Jl. Gatot Subroto No. 45',
    customerCity: 'Bandung',
    customerProvince: 'Jawa Barat',
    customerPostalCode: '40262',
    items: [
      {
        productId: 'prod-3',
        productName: 'Tunik Batik Kombinasi',
        sku: 'UC-TUN-GHI789',
        partnerId: 'partner-1',
        partnerName: 'Toko Kain Berkah',
        quantity: 1,
        rackLocation: 'C-03-4',
        costPrice: 125000,
        sellingPrice: 215000,
        picked: true,
        pickedAt: '2024-03-06T10:00:00Z',
      },
    ],
    totalItems: 1,
    totalQuantity: 1,
    subtotal: 215000,
    shippingCost: 18000,
    discount: 20000,
    total: 213000,
    courier: 'sicepat',
    shippingService: 'BEST',
    weight: 300,
    status: 'picking',
    priority: 'express',
    orderedAt: '2024-03-06T07:15:00Z',
    pickedAt: '2024-03-06T10:00:00Z',
  },
  {
    id: 'ful-3',
    orderId: 'order-3',
    orderNumber: 'UC240305015',
    customerName: 'Siti Aminah',
    customerPhone: '083456789012',
    customerAddress: 'Jl. Diponegoro No. 78',
    customerCity: 'Surabaya',
    customerProvince: 'Jawa Timur',
    customerPostalCode: '60241',
    items: [
      {
        productId: 'prod-4',
        productName: 'Rok Plisket Panjang Premium',
        sku: 'UC-ROK-JKL012',
        partnerId: 'partner-4',
        partnerName: 'Linda Boutique',
        quantity: 2,
        rackLocation: 'A-18-3',
        costPrice: 85000,
        sellingPrice: 145000,
        picked: true,
        pickedAt: '2024-03-05T14:30:00Z',
        qcPassed: true,
      },
    ],
    totalItems: 1,
    totalQuantity: 2,
    subtotal: 290000,
    shippingCost: 22000,
    discount: 0,
    total: 312000,
    courier: 'jnt',
    shippingService: 'EZ',
    weight: 400,
    status: 'ready_to_ship',
    priority: 'normal',
    orderedAt: '2024-03-05T11:00:00Z',
    pickedAt: '2024-03-05T14:30:00Z',
    qcAt: '2024-03-05T15:00:00Z',
    packedAt: '2024-03-05T15:30:00Z',
    packedBy: 'Staff A',
    awbNumber: 'JT1234567890123',
  },
  {
    id: 'ful-4',
    orderId: 'order-4',
    orderNumber: 'UC240304022',
    customerName: 'Nur Hidayah',
    customerPhone: '084567890123',
    customerAddress: 'Jl. Ahmad Yani No. 156',
    customerCity: 'Semarang',
    customerProvince: 'Jawa Tengah',
    customerPostalCode: '50132',
    items: [
      {
        productId: 'prod-5',
        productName: 'Outer Cardigan Rajut',
        sku: 'UC-OUT-MNO345',
        partnerId: 'partner-2',
        partnerName: 'Rahayu Fashion',
        quantity: 1,
        rackLocation: 'D-07-2',
        costPrice: 95000,
        sellingPrice: 165000,
        picked: true,
        pickedAt: '2024-03-04T10:00:00Z',
        qcPassed: true,
      },
    ],
    totalItems: 1,
    totalQuantity: 1,
    subtotal: 165000,
    shippingCost: 20000,
    discount: 15000,
    total: 170000,
    courier: 'anteraja',
    shippingService: 'Regular',
    weight: 250,
    status: 'shipped',
    priority: 'normal',
    orderedAt: '2024-03-04T08:00:00Z',
    pickedAt: '2024-03-04T10:00:00Z',
    qcAt: '2024-03-04T10:30:00Z',
    packedAt: '2024-03-04T11:00:00Z',
    packedBy: 'Staff B',
    shippedAt: '2024-03-04T14:00:00Z',
    awbNumber: 'AJ0987654321098',
  },
]

const mockReturns: ReturnItem[] = [
  {
    id: 'ret-1',
    orderId: 'order-10',
    orderNumber: 'UC240301005',
    productId: 'prod-10',
    productName: 'Gamis Motif Bunga',
    sku: 'UC-GAM-XYZ789',
    partnerId: 'partner-1',
    partnerName: 'Toko Kain Berkah',
    quantity: 1,
    reason: 'defect',
    condition: 'damaged',
    refundAmount: 275000,
    status: 'pending',
    note: 'Jahitan bagian lengan lepas',
    createdAt: '2024-03-05T16:00:00Z',
  },
]

export const useFulfillmentStore = create<FulfillmentState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      returns: mockReturns,

      addOrder: (orderData) => {
        const id = `ful-${Date.now()}`
        const newOrder: FulfillmentOrder = {
          ...orderData,
          id,
          status: 'pending',
          orderedAt: new Date().toISOString(),
        }

        set((state) => ({
          orders: [...state.orders, newOrder],
        }))

        return id
      },

      updateOrderStatus: (id, status, note) => {
        const now = new Date().toISOString()
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  status,
                  statusNote: note,
                  ...(status === 'picking' && { pickedAt: now }),
                  ...(status === 'qc' && { qcAt: now }),
                  ...(status === 'packing' && { packedAt: now }),
                  ...(status === 'shipped' && { shippedAt: now }),
                  ...(status === 'delivered' && { deliveredAt: now }),
                  ...(status === 'returned' && { returnedAt: now }),
                  ...(status === 'completed' && { completedAt: now }),
                }
              : order
          ),
        }))
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id)
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status)
      },

      markItemPicked: (orderId, productId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item.productId === productId
                      ? { ...item, picked: true, pickedAt: new Date().toISOString() }
                      : item
                  ),
                }
              : order
          ),
        }))
      },

      markAllItemsPicked: (orderId) => {
        const now = new Date().toISOString()
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: 'qc' as FulfillmentStatus,
                  pickedAt: now,
                  items: order.items.map((item) => ({
                    ...item,
                    picked: true,
                    pickedAt: item.pickedAt || now,
                  })),
                }
              : order
          ),
        }))
      },

      startQC: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status: 'qc' as FulfillmentStatus, qcAt: new Date().toISOString() }
              : order
          ),
        }))
      },

      completeQC: (orderId, passed, note) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: passed ? ('packing' as FulfillmentStatus) : ('pending' as FulfillmentStatus),
                  items: order.items.map((item) => ({
                    ...item,
                    qcPassed: passed,
                    qcNote: note,
                  })),
                }
              : order
          ),
        }))
      },

      completePacking: (orderId, packedBy) => {
        const order = get().orders.find((o) => o.id === orderId)
        if (!order) return

        const awbNumber = generateAWB(order.courier)

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'ready_to_ship' as FulfillmentStatus,
                  packedAt: new Date().toISOString(),
                  packedBy,
                  awbNumber,
                }
              : o
          ),
        }))
      },

      setAWB: (orderId, awbNumber) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, awbNumber } : order
          ),
        }))
      },

      markShipped: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: 'shipped' as FulfillmentStatus,
                  shippedAt: new Date().toISOString(),
                }
              : order
          ),
        }))
      },

      markDelivered: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: 'delivered' as FulfillmentStatus,
                  deliveredAt: new Date().toISOString(),
                }
              : order
          ),
        }))
      },

      createReturn: (returnData) => {
        const id = `ret-${Date.now()}`
        const newReturn: ReturnItem = {
          ...returnData,
          id,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          returns: [...state.returns, newReturn],
        }))

        return id
      },

      updateReturnStatus: (id, status, note) => {
        set((state) => ({
          returns: state.returns.map((ret) =>
            ret.id === id
              ? {
                  ...ret,
                  status,
                  note: note || ret.note,
                  processedAt: ['approved', 'rejected', 'refunded', 'restocked'].includes(status)
                    ? new Date().toISOString()
                    : ret.processedAt,
                }
              : ret
          ),
        }))
      },

      getReturnsByStatus: (status) => {
        return get().returns.filter((ret) => ret.status === status)
      },

      getFulfillmentStats: () => {
        const orders = get().orders
        const returns = get().returns
        const today = new Date().toDateString()

        return {
          pending: orders.filter((o) => o.status === 'pending').length,
          picking: orders.filter((o) => o.status === 'picking').length,
          packing: orders.filter((o) => ['qc', 'packing'].includes(o.status)).length,
          readyToShip: orders.filter((o) => o.status === 'ready_to_ship').length,
          shipped: orders.filter((o) => o.status === 'shipped').length,
          todayOrders: orders.filter((o) =>
            new Date(o.orderedAt).toDateString() === today
          ).length,
          todayShipped: orders.filter((o) =>
            o.shippedAt && new Date(o.shippedAt).toDateString() === today
          ).length,
          pendingReturns: returns.filter((r) =>
            ['pending', 'inspecting'].includes(r.status)
          ).length,
        }
      },

      getPickList: () => {
        const orders = get().orders.filter((o) =>
          ['pending', 'picking'].includes(o.status)
        )

        // Sort by priority (same_day > express > normal) then by order time
        const priorityOrder = { same_day: 0, express: 1, normal: 2 }
        orders.sort((a, b) => {
          const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
          if (pDiff !== 0) return pDiff
          return new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime()
        })

        return orders.map((order) => ({
          orderId: order.id,
          orderNumber: order.orderNumber,
          items: order.items.filter((item) => !item.picked),
          priority: order.priority,
        }))
      },
    }),
    {
      name: 'alyanoor-fulfillment',
    }
  )
)

export { courierNames }
