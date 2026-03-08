'use client'

import {
  AlertTriangle,
  Package,
  TrendingDown,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIntakeStore } from '@/stores/intake'
import { useTranslation } from '@/stores/language'

export function InventoryAlerts() {
  const { language } = useTranslation()
  const { items } = useIntakeStore()

  // Calculate inventory levels
  const availableItems = items.filter((item) => item.status === 'active')

  // Group by product and sum quantities
  const productInventory = availableItems.reduce((acc, item) => {
    const key = item.productName
    if (!acc[key]) {
      acc[key] = {
        productName: item.productName,
        partnerId: item.partnerId,
        totalQuantity: 0,
        variantCount: 0,
      }
    }
    acc[key].totalQuantity += item.quantity
    acc[key].variantCount += item.variants?.length || 1
    return acc
  }, {} as Record<string, { productName: string; partnerId: string; totalQuantity: number; variantCount: number }>)

  const inventoryList = Object.values(productInventory)

  // Low stock items (less than 5 units)
  const lowStockItems = inventoryList.filter((item) => item.totalQuantity < 5)

  // Out of stock (items that were available but sold out - mock data)
  const outOfStockItems = [
    { productName: 'Gamis Syari Brukat Premium', lastSold: '2024-03-05' },
    { productName: 'Tunik Batik Exclusive', lastSold: '2024-03-04' },
  ]

  // Best sellers needing restock (mock data)
  const needsRestockItems = [
    { productName: 'Hijab Voal Premium', avgDaily: 12, currentStock: 8 },
    { productName: 'Outer Cardigan Rajut', avgDaily: 5, currentStock: 3 },
  ]

  return (
    <div className="space-y-4">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-amber-200 dark:border-amber-900">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <TrendingDown className="h-4 w-4" />
              {language === 'id' ? 'Stok Menipis' : 'Low Stock'}
              <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900 rounded-full text-xs">
                {lowStockItems.length}
              </span>
            </h4>
          </div>
          <div className="divide-y divide-amber-200 dark:divide-amber-900">
            {lowStockItems.slice(0, 5).map((item, index) => (
              <div key={index} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.productName}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">
                    {item.variantCount} {language === 'id' ? 'varian' : 'variants'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded text-xs font-bold">
                    {item.totalQuantity} pcs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Out of Stock */}
      {outOfStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-red-200 dark:border-red-900">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              {language === 'id' ? 'Stok Habis' : 'Out of Stock'}
              <span className="px-2 py-0.5 bg-red-200 dark:bg-red-900 rounded-full text-xs">
                {outOfStockItems.length}
              </span>
            </h4>
          </div>
          <div className="divide-y divide-red-200 dark:divide-red-900">
            {outOfStockItems.map((item, index) => (
              <div key={index} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.productName}</p>
                  <p className="text-xs text-red-600 dark:text-red-500">
                    {language === 'id' ? 'Terakhir terjual' : 'Last sold'}: {item.lastSold}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {language === 'id' ? 'Restock' : 'Restock'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Restock */}
      {needsRestockItems.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Package className="h-4 w-4" />
              {language === 'id' ? 'Perlu Restock' : 'Needs Restock'}
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
              {language === 'id'
                ? 'Berdasarkan penjualan rata-rata harian'
                : 'Based on average daily sales'}
            </p>
          </div>
          <div className="divide-y divide-blue-200 dark:divide-blue-900">
            {needsRestockItems.map((item, index) => (
              <div key={index} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{item.productName}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500">
                    {language === 'id' ? 'Rata-rata' : 'Avg'}: {item.avgDaily}/
                    {language === 'id' ? 'hari' : 'day'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.currentStock} pcs</span>
                  <p className="text-xs text-muted-foreground">
                    ~{Math.ceil(item.currentStock / item.avgDaily)}{' '}
                    {language === 'id' ? 'hari lagi' : 'days left'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Clear */}
      {lowStockItems.length === 0 && outOfStockItems.length === 0 && needsRestockItems.length === 0 && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-6 text-center">
          <Package className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
          <p className="text-green-700 dark:text-green-400 font-medium">
            {language === 'id' ? 'Inventori dalam kondisi baik!' : 'Inventory levels are healthy!'}
          </p>
        </div>
      )}

      {/* View Full Inventory */}
      <div className="text-center">
        <Button variant="ghost" size="sm" asChild>
          <a href="/admin/inventory">
            {language === 'id' ? 'Lihat Inventori Lengkap' : 'View Full Inventory'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  )
}
