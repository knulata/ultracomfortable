/**
 * TikTok Shop Product Sync
 *
 * Sync Alyanoor products to TikTok Shop catalog
 */

import { tiktokRequest, isTikTokShopConfigured } from './client'

interface TikTokProduct {
  product_id?: string
  product_name: string
  description: string
  category_id: string
  brand_id?: string
  images: { url: string }[]
  skus: TikTokSKU[]
  package_weight: { value: string; unit: string }
  package_dimensions?: {
    length: string
    width: string
    height: string
    unit: string
  }
}

interface TikTokSKU {
  sku_id?: string
  seller_sku: string
  original_price: string
  sales_attributes?: { attribute_id: string; value_id: string }[]
  stock_info: { warehouse_id: string; available_stock: number }[]
}

interface AlyanoorProduct {
  id: string
  slug: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  category: string
  sizes: string[]
  colors: string[]
  images?: string[]
  stock?: number
}

// TikTok Shop category mapping for modest fashion
const CATEGORY_MAP: Record<string, string> = {
  hijab: '601352', // Women's Scarves & Wraps (example ID)
  gamis: '601201', // Women's Dresses
  khimar: '601352', // Women's Scarves & Wraps
  mukena: '601399', // Women's Religious Clothing
  tops: '601101', // Women's Tops
  bottoms: '601102', // Women's Bottoms
  dresses: '601201', // Women's Dresses
  outerwear: '601301', // Women's Outerwear
  accessories: '601401', // Women's Accessories
}

/**
 * Convert Alyanoor product to TikTok Shop format
 */
function convertToTikTokProduct(product: AlyanoorProduct): TikTokProduct {
  const categoryId = CATEGORY_MAP[product.category] || '601201'

  // Generate SKUs for each size/color combination
  const skus: TikTokSKU[] = []

  for (const size of product.sizes) {
    for (const color of product.colors) {
      skus.push({
        seller_sku: `${product.slug}-${size}-${color}`.toLowerCase().replace(/\s+/g, '-'),
        original_price: String(product.price),
        stock_info: [
          {
            warehouse_id: process.env.TIKTOK_WAREHOUSE_ID || 'default',
            available_stock: product.stock || 100,
          },
        ],
      })
    }
  }

  return {
    product_name: product.name,
    description: product.description,
    category_id: categoryId,
    images: (product.images || []).map(url => ({ url })),
    skus,
    package_weight: { value: '500', unit: 'GRAM' },
    package_dimensions: {
      length: '30',
      width: '20',
      height: '5',
      unit: 'CM',
    },
  }
}

/**
 * Create a new product in TikTok Shop
 */
export async function createProduct(product: AlyanoorProduct) {
  if (!isTikTokShopConfigured()) {
    console.log('[TikTok Shop] Not configured, skipping product creation')
    return null
  }

  const tiktokProduct = convertToTikTokProduct(product)

  return tiktokRequest<{ product_id: string }>('POST', '/api/products', {}, tiktokProduct)
}

/**
 * Update an existing product in TikTok Shop
 */
export async function updateProduct(productId: string, product: AlyanoorProduct) {
  if (!isTikTokShopConfigured()) {
    console.log('[TikTok Shop] Not configured, skipping product update')
    return null
  }

  const tiktokProduct = convertToTikTokProduct(product)
  tiktokProduct.product_id = productId

  return tiktokRequest<{ product_id: string }>('PUT', '/api/products', {}, tiktokProduct)
}

/**
 * Update product stock/inventory
 */
export async function updateStock(
  productId: string,
  skuId: string,
  stock: number
) {
  if (!isTikTokShopConfigured()) {
    return null
  }

  return tiktokRequest('POST', '/api/products/stocks', {}, {
    product_id: productId,
    skus: [
      {
        sku_id: skuId,
        stock_info: [
          {
            warehouse_id: process.env.TIKTOK_WAREHOUSE_ID || 'default',
            available_stock: stock,
          },
        ],
      },
    ],
  })
}

/**
 * Get product list from TikTok Shop
 */
export async function getProducts(page: number = 1, pageSize: number = 20) {
  if (!isTikTokShopConfigured()) {
    return { products: [], total: 0 }
  }

  const response = await tiktokRequest<{
    products: TikTokProduct[]
    total_count: number
  }>('POST', '/api/products/search', {}, {
    page_number: page,
    page_size: pageSize,
  })

  return {
    products: response.data?.products || [],
    total: response.data?.total_count || 0,
  }
}

/**
 * Sync all Alyanoor products to TikTok Shop
 */
export async function syncAllProducts(products: AlyanoorProduct[]) {
  if (!isTikTokShopConfigured()) {
    console.log('[TikTok Shop] Not configured, skipping sync')
    return { synced: 0, errors: [] }
  }

  const results = {
    synced: 0,
    errors: [] as string[],
  }

  for (const product of products) {
    try {
      await createProduct(product)
      results.synced++
    } catch (error) {
      results.errors.push(`Failed to sync ${product.id}: ${error}`)
    }
  }

  return results
}

/**
 * Get TikTok Shop categories
 */
export async function getCategories() {
  if (!isTikTokShopConfigured()) {
    return []
  }

  const response = await tiktokRequest<{
    categories: { id: string; name: string; parent_id: string }[]
  }>('GET', '/api/products/categories')

  return response.data?.categories || []
}
