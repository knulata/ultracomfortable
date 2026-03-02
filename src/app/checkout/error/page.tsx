'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'

export default function CheckoutErrorPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const errorCode = searchParams.get('error') || 'payment_failed'
  const { language } = useTranslation()

  const errorMessages: Record<string, { title: string, titleId: string, desc: string, descId: string }> = {
    payment_failed: {
      title: 'Payment Failed',
      titleId: 'Pembayaran Gagal',
      desc: 'Your payment could not be processed. Please try again or use a different payment method.',
      descId: 'Pembayaran Anda tidak dapat diproses. Silakan coba lagi atau gunakan metode pembayaran lain.',
    },
    expired: {
      title: 'Payment Expired',
      titleId: 'Pembayaran Kadaluarsa',
      desc: 'Your payment session has expired. Please start a new checkout.',
      descId: 'Sesi pembayaran Anda telah kadaluarsa. Silakan mulai checkout baru.',
    },
    cancelled: {
      title: 'Payment Cancelled',
      titleId: 'Pembayaran Dibatalkan',
      desc: 'Your payment was cancelled. Your items are still in your cart.',
      descId: 'Pembayaran Anda dibatalkan. Item Anda masih ada di keranjang.',
    },
    insufficient_funds: {
      title: 'Insufficient Funds',
      titleId: 'Saldo Tidak Cukup',
      desc: 'Your account has insufficient funds. Please top up or use a different payment method.',
      descId: 'Saldo akun Anda tidak mencukupi. Silakan isi ulang atau gunakan metode pembayaran lain.',
    },
  }

  const error = errorMessages[errorCode] || errorMessages.payment_failed

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-background rounded-2xl p-8 text-center shadow-lg">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">
            {language === 'id' ? error.titleId : error.title}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'id' ? error.descId : error.desc}
          </p>

          {/* Order ID if available */}
          {orderId && (
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                {language === 'id' ? 'Nomor Pesanan' : 'Order Number'}
              </p>
              <p className="font-semibold">{orderId}</p>
            </div>
          )}

          {/* Common Issues */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium mb-3">
              {language === 'id' ? 'Kemungkinan Penyebab' : 'Possible Causes'}
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {language === 'id' ? 'Koneksi internet tidak stabil' : 'Unstable internet connection'}</li>
              <li>• {language === 'id' ? 'Saldo e-wallet tidak mencukupi' : 'Insufficient e-wallet balance'}</li>
              <li>• {language === 'id' ? 'Kartu kredit ditolak oleh bank' : 'Credit card declined by bank'}</li>
              <li>• {language === 'id' ? 'Sesi pembayaran timeout' : 'Payment session timeout'}</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/checkout">
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Coba Lagi' : 'Try Again'}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Kembali ke Keranjang' : 'Back to Cart'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-3">
            {language === 'id'
              ? 'Masih mengalami masalah?'
              : 'Still having issues?'
            }
          </p>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Hubungi Support' : 'Contact Support'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
