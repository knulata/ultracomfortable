'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { Address, AddressFormData, addressLabels, indonesianProvinces, useAddressesStore } from '@/stores/addresses'
import { toast } from 'sonner'

interface AddressFormProps {
  address?: Address | null
  onClose: () => void
  onSuccess?: (address: Address) => void
}

export function AddressForm({ address, onClose, onSuccess }: AddressFormProps) {
  const { language } = useTranslation()
  const { addAddress, updateAddress } = useAddressesStore()
  const isEditing = !!address

  const [formData, setFormData] = useState<AddressFormData>({
    label: address?.label || 'Home',
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    address: address?.address || '',
    city: address?.city || '',
    province: address?.province || '',
    postalCode: address?.postalCode || '',
    notes: address?.notes || '',
  })

  const [setAsDefault, setSetAsDefault] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'id' ? 'Nama lengkap wajib diisi' : 'Full name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = language === 'id' ? 'Nomor telepon wajib diisi' : 'Phone number is required'
    } else if (!/^(\+62|62|0)[0-9]{9,12}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = language === 'id' ? 'Nomor telepon tidak valid' : 'Invalid phone number'
    }

    if (!formData.address.trim()) {
      newErrors.address = language === 'id' ? 'Alamat wajib diisi' : 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = language === 'id' ? 'Kota wajib diisi' : 'City is required'
    }

    if (!formData.province) {
      newErrors.province = language === 'id' ? 'Provinsi wajib dipilih' : 'Province is required'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = language === 'id' ? 'Kode pos wajib diisi' : 'Postal code is required'
    } else if (!/^[0-9]{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = language === 'id' ? 'Kode pos harus 5 digit' : 'Postal code must be 5 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (isEditing && address) {
      updateAddress(address.id, formData)
      toast.success(language === 'id' ? 'Alamat berhasil diperbarui' : 'Address updated successfully')
      onClose()
    } else {
      const newAddress = addAddress(formData, setAsDefault)
      toast.success(language === 'id' ? 'Alamat berhasil ditambahkan' : 'Address added successfully')
      onSuccess?.(newAddress)
      onClose()
    }
  }

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEditing
              ? (language === 'id' ? 'Ubah Alamat' : 'Edit Address')
              : (language === 'id' ? 'Tambah Alamat Baru' : 'Add New Address')
            }
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Label Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'id' ? 'Label Alamat' : 'Address Label'}
            </label>
            <div className="flex flex-wrap gap-2">
              {addressLabels.map((labelOption) => (
                <button
                  key={labelOption.id}
                  type="button"
                  className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-2 transition-colors ${
                    formData.label === labelOption.label
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleChange('label', labelOption.label)}
                >
                  <span>{labelOption.icon}</span>
                  <span>{language === 'id' ? labelOption.labelId : labelOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'id' ? 'Nama Lengkap' : 'Full Name'} *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                errors.fullName ? 'border-red-500' : ''
              }`}
              placeholder={language === 'id' ? 'Nama penerima' : 'Recipient name'}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'id' ? 'Nomor Telepon' : 'Phone Number'} *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="08xx xxxx xxxx"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'id' ? 'Alamat Lengkap' : 'Full Address'} *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                errors.address ? 'border-red-500' : ''
              }`}
              placeholder={language === 'id' ? 'Nama jalan, nomor rumah, RT/RW, kelurahan' : 'Street name, house number, neighborhood'}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* City & Province */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'id' ? 'Kota/Kabupaten' : 'City'} *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.city ? 'border-red-500' : ''
                }`}
                placeholder={language === 'id' ? 'Kota' : 'City'}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {language === 'id' ? 'Provinsi' : 'Province'} *
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.province ? 'border-red-500' : ''
                }`}
              >
                <option value="">{language === 'id' ? 'Pilih provinsi' : 'Select province'}</option>
                {indonesianProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'id' ? 'Kode Pos' : 'Postal Code'} *
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
              className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                errors.postalCode ? 'border-red-500' : ''
              }`}
              placeholder="12345"
              maxLength={5}
            />
            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {language === 'id' ? 'Catatan (Opsional)' : 'Notes (Optional)'}
            </label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder={language === 'id' ? 'Contoh: Gerbang hijau, samping warung' : 'E.g., Green gate, next to the shop'}
            />
          </div>

          {/* Set as Default */}
          {!isEditing && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                {language === 'id' ? 'Jadikan alamat utama' : 'Set as default address'}
              </span>
            </label>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" className="w-full">
              {isEditing
                ? (language === 'id' ? 'Simpan Perubahan' : 'Save Changes')
                : (language === 'id' ? 'Simpan Alamat' : 'Save Address')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
