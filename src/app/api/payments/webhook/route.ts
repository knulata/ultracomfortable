import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/midtrans/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderConfirmationEmail, sendOrderCancelledEmail } from '@/lib/email'
import type { Order } from '@/types/database'

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
      transaction_id,
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
    let orderStatus: Order['status']

    if (transaction_status === 'capture') {
      orderStatus = fraud_status === 'accept' ? 'paid' : 'pending'
    } else if (transaction_status === 'settlement') {
      orderStatus = 'paid'
    } else if (transaction_status === 'pending') {
      orderStatus = 'pending'
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      orderStatus = 'cancelled'
    } else if (transaction_status === 'refund') {
      orderStatus = 'refunded'
    } else {
      orderStatus = 'pending'
    }

    // Update order in Supabase (admin client bypasses RLS)
    const supabase = createAdminClient()

    // Use type assertion since admin client generic inference differs from SSR client
    const { data, error: updateError } = await (supabase
      .from('orders') as any)
      .update({
        status: orderStatus,
        payment_method: payment_type,
        payment_id: transaction_id,
      })
      .eq('order_number', order_id)
      .select('id, user_id, order_number, total')
      .single()

    if (updateError) {
      console.error('Failed to update order:', updateError)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    const order = data as { id: string; user_id: string; order_number: string; total: number } | null

    // Award points and send email on successful payment
    if (orderStatus === 'paid' && order) {
      // Award loyalty points (1 point per Rp 10,000 spent)
      const pointsEarned = Math.floor(order.total / 10000)
      if (pointsEarned > 0) {
        await (supabase.from('points_transactions') as any).insert({
          user_id: order.user_id,
          amount: pointsEarned,
          type: 'earned',
          description: `Pembelian order ${order.order_number}`,
          order_id: order.id,
        })

        // Increment user points via SQL function
        await (supabase.rpc as any)('increment_points', {
          p_user_id: order.user_id,
          p_amount: pointsEarned,
        }).then(({ error }: { error: any }) => {
          if (error) console.error('Failed to increment points:', error)
        })
      }

      // Send confirmation email
      const { data: profileData } = await (supabase
        .from('profiles') as any)
        .select('email, full_name')
        .eq('id', order.user_id)
        .single()

      const profile = profileData as { email: string | null; full_name: string | null } | null

      if (profile?.email) {
        await sendOrderConfirmationEmail({
          to: profile.email,
          orderNumber: order.order_number,
          total: order.total,
          customerName: profile.full_name || 'Pelanggan',
        }).catch((err) => console.error('Failed to send email:', err))
      }
    }

    // Send cancellation email
    if (orderStatus === 'cancelled' && order) {
      const { data: profileData } = await (supabase
        .from('profiles') as any)
        .select('email, full_name')
        .eq('id', order.user_id)
        .single()

      const profile = profileData as { email: string | null; full_name: string | null } | null

      if (profile?.email) {
        await sendOrderCancelledEmail({
          to: profile.email,
          orderNumber: order.order_number,
          customerName: profile.full_name || 'Pelanggan',
        }).catch((err) => console.error('Failed to send email:', err))
      }
    }

    console.log('Webhook processed:', {
      order_id,
      transaction_status,
      payment_type,
      orderStatus,
    })

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
