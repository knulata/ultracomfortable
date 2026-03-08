'use client'

import { useState } from 'react'
import {
  Wallet,
  CheckCircle,
  Clock,
  Store,
  ChevronRight,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePayoutStore, Payout } from '@/stores/payout'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

export function PayoutQueue() {
  const { language } = useTranslation()
  const { payouts, approvePayout, markAsPaid } = usePayoutStore()
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Get pending payouts (need approval) and processing payouts (need transfer)
  const pendingPayouts = payouts.filter((p) => p.status === 'pending')
  const processingPayouts = payouts.filter((p) => p.status === 'processing')

  const handleApprove = async (payout: Payout) => {
    setProcessingId(payout.id)
    await new Promise((r) => setTimeout(r, 500))
    approvePayout(payout.id, 'Admin')
    toast.success(
      language === 'id'
        ? `Payout ${payout.shopName} disetujui!`
        : `Payout for ${payout.shopName} approved!`
    )
    setProcessingId(null)
  }

  const handleMarkPaid = async (payout: Payout) => {
    setProcessingId(payout.id)
    await new Promise((r) => setTimeout(r, 500))
    const transferRef = `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
    markAsPaid(payout.id, transferRef, '', 'Finance')
    toast.success(
      language === 'id'
        ? `Transfer ke ${payout.shopName} berhasil!`
        : `Transfer to ${payout.shopName} completed!`
    )
    setProcessingId(null)
  }

  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.netPayout, 0)
  const totalProcessingAmount = processingPayouts.reduce((sum, p) => sum + p.netPayout, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">
              {language === 'id' ? 'Perlu Approval' : 'Needs Approval'}
            </span>
          </div>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
            {formatPrice(totalPendingAmount)}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            {pendingPayouts.length} payouts
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-1">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-medium">
              {language === 'id' ? 'Siap Transfer' : 'Ready to Transfer'}
            </span>
          </div>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
            {formatPrice(totalProcessingAmount)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-500">
            {processingPayouts.length} payouts
          </p>
        </div>
      </div>

      {/* Pending Approval */}
      {pendingPayouts.length > 0 && (
        <div className="bg-background rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-amber-50 dark:bg-amber-950/30">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Clock className="h-4 w-4" />
              {language === 'id' ? 'Menunggu Approval' : 'Awaiting Approval'}
            </h4>
          </div>
          <div className="divide-y">
            {pendingPayouts.slice(0, 5).map((payout) => (
              <div key={payout.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{payout.shopName}</p>
                    <p className="text-xs text-muted-foreground">{payout.periodLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatPrice(payout.netPayout)}</span>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(payout)}
                    disabled={processingId === payout.id}
                  >
                    {processingId === payout.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready to Transfer */}
      {processingPayouts.length > 0 && (
        <div className="bg-background rounded-xl border overflow-hidden">
          <div className="p-4 border-b bg-blue-50 dark:bg-blue-950/30">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <CreditCard className="h-4 w-4" />
              {language === 'id' ? 'Siap Transfer' : 'Ready to Transfer'}
            </h4>
          </div>
          <div className="divide-y">
            {processingPayouts.slice(0, 5).map((payout) => (
              <div key={payout.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{payout.shopName}</p>
                      <p className="text-xs text-muted-foreground">{payout.periodLabel}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-blue-600">{formatPrice(payout.netPayout)}</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-2 text-xs mb-2">
                  <span className="text-muted-foreground">{payout.bankName}</span>
                  <span className="font-mono mx-2">{payout.bankAccountNumber}</span>
                  <span className="text-muted-foreground">a.n. {payout.bankAccountName}</span>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleMarkPaid(payout)}
                  disabled={processingId === payout.id}
                >
                  {processingId === payout.id ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {language === 'id' ? 'Konfirmasi Transfer' : 'Confirm Transfer'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingPayouts.length === 0 && processingPayouts.length === 0 && (
        <div className="bg-background rounded-xl p-6 border text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
          <p className="text-muted-foreground">
            {language === 'id' ? 'Semua payout sudah diproses!' : 'All payouts have been processed!'}
          </p>
        </div>
      )}

      {/* View All Link */}
      {(pendingPayouts.length > 5 || processingPayouts.length > 5) && (
        <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
            <a href="/admin/payouts">
              {language === 'id' ? 'Lihat Semua Payout' : 'View All Payouts'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
