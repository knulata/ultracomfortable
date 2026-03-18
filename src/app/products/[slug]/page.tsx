'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Heart, Share2, Truck, RotateCcw, Shield, Minus, Plus, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { useWishlistStore } from '@/stores/wishlist'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { ViewingNow, RecentSales } from '@/components/engagement/LiveActivityFeed'
import { CompleteTheLook, getSuggestedOutfit } from '@/components/engagement/CompleteTheLook'
import { ProductReviews } from '@/components/reviews'
import { RecentlyViewedSection } from '@/components/recently-viewed'
import { ProductRecommendations } from '@/components/recommendations'
import { FrequentlyBoughtTogether } from '@/components/frequently-bought'
import { BackInStockAlert } from '@/components/stock-alerts'
import { ProductQA } from '@/components/product-qa'
import { SizeGuideModal } from '@/components/size-guide'
import { useSizeGuideStore } from '@/stores/sizeGuide'
import { toast } from 'sonner'

// Mock product data
const mockProduct = {
  id: 'product-1',
  name: 'Premium Oversized Cotton T-Shirt',
  slug: 'premium-oversized-cotton-tshirt',
  description: `Experience ultimate comfort with our Premium Oversized Cotton T-Shirt. Made from 100% organic cotton, this tee features a relaxed fit that's perfect for everyday wear.

Key Features:
• 100% Organic Cotton
• Relaxed oversized fit
• Ribbed crew neckline
• Pre-washed for extra softness
• Sustainably sourced materials`,
  base_price: 299000,
  sale_price: 199000,
  images: [
    '/images/product-1.jpg',
    '/images/product-2.jpg',
    '/images/product-3.jpg',
    '/images/product-4.jpg',
  ],
  brand: { name: 'UC', slug: 'alyanoor' },
  category: { name: 'Tops', slug: 'tops' },
  rating_avg: 4.7,
  rating_count: 328,
  total_sold: 1542,
  tags: ['cotton', 'oversized', 'casual'],
  is_featured: true,
  variants: [
    { id: 'v1', size: 'S', color: 'Black', color_hex: '#000000', stock: 15, price_adjustment: 0 },
    { id: 'v2', size: 'M', color: 'Black', color_hex: '#000000', stock: 23, price_adjustment: 0 },
    { id: 'v3', size: 'L', color: 'Black', color_hex: '#000000', stock: 18, price_adjustment: 0 },
    { id: 'v4', size: 'XL', color: 'Black', color_hex: '#000000', stock: 8, price_adjustment: 0 },
    { id: 'v5', size: 'S', color: 'White', color_hex: '#FFFFFF', stock: 12, price_adjustment: 0 },
    { id: 'v6', size: 'M', color: 'White', color_hex: '#FFFFFF', stock: 0, price_adjustment: 0 },
    { id: 'v7', size: 'L', color: 'White', color_hex: '#FFFFFF', stock: 20, price_adjustment: 0 },
    { id: 'v8', size: 'XL', color: 'White', color_hex: '#FFFFFF', stock: 5, price_adjustment: 0 },
    { id: 'v9', size: 'S', color: 'Beige', color_hex: '#F5F5DC', stock: 10, price_adjustment: 10000 },
    { id: 'v10', size: 'M', color: 'Beige', color_hex: '#F5F5DC', stock: 14, price_adjustment: 10000 },
    { id: 'v11', size: 'L', color: 'Beige', color_hex: '#F5F5DC', stock: 9, price_adjustment: 10000 },
    { id: 'v12', size: 'XL', color: 'Beige', color_hex: '#F5F5DC', stock: 3, price_adjustment: 10000 },
  ],
}


export default function ProductDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { t, language } = useTranslation()
  const { addItem, openCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { addProduct: addToRecentlyViewed } = useRecentlyViewedStore()
  const { openSizeGuide } = useSizeGuideStore()

  const isWishlisted = isInWishlist(mockProduct.id)

  // Track product view
  useEffect(() => {
    addToRecentlyViewed({
      id: mockProduct.id,
      slug: mockProduct.slug,
      name: mockProduct.name,
      nameId: 'Kaos Oversized Premium',
      price: mockProduct.sale_price ?? mockProduct.base_price,
      originalPrice: mockProduct.sale_price ? mockProduct.base_price : undefined,
      category: mockProduct.category.slug,
      rating: mockProduct.rating_avg,
      reviewCount: mockProduct.rating_count,
    })
  }, [addToRecentlyViewed])

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(mockProduct.id)
      toast.success(language === 'id' ? 'Dihapus dari favorit' : 'Removed from wishlist')
    } else {
      addToWishlist({
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.sale_price ?? mockProduct.base_price,
        originalPrice: mockProduct.sale_price ? mockProduct.base_price : undefined,
        image: '',
        slug: mockProduct.slug,
      })
      toast.success(language === 'id' ? 'Ditambahkan ke favorit' : 'Added to wishlist')
    }
  }

  // Get unique colors and sizes
  const colors = [...new Set(mockProduct.variants.map(v => v.color))]
  const sizes = [...new Set(mockProduct.variants.map(v => v.size))]

  // Get available sizes for selected color
  const availableSizes = mockProduct.variants
    .filter(v => v.color === selectedColor && v.stock > 0)
    .map(v => v.size)

  // Get selected variant
  const selectedVariant = mockProduct.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  )

  // Calculate price
  const basePrice = mockProduct.sale_price ?? mockProduct.base_price
  const finalPrice = basePrice + (selectedVariant?.price_adjustment ?? 0)

  const hasDiscount = mockProduct.sale_price && mockProduct.sale_price < mockProduct.base_price
  const discountPercent = hasDiscount
    ? Math.round((1 - mockProduct.sale_price! / mockProduct.base_price) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) {
      toast.error('Please select a size')
      return
    }

    // Add to cart
    addItem(
      {
        id: selectedVariant.id,
        product_id: mockProduct.id,
        sku: `${mockProduct.slug}-${selectedColor}-${selectedSize}`,
        size: selectedSize,
        color: selectedColor,
        color_hex: selectedVariant.color_hex,
        price_adjustment: selectedVariant.price_adjustment,
        stock: selectedVariant.stock,
        images: mockProduct.images,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: mockProduct.id,
        brand_id: 'uc',
        category_id: 'tops',
        name: mockProduct.name,
        slug: mockProduct.slug,
        description: mockProduct.description,
        base_price: mockProduct.base_price,
        sale_price: mockProduct.sale_price,
        images: mockProduct.images,
        tags: mockProduct.tags,
        is_active: true,
        is_featured: mockProduct.is_featured,
        total_sold: mockProduct.total_sold,
        rating_avg: mockProduct.rating_avg,
        rating_count: mockProduct.rating_count,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      quantity
    )

    toast.success('Added to cart!')
    openCart()
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href={`/${mockProduct.category.slug}`} className="text-muted-foreground hover:text-foreground">
              {mockProduct.category.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium truncate max-w-[200px]">{mockProduct.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />

              {/* Badges */}
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                  -{discountPercent}% OFF
                </span>
              )}

              {/* Wishlist */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 p-3 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden relative ${
                    selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/15" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <Link href={`/brands/${mockProduct.brand.slug}`} className="text-sm text-primary font-medium hover:underline">
                {mockProduct.brand.name}
              </Link>
              <h1 className="text-2xl lg:text-3xl font-bold mt-1">{mockProduct.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(mockProduct.rating_avg)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">{mockProduct.rating_avg}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({mockProduct.rating_count} {t.productDetail.reviews})
                </span>
                <span className="text-sm text-muted-foreground">
                  {mockProduct.total_sold.toLocaleString('id-ID')} {t.products.sold}
                </span>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <ViewingNow />
                <RecentSales productId={mockProduct.id} />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(mockProduct.base_price)}
                  </span>
                  <span className="text-sm text-red-500 font-medium">-{discountPercent}%</span>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Color: <span className="font-normal">{selectedColor}</span></span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const variant = mockProduct.variants.find(v => v.color === color)
                  const isSelected = selectedColor === color
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color)
                        setSelectedSize(null) // Reset size when color changes
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                      } ${color === 'White' ? 'border-gray-300' : 'border-transparent'}`}
                      style={{ backgroundColor: variant?.color_hex }}
                      title={color}
                    >
                      {isSelected && (
                        <Check className={`absolute inset-0 m-auto h-5 w-5 ${
                          color === 'White' || color === 'Beige' ? 'text-black' : 'text-white'
                        }`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Size: <span className="font-normal">{selectedSize || 'Select'}</span></span>
                <button
                  onClick={() => openSizeGuide('tops')}
                  className="text-sm text-primary hover:underline"
                >
                  {language === 'id' ? 'Panduan Ukuran' : 'Size Guide'}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                  const isAvailable = availableSizes.includes(size)
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border rounded-lg font-medium transition-colors ${
                        isSelected
                          ? isAvailable
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : isAvailable
                          ? 'border-border hover:border-primary'
                          : 'border-border bg-muted text-muted-foreground line-through'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                <p className="text-sm text-orange-500 mt-2">
                  Only {selectedVariant.stock} left in stock!
                </p>
              )}
            </div>

            {/* Back in Stock Alert - shown when out of stock variant is selected */}
            {selectedVariant && selectedVariant.stock === 0 && (
              <BackInStockAlert
                productId={mockProduct.id}
                productSlug={mockProduct.slug}
                productName={mockProduct.name}
                productNameId="Kaos Oversized Premium"
                variantId={selectedVariant.id}
                size={selectedVariant.size}
                color={selectedVariant.color}
              />
            )}

            {/* Quantity */}
            <div>
              <span className="font-medium block mb-3">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant?.stock ?? 10, quantity + 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedVariant && (
                  <span className="text-sm text-muted-foreground">
                    {selectedVariant.stock} available
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize || (selectedVariant && selectedVariant.stock === 0)}
              >
                {selectedVariant && selectedVariant.stock === 0
                  ? (language === 'id' ? 'Stok Habis' : 'Out of Stock')
                  : `Add to Cart - ${formatPrice(finalPrice * quantity)}`
                }
              </Button>
              <Button size="lg" variant="outline" className="px-4">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs">14 Days Return</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-5 w-5 text-primary mb-1" />
                <span className="text-xs">Secure Payment</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t">
              <h2 className="font-semibold mb-3">Description</h2>
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {mockProduct.description}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look */}
        <section className="mt-16">
          <CompleteTheLook
            currentProduct={{
              id: mockProduct.id,
              name: mockProduct.name,
              nameId: 'Kaos Oversized Premium',
              price: mockProduct.sale_price ?? mockProduct.base_price,
              category: 'Top',
              slug: mockProduct.slug,
            }}
            suggestedItems={getSuggestedOutfit('top')}
          />
        </section>

        {/* Product Recommendations */}
        <section className="mt-16">
          <ProductRecommendations
            productId={mockProduct.id}
            category={mockProduct.category.slug}
            type="similar"
            maxItems={6}
          />
        </section>

        {/* Frequently Bought Together Bundle */}
        <section className="mt-8">
          <FrequentlyBoughtTogether
            productId={mockProduct.id}
            currentProduct={{
              id: mockProduct.id,
              name: mockProduct.name,
              nameId: 'Kaos Oversized Premium',
              price: mockProduct.sale_price ?? mockProduct.base_price,
              originalPrice: mockProduct.sale_price ? mockProduct.base_price : undefined,
              slug: mockProduct.slug,
            }}
          />
        </section>

        {/* Product Q&A */}
        <section className="mt-16">
          <ProductQA
            productId={mockProduct.id}
            productName={mockProduct.name}
          />
        </section>

        {/* Reviews Section */}
        <section className="mt-16">
          <ProductReviews
            productId={mockProduct.id}
            productName={mockProduct.name}
          />
        </section>
      </div>

      {/* Recently Viewed */}
      <RecentlyViewedSection excludeProductId={mockProduct.id} maxItems={8} />

      {/* Size Guide Modal */}
      <SizeGuideModal />
    </div>
  )
}
