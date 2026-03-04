'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, TrendingDown, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useTranslation } from '@/stores/language'
import { PriceDropBadge, PriceAlertToggle } from '@/components/price-alerts'
import { toast } from 'sonner'

type SortOption = 'recent' | 'price_drop' | 'price_low' | 'price_high'

export default function WishlistPage() {
  const { t, language } = useTranslation()
  const { items, removeItem, getPriceDropInfo, getPriceDropCount } = useWishlistStore()
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recent')

  useEffect(() => {
    setMounted(true)
  }, [])

  const priceDropCount = mounted ? getPriceDropCount() : 0

  // Sort items based on selected option
  const sortedItems = mounted ? [...items].sort((a, b) => {
    switch (sortBy) {
      case 'price_drop':
        const aDropInfo = getPriceDropInfo(a.id)
        const bDropInfo = getPriceDropInfo(b.id)
        const aDrop = aDropInfo?.hasPriceDrop ? aDropInfo.savingsPercent : 0
        const bDrop = bDropInfo?.hasPriceDrop ? bDropInfo.savingsPercent : 0
        return bDrop - aDrop
      case 'price_low':
        return a.price - b.price
      case 'price_high':
        return b.price - a.price
      case 'recent':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  }) : items
  const { addItem: addToCart, openCart } = useCartStore()

  const handleRemove = (id: string) => {
    removeItem(id)
    toast.success(language === 'id' ? 'Dihapus dari favorit' : 'Removed from wishlist')
  }

  const handleAddToCart = (item: typeof items[0]) => {
    // Create mock variant and product for cart
    const mockVariant = {
      id: `${item.id}-variant`,
      product_id: item.id,
      sku: item.slug,
      size: 'M',
      color: 'Default',
      color_hex: '#000000',
      price_adjustment: 0,
      stock: 10,
      images: [item.image],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const mockProduct = {
      id: item.id,
      brand_id: 'uc',
      category_id: 'general',
      name: item.name,
      slug: item.slug,
      description: '',
      base_price: item.originalPrice ?? item.price,
      sale_price: item.originalPrice ? item.price : null,
      images: [item.image],
      tags: [],
      is_active: true,
      is_featured: false,
      total_sold: 0,
      rating_avg: 0,
      rating_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addToCart(mockVariant, mockProduct, 1)
    toast.success(language === 'id' ? 'Ditambahkan ke keranjang' : 'Added to cart')
    openCart()
  }

  const handleAddAllToCart = () => {
    items.forEach(item => {
      const mockVariant = {
        id: `${item.id}-variant`,
        product_id: item.id,
        sku: item.slug,
        size: 'M',
        color: 'Default',
        color_hex: '#000000',
        price_adjustment: 0,
        stock: 10,
        images: [item.image],
        is_active: true,
        created_at: new Date().toISOString(),
      }

      const mockProduct = {
        id: item.id,
        brand_id: 'uc',
        category_id: 'general',
        name: item.name,
        slug: item.slug,
        description: '',
        base_price: item.originalPrice ?? item.price,
        sale_price: item.originalPrice ? item.price : null,
        images: [item.image],
        tags: [],
        is_active: true,
        is_featured: false,
        total_sold: 0,
        rating_avg: 0,
        rating_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      addToCart(mockVariant, mockProduct, 1)
    })
    toast.success(language === 'id' ? 'Semua item ditambahkan ke keranjang' : 'All items added to cart')
    openCart()
  }

  return (
    <div className="space-y-6">
      {/* Price Drop Alert Banner */}
      {mounted && priceDropCount > 0 && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
              <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-800 dark:text-green-200">
                {language === 'id'
                  ? `${priceDropCount} item favorit Anda turun harga!`
                  : `${priceDropCount} of your wishlist items dropped in price!`
                }
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {language === 'id'
                  ? 'Beli sekarang sebelum harga naik lagi'
                  : 'Buy now before prices go back up'
                }
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy('price_drop')}
              className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300"
            >
              {language === 'id' ? 'Lihat' : 'View'}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-background rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t.account.wishlist}</h1>
            <p className="text-muted-foreground">{items.length} {t.account.items}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort dropdown */}
            {items.length > 1 && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="recent">{language === 'id' ? 'Terbaru' : 'Recently Added'}</option>
                  <option value="price_drop">{language === 'id' ? 'Harga Turun' : 'Price Drops'}</option>
                  <option value="price_low">{language === 'id' ? 'Harga Terendah' : 'Price: Low to High'}</option>
                  <option value="price_high">{language === 'id' ? 'Harga Tertinggi' : 'Price: High to Low'}</option>
                </select>
              </div>
            )}
            {items.length > 0 && (
              <Button variant="outline" onClick={handleAddAllToCart}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Tambah Semua' : 'Add All'}
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {language === 'id' ? 'Favorit Anda kosong' : 'Your wishlist is empty'}
            </p>
            <p className="text-muted-foreground mb-6">
              {language === 'id' ? 'Simpan item yang Anda suka untuk nanti' : 'Save items you love for later'}
            </p>
            <Button asChild>
              <Link href="/products">
                {language === 'id' ? 'Temukan Produk' : 'Discover Products'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => {
              const hasDiscount = item.originalPrice && item.originalPrice > item.price
              const discountPercent = hasDiscount
                ? Math.round((1 - item.price / item.originalPrice!) * 100)
                : 0
              const priceDropInfo = mounted ? getPriceDropInfo(item.id) : null

              return (
                <div key={item.id} className="group relative">
                  <Link href={`/products/${item.slug}`}>
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 relative overflow-hidden">
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

                      {/* Price Drop Badge */}
                      {priceDropInfo?.hasPriceDrop ? (
                        <div className="absolute top-2 left-2">
                          <PriceDropBadge priceDropInfo={priceDropInfo} variant="badge" />
                        </div>
                      ) : hasDiscount ? (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{discountPercent}%
                        </span>
                      ) : null}
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                    title={t.common.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-medium hover:text-primary transition-colors">{item.name}</h3>
                      </Link>
                      <PriceAlertToggle itemId={item.id} />
                    </div>

                    {/* Price with drop info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${priceDropInfo?.hasPriceDrop ? 'text-green-600' : ''}`}>
                          {formatPrice(item.price)}
                        </span>
                        {priceDropInfo?.hasPriceDrop && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(priceDropInfo.priceWhenAdded)}
                          </span>
                        )}
                        {!priceDropInfo?.hasPriceDrop && hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice!)}
                          </span>
                        )}
                      </div>
                      {priceDropInfo?.hasPriceDrop && (
                        <PriceDropBadge priceDropInfo={priceDropInfo} variant="inline" />
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      {t.productDetail.addToCart}
                    </Button>
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
