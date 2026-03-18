'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchFilters {
  query: string
  categories: string[]
  priceRange: [number, number]
  colors: string[]
  sizes: string[]
  minRating: number
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'newest' | 'popular' | 'rating'
  inStock: boolean
  onSale: boolean
}

export interface SearchProduct {
  id: string
  slug: string
  name: string
  nameId: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  categoryId: string
  colors: string[]
  sizes: string[]
  rating: number
  reviewCount: number
  soldCount: number
  isNew: boolean
  inStock: boolean
  createdAt: number
}

interface SearchState {
  filters: SearchFilters
  recentSearches: string[]
  searchResults: SearchProduct[]
  isSearching: boolean

  // Actions
  setQuery: (query: string) => void
  setFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
  addRecentSearch: (query: string) => void
  removeRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  search: () => SearchProduct[]
}

const defaultFilters: SearchFilters = {
  query: '',
  categories: [],
  priceRange: [0, 2000000],
  colors: [],
  sizes: [],
  minRating: 0,
  sortBy: 'relevance',
  inStock: false,
  onSale: false,
}

// Available filter options
export const filterOptions = {
  categories: [
    { id: 'tops', name: 'Tops', nameId: 'Atasan' },
    { id: 'bottoms', name: 'Bottoms', nameId: 'Bawahan' },
    { id: 'dresses', name: 'Dresses', nameId: 'Gaun' },
    { id: 'outerwear', name: 'Outerwear', nameId: 'Pakaian Luar' },
    { id: 'accessories', name: 'Accessories', nameId: 'Aksesoris' },
  ],
  colors: [
    { id: 'black', name: 'Black', nameId: 'Hitam', hex: '#000000' },
    { id: 'white', name: 'White', nameId: 'Putih', hex: '#FFFFFF' },
    { id: 'beige', name: 'Beige', nameId: 'Krem', hex: '#F5F5DC' },
    { id: 'navy', name: 'Navy', nameId: 'Biru Navy', hex: '#000080' },
    { id: 'gray', name: 'Gray', nameId: 'Abu-abu', hex: '#808080' },
    { id: 'brown', name: 'Brown', nameId: 'Coklat', hex: '#8B4513' },
    { id: 'pink', name: 'Pink', nameId: 'Merah Muda', hex: '#FFC0CB' },
    { id: 'blue', name: 'Blue', nameId: 'Biru', hex: '#0000FF' },
    { id: 'green', name: 'Green', nameId: 'Hijau', hex: '#008000' },
    { id: 'red', name: 'Red', nameId: 'Merah', hex: '#FF0000' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  sortOptions: [
    { id: 'relevance', name: 'Most Relevant', nameId: 'Paling Relevan' },
    { id: 'popular', name: 'Most Popular', nameId: 'Paling Populer' },
    { id: 'newest', name: 'Newest', nameId: 'Terbaru' },
    { id: 'price_low', name: 'Price: Low to High', nameId: 'Harga: Rendah ke Tinggi' },
    { id: 'price_high', name: 'Price: High to Low', nameId: 'Harga: Tinggi ke Rendah' },
    { id: 'rating', name: 'Highest Rated', nameId: 'Rating Tertinggi' },
  ],
}

// Mock search products
const mockSearchProducts: SearchProduct[] = [
  {
    id: 'sp-1',
    slug: 'oversized-cotton-tee-white',
    name: 'Oversized Cotton Tee',
    nameId: 'Kaos Oversized Katun',
    price: 199000,
    originalPrice: 249000,
    category: 'Tops',
    categoryId: 'tops',
    colors: ['white', 'black', 'beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviewCount: 234,
    soldCount: 1250,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-2',
    slug: 'high-waist-wide-leg-jeans',
    name: 'High Waist Wide Leg Jeans',
    nameId: 'Jeans Wide Leg High Waist',
    price: 449000,
    category: 'Bottoms',
    categoryId: 'bottoms',
    colors: ['blue', 'black'],
    sizes: ['S', 'M', 'L'],
    rating: 4.6,
    reviewCount: 189,
    soldCount: 890,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-3',
    slug: 'floral-midi-dress',
    name: 'Floral Midi Dress',
    nameId: 'Dress Midi Bunga',
    price: 399000,
    originalPrice: 499000,
    category: 'Dresses',
    categoryId: 'dresses',
    colors: ['pink', 'blue', 'white'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviewCount: 312,
    soldCount: 2100,
    isNew: true,
    inStock: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-4',
    slug: 'cropped-cardigan-beige',
    name: 'Cropped Cardigan',
    nameId: 'Kardigan Crop',
    price: 349000,
    originalPrice: 449000,
    category: 'Outerwear',
    categoryId: 'outerwear',
    colors: ['beige', 'gray', 'pink'],
    sizes: ['S', 'M', 'L'],
    rating: 4.7,
    reviewCount: 156,
    soldCount: 678,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-5',
    slug: 'pleated-mini-skirt',
    name: 'Pleated Mini Skirt',
    nameId: 'Rok Mini Lipit',
    price: 279000,
    category: 'Bottoms',
    categoryId: 'bottoms',
    colors: ['black', 'navy', 'gray'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.5,
    reviewCount: 98,
    soldCount: 430,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-6',
    slug: 'linen-blazer-cream',
    name: 'Linen Blazer',
    nameId: 'Blazer Linen',
    price: 599000,
    originalPrice: 749000,
    category: 'Outerwear',
    categoryId: 'outerwear',
    colors: ['beige', 'white', 'black'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviewCount: 87,
    soldCount: 345,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-7',
    slug: 'satin-slip-dress',
    name: 'Satin Slip Dress',
    nameId: 'Dress Satin',
    price: 449000,
    category: 'Dresses',
    categoryId: 'dresses',
    colors: ['black', 'pink', 'navy'],
    sizes: ['XS', 'S', 'M'],
    rating: 4.9,
    reviewCount: 203,
    soldCount: 567,
    isNew: true,
    inStock: true,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-8',
    slug: 'vintage-denim-jacket',
    name: 'Vintage Denim Jacket',
    nameId: 'Jaket Denim Vintage',
    price: 549000,
    category: 'Outerwear',
    categoryId: 'outerwear',
    colors: ['blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewCount: 167,
    soldCount: 456,
    isNew: false,
    inStock: false,
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-9',
    slug: 'ribbed-tank-top',
    name: 'Ribbed Tank Top',
    nameId: 'Tank Top Ribbed',
    price: 149000,
    category: 'Tops',
    categoryId: 'tops',
    colors: ['white', 'black', 'beige', 'gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.4,
    reviewCount: 289,
    soldCount: 1890,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-10',
    slug: 'canvas-tote-bag',
    name: 'Canvas Tote Bag',
    nameId: 'Tas Tote Kanvas',
    price: 199000,
    category: 'Accessories',
    categoryId: 'accessories',
    colors: ['beige', 'black', 'navy'],
    sizes: [],
    rating: 4.6,
    reviewCount: 145,
    soldCount: 678,
    isNew: true,
    inStock: true,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-11',
    slug: 'wrap-blouse-white',
    name: 'Wrap Blouse',
    nameId: 'Blus Wrap',
    price: 299000,
    originalPrice: 379000,
    category: 'Tops',
    categoryId: 'tops',
    colors: ['white', 'pink', 'blue'],
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.7,
    reviewCount: 178,
    soldCount: 923,
    isNew: false,
    inStock: true,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'sp-12',
    slug: 'maxi-skirt-floral',
    name: 'Floral Maxi Skirt',
    nameId: 'Rok Maxi Bunga',
    price: 379000,
    category: 'Bottoms',
    categoryId: 'bottoms',
    colors: ['pink', 'blue', 'green'],
    sizes: ['S', 'M', 'L'],
    rating: 4.5,
    reviewCount: 112,
    soldCount: 534,
    isNew: true,
    inStock: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
]

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      recentSearches: ['oversized tee', 'jeans', 'dress', 'cardigan'],
      searchResults: [],
      isSearching: false,

      setQuery: (query) => {
        set((state) => ({
          filters: { ...state.filters, query },
        }))
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }))
      },

      resetFilters: () => {
        set((state) => ({
          filters: { ...defaultFilters, query: state.filters.query },
        }))
      },

      addRecentSearch: (query) => {
        if (!query.trim()) return
        set((state) => {
          const filtered = state.recentSearches.filter(
            (s) => s.toLowerCase() !== query.toLowerCase()
          )
          return {
            recentSearches: [query, ...filtered].slice(0, 10),
          }
        })
      },

      removeRecentSearch: (query) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        }))
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] })
      },

      search: () => {
        const { filters } = get()
        let results = [...mockSearchProducts]

        // Filter by query
        if (filters.query) {
          const query = filters.query.toLowerCase()
          results = results.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.nameId.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query)
          )
        }

        // Filter by categories
        if (filters.categories.length > 0) {
          results = results.filter((p) =>
            filters.categories.includes(p.categoryId)
          )
        }

        // Filter by price range
        results = results.filter(
          (p) =>
            p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        )

        // Filter by colors
        if (filters.colors.length > 0) {
          results = results.filter((p) =>
            p.colors.some((c) => filters.colors.includes(c))
          )
        }

        // Filter by sizes
        if (filters.sizes.length > 0) {
          results = results.filter((p) =>
            p.sizes.some((s) => filters.sizes.includes(s))
          )
        }

        // Filter by minimum rating
        if (filters.minRating > 0) {
          results = results.filter((p) => p.rating >= filters.minRating)
        }

        // Filter by in stock
        if (filters.inStock) {
          results = results.filter((p) => p.inStock)
        }

        // Filter by on sale
        if (filters.onSale) {
          results = results.filter((p) => p.originalPrice !== undefined)
        }

        // Sort results
        switch (filters.sortBy) {
          case 'price_low':
            results.sort((a, b) => a.price - b.price)
            break
          case 'price_high':
            results.sort((a, b) => b.price - a.price)
            break
          case 'newest':
            results.sort((a, b) => b.createdAt - a.createdAt)
            break
          case 'popular':
            results.sort((a, b) => b.soldCount - a.soldCount)
            break
          case 'rating':
            results.sort((a, b) => b.rating - a.rating)
            break
          case 'relevance':
          default:
            // Keep original order for relevance (would be API-determined in real app)
            break
        }

        return results
      },
    }),
    {
      name: 'alyanoor-search',
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
)

// Helper to get active filter count
export function getActiveFilterCount(filters: SearchFilters): number {
  let count = 0
  if (filters.categories.length > 0) count++
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000) count++
  if (filters.colors.length > 0) count++
  if (filters.sizes.length > 0) count++
  if (filters.minRating > 0) count++
  if (filters.inStock) count++
  if (filters.onSale) count++
  return count
}
