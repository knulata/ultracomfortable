export interface RawScraperItem {
  external_id: string
  image_url: string
  title?: string
  price?: number
  units_sold?: number
  rating?: number
  likes?: number
  comments?: number
  shares?: number
  views?: number
  caption?: string
  hashtags?: string[]
  platform: Platform
}

export type Platform = 'instagram' | 'tiktok' | 'shopee' | 'tokopedia'

export interface TrendItemRow {
  id?: string
  platform: Platform
  external_id: string
  image_url: string
  image_stored_path?: string
  engagement_likes: number
  engagement_comments: number
  engagement_shares: number
  engagement_views: number
  units_sold?: number
  price?: number
  caption?: string
  hashtags: string[]
  scraped_at: string
  ai_processed: boolean
}

export interface VisionResult {
  category: string
  silhouette: string
  color_primary: string
  color_secondary: string
  pattern: string
  fabric: string
  sleeve_style: string
  details: string[]
  occasion: string
  price_segment: string
}

export interface PartnerRow {
  id: string
  owner_name: string
  shop_name: string
  whatsapp: string
  specialties: string[]
  weekly_capacity: number
  fulfillment_rate: number
  status: string
}

export interface AllocationResult {
  trend_id: string
  partner_id: string
  reason: string
}
