'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Clock, Copy, RefreshCw, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { formatPrice } from '@/stores/cart'
import { toast } from 'sonner'

export default function CheckoutPendingPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'UC-000000'
  const { t, language } = useTranslation()

  // Mock payment details (in real app, fetch from API)
  const paymentDetails = {
    method: 'BCA Virtual Account',
    vaNumber: '8810 1234 5678 9012',
    amount: 549000,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  }

  const copyVANumber = () => {
    navigator.clipboard.writeText(paymentDetails.vaNumber.replace(/\s/g, ''))
    toast.success(language === 'id' ? 'Nomor VA disalin' : 'VA number copied')
  }

  const formatTimeRemaining = () => {
    const now = new Date()
    const diff = paymentDetails.expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-background rounded-2xl p-8 text-center shadow-lg">
          {/* Pending Icon */}
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">
            {language === 'id' ? 'Menunggu Pembayaran' : 'Awaiting Payment'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'id'
              ? 'Selesaikan pembayaran sebelum waktu habis'
              : 'Complete your payment before the deadline'
            }
          </p>

          {/* Timer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-700 mb-1">
              {language === 'id' ? 'Waktu tersisa' : 'Time remaining'}
            </p>
            <p className="text-2xl font-bold text-amber-700">{formatTimeRemaining()}</p>
          </div>

          {/* Payment Details */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">{t.checkout.orderNumber}</span>
              <span className="font-semibold">{orderId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">
                {language === 'id' ? 'Metode' : 'Method'}
              </span>
              <span className="font-medium">{paymentDetails.method}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">
                {language === 'id' ? 'Nomor VA' : 'VA Number'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{paymentDetails.vaNumber}</span>
                <button onClick={copyVANumber} className="text-primary hover:text-primary/80">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">{t.checkout.total}</span>
              <span className="font-bold text-lg">{formatPrice(paymentDetails.amount)}</span>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium mb-3">
              {language === 'id' ? 'Cara Pembayaran' : 'How to Pay'}
            </h3>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li>1. {language === 'id' ? 'Buka aplikasi m-BCA atau ATM BCA' : 'Open m-BCA app or visit BCA ATM'}</li>
              <li>2. {language === 'id' ? 'Pilih Transfer > Virtual Account' : 'Select Transfer > Virtual Account'}</li>
              <li>3. {language === 'id' ? 'Masukkan nomor VA di atas' : 'Enter the VA number above'}</li>
              <li>4. {language === 'id' ? 'Konfirmasi dan selesaikan pembayaran' : 'Confirm and complete payment'}</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Cek Status Pembayaran' : 'Check Payment Status'}
            </Button>
            <Button asChild variant="ghost" className="w-full">
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
            ? 'Sudah bayar tapi status belum berubah? Hubungi help@ultracomfortable.id'
            : 'Paid but status not updated? Contact help@ultracomfortable.id'
          }
        </p>
      </div>
    </div>
  )
}
