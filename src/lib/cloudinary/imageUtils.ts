/**
 * Image helper utility for Cloudinary and responsive CDN image optimization.
 */

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  crop?: 'fill' | 'fit' | 'thumb' | 'scale';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
}

export function getOptimizedImageUrl(
  src: string | null | undefined,
  options: ImageOptions = {}
): string {
  if (!src) {
    return '/images/placeholder-saree.svg';
  }

  // If it's a Cloudinary URL, apply transforms
  if (src.includes('res.cloudinary.com')) {
    const { width, height, quality = 'auto', crop = 'fill', format = 'auto' } = options;
    const transformSegments: string[] = [`f_${format}`, `q_${quality}`];

    if (width) transformSegments.push(`w_${width}`);
    if (height) transformSegments.push(`h_${height}`);
    if (crop) transformSegments.push(`c_${crop}`);

    const transformStr = transformSegments.join(',');

    // Insert transform after '/upload/'
    if (src.includes('/upload/')) {
      return src.replace('/upload/', `/upload/${transformStr}/`);
    }
  }

  // Return source if it's already full URL or local asset
  return src;
}
