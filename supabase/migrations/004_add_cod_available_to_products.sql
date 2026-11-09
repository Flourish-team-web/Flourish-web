-- ===================================================================
-- Flourish Woman: Add Cash on Delivery (COD) column to products table
-- Default is TRUE (COD Available)
-- ===================================================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_cod_available BOOLEAN NOT NULL DEFAULT TRUE;

COMMENT ON COLUMN public.products.is_cod_available IS 'Whether Cash on Delivery (COD) is available for this product. Default TRUE.';

