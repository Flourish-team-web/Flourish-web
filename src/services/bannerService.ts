import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HeroBanner, PromotionalBanner, Reel, Testimonial, EditorialContent } from '@/types/store.types';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    client_name: 'Ananya Sharma',
    location: 'Bangalore',
    saree_worn: 'Sapphire Royal Kanchipuram',
    content: 'The silk quality and Korvai zari work exceeded all expectations. It was the centerpiece of my reception and I received endless compliments on the authenticity of the drape.',
    rating: 5,
    avatar_url: null,
    is_featured: true,
    display_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 't-2',
    client_name: 'Dr. Meenakshi Iyer',
    location: 'Chennai',
    saree_worn: 'Emerald Kadwa Banarasi Brocade',
    content: 'Flourish Women brings back the lost glory of genuine handlooms. The WhatsApp concierge was so patient in sending me daylight video drapes before I made my purchase.',
    rating: 5,
    avatar_url: null,
    is_featured: true,
    display_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 't-3',
    client_name: 'Pooja Singhania',
    location: 'Mumbai',
    saree_worn: 'Blush Pink Pure Organza',
    content: 'Featherlight and exquisitely finished with hand scalloped borders. Truly feels like wearing poetry. Will definitely be a lifetime customer!',
    rating: 5,
    avatar_url: null,
    is_featured: true,
    display_order: 2,
    created_at: '',
    updated_at: '',
  },
];

const FALLBACK_PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'promo-1',
    title: 'PURE SILK MARK CERTIFIED',
    subtitle: '100% genuine mulberry silk threads & authentic tested zari craftsmanship.',
    badge_text: 'PURITY GUARANTEE',
    cta_text: null,
    cta_link: null,
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    image_mobile_url: null,
    bg_color: '#071324',
    display_order: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'promo-2',
    title: 'DIRECT FROM MASTER WEAVERS',
    subtitle: 'Fair-trade authentic handloom sarees sourced straight from regional weaver clusters.',
    badge_text: 'ETHICAL LOOMS',
    cta_text: null,
    cta_link: null,
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
    image_mobile_url: null,
    bg_color: '#071324',
    display_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'promo-3',
    title: 'COMPLIMENTARY BESPOKE FINISHING',
    subtitle: 'Pre-stitched fall & pico with custom hand-knotted artisanal tassels included.',
    badge_text: 'READY TO DRAPE',
    cta_text: null,
    cta_link: null,
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    image_mobile_url: null,
    bg_color: '#071324',
    display_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn('Hero banners query fallback used:', err);
  }
  return [];
}

export async function getPromotionalBanners(): Promise<PromotionalBanner[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('promotional_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn('Promotional banners query fallback used:', err);
  }
  return FALLBACK_PROMOTIONAL_BANNERS;
}

export async function getReels(): Promise<Reel[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('reels')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn('Reels query fallback used:', err);
  }
  return [];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn('Testimonials fallback used:', err);
  }
  return FALLBACK_TESTIMONIALS;
}

export async function getPublishedEditorials(limit = 3): Promise<EditorialContent[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('editorial_content')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.warn('Editorials query fallback used:', err);
  }
  return [];
}
