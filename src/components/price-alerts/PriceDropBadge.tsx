'use client'

import { TrendingDown, Sparkles } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { formatPrice } from '@/stores/cart'
import { PriceDropInfo } from '@/stores/wishlist'

interface PriceDropBadgeProps {
  priceDropInfo: PriceDropInfo
  variant?: 'badge' | 'card' | 'inline'
  showSavings?: boolean
}

export function PriceDropBadge({
  priceDropInfo,
  variant = 'badge',
  showSavings = true,
}: PriceDropBadgeProps) {
  const { language } = useTranslation()

  if (!priceDropInfo.hasPriceDrop) return null

  // Badge variant - small label
  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        <TrendingDown className="h-3 w-3" />
        <span>
          {language === 'id' ? 'Harga Turun' : 'Price Drop'}
          {showSavings && ` -${priceDropInfo.savingsPercent}%`}
        </span>
      </div>
    )
  }

  // Inline variant - text only
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1 text-green-600 text-sm">
        <TrendingDown className="h-4 w-4" />
        <span className="font-medium">
          {language === 'id'
            ? `Turun ${formatPrice(priceDropInfo.savingsFromAdded)}`
            : `Down ${formatPrice(priceDropInfo.savingsFromAdded)}`
          }
        </span>
      </div>
    )
  }

  // Card variant - detailed info
  return (
    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-full">
          <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <span className="font-semibold text-green-800 dark:text-green-200">
          {language === 'id' ? 'Harga Turun!' : 'Price Dropped!'}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'id' ? 'Harga saat ditambahkan' : 'Price when added'}
          </span>
          <span className="line-through text-muted-foreground">
            {formatPrice(priceDropInfo.priceWhenAdded)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {language === 'id' ? 'Harga sekarang' : 'Current price'}
          </span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            {formatPrice(priceDropInfo.currentPrice)}
          </span>
        </div>
        <div className="flex justify-between pt-1 border-t border-green-200 dark:border-green-800">
          <span className="font-medium text-green-700 dark:text-green-300">
            {language === 'id' ? 'Anda hemat' : 'You save'}
          </span>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-bold">
              {formatPrice(priceDropInfo.savingsFromAdded)} ({priceDropInfo.savingsPercent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
