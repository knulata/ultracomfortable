export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          points: number
          membership_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          referral_code: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          points?: number
          membership_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          points?: number
          membership_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          referral_code?: string | null
          referred_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          description: string | null
          is_partner: boolean
          commission_rate: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          description?: string | null
          is_partner?: boolean
          commission_rate?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          description?: string | null
          is_partner?: boolean
          commission_rate?: number
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          base_price: number
          sale_price: number | null
          images: string[]
          tags: string[]
          is_active: boolean
          is_featured: boolean
          total_sold: number
          rating_avg: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          category_id: string
          name: string
          slug: string
          description?: string | null
          base_price: number
          sale_price?: number | null
          images?: string[]
          tags?: string[]
          is_active?: boolean
          is_featured?: boolean
          total_sold?: number
          rating_avg?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          category_id?: string
          name?: string
          slug?: string
          description?: string | null
          base_price?: number
          sale_price?: number | null
          images?: string[]
          tags?: string[]
          is_active?: boolean
          is_featured?: boolean
          total_sold?: number
          rating_avg?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          size: string
          color: string
          color_hex: string | null
          price_adjustment: number
          stock: number
          images: string[]
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          size: string
          color: string
          color_hex?: string | null
          price_adjustment?: number
          stock?: number
          images?: string[]
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          size?: string
          color?: string
          color_hex?: string | null
          price_adjustment?: number
          stock?: number
          images?: string[]
          is_active?: boolean
          created_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          variant_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          variant_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          variant_id?: string
          quantity?: number
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          notify_price_drop: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          notify_price_drop?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          notify_price_drop?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal: number
          shipping_cost: number
          discount: number
          points_used: number
          total: number
          shipping_address: Json
          payment_method: string | null
          payment_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal: number
          shipping_cost?: number
          discount?: number
          points_used?: number
          total: number
          shipping_address: Json
          payment_method?: string | null
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal?: number
          shipping_cost?: number
          discount?: number
          points_used?: number
          total?: number
          shipping_address?: Json
          payment_method?: string | null
          payment_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          variant_id: string
          product_name: string
          variant_info: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          variant_id: string
          product_name: string
          variant_info: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          variant_id?: string
          product_name?: string
          variant_info?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          order_id: string | null
          rating: number
          title: string | null
          content: string | null
          images: string[]
          size_feedback: 'runs_small' | 'true_to_size' | 'runs_large' | null
          helpful_count: number
          is_verified: boolean
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          content?: string | null
          images?: string[]
          size_feedback?: 'runs_small' | 'true_to_size' | 'runs_large' | null
          helpful_count?: number
          is_verified?: boolean
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          content?: string | null
          images?: string[]
          size_feedback?: 'runs_small' | 'true_to_size' | 'runs_large' | null
          helpful_count?: number
          is_verified?: boolean
          is_approved?: boolean
          created_at?: string
        }
      }
      resellers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          phone: string
          whatsapp: string
          address: string
          city: string
          tier_id: 'bronze' | 'silver' | 'gold' | 'platinum'
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          discount_percent: number
          total_orders: number
          total_spent: number
          orders_this_month: number
          last_order_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          phone: string
          whatsapp: string
          address: string
          city: string
          tier_id?: 'bronze' | 'silver' | 'gold' | 'platinum'
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          discount_percent?: number
          total_orders?: number
          total_spent?: number
          orders_this_month?: number
          last_order_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          phone?: string
          whatsapp?: string
          address?: string
          city?: string
          tier_id?: 'bronze' | 'silver' | 'gold' | 'platinum'
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          discount_percent?: number
          total_orders?: number
          total_spent?: number
          orders_this_month?: number
          last_order_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reseller_orders: {
        Row: {
          id: string
          reseller_id: string
          subtotal: number
          reseller_discount: number
          wholesale_discount: number
          total_discount: number
          final_total: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
          paid_at: string | null
          shipped_at: string | null
          delivered_at: string | null
        }
        Insert: {
          id?: string
          reseller_id: string
          subtotal: number
          reseller_discount?: number
          wholesale_discount?: number
          total_discount?: number
          final_total: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Update: {
          id?: string
          reseller_id?: string
          subtotal?: number
          reseller_discount?: number
          wholesale_discount?: number
          total_discount?: number
          final_total?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
      }
      reseller_order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
        }
      }
      product_questions: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          author_name: string
          content: string
          helpful_count: number
          is_answered: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id?: string | null
          author_name: string
          content: string
          helpful_count?: number
          is_answered?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string | null
          author_name?: string
          content?: string
          helpful_count?: number
          is_answered?: boolean
          created_at?: string
        }
      }
      question_answers: {
        Row: {
          id: string
          question_id: string
          user_id: string | null
          author_name: string
          author_type: 'customer' | 'seller' | 'verified_buyer'
          content: string
          helpful_count: number
          is_verified_purchase: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id?: string | null
          author_name: string
          author_type?: 'customer' | 'seller' | 'verified_buyer'
          content: string
          helpful_count?: number
          is_verified_purchase?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string | null
          author_name?: string
          author_type?: 'customer' | 'seller' | 'verified_buyer'
          content?: string
          helpful_count?: number
          is_verified_purchase?: boolean
          created_at?: string
        }
      }
      stock_alerts: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          product_id: string
          variant_id: string
          size: string
          color: string
          notified: boolean
          notified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email?: string | null
          product_id: string
          variant_id: string
          size: string
          color: string
          notified?: boolean
          notified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string | null
          product_id?: string
          variant_id?: string
          size?: string
          color?: string
          notified?: boolean
          notified_at?: string | null
          created_at?: string
        }
      }
      daily_deals: {
        Row: {
          id: string
          product_id: string
          original_price: number
          deal_price: number
          discount_percent: number
          total_stock: number
          sold_count: number
          limit_per_user: number
          is_hero: boolean
          valid_from: string
          valid_until: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          original_price: number
          deal_price: number
          discount_percent: number
          total_stock: number
          sold_count?: number
          limit_per_user?: number
          is_hero?: boolean
          valid_from?: string
          valid_until?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          original_price?: number
          deal_price?: number
          discount_percent?: number
          total_stock?: number
          sold_count?: number
          limit_per_user?: number
          is_hero?: boolean
          valid_from?: string
          valid_until?: string
          created_at?: string
        }
      }
      deal_purchases: {
        Row: {
          id: string
          deal_id: string
          user_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          deal_id: string
          user_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          deal_id?: string
          user_id?: string
          quantity?: number
          created_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          price: number
          recorded_at: string
        }
        Insert: {
          id?: string
          product_id: string
          price: number
          recorded_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          price?: number
          recorded_at?: string
        }
      }
      product_bundles: {
        Row: {
          id: string
          main_product_id: string
          bundle_discount: number
          times_ordered_together: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          main_product_id: string
          bundle_discount?: number
          times_ordered_together?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          main_product_id?: string
          bundle_discount?: number
          times_ordered_together?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bundle_products: {
        Row: {
          id: string
          bundle_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          bundle_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          bundle_id?: string
          product_id?: string
          sort_order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      membership_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      size_feedback: 'runs_small' | 'true_to_size' | 'runs_large'
      reseller_status: 'pending' | 'approved' | 'rejected' | 'suspended'
      reseller_order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
      qa_author_type: 'customer' | 'seller' | 'verified_buyer'
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Brand = Database['public']['Tables']['brands']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type Cart = Database['public']['Tables']['carts']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Wishlist = Database['public']['Tables']['wishlists']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Reseller = Database['public']['Tables']['resellers']['Row']
export type ResellerOrder = Database['public']['Tables']['reseller_orders']['Row']
export type ResellerOrderItem = Database['public']['Tables']['reseller_order_items']['Row']
export type ProductQuestion = Database['public']['Tables']['product_questions']['Row']
export type QuestionAnswer = Database['public']['Tables']['question_answers']['Row']
export type StockAlert = Database['public']['Tables']['stock_alerts']['Row']
export type DailyDeal = Database['public']['Tables']['daily_deals']['Row']
export type DealPurchase = Database['public']['Tables']['deal_purchases']['Row']
export type PriceHistory = Database['public']['Tables']['price_history']['Row']
export type ProductBundle = Database['public']['Tables']['product_bundles']['Row']
export type BundleProduct = Database['public']['Tables']['bundle_products']['Row']

// Extended types with relations
export type ProductWithVariants = Product & {
  variants: ProductVariant[]
  brand: Brand
  category: Category
}

export type CartItemWithProduct = CartItem & {
  variant: ProductVariant & {
    product: Product
  }
}
