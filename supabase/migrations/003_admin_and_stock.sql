-- UC E-Commerce: Admin role and stock management
-- Adds: admin role to profiles, stock decrement function

-- ============================================
-- ADMIN ROLE
-- ============================================

-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Index for quick admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE role = 'admin';

-- ============================================
-- STOCK MANAGEMENT
-- ============================================

-- Decrement stock when order items are created
CREATE OR REPLACE FUNCTION decrement_variant_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product_variants
    SET stock = GREATEST(stock - NEW.quantity, 0)
    WHERE id = NEW.variant_id;

    -- Update total_sold on the product
    UPDATE products
    SET total_sold = total_sold + NEW.quantity
    WHERE id = (SELECT product_id FROM product_variants WHERE id = NEW.variant_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_item_created
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION decrement_variant_stock();

-- Restore stock when order is cancelled
CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        UPDATE product_variants pv
        SET stock = stock + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id AND pv.id = oi.variant_id;

        UPDATE products p
        SET total_sold = GREATEST(total_sold - oi.quantity, 0)
        FROM order_items oi
        JOIN product_variants pv ON pv.id = oi.variant_id
        WHERE oi.order_id = NEW.id AND p.id = pv.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_cancelled
    AFTER UPDATE OF status ON orders
    FOR EACH ROW EXECUTE FUNCTION restore_stock_on_cancel();

-- ============================================
-- NOTIFY STOCK ALERT SUBSCRIBERS
-- ============================================

-- When stock is replenished, mark alerts for notification
CREATE OR REPLACE FUNCTION check_stock_alerts()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stock = 0 AND NEW.stock > 0 THEN
        UPDATE stock_alerts
        SET notified = TRUE, notified_at = NOW()
        WHERE variant_id = NEW.id AND notified = FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_stock_replenished
    AFTER UPDATE OF stock ON product_variants
    FOR EACH ROW EXECUTE FUNCTION check_stock_alerts();
