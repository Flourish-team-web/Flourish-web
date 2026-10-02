import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SearchSuggestion, ProductWithDetails, PaginatedResult } from '@/types/store.types';
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES, FALLBACK_COLLECTIONS } from '@/lib/data/catalogFallback';

export async function getSearchSuggestions(queryText: string): Promise<SearchSuggestion[]> {
  const query = queryText.trim().toLowerCase();
  if (!query || query.length < 2) return [];

  try {
    const supabase = await createServerSupabaseClient();
    const suggestions: SearchSuggestion[] = [];

    // 1. Search Categories (max 3)
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, slug, image_url')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(3);

    const categories = categoriesData as Array<{ id: string; name: string; slug: string; image_url: string | null }> | null;

    if (categories && categories.length > 0) {
      for (const cat of categories) {
        suggestions.push({
          type: 'category',
          id: cat.id,
          title: cat.name,
          subtitle: 'Category',
          url: `/categories/${cat.slug}`,
          imageUrl: cat.image_url || undefined,
        });
      }
    }

    // 2. Search Collections (max 3)
    const { data: collectionsData } = await supabase
      .from('collections')
      .select('id, name, slug, thumbnail_url')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(3);

    const collections = collectionsData as Array<{ id: string; name: string; slug: string; thumbnail_url: string | null }> | null;

    if (collections && collections.length > 0) {
      for (const col of collections) {
        suggestions.push({
          type: 'collection',
          id: col.id,
          title: col.name,
          subtitle: 'Collection',
          url: `/collections/${col.slug}`,
          imageUrl: col.thumbnail_url || undefined,
        });
      }
    }

    // 3. Search Products (max 5)
    const { data: productsData } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        fabric,
        price,
        images:product_images(image_url, is_primary)
      `)
      .ilike('name', `%${query}%`)
      .eq('is_published', true)
      .limit(5);

    const products = productsData as Array<{
      id: string;
      name: string;
      slug: string;
      fabric: string | null;
      price: number;
      images: Array<{ image_url: string; is_primary: boolean }>;
    }> | null;

    if (products && products.length > 0) {
      for (const prod of products) {
        const primaryImg = prod.images?.find(
          (img) => img.is_primary
        )?.image_url || prod.images?.[0]?.image_url;

        suggestions.push({
          type: 'product',
          id: prod.id,
          title: prod.name,
          subtitle: prod.fabric ? `${prod.fabric} Saree` : 'Saree',
          url: `/products/${prod.slug}`,
          imageUrl: primaryImg,
        });
      }
    }

    if (suggestions.length > 0) {
      return suggestions;
    }
  } catch (err) {
    console.warn('Supabase search suggestions fallback used:', err);
  }

  // Fallback search suggestions
  const fallbackSuggestions: SearchSuggestion[] = [];

  // Match fallback categories
  FALLBACK_CATEGORIES.filter((c) => c.name.toLowerCase().includes(query))
    .slice(0, 3)
    .forEach((cat) => {
      fallbackSuggestions.push({
        type: 'category',
        id: cat.id,
        title: cat.name,
        subtitle: 'Category',
        url: `/categories/${cat.slug}`,
        imageUrl: cat.image_url || undefined,
      });
    });

  // Match fallback collections
  FALLBACK_COLLECTIONS.filter((c) => c.name.toLowerCase().includes(query))
    .slice(0, 3)
    .forEach((col) => {
      fallbackSuggestions.push({
        type: 'collection',
        id: col.id,
        title: col.name,
        subtitle: 'Collection',
        url: `/collections/${col.slug}`,
        imageUrl: col.thumbnail_url || col.banner_url || undefined,
      });
    });

  // Match fallback products
  FALLBACK_PRODUCTS.filter((p) => 
    p.name.toLowerCase().includes(query) || 
    p.fabric?.toLowerCase().includes(query) ||
    p.color?.toLowerCase().includes(query)
  )
    .slice(0, 5)
    .forEach((prod) => {
      const primaryImg = prod.images?.find((img) => img.is_primary)?.image_url || prod.images?.[0]?.image_url;
      fallbackSuggestions.push({
        type: 'product',
        id: prod.id,
        title: prod.name,
        subtitle: prod.fabric ? `${prod.fabric} Saree` : 'Saree',
        url: `/products/${prod.slug}`,
        imageUrl: primaryImg,
      });
    });

  return fallbackSuggestions;
}

export async function searchProducts(
  searchTerm: string,
  options: { page?: number; limit?: number; fabric?: string; sortBy?: string } = {}
): Promise<PaginatedResult<ProductWithDetails>> {
  const query = searchTerm.trim();
  const page = options.page || 1;
  const limit = options.limit || 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (!query) {
    return { data: [], count: 0, hasMore: false, page, pageSize: limit };
  }

  try {
    const supabase = await createServerSupabaseClient();
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        collection:collections(*)
      `, { count: 'exact' })
      .eq('is_published', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,fabric.ilike.%${query}%,occasion.ilike.%${query}%`);

    if (options.fabric) {
      queryBuilder = queryBuilder.ilike('fabric', `%${options.fabric}%`);
    }

    if (options.sortBy === 'price_asc') {
      queryBuilder = queryBuilder.order('price', { ascending: true });
    } else if (options.sortBy === 'price_desc') {
      queryBuilder = queryBuilder.order('price', { ascending: false });
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    const { data, error, count } = await queryBuilder.range(from, to);

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
    console.warn('Search fallback used:', err);
  }

  // Fallback search
  const q = query.toLowerCase();
  let list = FALLBACK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.fabric?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.short_description?.toLowerCase().includes(q) ||
    p.color?.toLowerCase().includes(q) ||
    p.occasion?.toLowerCase().includes(q)
  );

  if (options.fabric) {
    const f = options.fabric.toLowerCase();
    list = list.filter((p) => p.fabric?.toLowerCase().includes(f));
  }

  if (options.sortBy === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sortBy === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  }

  const offset = (page - 1) * limit;
  const paged = list.slice(offset, offset + limit);

  return {
    data: paged,
    count: list.length,
    hasMore: offset + limit < list.length,
    page,
    pageSize: limit,
  };
}
