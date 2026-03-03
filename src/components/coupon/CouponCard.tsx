'use client'

import { useState } from 'react'
import { Tag, Copy, Check, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { Coupon, formatCouponValue, isExpiringSoon, getRemainingUses } from '@/stores/coupon'
import { toast } from 'sonner'

interface CouponCardProps {
  coupon: Coupon
  onUse?: (code: string) => void
  variant?: 'default' | 'compact'
}

export function CouponCard({ coupon, onUse, variant = 'default' }: CouponCardProps) {
  const { language } = useTranslation()
  const [copied, setCopied] = useState(false)

  const expiringSoon = isExpiringSoon(coupon)
  const remainingUses = getRemainingUses(coupon)
  const isExpired = new Date() > new Date(coupon.validUntil)
  const isUsedUp = remainingUses <= 0

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  const copyCode = () => {
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    toast.success(language === 'id' ? 'Kode disalin!' : 'Code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUse = () => {
    if (onUse) {
      onUse(coupon.code)
    } else {
      copyCode()
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border ${
        isExpired || isUsedUp ? 'bg-muted/50 opacity-60' : 'bg-background'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            coupon.type === 'percentage' ? 'bg-primary/10 text-primary' :
            coupon.type === 'fixed' ? 'bg-green-100 text-green-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm">{coupon.code}</span>
              {expiringSoon && !isExpired && (
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                  {language === 'id' ? 'Segera berakhir' : 'Expiring soon'}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? coupon.descriptionId : coupon.description}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={isExpired || isUsedUp ? 'ghost' : 'default'}
          disabled={isExpired || isUsedUp}
          onClick={handleUse}
        >
          {isExpired
            ? language === 'id' ? 'Kadaluarsa' : 'Expired'
            : isUsedUp
            ? language === 'id' ? 'Habis' : 'Used up'
            : language === 'id' ? 'Pakai' : 'Use'}
        </Button>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border ${
      isExpired || isUsedUp ? 'bg-muted/50 opacity-75' : 'bg-background'
    }`}>
      {/* Coupon ticket design */}
      <div className="flex">
        {/* Left side - value */}
        <div className={`w-28 flex-shrink-0 p-4 flex flex-col items-center justify-center text-center border-r border-dashed relative ${
          coupon.type === 'percentage' ? 'bg-gradient-to-br from-primary/20 to-primary/5' :
          coupon.type === 'fixed' ? 'bg-gradient-to-br from-green-500/20 to-green-500/5' :
          'bg-gradient-to-br from-blue-500/20 to-blue-500/5'
        }`}>
          {/* Notches */}
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full" />

          <span className={`text-2xl font-bold ${
            coupon.type === 'percentage' ? 'text-primary' :
            coupon.type === 'fixed' ? 'text-green-600' :
            'text-blue-600'
          }`}>
            {coupon.type === 'percentage' ? `${coupon.value}%` :
             coupon.type === 'fixed' ? `${(coupon.value / 1000)}K` :
             '🚚'}
          </span>
          <span className="text-xs font-medium text-muted-foreground mt-1">
            {coupon.type === 'free_shipping'
              ? language === 'id' ? 'GRATIS ONGKIR' : 'FREE SHIP'
              : 'OFF'}
          </span>
        </div>

        {/* Right side - details */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold">{coupon.code}</span>
                <button
                  onClick={copyCode}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title={language === 'id' ? 'Salin kode' : 'Copy code'}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'id' ? coupon.descriptionId : coupon.description}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {language === 'id' ? 'Min.' : 'Min.'} Rp {coupon.minOrderValue.toLocaleString('id-ID')}
            </span>

            {coupon.maxDiscount && (
              <span>
                {language === 'id' ? 'Maks.' : 'Max.'} Rp {coupon.maxDiscount.toLocaleString('id-ID')}
              </span>
            )}

            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {language === 'id' ? 'Sampai' : 'Until'} {formatDate(coupon.validUntil)}
            </span>
          </div>

          {/* Status badges */}
          <div className="mt-3 flex items-center gap-2">
            {expiringSoon && !isExpired && (
              <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                <AlertCircle className="h-3 w-3" />
                {language === 'id' ? 'Segera berakhir' : 'Expiring soon'}
              </span>
            )}

            {isExpired && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                {language === 'id' ? 'Kadaluarsa' : 'Expired'}
              </span>
            )}

            {!isExpired && !isUsedUp && remainingUses <= 2 && (
              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                {remainingUses}x {language === 'id' ? 'lagi' : 'left'}
              </span>
            )}
          </div>

          {/* Use button */}
          {!isExpired && !isUsedUp && (
            <Button
              className="mt-3 w-full"
              size="sm"
              onClick={handleUse}
            >
              {language === 'id' ? 'Gunakan Kupon' : 'Use Coupon'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
