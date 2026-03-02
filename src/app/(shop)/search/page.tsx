'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { useWishlistStore } from '@/stores/wishlist'
import { toast } from 'sonner'

// Mock products for search
const allProducts = [
  { id: '1', name: 'Oversized Cotton Tee', nameId: 'Kaos Oversized Katun', category: 'women', price: 199000, originalPrice: 249000 },
  { id: '2', name: 'Slim Fit Jeans', nameId: 'Jeans Slim Fit', category: 'men', price: 449000, originalPrice: null },
  { id: '3', name: 'Casual Blazer', nameId: 'Blazer Kasual', category: 'women', price: 699000, originalPrice: 899000 },
  { id: '4', name: 'Printed Midi Dress', nameId: 'Gaun Midi Bermotif', category: 'women', price: 399000, originalPrice: null },
  { id: '5', name: 'Ribbed Tank Top', nameId: 'Tank Top Ribbed', category: 'women', price: 149000, originalPrice: 199000 },
  { id: '6', name: 'Pleated Skirt', nameId: 'Rok Lipit', category: 'women', price: 299000, originalPrice: null },
  { id: '7', name: 'Denim Jacket', nameId: 'Jaket Denim', category: 'men', price: 549000, originalPrice: 699000 },
  { id: '8', name: 'Linen Pants', nameId: 'Celana Linen', category: 'men', price: 399000, originalPrice: null },
  { id: '9', name: 'Cropped Cardigan', nameId: 'Kardigan Crop', category: 'women', price: 349000, originalPrice: 449000 },
  { id: '10', name: 'Satin Blouse', nameId: 'Blus Satin', category: 'women', price: 299000, originalPrice: null },
  { id: '11', name: 'Wide Leg Trousers', nameId: 'Celana Lebar', category: 'women', price: 449000, originalPrice: 549000 },
  { id: '12', name: 'Knit Sweater', nameId: 'Sweater Rajut', category: 'men', price: 399000, originalPrice: null },
  { id: '13', name: 'Kids Cotton Dress', nameId: 'Gaun Katun Anak', category: 'kids', price: 199000, originalPrice: 249000 },
  { id: '14', name: 'Boys Polo Shirt', nameId: 'Kaos Polo Anak', category: 'kids', price: 149000, originalPrice: null },
  { id: '15', name: 'Lip Tint Set', nameId: 'Set Lip Tint', category: 'beauty', price: 159000, originalPrice: 199000 },
  { id: '16', name: 'Face Serum', nameId: 'Serum Wajah', category: 'beauty', price: 299000, originalPrice: null },
  { id: '17', name: 'Leather Tote Bag', nameId: 'Tas Tote Kulit', category: 'lifestyle', price: 599000, originalPrice: 799000 },
  { id: '18', name: 'Silver Hoop Earrings', nameId: 'Anting Hoop Silver', category: 'lifestyle', price: 129000, originalPrice: null },
].map(p => ({
  ...p,
  slug: p.name.toLowerCase().replace(/\s+/g, '-'),
  rating: 4 + Math.random(),
  soldCount: Math.floor(Math.random() * 2000) + 100,
}))

const popularSearches = [
  { en: 'dress', id: 'gaun' },
  { en: 'blazer', id: 'blazer' },
  { en: 'jeans', id: 'jeans' },
  { en: 'sweater', id: 'sweater' },
  { en: 'bag', id: 'tas' },
  { en: 'skincare', id: 'skincare' },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const { t, language } = useTranslation()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Filter products based on search query
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return []

    const searchTerms = debouncedQuery.toLowerCase().split(' ')
    return allProducts.filter(product => {
      const searchText = `${product.name} ${product.nameId} ${product.category}`.toLowerCase()
      return searchTerms.every(term => searchText.includes(term))
    })
  }, [debouncedQuery])

  const toggleWishlist = (product: typeof allProducts[0]) => {
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Search Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari produk...' : 'Search products...'}
              className="w-full pl-12 pr-12 py-3 border rounded-full bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* No query - show popular searches */}
        {!debouncedQuery.trim() && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Pencarian Populer' : 'Popular Searches'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search.en}
                  onClick={() => setQuery(language === 'id' ? search.id : search.en)}
                  className="px-4 py-2 bg-background border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {language === 'id' ? search.id : search.en}
                </button>
              ))}
            </div>

            {/* Recent Searches - could be stored in localStorage */}
            <h2 className="text-lg font-semibold mt-8 mb-4">
              {language === 'id' ? 'Kategori' : 'Categories'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Women', nameId: 'Wanita', href: '/women' },
                { name: 'Men', nameId: 'Pria', href: '/men' },
                { name: 'Kids', nameId: 'Anak', href: '/kids' },
                { name: 'Beauty', nameId: 'Kecantikan', href: '/beauty' },
                { name: 'Lifestyle', nameId: 'Gaya Hidup', href: '/lifestyle' },
                { name: 'Sale', nameId: 'Diskon', href: '/sale' },
              ].map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="p-4 bg-background rounded-xl text-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {language === 'id' ? cat.nameId : cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {debouncedQuery.trim() && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {results.length} {language === 'id' ? 'hasil untuk' : 'results for'} "{debouncedQuery}"
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {language === 'id' ? 'Tidak ada hasil' : 'No results found'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {language === 'id'
                    ? `Coba kata kunci lain atau jelajahi kategori kami`
                    : `Try different keywords or browse our categories`
                  }
                </p>
                <Button asChild>
                  <Link href="/products">{language === 'id' ? 'Lihat Semua Produk' : 'View All Products'}</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((product) => {
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
