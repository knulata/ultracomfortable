export interface TrendItem {
  id: string
  platform: 'instagram' | 'tiktok' | 'shopee' | 'tokopedia'
  external_id: string | null
  image_url: string
  image_stored_path: string | null
  engagement_likes: number
  engagement_comments: number
  engagement_shares: number
  engagement_views: number
  units_sold: number | null
  price: number | null
  caption: string | null
  hashtags: string[]
  scraped_at: string
  category: string | null
  silhouette: string | null
  color_primary: string | null
  color_secondary: string | null
  pattern: string | null
  fabric: string | null
  sleeve_style: string | null
  details: string[]
  occasion: string | null
  price_segment: string | null
  ai_processed: boolean
  ai_processed_at: string | null
  created_at: string
}

export interface Trend {
  id: string
  name: string | null
  trend_score: number
  social_velocity: number
  marketplace_sales_signal: number
  cross_platform_count: number
  category: string | null
  representative_image_url: string | null
  first_seen_at: string
  peak_score: number
  status: 'active' | 'declining' | 'expired'
  partner_count: number
  created_at: string
  updated_at: string
}

export interface TrendScoreView {
  id: string
  name: string | null
  category: string | null
  representative_image_url: string | null
  status: string
  partner_count: number
  first_seen_at: string
  cross_platform_count: number
  social_velocity: number
  marketplace_sales_signal: number
  computed_score: number
  commitments: number
  created_at: string
  updated_at: string
}

export interface Allocation {
  id: string
  trend_id: string
  partner_id: string
  allocated_at: string
  reason: string | null
  trend?: Trend
}

export interface PartnerResponse {
  id: string
  partner_id: string
  trend_id: string
  allocation_id: string | null
  response: 'bisa' | 'skip' | 'maybe'
  price_offered: number | null
  quantity_offered: number | null
  lead_time_days: number | null
  responded_at: string
  fulfilled: boolean
  fulfilled_at: string | null
}

export interface PartnerStockPhoto {
  id: string
  partner_id: string
  image_url: string
  photo_type: 'stock' | 'fabric'
  matched_trend_ids: string[]
  uploaded_at: string
}

export interface DailyMetrics {
  date: string
  trends_detected: number
  broadcasts_sent: number
  partners_responded: number
  models_committed: number
  models_fulfilled: number
  avg_response_time_minutes: number | null
}

export interface TrendFilters {
  category?: string
  sortBy?: 'score' | 'newest' | 'most_sold'
  status?: 'active' | 'declining' | 'expired'
}

export interface CommitData {
  partner_id: string
  trend_id: string
  price_offered: number
  quantity_offered: number
  lead_time_days: number
}

export interface PhotoMatchResult {
  trend: TrendScoreView
  similarity: number
  label: 'Sangat Cocok' | 'Cukup Cocok' | 'Kurang Cocok'
}

export type Platform = 'instagram' | 'tiktok' | 'shopee' | 'tokopedia'

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
