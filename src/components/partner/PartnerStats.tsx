'use client'

import { Users, Clock, Package, Boxes, Wallet } from 'lucide-react'
import { usePartnerStore } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function PartnerStats() {
  const { language } = useTranslation()
  const { getPartnerStats } = usePartnerStore()
  const stats = getPartnerStats()

  const statCards = [
    {
      icon: Users,
      label: language === 'id' ? 'Total Partner' : 'Total Partners',
      value: stats.total.toString(),
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: Clock,
      label: language === 'id' ? 'Menunggu Review' : 'Pending Review',
      value: stats.pending.toString(),
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      alert: stats.pending > 0,
    },
    {
      icon: Users,
      label: language === 'id' ? 'Partner Aktif' : 'Active Partners',
      value: stats.active.toString(),
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      icon: Package,
      label: language === 'id' ? 'Total Produk' : 'Total Products',
      value: stats.totalProducts.toString(),
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Boxes,
      label: language === 'id' ? 'Total Stok' : 'Total Stock',
      value: stats.totalStock.toString(),
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      icon: Wallet,
      label: language === 'id' ? 'Pending Payout' : 'Pending Payouts',
      value: formatPrice(stats.pendingPayouts),
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-background border rounded-xl p-4 ${
            stat.alert ? 'border-amber-300 dark:border-amber-700' : ''
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
