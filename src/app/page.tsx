'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Truck, RotateCcw, Shield, Clock, Heart } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { CheckInButton } from '@/components/check-in'
import { FlashSaleSection } from '@/components/flash-sale'
import { RecentlyViewedSection } from '@/components/recently-viewed'
import { toast } from 'sonner'

// Mock trending products
const trendingProducts = [
  { id: 't1', name: 'Oversized Cotton Tee', nameId: 'Kaos Oversized Katun', price: 199000, originalPrice: 249000, rating: 4.8, reviews: 234, sold: 1250 },
  { id: 't2', name: 'Slim Fit Jeans', nameId: 'Jeans Slim Fit', price: 449000, originalPrice: null, rating: 4.6, reviews: 189, sold: 890 },
  { id: 't3', name: 'Casual Blazer', nameId: 'Blazer Kasual', price: 699000, originalPrice: 899000, rating: 4.9, reviews: 156, sold: 567 },
  { id: 't4', name: 'Printed Midi Dress', nameId: 'Gaun Midi Bermotif', price: 399000, originalPrice: null, rating: 4.7, reviews: 312, sold: 2100 },
  { id: 't5', name: 'Cropped Cardigan', nameId: 'Kardigan Crop', price: 349000, originalPrice: 449000, rating: 4.5, reviews: 98, sold: 430 },
].map(p => ({ ...p, slug: p.name.toLowerCase().replace(/\s+/g, '-') }))

export default function HomePage() {
  const { t, language } = useTranslation()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const toggleWishlist = (product: typeof trendingProducts[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(language === 'id' ? 'Dihapus dari favorit' : 'Removed from wishlist')
    } else {
      addToWishlist({
        id: product.id,
        name: language === 'id' ? product.nameId : product.name,
        price: product.price,
        originalPrice: product.originalPrice ?? undefined,
        image: '',
        slug: product.slug,
      })
      toast.success(language === 'id' ? 'Ditambahkan ke favorit' : 'Added to wishlist')
    }
  }

  const categories = [
    { name: t.nav.women, nameId: 'Wanita', href: '/women' },
    { name: t.nav.men, nameId: 'Pria', href: '/men' },
    { name: t.nav.kids, nameId: 'Anak', href: '/kids' },
    { name: t.nav.beauty, nameId: 'Kecantikan', href: '/beauty' },
  ]

  const features = [
    { icon: Truck, title: t.home.freeShipping, description: t.home.freeShippingDesc },
    { icon: RotateCcw, title: t.home.easyReturns, description: t.home.easyReturnsDesc },
    { icon: Shield, title: t.home.securePayment, description: t.home.securePaymentDesc },
    { icon: Clock, title: t.home.fastDelivery, description: t.home.fastDeliveryDesc },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[500px] bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-primary/10" />

        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
              {t.home.heroTag}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {t.home.heroTitle} <span className="text-primary">{t.home.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t.home.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/new">
                  {t.home.shopNewArrivals}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sale">
                  {t.home.viewSale}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Check-in Banner */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <CheckInButton variant="banner" />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t.home.shopByCategory}</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              {t.home.viewAll}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group relative aspect-[3/4] bg-muted rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center text-white/80 text-sm mt-1 group-hover:translate-x-1 transition-transform">
                    {t.home.shopNow} <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <FlashSaleSection maxProducts={6} />

      {/* Trending Now */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t.home.trendingNow}</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              {t.home.viewAll}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {trendingProducts.map((product) => {
              const hasDiscount = product.originalPrice && product.originalPrice > product.price
              const discountPercent = hasDiscount
                ? Math.round((1 - product.price / product.originalPrice!) * 100)
                : 0

              return (
                <div key={product.id} className="group">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />

                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{discountPercent}%
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWishlist(product)
                        }}
                        className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                          isInWishlist(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-background/80 hover:bg-background'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>

                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="w-full">
                          {t.products.quickAdd}
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
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      <span className="text-xs text-muted-foreground">• {product.sold.toLocaleString()} {t.products.sold}</span>
                    </div>
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

      {/* Recently Viewed */}
      <RecentlyViewedSection maxItems={10} />

      {/* Newsletter CTA */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.home.newsletterTitle}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t.home.newsletterDesc}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => {
            e.preventDefault()
            toast.success(language === 'id' ? 'Terima kasih telah berlangganan!' : 'Thanks for subscribing!')
          }}>
            <input
              type="email"
              placeholder={t.home.emailPlaceholder}
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" size="lg">
              {t.home.subscribe}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
