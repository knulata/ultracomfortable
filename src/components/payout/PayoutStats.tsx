'use client'

import { Wallet, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react'
import { usePayoutStore } from '@/stores/payout'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function PayoutStats() {
  const { language } = useTranslation()
  const { getPayoutStats } = usePayoutStore()
  const stats = getPayoutStats()

  const statCards = [
    {
      label: language === 'id' ? 'Total Pending' : 'Pending Amount',
      value: formatPrice(stats.totalPendingAmount),
      subtext: `${stats.totalPending} payouts`,
      icon: Wallet,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: language === 'id' ? 'Dibayar Bulan Ini' : 'Paid This Month',
      value: formatPrice(stats.totalPaidAmount),
      subtext: `${stats.totalPaidThisMonth} payouts`,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: language === 'id' ? 'Menunggu' : 'Pending',
      value: stats.totalPending.toString(),
      subtext: language === 'id' ? 'payout' : 'payouts',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: language === 'id' ? 'Partner Aktif' : 'Active Partners',
      value: stats.partnersWithPending.toString(),
      subtext: language === 'id' ? 'dengan pending' : 'with pending',
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`${stat.bg} rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            {stat.subtext && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
