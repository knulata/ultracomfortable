-- UC E-Commerce: Multi-vendor marketplace and seller features
-- Adds: sellers table, seller_id on products, settlements, WA notifications

-- ============================================
-- SELLERS (Tanah Abang suppliers/partners)
-- ============================================

CREATE TYPE seller_status AS ENUM ('pending', 'active', 'suspended', 'closed');

CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    store_name TEXT NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Jakarta',
    market_location TEXT, -- e.g. "Tanah Abang Blok A Lt.3 No.45"
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    commission_rate DECIMAL(5, 2) DEFAULT 10, -- UC takes 10% commission
    status seller_status DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT FALSE,
    total_products INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_sellers_user ON sellers(user_id);
CREATE INDEX idx_sellers_status ON sellers(status);
CREATE INDEX idx_sellers_slug ON sellers(store_slug);
CREATE INDEX idx_sellers_city ON sellers(city);

-- ============================================
-- ADD SELLER_ID TO PRODUCTS
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES sellers(id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);

-- ============================================
-- SETTLEMENTS / PAYOUTS
-- ============================================

CREATE TYPE settlement_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- amount to pay seller
    commission INTEGER NOT NULL, -- UC commission deducted
    gross_amount INTEGER NOT NULL, -- total before commission
    order_count INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    status settlement_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settlements_seller ON settlements(seller_id);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_period ON settlements(period_start, period_end);

-- Settlement line items (which orders are included)
CREATE TABLE settlement_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    settlement_id UUID REFERENCES settlements(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) NOT NULL,
    amount INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SELLER NOTIFICATIONS (WhatsApp queue)
-- ============================================

CREATE TYPE notification_channel AS ENUM ('whatsapp', 'email', 'push');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');

CREATE TABLE seller_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE NOT NULL,
    channel notification_channel DEFAULT 'whatsapp',
    type TEXT NOT NULL, -- 'new_order', 'order_shipped', 'settlement_ready', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    status notification_status DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seller_notifications_seller ON seller_notifications(seller_id);
CREATE INDEX idx_seller_notifications_pending ON seller_notifications(status) WHERE status = 'pending';

-- ============================================
-- AUTO-NOTIFY SELLER ON NEW ORDER
-- ============================================

CREATE OR REPLACE FUNCTION notify_seller_new_order()
RETURNS TRIGGER AS $$
DECLARE
    v_seller_id UUID;
    v_order_number TEXT;
    v_total INTEGER;
BEGIN
    -- Get seller from the product variant
    SELECT s.id INTO v_seller_id
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    JOIN sellers s ON s.id = p.seller_id
    WHERE pv.id = NEW.variant_id;

    IF v_seller_id IS NOT NULL THEN
        SELECT order_number, total INTO v_order_number, v_total
        FROM orders WHERE id = NEW.order_id;

        INSERT INTO seller_notifications (seller_id, channel, type, title, message, metadata)
        VALUES (
            v_seller_id,
            'whatsapp',
            'new_order',
            'Pesanan Baru!',
            'Ada pesanan baru ' || v_order_number || ' sebesar Rp ' || v_total || '. Segera proses ya!',
            jsonb_build_object('order_id', NEW.order_id, 'order_number', v_order_number)
        );

        -- Update seller stats
        UPDATE sellers SET total_orders = total_orders + 1 WHERE id = v_seller_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_item_notify_seller
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION notify_seller_new_order();

-- ============================================
-- UPDATE SELLER REVENUE ON PAYMENT
-- ============================================

CREATE OR REPLACE FUNCTION update_seller_revenue()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'paid' AND NEW.status = 'paid' THEN
        UPDATE sellers s
        SET total_revenue = total_revenue + oi.price * oi.quantity
        FROM order_items oi
        JOIN product_variants pv ON pv.id = oi.variant_id
        JOIN products p ON p.id = pv.product_id
        WHERE oi.order_id = NEW.id AND p.seller_id = s.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_paid_update_seller
    AFTER UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION update_seller_revenue();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_notifications ENABLE ROW LEVEL SECURITY;

-- Sellers: users can view their own seller profile, anyone can view active sellers
CREATE POLICY "Anyone can view active sellers" ON sellers FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own seller profile" ON sellers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register as seller" ON sellers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own seller profile" ON sellers FOR UPDATE USING (auth.uid() = user_id);

-- Settlements: sellers can view their own
CREATE POLICY "Sellers can view own settlements" ON settlements FOR SELECT
    USING (EXISTS (SELECT 1 FROM sellers WHERE sellers.id = settlements.seller_id AND sellers.user_id = auth.uid()));

CREATE POLICY "Sellers can view own settlement items" ON settlement_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM settlements s JOIN sellers sl ON sl.id = s.seller_id WHERE s.id = settlement_items.settlement_id AND sl.user_id = auth.uid()));

-- Notifications: sellers can view their own
CREATE POLICY "Sellers can view own notifications" ON seller_notifications FOR SELECT
    USING (EXISTS (SELECT 1 FROM sellers WHERE sellers.id = seller_notifications.seller_id AND sellers.user_id = auth.uid()));

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update role to 'seller' concept — extend profiles role check
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'admin', 'seller'));
