/**
 * TikTok Shop Order Management
 *
 * Handle orders received from TikTok Shop
 */

import { tiktokRequest, isTikTokShopConfigured } from './client'

type OrderStatus =
  | 'UNPAID'
  | 'ON_HOLD'
  | 'AWAITING_SHIPMENT'
  | 'AWAITING_COLLECTION'
  | 'PARTIALLY_SHIPPING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

interface TikTokOrderItem {
  sku_id: string
  sku_name: string
  product_id: string
  product_name: string
  quantity: number
  sale_price: string
  original_price: string
  seller_sku: string
  sku_image: string
}

interface TikTokOrder {
  order_id: string
  order_status: OrderStatus
  create_time: number
  update_time: number
  paid_time?: number
  buyer_message?: string
  payment_method: string
  total_amount: string
  shipping_fee: string
  discount_amount: string
  recipient: {
    name: string
    phone: string
    full_address: string
    region: string
    city: string
    district: string
    postal_code: string
  }
  items: TikTokOrderItem[]
  shipping_provider?: string
  tracking_number?: string
}

/**
 * Get order list from TikTok Shop
 */
export async function getOrders(
  status?: OrderStatus,
  page: number = 1,
  pageSize: number = 20
) {
  if (!isTikTokShopConfigured()) {
    return { orders: [], total: 0 }
  }

  const params: Record<string, string | number> = {
    page_number: page,
    page_size: pageSize,
    sort_by: 'CREATE_TIME',
    sort_type: 'DESC',
  }

  if (status) {
    params.order_status = status
  }

  const response = await tiktokRequest<{
    orders: TikTokOrder[]
    total_count: number
  }>('POST', '/api/orders/search', {}, params)

  return {
    orders: response.data?.orders || [],
    total: response.data?.total_count || 0,
  }
}

/**
 * Get order details by ID
 */
export async function getOrderDetail(orderId: string) {
  if (!isTikTokShopConfigured()) {
    return null
  }

  const response = await tiktokRequest<{
    orders: TikTokOrder[]
  }>('POST', '/api/orders/detail/query', {}, {
    order_ids: [orderId],
  })

  return response.data?.orders?.[0] || null
}

/**
 * Ship order (add tracking info)
 */
export async function shipOrder(
  orderId: string,
  trackingNumber: string,
  shippingProviderId: string
) {
  if (!isTikTokShopConfigured()) {
    return null
  }

  return tiktokRequest('POST', '/api/fulfillment/ship', {}, {
    order_id: orderId,
    tracking_number: trackingNumber,
    shipping_provider_id: shippingProviderId,
  })
}

/**
 * Get available shipping providers
 */
export async function getShippingProviders() {
  if (!isTikTokShopConfigured()) {
    return []
  }

  const response = await tiktokRequest<{
    shipping_providers: { id: string; name: string }[]
  }>('GET', '/api/logistics/shipping_providers')

  return response.data?.shipping_providers || []
}

/**
 * Cancel order (seller initiated)
 */
export async function cancelOrder(orderId: string, reason: string) {
  if (!isTikTokShopConfigured()) {
    return null
  }

  return tiktokRequest('POST', '/api/orders/cancel', {}, {
    order_id: orderId,
    cancel_reason: reason,
  })
}

/**
 * Convert TikTok order to Alyanoor order format
 */
export function convertToAlyanoorOrder(tiktokOrder: TikTokOrder) {
  return {
    id: `TT-${tiktokOrder.order_id}`,
    source: 'tiktok_shop' as const,
    externalId: tiktokOrder.order_id,
    status: mapOrderStatus(tiktokOrder.order_status),
    items: tiktokOrder.items.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      variantId: item.sku_id,
      sku: item.seller_sku,
      quantity: item.quantity,
      price: parseFloat(item.sale_price),
      originalPrice: parseFloat(item.original_price),
    })),
    subtotal: parseFloat(tiktokOrder.total_amount) - parseFloat(tiktokOrder.shipping_fee),
    shipping: parseFloat(tiktokOrder.shipping_fee),
    discount: parseFloat(tiktokOrder.discount_amount),
    total: parseFloat(tiktokOrder.total_amount),
    customer: {
      name: tiktokOrder.recipient.name,
      phone: tiktokOrder.recipient.phone,
      address: tiktokOrder.recipient.full_address,
      city: tiktokOrder.recipient.city,
      district: tiktokOrder.recipient.district,
      postalCode: tiktokOrder.recipient.postal_code,
    },
    paymentMethod: tiktokOrder.payment_method,
    notes: tiktokOrder.buyer_message,
    tracking: tiktokOrder.tracking_number
      ? {
          number: tiktokOrder.tracking_number,
          provider: tiktokOrder.shipping_provider,
        }
      : undefined,
    createdAt: new Date(tiktokOrder.create_time * 1000).toISOString(),
    updatedAt: new Date(tiktokOrder.update_time * 1000).toISOString(),
    paidAt: tiktokOrder.paid_time
      ? new Date(tiktokOrder.paid_time * 1000).toISOString()
      : undefined,
  }
}

/**
 * Map TikTok order status to Alyanoor status
 */
function mapOrderStatus(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    UNPAID: 'pending_payment',
    ON_HOLD: 'on_hold',
    AWAITING_SHIPMENT: 'processing',
    AWAITING_COLLECTION: 'ready_to_ship',
    PARTIALLY_SHIPPING: 'partially_shipped',
    IN_TRANSIT: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }

  return statusMap[status] || 'unknown'
}

/**
 * Get orders awaiting shipment (need fulfillment)
 */
export async function getPendingShipmentOrders() {
  return getOrders('AWAITING_SHIPMENT')
}

/**
 * Sync TikTok orders to Alyanoor
 */
export async function syncOrders(since?: Date) {
  if (!isTikTokShopConfigured()) {
    console.log('[TikTok Shop] Not configured, skipping order sync')
    return []
  }

  const { orders } = await getOrders(undefined, 1, 100)

  // Filter by date if provided
  const filteredOrders = since
    ? orders.filter(o => o.create_time * 1000 > since.getTime())
    : orders

  // Convert to Alyanoor format
  return filteredOrders.map(convertToAlyanoorOrder)
}
