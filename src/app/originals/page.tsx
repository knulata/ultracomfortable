'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge, Star, Heart, ShoppingBag, Play, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { toast } from 'sonner'

// UC Originals Collection - Exclusive designs only at UC
const ucOriginals = {
  // Hero Collection - "Comfort Edit"
  comfortEdit: {
    name: 'The Comfort Edit',
    nameId: 'Koleksi Nyaman',
    tagline: 'Everyday essentials, elevated.',
    taglineId: 'Esensial harian, lebih elevated.',
    products: [
      {
        id: 'uco-001',
        name: 'Cloud Cotton Tee',
        nameId: 'Kaos Cloud Cotton',
        description: 'Our signature ultra-soft cotton blend. Feels like wearing a cloud.',
        descriptionId: 'Campuran katun ultra-lembut signature kami. Terasa seperti memakai awan.',
        price: 249000,
        colors: ['Ivory', 'Charcoal', 'Sage', 'Dusty Rose'],
        colorsId: ['Gading', 'Arang', 'Sage', 'Dusty Rose'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        slug: 'cloud-cotton-tee',
        badge: 'Bestseller',
        stock: 847,
        soldCount: 2341,
      },
      {
        id: 'uco-002',
        name: 'Everyday Wide Pants',
        nameId: 'Celana Wide Everyday',
        description: 'High-waisted, flowy, and incredibly comfortable. Your new go-to.',
        descriptionId: 'High-waist, flowy, dan sangat nyaman. Pilihan baru favoritmu.',
        price: 399000,
        colors: ['Black', 'Cream', 'Navy'],
        colorsId: ['Hitam', 'Krem', 'Navy'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        slug: 'everyday-wide-pants',
        badge: null,
        stock: 423,
        soldCount: 1872,
      },
      {
        id: 'uco-003',
        name: 'Second Skin Tank',
        nameId: 'Tank Top Second Skin',
        description: 'Seamless, stretchy, moves with you. Perfect alone or layered.',
        descriptionId: 'Seamless, stretchy, mengikuti gerakanmu. Sempurna sendiri atau di-layer.',
        price: 179000,
        colors: ['White', 'Black', 'Nude', 'Grey'],
        colorsId: ['Putih', 'Hitam', 'Nude', 'Abu-abu'],
        sizes: ['XS', 'S', 'M', 'L'],
        slug: 'second-skin-tank',
        badge: 'New',
        stock: 1205,
        soldCount: 892,
      },
    ],
  },
  // Premium Collection - "Studio Line"
  studioLine: {
    name: 'Studio Line',
    nameId: 'Koleksi Studio',
    tagline: 'Work-to-weekend versatility.',
    taglineId: 'Versatil dari kerja ke weekend.',
    products: [
      {
        id: 'uco-004',
        name: 'Sculpted Blazer',
        nameId: 'Blazer Sculpted',
        description: 'Clean lines, structured shoulders, effortlessly polished.',
        descriptionId: 'Garis bersih, bahu terstruktur, effortlessly polished.',
        price: 799000,
        originalPrice: 999000,
        colors: ['Black', 'Taupe', 'Navy'],
        colorsId: ['Hitam', 'Taupe', 'Navy'],
        sizes: ['XS', 'S', 'M', 'L'],
        slug: 'sculpted-blazer',
        badge: 'Limited',
        stock: 89,
        soldCount: 456,
      },
      {
        id: 'uco-005',
        name: 'Silk Touch Blouse',
        nameId: 'Blus Silk Touch',
        description: 'Luxe satin with a subtle sheen. Elevated everyday.',
        descriptionId: 'Satin mewah dengan kilau halus. Elevated setiap hari.',
        price: 449000,
        colors: ['Champagne', 'Black', 'Ivory'],
        colorsId: ['Champagne', 'Hitam', 'Gading'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        slug: 'silk-touch-blouse',
        badge: null,
        stock: 234,
        soldCount: 678,
      },
      {
        id: 'uco-006',
        name: 'Perfect Midi Skirt',
        nameId: 'Rok Midi Sempurna',
        description: 'A-line silhouette, midi length. The skirt that goes with everything.',
        descriptionId: 'Siluet A-line, panjang midi. Rok yang cocok dengan segalanya.',
        price: 349000,
        colors: ['Black', 'Camel', 'Forest'],
        colorsId: ['Hitam', 'Camel', 'Forest'],
        sizes: ['XS', 'S', 'M', 'L'],
        slug: 'perfect-midi-skirt',
        badge: null,
        stock: 312,
        soldCount: 521,
      },
    ],
  },
  // Limited Drop - "After Hours"
  afterHours: {
    name: 'After Hours',
    nameId: 'After Hours',
    tagline: 'For nights that matter.',
    taglineId: 'Untuk malam yang berarti.',
    isLimited: true,
    dropDate: '2026-03-10',
    products: [
      {
        id: 'uco-007',
        name: 'Midnight Slip Dress',
        nameId: 'Slip Dress Midnight',
        description: 'Elegant satin slip. Minimalist glamour for your special nights.',
        descriptionId: 'Slip satin elegan. Glamor minimalis untuk malam spesialmu.',
        price: 599000,
        colors: ['Black', 'Burgundy', 'Emerald'],
        colorsId: ['Hitam', 'Burgundy', 'Emerald'],
        sizes: ['XS', 'S', 'M', 'L'],
        slug: 'midnight-slip-dress',
        badge: 'Drop',
        stock: 50,
        soldCount: 0,
      },
      {
        id: 'uco-008',
        name: 'Velvet Cropped Jacket',
        nameId: 'Jaket Crop Velvet',
        description: 'Rich velvet, cropped fit. The statement piece you need.',
        descriptionId: 'Velvet kaya, potongan crop. Statement piece yang kamu butuhkan.',
        price: 699000,
        colors: ['Black', 'Deep Purple'],
        colorsId: ['Hitam', 'Deep Purple'],
        sizes: ['S', 'M', 'L'],
        slug: 'velvet-cropped-jacket',
        badge: 'Drop',
        stock: 35,
        soldCount: 0,
      },
    ],
  },
}

// Design principles
const designPrinciples = [
  {
    icon: '✨',
    title: 'Designed In-House',
    titleId: 'Didesain Internal',
    desc: 'Every piece is designed by our Jakarta-based team',
    descId: 'Setiap item didesain oleh tim kami di Jakarta',
  },
  {
    icon: '🧵',
    title: 'Premium Fabrics',
    titleId: 'Kain Premium',
    desc: 'We source the best materials for lasting comfort',
    descId: 'Kami memilih material terbaik untuk kenyamanan',
  },
  {
    icon: '📐',
    title: 'Fit-Tested',
    titleId: 'Diuji Fit-nya',
    desc: 'Tested on real bodies, perfected for Indonesian sizes',
    descId: 'Diuji pada tubuh nyata, disempurnakan untuk ukuran Indonesia',
  },
  {
    icon: '🔒',
    title: 'Only at UC',
    titleId: 'Hanya di UC',
    desc: "You won't find these anywhere else",
    descId: 'Kamu tidak akan menemukan ini di tempat lain',
  },
]

export default function UCOriginalsPage() {
  const { language } = useTranslation()
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({})

  const handleAddToCart = (product: typeof ucOriginals.comfortEdit.products[0]) => {
    const colorIndex = selectedColors[product.id] || 0
    const color = product.colors[colorIndex]

    const mockVariant = {
      id: `${product.id}-${color}-M`,
      product_id: product.id,
      sku: product.slug,
      size: 'M',
      color: color,
      color_hex: '#000000',
      price_adjustment: 0,
      stock: product.stock,
      images: [],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const mockProduct = {
      id: product.id,
      brand_id: 'uc-originals',
      category_id: 'originals',
      name: language === 'id' ? product.nameId : product.name,
      slug: product.slug,
      description: language === 'id' ? product.descriptionId : product.description,
      base_price: (product as any).originalPrice || product.price,
      sale_price: (product as any).originalPrice ? product.price : null,
      images: [],
      tags: ['uc-original'],
      is_active: true,
      is_featured: true,
      total_sold: product.soldCount,
      rating_avg: 4.8,
      rating_count: Math.floor(product.soldCount * 0.3),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addItem(mockVariant, mockProduct, 1)
    toast.success(language === 'id' ? 'Ditambahkan ke keranjang!' : 'Added to cart!')
  }

  const toggleWishlist = (product: typeof ucOriginals.comfortEdit.products[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(language === 'id' ? 'Dihapus dari favorit' : 'Removed from wishlist')
    } else {
      addToWishlist({
        id: product.id,
        name: language === 'id' ? product.nameId : product.name,
        price: product.price,
        originalPrice: (product as any).originalPrice,
        image: '',
        slug: product.slug,
      })
      toast.success(language === 'id' ? 'Ditambahkan ke favorit' : 'Added to wishlist')
    }
  }

  const renderProductCard = (product: typeof ucOriginals.comfortEdit.products[0], index: number) => {
    const colorIndex = selectedColors[product.id] || 0
    const hasDiscount = (product as any).originalPrice
    const colors = language === 'id' ? product.colorsId : product.colors

    return (
      <div key={product.id} className="group">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden mb-4">
          {/* Gradient placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20" />

          {/* UC Original Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black text-white px-2.5 py-1 rounded-full text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            UC Original
          </div>

          {/* Status Badge */}
          {product.badge && (
            <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
              product.badge === 'Bestseller' ? 'bg-amber-500 text-white' :
              product.badge === 'New' ? 'bg-green-500 text-white' :
              product.badge === 'Limited' ? 'bg-red-500 text-white' :
              product.badge === 'Drop' ? 'bg-purple-500 text-white' :
              'bg-primary text-primary-foreground'
            }`}>
              {product.badge}
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/90 hover:bg-white text-foreground'
            }`}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add */}
          <div className="absolute inset-x-3 bottom-14 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="w-full" onClick={() => handleAddToCart(product)}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Tambah ke Keranjang' : 'Add to Cart'}
            </Button>
          </div>

          {/* Low Stock Warning */}
          {product.stock < 100 && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {language === 'id' ? `Sisa ${product.stock}` : `Only ${product.stock} left`}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
              {language === 'id' ? product.nameId : product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {language === 'id' ? product.descriptionId : product.description}
          </p>

          {/* Colors */}
          <div className="flex items-center gap-2 mb-3">
            {colors.map((color, i) => (
              <button
                key={i}
                onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: i }))}
                className={`text-xs px-2 py-1 rounded-full border transition-all ${
                  colorIndex === i
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Price & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice((product as any).originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>4.8</span>
              <span>•</span>
              <span>{product.soldCount.toLocaleString()} {language === 'id' ? 'terjual' : 'sold'}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              {language === 'id' ? 'Koleksi Eksklusif' : 'Exclusive Collection'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              UC Originals
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-xl">
              {language === 'id'
                ? 'Didesain di Jakarta. Dibuat dengan passion. Hanya tersedia di UC.'
                : 'Designed in Jakarta. Crafted with passion. Available only at UC.'}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                {language === 'id' ? 'Jelajahi Koleksi' : 'Explore Collection'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Play className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Tonton Ceritanya' : 'Watch the Story'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {designPrinciples.map((principle, i) => (
              <div key={i} className="text-center">
                <span className="text-3xl mb-3 block">{principle.icon}</span>
                <h3 className="font-semibold mb-1">
                  {language === 'id' ? principle.titleId : principle.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? principle.descId : principle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Comfort Edit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">
              {language === 'id' ? ucOriginals.comfortEdit.nameId : ucOriginals.comfortEdit.name}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'id' ? ucOriginals.comfortEdit.taglineId : ucOriginals.comfortEdit.tagline}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ucOriginals.comfortEdit.products.map((product, i) => renderProductCard(product, i))}
          </div>
        </div>
      </section>

      {/* Brand Story Banner */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              {language === 'id' ? 'Mengapa UC Originals?' : 'Why UC Originals?'}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {language === 'id'
                ? 'Kami lelah melihat fashion yang sama di mana-mana. Jadi kami memutuskan untuk membuat sendiri. Setiap UC Original dirancang oleh tim kami di Jakarta, diuji pada berbagai tipe tubuh Indonesia, dan dibuat dengan material yang benar-benar nyaman. Ini bukan fast fashion. Ini fashion yang dibuat dengan penuh perhatian.'
                : "We got tired of seeing the same fashion everywhere. So we decided to make our own. Every UC Original is designed by our team in Jakarta, tested on real Indonesian body types, and made with materials that actually feel good. This isn't fast fashion. This is fashion made with care."}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">{language === 'id' ? 'Desainer' : 'Designers'}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">{language === 'id' ? 'Produk Eksklusif' : 'Exclusive Pieces'}</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">{language === 'id' ? 'Hanya di UC' : 'Only at UC'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Line */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">
              {language === 'id' ? ucOriginals.studioLine.nameId : ucOriginals.studioLine.name}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'id' ? ucOriginals.studioLine.taglineId : ucOriginals.studioLine.tagline}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ucOriginals.studioLine.products.map((product, i) => renderProductCard(product, i))}
          </div>
        </div>
      </section>

      {/* Limited Drop - After Hours */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-4">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              {language === 'id' ? 'Limited Drop' : 'Limited Drop'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              {language === 'id' ? ucOriginals.afterHours.nameId : ucOriginals.afterHours.name}
            </h2>
            <p className="text-white/70 text-lg">
              {language === 'id' ? ucOriginals.afterHours.taglineId : ucOriginals.afterHours.tagline}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {ucOriginals.afterHours.products.map((product, i) => (
              <div key={product.id} className="group">
                {/* Image */}
                <div className="relative aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden mb-4 border border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-white text-black px-2.5 py-1 rounded-full text-xs font-medium">
                      <Sparkles className="h-3 w-3" />
                      UC Original
                    </span>
                    <span className="bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                      Limited
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="absolute bottom-3 left-3 bg-white/90 text-black text-xs font-medium px-3 py-1.5 rounded-full">
                    {language === 'id' ? `Hanya ${product.stock} pieces` : `Only ${product.stock} pieces`}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute bottom-3 right-3 p-2.5 rounded-full transition-all ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 hover:bg-white text-black'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'id' ? product.nameId : product.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-3">
                    {language === 'id' ? product.descriptionId : product.description}
                  </p>

                  {/* Colors */}
                  <div className="flex items-center gap-2 mb-4">
                    {(language === 'id' ? product.colorsId : product.colors).map((color, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/70">
                        {color}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl">{formatPrice(product.price)}</span>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="bg-white text-black hover:bg-white/90"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {language === 'id' ? 'Beli Sekarang' : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary/10 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {language === 'id' ? 'Jadilah yang Pertama Tahu' : 'Be the First to Know'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {language === 'id'
                ? 'Drop baru, restocks, dan koleksi eksklusif. Langsung ke inbox-mu.'
                : 'New drops, restocks, and exclusive collections. Straight to your inbox.'}
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder={language === 'id' ? 'Email kamu' : 'Your email'}
                className="flex-1 px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg">
                {language === 'id' ? 'Daftar' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
