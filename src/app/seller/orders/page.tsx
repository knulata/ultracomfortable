'use client'

import { useState } from 'react'
import { Search, MessageCircle, Truck, Package, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

interface SellerOrder {
  id: string
  order_number: string
  customer: string
  customerPhone: string
  items: { name: string; variant: string; qty: number; price: number }[]
  sellerTotal: number
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  paid: 'Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Batal',
}

const mockOrders: SellerOrder[] = [
  { id: '1', order_number: 'UC-A1B2C3D4', customer: 'Siti Rahma', customerPhone: '081234567890', items: [{ name: 'Kaos Oversized Premium', variant: 'Black / L', qty: 3, price: 89000 }, { name: 'Hijab Voal Premium', variant: 'Cream', qty: 2, price: 39000 }], sellerTotal: 345000, status: 'paid', created_at: '2026-03-05 09:30' },
  { id: '2', order_number: 'UC-E5F6G7H8', customer: 'Dewi Lestari', customerPhone: '081345678901', items: [{ name: 'Celana Kulot Linen', variant: 'Beige / M', qty: 1, price: 99000 }], sellerTotal: 99000, status: 'processing', created_at: '2026-03-05 08:15' },
  { id: '3', order_number: 'UC-I9J0K1L2', customer: 'Nina Putri', customerPhone: '081456789012', items: [{ name: 'Dress Midi Bunga', variant: 'Pink / S', qty: 2, price: 129000 }], sellerTotal: 258000, status: 'shipped', created_at: '2026-03-04 16:00' },
  { id: '4', order_number: 'UC-M3N4O5P6', customer: 'Budi Santoso', customerPhone: '081567890123', items: [{ name: 'Kaos Oversized Premium', variant: 'White / XL', qty: 12, price: 89000 }], sellerTotal: 1068000, status: 'delivered', created_at: '2026-03-03 11:00' },
]

export default function SellerOrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null)

  const filtered = mockOrders.filter((o) => {
    const matchesSearch = !search || o.order_number.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Pesanan</h1>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'paid', label: 'Dibayar' },
          { id: 'processing', label: 'Diproses' },
          { id: 'shipped', label: 'Dikirim' },
          { id: 'delivered', label: 'Selesai' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari berdasarkan no. pesanan atau nama pembeli..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-background rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium">{order.order_number}</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{order.created_at}</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{order.customer}</p>
                <div className="mt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {item.qty}x {item.name} ({item.variant}) — {formatPrice(item.price * item.qty)}
                    </p>
                  ))}
                </div>
                <p className="text-sm font-semibold mt-2">Total: {formatPrice(order.sellerTotal)}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/62${order.customerPhone.replace(/^0/, '')}?text=Halo%20${encodeURIComponent(order.customer)}%2C%20pesanan%20${order.order_number}%20sedang%20kami%20proses`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                  title="WhatsApp pembeli"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                {order.status === 'paid' && (
                  <Button size="sm" variant="outline">
                    <Package className="h-4 w-4 mr-1" /> Proses
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button size="sm">
                    <Truck className="h-4 w-4 mr-1" /> Kirim
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Tidak ada pesanan</div>
        )}
      </div>
    </div>
  )
}
