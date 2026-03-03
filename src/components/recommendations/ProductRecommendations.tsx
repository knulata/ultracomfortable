'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useRecommendationsStore, RecommendedProduct, RecommendationType } from '@/stores/recommendations'
import { useWishlistStore } from '@/stores/wishlist'
import { formatPrice } from '@/stores/cart'
import { toast } from 'sonner'

interface ProductRecommendationsProps {
  productId: string
  category?: string
  type?: RecommendationType
  title?: string
  titleId?: string
  maxItems?: number
  variant?: 'default' | 'compact' | 'grid'
}

export function ProductRecommendations({
  productId,
  category = 'tops',
  type = 'similar',
  title,
  titleId,
  maxItems = 6,
  variant = 'default',
}: ProductRecommendationsProps) {
  const { language } = useTranslation()
  const { getRecommendations } = useRecommendationsStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const products = getRecommendations(productId, type, category).slice(0, maxItems)

  if (products.length === 0) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 250
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const toggleWishlist = (product: RecommendedProduct) => {
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

  // Get default titles based on type
  const getDefaultTitle = () => {
    switch (type) {
      case 'similar':
        return language === 'id' ? 'Produk Serupa' : 'Similar Products'
      case 'also_bought':
        return language === 'id' ? 'Sering Dibeli Bersama' : 'Frequently Bought Together'
      case 'also_viewed':
        return language === 'id' ? 'Pelanggan Juga Melihat' : 'Customers Also Viewed'
      case 'trending':
        return language === 'id' ? 'Trending di Kategori Ini' : 'Trending in This Category'
      case 'personalized':
        return language === 'id' ? 'Pilihan Untuk Anda' : 'Picks For You'
      default:
        return language === 'id' ? 'Mungkin Anda Suka' : 'You May Also Like'
    }
  }

  const sectionTitle = title || getDefaultTitle()

  if (variant === 'compact') {
    return (
      <div className="py-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {sectionTitle}
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex-shrink-0 w-28"
            >
              <div className="aspect-square bg-muted rounded-lg mb-1.5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                {product.isNew && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-xs font-medium line-clamp-1">
                {language === 'id' ? product.nameId : product.name}
              </p>
              <p className="text-xs text-primary font-semibold">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="py-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {sectionTitle}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              isWishlisted={isInWishlist(product.id)}
              onToggleWishlist={() => toggleWishlist(product)}
            />
          ))}
        </div>
      </div>
    )
  }

  // Default carousel variant
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {sectionTitle}
        </h2>
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

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[180px]">
            <ProductCard
              product={product}
              language={language}
              isWishlisted={isInWishlist(product.id)}
              onToggleWishlist={() => toggleWishlist(product)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Product Card Sub-component
function ProductCard({
  product,
  language,
  isWishlisted,
  onToggleWishlist,
}: {
  product: RecommendedProduct
  language: string
  isWishlisted: boolean
  onToggleWishlist: () => void
}) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-[3/4] bg-muted rounded-xl mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleWishlist()
            }}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-background/80 opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick add on hover */}
          <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" className="w-full" variant="secondary">
              <ShoppingCart className="h-3 w-3 mr-1" />
              {language === 'id' ? 'Tambah' : 'Add'}
            </Button>
          </div>
        </div>
      </Link>

      <div className="space-y-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
            {language === 'id' ? product.nameId : product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-xs">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {product.soldCount.toLocaleString()} {language === 'id' ? 'terjual' : 'sold'}
        </p>
      </div>
    </div>
  )
}
