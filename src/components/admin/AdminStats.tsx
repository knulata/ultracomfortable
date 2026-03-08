'use client'

import {
  TrendingUp,
  Users,
  Package,
  Wallet,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import { usePartnerStore } from '@/stores/partner'
import { usePayoutStore } from '@/stores/payout'
import { useFulfillmentStore } from '@/stores/fulfillment'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function AdminStats() {
  const { language } = useTranslation()
  const { partners } = usePartnerStore()
  const { payouts, getPayoutStats } = usePayoutStore()
  const { orders } = useFulfillmentStore()

  const payoutStats = getPayoutStats()

  // Partner stats
  const pendingPartners = partners.filter((p) => p.status === 'pending').length
  const activePartners = partners.filter((p) => p.status === 'active').length

  // Order stats
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const processingOrders = orders.filter((o) =>
    ['picking', 'qc', 'packing', 'ready_to_ship'].includes(o.status)
  ).length
  const shippedToday = orders.filter((o) => {
    if (o.status !== 'shipped' || !o.shippedAt) return false
    const today = new Date().toDateString()
    return new Date(o.shippedAt).toDateString() === today
  }).length

  // Revenue (mock calculation)
  const totalRevenue = orders
    .filter((o) => o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.sellingPrice * i.quantity, 0), 0)

  const stats = [
    {
      label: language === 'id' ? 'Total Pendapatan' : 'Total Revenue',
      value: formatPrice(totalRevenue),
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: language === 'id' ? 'Partner Aktif' : 'Active Partners',
      value: activePartners.toString(),
      subtext: `${pendingPartners} ${language === 'id' ? 'menunggu' : 'pending'}`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: language === 'id' ? 'Pesanan Hari Ini' : "Today's Orders",
      value: (pendingOrders + processingOrders).toString(),
      subtext: `${shippedToday} ${language === 'id' ? 'dikirim' : 'shipped'}`,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      label: language === 'id' ? 'Pending Payout' : 'Pending Payouts',
      value: formatPrice(payoutStats.totalPendingAmount),
      subtext: `${payoutStats.totalPending} payouts`,
      icon: Wallet,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className={`${stat.bg} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              {stat.change && (
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              )}
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            {stat.subtext && (
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function QuickActions() {
  const { language } = useTranslation()
  const { partners } = usePartnerStore()
  const { payouts } = usePayoutStore()
  const { orders } = useFulfillmentStore()

  const pendingPartners = partners.filter((p) => p.status === 'pending').length
  const pendingPayouts = payouts.filter((p) => p.status === 'pending').length
  const urgentOrders = orders.filter((o) => o.status === 'pending').length

  const actions = [
    {
      label: language === 'id' ? 'Partner Menunggu Approval' : 'Partners Awaiting Approval',
      count: pendingPartners,
      icon: Users,
      href: '/admin/partners',
      color: 'text-blue-600',
      urgent: pendingPartners > 0,
    },
    {
      label: language === 'id' ? 'Pesanan Perlu Diproses' : 'Orders Need Processing',
      count: urgentOrders,
      icon: Clock,
      href: '/admin/orders',
      color: 'text-amber-600',
      urgent: urgentOrders > 5,
    },
    {
      label: language === 'id' ? 'Payout Perlu Approval' : 'Payouts Need Approval',
      count: pendingPayouts,
      icon: Wallet,
      href: '/admin/payouts',
      color: 'text-purple-600',
      urgent: pendingPayouts > 0,
    },
  ]

  return (
    <div className="bg-background rounded-xl p-4 border">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        {language === 'id' ? 'Perlu Tindakan' : 'Action Required'}
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <a
              key={index}
              href={action.href}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                action.urgent
                  ? 'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${action.color}`} />
                <span className="text-sm">{action.label}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  action.urgent
                    ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {action.count}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
