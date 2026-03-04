'use client'

import { useState } from 'react'
import { Search, Check, X, MessageCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

interface ResellerRow {
  id: string
  name: string
  businessName: string
  phone: string
  whatsapp: string
  city: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  totalOrders: number
  totalSpent: number
  joinedAt: string
}

const mockResellers: ResellerRow[] = [
  { id: '1', name: 'Rina Maulana', businessName: 'Rina Fashion', phone: '081234567890', whatsapp: '081234567890', city: 'Jakarta', tier: 'gold', status: 'approved', totalOrders: 145, totalSpent: 89000000, joinedAt: '2025-06-15' },
  { id: '2', name: 'Hendra Wijaya', businessName: 'HW Collection', phone: '081345678901', whatsapp: '081345678901', city: 'Bandung', tier: 'silver', status: 'approved', totalOrders: 67, totalSpent: 34000000, joinedAt: '2025-09-20' },
  { id: '3', name: 'Fitri Handayani', businessName: 'Fitri Store', phone: '081456789012', whatsapp: '081456789012', city: 'Surabaya', tier: 'platinum', status: 'approved', totalOrders: 312, totalSpent: 156000000, joinedAt: '2025-01-10' },
  { id: '4', name: 'Agus Setiawan', businessName: 'AS Grosir', phone: '081567890123', whatsapp: '081567890123', city: 'Tanah Abang', tier: 'bronze', status: 'pending', totalOrders: 0, totalSpent: 0, joinedAt: '2026-03-04' },
  { id: '5', name: 'Maya Sari', businessName: 'Maya Boutique', phone: '081678901234', whatsapp: '081678901234', city: 'Yogyakarta', tier: 'bronze', status: 'pending', totalOrders: 0, totalSpent: 0, joinedAt: '2026-03-03' },
  { id: '6', name: 'Dedi Kurniawan', businessName: 'DK Fashion', phone: '081789012345', whatsapp: '081789012345', city: 'Semarang', tier: 'bronze', status: 'rejected', totalOrders: 0, totalSpent: 0, joinedAt: '2026-02-28' },
]

const tierColors: Record<string, string> = {
  bronze: 'bg-orange-100 text-orange-800',
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-purple-100 text-purple-800',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800',
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'suspended'

export default function AdminResellersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = mockResellers.filter((r) => {
    const matchesSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.businessName.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = mockResellers.filter(r => r.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resellers</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {pendingCount} application{pendingCount > 1 ? 's' : ''} pending review
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Resellers</div>
          <div className="text-2xl font-bold">{mockResellers.filter(r => r.status === 'approved').length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Pending Applications</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Reseller Revenue</div>
          <div className="text-2xl font-bold">{formatPrice(mockResellers.reduce((s, r) => s + r.totalSpent, 0))}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Avg Order Value</div>
          <div className="text-2xl font-bold">{formatPrice(534000)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, business, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Resellers Table */}
      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-medium">Reseller</th>
              <th className="px-6 py-3 font-medium">City</th>
              <th className="px-6 py-3 font-medium">Tier</th>
              <th className="px-6 py-3 font-medium">Orders</th>
              <th className="px-6 py-3 font-medium">Revenue</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reseller) => (
              <tr key={reseller.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{reseller.name}</div>
                  <div className="text-xs text-muted-foreground">{reseller.businessName}</div>
                </td>
                <td className="px-6 py-4 text-sm">{reseller.city}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${tierColors[reseller.tier]}`}>
                    {reseller.tier}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{reseller.totalOrders}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatPrice(reseller.totalSpent)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[reseller.status]}`}>
                    {reseller.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{reseller.joinedAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {reseller.status === 'pending' && (
                      <>
                        <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="Approve">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600" title="Reject">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <a
                      href={`https://wa.me/${reseller.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"
                      title="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No resellers found</div>
        )}
      </div>
    </div>
  )
}
