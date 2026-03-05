'use client'

import { useState } from 'react'
import { DollarSign, Clock, CheckCircle, AlertCircle, Download, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

interface Settlement {
  id: string
  period_start: string
  period_end: string
  gross_amount: number
  commission: number
  amount: number
  order_count: number
  status: string
  bank_name: string
  bank_account_number: string
  bank_account_name: string
  paid_at: string | null
  created_at: string
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed: { label: 'Gagal', color: 'bg-red-100 text-red-800', icon: AlertCircle },
}

const mockSettlements: Settlement[] = [
  {
    id: '1',
    period_start: '2026-02-24',
    period_end: '2026-03-02',
    gross_amount: 4500000,
    commission: 450000,
    amount: 4050000,
    order_count: 18,
    status: 'completed',
    bank_name: 'BCA',
    bank_account_number: '123****890',
    bank_account_name: 'Rina Fashion',
    paid_at: '2026-03-04',
    created_at: '2026-03-03',
  },
  {
    id: '2',
    period_start: '2026-03-03',
    period_end: '2026-03-05',
    gross_amount: 2100000,
    commission: 210000,
    amount: 1890000,
    order_count: 8,
    status: 'pending',
    bank_name: 'BCA',
    bank_account_number: '123****890',
    bank_account_name: 'Rina Fashion',
    paid_at: null,
    created_at: '2026-03-05',
  },
]

export default function SellerSettlementsPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = mockSettlements.filter(
    (s) => statusFilter === 'all' || s.status === statusFilter
  )

  const pendingTotal = mockSettlements
    .filter((s) => s.status === 'pending' || s.status === 'processing')
    .reduce((sum, s) => sum + s.amount, 0)

  const completedTotal = mockSettlements
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settlement</h1>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm text-muted-foreground">Saldo Pending</span>
          </div>
          <p className="text-2xl font-bold">{formatPrice(pendingTotal)}</p>
          <p className="text-xs text-muted-foreground mt-1">Akan ditransfer minggu depan</p>
        </div>

        <div className="bg-background rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">Total Diterima</span>
          </div>
          <p className="text-2xl font-bold">{formatPrice(completedTotal)}</p>
          <p className="text-xs text-muted-foreground mt-1">Sudah ditransfer ke rekening</p>
        </div>

        <div className="bg-background rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Komisi UC</span>
          </div>
          <p className="text-2xl font-bold">10%</p>
          <p className="text-xs text-muted-foreground mt-1">Per transaksi yang berhasil</p>
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-background rounded-xl border p-5">
        <h3 className="font-medium mb-2">Rekening Penerima</h3>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">BCA — 123****890 — Rina Fashion</span>
          <Button variant="outline" size="sm">Ubah</Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'pending', label: 'Menunggu' },
          { id: 'processing', label: 'Diproses' },
          { id: 'completed', label: 'Selesai' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settlement List */}
      <div className="space-y-4">
        {filtered.map((s) => {
          const cfg = statusConfig[s.status] || statusConfig.pending
          const StatusIcon = cfg.icon
          return (
            <div key={s.id} className="bg-background rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {s.period_start} — {s.period_end}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{s.order_count} pesanan</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Penjualan</p>
                  <p className="font-semibold">{formatPrice(s.gross_amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Komisi UC (10%)</p>
                  <p className="font-semibold text-red-600">-{formatPrice(s.commission)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Jumlah Diterima</p>
                  <p className="font-bold text-lg">{formatPrice(s.amount)}</p>
                </div>
              </div>

              {s.paid_at && (
                <p className="text-xs text-muted-foreground mt-3">
                  Ditransfer pada {s.paid_at} ke {s.bank_name} — {s.bank_account_number}
                </p>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Belum ada settlement</div>
        )}
      </div>
    </div>
  )
}
