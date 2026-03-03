'use client'

import { MapPin, Phone, Edit2, Trash2, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { Address, addressLabels, useAddressesStore } from '@/stores/addresses'
import { toast } from 'sonner'

interface AddressCardProps {
  address: Address
  onEdit?: (address: Address) => void
  onSelect?: (address: Address) => void
  isSelected?: boolean
  variant?: 'default' | 'selectable' | 'compact'
}

export function AddressCard({
  address,
  onEdit,
  onSelect,
  isSelected = false,
  variant = 'default',
}: AddressCardProps) {
  const { language } = useTranslation()
  const { deleteAddress, setDefaultAddress } = useAddressesStore()

  const labelInfo = addressLabels.find((l) => l.label === address.label || l.labelId === address.label)

  const handleDelete = () => {
    if (confirm(language === 'id' ? 'Hapus alamat ini?' : 'Delete this address?')) {
      deleteAddress(address.id)
      toast.success(language === 'id' ? 'Alamat dihapus' : 'Address deleted')
    }
  }

  const handleSetDefault = () => {
    setDefaultAddress(address.id)
    toast.success(language === 'id' ? 'Alamat utama diperbarui' : 'Default address updated')
  }

  if (variant === 'compact') {
    return (
      <div
        className={`p-3 rounded-lg border transition-all cursor-pointer ${
          isSelected
            ? 'border-primary bg-primary/5 ring-2 ring-primary'
            : 'hover:border-primary/50'
        }`}
        onClick={() => onSelect?.(address)}
      >
        <div className="flex items-start gap-3">
          {onSelect && (
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isSelected ? 'border-primary bg-primary' : 'border-gray-300'
            }`}>
              {isSelected && <Check className="h-3 w-3 text-white" />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{address.fullName}</span>
              {address.isDefault && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {language === 'id' ? 'Utama' : 'Default'}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {address.address}, {address.city}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{address.phone}</p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'selectable') {
    return (
      <div
        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-transparent bg-muted/50 hover:border-primary/30'
        }`}
        onClick={() => onSelect?.(address)}
      >
        <div className="flex items-start gap-4">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected ? 'border-primary bg-primary' : 'border-gray-300'
          }`}>
            {isSelected && <Check className="h-4 w-4 text-white" />}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {labelInfo && <span className="text-lg">{labelInfo.icon}</span>}
              <span className="font-semibold">{address.fullName}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                {language === 'id' && labelInfo ? labelInfo.labelId : address.label}
              </span>
              {address.isDefault && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {language === 'id' ? 'Utama' : 'Default'}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {address.address}, {address.city}, {address.province} {address.postalCode}
            </p>

            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Phone className="h-4 w-4" />
              {address.phone}
            </p>

            {address.notes && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                {language === 'id' ? 'Catatan:' : 'Note:'} {address.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="bg-background rounded-xl border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 mb-3">
          {labelInfo && (
            <span className="text-2xl">{labelInfo.icon}</span>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{address.fullName}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                {language === 'id' && labelInfo ? labelInfo.labelId : address.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{address.phone}</p>
          </div>
        </div>

        {address.isDefault && (
          <span className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {language === 'id' ? 'Utama' : 'Default'}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
          <span>
            {address.address}
            <br />
            {address.city}, {address.province} {address.postalCode}
          </span>
        </p>

        {address.notes && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2">
            <span className="font-medium">{language === 'id' ? 'Catatan:' : 'Note:'}</span> {address.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
          >
            <Edit2 className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Ubah' : 'Edit'}
          </Button>
        )}

        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetDefault}
          >
            <Star className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Jadikan Utama' : 'Set as Default'}
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {language === 'id' ? 'Hapus' : 'Delete'}
        </Button>
      </div>
    </div>
  )
}
