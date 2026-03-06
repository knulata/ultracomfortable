'use client'

import { Package, ClipboardList, Box, Truck, CheckCircle, RotateCcw, Clock, TrendingUp } from 'lucide-react'
import { useFulfillmentStore } from '@/stores/fulfillment'
import { useTranslation } from '@/stores/language'

export function FulfillmentStats() {
  const { language } = useTranslation()
  const { getFulfillmentStats } = useFulfillmentStore()
  const stats = getFulfillmentStats()

  const statCards = [
    {
      icon: Clock,
      label: language === 'id' ? 'Pending' : 'Pending',
      value: stats.pending,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      alert: stats.pending > 3,
    },
    {
      icon: ClipboardList,
      label: language === 'id' ? 'Picking' : 'Picking',
      value: stats.picking,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: Box,
      label: language === 'id' ? 'QC/Packing' : 'QC/Packing',
      value: stats.packing,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Package,
      label: language === 'id' ? 'Siap Kirim' : 'Ready to Ship',
      value: stats.readyToShip,
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      alert: stats.readyToShip > 0,
    },
    {
      icon: Truck,
      label: language === 'id' ? 'Dikirim' : 'Shipped',
      value: stats.shipped,
      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    {
      icon: TrendingUp,
      label: language === 'id' ? 'Order Hari Ini' : 'Today Orders',
      value: stats.todayOrders,
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    {
      icon: CheckCircle,
      label: language === 'id' ? 'Kirim Hari Ini' : 'Shipped Today',
      value: stats.todayShipped,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      icon: RotateCcw,
      label: language === 'id' ? 'Retur Pending' : 'Pending Returns',
      value: stats.pendingReturns,
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      alert: stats.pendingReturns > 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-background border rounded-xl p-4 ${
            stat.alert ? 'border-primary ring-1 ring-primary/20' : ''
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
