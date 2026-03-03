'use client'

import { useState } from 'react'
import { Tag, X, Check, Loader2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useCouponStore, formatCouponValue } from '@/stores/coupon'
import { formatPrice } from '@/stores/cart'
import { toast } from 'sonner'
import Link from 'next/link'

interface CouponInputProps {
  cartTotal: number
  cartItems?: { categoryId?: string; productId?: string }[]
}

export function CouponInput({ cartTotal, cartItems = [] }: CouponInputProps) {
  const { language } = useTranslation()
  const { appliedCoupon, applyCoupon, removeCoupon, availableCoupons } = useCouponStore()

  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [showAvailable, setShowAvailable] = useState(false)

  // Filter available coupons that can be used
  const usableCoupons = availableCoupons.filter((c) => {
    const now = new Date()
    return (
      c.isActive &&
      now >= new Date(c.validFrom) &&
      now <= new Date(c.validUntil) &&
      c.usedCount < c.usageLimit &&
      cartTotal >= c.minOrderValue
    )
  })

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error(language === 'id' ? 'Masukkan kode kupon' : 'Enter a coupon code')
      return
    }

    setIsApplying(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = applyCoupon(code.trim(), cartTotal, cartItems)

    if (result.success) {
      toast.success(language === 'id' ? result.messageId : result.message)
      setCode('')
      setShowAvailable(false)
    } else {
      toast.error(language === 'id' ? result.messageId : result.message)
    }

    setIsApplying(false)
  }

  const handleQuickApply = (couponCode: string) => {
    setCode(couponCode)
    const result = applyCoupon(couponCode, cartTotal, cartItems)
    if (result.success) {
      toast.success(language === 'id' ? result.messageId : result.message)
      setCode('')
      setShowAvailable(false)
    } else {
      toast.error(language === 'id' ? result.messageId : result.message)
    }
  }

  const handleRemove = () => {
    removeCoupon()
    toast.success(language === 'id' ? 'Kupon dihapus' : 'Coupon removed')
  }

  // If coupon is applied, show applied state
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-green-700">
                  {appliedCoupon.coupon.code}
                </span>
                <span className="text-xs bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                  {formatCouponValue(appliedCoupon.coupon, language === 'id' ? 'id' : 'en')}
                </span>
              </div>
              <p className="text-sm text-green-600">
                {language === 'id'
                  ? `Hemat ${formatPrice(appliedCoupon.discountAmount)}`
                  : `You save ${formatPrice(appliedCoupon.discountAmount)}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-green-600" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={language === 'id' ? 'Kode kupon' : 'Coupon code'}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono uppercase"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
        </div>
        <Button onClick={handleApply} disabled={isApplying || !code.trim()}>
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            language === 'id' ? 'Pakai' : 'Apply'
          )}
        </Button>
      </div>

      {/* Available Coupons Toggle */}
      {usableCoupons.length > 0 && (
        <div>
          <button
            onClick={() => setShowAvailable(!showAvailable)}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Tag className="h-4 w-4" />
            {language === 'id'
              ? `${usableCoupons.length} kupon tersedia`
              : `${usableCoupons.length} coupons available`}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAvailable ? 'rotate-90' : ''}`} />
          </button>

          {showAvailable && (
            <div className="mt-3 space-y-2">
              {usableCoupons.slice(0, 3).map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">{coupon.code}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {formatCouponValue(coupon, language === 'id' ? 'id' : 'en')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === 'id' ? coupon.descriptionId : coupon.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickApply(coupon.code)}
                  >
                    {language === 'id' ? 'Pakai' : 'Use'}
                  </Button>
                </div>
              ))}

              {usableCoupons.length > 3 && (
                <Link
                  href="/account/coupons"
                  className="block text-center text-sm text-primary hover:underline py-2"
                >
                  {language === 'id'
                    ? `Lihat ${usableCoupons.length - 3} kupon lainnya`
                    : `View ${usableCoupons.length - 3} more coupons`}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
