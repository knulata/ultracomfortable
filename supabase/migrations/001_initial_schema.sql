-- UC E-Commerce Database Schema
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE membership_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE size_feedback AS ENUM ('runs_small', 'true_to_size', 'runs_large');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    points INTEGER DEFAULT 0,
    membership_tier membership_tier DEFAULT 'bronze',
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, referral_code)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        UPPER(SUBSTRING(MD5(NEW.id::TEXT) FROM 1 FOR 8))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- BRANDS
-- ============================================

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    is_partner BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert UC as default brand
INSERT INTO brands (name, slug, description, is_partner, is_active)
VALUES ('Ultra Comfortable', 'uc', 'Comfort Meets Style', FALSE, TRUE);

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, sort_order) VALUES
('Women', 'women', 1),
('Men', 'men', 2),
('Kids', 'kids', 3),
('Beauty', 'beauty', 4),
('Lifestyle', 'lifestyle', 5);

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) NOT NULL,
    category_id UUID REFERENCES categories(id) NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL, -- in IDR
    sale_price INTEGER,
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    total_sold INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search
CREATE INDEX idx_products_name ON products USING GIN (to_tsvector('indonesian', name));
CREATE INDEX idx_products_tags ON products USING GIN (tags);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- PRODUCT VARIANTS
-- ============================================

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    color_hex TEXT,
    price_adjustment INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_stock ON product_variants(stock) WHERE stock > 0;

-- ============================================
-- CARTS
-- ============================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

-- ============================================
-- CART ITEMS
-- ============================================

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, variant_id)
);

-- ============================================
-- WISHLISTS
-- ============================================

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    notify_price_drop BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- ============================================
-- ADDRESSES
-- ============================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    label TEXT DEFAULT 'Home',
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============================================
-- ORDERS
-- ============================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal INTEGER NOT NULL,
    shipping_cost INTEGER DEFAULT 0,
    discount INTEGER DEFAULT 0,
    points_used INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT,
    payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ============================================
-- ORDER ITEMS
-- ============================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) NOT NULL,
    product_name TEXT NOT NULL,
    variant_info TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS
-- ============================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    images TEXT[] DEFAULT '{}',
    size_feedback size_feedback,
    helpful_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================
-- COUPONS
-- ============================================

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INTEGER NOT NULL,
    min_purchase INTEGER DEFAULT 0,
    max_discount INTEGER,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FLASH SALES
-- ============================================

CREATE TABLE flash_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE flash_sale_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flash_sale_id UUID REFERENCES flash_sales(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    sale_price INTEGER NOT NULL,
    stock_limit INTEGER,
    sold_count INTEGER DEFAULT 0,
    UNIQUE(flash_sale_id, product_id)
);

-- ============================================
-- POINTS TRANSACTIONS
-- ============================================

CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
    description TEXT,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_points_user ON points_transactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Carts: users can manage their own cart
CREATE POLICY "Users can view own cart" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create cart" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON carts FOR DELETE USING (auth.uid() = user_id);

-- Cart items: users can manage items in their cart
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));
CREATE POLICY "Users can add cart items" ON cart_items FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));
CREATE POLICY "Users can update cart items" ON cart_items FOR UPDATE
    USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));
CREATE POLICY "Users can delete cart items" ON cart_items FOR DELETE
    USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));

-- Wishlists: users can manage their wishlist
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Addresses: users can manage their addresses
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add address" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Orders: users can view their orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: users can view items in their orders
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Reviews: anyone can read approved reviews, users can manage their own
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Points: users can view their own transactions
CREATE POLICY "Users can view own points" ON points_transactions FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- PUBLIC READ ACCESS FOR CATALOG
-- ============================================

-- Products, categories, brands are publicly readable
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active brands" ON brands FOR SELECT USING (is_active = TRUE);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = TRUE);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = TRUE);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active variants" ON product_variants FOR SELECT USING (is_active = TRUE);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = TRUE);

ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active flash sales" ON flash_sales FOR SELECT USING (is_active = TRUE);

ALTER TABLE flash_sale_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view flash sale products" ON flash_sale_products FOR SELECT USING (TRUE);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PRODUCT RATING UPDATE
-- ============================================

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET
        rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();
