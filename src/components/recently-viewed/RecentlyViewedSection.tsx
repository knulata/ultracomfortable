'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Clock, ChevronLeft, ChevronRight, X, Heart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useRecentlyViewedStore, formatViewedTime } from '@/stores/recentlyViewed'
import { useWishlistStore } from '@/stores/wishlist'
import { formatPrice } from '@/stores/cart'
import { toast } from 'sonner'

interface RecentlyViewedSectionProps {
  maxItems?: number
  showClearButton?: boolean
  excludeProductId?: string
  variant?: 'default' | 'compact'
  title?: string
  titleId?: string
}

export function RecentlyViewedSection({
  maxItems = 10,
  showClearButton = true,
  excludeProductId,
  variant = 'default',
  title,
  titleId,
}: RecentlyViewedSectionProps) {
  const { language } = useTranslation()
  const { products, clearHistory, removeProduct } = useRecentlyViewedStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Filter out current product if specified and limit items
  const displayProducts = products
    .filter((p) => p.id !== excludeProductId)
    .slice(0, maxItems)

  // Don't render if no products
  if (displayProducts.length === 0) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const toggleWishlist = (product: typeof displayProducts[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(language === 'id' ? 'Dihapus dari favorit' : 'Removed from wishlist')
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || '',
        slug: product.slug,
      })
      toast.success(language === 'id' ? 'Ditambahkan ke favorit' : 'Added to wishlist')
    }
  }

  const handleClearHistory = () => {
    clearHistory()
    toast.success(language === 'id' ? 'Riwayat dihapus' : 'History cleared')
  }

  const sectionTitle = title || (language === 'id' ? 'Baru Dilihat' : 'Recently Viewed')
  const sectionTitleId = titleId || 'Baru Dilihat'

  if (variant === 'compact') {
    return (
      <div className="py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {language === 'id' ? sectionTitleId : sectionTitle}
          </h3>
          {showClearButton && displayProducts.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {language === 'id' ? 'Hapus' : 'Clear'}
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex-shrink-0 w-24"
            >
              <div className="aspect-square bg-muted rounded-lg mb-1.5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
              </div>
              <p className="text-xs font-medium line-clamp-1">{product.name}</p>
              <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {language === 'id' ? sectionTitleId : sectionTitle}
              </h2>
              <p className="text-sm text-muted-foreground">
                {displayProducts.length} {language === 'id' ? 'produk' : 'products'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showClearButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="text-muted-foreground"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {language === 'id' ? 'Hapus Semua' : 'Clear All'}
              </Button>
            )}

            {/* Scroll buttons */}
            <div className="hidden sm:flex gap-1">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full border hover:bg-muted transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full border hover:bg-muted transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {displayProducts.map((product) => {
            const hasDiscount = product.originalPrice && product.originalPrice > product.price
            const discountPercent = hasDiscount
              ? Math.round((1 - product.price / product.originalPrice!) * 100)
              : 0

            return (
              <div
                key={product.id}
                className="flex-shrink-0 w-[180px] sm:w-[200px] group"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-[3/4] bg-muted rounded-xl mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{discountPercent}%
                      </span>
                    )}

                    {/* Viewed Time Badge */}
                    <span className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatViewedTime(product.viewedAt, language === 'id' ? 'id' : 'en')}
                    </span>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist(product)
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          isInWishlist(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-background/80 hover:bg-background'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeProduct(product.id)
                          toast.success(
                            language === 'id' ? 'Dihapus dari riwayat' : 'Removed from history'
                          )
                        }}
                        className="p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                        title={language === 'id' ? 'Hapus dari riwayat' : 'Remove from history'}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>

                <div className="space-y-1">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                      {language === 'id' && product.nameId ? product.nameId : product.name}
                    </h3>
                  </Link>

                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-xs">{product.rating}</span>
                      {product.reviewCount && (
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice!)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
