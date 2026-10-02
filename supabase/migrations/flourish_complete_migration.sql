-- =====================================================================
-- FLOURISH WOMEN'S — COMPLETE DATABASE MIGRATION
-- Paste this entire file into the Supabase SQL Editor and click Run.
-- Safe to run multiple times (idempotent — uses IF NOT EXISTS / ON CONFLICT).
-- =====================================================================

-- ─────────────────────────────────────────────
-- SECTION 1: EXTENSIONS
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- SECTION 2: ENUM TYPES
-- ─────────────────────────────────────────────
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_availability') THEN
        CREATE TYPE product_availability AS ENUM ('in_stock', 'out_of_stock', 'made_to_order');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enquiry_status') THEN
        CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'confirmed', 'completed', 'cancelled');
    END IF;
END $$;

-- ─────────────────────────────────────────────
-- SECTION 3: UTILITY TRIGGER FUNCTION
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────
-- SECTION 4: PROFILES (linked to auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT UNIQUE,
    full_name   TEXT,
    phone       TEXT,
    avatar_url  TEXT,
    role        user_role NOT NULL DEFAULT 'customer',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    );
END;
$$;

-- Trigger: auto-create profile on signup / user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    is_first_user BOOLEAN;
    assigned_role public.user_role;
BEGIN
    -- Check if this is the first user in the database
    SELECT (COUNT(*) = 0) INTO is_first_user FROM public.profiles;

    -- Determine role:
    -- 1. Metadata role if explicitly set to admin
    -- 2. 'admin' if email contains 'admin' or if it's the very first user created
    -- 3. Otherwise 'customer'
    IF NEW.raw_user_meta_data->>'role' IN ('admin', 'super_admin') THEN
        assigned_role := (NEW.raw_user_meta_data->>'role')::public.user_role;
    ELSIF NEW.email ILIKE '%admin%' OR is_first_user THEN
        assigned_role := 'admin'::public.user_role;
    ELSE
        assigned_role := 'customer'::public.user_role;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Admin User'),
        assigned_role
    )
    ON CONFLICT (id) DO UPDATE SET 
        email = EXCLUDED.email,
        role = CASE 
            WHEN EXCLUDED.email ILIKE '%admin%' OR NEW.raw_user_meta_data->>'role' IN ('admin', 'super_admin') THEN 'admin'::public.user_role 
            ELSE profiles.role 
        END;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user error: %', SQLERRM;
        RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- SECTION 5: CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT NOT NULL,
    slug             TEXT NOT NULL UNIQUE,
    description      TEXT,
    image_url        TEXT,
    display_order    INTEGER NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
    meta_title       TEXT,
    meta_description TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add is_featured column if running on existing DB
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 6: COLLECTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.collections (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT NOT NULL,
    slug             TEXT NOT NULL UNIQUE,
    tagline          TEXT,
    description      TEXT,
    banner_url       TEXT,
    thumbnail_url    TEXT,
    is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
    display_order    INTEGER NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title       TEXT,
    meta_description TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_collections_updated_at ON public.collections;
CREATE TRIGGER set_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 7: PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             TEXT NOT NULL,
    slug             TEXT NOT NULL UNIQUE,
    sku              TEXT UNIQUE,
    short_description TEXT,
    description      TEXT,
    price            NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_price    NUMERIC(12, 2) CHECK (compare_price IS NULL OR compare_price >= price),
    category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id    UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    fabric           TEXT,
    saree_type       TEXT,
    color            TEXT,
    occasion         TEXT,
    blouse_details   TEXT,
    wash_care        TEXT,
    dimensions       TEXT,
    availability     product_availability NOT NULL DEFAULT 'in_stock',
    is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_arrival   BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller    BOOLEAN NOT NULL DEFAULT FALSE,
    is_published     BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title       TEXT,
    meta_description TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 8: PRODUCT IMAGES (max 5 per product)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_images (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url     TEXT NOT NULL,
    alt_text      TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.check_product_image_limit()
RETURNS TRIGGER AS $$
DECLARE
    image_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO image_count
    FROM public.product_images
    WHERE product_id = NEW.product_id;

    IF (TG_OP = 'INSERT' AND image_count >= 5) THEN
        RAISE EXCEPTION 'A maximum of 5 images is allowed per product.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_product_image_limit ON public.product_images;
CREATE TRIGGER enforce_product_image_limit
    BEFORE INSERT ON public.product_images
    FOR EACH ROW EXECUTE FUNCTION public.check_product_image_limit();

-- ─────────────────────────────────────────────
-- SECTION 9: HERO BANNERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title              TEXT NOT NULL,
    subtitle           TEXT,
    cta_text           TEXT DEFAULT 'Explore Collection',
    cta_link           TEXT DEFAULT '/products',
    image_desktop_url  TEXT NOT NULL,
    image_mobile_url   TEXT,
    display_order      INTEGER NOT NULL DEFAULT 0,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_hero_banners_updated_at ON public.hero_banners;
CREATE TRIGGER set_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 10: PROMOTIONAL BANNERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promotional_banners (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    subtitle      TEXT,
    badge_text    TEXT,
    cta_text      TEXT,
    cta_link      TEXT,
    image_url     TEXT,
    bg_color      TEXT DEFAULT '#F9F6F0',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_promotional_banners_updated_at ON public.promotional_banners;
CREATE TRIGGER set_promotional_banners_updated_at
    BEFORE UPDATE ON public.promotional_banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 11: REELS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reels (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,
    video_url        TEXT,
    thumbnail_url    TEXT NOT NULL,
    view_count_label TEXT DEFAULT '10.2k views',
    product_id       UUID REFERENCES public.products(id) ON DELETE SET NULL,
    display_order    INTEGER NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_reels_updated_at ON public.reels;
CREATE TRIGGER set_reels_updated_at
    BEFORE UPDATE ON public.reels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 12: TESTIMONIALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name   TEXT NOT NULL,
    location      TEXT,
    content       TEXT NOT NULL,
    rating        INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url    TEXT,
    saree_worn    TEXT,
    is_featured   BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 13: EDITORIAL CONTENT
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.editorial_content (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    subtitle        TEXT,
    excerpt         TEXT,
    content         TEXT NOT NULL,
    cover_image_url TEXT,
    read_time       TEXT DEFAULT '4 min read',
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    published_at    TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_editorial_content_updated_at ON public.editorial_content;
CREATE TRIGGER set_editorial_content_updated_at
    BEFORE UPDATE ON public.editorial_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 14: ENQUIRIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enquiries (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name     TEXT NOT NULL,
    customer_phone    TEXT NOT NULL,
    customer_email    TEXT,
    customer_location TEXT,
    message           TEXT,
    status            enquiry_status NOT NULL DEFAULT 'new',
    source            TEXT DEFAULT 'whatsapp_button',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER set_enquiries_updated_at
    BEFORE UPDATE ON public.enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 15: ENQUIRY ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enquiry_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id    UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    product_id    UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name  TEXT NOT NULL,
    product_sku   TEXT,
    product_price NUMERIC(12, 2),
    quantity      INTEGER NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SECTION 16: SITE SETTINGS (singleton)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
    id                     TEXT PRIMARY KEY DEFAULT 'global',
    site_name              TEXT NOT NULL DEFAULT 'Flourish Women''s',
    tagline                TEXT DEFAULT 'Timeless Sarees for Modern Women',
    announcement_text      TEXT DEFAULT 'Discover Timeless Sarees for Every Occasion | Complimentary Styling Assistance',
    is_announcement_active BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_number        TEXT DEFAULT '919876543210',
    contact_email          TEXT,
    contact_phone          TEXT,
    address                TEXT,
    instagram_url          TEXT,
    facebook_url           TEXT,
    pinterest_url          TEXT,
    youtube_url            TEXT,
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- SECTION 17: SOCIAL LINKS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_links (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform      TEXT NOT NULL,
    url           TEXT NOT NULL,
    icon          TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SECTION 18: INDEXES (performance)
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug                ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category            ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection          ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_published_featured  ON public.products(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_published_new       ON public.products(is_published, is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_published_bestseller ON public.products(is_published, is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_price               ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id    ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug              ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_collections_slug             ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_reels_active                 ON public.reels(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_hero_banners_active          ON public.hero_banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_editorial_published          ON public.editorial_content(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status             ON public.enquiries(status);

-- Full-text search on products
CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products
    USING gin(to_tsvector('english',
        name || ' ' ||
        COALESCE(description, '') || ' ' ||
        COALESCE(fabric, '') || ' ' ||
        COALESCE(occasion, '') || ' ' ||
        COALESCE(saree_type, '')
    ));

-- ─────────────────────────────────────────────
-- SECTION 19: ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_content  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links       ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe re-run)
DO $$ DECLARE pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- PROFILES
CREATE POLICY "Profiles: owner or admin can read"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles: owner or admin can update"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- CATEGORIES
CREATE POLICY "Categories: public read active"
    ON public.categories FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Categories: admin all"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- COLLECTIONS
CREATE POLICY "Collections: public read active"
    ON public.collections FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Collections: admin all"
    ON public.collections FOR ALL
    USING (public.is_admin());

-- PRODUCTS
CREATE POLICY "Products: public read published"
    ON public.products FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Products: admin all"
    ON public.products FOR ALL
    USING (public.is_admin());

-- PRODUCT IMAGES
CREATE POLICY "Product images: public read"
    ON public.product_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_images.product_id
            AND (p.is_published = TRUE OR public.is_admin())
        )
    );

CREATE POLICY "Product images: admin all"
    ON public.product_images FOR ALL
    USING (public.is_admin());

-- HERO BANNERS
CREATE POLICY "Hero banners: public read active"
    ON public.hero_banners FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Hero banners: admin all"
    ON public.hero_banners FOR ALL
    USING (public.is_admin());

-- PROMOTIONAL BANNERS
CREATE POLICY "Promo banners: public read active"
    ON public.promotional_banners FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Promo banners: admin all"
    ON public.promotional_banners FOR ALL
    USING (public.is_admin());

-- REELS
CREATE POLICY "Reels: public read active"
    ON public.reels FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Reels: admin all"
    ON public.reels FOR ALL
    USING (public.is_admin());

-- TESTIMONIALS
CREATE POLICY "Testimonials: public read featured"
    ON public.testimonials FOR SELECT
    USING (is_featured = TRUE OR public.is_admin());

CREATE POLICY "Testimonials: admin all"
    ON public.testimonials FOR ALL
    USING (public.is_admin());

-- EDITORIAL
CREATE POLICY "Editorial: public read published"
    ON public.editorial_content FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Editorial: admin all"
    ON public.editorial_content FOR ALL
    USING (public.is_admin());

-- ENQUIRIES
CREATE POLICY "Enquiries: anyone can insert"
    ON public.enquiries FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Enquiries: admin all"
    ON public.enquiries FOR ALL
    USING (public.is_admin());

-- ENQUIRY ITEMS
CREATE POLICY "Enquiry items: anyone can insert"
    ON public.enquiry_items FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Enquiry items: admin all"
    ON public.enquiry_items FOR ALL
    USING (public.is_admin());

-- SITE SETTINGS (public read, admin write)
CREATE POLICY "Site settings: public read"
    ON public.site_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Site settings: admin all"
    ON public.site_settings FOR ALL
    USING (public.is_admin());

-- SOCIAL LINKS
CREATE POLICY "Social links: public read active"
    ON public.social_links FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Social links: admin all"
    ON public.social_links FOR ALL
    USING (public.is_admin());

-- ─────────────────────────────────────────────
-- SECTION 20: SEED DATA
-- (Safe — uses ON CONFLICT DO NOTHING)
-- ─────────────────────────────────────────────

-- Site Settings (singleton)
INSERT INTO public.site_settings (id, site_name, tagline, announcement_text, is_announcement_active, whatsapp_number)
VALUES (
    'global',
    'Flourish Women''s',
    'Timeless Sarees for Modern Women',
    'Discover Timeless Sarees for Every Occasion | Complimentary Styling & Customization Assistance',
    TRUE,
    '919876543210'
)
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO public.categories (id, name, slug, description, display_order, is_active, is_featured)
VALUES
    ('11111111-0001-0001-0001-000000000001', 'Kanchipuram Sarees', 'kanchipuram',    'Classic Kanchipuram silk sarees with pure zari borders', 1, TRUE, TRUE),
    ('11111111-0001-0001-0001-000000000002', 'Banarasi Sarees',    'banarasi',       'Luxurious Banarasi brocades from Varanasi weavers',     2, TRUE, TRUE),
    ('11111111-0001-0001-0001-000000000003', 'Soft Silk',          'soft-silk',      'Lightweight silk sarees perfect for everyday elegance', 3, TRUE, TRUE),
    ('11111111-0001-0001-0001-000000000004', 'Organza Sarees',     'organza',        'Sheer and ethereal organza drapes for festive wear',    4, TRUE, TRUE),
    ('11111111-0001-0001-0001-000000000005', 'Cotton Sarees',      'cotton',         'Handwoven cotton sarees for comfortable daily wear',    5, TRUE, FALSE),
    ('11111111-0001-0001-0001-000000000006', 'Festive Collection', 'festive',        'Curated picks for Diwali, Weddings, and Celebrations',  6, TRUE, TRUE),
    ('11111111-0001-0001-0001-000000000007', 'Designer Sarees',    'designer',       'Contemporary designs by Flourish signature artisans',   7, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Collections (The Flourish Edit)
INSERT INTO public.collections (id, name, slug, tagline, description, is_featured, display_order, is_active)
VALUES
    ('22222222-0001-0001-0001-000000000001', 'Wedding',  'wedding',  'For unforgettable beginnings.',    'Handpicked bridal sarees for your special day — opulent Kanchipuram silks and Banarasi brocades.',         TRUE, 1, TRUE),
    ('22222222-0001-0001-0001-000000000002', 'Festive',  'festive',  'Tradition with a modern expression.', 'Vibrant festive collection spanning Diwali, Navratri, Onam, and every occasion worth celebrating.',      TRUE, 2, TRUE),
    ('22222222-0001-0001-0001-000000000003', 'Everyday', 'everyday', 'Elegance for every day.',          'Soft silks and cottons crafted for the modern woman who wears tradition as second nature.',               TRUE, 3, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (client_name, location, content, rating, saree_worn, is_featured, display_order)
VALUES
    ('Priya Ramanathan',  'Chennai, Tamil Nadu',  'I wore the Kanchipuram saree from Flourish Women''s for my wedding and received compliments all day long. The quality is unmatched — pure zari, vivid silk, perfect drape.', 5, 'Kanchipuram Silk — Peacock Motif', TRUE, 1),
    ('Ananya Krishnamurthy', 'Bengaluru, Karnataka', 'Discovered Flourish through a friend and I''m so glad I did. The Banarasi collection is stunning. Got my saree delivered beautifully packaged within 3 days!', 5, 'Banarasi Brocade — Royal Gold', TRUE, 2),
    ('Meera Iyer',        'Mumbai, Maharashtra',  'Ordered a soft silk for my sister''s thread ceremony. The colour was exactly as shown, the fabric is heavenly soft. Will definitely order again for my own events.', 5, 'Soft Silk — Rose Pink',         TRUE, 3),
    ('Deepa Nair',        'Kochi, Kerala',        'Flourish Women''s understands what authentic Indian craftsmanship means. My Onam saree was a masterpiece. Highly recommend for anyone who values real handloom.', 5, 'Kerala Kasavu Cotton',          TRUE, 4),
    ('Lakshmi Subramanian', 'Coimbatore, Tamil Nadu', 'The WhatsApp concierge service is brilliant — they helped me pick the perfect saree for my daughter''s arangetram. Arrived on time, looked divine on stage.', 5, 'Pure Kanchipuram — Temple Border', TRUE, 5)
ON CONFLICT DO NOTHING;

-- Social Links
INSERT INTO public.social_links (platform, url, icon, display_order, is_active)
VALUES
    ('Instagram', 'https://instagram.com/flourishwomens',  'instagram', 1, TRUE),
    ('Facebook',  'https://facebook.com/flourishwomens',   'facebook',  2, TRUE),
    ('Pinterest', 'https://pinterest.com/flourishwomens',  'pinterest', 3, TRUE),
    ('YouTube',   'https://youtube.com/@flourishwomens',   'youtube',   4, TRUE)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- SECTION 21: AUTOMATIC USER SYNC & ADMIN SETUP
-- ─────────────────────────────────────────────
-- Auto-confirm any pending unconfirmed user accounts in auth.users
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- Automatically backfill any existing auth.users into public.profiles as admin
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', 'Admin User'), 
    'admin'::user_role
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', email = EXCLUDED.email;

-- ─────────────────────────────────────────────
-- 📋 HOW TO CREATE OR RESET ADMIN CREDENTIALS:
-- ─────────────────────────────────────────────
-- 1. In Supabase Dashboard -> Authentication -> Users -> Add User (Create User)
-- 2. Toggle 'Auto Confirm User?' to ON (so email verification is skipped)
-- 3. Enter your Email and Password -> Click 'Create User'
-- 4. Log in immediately at: /admin/login
--
-- If you already created a user and cannot log in, run this in Supabase SQL Editor:
--   UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'your-email@example.com';
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- ─────────────────────────────────────────────
