'use client'

import { TrendingUp, TrendingDown, ShoppingBag, Users, Target, Banknote } from 'lucide-react'
import { useSalesStore } from '@/stores/sales'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function SalesOverview() {
  const { language } = useTranslation()
  const { getTodayVsYesterday, getTargetProgress } = useSalesStore()

  const comparison = getTodayVsYesterday()
  const target = getTargetProgress()

  const isPositive = comparison.salesChange >= 0

  return (
    <div className="space-y-4">
      {/* Main Sales Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-100 text-sm">
            {language === 'id' ? 'Penjualan Hari Ini' : "Today's Sales"}
          </span>
          <div className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-green-400/30' : 'bg-red-400/30'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{isPositive ? '+' : ''}{comparison.salesChangePercent}%</span>
          </div>
        </div>

        <p className="text-4xl font-bold mb-1">
          {formatPrice(comparison.today.totalSales)}
        </p>

        <p className="text-green-100 text-sm">
          {language === 'id' ? 'vs kemarin' : 'vs yesterday'}: {formatPrice(comparison.yesterday.totalSales)}
          {comparison.salesChange !== 0 && (
            <span className="ml-2">
              ({isPositive ? '+' : ''}{formatPrice(comparison.salesChange)})
            </span>
          )}
        </p>
      </div>

      {/* Target Progress */}
      <div className="bg-background border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {language === 'id' ? 'Target Harian' : 'Daily Target'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {target.percent}%
          </span>
        </div>

        <div className="h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${
              target.percent >= 100
                ? 'bg-green-500'
                : target.percent >= 70
                ? 'bg-primary'
                : target.percent >= 40
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, target.percent)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {formatPrice(target.current)} / {formatPrice(target.target)}
          </span>
          {target.remaining > 0 ? (
            <span className="text-amber-600">
              {language === 'id' ? 'Kurang' : 'Need'} {formatPrice(target.remaining)}
            </span>
          ) : (
            <span className="text-green-600 font-medium">
              🎉 {language === 'id' ? 'Target tercapai!' : 'Target reached!'}
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? 'Transaksi' : 'Transactions'}
            </span>
          </div>
          <p className="text-2xl font-bold">{comparison.today.totalTransactions}</p>
          <p className="text-xs text-muted-foreground">
            {comparison.transactionsChange >= 0 ? '+' : ''}{comparison.transactionsChange} vs kemarin
          </p>
        </div>

        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Banknote className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? 'Rata-rata' : 'Average'}
            </span>
          </div>
          <p className="text-xl font-bold">{formatPrice(comparison.today.avgTransactionValue)}</p>
          <p className="text-xs text-muted-foreground">
            {language === 'id' ? 'per transaksi' : 'per transaction'}
          </p>
        </div>

        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Users className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? 'Reseller' : 'Reseller'}
            </span>
          </div>
          <p className="text-xl font-bold">{formatPrice(comparison.today.resellerSales)}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round((comparison.today.resellerSales / (comparison.today.totalSales || 1)) * 100)}% {language === 'id' ? 'dari total' : 'of total'}
          </p>
        </div>

        <div className="bg-background border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? 'Eceran' : 'Retail'}
            </span>
          </div>
          <p className="text-xl font-bold">{formatPrice(comparison.today.retailSales)}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round((comparison.today.retailSales / (comparison.today.totalSales || 1)) * 100)}% {language === 'id' ? 'dari total' : 'of total'}
          </p>
        </div>
      </div>
    </div>
  )
}
