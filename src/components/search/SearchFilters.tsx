'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Filter, RotateCcw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useSearchStore, filterOptions, getActiveFilterCount } from '@/stores/search'
import { formatPrice } from '@/stores/cart'

interface SearchFiltersProps {
  variant?: 'sidebar' | 'drawer'
  onClose?: () => void
}

export function SearchFilters({ variant = 'sidebar', onClose }: SearchFiltersProps) {
  const { language } = useTranslation()
  const { filters, setFilters, resetFilters } = useSearchStore()

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'categories',
    'price',
    'colors',
    'sizes',
  ])

  const activeFilterCount = getActiveFilterCount(filters)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const isExpanded = (section: string) => expandedSections.includes(section)

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]
    setFilters({ categories: newCategories })
  }

  const handleColorChange = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter((c) => c !== colorId)
      : [...filters.colors, colorId]
    setFilters({ colors: newColors })
  }

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size]
    setFilters({ sizes: newSizes })
  }

  const handlePriceChange = (min: number, max: number) => {
    setFilters({ priceRange: [min, max] })
  }

  const handleRatingChange = (rating: number) => {
    setFilters({ minRating: filters.minRating === rating ? 0 : rating })
  }

  return (
    <div className={`bg-background ${variant === 'drawer' ? 'h-full flex flex-col' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold">
            {language === 'id' ? 'Filter' : 'Filters'}
          </h2>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              {language === 'id' ? 'Reset' : 'Reset'}
            </button>
          )}
          {variant === 'drawer' && onClose && (
            <button onClick={onClose} className="p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className={`${variant === 'drawer' ? 'flex-1 overflow-y-auto' : ''} divide-y`}>
        {/* Categories */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium">
              {language === 'id' ? 'Kategori' : 'Categories'}
            </span>
            {isExpanded('categories') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isExpanded('categories') && (
            <div className="space-y-2">
              {filterOptions.categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">
                    {language === 'id' ? category.nameId : category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium">
              {language === 'id' ? 'Harga' : 'Price'}
            </span>
            {isExpanded('price') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isExpanded('price') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange(Number(e.target.value), filters.priceRange[1])
                  }
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange(filters.priceRange[0], Number(e.target.value))
                  }
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '< 100K', min: 0, max: 100000 },
                  { label: '100K - 300K', min: 100000, max: 300000 },
                  { label: '300K - 500K', min: 300000, max: 500000 },
                  { label: '> 500K', min: 500000, max: 2000000 },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceChange(range.min, range.max)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      filters.priceRange[0] === range.min &&
                      filters.priceRange[1] === range.max
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:border-primary'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium">
              {language === 'id' ? 'Warna' : 'Colors'}
            </span>
            {isExpanded('colors') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isExpanded('colors') && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    filters.colors.includes(color.id)
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={language === 'id' ? color.nameId : color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('sizes')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium">
              {language === 'id' ? 'Ukuran' : 'Sizes'}
            </span>
            {isExpanded('sizes') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isExpanded('sizes') && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                    filters.sizes.includes(size)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="p-4">
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium">
              {language === 'id' ? 'Rating' : 'Rating'}
            </span>
            {isExpanded('rating') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isExpanded('rating') && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                    filters.minRating === rating
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {rating}+ {language === 'id' ? 'ke atas' : '& up'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Other Filters */}
        <div className="p-4 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters({ inStock: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">
              {language === 'id' ? 'Stok tersedia' : 'In stock only'}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => setFilters({ onSale: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">
              {language === 'id' ? 'Sedang diskon' : 'On sale'}
            </span>
          </label>
        </div>
      </div>

      {/* Apply Button (for drawer variant) */}
      {variant === 'drawer' && (
        <div className="p-4 border-t">
          <Button className="w-full" onClick={onClose}>
            {language === 'id'
              ? `Tampilkan Hasil`
              : `Show Results`}
          </Button>
        </div>
      )}
    </div>
  )
}
