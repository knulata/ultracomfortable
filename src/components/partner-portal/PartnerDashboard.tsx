'use client'

import { Package, TrendingUp, Wallet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Partner } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

interface PartnerDashboardProps {
  partner: Partner
}

export function PartnerDashboard({ partner }: PartnerDashboardProps) {
  const { language } = useTranslation()

  // Calculate some derived stats
  const earningsRate = partner.totalSales > 0
    ? Math.round((partner.totalEarnings / partner.totalSales) * 100)
    : 100 - partner.commissionRate

  const stats = [
    {
      icon: Package,
      label: language === 'id' ? 'Total Produk' : 'Total Products',
      value: partner.totalProducts.toString(),
      subValue: `${partner.totalStock} ${language === 'id' ? 'unit stok' : 'units in stock'}`,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: TrendingUp,
      label: language === 'id' ? 'Total Penjualan' : 'Total Sales',
      value: formatPrice(partner.totalSales),
      subValue: language === 'id' ? 'Sejak bergabung' : 'Since joined',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      trend: { value: 12, up: true }, // Mock trend
    },
    {
      icon: Wallet,
      label: language === 'id' ? 'Total Pendapatan' : 'Total Earnings',
      value: formatPrice(partner.totalEarnings),
      subValue: `${earningsRate}% ${language === 'id' ? 'dari penjualan' : 'of sales'}`,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Clock,
      label: language === 'id' ? 'Pending Payout' : 'Pending Payout',
      value: formatPrice(partner.pendingPayout),
      subValue: partner.lastPayoutAt
        ? `${language === 'id' ? 'Terakhir:' : 'Last:'} ${new Date(partner.lastPayoutAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
        : (language === 'id' ? 'Belum ada payout' : 'No payout yet'),
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      highlight: partner.pendingPayout > 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <h2 className="text-xl font-bold mb-1">
          {language === 'id' ? 'Selamat datang kembali,' : 'Welcome back,'} {partner.ownerName.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground">
          {partner.shopName} • {partner.shopAddress}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-background border rounded-xl p-4 ${
              stat.highlight ? 'border-amber-300 dark:border-amber-700' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend.up ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend.up ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.trend.value}%
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
          </div>
        ))}
      </div>

      {/* Commission Info */}
      <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {language === 'id' ? 'Komisi UC Anda' : 'Your AlyaNoor Commission'}
          </p>
          <p className="text-2xl font-bold text-primary">{partner.commissionRate}%</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {language === 'id' ? 'Anda menerima' : 'You receive'}
          </p>
          <p className="text-2xl font-bold text-green-600">{100 - partner.commissionRate}%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 bg-background border rounded-xl text-left hover:border-primary/50 transition-colors">
          <Package className="h-5 w-5 text-primary mb-2" />
          <p className="font-medium">{language === 'id' ? 'Lihat Produk' : 'View Products'}</p>
          <p className="text-sm text-muted-foreground">
            {partner.totalProducts} {language === 'id' ? 'produk aktif' : 'active products'}
          </p>
        </button>
        <button className="p-4 bg-background border rounded-xl text-left hover:border-primary/50 transition-colors">
          <Wallet className="h-5 w-5 text-primary mb-2" />
          <p className="font-medium">{language === 'id' ? 'Riwayat Payout' : 'Payout History'}</p>
          <p className="text-sm text-muted-foreground">
            {language === 'id' ? 'Lihat semua pencairan' : 'View all payouts'}
          </p>
        </button>
      </div>
    </div>
  )
}
