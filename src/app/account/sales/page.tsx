'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Settings, RefreshCw, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSalesStore } from '@/stores/sales'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { SalesOverview, WeeklyChart, TopProducts, PaymentBreakdown } from '@/components/sales'
import { toast } from 'sonner'

export default function SalesPage() {
  const { language } = useTranslation()
  const { dailyTarget, setDailyTarget, getTodayVsYesterday } = useSalesStore()
  const [mounted, setMounted] = useState(false)
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [newTarget, setNewTarget] = useState('')

  useEffect(() => {
    setMounted(true)
    setNewTarget((dailyTarget / 1000000).toString())
  }, [dailyTarget])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    )
  }

  const comparison = getTodayVsYesterday()

  const handleSetTarget = () => {
    const targetValue = parseFloat(newTarget) * 1000000
    if (targetValue > 0) {
      setDailyTarget(targetValue)
      setShowTargetModal(false)
      toast.success(language === 'id' ? 'Target berhasil diubah!' : 'Target updated!')
    }
  }

  const handleShare = () => {
    const summary = language === 'id'
      ? `📊 Rekap Penjualan Hari Ini\n\n💰 Total: ${formatPrice(comparison.today.totalSales)}\n📦 Transaksi: ${comparison.today.totalTransactions}\n📈 vs Kemarin: ${comparison.salesChangePercent >= 0 ? '+' : ''}${comparison.salesChangePercent}%`
      : `📊 Today's Sales Recap\n\n💰 Total: ${formatPrice(comparison.today.totalSales)}\n📦 Transactions: ${comparison.today.totalTransactions}\n📈 vs Yesterday: ${comparison.salesChangePercent >= 0 ? '+' : ''}${comparison.salesChangePercent}%`

    if (navigator.share) {
      navigator.share({ text: summary })
    } else {
      navigator.clipboard.writeText(summary)
      toast.success(language === 'id' ? 'Disalin ke clipboard!' : 'Copied to clipboard!')
    }
  }

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12
    ? (language === 'id' ? 'Selamat Pagi' : 'Good Morning')
    : currentHour < 17
    ? (language === 'id' ? 'Selamat Siang' : 'Good Afternoon')
    : (language === 'id' ? 'Selamat Malam' : 'Good Evening')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">{greeting}! 👋</p>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            {language === 'id' ? 'Rekap Penjualan' : 'Sales Recap'}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Bagikan' : 'Share'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowTargetModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Target' : 'Target'}
          </Button>
        </div>
      </div>

      {/* Target Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Ubah Target Harian' : 'Change Daily Target'}
            </h2>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground block mb-1">
                {language === 'id' ? 'Target (dalam juta Rupiah)' : 'Target (in million Rupiah)'}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Rp</span>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="5"
                  min="0"
                  step="0.5"
                />
                <span className="text-muted-foreground">{language === 'id' ? 'juta' : 'M'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowTargetModal(false)}>
                {language === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button className="flex-1" onClick={handleSetTarget}>
                {language === 'id' ? 'Simpan' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Overview */}
      <SalesOverview />

      {/* Weekly Chart */}
      <WeeklyChart />

      {/* Bottom Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <TopProducts />
        <PaymentBreakdown />
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
        <h3 className="font-semibold mb-2">
          💡 {language === 'id' ? 'Tips Hari Ini' : "Today's Tip"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {comparison.today.resellerSales > comparison.today.retailSales
            ? (language === 'id'
                ? 'Penjualan reseller lebih tinggi hari ini. Pertahankan hubungan baik dengan reseller Anda!'
                : 'Reseller sales are higher today. Maintain good relationships with your resellers!')
            : (language === 'id'
                ? 'Penjualan eceran lebih tinggi hari ini. Coba tawarkan program reseller ke pelanggan tetap!'
                : 'Retail sales are higher today. Try offering reseller program to regular customers!')
          }
        </p>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground text-center">
        {language === 'id' ? 'Terakhir diperbarui:' : 'Last updated:'}{' '}
        {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  )
}
