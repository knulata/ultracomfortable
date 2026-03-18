'use client'

import { useState } from 'react'
import { Wallet, Calendar, CheckCircle, Clock, Download, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Partner, PartnerPayout } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

interface PartnerEarningsProps {
  partner: Partner
  payouts: PartnerPayout[]
}

// Mock payouts for demo
const mockPayouts: PartnerPayout[] = [
  {
    id: 'payout-1',
    partnerId: 'partner-1',
    period: '25 Feb - 3 Mar 2024',
    totalSales: 4500000,
    commission: 675000,
    deductions: 150000,
    netPayout: 3675000,
    status: 'paid',
    paidAt: '2024-03-04T10:30:00Z',
    createdAt: '2024-03-04T00:00:00Z',
  },
  {
    id: 'payout-2',
    partnerId: 'partner-1',
    period: '18 - 24 Feb 2024',
    totalSales: 3800000,
    commission: 570000,
    deductions: 0,
    netPayout: 3230000,
    status: 'paid',
    paidAt: '2024-02-25T14:00:00Z',
    createdAt: '2024-02-25T00:00:00Z',
  },
  {
    id: 'payout-3',
    partnerId: 'partner-1',
    period: '4 - 10 Mar 2024',
    totalSales: 3200000,
    commission: 480000,
    deductions: 75000,
    netPayout: 2645000,
    status: 'pending',
    createdAt: '2024-03-11T00:00:00Z',
  },
]

const statusConfig: Record<PartnerPayout['status'], { label: { en: string; id: string }; color: string }> = {
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
}

export function PartnerEarnings({ partner, payouts: initialPayouts }: PartnerEarningsProps) {
  const { language } = useTranslation()
  const [selectedPayout, setSelectedPayout] = useState<PartnerPayout | null>(null)

  // Use mock payouts if none provided
  const payouts = initialPayouts.length > 0 ? initialPayouts : mockPayouts

  // Calculate totals
  const totalPaid = payouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.netPayout, 0)

  const totalPending = payouts
    .filter((p) => p.status !== 'paid')
    .reduce((sum, p) => sum + p.netPayout, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? 'Total Diterima' : 'Total Received'}
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatPrice(totalPaid)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? 'Pending' : 'Pending'}
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{formatPrice(totalPending)}</p>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {language === 'id' ? 'Ringkasan Pendapatan' : 'Earnings Summary'}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {language === 'id' ? 'Total Penjualan' : 'Total Sales'}
            </span>
            <span className="font-medium">{formatPrice(partner.totalSales)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>
              {language === 'id' ? 'Komisi UC' : 'AlyaNoor Commission'} ({partner.commissionRate}%)
            </span>
            <span>-{formatPrice(partner.totalSales * (partner.commissionRate / 100))}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between text-green-600 font-semibold">
            <span>{language === 'id' ? 'Pendapatan Anda' : 'Your Earnings'}</span>
            <span>{formatPrice(partner.totalEarnings)}</span>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {language === 'id' ? 'Riwayat Pencairan' : 'Payout History'}
          </h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Export' : 'Export'}
          </Button>
        </div>

        {payouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Belum ada riwayat pencairan' : 'No payout history yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                onClick={() => setSelectedPayout(selectedPayout?.id === payout.id ? null : payout)}
                className="bg-background border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{payout.period}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.status === 'paid' && payout.paidAt
                        ? `${language === 'id' ? 'Dibayar' : 'Paid'} ${new Date(payout.paidAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : (language === 'id' ? 'Menunggu transfer' : 'Awaiting transfer')
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatPrice(payout.netPayout)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[payout.status].color}`}>
                      {language === 'id' ? statusConfig[payout.status].label.id : statusConfig[payout.status].label.en}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPayout?.id === payout.id && (
                  <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {language === 'id' ? 'Total Penjualan' : 'Total Sales'}
                      </span>
                      <span>{formatPrice(payout.totalSales)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>{language === 'id' ? 'Komisi UC' : 'AlyaNoor Commission'}</span>
                      <span>-{formatPrice(payout.commission)}</span>
                    </div>
                    {payout.deductions > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>{language === 'id' ? 'Potongan (retur/defect)' : 'Deductions (returns/defects)'}</span>
                        <span>-{formatPrice(payout.deductions)}</span>
                      </div>
                    )}
                    <div className="h-px bg-border" />
                    <div className="flex justify-between font-semibold">
                      <span>{language === 'id' ? 'Total Diterima' : 'Net Payout'}</span>
                      <span className="text-green-600">{formatPrice(payout.netPayout)}</span>
                    </div>
                    {payout.notes && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {language === 'id' ? 'Catatan:' : 'Notes:'} {payout.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bank Account Info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold mb-2">
          {language === 'id' ? 'Rekening Tujuan' : 'Payout Account'}
        </h3>
        <p className="font-medium">{partner.bankName}</p>
        <p className="font-mono">{partner.bankAccountNumber}</p>
        <p className="text-sm text-muted-foreground">a.n. {partner.bankAccountName}</p>
      </div>
    </div>
  )
}
