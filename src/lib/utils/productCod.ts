/**
 * Resolves whether Cash on Delivery (COD) is available for a product.
 * Default is true (active) unless explicitly deactivated by admin.
 */
export function isProductCodAvailable(product?: {
  is_cod_available?: boolean | null;
  meta_description?: string | null;
} | null): boolean {
  if (!product) return true;

  // 1. Direct column check if present in database
  if (typeof product.is_cod_available === 'boolean') {
    return product.is_cod_available;
  }

  // 2. Metadata fallback check (used if database has not run migration)
  if (product.meta_description && typeof product.meta_description === 'string') {
    if (
      product.meta_description.includes('[COD:NO]') ||
      product.meta_description.includes('cod:false')
    ) {
      return false;
    }
    if (
      product.meta_description.includes('[COD:YES]') ||
      product.meta_description.includes('cod:true')
    ) {
      return true;
    }
  }

  // 3. Default is active (true)
  return true;
}

/**
 * Encodes the COD status into meta_description for safe cross-version persistence.
 */
export function formatMetaDescriptionWithCod(
  existingMeta: string | null | undefined,
  isCodAvailable: boolean
): string {
  const base = (existingMeta || '')
    .replace(/\[COD:(YES|NO)\]/g, '')
    .trim();
  const codTag = isCodAvailable ? '[COD:YES]' : '[COD:NO]';
  return base ? `${base} ${codTag}` : codTag;
}

