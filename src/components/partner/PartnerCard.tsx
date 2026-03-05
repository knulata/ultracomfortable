'use client'

import { Store, MapPin, Package, TrendingUp, Wallet } from 'lucide-react'
import { Partner } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

interface PartnerCardProps {
  partner: Partner
  onClick?: () => void
}

const statusColors: Record<Partner['status'], string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  rejected: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

const statusLabels: Record<Partner['status'], { en: string; id: string }> = {
  pending: { en: 'Pending', id: 'Menunggu' },
  approved: { en: 'Approved', id: 'Disetujui' },
  active: { en: 'Active', id: 'Aktif' },
  suspended: { en: 'Suspended', id: 'Ditangguhkan' },
  rejected: { en: 'Rejected', id: 'Ditolak' },
}

export function PartnerCard({ partner, onClick }: PartnerCardProps) {
  const { language } = useTranslation()

  return (
    <div
      onClick={onClick}
      className={`bg-background border rounded-xl p-4 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{partner.shopName}</h3>
            <p className="text-sm text-muted-foreground">{partner.ownerName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[partner.status]}`}>
          {language === 'id' ? statusLabels[partner.status].id : statusLabels[partner.status].en}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <MapPin className="h-4 w-4" />
        <span>{partner.shopAddress}</span>
      </div>

      {/* Stats Grid */}
      {partner.status === 'active' && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{partner.totalProducts}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Produk' : 'Products'}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{formatPrice(partner.totalSales)}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Penjualan' : 'Sales'}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <Wallet className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{formatPrice(partner.pendingPayout)}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Pending' : 'Pending'}
            </p>
          </div>
        </div>
      )}

      {/* Commission Badge */}
      <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {language === 'id' ? 'Komisi' : 'Commission'}
        </span>
        <span className="font-semibold text-primary">{partner.commissionRate}%</span>
      </div>
    </div>
  )
}
