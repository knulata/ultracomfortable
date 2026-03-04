'use client'

import { Bell, BellOff } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlist'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface PriceAlertToggleProps {
  itemId: string
  variant?: 'button' | 'switch'
}

export function PriceAlertToggle({ itemId, variant = 'button' }: PriceAlertToggleProps) {
  const { language } = useTranslation()
  const items = useWishlistStore((state) => state.items)
  const togglePriceAlert = useWishlistStore((state) => state.togglePriceAlert)

  const item = items.find((i) => i.id === itemId)
  if (!item) return null

  const isEnabled = item.priceAlertEnabled

  const handleToggle = () => {
    togglePriceAlert(itemId)
    toast.success(
      isEnabled
        ? (language === 'id' ? 'Notifikasi harga dimatikan' : 'Price alert disabled')
        : (language === 'id' ? 'Notifikasi harga diaktifkan' : 'Price alert enabled')
    )
  }

  if (variant === 'switch') {
    return (
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-sm"
      >
        <div className={`relative w-10 h-6 rounded-full transition-colors ${
          isEnabled ? 'bg-primary' : 'bg-muted'
        }`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            isEnabled ? 'translate-x-5' : 'translate-x-1'
          }`} />
        </div>
        <span className="text-muted-foreground">
          {language === 'id' ? 'Notifikasi harga' : 'Price alerts'}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors ${
        isEnabled
          ? 'bg-primary/10 text-primary hover:bg-primary/20'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
      title={isEnabled
        ? (language === 'id' ? 'Notifikasi aktif' : 'Alerts enabled')
        : (language === 'id' ? 'Notifikasi nonaktif' : 'Alerts disabled')
      }
    >
      {isEnabled ? (
        <>
          <Bell className="h-3.5 w-3.5" />
          <span>{language === 'id' ? 'Aktif' : 'On'}</span>
        </>
      ) : (
        <>
          <BellOff className="h-3.5 w-3.5" />
          <span>{language === 'id' ? 'Mati' : 'Off'}</span>
        </>
      )}
    </button>
  )
}
