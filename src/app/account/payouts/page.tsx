'use client'

import { useState } from 'react'
import { Calculator, List, CreditCard, BarChart3, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { Payout } from '@/stores/payout'
import {
  PayoutCalculator,
  PayoutList,
  PayoutDetail,
  PayoutStats,
  TransferTracker,
} from '@/components/payout'

type TabType = 'list' | 'calculator' | 'transfers' | 'stats'

export default function PayoutsPage() {
  const { language } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabType>('list')
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)

  const tabs = [
    { id: 'list' as const, label: language === 'id' ? 'Daftar' : 'List', icon: List },
    { id: 'calculator' as const, label: language === 'id' ? 'Hitung' : 'Calculate', icon: Calculator },
    { id: 'transfers' as const, label: language === 'id' ? 'Transfer' : 'Transfer', icon: CreditCard },
    { id: 'stats' as const, label: language === 'id' ? 'Statistik' : 'Stats', icon: BarChart3 },
  ]

  // If a payout is selected, show the detail view
  if (selectedPayout) {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <div className="bg-background border-b px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedPayout(null)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">
              {language === 'id' ? 'Detail Payout' : 'Payout Detail'}
            </h1>
            <p className="text-xs text-muted-foreground">{selectedPayout.shopName}</p>
          </div>
        </div>

        {/* Payout Detail */}
        <div className="p-4">
          <PayoutDetail
            payout={selectedPayout}
            onBack={() => setSelectedPayout(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b px-4 py-4">
        <h1 className="text-xl font-bold">
          {language === 'id' ? 'Payout Partner' : 'Partner Payouts'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {language === 'id'
            ? 'Kelola pembayaran ke partner'
            : 'Manage partner payments'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-background border-b px-4 py-2 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'list' && (
          <PayoutList onSelectPayout={(payout) => setSelectedPayout(payout)} />
        )}
        {activeTab === 'calculator' && <PayoutCalculator />}
        {activeTab === 'transfers' && <TransferTracker />}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <PayoutStats />

            {/* Additional Stats Info */}
            <div className="bg-background rounded-xl p-4 border">
              <h3 className="font-semibold mb-3">
                {language === 'id' ? 'Ringkasan Periode' : 'Period Summary'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'id'
                  ? 'Statistik lengkap akan tersedia setelah ada lebih banyak data transaksi.'
                  : 'Complete statistics will be available after more transaction data.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
