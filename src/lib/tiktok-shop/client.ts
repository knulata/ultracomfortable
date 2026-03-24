/**
 * TikTok Shop API Client for Alyanoor
 *
 * Integration with TikTok Shop (merged with Tokopedia in Indonesia)
 * Docs: https://partner.tiktokshop.com/docv2/page/seller-api-overview
 */

import crypto from 'crypto'

// Environment variables
const TIKTOK_APP_KEY = process.env.TIKTOK_SHOP_APP_KEY || ''
const TIKTOK_APP_SECRET = process.env.TIKTOK_SHOP_APP_SECRET || ''
const TIKTOK_SHOP_ID = process.env.TIKTOK_SHOP_ID || ''
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_SHOP_ACCESS_TOKEN || ''

const API_VERSION = '202309'
const BASE_URL = 'https://open-api.tiktokglobalshop.com'

interface TikTokResponse<T> {
  code: number
  message: string
  data: T
  request_id: string
}

interface SignParams {
  [key: string]: string | number | undefined
}

/**
 * Generate signature for TikTok Shop API requests
 */
function generateSignature(
  path: string,
  params: SignParams,
  body?: string
): string {
  // Sort parameters alphabetically
  const sortedKeys = Object.keys(params).sort()

  // Build string to sign
  let signString = TIKTOK_APP_SECRET + path

  for (const key of sortedKeys) {
    if (params[key] !== undefined) {
      signString += key + String(params[key])
    }
  }

  if (body) {
    signString += body
  }

  signString += TIKTOK_APP_SECRET

  // Generate HMAC-SHA256 signature
  return crypto
    .createHmac('sha256', TIKTOK_APP_SECRET)
    .update(signString)
    .digest('hex')
}

/**
 * Make authenticated request to TikTok Shop API
 */
export async function tiktokRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  params: SignParams = {},
  body?: object
): Promise<TikTokResponse<T>> {
  const timestamp = Math.floor(Date.now() / 1000)

  const queryParams: SignParams = {
    app_key: TIKTOK_APP_KEY,
    timestamp,
    shop_id: TIKTOK_SHOP_ID,
    access_token: TIKTOK_ACCESS_TOKEN,
    version: API_VERSION,
    ...params,
  }

  const bodyString = body ? JSON.stringify(body) : undefined
  const signature = generateSignature(path, queryParams, bodyString)

  queryParams.sign = signature

  const queryString = Object.entries(queryParams)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&')

  const url = `${BASE_URL}${path}?${queryString}`

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-tts-access-token': TIKTOK_ACCESS_TOKEN,
    },
    body: bodyString,
  })

  if (!response.ok) {
    throw new Error(`TikTok API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Check if TikTok Shop integration is configured
 */
export function isTikTokShopConfigured(): boolean {
  return !!(TIKTOK_APP_KEY && TIKTOK_APP_SECRET && TIKTOK_ACCESS_TOKEN)
}

/**
 * Get shop information
 */
export async function getShopInfo() {
  return tiktokRequest<{
    shop_id: string
    shop_name: string
    region: string
    seller_type: string
  }>('GET', '/api/shop/get_authorized_shop')
}

/**
 * Refresh access token (should be done every 24 hours)
 */
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${BASE_URL}/api/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_key: TIKTOK_APP_KEY,
      app_secret: TIKTOK_APP_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  return response.json()
}

// Export configuration check
export const config = {
  isConfigured: isTikTokShopConfigured(),
  appKey: TIKTOK_APP_KEY ? '***configured***' : 'not set',
  shopId: TIKTOK_SHOP_ID || 'not set',
}
