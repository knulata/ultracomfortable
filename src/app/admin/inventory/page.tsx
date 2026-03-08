'use client'

import { useState } from 'react'
import { Package, Search, AlertTriangle, TrendingDown, Store } from 'lucide-react'
import { useIntakeStore } from '@/stores/intake'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

type FilterType = 'all' | 'low' | 'available' | 'sold'

export default function AdminInventoryPage() {
  const { language } = useTranslation()
  const { items } = useIntakeStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Group items by product
  const productGroups = items.reduce((acc, item) => {
    const key = item.productName
    if (!acc[key]) {
      acc[key] = {
        productName: item.productName,
        partnerId: item.partnerId,
        variants: [] as typeof items,
        totalQuantity: 0,
        availableQuantity: 0,
        processingQuantity: 0,
      }
    }
    acc[key].variants.push(item)
    acc[key].totalQuantity += item.quantity
    if (item.status === 'active') {
      acc[key].availableQuantity += item.quantity
    } else if (['pending_photo', 'photographing', 'editing', 'pending_upload', 'listing'].includes(item.status)) {
      acc[key].processingQuantity += item.quantity
    }
    return acc
  }, {} as Record<string, { productName: string; partnerId: string; variants: typeof items; totalQuantity: number; availableQuantity: number; processingQuantity: number }>)

  const productList = Object.values(productGroups)

  const filteredProducts = productList.filter((product) => {
    if (searchQuery) {
      if (!product.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
    }

    if (filter === 'all') return true
    if (filter === 'low') return product.availableQuantity < 5 && product.availableQuantity > 0
    if (filter === 'available') return product.availableQuantity > 0
    if (filter === 'sold') return product.processingQuantity > 0
    return true
  })

  const statusCounts = {
    all: productList.length,
    low: productList.filter((p) => p.availableQuantity < 5 && p.availableQuantity > 0).length,
    available: productList.filter((p) => p.availableQuantity > 0).length,
    sold: productList.filter((p) => p.processingQuantity > 0).length,
  }

  const totalAvailable = items.filter((i) => i.status === 'active').reduce((s, i) => s + i.quantity, 0)
  const totalProcessing = items.filter((i) => ['pending_photo', 'photographing', 'editing', 'pending_upload', 'listing'].includes(i.status)).reduce((s, i) => s + i.quantity, 0)
  const totalValue = items.filter((i) => i.status === 'active').reduce((s, i) => s + ((i.sellingPrice || 0) * i.quantity), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          {language === 'id' ? 'Inventori' : 'Inventory'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Monitor stok dan inventori'
            : 'Monitor stock and inventory'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">
            {language === 'id' ? 'Stok Aktif' : 'Active Stock'}
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {totalAvailable.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">pcs</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
            {language === 'id' ? 'Sedang Diproses' : 'Processing'}
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {totalProcessing.toLocaleString()}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">pcs</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4">
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
            {language === 'id' ? 'Nilai Inventori' : 'Inventory Value'}
          </p>
          <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {formatPrice(totalValue)}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-background rounded-xl p-4 border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari produk...' : 'Search products...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'low', 'available', 'sold'] as FilterType[]).map((status) => (
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
                : status === 'low'
                ? (language === 'id' ? 'Stok Menipis' : 'Low Stock')
                : status === 'available'
                ? (language === 'id' ? 'Aktif' : 'Active')
                : (language === 'id' ? 'Diproses' : 'Processing')
              }{' '}
              ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-background rounded-xl border overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada produk' : 'No products found'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredProducts.map((product, index) => {
              const isLowStock = product.availableQuantity < 5 && product.availableQuantity > 0
              const isOutOfStock = product.availableQuantity === 0

              return (
                <div key={index} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{product.productName}</p>
                          {isLowStock && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              {language === 'id' ? 'Stok Menipis' : 'Low Stock'}
                            </span>
                          )}
                          {isOutOfStock && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {language === 'id' ? 'Habis' : 'Out of Stock'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {product.variants.length} {language === 'id' ? 'varian' : 'variants'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            {language === 'id' ? 'Aktif' : 'Active'}
                          </p>
                          <p className={`font-bold ${isLowStock ? 'text-amber-600' : isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                            {product.availableQuantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            {language === 'id' ? 'Diproses' : 'Processing'}
                          </p>
                          <p className="font-bold text-blue-600">{product.processingQuantity}</p>
                        </div>
                      </div>
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
