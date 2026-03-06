'use client'

import { useState } from 'react'
import { RotateCcw, Package, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFulfillmentStore, ReturnItem } from '@/stores/fulfillment'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

const reasonLabels: Record<ReturnItem['reason'], { en: string; id: string }> = {
  defect: { en: 'Defect', id: 'Cacat' },
  wrong_item: { en: 'Wrong Item', id: 'Salah Barang' },
  not_as_described: { en: 'Not as Described', id: 'Tidak Sesuai' },
  damaged: { en: 'Damaged', id: 'Rusak' },
  customer_change_mind: { en: 'Changed Mind', id: 'Berubah Pikiran' },
}

const conditionLabels: Record<ReturnItem['condition'], { en: string; id: string }> = {
  good: { en: 'Good', id: 'Baik' },
  damaged: { en: 'Damaged', id: 'Rusak' },
  unusable: { en: 'Unusable', id: 'Tidak Layak' },
}

const statusConfig: Record<ReturnItem['status'], { label: { en: string; id: string }; color: string }> = {
  pending: { label: { en: 'Pending', id: 'Menunggu' }, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  inspecting: { label: { en: 'Inspecting', id: 'Diperiksa' }, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  approved: { label: { en: 'Approved', id: 'Disetujui' }, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: { en: 'Rejected', id: 'Ditolak' }, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  refunded: { label: { en: 'Refunded', id: 'Refund' }, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  restocked: { label: { en: 'Restocked', id: 'Restock' }, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
}

interface ReturnCardProps {
  returnItem: ReturnItem
  onProcess: () => void
}

function ReturnCard({ returnItem, onProcess }: ReturnCardProps) {
  const { language } = useTranslation()
  const status = statusConfig[returnItem.status]

  return (
    <div className="bg-background border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-mono font-semibold">{returnItem.orderNumber}</p>
          <p className="text-sm">{returnItem.productName}</p>
          <p className="text-xs text-muted-foreground">
            SKU: {returnItem.sku} • {returnItem.quantity} pcs
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {language === 'id' ? status.label.id : status.label.en}
        </span>
      </div>

      {/* Reason & Condition */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-xs text-muted-foreground">{language === 'id' ? 'Alasan' : 'Reason'}</p>
          <p className="text-sm font-medium">
            {language === 'id' ? reasonLabels[returnItem.reason].id : reasonLabels[returnItem.reason].en}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <p className="text-xs text-muted-foreground">{language === 'id' ? 'Kondisi' : 'Condition'}</p>
          <p className="text-sm font-medium">
            {language === 'id' ? conditionLabels[returnItem.condition].id : conditionLabels[returnItem.condition].en}
          </p>
        </div>
      </div>

      {/* Note */}
      {returnItem.note && (
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2 mb-3">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {returnItem.note}
          </p>
        </div>
      )}

      {/* Partner & Refund */}
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-muted-foreground">{returnItem.partnerName}</span>
        <span className="font-semibold text-red-600">-{formatPrice(returnItem.refundAmount)}</span>
      </div>

      {/* Actions */}
      {['pending', 'inspecting'].includes(returnItem.status) && (
        <Button onClick={onProcess} className="w-full" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Proses Retur' : 'Process Return'}
        </Button>
      )}
    </div>
  )
}

interface ProcessReturnModalProps {
  returnItem: ReturnItem
  onClose: () => void
  onApprove: (restock: boolean) => void
  onReject: (note: string) => void
}

function ProcessReturnModal({ returnItem, onClose, onApprove, onReject }: ProcessReturnModalProps) {
  const { language } = useTranslation()
  const [rejectNote, setRejectNote] = useState('')
  const [showReject, setShowReject] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {language === 'id' ? 'Proses Retur' : 'Process Return'}
          </h2>

          {/* Product Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="font-medium">{returnItem.productName}</p>
            <p className="text-sm text-muted-foreground">
              {returnItem.orderNumber} • {returnItem.quantity} pcs
            </p>
            <p className="text-sm mt-2">
              <span className="text-muted-foreground">{language === 'id' ? 'Alasan:' : 'Reason:'}</span>{' '}
              {language === 'id' ? reasonLabels[returnItem.reason].id : reasonLabels[returnItem.reason].en}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">{language === 'id' ? 'Kondisi:' : 'Condition:'}</span>{' '}
              {language === 'id' ? conditionLabels[returnItem.condition].id : conditionLabels[returnItem.condition].en}
            </p>
            {returnItem.note && (
              <p className="text-sm mt-2 text-amber-700 dark:text-amber-400">
                "{returnItem.note}"
              </p>
            )}
          </div>

          {/* Refund Amount */}
          <div className="flex items-center justify-between mb-4 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
            <span className="text-sm">{language === 'id' ? 'Jumlah Refund' : 'Refund Amount'}</span>
            <span className="font-bold text-red-600">{formatPrice(returnItem.refundAmount)}</span>
          </div>

          {showReject ? (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">
                  {language === 'id' ? 'Alasan Penolakan' : 'Rejection Reason'}
                </label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder={language === 'id' ? 'Jelaskan alasan...' : 'Explain reason...'}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-destructive"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReject(false)} className="flex-1">
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onReject(rejectNote)}
                  disabled={!rejectNote.trim()}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Tolak Retur' : 'Reject Return'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === 'id'
                  ? 'Pilih aksi untuk retur ini:'
                  : 'Choose action for this return:'
                }
              </p>

              {returnItem.condition === 'good' && (
                <Button onClick={() => onApprove(true)} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Setujui & Restock' : 'Approve & Restock'}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => onApprove(false)}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {language === 'id'
                  ? 'Setujui (Tanpa Restock)'
                  : 'Approve (No Restock)'
                }
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowReject(true)}
                className="w-full text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Tolak Retur' : 'Reject Return'}
              </Button>
            </div>
          )}

          <Button variant="ghost" onClick={onClose} className="w-full mt-3">
            {language === 'id' ? 'Tutup' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  )
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export function ReturnsManager() {
  const { language } = useTranslation()
  const { returns, updateReturnStatus } = useFulfillmentStore()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [selectedReturn, setSelectedReturn] = useState<ReturnItem | null>(null)

  const filteredReturns = filter === 'all'
    ? returns
    : filter === 'pending'
    ? returns.filter((r) => ['pending', 'inspecting'].includes(r.status))
    : returns.filter((r) => r.status === filter)

  const statusCounts = {
    all: returns.length,
    pending: returns.filter((r) => ['pending', 'inspecting'].includes(r.status)).length,
    approved: returns.filter((r) => ['approved', 'refunded', 'restocked'].includes(r.status)).length,
    rejected: returns.filter((r) => r.status === 'rejected').length,
  }

  const handleApprove = (returnItem: ReturnItem, restock: boolean) => {
    updateReturnStatus(returnItem.id, restock ? 'restocked' : 'refunded')
    toast.success(
      language === 'id'
        ? `Retur disetujui${restock ? ' dan direstock' : ''}`
        : `Return approved${restock ? ' and restocked' : ''}`
    )
    setSelectedReturn(null)
  }

  const handleReject = (returnItem: ReturnItem, note: string) => {
    updateReturnStatus(returnItem.id, 'rejected', note)
    toast.success(language === 'id' ? 'Retur ditolak' : 'Return rejected')
    setSelectedReturn(null)
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {status === 'all'
              ? (language === 'id' ? 'Semua' : 'All')
              : status === 'pending'
              ? (language === 'id' ? 'Menunggu' : 'Pending')
              : status === 'approved'
              ? (language === 'id' ? 'Disetujui' : 'Approved')
              : (language === 'id' ? 'Ditolak' : 'Rejected')
            }
            {' '}({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Alert for pending returns */}
      {statusCounts.pending > 0 && filter !== 'pending' && (
        <button
          onClick={() => setFilter('pending')}
          className="w-full p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          {statusCounts.pending} {language === 'id' ? 'retur menunggu diproses' : 'returns pending'}
        </button>
      )}

      {/* Returns List */}
      {filteredReturns.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <RotateCcw className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada retur' : 'No returns'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReturns.map((returnItem) => (
            <ReturnCard
              key={returnItem.id}
              returnItem={returnItem}
              onProcess={() => setSelectedReturn(returnItem)}
            />
          ))}
        </div>
      )}

      {/* Process Modal */}
      {selectedReturn && (
        <ProcessReturnModal
          returnItem={selectedReturn}
          onClose={() => setSelectedReturn(null)}
          onApprove={(restock) => handleApprove(selectedReturn, restock)}
          onReject={(note) => handleReject(selectedReturn, note)}
        />
      )}
    </div>
  )
}
