'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function getAdminStats() {
  const supabase = createAdminClient()

  const [ordersRes, productsRes, resellersRes, revenueRes] = await Promise.all([
    (supabase.from('orders') as any).select('id, status', { count: 'exact' }),
    (supabase.from('products') as any).select('id', { count: 'exact' }).eq('is_active', true),
    (supabase.from('resellers') as any).select('id, status', { count: 'exact' }),
    (supabase.from('orders') as any).select('total').in('status', ['paid', 'processing', 'shipped', 'delivered']),
  ])

  const orders = ordersRes.data || []
  const totalRevenue = (revenueRes.data || []).reduce((s: number, o: any) => s + (o.total || 0), 0)
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
  const resellers = resellersRes.data || []
  const pendingResellers = resellers.filter((r: any) => r.status === 'pending').length

  return {
    totalOrders: ordersRes.count || 0,
    pendingOrders,
    totalRevenue,
    totalProducts: productsRes.count || 0,
    totalResellers: resellers.filter((r: any) => r.status === 'approved').length,
    pendingResellers,
  }
}

export async function getRecentOrders(limit = 10) {
  const supabase = createAdminClient()

  const { data } = await (supabase.from('orders') as any)
    .select('id, order_number, user_id, total, status, payment_method, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data || []).map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    customer: o.profiles?.full_name || 'Unknown',
    email: o.profiles?.email || '',
    total: o.total,
    status: o.status,
    paymentMethod: o.payment_method || '-',
    createdAt: o.created_at,
  }))
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('orders') as any)
    .update({ status })
    .eq('id', orderId)

  if (error) throw new Error('Failed to update order status')
  return { success: true }
}

export async function getAdminProducts() {
  const supabase = createAdminClient()

  const { data } = await (supabase.from('products') as any)
    .select(`
      id, name, slug, base_price, sale_price, is_active, is_featured, total_sold, rating_avg,
      category:categories(name),
      variants:product_variants(stock)
    `)
    .order('created_at', { ascending: false })

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || '',
    basePrice: p.base_price,
    salePrice: p.sale_price,
    stock: (p.variants || []).reduce((s: number, v: any) => s + (v.stock || 0), 0),
    totalSold: p.total_sold,
    rating: p.rating_avg,
    isActive: p.is_active,
    isFeatured: p.is_featured,
  }))
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = createAdminClient()

  const { error } = await (supabase.from('products') as any)
    .update({ is_active: isActive })
    .eq('id', productId)

  if (error) throw new Error('Failed to update product')
  return { success: true }
}

export async function getAdminResellers() {
  const supabase = createAdminClient()

  const { data } = await (supabase.from('resellers') as any)
    .select(`
      id, business_name, phone, whatsapp, city, tier_id, status, total_orders, total_spent, created_at,
      profile:profiles(full_name, email)
    `)
    .order('created_at', { ascending: false })

  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.profile?.full_name || '',
    businessName: r.business_name,
    email: r.profile?.email || '',
    phone: r.phone,
    whatsapp: r.whatsapp,
    city: r.city,
    tier: r.tier_id,
    status: r.status,
    totalOrders: r.total_orders,
    totalSpent: r.total_spent,
    joinedAt: r.created_at,
  }))
}

export async function updateResellerStatus(resellerId: string, status: 'approved' | 'rejected' | 'suspended') {
  const supabase = createAdminClient()

  const discountMap = { approved: 5, rejected: 0, suspended: 0 }
  const { error } = await (supabase.from('resellers') as any)
    .update({ status, discount_percent: discountMap[status] })
    .eq('id', resellerId)

  if (error) throw new Error('Failed to update reseller')
  return { success: true }
}
