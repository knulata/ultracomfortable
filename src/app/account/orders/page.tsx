'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Search, ChevronRight, Truck, CheckCircle, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

// Mock orders data
const mockOrders = [
  {
    id: 'UC-12345678',
    date: '2026-02-28',
    status: 'shipped',
    total: 598000,
    items: [
      { name: 'Oversized Cotton T-Shirt', variant: 'Black / M', quantity: 2, price: 199000 },
      { name: 'High-Waist Wide Leg Pants', variant: 'Beige / S', quantity: 1, price: 299000 },
    ],
    tracking: 'JNE1234567890',
  },
  {
    id: 'UC-12345677',
    date: '2026-02-20',
    status: 'delivered',
    total: 299000,
    items: [
      { name: 'Floral Print Midi Dress', variant: 'Blue / M', quantity: 1, price: 299000 },
    ],
    tracking: 'JNE0987654321',
  },
  {
    id: 'UC-12345676',
    date: '2026-02-15',
    status: 'delivered',
    total: 847000,
    items: [
      { name: 'Relaxed Fit Blazer', variant: 'Navy / L', quantity: 1, price: 549000 },
      { name: 'Ribbed Knit Top', variant: 'White / M', quantity: 2, price: 149000 },
    ],
    tracking: 'JNE1122334455',
  },
  {
    id: 'UC-12345675',
    date: '2026-02-10',
    status: 'cancelled',
    total: 399000,
    items: [
      { name: 'Cropped Denim Jacket', variant: 'Light Blue / S', quantity: 1, price: 399000 },
    ],
    tracking: null,
  },
  {
    id: 'UC-12345674',
    date: '2026-01-28',
    status: 'delivered',
    total: 248000,
    items: [
      { name: 'Basic V-Neck Tee', variant: 'White / M', quantity: 2, price: 99000 },
      { name: 'Basic V-Neck Tee', variant: 'Black / M', quantity: 1, price: 99000 },
    ],
    tracking: 'JNE5566778899',
  },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  paid: { label: 'Paid', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50', icon: Package },
  shipped: { label: 'Shipped', color: 'text-purple-600 bg-purple-50', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50', icon: X },
}

const filterOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrdersPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = mockOrders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No orders found</p>
            <p className="text-muted-foreground mb-6">
              {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = status.icon

              return (
                <div key={order.id} className="border rounded-xl overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-muted/50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </span>
                      <span className="font-semibold">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.variant}</p>
                          <p className="text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="px-4 py-3 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {order.tracking && (
                      <p className="text-sm text-muted-foreground">
                        Tracking: <span className="font-mono">{order.tracking}</span>
                      </p>
                    )}
                    <div className="flex gap-2 ml-auto">
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Buy Again
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button variant="outline" size="sm">
                          Track Package
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
