/**
 * TikTok Shop Webhook Handler
 *
 * Receives real-time updates for orders, products, and other events
 * Docs: https://partner.tiktokshop.com/docv2/page/tts-api-concepts-overview
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const TIKTOK_APP_SECRET = process.env.TIKTOK_SHOP_APP_SECRET || ''

// Webhook event types
type WebhookEventType =
  | 'ORDER_STATUS_CHANGE'
  | 'ORDER_PAYMENT'
  | 'ORDER_SHIPMENT'
  | 'PRODUCT_STATUS_CHANGE'
  | 'RETURN_REQUEST'
  | 'CANCELLATION_REQUEST'

interface WebhookPayload {
  type: WebhookEventType
  shop_id: string
  timestamp: number
  data: Record<string, unknown>
}

/**
 * Verify webhook signature from TikTok
 */
function verifySignature(
  payload: string,
  signature: string | null,
  timestamp: string | null
): boolean {
  if (!signature || !timestamp || !TIKTOK_APP_SECRET) {
    return false
  }

  const signString = TIKTOK_APP_SECRET + payload + timestamp + TIKTOK_APP_SECRET
  const expectedSignature = crypto
    .createHmac('sha256', TIKTOK_APP_SECRET)
    .update(signString)
    .digest('hex')

  return signature === expectedSignature
}

/**
 * Handle order status change
 */
async function handleOrderStatusChange(data: Record<string, unknown>) {
  const orderId = data.order_id as string
  const status = data.order_status as string

  console.log(`[TikTok Webhook] Order ${orderId} status changed to ${status}`)

  // TODO: Update order in Alyanoor database
  // await updateOrderStatus(orderId, status)

  // TODO: Send notification to seller if needed
  // if (status === 'AWAITING_SHIPMENT') {
  //   await notifySeller(orderId)
  // }
}

/**
 * Handle order payment confirmation
 */
async function handleOrderPayment(data: Record<string, unknown>) {
  const orderId = data.order_id as string
  const paymentId = data.payment_id as string

  console.log(`[TikTok Webhook] Order ${orderId} paid, payment ID: ${paymentId}`)

  // TODO: Update order payment status
  // TODO: Trigger fulfillment workflow
}

/**
 * Handle order shipment update
 */
async function handleOrderShipment(data: Record<string, unknown>) {
  const orderId = data.order_id as string
  const trackingNumber = data.tracking_number as string

  console.log(`[TikTok Webhook] Order ${orderId} shipped, tracking: ${trackingNumber}`)

  // TODO: Update order with tracking info
  // TODO: Send tracking notification to customer
}

/**
 * Handle product status change
 */
async function handleProductStatusChange(data: Record<string, unknown>) {
  const productId = data.product_id as string
  const status = data.status as string

  console.log(`[TikTok Webhook] Product ${productId} status changed to ${status}`)

  // TODO: Sync product status to Alyanoor
}

/**
 * Handle return request
 */
async function handleReturnRequest(data: Record<string, unknown>) {
  const orderId = data.order_id as string
  const returnId = data.return_id as string
  const reason = data.reason as string

  console.log(`[TikTok Webhook] Return requested for order ${orderId}: ${reason}`)

  // TODO: Create return request in Alyanoor
  // TODO: Notify seller
}

/**
 * Handle cancellation request
 */
async function handleCancellationRequest(data: Record<string, unknown>) {
  const orderId = data.order_id as string
  const reason = data.cancel_reason as string

  console.log(`[TikTok Webhook] Cancellation requested for order ${orderId}: ${reason}`)

  // TODO: Process cancellation in Alyanoor
  // TODO: Restore inventory if needed
}

/**
 * POST /api/webhooks/tiktok
 * Receive webhooks from TikTok Shop
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-tts-signature')
    const timestamp = request.headers.get('x-tts-timestamp')

    // Verify webhook signature (skip in development)
    if (process.env.NODE_ENV === 'production') {
      if (!verifySignature(body, signature, timestamp)) {
        console.error('[TikTok Webhook] Invalid signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const payload: WebhookPayload = JSON.parse(body)

    console.log(`[TikTok Webhook] Received event: ${payload.type}`)

    // Route to appropriate handler
    switch (payload.type) {
      case 'ORDER_STATUS_CHANGE':
        await handleOrderStatusChange(payload.data)
        break

      case 'ORDER_PAYMENT':
        await handleOrderPayment(payload.data)
        break

      case 'ORDER_SHIPMENT':
        await handleOrderShipment(payload.data)
        break

      case 'PRODUCT_STATUS_CHANGE':
        await handleProductStatusChange(payload.data)
        break

      case 'RETURN_REQUEST':
        await handleReturnRequest(payload.data)
        break

      case 'CANCELLATION_REQUEST':
        await handleCancellationRequest(payload.data)
        break

      default:
        console.log(`[TikTok Webhook] Unknown event type: ${payload.type}`)
    }

    // TikTok expects a 200 response to confirm receipt
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[TikTok Webhook] Error processing webhook:', error)

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/tiktok
 * Webhook verification endpoint (TikTok may ping this to verify URL)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')

  // Return challenge for verification
  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  return NextResponse.json({
    status: 'ok',
    message: 'TikTok Shop webhook endpoint for Alyanoor',
    configured: !!TIKTOK_APP_SECRET,
  })
}
