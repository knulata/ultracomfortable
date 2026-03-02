'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, SlidersHorizontal, Grid3X3, LayoutGrid, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterSidebar, MobileFilters } from '@/components/filters/FilterSidebar'
import { formatPrice } from '@/stores/cart'

// Mock products data
const mockProducts = Array.from({ length: 24 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: [
    'Oversized Cotton T-Shirt',
    'High-Waist Wide Leg Pants',
    'Floral Print Midi Dress',
    'Relaxed Fit Blazer',
    'Ribbed Knit Cardigan',
    'Pleated Tennis Skirt',
    'Cropped Denim Jacket',
    'Satin Slip Dress',
  ][i % 8],
  slug: `product-${i + 1}`,
  base_price: [149000, 299000, 399000, 549000, 249000, 199000, 449000, 349000][i % 8],
  sale_price: i % 3 === 0 ? [99000, 199000, 299000, 399000, 179000, 149000, 349000, 249000][i % 8] : null,
  images: [],
  rating_avg: 4 + Math.random(),
  rating_count: Math.floor(Math.random() * 500) + 10,
  total_sold: Math.floor(Math.random() * 2000) + 100,
  is_featured: i < 4,
}))

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

export default function ProductsPage() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [sortBy, setSortBy] = useState('popular')
  const [gridCols, setGridCols] = useState<2 | 4>(4)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterId] || []
      const isSelected = current.includes(value)

      return {
        ...prev,
        [filterId]: isSelected
          ? current.filter((v) => v !== value)
          : [...current, value],
      }
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
  }

  const totalFilters = Object.values(selectedFilters).flat().length

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
            <span className="font-medium">All Products</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Discover our collection of {mockProducts.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {totalFilters > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {totalFilters}
                  </span>
                )}
              </Button>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground hidden sm:block">
                Showing <span className="font-medium text-foreground">{mockProducts.length}</span> products
              </p>

              {/* Right Side Controls */}
              <div className="flex items-center gap-4 ml-auto">
                {/* Grid Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg">
                  <button
                    onClick={() => setGridCols(2)}
                    className={`p-2 ${gridCols === 2 ? 'bg-muted' : ''}`}
                    aria-label="2 columns"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-2 ${gridCols === 4 ? 'bg-muted' : ''}`}
                    aria-label="4 columns"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <span className="hidden sm:inline">Sort by:</span>
                    <span className="font-medium">
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {sortDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSortDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg z-20 py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value)
                              setSortDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                              sortBy === option.value ? 'text-primary font-medium' : ''
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {totalFilters > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(selectedFilters).map(([filterId, values]) =>
                  values.map((value) => (
                    <button
                      key={`${filterId}-${value}`}
                      onClick={() => handleFilterChange(filterId, value)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {value}
                      <span className="ml-1">&times;</span>
                    </button>
                  ))
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className={`grid gap-4 md:gap-6 ${
              gridCols === 2
                ? 'grid-cols-2'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {mockProducts.map((product) => {
                const hasDiscount = product.sale_price && product.sale_price < product.base_price
                const discountPercent = hasDiscount
                  ? Math.round((1 - product.sale_price! / product.base_price) * 100)
                  : 0

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 group-hover:from-primary/10 group-hover:to-primary/30 transition-colors" />

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

                      {/* Quick Add - shown on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                        <button
                          className="w-full py-2 bg-background/95 backdrop-blur text-sm font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={(e) => {
                            e.preventDefault()
                            // Quick add logic
                          }}
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
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

                      {/* Sold */}
                      <p className="text-xs text-muted-foreground">
                        {product.total_sold.toLocaleString('id-ID')} sold
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFilters
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
      />
    </div>
  )
}
