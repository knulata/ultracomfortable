'use client'

import { useState } from 'react'
import { Wallet, Search, CheckCircle, CreditCard, Store } from 'lucide-react'
import { usePayoutStore, PayoutStatus } from '@/stores/payout'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type FilterType = 'all' | 'pending' | 'processing' | 'paid'

const statusConfig: Record<PayoutStatus, { label: { en: string; id: string }; color: string }> = {
  draft: {
    label: { en: 'Draft', id: 'Draft' },
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
  pending: {
    label: { en: 'Pending', id: 'Menunggu' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  processing: {
    label: { en: 'Processing', id: 'Diproses' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  paid: {
    label: { en: 'Paid', id: 'Dibayar' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  failed: {
    label: { en: 'Failed', id: 'Gagal' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export default function AdminPayoutsPage() {
  const { language } = useTranslation()
  const { payouts, approvePayout, markAsPaid } = usePayoutStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPayouts = payouts.filter((payout) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !payout.shopName.toLowerCase().includes(query) &&
        !payout.partnerName.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (filter === 'all') return true
    if (filter === 'pending') return ['draft', 'pending'].includes(payout.status)
    return payout.status === filter
  })

  // Sort by created date descending
  filteredPayouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const statusCounts = {
    all: payouts.length,
    pending: payouts.filter((p) => ['draft', 'pending'].includes(p.status)).length,
    processing: payouts.filter((p) => p.status === 'processing').length,
    paid: payouts.filter((p) => p.status === 'paid').length,
  }

  const handleApprove = (payoutId: string, shopName: string) => {
    approvePayout(payoutId, 'Admin')
    toast.success(
      language === 'id'
        ? `Payout ${shopName} disetujui!`
        : `Payout for ${shopName} approved!`
    )
  }

  const handleMarkPaid = (payoutId: string, shopName: string) => {
    const transferRef = `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
    markAsPaid(payoutId, transferRef, '', 'Finance')
    toast.success(
      language === 'id'
        ? `Transfer ke ${shopName} berhasil!`
        : `Transfer to ${shopName} completed!`
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          {language === 'id' ? 'Semua Payout' : 'All Payouts'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Kelola payout partner'
            : 'Manage partner payouts'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-background rounded-xl p-4 border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari payout...' : 'Search payouts...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'processing', 'paid'] as FilterType[]).map((status) => (
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
              }{' '}
              ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Payouts List */}
      <div className="bg-background rounded-xl border overflow-hidden">
        {filteredPayouts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada payout' : 'No payouts found'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPayouts.map((payout) => {
              const status = statusConfig[payout.status]
              return (
                <div key={payout.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{payout.shopName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {language === 'id' ? status.label.id : status.label.en}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{payout.partnerName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {payout.periodLabel} • {payout.totalItems} items
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatPrice(payout.netPayout)}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'id' ? 'Komisi' : 'Commission'}: {formatPrice(payout.commissionAmount)}
                      </p>

                      <div className="mt-2 flex gap-2 justify-end">
                        {payout.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(payout.id, payout.shopName)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {language === 'id' ? 'Setujui' : 'Approve'}
                          </Button>
                        )}
                        {payout.status === 'processing' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkPaid(payout.id, payout.shopName)}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            {language === 'id' ? 'Transfer' : 'Transfer'}
                          </Button>
                        )}
                        {payout.status === 'paid' && payout.transferReference && (
                          <span className="text-xs text-green-600">
                            Ref: {payout.transferReference}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
