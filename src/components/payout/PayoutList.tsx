'use client'

import { useState } from 'react'
import { Wallet, Clock, CheckCircle, AlertCircle, ChevronRight, Calendar, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePayoutStore, Payout, PayoutStatus } from '@/stores/payout'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

const statusConfig: Record<PayoutStatus, { label: { en: string; id: string }; color: string; icon: React.ElementType }> = {
  draft: {
    label: { en: 'Draft', id: 'Draft' },
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    icon: Clock,
  },
  pending: {
    label: { en: 'Pending', id: 'Menunggu' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
  },
  processing: {
    label: { en: 'Processing', id: 'Diproses' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: AlertCircle,
  },
  paid: {
    label: { en: 'Paid', id: 'Dibayar' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
  },
  failed: {
    label: { en: 'Failed', id: 'Gagal' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: AlertCircle,
  },
}

interface PayoutCardProps {
  payout: Payout
  onSelect: () => void
}

function PayoutCard({ payout, onSelect }: PayoutCardProps) {
  const { language } = useTranslation()
  const status = statusConfig[payout.status]
  const StatusIcon = status.icon

  return (
    <div
      onClick={onSelect}
      className="bg-background border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{payout.shopName}</span>
          </div>
          <p className="text-sm text-muted-foreground">{payout.partnerName}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
          <StatusIcon className="h-3 w-3" />
          {language === 'id' ? status.label.id : status.label.en}
        </span>
      </div>

      {/* Period */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Calendar className="h-4 w-4" />
        <span>{payout.periodLabel}</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{language === 'id' ? 'Penjualan' : 'Sales'}</p>
          <p className="font-semibold text-sm">{formatPrice(payout.totalSales)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{language === 'id' ? 'Komisi' : 'Commission'}</p>
          <p className="font-semibold text-sm text-amber-600">-{formatPrice(payout.commissionAmount)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{language === 'id' ? 'Potongan' : 'Deductions'}</p>
          <p className="font-semibold text-sm text-red-600">
            {payout.totalDeductions > 0 ? `-${formatPrice(payout.totalDeductions)}` : '-'}
          </p>
        </div>
      </div>

      {/* Net Payout */}
      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-sm text-muted-foreground">{language === 'id' ? 'Total Payout' : 'Net Payout'}</span>
        <span className="text-lg font-bold text-primary">{formatPrice(payout.netPayout)}</span>
      </div>

      {/* Transfer Info */}
      {payout.status === 'paid' && payout.transferReference && (
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          <p>Ref: {payout.transferReference}</p>
          <p>{new Date(payout.paidAt!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      )}

      {/* View Details */}
      <div className="flex items-center justify-end mt-2 text-xs text-primary">
        <span>{language === 'id' ? 'Lihat detail' : 'View details'}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  )
}

type FilterStatus = 'all' | 'pending' | 'processing' | 'paid'

export function PayoutList({ onSelectPayout }: { onSelectPayout: (payout: Payout) => void }) {
  const { language } = useTranslation()
  const { payouts } = usePayoutStore()
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filteredPayouts = filter === 'all'
    ? payouts
    : filter === 'pending'
    ? payouts.filter((p) => ['draft', 'pending'].includes(p.status))
    : payouts.filter((p) => p.status === filter)

  // Sort by created date descending
  filteredPayouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const statusCounts = {
    all: payouts.length,
    pending: payouts.filter((p) => ['draft', 'pending'].includes(p.status)).length,
    processing: payouts.filter((p) => p.status === 'processing').length,
    paid: payouts.filter((p) => p.status === 'paid').length,
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'processing', 'paid'] as FilterStatus[]).map((status) => (
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
              : status === 'processing'
              ? (language === 'id' ? 'Diproses' : 'Processing')
              : (language === 'id' ? 'Dibayar' : 'Paid')
            }
            {' '}({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Payout List */}
      {filteredPayouts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada payout' : 'No payouts'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayouts.map((payout) => (
            <PayoutCard
              key={payout.id}
              payout={payout}
              onSelect={() => onSelectPayout(payout)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
