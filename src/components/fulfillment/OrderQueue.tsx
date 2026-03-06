'use client'

import { useState } from 'react'
import { Package, Clock, Zap, MapPin, User, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFulfillmentStore, FulfillmentOrder, FulfillmentStatus, courierNames } from '@/stores/fulfillment'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

const statusConfig: Record<FulfillmentStatus, { label: { en: string; id: string }; color: string }> = {
  pending: { label: { en: 'Pending', id: 'Menunggu' }, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  picking: { label: { en: 'Picking', id: 'Picking' }, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  qc: { label: { en: 'QC', id: 'QC' }, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  packing: { label: { en: 'Packing', id: 'Packing' }, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  ready_to_ship: { label: { en: 'Ready', id: 'Siap Kirim' }, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  shipped: { label: { en: 'Shipped', id: 'Dikirim' }, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  delivered: { label: { en: 'Delivered', id: 'Diterima' }, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  returned: { label: { en: 'Returned', id: 'Retur' }, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  completed: { label: { en: 'Completed', id: 'Selesai' }, color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  cancelled: { label: { en: 'Cancelled', id: 'Dibatalkan' }, color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
}

const priorityConfig = {
  same_day: { label: { en: 'Same Day', id: 'Same Day' }, color: 'bg-red-500 text-white', icon: Zap },
  express: { label: { en: 'Express', id: 'Express' }, color: 'bg-amber-500 text-white', icon: Zap },
  normal: { label: { en: 'Regular', id: 'Reguler' }, color: 'bg-gray-200 text-gray-700', icon: Clock },
}

interface OrderCardProps {
  order: FulfillmentOrder
  onSelect: () => void
}

function OrderCard({ order, onSelect }: OrderCardProps) {
  const { language } = useTranslation()
  const status = statusConfig[order.status]
  const priority = priorityConfig[order.priority]
  const PriorityIcon = priority.icon

  const pickedCount = order.items.filter((i) => i.picked).length
  const totalItems = order.items.length

  return (
    <div
      onClick={onSelect}
      className="bg-background border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">{order.orderNumber}</span>
            {order.priority !== 'normal' && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${priority.color}`}>
                <PriorityIcon className="h-3 w-3" />
                {language === 'id' ? priority.label.id : priority.label.en}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(order.orderedAt).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {language === 'id' ? status.label.id : status.label.en}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>{order.customerName}</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">{order.customerCity}</span>
      </div>

      {/* Items Summary */}
      <div className="flex items-center gap-2 text-sm mb-3">
        <Package className="h-4 w-4 text-muted-foreground" />
        <span>{order.totalQuantity} pcs ({order.totalItems} {language === 'id' ? 'produk' : 'products'})</span>
        {['picking', 'qc'].includes(order.status) && (
          <span className="text-muted-foreground">
            • {pickedCount}/{totalItems} picked
          </span>
        )}
      </div>

      {/* Shipping & Total */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">
            {courierNames[order.courier]} {order.shippingService}
          </span>
          {order.awbNumber && (
            <span className="text-xs text-muted-foreground font-mono">
              {order.awbNumber}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Action hint */}
      <div className="flex items-center justify-end mt-2 text-xs text-primary">
        <span>{language === 'id' ? 'Lihat detail' : 'View details'}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  )
}

type FilterStatus = 'all' | 'pending' | 'picking' | 'packing' | 'ready_to_ship' | 'shipped'

export function OrderQueue() {
  const { language } = useTranslation()
  const { orders } = useFulfillmentStore()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<FulfillmentOrder | null>(null)

  const activeStatuses: FulfillmentStatus[] = ['pending', 'picking', 'qc', 'packing', 'ready_to_ship', 'shipped']
  const activeOrders = orders.filter((o) => activeStatuses.includes(o.status))

  const filteredOrders = filter === 'all'
    ? activeOrders
    : filter === 'packing'
    ? activeOrders.filter((o) => ['qc', 'packing'].includes(o.status))
    : activeOrders.filter((o) => o.status === filter)

  // Sort by priority then by order time
  const priorityOrder = { same_day: 0, express: 1, normal: 2 }
  filteredOrders.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (pDiff !== 0) return pDiff
    return new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime()
  })

  const statusCounts = {
    all: activeOrders.length,
    pending: activeOrders.filter((o) => o.status === 'pending').length,
    picking: activeOrders.filter((o) => o.status === 'picking').length,
    packing: activeOrders.filter((o) => ['qc', 'packing'].includes(o.status)).length,
    ready_to_ship: activeOrders.filter((o) => o.status === 'ready_to_ship').length,
    shipped: activeOrders.filter((o) => o.status === 'shipped').length,
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'picking', 'packing', 'ready_to_ship', 'shipped'] as FilterStatus[]).map((status) => (
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
              : status === 'packing'
              ? (language === 'id' ? 'QC/Packing' : 'QC/Packing')
              : status === 'ready_to_ship'
              ? (language === 'id' ? 'Siap Kirim' : 'Ready')
              : status.charAt(0).toUpperCase() + status.slice(1)
            }
            {' '}({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Urgent Alert */}
      {statusCounts.pending > 3 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          {statusCounts.pending} {language === 'id' ? 'order menunggu diproses!' : 'orders waiting to be processed!'}
        </div>
      )}

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada order' : 'No orders'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onSelect={() => setSelectedOrder(order)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
