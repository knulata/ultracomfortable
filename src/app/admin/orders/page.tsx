'use client'

import { useState } from 'react'
import { Package, Search, Eye } from 'lucide-react'
import { useFulfillmentStore, FulfillmentStatus } from '@/stores/fulfillment'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { Button } from '@/components/ui/button'

type FilterType = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered'

const statusConfig: Record<FulfillmentStatus, { label: { en: string; id: string }; color: string }> = {
  pending: {
    label: { en: 'Pending', id: 'Menunggu' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  picking: {
    label: { en: 'Picking', id: 'Picking' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  qc: {
    label: { en: 'QC', id: 'QC' },
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  packing: {
    label: { en: 'Packing', id: 'Packing' },
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  ready_to_ship: {
    label: { en: 'Ready to Ship', id: 'Siap Kirim' },
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  },
  shipped: {
    label: { en: 'Shipped', id: 'Dikirim' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  delivered: {
    label: { en: 'Delivered', id: 'Terkirim' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  returned: {
    label: { en: 'Returned', id: 'Retur' },
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  completed: {
    label: { en: 'Completed', id: 'Selesai' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: { en: 'Cancelled', id: 'Dibatalkan' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export default function AdminOrdersPage() {
  const { language } = useTranslation()
  const { orders } = useFulfillmentStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !order.orderNumber.toLowerCase().includes(query) &&
        !order.customerName.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (filter === 'all') return true
    if (filter === 'processing') return ['picking', 'qc', 'packing', 'ready_to_ship'].includes(order.status)
    return order.status === filter
  })

  // Sort by created date descending
  filteredOrders.sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => ['picking', 'qc', 'packing', 'ready_to_ship'].includes(o.status)).length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          {language === 'id' ? 'Semua Pesanan' : 'All Orders'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Monitor dan kelola semua pesanan'
            : 'Monitor and manage all orders'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-background rounded-xl p-4 border">
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

        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'processing', 'shipped', 'delivered'] as FilterType[]).map((status) => (
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
                : status === 'shipped'
                ? (language === 'id' ? 'Dikirim' : 'Shipped')
                : (language === 'id' ? 'Terkirim' : 'Delivered')
              }{' '}
              ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-xl border overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada pesanan' : 'No orders found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Order</th>
                  <th className="text-left p-3 font-medium">{language === 'id' ? 'Pelanggan' : 'Customer'}</th>
                  <th className="text-left p-3 font-medium">Items</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">{language === 'id' ? 'Tanggal' : 'Date'}</th>
                  <th className="text-left p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status]
                  const totalAmount = order.items.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0)

                  return (
                    <tr key={order.id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono font-medium">{order.orderNumber}</td>
                      <td className="p-3">{order.customerName}</td>
                      <td className="p-3">
                        {order.items.length} items ({order.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                      </td>
                      <td className="p-3 font-medium">{formatPrice(totalAmount)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {language === 'id' ? status.label.id : status.label.en}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(order.orderedAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
