import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Category } from '@/types/store.types';
import { FALLBACK_CATEGORIES } from '@/lib/data/catalogFallback';

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('Categories query fallback used:', err);
  }

  return FALLBACK_CATEGORIES.filter((c) => c.is_active);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Category by slug fallback used:', err);
  }

  const normalized = slug.toLowerCase().trim();
  const fallback = FALLBACK_CATEGORIES.find(
    (c) => c.slug.toLowerCase() === normalized || c.id.toLowerCase() === normalized
  );

  return fallback || null;
}
