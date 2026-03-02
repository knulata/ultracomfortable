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
