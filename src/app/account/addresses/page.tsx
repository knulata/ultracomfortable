'use client'

import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const mockAddresses = [
  {
    id: '1',
    label: 'Home',
    name: 'Sarah Johnson',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, Apt 4B',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postal_code: '12190',
    is_default: true,
  },
  {
    id: '2',
    label: 'Office',
    name: 'Sarah Johnson',
    phone: '081234567890',
    address: 'Menara BCA Lt. 25, Jl. MH Thamrin No. 1',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    postal_code: '10310',
    is_default: false,
  },
]

const provinces = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Selatan', 'Other'
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockAddresses)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
  })

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      is_default: addr.id === id
    })))
    toast.success('Default address updated')
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
    toast.success('Address deleted')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setAddresses(addresses.map(addr =>
        addr.id === editingId ? { ...addr, ...formData } : addr
      ))
      toast.success('Address updated')
    } else {
      setAddresses([...addresses, {
        id: Date.now().toString(),
        ...formData,
        is_default: addresses.length === 0,
      }])
      toast.success('Address added')
    }
    resetForm()
  }

  const resetForm = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ label: '', name: '', phone: '', address: '', city: '', province: '', postal_code: '' })
  }

  const startEdit = (addr: typeof mockAddresses[0]) => {
    setEditingId(addr.id)
    setFormData({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      province: addr.province,
      postal_code: addr.postal_code,
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground">{addresses.length} saved addresses</p>
          </div>
          {!isAdding && !editingId && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <form onSubmit={handleSubmit} className="bg-muted/50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Label</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Home, Office, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Recipient Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Postal Code</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Province</label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  required
                >
                  <option value="">Select</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="submit">{editingId ? 'Save Changes' : 'Add Address'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No saved addresses</p>
            <p className="text-muted-foreground">Add an address for faster checkout</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative p-4 border rounded-xl ${addr.is_default ? 'border-primary bg-primary/5' : ''}`}
              >
                {addr.is_default && (
                  <span className="absolute top-3 right-3 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    Default
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{addr.label}</p>
                    <p className="text-sm mt-1">{addr.name}</p>
                    <p className="text-sm text-muted-foreground">{addr.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">{addr.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {addr.city}, {addr.province} {addr.postal_code}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {!addr.is_default && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(addr.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => startEdit(addr)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!addr.is_default && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(addr.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
