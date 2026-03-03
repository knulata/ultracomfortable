'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, ChevronRight, Bell, Clock, Filter, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useFlashSaleStore, FlashSale, getTimeUntilStart } from '@/stores/flashSale'
import { FlashSaleBanner, FlashSaleCard, FlashSaleCountdown } from '@/components/flash-sale'

type ViewMode = 'grid' | 'list'
type SortOption = 'discount' | 'price_low' | 'price_high' | 'selling'

export default function FlashSalePage() {
  const { language } = useTranslation()
  const { getActiveFlashSale, getUpcomingFlashSales, getFlashSaleStatus } = useFlashSaleStore()

  const activeSale = getActiveFlashSale()
  const upcomingSales = getUpcomingFlashSales()

  const [sortBy, setSortBy] = useState<SortOption>('selling')

  // Get sorted products from active sale
  const getSortedProducts = () => {
    if (!activeSale) return []

    const products = [...activeSale.products]

    switch (sortBy) {
      case 'discount':
        return products.sort((a, b) => b.discount - a.discount)
      case 'price_low':
        return products.sort((a, b) => a.flashPrice - b.flashPrice)
      case 'price_high':
        return products.sort((a, b) => b.flashPrice - a.flashPrice)
      case 'selling':
      default:
        return products.sort((a, b) => (b.soldCount / b.totalStock) - (a.soldCount / a.totalStock))
    }
  }

  const sortedProducts = getSortedProducts()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              {language === 'id' ? 'Beranda' : 'Home'}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-red-500 flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Flash Sale
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Banner */}
        <FlashSaleBanner variant="hero" />

        {/* Active Sale Products */}
        {activeSale && (
          <div className="mt-8">
            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  {language === 'id' ? 'Produk Flash Sale' : 'Flash Sale Products'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeSale.products.length} {language === 'id' ? 'produk tersedia' : 'products available'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="selling">
                    {language === 'id' ? 'Terlaris' : 'Best Selling'}
                  </option>
                  <option value="discount">
                    {language === 'id' ? 'Diskon Tertinggi' : 'Highest Discount'}
                  </option>
                  <option value="price_low">
                    {language === 'id' ? 'Harga Terendah' : 'Price: Low to High'}
                  </option>
                  <option value="price_high">
                    {language === 'id' ? 'Harga Tertinggi' : 'Price: High to Low'}
                  </option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedProducts.map((product) => (
                <FlashSaleCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* No Active Sale - Show Upcoming */}
        {!activeSale && upcomingSales.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-6">
              {language === 'id' ? 'Flash Sale Mendatang' : 'Upcoming Flash Sales'}
            </h2>

            <div className="space-y-6">
              {upcomingSales.map((sale) => (
                <UpcomingSaleCard key={sale.id} sale={sale} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Sales Section (when active sale exists) */}
        {activeSale && upcomingSales.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {language === 'id' ? 'Flash Sale Berikutnya' : 'Next Flash Sales'}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {upcomingSales.slice(0, 2).map((sale) => (
                <UpcomingSaleCard key={sale.id} sale={sale} compact />
              ))}
            </div>
          </div>
        )}

        {/* Flash Sale Rules */}
        <div className="mt-12 bg-background rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-red-500" />
            {language === 'id' ? 'Ketentuan Flash Sale' : 'Flash Sale Rules'}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              {language === 'id'
                ? 'Flash Sale berlaku selama periode waktu tertentu dan tidak dapat diperpanjang.'
                : 'Flash Sales are valid for a specific time period and cannot be extended.'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              {language === 'id'
                ? 'Stok terbatas. Produk bisa habis sebelum waktu berakhir.'
                : 'Stock is limited. Products may sell out before the sale ends.'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              {language === 'id'
                ? 'Setiap pelanggan memiliki batas pembelian per produk.'
                : 'Each customer has a purchase limit per product.'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              {language === 'id'
                ? 'Harga Flash Sale tidak bisa digabung dengan kupon atau promo lainnya.'
                : 'Flash Sale prices cannot be combined with coupons or other promotions.'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">5.</span>
              {language === 'id'
                ? 'Produk harus di-checkout dalam 15 menit setelah ditambahkan ke keranjang.'
                : 'Products must be checked out within 15 minutes of being added to cart.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Upcoming Sale Card Component
function UpcomingSaleCard({ sale, compact = false }: { sale: FlashSale; compact?: boolean }) {
  const { language } = useTranslation()
  const [timeUntilStart, setTimeUntilStart] = useState(getTimeUntilStart(sale.startTime))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilStart(getTimeUntilStart(sale.startTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [sale.startTime])

  if (compact) {
    return (
      <div className={`bg-gradient-to-r ${sale.bannerColor} text-white rounded-xl p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-75 uppercase tracking-wider">
              {language === 'id' ? 'Segera Hadir' : 'Coming Soon'}
            </p>
            <h3 className="font-bold">{language === 'id' ? sale.nameId : sale.name}</h3>
            <p className="text-sm opacity-90">
              {sale.products.length} {language === 'id' ? 'produk' : 'products'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">
              {language === 'id' ? 'Dimulai dalam' : 'Starts in'}
            </p>
            <p className="font-mono font-bold">
              {timeUntilStart.hours}h {timeUntilStart.minutes}m
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r ${sale.bannerColor} text-white rounded-xl p-6`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{language === 'id' ? sale.nameId : sale.name}</h3>
            <p className="text-sm opacity-90">
              {language === 'id' ? sale.descriptionId : sale.description}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {sale.products.length} {language === 'id' ? 'produk akan diskon' : 'products on sale'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs opacity-75">
              {language === 'id' ? 'Dimulai dalam' : 'Starts in'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="font-mono font-bold">{String(timeUntilStart.hours).padStart(2, '0')}</span>
              </div>
              <span className="font-bold">:</span>
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="font-mono font-bold">{String(timeUntilStart.minutes).padStart(2, '0')}</span>
              </div>
              <span className="font-bold">:</span>
              <div className="bg-white/20 rounded px-2 py-1">
                <span className="font-mono font-bold">{String(timeUntilStart.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <Button variant="secondary" size="sm">
            <Bell className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Ingatkan' : 'Remind'}
          </Button>
        </div>
      </div>

      {/* Preview Products */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sale.products.slice(0, 6).map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center text-2xl">
                {product.product.category_id === 'tops' ? '👕' :
                 product.product.category_id === 'bottoms' ? '👖' :
                 product.product.category_id === 'dresses' ? '👗' :
                 product.product.category_id === 'outerwear' ? '🧥' : '🛍️'}
              </div>
              <div className="text-center mt-1">
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
                  -{product.discount}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
