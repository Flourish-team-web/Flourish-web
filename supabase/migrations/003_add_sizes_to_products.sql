-- ===================================================================
-- Flourish Woman: Add dress sizes support
-- Enables size selection for Kurtis, Gowns, and Variety Dresses
-- ===================================================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT NULL;

COMMENT ON COLUMN public.products.sizes IS 'Available apparel sizes for variety dresses (e.g. S, M, L, XL, XXL). Null for Sarees.';

