-- =====================================================================
-- FLOURISH WOMAN — INITIAL DATABASE SCHEMA MIGRATION (PHASE 1)
-- File: supabase/migrations/001_initial_schema.sql
-- Description: Complete PostgreSQL schema with UUIDs, RLS, Indexes,
-- Constraints, Triggers, and Max-5-Image enforcement.
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
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

-- 3. UTILITY FUNCTIONS (TRIGGERS & SECURITY)

-- Automatic updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helper function to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically insert a profile row when a new auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    banner_url TEXT,
    thumbnail_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    short_description TEXT,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_price NUMERIC(12, 2) CHECK (compare_price IS NULL OR compare_price >= price),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    fabric TEXT,
    saree_type TEXT,
    color TEXT,
    occasion TEXT,
    blouse_details TEXT,
    wash_care TEXT,
    dimensions TEXT,
    availability product_availability NOT NULL DEFAULT 'in_stock',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. PRODUCT IMAGES TABLE (Enforced Max 5 images per product)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger function enforcing maximum 5 images per product
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

-- 9. HERO BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT DEFAULT 'Explore Collection',
    cta_link TEXT DEFAULT '/products',
    image_desktop_url TEXT NOT NULL,
    image_mobile_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_hero_banners_updated_at
    BEFORE UPDATE ON public.hero_banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. PROMOTIONAL BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.promotional_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_text TEXT,
    cta_text TEXT,
    cta_link TEXT,
    image_url TEXT,
    bg_color TEXT DEFAULT '#F9F6F0',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_promotional_banners_updated_at
    BEFORE UPDATE ON public.promotional_banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. REELS TABLE (Fashion Video Highlights)
CREATE TABLE IF NOT EXISTS public.reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT NOT NULL,
    view_count_label TEXT DEFAULT '10.2k views',
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_reels_updated_at
    BEFORE UPDATE ON public.reels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    location TEXT,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    saree_worn TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. EDITORIAL CONTENT TABLE (Stories, Weaves & Heritage)
CREATE TABLE IF NOT EXISTS public.editorial_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    subtitle TEXT,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    read_time TEXT DEFAULT '4 min read',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_editorial_content_updated_at
    BEFORE UPDATE ON public.editorial_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. ENQUIRIES TABLE (WhatsApp / Direct Order Requests)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_location TEXT,
    message TEXT,
    status enquiry_status NOT NULL DEFAULT 'new',
    source TEXT DEFAULT 'whatsapp_button',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_enquiries_updated_at
    BEFORE UPDATE ON public.enquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. ENQUIRY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.enquiry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    product_price NUMERIC(12, 2),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. SITE SETTINGS TABLE (Singleton)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    site_name TEXT NOT NULL DEFAULT 'Flourish Woman',
    tagline TEXT DEFAULT 'Timeless Sarees for Modern Women',
    announcement_text TEXT DEFAULT 'Discover Timeless Sarees for Every Occasion | Complimentary Styling Assistance',
    is_announcement_active BOOLEAN NOT NULL DEFAULT TRUE,
    whatsapp_number TEXT DEFAULT '919876543210',
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    pinterest_url TEXT,
    youtube_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initialize default row for site settings if not present
INSERT INTO public.site_settings (id, site_name, tagline, announcement_text)
VALUES ('global', 'Flourish Woman', 'Timeless Sarees for Modern Women', 'Discover Timeless Sarees for Every Occasion | Complimentary Styling Assistance')
ON CONFLICT (id) DO NOTHING;

-- 17. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 18. PERFORMANCE INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_published_featured ON public.products(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_products_published_new ON public.products(is_published, is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_published_bestseller ON public.products(is_published, is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_reels_active ON public.reels(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON public.hero_banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_editorial_published ON public.editorial_content(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

-- Full text search support for products
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || coalesce(fabric, '') || ' ' || coalesce(occasion, '')));

-- =====================================================================
-- 19. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by owner or admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- CATEGORIES POLICIES (Public read active, Admin write)
CREATE POLICY "Public read active categories"
    ON public.categories FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- COLLECTIONS POLICIES (Public read active, Admin write)
CREATE POLICY "Public read active collections"
    ON public.collections FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage collections"
    ON public.collections FOR ALL
    USING (public.is_admin());

-- PRODUCTS POLICIES (Public read published, Admin write)
CREATE POLICY "Public read published products"
    ON public.products FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins manage products"
    ON public.products FOR ALL
    USING (public.is_admin());

-- PRODUCT IMAGES POLICIES
CREATE POLICY "Public read product images"
    ON public.product_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE public.products.id = public.product_images.product_id
            AND (public.products.is_published = TRUE OR public.is_admin())
        )
    );

CREATE POLICY "Admins manage product images"
    ON public.product_images FOR ALL
    USING (public.is_admin());

-- HERO BANNERS POLICIES
CREATE POLICY "Public read active hero banners"
    ON public.hero_banners FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage hero banners"
    ON public.hero_banners FOR ALL
    USING (public.is_admin());

-- PROMOTIONAL BANNERS POLICIES
CREATE POLICY "Public read active promotional banners"
    ON public.promotional_banners FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage promotional banners"
    ON public.promotional_banners FOR ALL
    USING (public.is_admin());

-- REELS POLICIES
CREATE POLICY "Public read active reels"
    ON public.reels FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage reels"
    ON public.reels FOR ALL
    USING (public.is_admin());

-- TESTIMONIALS POLICIES
CREATE POLICY "Public read testimonials"
    ON public.testimonials FOR SELECT
    USING (is_featured = TRUE OR public.is_admin());

CREATE POLICY "Admins manage testimonials"
    ON public.testimonials FOR ALL
    USING (public.is_admin());

-- EDITORIAL CONTENT POLICIES
CREATE POLICY "Public read published editorial"
    ON public.editorial_content FOR SELECT
    USING (is_published = TRUE OR public.is_admin());

CREATE POLICY "Admins manage editorial"
    ON public.editorial_content FOR ALL
    USING (public.is_admin());

-- ENQUIRIES POLICIES
CREATE POLICY "Anyone can create an enquiry"
    ON public.enquiries FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Admins manage enquiries"
    ON public.enquiries FOR ALL
    USING (public.is_admin());

-- ENQUIRY ITEMS POLICIES
CREATE POLICY "Anyone can create enquiry items"
    ON public.enquiry_items FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Admins manage enquiry items"
    ON public.enquiry_items FOR ALL
    USING (public.is_admin());

-- SITE SETTINGS POLICIES
CREATE POLICY "Public read site settings"
    ON public.site_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins manage site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin());

-- SOCIAL LINKS POLICIES
CREATE POLICY "Public read active social links"
    ON public.social_links FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins manage social links"
    ON public.social_links FOR ALL
    USING (public.is_admin());
