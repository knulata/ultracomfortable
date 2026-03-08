'use client'

import { useState } from 'react'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFulfillmentStore, FulfillmentOrder, FulfillmentStatus } from '@/stores/fulfillment'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

const statusConfig: Record<FulfillmentStatus, { label: { en: string; id: string }; color: string; icon: React.ElementType }> = {
  pending: {
    label: { en: 'Pending', id: 'Menunggu' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
  },
  picking: {
    label: { en: 'Picking', id: 'Picking' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Package,
  },
  qc: {
    label: { en: 'QC', id: 'QC' },
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    icon: CheckCircle,
  },
  packing: {
    label: { en: 'Packing', id: 'Packing' },
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: Package,
  },
  ready_to_ship: {
    label: { en: 'Ready to Ship', id: 'Siap Kirim' },
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    icon: CheckCircle,
  },
  shipped: {
    label: { en: 'Shipped', id: 'Dikirim' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: Truck,
  },
  delivered: {
    label: { en: 'Delivered', id: 'Terkirim' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
  },
  returned: {
    label: { en: 'Returned', id: 'Retur' },
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    icon: AlertCircle,
  },
  completed: {
    label: { en: 'Completed', id: 'Selesai' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
  },
  cancelled: {
    label: { en: 'Cancelled', id: 'Dibatalkan' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: AlertCircle,
  },
}

type FilterType = 'all' | 'pending' | 'processing' | 'shipped'

export function OrderMonitor() {
  const { language } = useTranslation()
  const { orders } = useFulfillmentStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !order.orderNumber.toLowerCase().includes(query) &&
        !order.customerName.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    // Status filter
    if (filter === 'all') return true
    if (filter === 'pending') return order.status === 'pending'
    if (filter === 'processing') return ['picking', 'qc', 'packing', 'ready_to_ship'].includes(order.status)
    if (filter === 'shipped') return ['shipped', 'delivered'].includes(order.status)
    return true
  })

  // Sort by created date descending
  filteredOrders.sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => ['picking', 'qc', 'packing', 'ready_to_ship'].includes(o.status)).length,
    shipped: orders.filter((o) => ['shipped', 'delivered'].includes(o.status)).length,
  }

  return (
    <div className="bg-background rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Package className="h-4 w-4" />
          {language === 'id' ? 'Monitor Pesanan' : 'Order Monitor'}
        </h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari order...' : 'Search orders...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'processing', 'shipped'] as FilterType[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {status === 'all'
                ? (language === 'id' ? 'Semua' : 'All')
                : status === 'pending'
                ? (language === 'id' ? 'Menunggu' : 'Pending')
                : status === 'processing'
                ? (language === 'id' ? 'Diproses' : 'Processing')
                : (language === 'id' ? 'Dikirim' : 'Shipped')
              }{' '}
              ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada pesanan' : 'No orders found'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredOrders.slice(0, 10).map((order) => {
              const status = statusConfig[order.status]
              const StatusIcon = status.icon
              const totalAmount = order.items.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0)

              return (
                <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {language === 'id' ? status.label.id : status.label.en}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{order.customerName}</span>
                    <span>{new Date(order.orderedAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {order.items.length} {language === 'id' ? 'item' : 'items'} •{' '}
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} pcs
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredOrders.length > 10 && (
        <div className="p-3 border-t text-center">
          <Button variant="ghost" size="sm" asChild>
            <a href="/admin/orders">
              {language === 'id' ? 'Lihat Semua' : 'View All'} ({filteredOrders.length})
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
