'use client'

import { useState } from 'react'
import { Package, Camera, Upload, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PartnerProduct } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

interface PartnerProductsProps {
  products: PartnerProduct[]
}

const statusConfig: Record<PartnerProduct['status'], { label: { en: string; id: string }; color: string; icon: React.ElementType }> = {
  pending_photo: {
    label: { en: 'Pending Photo', id: 'Menunggu Foto' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Camera,
  },
  pending_upload: {
    label: { en: 'Pending Upload', id: 'Menunggu Upload' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Upload,
  },
  active: {
    label: { en: 'Active', id: 'Aktif' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle,
  },
  out_of_stock: {
    label: { en: 'Out of Stock', id: 'Stok Habis' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: AlertCircle,
  },
  discontinued: {
    label: { en: 'Discontinued', id: 'Dihentikan' },
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    icon: AlertCircle,
  },
}

type FilterStatus = 'all' | PartnerProduct['status']

// Mock products for demo
const mockProducts: PartnerProduct[] = [
  {
    id: 'prod-1',
    partnerId: 'partner-1',
    name: 'Gamis Syari Premium',
    sku: 'GSP-001',
    category: 'Gamis',
    images: ['/placeholder.jpg'],
    costPrice: 150000,
    sellingPrice: 250000,
    stockReceived: 50,
    stockAvailable: 32,
    stockSold: 15,
    stockDefect: 3,
    status: 'active',
    rackLocation: 'A-12-3',
    receivedAt: '2024-02-01T00:00:00Z',
    listedAt: '2024-02-03T00:00:00Z',
  },
  {
    id: 'prod-2',
    partnerId: 'partner-1',
    name: 'Hijab Voal Premium',
    sku: 'HVP-001',
    category: 'Hijab',
    images: ['/placeholder.jpg'],
    costPrice: 45000,
    sellingPrice: 89000,
    stockReceived: 100,
    stockAvailable: 78,
    stockSold: 20,
    stockDefect: 2,
    status: 'active',
    rackLocation: 'B-05-1',
    receivedAt: '2024-02-05T00:00:00Z',
    listedAt: '2024-02-06T00:00:00Z',
  },
  {
    id: 'prod-3',
    partnerId: 'partner-1',
    name: 'Tunik Batik Modern',
    sku: 'TBM-001',
    category: 'Tunik',
    images: [],
    costPrice: 120000,
    sellingPrice: 0,
    stockReceived: 30,
    stockAvailable: 30,
    stockSold: 0,
    stockDefect: 0,
    status: 'pending_photo',
    rackLocation: 'C-08-2',
    receivedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'prod-4',
    partnerId: 'partner-1',
    name: 'Rok Plisket Panjang',
    sku: 'RPP-001',
    category: 'Rok',
    images: ['/placeholder.jpg'],
    costPrice: 75000,
    sellingPrice: 145000,
    stockReceived: 40,
    stockAvailable: 0,
    stockSold: 38,
    stockDefect: 2,
    status: 'out_of_stock',
    rackLocation: 'A-15-1',
    receivedAt: '2024-01-15T00:00:00Z',
    listedAt: '2024-01-17T00:00:00Z',
  },
]

export function PartnerProducts({ products: initialProducts }: PartnerProductsProps) {
  const { language } = useTranslation()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')

  // Use mock products if none provided
  const products = initialProducts.length > 0 ? initialProducts : mockProducts

  const filteredProducts = products
    .filter((p) => filter === 'all' || p.status === filter)
    .filter((p) =>
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    )

  const statusCounts = {
    all: products.length,
    pending_photo: products.filter((p) => p.status === 'pending_photo').length,
    pending_upload: products.filter((p) => p.status === 'pending_upload').length,
    active: products.filter((p) => p.status === 'active').length,
    out_of_stock: products.filter((p) => p.status === 'out_of_stock').length,
    discontinued: products.filter((p) => p.status === 'discontinued').length,
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'id' ? 'Cari produk atau SKU...' : 'Search products or SKU...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'active', 'pending_photo', 'pending_upload', 'out_of_stock'] as FilterStatus[]).map((status) => (
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
              : (language === 'id' ? statusConfig[status].label.id : statusConfig[status].label.en)
            }
            {' '}({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada produk' : 'No products found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const StatusIcon = statusConfig[product.status].icon
            const profit = product.sellingPrice - product.costPrice
            const profitMargin = product.sellingPrice > 0
              ? Math.round((profit / product.sellingPrice) * 100)
              : 0

            return (
              <div
                key={product.id}
                className="bg-background border rounded-xl p-4"
              >
                <div className="flex gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    {product.images.length > 0 ? (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku} • {product.category}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[product.status].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {language === 'id' ? statusConfig[product.status].label.id : statusConfig[product.status].label.en}
                      </span>
                    </div>

                    {/* Pricing & Stock */}
                    {product.status === 'active' || product.status === 'out_of_stock' ? (
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {language === 'id' ? 'Harga Jual' : 'Selling Price'}
                          </p>
                          <p className="font-semibold">{formatPrice(product.sellingPrice)}</p>
                          <p className="text-xs text-green-600">
                            +{formatPrice(profit)} ({profitMargin}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {language === 'id' ? 'Stok' : 'Stock'}
                          </p>
                          <p className="font-semibold">
                            {product.stockAvailable} / {product.stockReceived}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.stockSold} {language === 'id' ? 'terjual' : 'sold'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">
                          {language === 'id' ? 'Harga Modal' : 'Cost Price'}
                        </p>
                        <p className="font-semibold">{formatPrice(product.costPrice)}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.stockReceived} {language === 'id' ? 'unit diterima' : 'units received'}
                        </p>
                      </div>
                    )}

                    {/* Rack Location */}
                    {product.rackLocation && (
                      <p className="text-xs text-muted-foreground mt-2">
                        📍 {language === 'id' ? 'Rak' : 'Rack'}: {product.rackLocation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
