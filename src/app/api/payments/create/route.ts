import { NextRequest, NextResponse } from 'next/server'
import { createSnapToken, ENABLED_PAYMENTS } from '@/lib/midtrans/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
    } = body

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Snap token
    const snapResponse = await createSnapToken({
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerName?.split(' ')[0] || 'Customer',
        last_name: customerName?.split(' ').slice(1).join(' ') || '',
        email: customerEmail,
        phone: customerPhone,
        shipping_address: shippingAddress ? {
          first_name: shippingAddress.name?.split(' ')[0] || '',
          last_name: shippingAddress.name?.split(' ').slice(1).join(' ') || '',
          address: shippingAddress.address || '',
          city: shippingAddress.city || '',
          postal_code: shippingAddress.postalCode || '',
          phone: customerPhone,
          country_code: 'IDN',
        } : undefined,
      },
      item_details: items?.map((item: any) => ({
        id: item.id,
        name: item.name.slice(0, 50), // Midtrans limit
        price: item.price,
        quantity: item.quantity,
        brand: 'AlyaNoor',
        category: item.category || 'Fashion',
      })) || [{
        id: orderId,
        name: 'UC Order',
        price: amount,
        quantity: 1,
      }],
      enabled_payments: ENABLED_PAYMENTS,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${orderId}`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order_id=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?order_id=${orderId}`,
      },
      expiry: {
        unit: 'hours',
        duration: 24,
      },
    })

    return NextResponse.json({
      token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
    })

  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}
