'use client'

import { useState } from 'react'
import { CreditCard, Upload, CheckCircle, Store, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePayoutStore, Payout } from '@/stores/payout'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface TransferCardProps {
  payout: Payout
  onTransfer: (payout: Payout) => void
}

function TransferCard({ payout, onTransfer }: TransferCardProps) {
  const { language } = useTranslation()

  return (
    <div className="bg-background border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{payout.shopName}</span>
          </div>
          <p className="text-sm text-muted-foreground">{payout.partnerName}</p>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
          {language === 'id' ? 'Siap Transfer' : 'Ready to Transfer'}
        </span>
      </div>

      {/* Period */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Calendar className="h-4 w-4" />
        <span>{payout.periodLabel}</span>
      </div>

      {/* Bank Info */}
      <div className="bg-muted/50 rounded-lg p-3 mb-3">
        <p className="text-xs text-muted-foreground mb-1">{language === 'id' ? 'Transfer ke' : 'Transfer to'}</p>
        <p className="font-semibold">{payout.bankName}</p>
        <p className="font-mono">{payout.bankAccountNumber}</p>
        <p className="text-sm text-muted-foreground">a.n. {payout.bankAccountName}</p>
      </div>

      {/* Amount */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">{language === 'id' ? 'Jumlah' : 'Amount'}</span>
        <span className="text-xl font-bold text-primary">{formatPrice(payout.netPayout)}</span>
      </div>

      {/* Transfer Button */}
      <Button onClick={() => onTransfer(payout)} className="w-full">
        <CreditCard className="h-4 w-4 mr-2" />
        {language === 'id' ? 'Proses Transfer' : 'Process Transfer'}
      </Button>
    </div>
  )
}

interface TransferModalProps {
  payout: Payout
  onClose: () => void
  onConfirm: (transferRef: string, proofUrl: string) => void
}

function TransferModal({ payout, onClose, onConfirm }: TransferModalProps) {
  const { language } = useTranslation()
  const [transferRef, setTransferRef] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!transferRef.trim()) {
      toast.error(language === 'id' ? 'Masukkan nomor referensi!' : 'Enter reference number!')
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConfirm(transferRef, proofUrl)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {language === 'id' ? 'Konfirmasi Transfer' : 'Confirm Transfer'}
          </h2>

          {/* Payout Summary */}
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="font-semibold">{payout.shopName}</p>
            <p className="text-sm text-muted-foreground">{payout.partnerName}</p>
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm">{payout.bankName} - {payout.bankAccountNumber}</p>
              <p className="text-xs text-muted-foreground">a.n. {payout.bankAccountName}</p>
            </div>
            <p className="text-xl font-bold text-primary mt-2">{formatPrice(payout.netPayout)}</p>
          </div>

          {/* Transfer Reference */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nomor Referensi Transfer *' : 'Transfer Reference Number *'}
            </label>
            <input
              type="text"
              value={transferRef}
              onChange={(e) => setTransferRef(e.target.value)}
              placeholder="TRF-20240306-001"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Proof URL (optional) */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Link Bukti Transfer (opsional)' : 'Transfer Proof URL (optional)'}
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'id' ? 'Upload bukti ke cloud storage dan paste linknya' : 'Upload proof to cloud storage and paste the link'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {language === 'id' ? 'Batal' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {language === 'id' ? 'Memproses...' : 'Processing...'}
                </span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Konfirmasi' : 'Confirm'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TransferTracker() {
  const { language } = useTranslation()
  const { payouts, markAsPaid } = usePayoutStore()
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)

  // Get payouts that are ready to transfer (processing status)
  const processingPayouts = payouts.filter((p) => p.status === 'processing')

  // Get recently paid payouts
  const recentlyPaid = payouts
    .filter((p) => p.status === 'paid')
    .sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime())
    .slice(0, 5)

  const handleConfirmTransfer = (transferRef: string, proofUrl: string) => {
    if (!selectedPayout) return

    markAsPaid(selectedPayout.id, transferRef, proofUrl, 'Finance')
    toast.success(
      language === 'id'
        ? `Transfer ke ${selectedPayout.shopName} berhasil!`
        : `Transfer to ${selectedPayout.shopName} completed!`
    )
    setSelectedPayout(null)
  }

  const totalPendingAmount = processingPayouts.reduce((sum, p) => sum + p.netPayout, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {language === 'id' ? 'Total Pending Transfer' : 'Total Pending Transfer'}
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatPrice(totalPendingAmount)}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              {processingPayouts.length} {language === 'id' ? 'payout' : 'payouts'}
            </p>
          </div>
          <CreditCard className="h-10 w-10 text-blue-600/50" />
        </div>
      </div>

      {/* Pending Transfers */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          {language === 'id' ? 'Menunggu Transfer' : 'Awaiting Transfer'}
          {processingPayouts.length > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
              {processingPayouts.length}
            </span>
          )}
        </h3>

        {processingPayouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada transfer pending' : 'No pending transfers'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processingPayouts.map((payout) => (
              <TransferCard
                key={payout.id}
                payout={payout}
                onTransfer={(p) => setSelectedPayout(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recently Paid */}
      {recentlyPaid.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            {language === 'id' ? 'Baru Dibayar' : 'Recently Paid'}
          </h3>
          <div className="space-y-2">
            {recentlyPaid.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{payout.shopName}</p>
                  <p className="text-xs text-muted-foreground">
                    {payout.transferReference} • {new Date(payout.paidAt!).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className="font-semibold text-green-600">{formatPrice(payout.netPayout)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {selectedPayout && (
        <TransferModal
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
          onConfirm={handleConfirmTransfer}
        />
      )}
    </div>
  )
}
