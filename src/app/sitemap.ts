import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://flourishwomens.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  try {
    const supabase = await createServerSupabaseClient();

    const [{ data: productsData }, { data: categoriesData }, { data: collectionsData }] = await Promise.all([
      supabase.from('products').select('slug, updated_at').eq('is_published', true),
      supabase.from('categories').select('slug, updated_at').eq('is_active', true),
      supabase.from('collections').select('slug, updated_at').eq('is_active', true),
    ]);

    const products = productsData as Array<{ slug: string; updated_at: string }> | null;
    const categories = categoriesData as Array<{ slug: string; updated_at: string }> | null;
    const collections = collectionsData as Array<{ slug: string; updated_at: string }> | null;

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((c) => ({
      url: `${siteUrl}/categories/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const collectionRoutes: MetadataRoute.Sitemap = (collections || []).map((col) => ({
      url: `${siteUrl}/collections/${col.slug}`,
      lastModified: new Date(col.updated_at),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
