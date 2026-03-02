'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '@/stores/cart'
import type { Product } from '@/types/database'

interface ProductCardProps {
  product: Product
  showQuickAdd?: boolean
}

export function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hasDiscount = product.sale_price && product.sale_price < product.base_price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.sale_price! / product.base_price) * 100)
    : 0

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
        {product.images?.[0] ? (
          <>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isHovered && product.images[1] ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} - alternate`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all ${
            isHovered || isWishlisted ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
            }`}
          />
        </button>

        {/* Quick Add - shown on hover */}
        {showQuickAdd && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button className="w-full py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(product.rating_avg)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {formatPrice(product.sale_price ?? product.base_price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>

        {/* Total Sold */}
        {product.total_sold > 0 && (
          <p className="text-xs text-muted-foreground">
            {product.total_sold.toLocaleString('id-ID')} sold
          </p>
        )}
      </div>
    </div>
  )
}
