'use client'

import Link from 'next/link'
import { Flame, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { FlashSaleProduct, useFlashSaleStore } from '@/stores/flashSale'
import { formatPrice } from '@/stores/cart'
import { toast } from 'sonner'

interface FlashSaleCardProps {
  product: FlashSaleProduct
  variant?: 'default' | 'compact'
}

export function FlashSaleCard({ product, variant = 'default' }: FlashSaleCardProps) {
  const { language } = useTranslation()
  const { getRemainingStock, getSoldPercentage } = useFlashSaleStore()

  const remaining = getRemainingStock(product)
  const soldPercentage = getSoldPercentage(product)
  const isAlmostGone = remaining <= 5
  const isSoldOut = remaining <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSoldOut) {
      toast.error(language === 'id' ? 'Stok habis!' : 'Sold out!')
      return
    }

    // In real implementation, would add to cart with flash price
    toast.success(
      language === 'id'
        ? `${product.product.name} ditambahkan ke keranjang!`
        : `${product.product.name} added to cart!`
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/products/${product.product.slug}`}
        className="block bg-background rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="relative">
          {/* Product Image Placeholder */}
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-4xl">
              {product.product.category_id === 'tops' ? '👕' :
               product.product.category_id === 'bottoms' ? '👖' :
               product.product.category_id === 'dresses' ? '👗' :
               product.product.category_id === 'outerwear' ? '🧥' : '🛍️'}
            </span>
          </div>

          {/* Discount Badge */}
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>

          {/* Sold Out Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-sm font-bold px-3 py-1 rounded">
                {language === 'id' ? 'HABIS' : 'SOLD OUT'}
              </span>
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-sm font-medium line-clamp-1">{product.product.name}</p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-500 font-bold text-sm">
              {formatPrice(product.flashPrice)}
            </span>
            <span className="text-muted-foreground text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>

          {/* Stock Progress */}
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  soldPercentage >= 80 ? 'bg-red-500' :
                  soldPercentage >= 50 ? 'bg-orange-500' : 'bg-primary'
                }`}
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isSoldOut
                ? language === 'id' ? 'Stok habis' : 'Sold out'
                : isAlmostGone
                ? language === 'id' ? `Sisa ${remaining}!` : `Only ${remaining} left!`
                : `${soldPercentage}% ${language === 'id' ? 'terjual' : 'sold'}`}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      href={`/products/${product.product.slug}`}
      className="group block bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="relative">
        {/* Product Image Placeholder */}
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
          <span className="text-6xl group-hover:scale-110 transition-transform">
            {product.product.category_id === 'tops' ? '👕' :
             product.product.category_id === 'bottoms' ? '👖' :
             product.product.category_id === 'dresses' ? '👗' :
             product.product.category_id === 'outerwear' ? '🧥' : '🛍️'}
          </span>

          {/* Hot badge */}
          {soldPercentage >= 70 && !isSoldOut && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Flame className="h-3 w-3" />
              HOT
            </div>
          )}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">
          -{product.discount}%
        </div>

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-gray-900 text-white text-lg font-bold px-4 py-2 rounded-lg">
              {language === 'id' ? 'STOK HABIS' : 'SOLD OUT'}
            </span>
          </div>
        )}

        {/* Quick Add Button */}
        {!isSoldOut && (
          <Button
            size="sm"
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Tambah' : 'Add'}
          </Button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-red-500 font-bold text-lg">
            {formatPrice(product.flashPrice)}
          </span>
          <span className="text-muted-foreground text-sm line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Limit per user */}
        {product.limitPerUser > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'id'
              ? `Maks. ${product.limitPerUser} per orang`
              : `Limit ${product.limitPerUser} per person`}
          </p>
        )}

        {/* Stock Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-medium ${isAlmostGone ? 'text-red-500' : 'text-muted-foreground'}`}>
              {isSoldOut
                ? language === 'id' ? 'Stok habis' : 'Sold out'
                : isAlmostGone
                ? language === 'id' ? `Tinggal ${remaining}!` : `Only ${remaining} left!`
                : `${product.soldCount} ${language === 'id' ? 'terjual' : 'sold'}`}
            </span>
            <span className="text-muted-foreground">
              {soldPercentage}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                soldPercentage >= 80 ? 'bg-red-500 animate-pulse' :
                soldPercentage >= 50 ? 'bg-orange-500' : 'bg-primary'
              }`}
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
