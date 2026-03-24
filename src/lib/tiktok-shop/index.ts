/**
 * TikTok Shop Integration for Alyanoor
 *
 * This module provides integration with TikTok Shop (merged with Tokopedia in Indonesia)
 * for product sync, order management, and real-time updates via webhooks.
 *
 * Setup:
 * 1. Register as a TikTok Shop seller
 * 2. Create an app in TikTok Partner Center
 * 3. Add environment variables:
 *    - TIKTOK_SHOP_APP_KEY
 *    - TIKTOK_SHOP_APP_SECRET
 *    - TIKTOK_SHOP_ACCESS_TOKEN
 *    - TIKTOK_SHOP_ID
 *    - TIKTOK_WAREHOUSE_ID (optional)
 * 4. Configure webhook URL in TikTok Partner Center:
 *    https://your-domain.com/api/webhooks/tiktok
 *
 * Docs: https://partner.tiktokshop.com/docv2/page/seller-api-overview
 */

export {
  tiktokRequest,
  isTikTokShopConfigured,
  getShopInfo,
  refreshAccessToken,
  config,
} from './client'

export {
  createProduct,
  updateProduct,
  updateStock,
  getProducts,
  syncAllProducts,
  getCategories,
} from './products'

export {
  getOrders,
  getOrderDetail,
  shipOrder,
  getShippingProviders,
  cancelOrder,
  convertToAlyanoorOrder,
  getPendingShipmentOrders,
  syncOrders,
} from './orders'
