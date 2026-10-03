import { Database } from './database.types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Collection = Database['public']['Tables']['collections']['Row'];
export type HeroBanner = Database['public']['Tables']['hero_banners']['Row'];
export type PromotionalBanner = Database['public']['Tables']['promotional_banners']['Row'];
export type Reel = Database['public']['Tables']['reels']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type EditorialContent = Database['public']['Tables']['editorial_content']['Row'];
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];

export interface ProductWithDetails extends Product {
  images: ProductImage[];
  category?: Category | null;
  collection?: Collection | null;
}

export interface ProductFilterParams {
  categorySlug?: string;
  collectionSlug?: string;
  fabric?: string;
  sareeType?: string;
  color?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'featured';
  availability?: 'in_stock' | 'out_of_stock' | 'made_to_order' | 'all';
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  fabric?: string | null;
  addedAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  fabric?: string | null;
  sku?: string | null;
  quantity: number;
  addedAt: string;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'collection';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  imageUrl?: string;
}

