import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const sortBy = searchParams.get('sort') || 'relevance'
    const inStock = searchParams.get('in_stock') === 'true'
    const onSale = searchParams.get('on_sale') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100)
    const offset = (page - 1) * limit

    const supabase = createAdminClient()

    let queryBuilder = (supabase.from('products') as any)
      .select(`
        *,
        brand:brands(id, name, slug),
        category:categories(id, name, slug),
        variants:product_variants(id, sku, size, color, color_hex, price_adjustment, stock, is_active)
      `, { count: 'exact' })
      .eq('is_active', true)

    // Full-text search on product name
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,tags.cs.{${query}}`)
    }

    // Category filter
    if (category) {
      queryBuilder = queryBuilder.eq('category:categories.slug', category)
    }

    // Price range
    if (minPrice) {
      queryBuilder = queryBuilder.gte('base_price', parseInt(minPrice))
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.lte('base_price', parseInt(maxPrice))
    }

    // On sale filter
    if (onSale) {
      queryBuilder = queryBuilder.not('sale_price', 'is', null)
    }

    // Sorting
    switch (sortBy) {
      case 'price_low':
        queryBuilder = queryBuilder.order('base_price', { ascending: true })
        break
      case 'price_high':
        queryBuilder = queryBuilder.order('base_price', { ascending: false })
        break
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
      case 'popular':
        queryBuilder = queryBuilder.order('total_sold', { ascending: false })
        break
      case 'rating':
        queryBuilder = queryBuilder.order('rating_avg', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('is_featured', { ascending: false }).order('total_sold', { ascending: false })
    }

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data: products, error, count } = await queryBuilder

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    // Post-filter: in stock (check if any variant has stock > 0)
    let filtered = products || []
    if (inStock) {
      filtered = filtered.filter((p: any) =>
        p.variants?.some((v: any) => v.stock > 0 && v.is_active)
      )
    }

    return NextResponse.json({
      products: filtered,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error: any) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    )
  }
}
