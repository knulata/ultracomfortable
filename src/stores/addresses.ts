'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Address {
  id: string
  label: string // e.g., "Home", "Office", "Parents"
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  notes?: string
  isDefault: boolean
  createdAt: number
  updatedAt: number
}

export type AddressFormData = Omit<Address, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>

interface AddressesState {
  addresses: Address[]

  // Actions
  addAddress: (data: AddressFormData, setAsDefault?: boolean) => Address
  updateAddress: (id: string, data: Partial<AddressFormData>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  // Getters
  getDefaultAddress: () => Address | undefined
  getAddressById: (id: string) => Address | undefined
  getAddressCount: () => number
}

// Indonesian provinces
export const indonesianProvinces = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
]

// Common address labels
export const addressLabels = [
  { id: 'home', label: 'Home', labelId: 'Rumah', icon: '🏠' },
  { id: 'office', label: 'Office', labelId: 'Kantor', icon: '🏢' },
  { id: 'apartment', label: 'Apartment', labelId: 'Apartemen', icon: '🏬' },
  { id: 'parents', label: "Parent's House", labelId: 'Rumah Orang Tua', icon: '👨‍👩‍👧' },
  { id: 'other', label: 'Other', labelId: 'Lainnya', icon: '📍' },
]

// Mock addresses for demo
const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Sarah Johnson',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, RT 01/RW 05, Kelurahan Menteng',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    postalCode: '10310',
    notes: 'Gerbang hijau, sebelah warung',
    isDefault: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'addr-2',
    label: 'Office',
    fullName: 'Sarah Johnson',
    phone: '081234567890',
    address: 'Gedung Graha Niaga Lt. 15, Jl. Jend. Sudirman Kav. 58',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12190',
    notes: 'Minta tolong titip di resepsionis jika tidak ada',
    isDefault: false,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
]

export const useAddressesStore = create<AddressesState>()(
  persist(
    (set, get) => ({
      addresses: mockAddresses,

      addAddress: (data, setAsDefault = false) => {
        const newAddress: Address = {
          ...data,
          id: `addr-${Date.now()}`,
          isDefault: setAsDefault || get().addresses.length === 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => {
          // If setting as default, remove default from other addresses
          const updatedAddresses = setAsDefault
            ? state.addresses.map((a) => ({ ...a, isDefault: false }))
            : state.addresses

          return {
            addresses: [...updatedAddresses, newAddress],
          }
        })

        return newAddress
      },

      updateAddress: (id, data) => {
        set((state) => ({
          addresses: state.addresses.map((address) =>
            address.id === id
              ? { ...address, ...data, updatedAt: Date.now() }
              : address
          ),
        }))
      },

      deleteAddress: (id) => {
        const addressToDelete = get().addresses.find((a) => a.id === id)
        const wasDefault = addressToDelete?.isDefault

        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id)

          // If deleted address was default, set first remaining as default
          if (wasDefault && filtered.length > 0) {
            filtered[0].isDefault = true
          }

          return { addresses: filtered }
        })
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
            updatedAt: address.id === id ? Date.now() : address.updatedAt,
          })),
        }))
      },

      getDefaultAddress: () => {
        return get().addresses.find((a) => a.isDefault)
      },

      getAddressById: (id) => {
        return get().addresses.find((a) => a.id === id)
      },

      getAddressCount: () => {
        return get().addresses.length
      },
    }),
    {
      name: 'uc-addresses',
      partialize: (state) => ({ addresses: state.addresses }),
    }
  )
)

// Helper to format address for display
export function formatAddressShort(address: Address): string {
  return `${address.address}, ${address.city}`
}

export function formatAddressFull(address: Address): string {
  return `${address.address}, ${address.city}, ${address.province} ${address.postalCode}`
}
