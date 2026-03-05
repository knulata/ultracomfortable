'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getSellerByUserId(userId: string) {
  const supabase = createAdminClient()
  const { data } = await (supabase.from('sellers') as any)
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function getSellerStats(sellerId: string) {
  const supabase = createAdminClient()

  const [productsRes, ordersRes, settlementsRes, notificationsRes] = await Promise.all([
    (supabase.from('products') as any).select('id', { count: 'exact' }).eq('seller_id', sellerId).eq('is_active', true),
    (supabase.from('orders') as any)
      .select('id, total, status, created_at, order_items!inner(variant_id, quantity, price)')
      .in('status', ['paid', 'processing', 'shipped', 'delivered']),
    (supabase.from('settlements') as any).select('amount, status').eq('seller_id', sellerId),
    (supabase.from('seller_notifications') as any).select('id', { count: 'exact' }).eq('seller_id', sellerId).eq('status', 'pending'),
  ])

  const settlements = settlementsRes.data || []
  const totalSettled = settlements.filter((s: any) => s.status === 'completed').reduce((sum: number, s: any) => sum + s.amount, 0)
  const pendingSettlement = settlements.filter((s: any) => s.status === 'pending').reduce((sum: number, s: any) => sum + s.amount, 0)

  return {
    totalProducts: productsRes.count || 0,
    totalOrders: ordersRes.data?.length || 0,
    totalRevenue: (ordersRes.data || []).reduce((s: number, o: any) => s + (o.total || 0), 0),
    totalSettled,
    pendingSettlement,
    pendingNotifications: notificationsRes.count || 0,
  }
}

export async function getSellerProducts(sellerId: string) {
  const supabase = createAdminClient()

  const { data } = await (supabase.from('products') as any)
    .select(`
      id, name, slug, base_price, sale_price, is_active, total_sold, rating_avg, images,
      category:categories(name),
      variants:product_variants(id, sku, size, color, stock, is_active)
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || '',
    basePrice: p.base_price,
    salePrice: p.sale_price,
    image: p.images?.[0] || null,
    stock: (p.variants || []).reduce((s: number, v: any) => s + (v.stock || 0), 0),
    variants: p.variants?.length || 0,
    totalSold: p.total_sold,
    rating: p.rating_avg,
    isActive: p.is_active,
  }))
}

export async function createProduct(sellerId: string, productData: {
  name: string
  description: string
  categoryId: string
  basePrice: number
  salePrice?: number
  variants: { sku: string; size: string; color: string; stock: number; priceAdjustment?: number }[]
}) {
  const supabase = createAdminClient()

  const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36)

  // Get or create a default brand
  const { data: brand } = await (supabase.from('brands') as any)
    .select('id')
    .eq('slug', 'uc')
    .single()

  const { data: product, error } = await (supabase.from('products') as any)
    .insert({
      seller_id: sellerId,
      brand_id: brand?.id,
      category_id: productData.categoryId,
      name: productData.name,
      slug,
      description: productData.description,
      base_price: productData.basePrice,
      sale_price: productData.salePrice || null,
    })
    .select('id')
    .single()

  if (error) throw new Error('Gagal menambah produk: ' + error.message)

  // Create variants
  if (productData.variants.length > 0) {
    const variantRows = productData.variants.map((v) => ({
      product_id: product.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      stock: v.stock,
      price_adjustment: v.priceAdjustment || 0,
    }))

    await (supabase.from('product_variants') as any).insert(variantRows)
  }

  // Update seller product count
  await (supabase.from('sellers') as any)
    .update({ total_products: (supabase as any).rpc ? undefined : 0 })
    .eq('id', sellerId)

  return { productId: product.id }
}

export async function bulkCreateProducts(sellerId: string, products: {
  name: string
  description: string
  category: string
  basePrice: number
  salePrice?: number
  sku: string
  sizes: string
  colors: string
  stockPerVariant: number
}[]) {
  const supabase = createAdminClient()
  const results: { name: string; status: 'success' | 'error'; error?: string }[] = []

  // Get brand and categories
  const { data: brand } = await (supabase.from('brands') as any).select('id').eq('slug', 'uc').single()
  const { data: categories } = await (supabase.from('categories') as any).select('id, name, slug')

  const categoryMap = new Map((categories || []).map((c: any) => [c.slug.toLowerCase(), c.id]))

  for (const item of products) {
    try {
      const categoryId = categoryMap.get(item.category.toLowerCase())
      if (!categoryId) {
        results.push({ name: item.name, status: 'error', error: `Kategori "${item.category}" tidak ditemukan` })
        continue
      }

      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36)
      const sizes = item.sizes.split(',').map(s => s.trim()).filter(Boolean)
      const colors = item.colors.split(',').map(c => c.trim()).filter(Boolean)

      const { data: product, error } = await (supabase.from('products') as any)
        .insert({
          seller_id: sellerId,
          brand_id: brand?.id,
          category_id: categoryId,
          name: item.name,
          slug,
          description: item.description || '',
          base_price: item.basePrice,
          sale_price: item.salePrice || null,
        })
        .select('id')
        .single()

      if (error) {
        results.push({ name: item.name, status: 'error', error: error.message })
        continue
      }

      // Create variants for each size x color combo
      const variants: any[] = []
      for (const size of sizes) {
        for (const color of colors) {
          variants.push({
            product_id: product.id,
            sku: `${item.sku}-${size}-${color}`.toUpperCase().replace(/\s+/g, ''),
            size,
            color,
            stock: item.stockPerVariant,
            price_adjustment: 0,
          })
        }
      }

      if (variants.length > 0) {
        await (supabase.from('product_variants') as any).insert(variants)
      }

      results.push({ name: item.name, status: 'success' })
    } catch (err: any) {
      results.push({ name: item.name, status: 'error', error: err.message })
    }
  }

  return results
}

export async function getSellerOrders(sellerId: string) {
  const supabase = createAdminClient()

  // Get orders that contain products from this seller
  const { data: products } = await (supabase.from('products') as any)
    .select('id')
    .eq('seller_id', sellerId)

  if (!products?.length) return []

  const productIds = products.map((p: any) => p.id)

  const { data: orderItems } = await (supabase.from('order_items') as any)
    .select(`
      id, quantity, price, product_name, variant_info,
      order:orders(id, order_number, status, total, payment_method, created_at, shipping_address,
        profile:profiles(full_name, phone))
    `)
    .in('variant_id', (
      await (supabase.from('product_variants') as any).select('id').in('product_id', productIds)
    ).data?.map((v: any) => v.id) || [])

  // Group by order
  const orderMap = new Map<string, any>()
  for (const item of (orderItems || [])) {
    const order = item.order
    if (!order) continue
    if (!orderMap.has(order.id)) {
      orderMap.set(order.id, {
        ...order,
        customer: order.profile?.full_name || 'Unknown',
        customerPhone: order.profile?.phone || '',
        items: [],
        sellerTotal: 0,
      })
    }
    const mapped = orderMap.get(order.id)
    mapped.items.push({ name: item.product_name, variant: item.variant_info, qty: item.quantity, price: item.price })
    mapped.sellerTotal += item.price * item.quantity
  }

  return Array.from(orderMap.values()).sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function getSellerSettlements(sellerId: string) {
  const supabase = createAdminClient()
  const { data } = await (supabase.from('settlements') as any)
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getSellerNotifications(sellerId: string) {
  const supabase = createAdminClient()
  const { data } = await (supabase.from('seller_notifications') as any)
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(50)
  return data || []
}
