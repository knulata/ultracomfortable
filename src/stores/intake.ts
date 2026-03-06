'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Product intake workflow:
// 1. DROP_OFF - Partner brings items to UC
// 2. PENDING_PHOTO - Waiting in photo queue
// 3. PHOTOGRAPHING - Currently being photographed
// 4. EDITING - Photos being edited
// 5. PENDING_UPLOAD - Ready to upload to store
// 6. LISTING - Setting price and details
// 7. ACTIVE - Live on store

export type IntakeStatus =
  | 'drop_off'
  | 'pending_photo'
  | 'photographing'
  | 'editing'
  | 'pending_upload'
  | 'listing'
  | 'active'
  | 'rejected'

export interface IntakeItem {
  id: string
  // Partner info
  partnerId: string
  partnerName: string
  shopName: string
  // Product info
  productName: string
  category: string
  sku: string
  description?: string
  // Quantity
  quantity: number
  // Pricing
  costPrice: number // Partner's price
  suggestedPrice?: number // UC suggested selling price
  sellingPrice?: number // Final selling price
  // Photos
  photos: string[]
  photoCount: number
  // Warehouse
  rackLocation: string
  // Status
  status: IntakeStatus
  statusNote?: string
  // Timestamps
  droppedOffAt: string
  photoStartedAt?: string
  photoCompletedAt?: string
  listedAt?: string
  // Quality
  qualityScore?: number // 1-5 rating
  qualityNotes?: string
  // Variants (optional)
  hasVariants: boolean
  variants?: {
    size?: string
    color?: string
    quantity: number
  }[]
}

export interface IntakeBatch {
  id: string
  partnerId: string
  partnerName: string
  shopName: string
  items: string[] // IntakeItem IDs
  totalItems: number
  totalQuantity: number
  status: 'receiving' | 'received' | 'processing' | 'completed'
  receivedBy: string
  receivedAt: string
  notes?: string
}

interface IntakeState {
  items: IntakeItem[]
  batches: IntakeBatch[]

  // Item Management
  addItem: (item: Omit<IntakeItem, 'id' | 'sku' | 'droppedOffAt' | 'status' | 'photos' | 'photoCount'>) => string
  updateItemStatus: (id: string, status: IntakeStatus, note?: string) => void
  updateItemPhotos: (id: string, photos: string[]) => void
  updateItemPricing: (id: string, suggestedPrice: number, sellingPrice: number) => void
  updateItemRack: (id: string, rackLocation: string) => void
  getItemById: (id: string) => IntakeItem | undefined
  getItemsByPartner: (partnerId: string) => IntakeItem[]
  getItemsByStatus: (status: IntakeStatus) => IntakeItem[]

  // Batch Management
  createBatch: (partnerId: string, partnerName: string, shopName: string, receivedBy: string) => string
  addItemToBatch: (batchId: string, itemId: string) => void
  completeBatch: (batchId: string) => void
  getBatchById: (id: string) => IntakeBatch | undefined

  // Stats
  getIntakeStats: () => {
    totalItems: number
    pendingPhoto: number
    inProgress: number
    readyToList: number
    active: number
    todayDropoffs: number
  }

  // Photo Queue
  getPhotoQueue: () => IntakeItem[]
  startPhotography: (id: string) => void
  completePhotography: (id: string, photos: string[]) => void
}

// Generate SKU: UC-{CATEGORY}-{TIMESTAMP}
const generateSKU = (category: string): string => {
  const catCode = category.substring(0, 3).toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  return `UC-${catCode}-${timestamp}`
}

// Generate rack location: {ROW}-{SHELF}-{POSITION}
const generateRackLocation = (): string => {
  const rows = ['A', 'B', 'C', 'D', 'E']
  const row = rows[Math.floor(Math.random() * rows.length)]
  const shelf = Math.floor(Math.random() * 20) + 1
  const position = Math.floor(Math.random() * 5) + 1
  return `${row}-${shelf.toString().padStart(2, '0')}-${position}`
}

// Suggest selling price based on cost and category
const suggestPrice = (costPrice: number, category: string): number => {
  // Different margins for different categories
  const margins: Record<string, number> = {
    'Gamis': 1.8,
    'Hijab': 2.0,
    'Tunik': 1.7,
    'Rok': 1.6,
    'Celana': 1.6,
    'Outer': 1.7,
    'Dress': 1.8,
    'Blouse': 1.7,
    'default': 1.65,
  }
  const margin = margins[category] || margins['default']
  // Round to nearest 5000
  return Math.ceil((costPrice * margin) / 5000) * 5000
}

// Mock intake items for demo
const mockItems: IntakeItem[] = [
  {
    id: 'intake-1',
    partnerId: 'partner-1',
    partnerName: 'Haji Muhammad Yusuf',
    shopName: 'Toko Kain Berkah',
    productName: 'Gamis Syari Brukat Premium',
    category: 'Gamis',
    sku: 'UC-GAM-ABC123',
    quantity: 12,
    costPrice: 185000,
    suggestedPrice: 335000,
    sellingPrice: 329000,
    photos: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    photoCount: 3,
    rackLocation: 'A-05-2',
    status: 'active',
    droppedOffAt: '2024-02-28T10:00:00Z',
    photoStartedAt: '2024-02-28T14:00:00Z',
    photoCompletedAt: '2024-02-28T15:30:00Z',
    listedAt: '2024-02-28T16:00:00Z',
    qualityScore: 5,
    hasVariants: true,
    variants: [
      { size: 'M', color: 'Navy', quantity: 4 },
      { size: 'L', color: 'Navy', quantity: 4 },
      { size: 'XL', color: 'Navy', quantity: 4 },
    ],
  },
  {
    id: 'intake-2',
    partnerId: 'partner-2',
    partnerName: 'Ibu Siti Rahayu',
    shopName: 'Rahayu Fashion',
    productName: 'Hijab Voal Printing Bunga',
    category: 'Hijab',
    sku: 'UC-HIJ-DEF456',
    quantity: 24,
    costPrice: 45000,
    photos: [],
    photoCount: 0,
    rackLocation: 'B-12-1',
    status: 'pending_photo',
    droppedOffAt: '2024-03-05T09:30:00Z',
    hasVariants: false,
  },
  {
    id: 'intake-3',
    partnerId: 'partner-1',
    partnerName: 'Haji Muhammad Yusuf',
    shopName: 'Toko Kain Berkah',
    productName: 'Tunik Batik Kombinasi',
    category: 'Tunik',
    sku: 'UC-TUN-GHI789',
    quantity: 8,
    costPrice: 125000,
    photos: ['/placeholder.jpg', '/placeholder.jpg'],
    photoCount: 2,
    rackLocation: 'C-03-4',
    status: 'editing',
    droppedOffAt: '2024-03-04T11:00:00Z',
    photoStartedAt: '2024-03-05T10:00:00Z',
    photoCompletedAt: '2024-03-05T11:00:00Z',
    hasVariants: true,
    variants: [
      { size: 'L', color: 'Coklat', quantity: 4 },
      { size: 'XL', color: 'Coklat', quantity: 4 },
    ],
  },
  {
    id: 'intake-4',
    partnerId: 'partner-4',
    partnerName: 'Ny. Linda Wijaya',
    shopName: 'Linda Boutique',
    productName: 'Rok Plisket Panjang Premium',
    category: 'Rok',
    sku: 'UC-ROK-JKL012',
    quantity: 15,
    costPrice: 85000,
    photos: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    photoCount: 4,
    rackLocation: 'A-18-3',
    status: 'pending_upload',
    droppedOffAt: '2024-03-03T14:00:00Z',
    photoStartedAt: '2024-03-04T09:00:00Z',
    photoCompletedAt: '2024-03-04T10:30:00Z',
    suggestedPrice: 145000,
    qualityScore: 4,
    hasVariants: false,
  },
  {
    id: 'intake-5',
    partnerId: 'partner-2',
    partnerName: 'Ibu Siti Rahayu',
    shopName: 'Rahayu Fashion',
    productName: 'Outer Cardigan Rajut',
    category: 'Outer',
    sku: 'UC-OUT-MNO345',
    quantity: 6,
    costPrice: 95000,
    photos: [],
    photoCount: 0,
    rackLocation: 'D-07-2',
    status: 'photographing',
    droppedOffAt: '2024-03-05T08:00:00Z',
    photoStartedAt: '2024-03-06T09:00:00Z',
    hasVariants: false,
  },
]

export const useIntakeStore = create<IntakeState>()(
  persist(
    (set, get) => ({
      items: mockItems,
      batches: [],

      addItem: (itemData) => {
        const id = `intake-${Date.now()}`
        const sku = generateSKU(itemData.category)
        const rackLocation = itemData.rackLocation || generateRackLocation()

        const newItem: IntakeItem = {
          ...itemData,
          id,
          sku,
          rackLocation,
          status: 'drop_off',
          photos: [],
          photoCount: 0,
          droppedOffAt: new Date().toISOString(),
          suggestedPrice: suggestPrice(itemData.costPrice, itemData.category),
        }

        set((state) => ({
          items: [...state.items, newItem],
        }))

        return id
      },

      updateItemStatus: (id, status, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  statusNote: note,
                  listedAt: status === 'active' ? new Date().toISOString() : item.listedAt,
                }
              : item
          ),
        }))
      },

      updateItemPhotos: (id, photos) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  photos,
                  photoCount: photos.length,
                }
              : item
          ),
        }))
      },

      updateItemPricing: (id, suggestedPrice, sellingPrice) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, suggestedPrice, sellingPrice }
              : item
          ),
        }))
      },

      updateItemRack: (id, rackLocation) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, rackLocation } : item
          ),
        }))
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id)
      },

      getItemsByPartner: (partnerId) => {
        return get().items.filter((item) => item.partnerId === partnerId)
      },

      getItemsByStatus: (status) => {
        return get().items.filter((item) => item.status === status)
      },

      createBatch: (partnerId, partnerName, shopName, receivedBy) => {
        const id = `batch-${Date.now()}`
        const newBatch: IntakeBatch = {
          id,
          partnerId,
          partnerName,
          shopName,
          items: [],
          totalItems: 0,
          totalQuantity: 0,
          status: 'receiving',
          receivedBy,
          receivedAt: new Date().toISOString(),
        }

        set((state) => ({
          batches: [...state.batches, newBatch],
        }))

        return id
      },

      addItemToBatch: (batchId, itemId) => {
        const item = get().getItemById(itemId)
        if (!item) return

        set((state) => ({
          batches: state.batches.map((batch) =>
            batch.id === batchId
              ? {
                  ...batch,
                  items: [...batch.items, itemId],
                  totalItems: batch.totalItems + 1,
                  totalQuantity: batch.totalQuantity + item.quantity,
                }
              : batch
          ),
        }))
      },

      completeBatch: (batchId) => {
        set((state) => ({
          batches: state.batches.map((batch) =>
            batch.id === batchId
              ? { ...batch, status: 'completed' }
              : batch
          ),
        }))
      },

      getBatchById: (id) => {
        return get().batches.find((batch) => batch.id === id)
      },

      getIntakeStats: () => {
        const items = get().items
        const today = new Date().toDateString()

        return {
          totalItems: items.length,
          pendingPhoto: items.filter((i) => i.status === 'pending_photo').length,
          inProgress: items.filter((i) =>
            ['photographing', 'editing'].includes(i.status)
          ).length,
          readyToList: items.filter((i) =>
            ['pending_upload', 'listing'].includes(i.status)
          ).length,
          active: items.filter((i) => i.status === 'active').length,
          todayDropoffs: items.filter((i) =>
            new Date(i.droppedOffAt).toDateString() === today
          ).length,
        }
      },

      getPhotoQueue: () => {
        return get().items
          .filter((item) =>
            ['pending_photo', 'photographing', 'editing'].includes(item.status)
          )
          .sort((a, b) =>
            new Date(a.droppedOffAt).getTime() - new Date(b.droppedOffAt).getTime()
          )
      },

      startPhotography: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'photographing' as IntakeStatus,
                  photoStartedAt: new Date().toISOString(),
                }
              : item
          ),
        }))
      },

      completePhotography: (id, photos) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: 'editing' as IntakeStatus,
                  photos,
                  photoCount: photos.length,
                  photoCompletedAt: new Date().toISOString(),
                }
              : item
          ),
        }))
      },
    }),
    {
      name: 'uc-intake',
    }
  )
)
