'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useCartStore, formatPrice } from '@/stores/cart'
import confetti from 'canvas-confetti'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'UC-000000'
  const { t, language } = useTranslation()
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart()

    // Celebration confetti
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#c9a87c', '#ffd700', '#ff6b6b'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#c9a87c', '#ffd700', '#ff6b6b'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [clearCart])

  // Calculate estimated delivery (3-5 business days from now)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 5)
  const formattedDelivery = deliveryDate.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-background rounded-2xl p-8 text-center shadow-lg">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">
            {t.checkout.orderConfirmed}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t.checkout.thankYou}
          </p>

          {/* Order Details */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{t.checkout.orderNumber}</span>
              <span className="font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t.checkout.estimatedDelivery}</span>
              <span className="font-medium text-sm">{formattedDelivery}</span>
            </div>
          </div>

          {/* Rewards Banner */}
          <div className="bg-primary/10 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-lg">🎉</span>
              </div>
              <div>
                <p className="font-medium text-sm">
                  {language === 'id' ? 'Anda mendapat 150 Alya Points!' : 'You earned 150 Alya Points!'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'id' ? 'Gunakan di pesanan berikutnya' : 'Use on your next order'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href={`/account/orders/${orderId}`}>
                <Package className="h-4 w-4 mr-2" />
                {t.checkout.trackOrder}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">
                {t.cart.continueShopping}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {language === 'id'
            ? 'Ada pertanyaan? Hubungi kami di help@ultracomfortable.id'
            : 'Questions? Contact us at help@ultracomfortable.id'
          }
        </p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
