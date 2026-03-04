import { describe, it, expect, beforeEach } from 'vitest'
import { useSearchStore, getActiveFilterCount } from '@/stores/search'

describe('Search Store', () => {
  beforeEach(() => {
    useSearchStore.getState().resetFilters()
    useSearchStore.getState().setQuery('')
  })

  it('returns all products with no filters', () => {
    const results = useSearchStore.getState().search()
    expect(results.length).toBeGreaterThan(0)
  })

  it('filters by text query', () => {
    useSearchStore.getState().setQuery('tee')
    const results = useSearchStore.getState().search()
    expect(results.every(p =>
      p.name.toLowerCase().includes('tee') ||
      p.nameId.toLowerCase().includes('tee')
    )).toBe(true)
  })

  it('filters by category', () => {
    useSearchStore.getState().setFilters({ categories: ['tops'] })
    const results = useSearchStore.getState().search()
    expect(results.every(p => p.categoryId === 'tops')).toBe(true)
  })

  it('filters by price range', () => {
    useSearchStore.getState().setFilters({ priceRange: [100000, 300000] })
    const results = useSearchStore.getState().search()
    expect(results.every(p => p.price >= 100000 && p.price <= 300000)).toBe(true)
  })

  it('filters by color', () => {
    useSearchStore.getState().setFilters({ colors: ['black'] })
    const results = useSearchStore.getState().search()
    expect(results.every(p => p.colors.includes('black'))).toBe(true)
  })

  it('filters by size', () => {
    useSearchStore.getState().setFilters({ sizes: ['XS'] })
    const results = useSearchStore.getState().search()
    expect(results.every(p => p.sizes.includes('XS'))).toBe(true)
  })

  it('filters in-stock only', () => {
    useSearchStore.getState().setFilters({ inStock: true })
    const results = useSearchStore.getState().search()
    expect(results.every(p => p.inStock)).toBe(true)
  })

  it('filters on-sale only', () => {
    useSearchStore.getState().setFilters({ onSale: true })
    const results = useSearchStore.getState().search()
    expect(results.every(p => p.originalPrice !== undefined)).toBe(true)
  })

  it('sorts by price low to high', () => {
    useSearchStore.getState().setFilters({ sortBy: 'price_low' })
    const results = useSearchStore.getState().search()
    for (let i = 1; i < results.length; i++) {
      expect(results[i].price).toBeGreaterThanOrEqual(results[i - 1].price)
    }
  })

  it('sorts by price high to low', () => {
    useSearchStore.getState().setFilters({ sortBy: 'price_high' })
    const results = useSearchStore.getState().search()
    for (let i = 1; i < results.length; i++) {
      expect(results[i].price).toBeLessThanOrEqual(results[i - 1].price)
    }
  })

  it('sorts by rating', () => {
    useSearchStore.getState().setFilters({ sortBy: 'rating' })
    const results = useSearchStore.getState().search()
    for (let i = 1; i < results.length; i++) {
      expect(results[i].rating).toBeLessThanOrEqual(results[i - 1].rating)
    }
  })

  it('manages recent searches', () => {
    useSearchStore.getState().addRecentSearch('test query')
    expect(useSearchStore.getState().recentSearches).toContain('test query')

    useSearchStore.getState().removeRecentSearch('test query')
    expect(useSearchStore.getState().recentSearches).not.toContain('test query')
  })

  it('limits recent searches to 10', () => {
    for (let i = 0; i < 15; i++) {
      useSearchStore.getState().addRecentSearch(`search ${i}`)
    }
    expect(useSearchStore.getState().recentSearches.length).toBeLessThanOrEqual(10)
  })
})

describe('getActiveFilterCount', () => {
  it('returns 0 for default filters', () => {
    const count = getActiveFilterCount({
      query: '',
      categories: [],
      priceRange: [0, 2000000],
      colors: [],
      sizes: [],
      minRating: 0,
      sortBy: 'relevance',
      inStock: false,
      onSale: false,
    })
    expect(count).toBe(0)
  })

  it('counts active filters', () => {
    const count = getActiveFilterCount({
      query: 'test',
      categories: ['tops'],
      priceRange: [100000, 500000],
      colors: ['black'],
      sizes: [],
      minRating: 4,
      sortBy: 'price_low',
      inStock: true,
      onSale: false,
    })
    expect(count).toBe(5) // categories, priceRange, colors, minRating, inStock
  })
})
