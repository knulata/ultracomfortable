-- Alyanoor Trend Intelligence Engine
-- Migration: Partner tables + Trend intelligence tables
-- Version: 2.0.0

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE partner_status AS ENUM ('pending', 'approved', 'active', 'suspended', 'rejected');

-- ============================================
-- PARTNERS (migrated from Zustand/localStorage)
-- ============================================

CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    owner_name TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    shop_address TEXT NOT NULL,
    block TEXT NOT NULL DEFAULT '',
    floor TEXT,
    shop_number TEXT,
    bank_name TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    status partner_status DEFAULT 'pending',
    status_note TEXT,
    specialties TEXT[] DEFAULT '{}',
    weekly_capacity INT DEFAULT 20,
    fulfillment_rate DECIMAL(5,2) DEFAULT 0,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_status ON partners(status);

-- ============================================
-- TREND ITEMS (scraped from platforms)
-- ============================================

CREATE TABLE trend_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'shopee', 'tokopedia')),
    external_id TEXT,
    image_url TEXT NOT NULL,
    image_stored_path TEXT,
    engagement_likes INT DEFAULT 0,
    engagement_comments INT DEFAULT 0,
    engagement_shares INT DEFAULT 0,
    engagement_views INT DEFAULT 0,
    units_sold INT,
    price INT,
    caption TEXT,
    hashtags TEXT[] DEFAULT '{}',
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    category TEXT,
    silhouette TEXT,
    color_primary TEXT,
    color_secondary TEXT,
    pattern TEXT,
    fabric TEXT,
    sleeve_style TEXT,
    details TEXT[] DEFAULT '{}',
    occasion TEXT,
    price_segment TEXT,
    ai_processed BOOLEAN DEFAULT FALSE,
    ai_processed_at TIMESTAMPTZ,
    embedding halfvec(512),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trend_items_platform ON trend_items(platform);
CREATE INDEX idx_trend_items_scraped_at ON trend_items(scraped_at DESC);
CREATE INDEX idx_trend_items_category ON trend_items(category);
CREATE INDEX idx_trend_items_ai ON trend_items(ai_processed);
CREATE INDEX idx_trend_items_external ON trend_items(platform, external_id);
CREATE INDEX idx_trend_items_embedding ON trend_items USING hnsw (embedding halfvec_cosine_ops);

-- ============================================
-- TRENDS (aggregated / clustered)
-- ============================================

CREATE TABLE trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    trend_score FLOAT NOT NULL DEFAULT 0,
    social_velocity FLOAT DEFAULT 0,
    marketplace_sales_signal FLOAT DEFAULT 0,
    cross_platform_count INT DEFAULT 0,
    category TEXT,
    representative_image_url TEXT,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    peak_score FLOAT DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'declining', 'expired')),
    partner_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trends_score ON trends(trend_score DESC);
CREATE INDEX idx_trends_status ON trends(status);
CREATE INDEX idx_trends_category ON trends(category);

-- ============================================
-- TREND ↔ ITEM LINKS
-- ============================================

CREATE TABLE trend_item_links (
    trend_id UUID REFERENCES trends(id) ON DELETE CASCADE,
    item_id UUID REFERENCES trend_items(id) ON DELETE CASCADE,
    PRIMARY KEY (trend_id, item_id)
);

-- ============================================
-- ALLOCATIONS
-- ============================================

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trend_id UUID REFERENCES trends(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT,
    UNIQUE(trend_id, partner_id)
);

-- ============================================
-- PARTNER RESPONSES
-- ============================================

CREATE TABLE partner_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    trend_id UUID REFERENCES trends(id) ON DELETE CASCADE,
    allocation_id UUID REFERENCES allocations(id),
    response TEXT CHECK (response IN ('bisa', 'skip', 'maybe')),
    price_offered INT,
    quantity_offered INT,
    lead_time_days INT,
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    fulfilled BOOLEAN DEFAULT FALSE,
    fulfilled_at TIMESTAMPTZ,
    UNIQUE(partner_id, trend_id)
);

CREATE INDEX idx_partner_responses_partner ON partner_responses(partner_id);
CREATE INDEX idx_partner_responses_trend ON partner_responses(trend_id);

-- ============================================
-- PARTNER STOCK PHOTOS
-- ============================================

CREATE TABLE partner_stock_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    embedding halfvec(512),
    photo_type TEXT DEFAULT 'stock' CHECK (photo_type IN ('stock', 'fabric')),
    matched_trend_ids UUID[] DEFAULT '{}',
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partner_stock_embedding ON partner_stock_photos USING hnsw (embedding halfvec_cosine_ops);

-- ============================================
-- DAILY METRICS
-- ============================================

CREATE TABLE daily_metrics (
    date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    trends_detected INT DEFAULT 0,
    broadcasts_sent INT DEFAULT 0,
    partners_responded INT DEFAULT 0,
    models_committed INT DEFAULT 0,
    models_fulfilled INT DEFAULT 0,
    avg_response_time_minutes FLOAT
);

-- ============================================
-- WA MESSAGE LOG
-- ============================================

CREATE TABLE wa_message_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id),
    message_type TEXT NOT NULL,
    wa_message_id TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ
);

CREATE INDEX idx_wa_log_partner ON wa_message_log(partner_id);
CREATE INDEX idx_wa_log_status ON wa_message_log(status);

-- ============================================
-- MATERIALIZED VIEW: TREND SCORES
-- ============================================

CREATE MATERIALIZED VIEW trend_scores_mv AS
SELECT
    t.id,
    t.name,
    t.category,
    t.representative_image_url,
    t.status,
    t.partner_count,
    t.first_seen_at,
    t.cross_platform_count,
    COALESCE(social.velocity, 0) AS social_velocity,
    COALESCE(marketplace.sales_signal, 0) AS marketplace_sales_signal,
    COALESCE(
        (COALESCE(social.velocity, 0) / GREATEST(social.max_velocity, 1) * 0.3) +
        (CASE WHEN t.cross_platform_count > 1 THEN 0.25 ELSE 0 END) +
        (COALESCE(marketplace.sales_signal, 0) / GREATEST(marketplace.max_sales, 1) * 0.3) +
        (1.0 / (EXTRACT(EPOCH FROM (NOW() - t.first_seen_at)) / 86400 + 1) * 0.15),
        0
    ) AS computed_score,
    COALESCE(commits.total, 0) AS commitments,
    t.created_at,
    t.updated_at
FROM trends t
LEFT JOIN LATERAL (
    SELECT
        AVG(ti.engagement_likes + ti.engagement_comments + ti.engagement_shares) AS velocity,
        MAX(ti.engagement_likes + ti.engagement_comments + ti.engagement_shares) AS max_velocity
    FROM trend_items ti
    JOIN trend_item_links til ON til.item_id = ti.id
    WHERE til.trend_id = t.id AND ti.platform IN ('instagram', 'tiktok')
) social ON true
LEFT JOIN LATERAL (
    SELECT
        AVG(COALESCE(ti.units_sold, 0)) AS sales_signal,
        MAX(COALESCE(ti.units_sold, 1)) AS max_sales
    FROM trend_items ti
    JOIN trend_item_links til ON til.item_id = ti.id
    WHERE til.trend_id = t.id AND ti.platform IN ('shopee', 'tokopedia')
) marketplace ON true
LEFT JOIN LATERAL (
    SELECT COUNT(*) AS total
    FROM partner_responses pr
    WHERE pr.trend_id = t.id AND pr.response = 'bisa'
) commits ON true
WHERE t.status = 'active'
GROUP BY t.id, t.name, t.category, t.representative_image_url, t.status,
         t.partner_count, t.first_seen_at, t.cross_platform_count,
         social.velocity, social.max_velocity,
         marketplace.sales_signal, marketplace.max_sales,
         commits.total, t.created_at, t.updated_at;

CREATE UNIQUE INDEX idx_trend_scores_mv_id ON trend_scores_mv(id);
CREATE INDEX idx_trend_scores_mv_score ON trend_scores_mv(computed_score DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_stock_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_message_log ENABLE ROW LEVEL SECURITY;

-- Partners: users see/update own
CREATE POLICY "Partners view own" ON partners FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Partners update own" ON partners FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Partners insert own" ON partners FOR INSERT WITH CHECK (user_id = auth.uid());

-- Trends + trend_items: public read
CREATE POLICY "Anyone can view trends" ON trends FOR SELECT USING (true);
CREATE POLICY "Anyone can view trend items" ON trend_items FOR SELECT USING (true);

-- Allocations: partners see own
CREATE POLICY "Partners view own allocations" ON allocations
    FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- Partner responses: partners see/create own
CREATE POLICY "Partners view own responses" ON partner_responses
    FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "Partners create responses" ON partner_responses
    FOR INSERT WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- Partner photos: partners see/upload own
CREATE POLICY "Partners view own photos" ON partner_stock_photos
    FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "Partners upload photos" ON partner_stock_photos
    FOR INSERT WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- Daily metrics: public read
CREATE POLICY "Anyone can view metrics" ON daily_metrics FOR SELECT USING (true);

-- WA log: partners see own
CREATE POLICY "Partners view own wa log" ON wa_message_log
    FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to refresh materialized view (called by engine via service role)
CREATE OR REPLACE FUNCTION refresh_trend_scores()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY trend_scores_mv;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
