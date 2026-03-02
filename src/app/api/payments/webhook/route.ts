import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/midtrans/client'

// Midtrans webhook notification handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      serverKey,
      signature_key
    )

    if (!isValid) {
      console.error('Invalid webhook signature for order:', order_id)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Process based on transaction status
    let orderStatus: string

    if (transaction_status === 'capture') {
      // Credit card payment
      if (fraud_status === 'accept') {
        orderStatus = 'paid'
      } else {
        orderStatus = 'pending'
      }
    } else if (transaction_status === 'settlement') {
      // Payment settled (e-wallet, VA, etc.)
      orderStatus = 'paid'
    } else if (transaction_status === 'pending') {
      // Waiting for payment
      orderStatus = 'pending'
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      // Payment failed
      orderStatus = 'cancelled'
    } else if (transaction_status === 'refund') {
      orderStatus = 'refunded'
    } else {
      orderStatus = 'pending'
    }

    // Update order in database
    // In production, this would update Supabase
    console.log('Webhook received:', {
      order_id,
      transaction_status,
      payment_type,
      orderStatus,
    })

    // TODO: Update order status in Supabase
    // const supabase = createClient()
    // await supabase
    //   .from('orders')
    //   .update({
    //     status: orderStatus,
    //     payment_method: payment_type,
    //     payment_id: transaction_id,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('order_number', order_id)

    // TODO: Send notification email
    // if (orderStatus === 'paid') {
    //   await sendOrderConfirmationEmail(order_id)
    // }

    return NextResponse.json({ status: 'ok' })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Midtrans may also send GET requests to verify endpoint
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' })
}
