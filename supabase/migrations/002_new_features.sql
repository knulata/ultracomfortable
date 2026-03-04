-- UC E-Commerce: New Features Migration
-- Adds: resellers, product Q&A, stock alerts, daily deals, price history, bundles

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE reseller_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE reseller_order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE qa_author_type AS ENUM ('customer', 'seller', 'verified_buyer');

-- ============================================
-- RESELLERS
-- ============================================

CREATE TABLE resellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    tier_id TEXT NOT NULL DEFAULT 'bronze' CHECK (tier_id IN ('bronze', 'silver', 'gold', 'platinum')),
    status reseller_status DEFAULT 'pending',
    discount_percent DECIMAL(5, 2) DEFAULT 5,
    total_orders INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    orders_this_month INTEGER DEFAULT 0,
    last_order_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_resellers_user ON resellers(user_id);
CREATE INDEX idx_resellers_status ON resellers(status);
CREATE INDEX idx_resellers_tier ON resellers(tier_id);

CREATE TABLE reseller_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id UUID REFERENCES resellers(id) ON DELETE CASCADE NOT NULL,
    subtotal INTEGER NOT NULL,
    reseller_discount INTEGER DEFAULT 0,
    wholesale_discount INTEGER DEFAULT 0,
    total_discount INTEGER DEFAULT 0,
    final_total INTEGER NOT NULL,
    status reseller_order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_reseller_orders_reseller ON reseller_orders(reseller_id);

CREATE TABLE reseller_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES reseller_orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    total_price INTEGER NOT NULL
);

-- ============================================
-- PRODUCT Q&A
-- ============================================

CREATE TABLE product_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id),
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    is_answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_product ON product_questions(product_id);

CREATE TABLE question_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES product_questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id),
    author_name TEXT NOT NULL,
    author_type qa_author_type DEFAULT 'customer',
    content TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_answers_question ON question_answers(question_id);

-- Auto-mark question as answered when an answer is added
CREATE OR REPLACE FUNCTION mark_question_answered()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product_questions SET is_answered = TRUE WHERE id = NEW.question_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_answer_created
    AFTER INSERT ON question_answers
    FOR EACH ROW EXECUTE FUNCTION mark_question_answered();

-- ============================================
-- STOCK ALERTS (back-in-stock notifications)
-- ============================================

CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    email TEXT,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    notified BOOLEAN DEFAULT FALSE,
    notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, variant_id)
);

CREATE INDEX idx_stock_alerts_variant ON stock_alerts(variant_id);
CREATE INDEX idx_stock_alerts_notified ON stock_alerts(notified) WHERE notified = FALSE;

-- ============================================
-- DAILY DEALS
-- ============================================

CREATE TABLE daily_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    original_price INTEGER NOT NULL,
    deal_price INTEGER NOT NULL,
    discount_percent INTEGER NOT NULL,
    total_stock INTEGER NOT NULL,
    sold_count INTEGER DEFAULT 0,
    limit_per_user INTEGER DEFAULT 1,
    is_hero BOOLEAN DEFAULT FALSE,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_deals_date ON daily_deals(valid_from, valid_until);
CREATE INDEX idx_daily_deals_hero ON daily_deals(is_hero) WHERE is_hero = TRUE;

CREATE TABLE deal_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES daily_deals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(deal_id, user_id)
);

-- ============================================
-- PRICE HISTORY (for price drop alerts)
-- ============================================

CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    price INTEGER NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_date ON price_history(recorded_at);

-- Add price tracking fields to wishlists
ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS price_when_added INTEGER;
ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS lowest_price INTEGER;

-- ============================================
-- PRODUCT BUNDLES (frequently bought together)
-- ============================================

CREATE TABLE product_bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    main_product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    bundle_discount INTEGER DEFAULT 10, -- percentage
    times_ordered_together INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bundles_main_product ON product_bundles(main_product_id);

CREATE TABLE bundle_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bundle_id UUID REFERENCES product_bundles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    UNIQUE(bundle_id, product_id)
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Increment user points (called from webhook)
CREATE OR REPLACE FUNCTION increment_points(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles SET points = points + p_amount WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reseller_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;

-- Resellers: users can view their own reseller profile
CREATE POLICY "Users can view own reseller profile" ON resellers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can apply as reseller" ON resellers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reseller profile" ON resellers FOR UPDATE USING (auth.uid() = user_id);

-- Reseller orders: resellers can view their own orders
CREATE POLICY "Resellers can view own orders" ON reseller_orders FOR SELECT
    USING (EXISTS (SELECT 1 FROM resellers WHERE resellers.id = reseller_orders.reseller_id AND resellers.user_id = auth.uid()));
CREATE POLICY "Resellers can create orders" ON reseller_orders FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM resellers WHERE resellers.id = reseller_orders.reseller_id AND resellers.user_id = auth.uid()));

CREATE POLICY "Resellers can view own order items" ON reseller_order_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM reseller_orders ro JOIN resellers r ON r.id = ro.reseller_id WHERE ro.id = reseller_order_items.order_id AND r.user_id = auth.uid()));

-- Q&A: anyone can read, authenticated users can create
CREATE POLICY "Anyone can view questions" ON product_questions FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can ask questions" ON product_questions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view answers" ON question_answers FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can answer" ON question_answers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Stock alerts: users manage their own
CREATE POLICY "Users can view own stock alerts" ON stock_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create stock alerts" ON stock_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own stock alerts" ON stock_alerts FOR DELETE USING (auth.uid() = user_id);

-- Daily deals: publicly readable
CREATE POLICY "Anyone can view daily deals" ON daily_deals FOR SELECT USING (TRUE);
CREATE POLICY "Users can view own deal purchases" ON deal_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can purchase deals" ON deal_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Price history: publicly readable
CREATE POLICY "Anyone can view price history" ON price_history FOR SELECT USING (TRUE);

-- Bundles: publicly readable
CREATE POLICY "Anyone can view active bundles" ON product_bundles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anyone can view bundle products" ON bundle_products FOR SELECT USING (TRUE);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_resellers_updated_at BEFORE UPDATE ON resellers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON product_bundles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
