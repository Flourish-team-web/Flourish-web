import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithDetails, ProductFilterParams, PaginatedResult } from '@/types/store.types';
import { FALLBACK_PRODUCTS } from '@/lib/data/catalogFallback';

export async function getProducts(params: ProductFilterParams = {}): Promise<PaginatedResult<ProductWithDetails>> {
  try {
    const supabase = await createServerSupabaseClient();
    const page = params.offset ? Math.floor(params.offset / (params.limit || 12)) + 1 : 1;
    const limit = params.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        collection:collections(*)
      `, { count: 'exact' })
      .eq('is_published', true);

    if (params.categorySlug) {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', params.categorySlug)
        .single();
      const cat = catData as { id: string } | null;
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (params.collectionSlug) {
      const { data: colData } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', params.collectionSlug)
        .single();
      const col = colData as { id: string } | null;
      if (col) {
        query = query.eq('collection_id', col.id);
      }
    }

    if (params.fabric) {
      query = query.ilike('fabric', `%${params.fabric}%`);
    }

    if (params.occasion) {
      query = query.ilike('occasion', `%${params.occasion}%`);
    }

    if (params.color) {
      query = query.ilike('color', `%${params.color}%`);
    }

    if (params.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }

    if (params.availability && params.availability !== 'all') {
      query = query.eq('availability', params.availability);
    }

    // Sort order
    switch (params.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('is_bestseller', { ascending: false }).order('created_at', { ascending: false });
        break;
      case 'featured':
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('is_new_arrival', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    const { data, error, count } = await query.range(from, to);

    if (!error && data && data.length > 0) {
      const formattedData = (data as unknown as ProductWithDetails[]) || [];
      const totalCount = count || formattedData.length;
      return {
        data: formattedData,
        count: totalCount,
        hasMore: to < totalCount - 1,
        page,
        pageSize: limit,
      };
    }
  } catch (err) {
    console.warn('Supabase product query skipped/failed, using fallback catalog:', err);
  }

  // Fallback filtering
  return filterFallbackProducts(params);
}

function filterFallbackProducts(params: ProductFilterParams): PaginatedResult<ProductWithDetails> {
  let list = [...FALLBACK_PRODUCTS];

  if (params.categorySlug) {
    const slug = params.categorySlug.toLowerCase();
    list = list.filter((p) => 
      p.category?.slug.toLowerCase() === slug || 
      p.fabric?.toLowerCase().includes(slug) ||
      p.category_id?.toLowerCase().includes(slug)
    );
  }

  if (params.collectionSlug) {
    const slug = params.collectionSlug.toLowerCase();
    list = list.filter((p) => 
      p.collection?.slug.toLowerCase() === slug || 
      p.collection_id?.toLowerCase().includes(slug) ||
      p.occasion?.toLowerCase().includes(slug)
    );
  }

  if (params.fabric) {
    const f = params.fabric.toLowerCase();
    list = list.filter((p) => p.fabric?.toLowerCase().includes(f));
  }

  if (params.occasion) {
    const o = params.occasion.toLowerCase();
    list = list.filter((p) => p.occasion?.toLowerCase().includes(o));
  }

  if (params.color) {
    const c = params.color.toLowerCase();
    list = list.filter((p) => p.color?.toLowerCase().includes(c));
  }

  if (params.minPrice !== undefined) {
    list = list.filter((p) => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= params.maxPrice!);
  }

  if (params.availability && params.availability !== 'all') {
    list = list.filter((p) => p.availability === params.availability);
  }

  if (params.searchQuery) {
    const q = params.searchQuery.toLowerCase();
    list = list.filter((p) => 
      p.name.toLowerCase().includes(q) || 
      p.fabric?.toLowerCase().includes(q) ||
      p.short_description?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.name.toLowerCase().includes(q) ||
      p.collection?.name.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (params.sortBy) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
      break;
    case 'featured':
      list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      break;
    case 'newest':
    default:
      list.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
      break;
  }

  const limit = params.limit || 12;
  const offset = params.offset || 0;
  const page = Math.floor(offset / limit) + 1;
  const paged = list.slice(offset, offset + limit);

  return {
    data: paged,
    count: list.length,
    hasMore: offset + limit < list.length,
    page,
    pageSize: limit,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        collection:collections(*)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (!error && data) {
      const product = data as unknown as ProductWithDetails;
      if (product.images) {
        product.images.sort((a, b) => a.display_order - b.display_order);
      }
      return product;
    }
  } catch (err) {
    console.warn('Supabase product query skipped/failed, checking fallback:', err);
  }

  const normalized = slug.toLowerCase().trim();
  const fallback = FALLBACK_PRODUCTS.find(
    (p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized
  );

  return fallback || null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithDetails[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        collection:collections(*)
      `)
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data as unknown as ProductWithDetails[];
    }
  } catch (err) {
    console.warn('Featured products fallback used:', err);
  }

  return FALLBACK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
}

export async function getNewArrivalProducts(limit = 8): Promise<ProductWithDetails[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        collection:collections(*)
      `)
      .eq('is_published', true)
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data as unknown as ProductWithDetails[];
    }
  } catch (err) {
    console.warn('New arrivals fallback used:', err);
  }

  return FALLBACK_PRODUCTS.filter((p) => p.is_new_arrival).slice(0, limit);
}
