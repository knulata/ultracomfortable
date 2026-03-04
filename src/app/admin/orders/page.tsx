'use client'

import { useState } from 'react'
import { Search, Filter, ChevronDown, Eye, Truck, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

type OrderStatus = 'all' | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderRow {
  id: string
  orderNumber: string
  customer: string
  email: string
  total: number
  status: OrderStatus
  items: number
  paymentMethod: string
  createdAt: string
}

const mockOrders: OrderRow[] = [
  { id: '1', orderNumber: 'UC-A1B2C3D4', customer: 'Siti Rahma', email: 'siti@email.com', total: 498000, status: 'paid', items: 3, paymentMethod: 'GoPay', createdAt: '2026-03-04 14:30' },
  { id: '2', orderNumber: 'UC-E5F6G7H8', customer: 'Budi Santoso', email: 'budi@email.com', total: 1247000, status: 'processing', items: 5, paymentMethod: 'BCA VA', createdAt: '2026-03-04 14:15' },
  { id: '3', orderNumber: 'UC-I9J0K1L2', customer: 'Dewi Lestari', email: 'dewi@email.com', total: 329000, status: 'shipped', items: 2, paymentMethod: 'QRIS', createdAt: '2026-03-04 13:00' },
  { id: '4', orderNumber: 'UC-M3N4O5P6', customer: 'Ahmad Fauzi', email: 'ahmad@email.com', total: 756000, status: 'pending', items: 4, paymentMethod: '-', createdAt: '2026-03-04 12:00' },
  { id: '5', orderNumber: 'UC-Q7R8S9T0', customer: 'Nina Putri', email: 'nina@email.com', total: 189000, status: 'delivered', items: 1, paymentMethod: 'ShopeePay', createdAt: '2026-03-04 11:00' },
  { id: '6', orderNumber: 'UC-U1V2W3X4', customer: 'Reza Hakim', email: 'reza@email.com', total: 899000, status: 'paid', items: 3, paymentMethod: 'Credit Card', createdAt: '2026-03-04 10:30' },
  { id: '7', orderNumber: 'UC-Y5Z6A7B8', customer: 'Lina Sari', email: 'lina@email.com', total: 245000, status: 'cancelled', items: 2, paymentMethod: 'DANA', createdAt: '2026-03-04 09:00' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusTabs: { id: OrderStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'paid', label: 'Paid' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null)

  const filtered = mockOrders.filter((order) => {
    const matchesSearch = !search ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In production, call API to update order status
    console.log('Update order', orderId, 'to', newStatus)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {statusTabs.map((tab) => {
          const count = tab.id === 'all'
            ? mockOrders.length
            : mockOrders.filter((o) => o.status === tab.id).length
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by order number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4 font-mono text-sm">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{order.customer}</div>
                  <div className="text-xs text-muted-foreground">{order.email}</div>
                </td>
                <td className="px-6 py-4 text-sm">{order.items}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                <td className="px-6 py-4 text-sm">{order.paymentMethod}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 hover:bg-muted rounded-lg"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {(order.status === 'paid' || order.status === 'processing') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, order.status === 'paid' ? 'processing' : 'shipped')}
                        className="p-1.5 hover:bg-muted rounded-lg text-primary"
                        title={order.status === 'paid' ? 'Process' : 'Ship'}
                      >
                        <Truck className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No orders found</div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{selectedOrder.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{selectedOrder.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{formatPrice(selectedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <span>{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{selectedOrder.createdAt}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              {selectedOrder.status === 'paid' && (
                <Button size="sm" onClick={() => { handleUpdateStatus(selectedOrder.id, 'processing'); setSelectedOrder(null) }}>
                  Mark Processing
                </Button>
              )}
              {selectedOrder.status === 'processing' && (
                <Button size="sm" onClick={() => { handleUpdateStatus(selectedOrder.id, 'shipped'); setSelectedOrder(null) }}>
                  Mark Shipped
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
