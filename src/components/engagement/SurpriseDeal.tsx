'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { formatPrice } from '@/stores/cart'

interface SurpriseDealProps {
  productName: string
  productNameId: string
  originalPrice: number
  discountPercent: number
  onClaim: () => void
  onDismiss: () => void
}

export function SurpriseDeal({
  productName,
  productNameId,
  originalPrice,
  discountPercent,
  onClaim,
  onDismiss,
}: SurpriseDealProps) {
  const { language } = useTranslation()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isVisible, setIsVisible] = useState(true)

  const discountedPrice = originalPrice * (1 - discountPercent / 100)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsVisible(false)
          onDismiss()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDismiss])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-right-full duration-500">
      <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-4 max-w-xs shadow-2xl">
        {/* Pulsing effect */}
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping opacity-20" />

        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false)
            onDismiss()
          }}
          className="absolute -top-2 -right-2 p-1 bg-background text-foreground rounded-full shadow-lg"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Lightning badge */}
        <div className="absolute -top-3 -left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {language === 'id' ? 'DISKON KILAT!' : 'FLASH DEAL!'}
        </div>

        <div className="mt-2">
          {/* Timer */}
          <div className="flex items-center gap-1 text-sm mb-2">
            <Clock className="h-4 w-4" />
            <span>{language === 'id' ? 'Berakhir dalam' : 'Expires in'}</span>
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>

          {/* Product info */}
          <p className="font-medium text-sm mb-1 line-clamp-1">
            {language === 'id' ? productNameId : productName}
          </p>

          {/* Prices */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold">{formatPrice(discountedPrice)}</span>
            <span className="text-sm line-through opacity-70">{formatPrice(originalPrice)}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">
              -{discountPercent}%
            </span>
          </div>

          {/* CTA */}
          <Button
            onClick={onClaim}
            variant="secondary"
            className="w-full font-bold"
          >
            {language === 'id' ? 'KLAIM SEKARANG!' : 'CLAIM NOW!'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook to randomly trigger surprise deals
export function useSurpriseDeal() {
  const [deal, setDeal] = useState<{
    productName: string
    productNameId: string
    originalPrice: number
    discountPercent: number
  } | null>(null)

  useEffect(() => {
    // 20% chance to show a deal after 30-60 seconds of browsing
    const showDelay = Math.random() * 30000 + 30000

    const timer = setTimeout(() => {
      if (Math.random() < 0.2) {
        const deals = [
          { productName: 'Oversized Cotton Tee', productNameId: 'Kaos Oversized Katun', originalPrice: 249000, discountPercent: 25 },
          { productName: 'Casual Blazer', productNameId: 'Blazer Kasual', originalPrice: 899000, discountPercent: 30 },
          { productName: 'Cropped Cardigan', productNameId: 'Kardigan Crop', originalPrice: 449000, discountPercent: 20 },
        ]
        setDeal(deals[Math.floor(Math.random() * deals.length)])
      }
    }, showDelay)

    return () => clearTimeout(timer)
  }, [])

  const clearDeal = () => setDeal(null)

  return { deal, clearDeal }
}
