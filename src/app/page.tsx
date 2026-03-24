'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Truck,
  RotateCcw,
  Shield,
  Clock,
  Heart,
  Sparkles,
  Store,
  Camera,
  TrendingUp,
  Users,
  Package,
  CheckCircle,
} from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useTrialStore } from '@/stores/trial'
import { usePartnerStore } from '@/stores/partner'
import { CheckInButton } from '@/components/check-in'
import { FlashSaleSection } from '@/components/flash-sale'
import { DailyDealsSection } from '@/components/daily-deals'
import { RecentlyViewedSection } from '@/components/recently-viewed'
import { toast } from 'sonner'

// Mock trending products - modest fashion focus
const trendingProducts = [
  { id: 't1', name: 'Premium Voal Square Hijab', nameId: 'Hijab Segi Empat Voal Premium', price: 89000, originalPrice: 129000, rating: 4.9, reviews: 1245, sold: 8920 },
  { id: 't2', name: 'Basic Daily Gamis', nameId: 'Gamis Harian Basic', price: 189000, originalPrice: 249000, rating: 4.8, reviews: 2156, sold: 12500 },
  { id: 't3', name: 'Khimar Pet Ceruti', nameId: 'Khimar Pet Ceruti', price: 145000, originalPrice: 189000, rating: 4.8, reviews: 678, sold: 4560 },
  { id: 't4', name: 'Mukena Travel Parasut', nameId: 'Mukena Travel Parasut', price: 165000, originalPrice: 215000, rating: 4.8, reviews: 1567, sold: 8920 },
  { id: 't5', name: 'Abaya Arabian Premium', nameId: 'Abaya Arabian Premium', price: 450000, originalPrice: 599000, rating: 4.9, reviews: 789, sold: 4560 },
].map(p => ({ ...p, slug: p.name.toLowerCase().replace(/\s+/g, '-') }))

export default function HomePage() {
  const { t, language } = useTranslation()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { getTrialStats } = useTrialStore()
  const { partners } = usePartnerStore()

  const trialStats = getTrialStats()
  const activePartners = partners.filter((p) => p.status === 'active').length

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
    { name: t.nav.hijab, nameId: 'Hijab', href: '/hijab', icon: '🧕' },
    { name: t.nav.gamis, nameId: 'Gamis & Abaya', href: '/gamis', icon: '👗' },
    { name: t.nav.khimar, nameId: 'Khimar', href: '/khimar', icon: '✨' },
    { name: t.nav.mukena, nameId: 'Mukena', href: '/mukena', icon: '🤲' },
  ]

  const features = [
    { icon: Truck, title: t.home.freeShipping, description: t.home.freeShippingDesc },
    { icon: RotateCcw, title: t.home.easyReturns, description: t.home.easyReturnsDesc },
    { icon: Shield, title: t.home.securePayment, description: t.home.securePaymentDesc },
    { icon: Clock, title: t.home.fastDelivery, description: t.home.fastDeliveryDesc },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Banner - Modest Fashion Focus */}
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div className="absolute inset-0 bg-[url('/pattern-islamic.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent z-10" />

        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
              {language === 'id' ? '✨ Koleksi Modest Fashion' : '✨ Modest Fashion Collection'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              {language === 'id' ? 'Cantik dalam ' : 'Beautiful in '}
              <span className="text-primary">{language === 'id' ? 'Kesederhanaan' : 'Modesty'}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'id'
                ? 'Temukan koleksi hijab, gamis, khimar & mukena berkualitas dari Tanah Abang. Tampil syari, tetap stylish.'
                : 'Discover quality hijab, gamis, khimar & mukena from Tanah Abang. Stay modest, stay stylish.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/hijab">
                  {language === 'id' ? 'Belanja Hijab' : 'Shop Hijab'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gamis">
                  {language === 'id' ? 'Koleksi Gamis' : 'Gamis Collection'}
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

      {/* Trial Program CTA for Sellers */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                {language === 'id' ? 'Untuk Pedagang Tanah Abang' : 'For Tanah Abang Sellers'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'id' ? 'Uji Coba dengan ' : 'Try with '}
                <span className="text-primary">10 {language === 'id' ? 'Potong' : 'Pieces'}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                {language === 'id'
                  ? 'Titip 10 potong barang Anda. Kami foto profesional, upload, dan jualkan. Anda terima uang!'
                  : 'Drop off 10 pieces. We photograph, upload, and sell. You receive money!'}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'id' ? 'Gratis, tanpa biaya' : 'Free, no fees'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'id' ? 'Foto studio profesional' : 'Professional studio photos'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {language === 'id' ? 'Bayar hanya saat laku' : 'Pay only when sold'}
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button size="lg" asChild>
                  <Link href="/uji-coba">
                    {language === 'id' ? 'Pelajari Program' : 'Learn More'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/uji-coba/daftar">
                    {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
                <div className="bg-background rounded-xl p-5 border shadow-sm text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {activePartners + trialStats.totalRegistered}+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'id' ? 'Partner & Trial' : 'Partners & Trials'}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-5 border shadow-sm text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {trialStats.conversionRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'id' ? 'Lanjut Partner' : 'Became Partners'}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-5 border shadow-sm text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">2,500+</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'id' ? 'Produk Difoto' : 'Products Photographed'}
                  </p>
                </div>
                <div className="bg-background rounded-xl p-5 border shadow-sm text-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">5,000+</p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'id' ? 'Pesanan Dikirim' : 'Orders Shipped'}
                  </p>
                </div>
              </div>
            </div>
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

      {/* Daily Deals Section */}
      <DailyDealsSection />

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

      {/* Seller Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {language === 'id' ? 'Kata Pedagang Tanah Abang' : 'What Sellers Say'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'id'
                ? 'Bergabung dengan ratusan pedagang yang sudah merasakan manfaatnya'
                : 'Join hundreds of sellers who have experienced the benefits'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-background rounded-xl p-6 border">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Awalnya ragu, tapi setelah 10 potong pertama laku 8, langsung saya tambahin 50 potong lagi!'
                  : 'Was skeptical at first, but after 8 of 10 pieces sold, I immediately added 50 more!'}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Ibu Dewi</p>
                  <p className="text-xs text-muted-foreground">Dewi Collection, Blok A</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 border">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Tidak perlu mikir soal foto dan packing. Tinggal titip, terima transfer tiap Senin.'
                  : "I don't need to think about photos and packing. Just drop off, receive transfer every Monday."}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Pak Hendra</p>
                  <p className="text-xs text-muted-foreground">Hendra Fashion, Blok B</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 border">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Omset online saya naik 3x lipat sejak gabung AlyaNoor. Sekarang fokus produksi, AlyaNoor yang jual.'
                  : 'My online revenue tripled since joining AlyaNoor. Now I focus on production, AlyaNoor handles sales.'}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Ibu Sari</p>
                  <p className="text-xs text-muted-foreground">Sari Busana, Blok A</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/uji-coba">
                {language === 'id' ? 'Mulai Uji Coba Gratis' : 'Start Free Trial'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
