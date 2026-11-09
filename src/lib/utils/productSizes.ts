export const STANDARD_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '3XL',
  'Free Size',
] as const;

export type StandardProductSize = (typeof STANDARD_SIZES)[number];

/**
 * Checks if a string contains dress sizes and parses them into a string array.
 * Returns empty array [] if the product has saree specifications (e.g. "5.5 Meters Saree Length").
 */
export function parseProductSizes(dimensions?: string | null): string[] {
  if (!dimensions || typeof dimensions !== 'string') return [];
  const trimmed = dimensions.trim();
  if (!trimmed) return [];

  // If it explicitly starts with "Sizes:" or "Size:"
  if (/^sizes?\s*:\s*/i.test(trimmed)) {
    const rawList = trimmed.replace(/^sizes?\s*:\s*/i, '');
    return rawList
      .split(/[,|/]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !['none', 'nil', 'n/a', 'null', 'no', 'disabled'].includes(s.toLowerCase()));
  }

  // If it mentions saree meters or saree drape keywords, it is definitely a saree spec
  if (
    /meter|mtr|running|saree|blouse|pallu|drape/i.test(trimmed) &&
    !trimmed.toLowerCase().includes('size')
  ) {
    return [];
  }

  // Check if comma-separated tokens match standard sizes
  const tokens = trimmed.split(/[,|/]/).map((s) => s.trim()).filter(Boolean);
  if (tokens.length > 0) {
    const standardMatchCount = tokens.filter((t) =>
      STANDARD_SIZES.some((std) => std.toLowerCase() === t.toLowerCase())
    ).length;

    // If at least half of the items or at least 2 tokens match standard sizes
    if (standardMatchCount >= 2 || standardMatchCount === tokens.length) {
      return tokens;
    }
  }

  return [];
}

/**
 * Formats an array of sizes into a persistent dimensions string.
 * e.g. ["S", "M", "L", "XL", "XXL"] => "Sizes: S, M, L, XL, XXL"
 */
export function formatSizesToDimensions(sizes: string[]): string {
  if (!sizes || sizes.length === 0) return '';
  const clean = sizes.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return '';
  return `Sizes: ${clean.join(', ')}`;
}

/**
 * Returns true if the product has size options enabled.
 */
export function hasProductSizes(dimensions?: string | null): boolean {
  return parseProductSizes(dimensions).length > 0;
}

