'use client'

import { useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useAddressesStore, Address } from '@/stores/addresses'
import { AddressCard, AddressForm } from '@/components/addresses'

export default function AddressesPage() {
  const { language } = useTranslation()
  const { addresses } = useAddressesStore()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'id' ? 'Alamat Saya' : 'My Addresses'}
            </h1>
            <p className="text-muted-foreground">
              {addresses.length} {language === 'id' ? 'alamat tersimpan' : 'saved addresses'}
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Tambah Alamat' : 'Add Address'}
          </Button>
        </div>

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {language === 'id' ? 'Belum ada alamat tersimpan' : 'No saved addresses'}
            </p>
            <p className="text-muted-foreground mb-4">
              {language === 'id'
                ? 'Tambahkan alamat untuk checkout lebih cepat'
                : 'Add an address for faster checkout'
              }
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Tambah Alamat Pertama' : 'Add Your First Address'}
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
