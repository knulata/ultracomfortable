'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, SlidersHorizontal, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { useWishlistStore } from '@/stores/wishlist'
import { toast } from 'sonner'
import { Heart } from 'lucide-react'

// Category configuration
const categoryConfig: Record<string, { title: string, titleId: string, subcategories: { name: string, nameId: string, href: string }[] }> = {
  hijab: {
    title: 'Hijab',
    titleId: 'Hijab',
    subcategories: [
      { name: 'Pashmina', nameId: 'Pashmina', href: '/hijab/pashmina' },
      { name: 'Square Hijab', nameId: 'Hijab Segi Empat', href: '/hijab/square' },
      { name: 'Instant Hijab', nameId: 'Hijab Instan', href: '/hijab/instant' },
      { name: 'Bergo', nameId: 'Bergo', href: '/hijab/bergo' },
      { name: 'Inner & Ciput', nameId: 'Inner & Ciput', href: '/hijab/inner' },
    ],
  },
  gamis: {
    title: 'Gamis & Abaya',
    titleId: 'Gamis & Abaya',
    subcategories: [
      { name: 'Daily Gamis', nameId: 'Gamis Harian', href: '/gamis/daily' },
      { name: 'Formal Gamis', nameId: 'Gamis Formal', href: '/gamis/formal' },
      { name: 'Abaya', nameId: 'Abaya', href: '/gamis/abaya' },
      { name: 'Gamis Set', nameId: 'Gamis Set', href: '/gamis/set' },
      { name: 'Kaftan', nameId: 'Kaftan', href: '/gamis/kaftan' },
    ],
  },
  khimar: {
    title: 'Khimar',
    titleId: 'Khimar',
    subcategories: [
      { name: 'Short Khimar', nameId: 'Khimar Pendek', href: '/khimar/short' },
      { name: 'Medium Khimar', nameId: 'Khimar Sedang', href: '/khimar/medium' },
      { name: 'Long Khimar', nameId: 'Khimar Panjang', href: '/khimar/long' },
      { name: 'Niqab', nameId: 'Niqab', href: '/khimar/niqab' },
    ],
  },
  mukena: {
    title: 'Mukena',
    titleId: 'Mukena',
    subcategories: [
      { name: 'Travel Mukena', nameId: 'Mukena Travel', href: '/mukena/travel' },
      { name: 'Cotton Mukena', nameId: 'Mukena Katun', href: '/mukena/cotton' },
      { name: 'Silk Mukena', nameId: 'Mukena Sutra', href: '/mukena/silk' },
      { name: 'Kids Mukena', nameId: 'Mukena Anak', href: '/mukena/kids' },
    ],
  },
  women: {
    title: 'Women',
    titleId: 'Wanita',
    subcategories: [
      { name: 'Dresses', nameId: 'Gaun', href: '/women/dresses' },
      { name: 'Tops', nameId: 'Atasan', href: '/women/tops' },
      { name: 'Bottoms', nameId: 'Bawahan', href: '/women/bottoms' },
      { name: 'Outerwear', nameId: 'Jaket', href: '/women/outerwear' },
      { name: 'Activewear', nameId: 'Pakaian Olahraga', href: '/women/activewear' },
    ],
  },
  men: {
    title: 'Men',
    titleId: 'Pria',
    subcategories: [
      { name: 'Shirts', nameId: 'Kemeja', href: '/men/shirts' },
      { name: 'T-Shirts', nameId: 'Kaos', href: '/men/tshirts' },
      { name: 'Pants', nameId: 'Celana', href: '/men/pants' },
      { name: 'Outerwear', nameId: 'Jaket', href: '/men/outerwear' },
      { name: 'Activewear', nameId: 'Pakaian Olahraga', href: '/men/activewear' },
    ],
  },
  kids: {
    title: 'Kids',
    titleId: 'Anak',
    subcategories: [
      { name: 'Girls', nameId: 'Perempuan', href: '/kids/girls' },
      { name: 'Boys', nameId: 'Laki-laki', href: '/kids/boys' },
      { name: 'Baby', nameId: 'Bayi', href: '/kids/baby' },
      { name: 'School', nameId: 'Sekolah', href: '/kids/school' },
    ],
  },
  beauty: {
    title: 'Beauty',
    titleId: 'Kecantikan',
    subcategories: [
      { name: 'Skincare', nameId: 'Perawatan Kulit', href: '/beauty/skincare' },
      { name: 'Makeup', nameId: 'Makeup', href: '/beauty/makeup' },
      { name: 'Hair Care', nameId: 'Perawatan Rambut', href: '/beauty/haircare' },
      { name: 'Fragrance', nameId: 'Parfum', href: '/beauty/fragrance' },
    ],
  },
  lifestyle: {
    title: 'Lifestyle',
    titleId: 'Gaya Hidup',
    subcategories: [
      { name: 'Bags', nameId: 'Tas', href: '/lifestyle/bags' },
      { name: 'Accessories', nameId: 'Aksesoris', href: '/lifestyle/accessories' },
      { name: 'Shoes', nameId: 'Sepatu', href: '/lifestyle/shoes' },
      { name: 'Home', nameId: 'Rumah', href: '/lifestyle/home' },
    ],
  },
  new: {
    title: 'New In',
    titleId: 'Baru',
    subcategories: [
      { name: 'This Week', nameId: 'Minggu Ini', href: '/new/this-week' },
      { name: 'Best Sellers', nameId: 'Terlaris', href: '/new/best-sellers' },
      { name: 'Trending', nameId: 'Trending', href: '/new/trending' },
    ],
  },
  sale: {
    title: 'Sale',
    titleId: 'Diskon',
    subcategories: [
      { name: 'Up to 30% Off', nameId: 'Diskon Hingga 30%', href: '/sale/30' },
      { name: 'Up to 50% Off', nameId: 'Diskon Hingga 50%', href: '/sale/50' },
      { name: 'Up to 70% Off', nameId: 'Diskon Hingga 70%', href: '/sale/70' },
      { name: 'Clearance', nameId: 'Cuci Gudang', href: '/sale/clearance' },
    ],
  },
}

// Mock products for categories
const generateMockProducts = (category: string, count: number = 12) => {
  const baseProducts = [
    { name: 'Oversized Cotton Tee', nameId: 'Kaos Oversized Katun', price: 199000, originalPrice: 249000 },
    { name: 'Slim Fit Jeans', nameId: 'Jeans Slim Fit', price: 449000, originalPrice: null },
    { name: 'Casual Blazer', nameId: 'Blazer Kasual', price: 699000, originalPrice: 899000 },
    { name: 'Printed Midi Dress', nameId: 'Gaun Midi Bermotif', price: 399000, originalPrice: null },
    { name: 'Ribbed Tank Top', nameId: 'Tank Top Ribbed', price: 149000, originalPrice: 199000 },
    { name: 'Pleated Skirt', nameId: 'Rok Lipit', price: 299000, originalPrice: null },
    { name: 'Denim Jacket', nameId: 'Jaket Denim', price: 549000, originalPrice: 699000 },
    { name: 'Linen Pants', nameId: 'Celana Linen', price: 399000, originalPrice: null },
    { name: 'Cropped Cardigan', nameId: 'Kardigan Crop', price: 349000, originalPrice: 449000 },
    { name: 'Satin Blouse', nameId: 'Blus Satin', price: 299000, originalPrice: null },
    { name: 'Wide Leg Trousers', nameId: 'Celana Lebar', price: 449000, originalPrice: 549000 },
    { name: 'Knit Sweater', nameId: 'Sweater Rajut', price: 399000, originalPrice: null },
  ]

  return baseProducts.slice(0, count).map((product, i) => ({
    id: `${category}-${i + 1}`,
    slug: `${product.name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    ...product,
    rating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 500) + 50,
    soldCount: Math.floor(Math.random() * 2000) + 100,
    colors: ['Black', 'White', 'Navy', 'Beige'].slice(0, Math.floor(Math.random() * 3) + 2),
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  }))
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1e3a5f' },
  { name: 'Beige', hex: '#d4c4b0' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Pink', hex: '#ec4899' },
]

const sortOptions = [
  { value: 'popular', label: 'Most Popular', labelId: 'Terpopuler' },
  { value: 'newest', label: 'Newest', labelId: 'Terbaru' },
  { value: 'price-low', label: 'Price: Low to High', labelId: 'Harga: Rendah ke Tinggi' },
  { value: 'price-high', label: 'Price: High to Low', labelId: 'Harga: Tinggi ke Rendah' },
  { value: 'rating', label: 'Highest Rated', labelId: 'Rating Tertinggi' },
]

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const { t, language } = useTranslation()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  const config = categoryConfig[category] || categoryConfig.women
  const products = useMemo(() => generateMockProducts(category), [category])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)))
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors.some(c => selectedColors.includes(c)))
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sortBy) {
      case 'newest':
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => b.soldCount - a.soldCount)
    }

    return result
  }, [products, selectedSizes, selectedColors, priceRange, sortBy])

  const toggleWishlist = (product: typeof products[0]) => {
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

  const clearFilters = () => {
    setSelectedSizes([])
    setSelectedColors([])
    setPriceRange([0, 1000000])
  }

  const hasFilters = selectedSizes.length > 0 || selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000000

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">{t.common.home}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {language === 'id' ? config.titleId : config.title}
            </span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'id' ? config.titleId : config.title}
          </h1>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-2">
            {config.subcategories.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {language === 'id' ? sub.nameId : sub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {t.products.filters}
            </Button>

            <p className="text-sm text-muted-foreground">
              {t.products.showing} {filteredProducts.length} {t.products.productsText}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t.products.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-background"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {language === 'id' ? option.labelId : option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-background p-4 overflow-auto' : 'hidden'} lg:block lg:relative lg:w-64 lg:flex-shrink-0`}>
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{t.products.filters}</h2>
                <div className="flex items-center gap-2">
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                      {t.products.clearAll}
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{t.products.size}</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSizes(prev =>
                        prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                      )}
                      className={`px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{t.products.color}</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColors(prev =>
                        prev.includes(color.name) ? prev.filter(c => c !== color.name) : [...prev, color.name]
                      )}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColors.includes(color.name) ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">{t.products.price}</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={1000000}
                    step={50000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => setShowFilters(false)} className="w-full lg:hidden">
                {language === 'id' ? 'Terapkan Filter' : 'Apply Filters'}
              </Button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const hasDiscount = product.originalPrice && product.originalPrice > product.price
                const discountPercent = hasDiscount
                  ? Math.round((1 - product.price / product.originalPrice!) * 100)
                  : 0

                return (
                  <div key={product.id} className="group bg-background rounded-xl overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
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

                    <div className="p-3">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">
                          {language === 'id' ? product.nameId : product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                        {hasDiscount && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.originalPrice!)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          {product.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{product.soldCount.toLocaleString()} {t.products.sold}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
