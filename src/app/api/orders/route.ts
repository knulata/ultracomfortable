import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Create order from checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userId,
      items, // [{ variantId, quantity, price, productName, variantInfo }]
      shippingAddress,
      shippingCost,
      discount,
      pointsUsed,
      subtotal,
      total,
      paymentMethod,
      notes,
    } = body

    if (!items?.length || !shippingAddress || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Generate order number
    const orderNumber = `UC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await (supabase
      .from('orders') as any)
      .insert({
        user_id: userId || null,
        order_number: orderNumber,
        status: 'pending',
        subtotal,
        shipping_cost: shippingCost || 0,
        discount: discount || 0,
        points_used: pointsUsed || 0,
        total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod || null,
        notes: notes || null,
      })
      .select('id, order_number, total, user_id')
      .single()

    if (orderError) {
      console.error('Failed to create order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      variant_id: item.variantId,
      product_name: item.productName,
      variant_info: item.variantInfo,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await (supabase
      .from('order_items') as any)
      .insert(orderItems)

    if (itemsError) {
      console.error('Failed to create order items:', itemsError)
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total,
    })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
