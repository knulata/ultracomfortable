'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Zap, Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

interface DealRow {
  id: string
  productName: string
  type: 'daily_deal' | 'flash_sale'
  originalPrice: number
  dealPrice: number
  discountPercent: number
  totalStock: number
  soldCount: number
  isHero: boolean
  validFrom: string
  validUntil: string
  isActive: boolean
}

const mockDeals: DealRow[] = [
  { id: '1', productName: 'Floral Midi Dress', type: 'daily_deal', originalPrice: 499000, dealPrice: 299000, discountPercent: 40, totalStock: 50, soldCount: 32, isHero: true, validFrom: '2026-03-04', validUntil: '2026-03-04', isActive: true },
  { id: '2', productName: 'Oversized Cotton Tee', type: 'daily_deal', originalPrice: 249000, dealPrice: 149000, discountPercent: 40, totalStock: 100, soldCount: 67, isHero: false, validFrom: '2026-03-04', validUntil: '2026-03-04', isActive: true },
  { id: '3', productName: 'Linen Blazer', type: 'flash_sale', originalPrice: 749000, dealPrice: 449000, discountPercent: 40, totalStock: 30, soldCount: 28, isHero: false, validFrom: '2026-03-04 12:00', validUntil: '2026-03-04 14:00', isActive: true },
  { id: '4', productName: 'Canvas Tote Bag', type: 'daily_deal', originalPrice: 199000, dealPrice: 99000, discountPercent: 50, totalStock: 80, soldCount: 80, isHero: false, validFrom: '2026-03-03', validUntil: '2026-03-03', isActive: false },
  { id: '5', productName: 'Cropped Cardigan', type: 'flash_sale', originalPrice: 449000, dealPrice: 249000, discountPercent: 44, totalStock: 40, soldCount: 15, isHero: false, validFrom: '2026-03-05 18:00', validUntil: '2026-03-05 20:00', isActive: false },
]

export default function AdminDealsPage() {
  const [deals] = useState<DealRow[]>(mockDeals)
  const [typeFilter, setTypeFilter] = useState<'all' | 'daily_deal' | 'flash_sale'>('all')

  const filtered = deals.filter((d) =>
    typeFilter === 'all' || d.type === typeFilter
  )

  const activeDeals = deals.filter(d => d.isActive)
  const totalRevenue = deals.reduce((s, d) => s + (d.dealPrice * d.soldCount), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deals & Promotions</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" /> New Daily Deal
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" /> New Flash Sale
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Active Deals</div>
          <div className="text-2xl font-bold text-green-600">{activeDeals.length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Sold</div>
          <div className="text-2xl font-bold">{deals.reduce((s, d) => s + d.soldCount, 0)}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Deal Revenue</div>
          <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Avg Discount</div>
          <div className="text-2xl font-bold text-red-600">
            {Math.round(deals.reduce((s, d) => s + d.discountPercent, 0) / deals.length)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {[
          { id: 'all' as const, label: 'All' },
          { id: 'daily_deal' as const, label: 'Daily Deals' },
          { id: 'flash_sale' as const, label: 'Flash Sales' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deals Table */}
      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Discount</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Valid</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((deal) => (
              <tr key={deal.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{deal.productName}</span>
                    {deal.isHero && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    deal.type === 'flash_sale' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {deal.type === 'flash_sale' ? <Zap className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {deal.type === 'flash_sale' ? 'Flash Sale' : 'Daily Deal'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-medium">{formatPrice(deal.dealPrice)}</span>
                  <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(deal.originalPrice)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-red-600">-{deal.discountPercent}%</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{deal.soldCount}/{deal.totalStock}</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(deal.soldCount / deal.totalStock) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {deal.validFrom === deal.validUntil ? deal.validFrom : `${deal.validFrom} - ${deal.validUntil}`}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    deal.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {deal.isActive ? 'Active' : 'Ended'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-muted rounded-lg" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
