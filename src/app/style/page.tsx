'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, ShoppingBag, Play, Bookmark, Share2, ChevronRight, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { toast } from 'sonner'

// Lookbook data
const featuredLook = {
  id: 'look-hero',
  title: 'The New Minimalist',
  titleId: 'Minimalis Baru',
  subtitle: 'Less is more. Make a statement with clean lines and neutral tones.',
  subtitleId: 'Less is more. Tampil statement dengan garis bersih dan warna netral.',
  season: 'Spring/Summer 2026',
  products: [
    { id: 'fl-1', name: 'Structured Linen Blazer', nameId: 'Blazer Linen Terstruktur', price: 699000, slug: 'structured-linen-blazer' },
    { id: 'fl-2', name: 'Silk Cami Top', nameId: 'Cami Top Sutra', price: 299000, slug: 'silk-cami-top' },
    { id: 'fl-3', name: 'Wide Leg Trousers', nameId: 'Celana Wide Leg', price: 449000, slug: 'wide-leg-trousers' },
    { id: 'fl-4', name: 'Leather Mules', nameId: 'Mules Kulit', price: 549000, slug: 'leather-mules' },
  ],
}

const lookbooks = [
  {
    id: 'lb-1',
    title: 'Weekend Wanderer',
    titleId: 'Weekend Santai',
    description: 'Effortless pieces for your days off',
    descriptionId: 'Outfit effortless untuk hari liburmu',
    looks: 8,
    coverGradient: 'from-amber-400 to-orange-500',
    products: [
      { id: 'ww-1', name: 'Oversized Cotton Tee', nameId: 'Kaos Katun Oversized', price: 199000, slug: 'oversized-cotton-tee' },
      { id: 'ww-2', name: 'Relaxed Denim', nameId: 'Denim Relaxed', price: 399000, slug: 'relaxed-denim' },
      { id: 'ww-3', name: 'Canvas Sneakers', nameId: 'Sneakers Kanvas', price: 349000, slug: 'canvas-sneakers' },
    ],
  },
  {
    id: 'lb-2',
    title: 'Office Essentials',
    titleId: 'Esensial Kantor',
    description: 'Polished looks from 9 to 5',
    descriptionId: 'Tampilan rapi dari jam 9 sampai 5',
    looks: 12,
    coverGradient: 'from-slate-600 to-slate-800',
    products: [
      { id: 'oe-1', name: 'Tailored Blazer', nameId: 'Blazer Tailored', price: 799000, slug: 'tailored-blazer' },
      { id: 'oe-2', name: 'Silk Blouse', nameId: 'Blus Sutra', price: 399000, slug: 'silk-blouse' },
      { id: 'oe-3', name: 'Pencil Skirt', nameId: 'Rok Pensil', price: 349000, slug: 'pencil-skirt' },
    ],
  },
  {
    id: 'lb-3',
    title: 'Date Night',
    titleId: 'Malam Kencan',
    description: 'Turn heads with romantic styles',
    descriptionId: 'Curi perhatian dengan gaya romantis',
    looks: 6,
    coverGradient: 'from-rose-400 to-pink-600',
    products: [
      { id: 'dn-1', name: 'Satin Slip Dress', nameId: 'Slip Dress Satin', price: 499000, slug: 'satin-slip-dress' },
      { id: 'dn-2', name: 'Strappy Heels', nameId: 'Heels Tali', price: 449000, slug: 'strappy-heels' },
      { id: 'dn-3', name: 'Clutch Bag', nameId: 'Tas Clutch', price: 299000, slug: 'clutch-bag' },
    ],
  },
  {
    id: 'lb-4',
    title: 'Vacation Mode',
    titleId: 'Mode Liburan',
    description: 'Pack light, look amazing',
    descriptionId: 'Bawa sedikit, tampil menawan',
    looks: 10,
    coverGradient: 'from-cyan-400 to-blue-500',
    products: [
      { id: 'vm-1', name: 'Linen Shirt Dress', nameId: 'Dress Kemeja Linen', price: 449000, slug: 'linen-shirt-dress' },
      { id: 'vm-2', name: 'Woven Sandals', nameId: 'Sandal Anyaman', price: 299000, slug: 'woven-sandals' },
      { id: 'vm-3', name: 'Straw Tote', nameId: 'Tote Jerami', price: 349000, slug: 'straw-tote' },
    ],
  },
]

const styleGuides = [
  {
    id: 'sg-1',
    title: 'How to Style Wide Leg Pants',
    titleId: 'Cara Styling Celana Wide Leg',
    readTime: '3 min',
    image: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'sg-2',
    title: '5 Ways to Wear a White Tee',
    titleId: '5 Cara Memakai Kaos Putih',
    readTime: '4 min',
    image: 'from-gray-300 to-gray-500',
  },
  {
    id: 'sg-3',
    title: 'Building a Capsule Wardrobe',
    titleId: 'Membangun Capsule Wardrobe',
    readTime: '6 min',
    image: 'from-amber-300 to-amber-500',
  },
  {
    id: 'sg-4',
    title: 'Mixing Prints Like a Pro',
    titleId: 'Mixing Prints Seperti Pro',
    readTime: '5 min',
    image: 'from-purple-400 to-indigo-600',
  },
]

const trendingStyles = [
  { tag: 'Quiet Luxury', tagId: 'Quiet Luxury', count: 234 },
  { tag: 'Coastal Grandmother', tagId: 'Coastal Grandmother', count: 189 },
  { tag: 'Office Siren', tagId: 'Office Siren', count: 156 },
  { tag: 'Clean Girl', tagId: 'Clean Girl', count: 298 },
  { tag: 'Y2K Revival', tagId: 'Y2K Revival', count: 167 },
]

const communityLooks = [
  { id: 'cl-1', user: '@sarah.style', likes: 234, products: 3 },
  { id: 'cl-2', user: '@dina.ootd', likes: 189, products: 4 },
  { id: 'cl-3', user: '@maya.fits', likes: 312, products: 2 },
  { id: 'cl-4', user: '@rara.fashion', likes: 156, products: 3 },
  { id: 'cl-5', user: '@nina.looks', likes: 278, products: 4 },
  { id: 'cl-6', user: '@bella.wardrobe', likes: 201, products: 3 },
]

export default function StylePage() {
  const { language } = useTranslation()
  const { addItem } = useCartStore()
  const [savedLooks, setSavedLooks] = useState<string[]>([])

  const toggleSave = (lookId: string) => {
    setSavedLooks(prev =>
      prev.includes(lookId) ? prev.filter(id => id !== lookId) : [...prev, lookId]
    )
    toast.success(
      savedLooks.includes(lookId)
        ? (language === 'id' ? 'Dihapus dari tersimpan' : 'Removed from saved')
        : (language === 'id' ? 'Disimpan ke koleksi' : 'Saved to collection')
    )
  }

  const handleAddToCart = (product: { id: string; name: string; nameId: string; price: number; slug: string }) => {
    const mockVariant = {
      id: `${product.id}-variant`,
      product_id: product.id,
      sku: product.slug,
      size: 'M',
      color: 'Default',
      color_hex: '#000000',
      price_adjustment: 0,
      stock: 10,
      images: [],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const mockProduct = {
      id: product.id,
      brand_id: 'uc',
      category_id: 'style',
      seller_id: null,
      name: language === 'id' ? product.nameId : product.name,
      slug: product.slug,
      description: '',
      base_price: product.price,
      sale_price: null,
      images: [],
      tags: [],
      is_active: true,
      is_featured: false,
      total_sold: 0,
      rating_avg: 0,
      rating_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addItem(mockVariant, mockProduct, 1)
    toast.success(language === 'id' ? 'Ditambahkan ke keranjang!' : 'Added to cart!')
  }

  const getTotalPrice = (products: typeof featuredLook.products) => {
    return products.reduce((sum, p) => sum + p.price, 0)
  }

  return (
    <div className="min-h-screen">
      {/* Hero - Featured Look */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/10" />

        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Editorial Image */}
            <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-stone-300 to-stone-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Season Tag */}
              <div className="absolute top-6 left-6">
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
                  {featuredLook.season}
                </span>
              </div>

              {/* Product Hotspots */}
              {featuredLook.products.map((product, i) => (
                <button
                  key={product.id}
                  className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform group"
                  style={{
                    top: `${25 + i * 18}%`,
                    left: `${40 + (i % 2) * 20}%`,
                  }}
                >
                  <span className="w-3 h-3 bg-primary rounded-full" />
                  {/* Tooltip */}
                  <span className="absolute left-full ml-3 bg-white text-black text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    {language === 'id' ? product.nameId : product.name}
                    <br />
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                  </span>
                </button>
              ))}

              {/* Play Video Button */}
              <button className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors">
                <Play className="h-4 w-4 fill-current" />
                <span className="text-sm">{language === 'id' ? 'Tonton Video' : 'Watch Video'}</span>
              </button>
            </div>

            {/* Right - Look Details */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                {language === 'id' ? featuredLook.titleId : featuredLook.title}
              </h1>
              <p className="text-xl text-white/70 mb-8">
                {language === 'id' ? featuredLook.subtitleId : featuredLook.subtitle}
              </p>

              {/* Products in Look */}
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
                  {language === 'id' ? 'Dalam Look Ini' : 'In This Look'}
                </h3>
                {featuredLook.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-lg" />
                      <div>
                        <p className="font-medium">{language === 'id' ? product.nameId : product.name}</p>
                        <p className="text-white/70">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Total & Actions */}
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-4 mb-6">
                <div>
                  <p className="text-sm text-white/50">{language === 'id' ? 'Total Look' : 'Complete Look'}</p>
                  <p className="text-2xl font-bold">{formatPrice(getTotalPrice(featuredLook.products))}</p>
                </div>
                <Button
                  size="lg"
                  onClick={() => featuredLook.products.forEach(p => handleAddToCart(p))}
                >
                  {language === 'id' ? 'Beli Semua' : 'Shop the Look'}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => toggleSave(featuredLook.id)}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${savedLooks.includes(featuredLook.id) ? 'fill-current' : ''}`} />
                  {language === 'id' ? 'Simpan' : 'Save'}
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Bagikan' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbooks Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {language === 'id' ? 'Lookbook' : 'Lookbooks'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'id' ? 'Inspirasi outfit untuk setiap momen' : 'Outfit inspiration for every moment'}
              </p>
            </div>
            <Button variant="outline">
              {language === 'id' ? 'Lihat Semua' : 'View All'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lookbooks.map((lookbook) => (
              <Link
                key={lookbook.id}
                href={`/style/${lookbook.id}`}
                className="group"
              >
                <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br ${lookbook.coverGradient}`}>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <span className="text-sm opacity-80 mb-1">
                      {lookbook.looks} {language === 'id' ? 'looks' : 'looks'}
                    </span>
                    <h3 className="text-xl font-bold mb-1">
                      {language === 'id' ? lookbook.titleId : lookbook.title}
                    </h3>
                    <p className="text-sm opacity-80">
                      {language === 'id' ? lookbook.descriptionId : lookbook.description}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Product Preview */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {lookbook.products.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +{lookbook.products.length} {language === 'id' ? 'produk' : 'products'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Style Guides */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {language === 'id' ? 'Panduan Gaya' : 'Style Guides'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'id' ? 'Tips dan trik dari stylist kami' : 'Tips and tricks from our stylists'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {styleGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/style/guide/${guide.id}`}
                className="group"
              >
                <div className={`aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${guide.image} mb-4`}>
                  <div className="w-full h-full bg-black/10 group-hover:bg-black/20 transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{guide.readTime} {language === 'id' ? 'baca' : 'read'}</span>
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {language === 'id' ? guide.titleId : guide.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Styles */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-center">
            {language === 'id' ? 'Gaya Trending' : 'Trending Styles'}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {trendingStyles.map((style) => (
              <Link
                key={style.tag}
                href={`/style/trend/${style.tag.toLowerCase().replace(' ', '-')}`}
                className="group"
              >
                <span className="inline-flex items-center gap-2 bg-background border rounded-full px-4 py-2 hover:border-primary hover:text-primary transition-colors">
                  <span className="font-medium">{language === 'id' ? style.tagId : style.tag}</span>
                  <span className="text-xs text-muted-foreground">{style.count}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Looks */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {language === 'id' ? 'Gaya Komunitas' : 'Community Style'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'id' ? 'Lihat bagaimana orang lain memakai UC' : 'See how others wear UC'}
              </p>
            </div>
            <Button variant="outline">
              <Instagram className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Bagikan Gayamu' : 'Share Your Style'}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {communityLooks.map((look) => (
              <div key={look.id} className="group cursor-pointer">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{look.likes}</span>
                      </div>
                      <p className="text-xs opacity-80">{look.products} {language === 'id' ? 'produk' : 'products'}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{look.user}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {language === 'id'
                ? 'Tag @ucfashion.id di Instagram untuk ditampilkan di sini!'
                : 'Tag @ucfashion.id on Instagram to be featured here!'}
            </p>
            <Button variant="outline" size="lg">
              <Instagram className="h-4 w-4 mr-2" />
              @ucfashion.id
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'id' ? 'Inspirasi Gaya Mingguan' : 'Weekly Style Inspiration'}
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            {language === 'id'
              ? 'Dapatkan lookbook terbaru, tips styling, dan akses early ke koleksi baru langsung di inbox-mu.'
              : 'Get the latest lookbooks, styling tips, and early access to new collections straight to your inbox.'}
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === 'id' ? 'Email kamu' : 'Your email'}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-primary"
            />
            <Button size="lg">
              {language === 'id' ? 'Langganan' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
