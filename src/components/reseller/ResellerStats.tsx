'use client'

import { Users, UserPlus, TrendingUp, DollarSign, Award } from 'lucide-react'
import { useResellerStore, RESELLER_TIERS } from '@/stores/reseller'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function ResellerStats() {
  const { language } = useTranslation()
  const { getResellerStats } = useResellerStore()

  const stats = getResellerStats()

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Reseller Aktif' : 'Active Resellers'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <UserPlus className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Menunggu Approval' : 'Pending Approval'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{formatPrice(stats.revenueThisMonth)}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Omzet Bulan Ini' : 'Revenue This Month'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold">{formatPrice(stats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Total Omzet' : 'Total Revenue'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Breakdown & Top Resellers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tier Breakdown */}
        <div className="bg-background border rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {language === 'id' ? 'Reseller per Level' : 'Resellers by Tier'}
          </h3>
          <div className="space-y-3">
            {RESELLER_TIERS.map((tier) => {
              const count = stats.byTier[tier.id] || 0
              const percentage = stats.approved > 0 ? (count / stats.approved) * 100 : 0

              return (
                <div key={tier.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${tier.color}`}>
                      {tier.badge} {language === 'id' ? tier.nameId : tier.name}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Resellers */}
        <div className="bg-background border rounded-xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {language === 'id' ? 'Top 5 Reseller' : 'Top 5 Resellers'}
          </h3>
          <div className="space-y-3">
            {stats.topResellers.map((reseller, index) => {
              const tier = RESELLER_TIERS.find((t) => t.id === reseller.tierId)

              return (
                <div key={reseller.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-700' :
                    index === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{reseller.businessName}</p>
                    <p className="text-xs text-muted-foreground">{reseller.totalOrders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{formatPrice(reseller.totalSpent)}</p>
                    <span className={`text-xs ${tier?.color}`}>{tier?.badge}</span>
                  </div>
                </div>
              )
            })}

            {stats.topResellers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {language === 'id' ? 'Belum ada reseller' : 'No resellers yet'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
