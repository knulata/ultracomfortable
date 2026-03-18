'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Trial = "Uji Coba 10 Potong" program
// Low-commitment way for Tanah Abang sellers to try UC

export type TrialStatus =
  | 'registered'      // Just signed up
  | 'scheduled'       // Drop-off appointment set
  | 'items_received'  // Items dropped off at UC
  | 'processing'      // Photos being taken, listed
  | 'live'            // Items are live on store
  | 'completed'       // Trial period ended
  | 'converted'       // Became full partner
  | 'returned'        // Took items back, didn't convert

export type TrialItemStatus =
  | 'pending'         // Waiting for photo
  | 'photographed'    // Photo taken
  | 'listed'          // Live on store
  | 'sold'            // Item sold
  | 'returned'        // Returned to seller

export interface TrialItem {
  id: string
  productName: string
  category: string
  size?: string
  color?: string
  costPrice: number
  sellingPrice?: number
  photo?: string
  status: TrialItemStatus
  soldAt?: string
  soldPrice?: number
}

export interface TrialParticipant {
  id: string
  // Contact Info
  ownerName: string
  shopName: string
  whatsapp: string
  // Location
  shopLocation: string // "Blok A Lt. 2 No. 15"
  // Trial Info
  status: TrialStatus
  itemCount: number // Max 10
  items: TrialItem[]
  // Schedule
  dropOffDate?: string
  dropOffTime?: string // "09:00-12:00"
  // Stats
  totalSold: number
  totalRevenue: number
  totalEarnings: number // After commission
  // Trial Period
  trialStartDate?: string
  trialEndDate?: string // 14 days after start
  daysRemaining?: number
  // Timestamps
  registeredAt: string
  itemsReceivedAt?: string
  completedAt?: string
  // Conversion
  convertedAt?: string
  returnedAt?: string
  // Notes
  notes?: string
}

interface TrialState {
  participants: TrialParticipant[]

  // Registration
  registerTrial: (data: {
    ownerName: string
    shopName: string
    whatsapp: string
    shopLocation: string
  }) => string

  // Scheduling
  scheduleDropOff: (id: string, date: string, time: string) => void

  // Item Management
  receiveItems: (id: string, items: Omit<TrialItem, 'id' | 'status'>[]) => void
  updateItemStatus: (participantId: string, itemId: string, status: TrialItemStatus) => void
  markItemSold: (participantId: string, itemId: string, soldPrice: number) => void

  // Trial Status
  startTrial: (id: string) => void
  completeTrial: (id: string) => void
  convertToPartner: (id: string) => void
  returnItems: (id: string) => void

  // Queries
  getParticipantById: (id: string) => TrialParticipant | undefined
  getParticipantByWhatsapp: (whatsapp: string) => TrialParticipant | undefined
  getActiveTrials: () => TrialParticipant[]
  getTrialStats: () => {
    totalRegistered: number
    activeTrials: number
    converted: number
    conversionRate: number
  }
}

// Mock data for demo
const mockParticipants: TrialParticipant[] = [
  {
    id: 'trial-1',
    ownerName: 'Ibu Dewi',
    shopName: 'Dewi Collection',
    whatsapp: '081234567890',
    shopLocation: 'Blok A Lt. 2 No. 45',
    status: 'live',
    itemCount: 10,
    items: [
      { id: 'ti-1', productName: 'Gamis Syari Polos', category: 'Gamis', size: 'All Size', color: 'Hitam', costPrice: 85000, sellingPrice: 145000, status: 'sold', soldAt: '2024-03-05T10:00:00Z', soldPrice: 145000 },
      { id: 'ti-2', productName: 'Gamis Syari Polos', category: 'Gamis', size: 'All Size', color: 'Navy', costPrice: 85000, sellingPrice: 145000, status: 'sold', soldAt: '2024-03-06T14:00:00Z', soldPrice: 145000 },
      { id: 'ti-3', productName: 'Tunik Batik Modern', category: 'Tunik', size: 'L', color: 'Coklat', costPrice: 65000, sellingPrice: 115000, status: 'listed', photo: '/trial/tunik-1.jpg' },
      { id: 'ti-4', productName: 'Tunik Batik Modern', category: 'Tunik', size: 'XL', color: 'Coklat', costPrice: 65000, sellingPrice: 115000, status: 'listed', photo: '/trial/tunik-2.jpg' },
      { id: 'ti-5', productName: 'Hijab Voal Premium', category: 'Hijab', color: 'Dusty Pink', costPrice: 35000, sellingPrice: 65000, status: 'sold', soldAt: '2024-03-04T09:00:00Z', soldPrice: 65000 },
      { id: 'ti-6', productName: 'Hijab Voal Premium', category: 'Hijab', color: 'Sage', costPrice: 35000, sellingPrice: 65000, status: 'listed', photo: '/trial/hijab-1.jpg' },
      { id: 'ti-7', productName: 'Outer Cardigan', category: 'Outer', size: 'All Size', color: 'Cream', costPrice: 55000, sellingPrice: 95000, status: 'listed', photo: '/trial/outer-1.jpg' },
      { id: 'ti-8', productName: 'Rok Plisket', category: 'Rok', size: 'All Size', color: 'Hitam', costPrice: 45000, sellingPrice: 79000, status: 'listed', photo: '/trial/rok-1.jpg' },
      { id: 'ti-9', productName: 'Rok Plisket', category: 'Rok', size: 'All Size', color: 'Navy', costPrice: 45000, sellingPrice: 79000, status: 'sold', soldAt: '2024-03-06T16:00:00Z', soldPrice: 79000 },
      { id: 'ti-10', productName: 'Celana Kulot', category: 'Celana', size: 'L', color: 'Hitam', costPrice: 50000, sellingPrice: 89000, status: 'listed', photo: '/trial/celana-1.jpg' },
    ],
    totalSold: 4,
    totalRevenue: 434000,
    totalEarnings: 368900, // After 15% commission
    trialStartDate: '2024-03-03T00:00:00Z',
    trialEndDate: '2024-03-17T00:00:00Z',
    daysRemaining: 9,
    registeredAt: '2024-03-01T10:00:00Z',
    itemsReceivedAt: '2024-03-02T14:00:00Z',
  },
  {
    id: 'trial-2',
    ownerName: 'Pak Hendra',
    shopName: 'Hendra Fashion',
    whatsapp: '082345678901',
    shopLocation: 'Blok B Lt. 1 No. 23',
    status: 'scheduled',
    itemCount: 0,
    items: [],
    totalSold: 0,
    totalRevenue: 0,
    totalEarnings: 0,
    dropOffDate: '2024-03-08',
    dropOffTime: '09:00-12:00',
    registeredAt: '2024-03-06T08:00:00Z',
  },
  {
    id: 'trial-3',
    ownerName: 'Ibu Sari',
    shopName: 'Sari Busana',
    whatsapp: '083456789012',
    shopLocation: 'Blok A Lt. 3 No. 12',
    status: 'converted',
    itemCount: 10,
    items: [],
    totalSold: 8,
    totalRevenue: 720000,
    totalEarnings: 612000,
    trialStartDate: '2024-02-15T00:00:00Z',
    trialEndDate: '2024-03-01T00:00:00Z',
    registeredAt: '2024-02-13T09:00:00Z',
    itemsReceivedAt: '2024-02-14T11:00:00Z',
    completedAt: '2024-03-01T00:00:00Z',
    convertedAt: '2024-03-02T10:00:00Z',
  },
]

export const useTrialStore = create<TrialState>()(
  persist(
    (set, get) => ({
      participants: mockParticipants,

      registerTrial: (data) => {
        const id = `trial-${Date.now()}`
        const newParticipant: TrialParticipant = {
          id,
          ...data,
          status: 'registered',
          itemCount: 0,
          items: [],
          totalSold: 0,
          totalRevenue: 0,
          totalEarnings: 0,
          registeredAt: new Date().toISOString(),
        }

        set((state) => ({
          participants: [...state.participants, newParticipant],
        }))

        return id
      },

      scheduleDropOff: (id, date, time) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'scheduled' as TrialStatus,
                  dropOffDate: date,
                  dropOffTime: time,
                }
              : p
          ),
        }))
      },

      receiveItems: (id, items) => {
        const trialItems: TrialItem[] = items.map((item, i) => ({
          ...item,
          id: `ti-${Date.now()}-${i}`,
          status: 'pending' as TrialItemStatus,
        }))

        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'items_received' as TrialStatus,
                  itemCount: trialItems.length,
                  items: trialItems,
                  itemsReceivedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      updateItemStatus: (participantId, itemId, status) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === participantId
              ? {
                  ...p,
                  items: p.items.map((item) =>
                    item.id === itemId ? { ...item, status } : item
                  ),
                }
              : p
          ),
        }))
      },

      markItemSold: (participantId, itemId, soldPrice) => {
        set((state) => ({
          participants: state.participants.map((p) => {
            if (p.id !== participantId) return p

            const updatedItems = p.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    status: 'sold' as TrialItemStatus,
                    soldAt: new Date().toISOString(),
                    soldPrice,
                  }
                : item
            )

            const totalSold = updatedItems.filter((i) => i.status === 'sold').length
            const totalRevenue = updatedItems
              .filter((i) => i.status === 'sold')
              .reduce((sum, i) => sum + (i.soldPrice || 0), 0)
            const totalEarnings = totalRevenue * 0.85 // 15% commission

            return {
              ...p,
              items: updatedItems,
              totalSold,
              totalRevenue,
              totalEarnings,
            }
          }),
        }))
      },

      startTrial: (id) => {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 14)

        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'live' as TrialStatus,
                  trialStartDate: startDate.toISOString(),
                  trialEndDate: endDate.toISOString(),
                  daysRemaining: 14,
                }
              : p
          ),
        }))
      },

      completeTrial: (id) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'completed' as TrialStatus,
                  completedAt: new Date().toISOString(),
                  daysRemaining: 0,
                }
              : p
          ),
        }))
      },

      convertToPartner: (id) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'converted' as TrialStatus,
                  convertedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      returnItems: (id) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'returned' as TrialStatus,
                  returnedAt: new Date().toISOString(),
                  items: p.items.map((item) =>
                    item.status !== 'sold'
                      ? { ...item, status: 'returned' as TrialItemStatus }
                      : item
                  ),
                }
              : p
          ),
        }))
      },

      getParticipantById: (id) => {
        return get().participants.find((p) => p.id === id)
      },

      getParticipantByWhatsapp: (whatsapp) => {
        return get().participants.find((p) => p.whatsapp === whatsapp)
      },

      getActiveTrials: () => {
        return get().participants.filter((p) =>
          ['items_received', 'processing', 'live'].includes(p.status)
        )
      },

      getTrialStats: () => {
        const participants = get().participants
        const converted = participants.filter((p) => p.status === 'converted').length
        const totalCompleted = participants.filter((p) =>
          ['completed', 'converted', 'returned'].includes(p.status)
        ).length

        return {
          totalRegistered: participants.length,
          activeTrials: participants.filter((p) =>
            ['items_received', 'processing', 'live'].includes(p.status)
          ).length,
          converted,
          conversionRate: totalCompleted > 0 ? (converted / totalCompleted) * 100 : 0,
        }
      },
    }),
    {
      name: 'alyanoor-trial',
    }
  )
)
