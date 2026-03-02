// Midtrans Payment Gateway Client
// Docs: https://docs.midtrans.com

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const BASE_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com'

const API_URL = IS_PRODUCTION
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2'

// Encode server key for Basic Auth
const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')

export interface TransactionDetails {
  order_id: string
  gross_amount: number
}

export interface CustomerDetails {
  first_name: string
  last_name?: string
  email: string
  phone: string
  billing_address?: {
    address: string
    city: string
    postal_code: string
    country_code: string
  }
  shipping_address?: {
    first_name: string
    last_name?: string
    address: string
    city: string
    postal_code: string
    phone: string
    country_code: string
  }
}

export interface ItemDetails {
  id: string
  name: string
  price: number
  quantity: number
  brand?: string
  category?: string
}

export interface SnapTokenRequest {
  transaction_details: TransactionDetails
  customer_details: CustomerDetails
  item_details: ItemDetails[]
  enabled_payments?: string[]
  callbacks?: {
    finish?: string
    error?: string
    pending?: string
  }
  expiry?: {
    start_time?: string
    unit: 'minutes' | 'hours' | 'days'
    duration: number
  }
}

export interface SnapTokenResponse {
  token: string
  redirect_url: string
}

// Indonesian payment methods
export const ENABLED_PAYMENTS = [
  // E-Wallets
  'gopay',
  'shopeepay',
  'dana',
  'ovo',
  // QRIS
  'qris',
  // Virtual Account
  'bca_va',
  'bni_va',
  'bri_va',
  'permata_va',
  'other_va',
  // Credit Card
  'credit_card',
  // Pay Later
  'akulaku',
  'kredivo',
]

/**
 * Create Snap Token for payment popup
 */
export async function createSnapToken(
  request: SnapTokenRequest
): Promise<SnapTokenResponse> {
  const response = await fetch(`${API_URL}/snap/v1/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`,
    },
    body: JSON.stringify({
      ...request,
      enabled_payments: request.enabled_payments || ENABLED_PAYMENTS,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error_messages?.[0] || 'Failed to create payment')
  }

  return response.json()
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(orderId: string) {
  const response = await fetch(`${API_URL}/${orderId}/status`, {
    headers: {
      'Authorization': `Basic ${authString}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get transaction status')
  }

  return response.json()
}

/**
 * Cancel transaction
 */
export async function cancelTransaction(orderId: string) {
  const response = await fetch(`${API_URL}/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to cancel transaction')
  }

  return response.json()
}

/**
 * Refund transaction
 */
export async function refundTransaction(orderId: string, amount?: number) {
  const body: Record<string, unknown> = {}
  if (amount) {
    body.refund_key = `refund-${orderId}-${Date.now()}`
    body.amount = amount
  }

  const response = await fetch(`${API_URL}/${orderId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Failed to refund transaction')
  }

  return response.json()
}

/**
 * Verify webhook signature
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const crypto = require('crypto')
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex')
  return hash === signatureKey
}

/**
 * Get Snap.js URL
 */
export function getSnapJsUrl(): string {
  return IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
}

/**
 * Get client key for frontend
 */
export function getClientKey(): string {
  return MIDTRANS_CLIENT_KEY
}
