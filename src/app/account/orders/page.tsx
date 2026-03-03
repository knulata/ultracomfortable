'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Search, ChevronRight, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'
import { useOrdersStore, Order, OrderStatus, formatShortDate } from '@/stores/orders'
import { useTranslation } from '@/stores/language'
import { OrderStatusBadge } from '@/components/orders'

type FilterOption = 'all' | 'active' | 'delivered' | 'cancelled'

export default function OrdersPage() {
  const { language } = useTranslation()
  const { orders, getActiveOrders, getPastOrders } = useOrdersStore()
  const [filter, setFilter] = useState<FilterOption>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filterOptions: { value: FilterOption; label: string; labelId: string }[] = [
    { value: 'all', label: 'All Orders', labelId: 'Semua' },
    { value: 'active', label: 'Active', labelId: 'Aktif' },
    { value: 'delivered', label: 'Delivered', labelId: 'Terkirim' },
    { value: 'cancelled', label: 'Cancelled', labelId: 'Dibatalkan' },
  ]

  const getFilteredOrders = (): Order[] => {
    let result: Order[] = []

    switch (filter) {
      case 'active':
        result = getActiveOrders()
        break
      case 'delivered':
        result = orders.filter((o) => o.status === 'delivered')
        break
      case 'cancelled':
        result = orders.filter((o) => o.status === 'cancelled' || o.status === 'refunded')
        break
      default:
        result = orders
    }

    if (searchQuery) {
      result = result.filter((order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    return result.sort((a, b) => b.createdAt - a.createdAt)
  }

  const filteredOrders = mounted ? getFilteredOrders() : []

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-background rounded-xl p-6">
          <div className="h-8 bg-muted rounded w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl p-4 animate-pulse">
                <div className="h-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'id' ? 'Pesanan Saya' : 'My Orders'}
        </h1>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === 'id' ? 'Cari nomor pesanan...' : 'Search order number...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {language === 'id' ? option.labelId : option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {language === 'id' ? 'Tidak ada pesanan' : 'No orders found'}
            </p>
            <p className="text-muted-foreground mb-6">
              {filter === 'all'
                ? language === 'id'
                  ? 'Kamu belum memiliki pesanan.'
                  : "You haven't placed any orders yet."
                : language === 'id'
                  ? `Tidak ada pesanan ${filterOptions.find((f) => f.value === filter)?.labelId?.toLowerCase()}.`
                  : `No ${filter} orders.`
              }
            </p>
            <Button asChild>
              <Link href="/products">
                {language === 'id' ? 'Mulai Belanja' : 'Start Shopping'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-xl overflow-hidden">
                {/* Order Header */}
                <div className="bg-muted/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatShortDate(order.createdAt, language === 'id' ? 'id' : 'en')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-3">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">
                          {language === 'id' && item.nameId ? item.nameId : item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.variant}</p>
                        <p className="text-sm">
                          {language === 'id' ? 'Jumlah:' : 'Qty:'} {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{order.items.length - 2} {language === 'id' ? 'barang lainnya' : 'more items'}
                    </p>
                  )}
                </div>

                {/* Order Actions */}
                <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {order.courier?.trackingNumber && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'id' ? 'Resi:' : 'Tracking:'}{' '}
                      <span className="font-mono">{order.courier.trackingNumber}</span>
                    </p>
                  )}
                  <div className="flex gap-2 ml-auto">
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {language === 'id' ? 'Beli Lagi' : 'Buy Again'}
                      </Button>
                    )}
                    {(order.status === 'shipped' || order.status === 'out_for_delivery') && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          <Truck className="h-4 w-4 mr-2" />
                          {language === 'id' ? 'Lacak Paket' : 'Track Package'}
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        {language === 'id' ? 'Lihat Detail' : 'View Details'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
