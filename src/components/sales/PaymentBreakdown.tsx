'use client'

import { Wallet, CreditCard, QrCode, Truck, Clock } from 'lucide-react'
import { useSalesStore } from '@/stores/sales'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

const paymentIcons: Record<string, React.ReactNode> = {
  cash: <Wallet className="h-4 w-4" />,
  transfer: <CreditCard className="h-4 w-4" />,
  qris: <QrCode className="h-4 w-4" />,
  cod: <Truck className="h-4 w-4" />,
  credit: <Clock className="h-4 w-4" />,
}

const paymentLabels: Record<string, { en: string; id: string }> = {
  cash: { en: 'Cash', id: 'Tunai' },
  transfer: { en: 'Transfer', id: 'Transfer' },
  qris: { en: 'QRIS', id: 'QRIS' },
  cod: { en: 'COD', id: 'COD' },
  credit: { en: 'Credit', id: 'Hutang' },
}

const paymentColors: Record<string, string> = {
  cash: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  transfer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  qris: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  cod: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  credit: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function PaymentBreakdown() {
  const { language } = useTranslation()
  const { getDailySummary } = useSalesStore()

  const today = getDailySummary(new Date())
  const byPayment = today.byPaymentMethod

  const paymentMethods = Object.entries(byPayment).sort((a, b) => b[1].total - a[1].total)
  const totalAmount = paymentMethods.reduce((sum, [, data]) => sum + data.total, 0)

  if (paymentMethods.length === 0) {
    return (
      <div className="bg-background border rounded-xl p-4">
        <h3 className="font-semibold mb-4">
          {language === 'id' ? 'Metode Pembayaran' : 'Payment Methods'}
        </h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          {language === 'id' ? 'Belum ada data' : 'No data yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-background border rounded-xl p-4">
      <h3 className="font-semibold mb-4">
        {language === 'id' ? 'Metode Pembayaran' : 'Payment Methods'}
      </h3>

      <div className="space-y-3">
        {paymentMethods.map(([method, data]) => {
          const percentage = totalAmount > 0 ? Math.round((data.total / totalAmount) * 100) : 0
          const label = paymentLabels[method] || { en: method, id: method }

          return (
            <div key={method} className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${paymentColors[method] || 'bg-muted'}`}>
                {paymentIcons[method] || <Wallet className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {language === 'id' ? label.id : label.en}
                  </span>
                  <span className="text-sm">
                    {formatPrice(data.total)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {data.count}x ({percentage}%)
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Credit warning */}
      {byPayment.credit && byPayment.credit.total > 0 && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">
            ⚠️ {language === 'id' ? 'Piutang hari ini:' : 'Credit today:'}{' '}
            <span className="font-semibold">{formatPrice(byPayment.credit.total)}</span>
          </p>
        </div>
      )}
    </div>
  )
}
