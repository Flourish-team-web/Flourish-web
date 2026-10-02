import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Collection } from '@/types/store.types';
import { FALLBACK_COLLECTIONS } from '@/lib/data/catalogFallback';

export async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('Collections query fallback used:', err);
  }

  return FALLBACK_COLLECTIONS.filter((c) => c.is_active);
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('Featured collections fallback used:', err);
  }

  return FALLBACK_COLLECTIONS.filter((c) => c.is_featured);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Collection by slug fallback used:', err);
  }

  const normalized = slug.toLowerCase().trim();
  const fallback = FALLBACK_COLLECTIONS.find(
    (c) => c.slug.toLowerCase() === normalized || c.id.toLowerCase() === normalized
  );

  return fallback || null;
}
