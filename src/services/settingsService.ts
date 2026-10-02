import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SiteSettings, SocialLink } from '@/types/store.types';

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    id: 'global',
    site_name: "Flourish Women's",
    tagline: 'Wear Your Own Story',
    announcement_text: 'Discover Timeless Sarees for Every Occasion | Complimentary Styling Assistance',
    is_announcement_active: true,
    whatsapp_number: '919876543210',
    contact_email: 'concierge@flourishwomens.com',
    contact_phone: '+91 98765 43210',
    address: 'Boutique Studio, India',
    instagram_url: 'https://instagram.com',
    facebook_url: 'https://facebook.com',
    pinterest_url: 'https://pinterest.com',
    youtube_url: 'https://youtube.com',
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error || !data) return fallbackSettings;
    return data;
  } catch (err) {
    console.error('Failed to get site settings:', err);
    return fallbackSettings;
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error('Failed to get social links:', err);
    return [];
  }
}
