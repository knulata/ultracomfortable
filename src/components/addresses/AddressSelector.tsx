'use client'

import { useState } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { Address, useAddressesStore } from '@/stores/addresses'
import { AddressCard } from './AddressCard'
import { AddressForm } from './AddressForm'

interface AddressSelectorProps {
  selectedAddressId?: string
  onSelect: (address: Address) => void
  variant?: 'full' | 'compact' | 'dropdown'
}

export function AddressSelector({ selectedAddressId, onSelect, variant = 'full' }: AddressSelectorProps) {
  const { language } = useTranslation()
  const { addresses, getDefaultAddress } = useAddressesStore()
  const [showForm, setShowForm] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || getDefaultAddress()

  // Auto-select default address on mount if none selected
  if (!selectedAddressId && selectedAddress) {
    onSelect(selectedAddress)
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 rounded-xl border bg-background text-left flex items-center justify-between hover:border-primary/50 transition-colors"
        >
          {selectedAddress ? (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{selectedAddress.fullName}</span>
                {selectedAddress.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {language === 'id' ? 'Utama' : 'Default'}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {selectedAddress.address}, {selectedAddress.city}
              </p>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {language === 'id' ? 'Pilih alamat pengiriman' : 'Select delivery address'}
            </span>
          )}
          <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  type="button"
                  className={`w-full p-4 text-left border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                    address.id === selectedAddress?.id ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    onSelect(address)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {language === 'id' ? 'Utama' : 'Default'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {address.address}, {address.city}, {address.province}
                  </p>
                </button>
              ))}

              <button
                type="button"
                className="w-full p-4 text-left text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
                onClick={() => {
                  setIsOpen(false)
                  setShowForm(true)
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'id' ? 'Tambah alamat baru' : 'Add new address'}
                </span>
              </button>
            </div>
          </>
        )}

        {showForm && (
          <AddressForm
            onClose={() => setShowForm(false)}
            onSuccess={(newAddress) => onSelect(newAddress)}
          />
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="text-center py-6 bg-muted/30 rounded-xl">
            <p className="text-muted-foreground mb-3">
              {language === 'id' ? 'Belum ada alamat tersimpan' : 'No saved addresses'}
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              {language === 'id' ? 'Tambah Alamat' : 'Add Address'}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  variant="compact"
                  isSelected={address.id === selectedAddress?.id}
                  onSelect={onSelect}
                />
              ))}
            </div>

            <button
              type="button"
              className="w-full p-3 rounded-lg border border-dashed hover:border-primary text-primary text-sm flex items-center justify-center gap-2 transition-colors"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              {language === 'id' ? 'Tambah alamat baru' : 'Add new address'}
            </button>
          </>
        )}

        {showForm && (
          <AddressForm
            onClose={() => setShowForm(false)}
            onSuccess={(newAddress) => onSelect(newAddress)}
          />
        )}
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-xl">
          <p className="text-muted-foreground mb-4">
            {language === 'id' ? 'Belum ada alamat tersimpan' : 'No saved addresses yet'}
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Tambah Alamat Pertama' : 'Add Your First Address'}
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                variant="selectable"
                isSelected={address.id === selectedAddress?.id}
                onSelect={onSelect}
              />
            ))}
          </div>

          <button
            type="button"
            className="w-full p-4 rounded-xl border-2 border-dashed hover:border-primary text-primary flex items-center justify-center gap-2 transition-colors"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">
              {language === 'id' ? 'Tambah alamat baru' : 'Add new address'}
            </span>
          </button>
        </>
      )}

      {showForm && (
        <AddressForm
          onClose={() => setShowForm(false)}
          onSuccess={(newAddress) => onSelect(newAddress)}
        />
      )}
    </div>
  )
}
