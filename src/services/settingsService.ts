import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SiteSettings, SocialLink } from '@/types/store.types';

export async function getSiteSettings(): Promise<SiteSettings> {
  const fallbackSettings: SiteSettings = {
    id: 'global',
    site_name: "Flourish Women's",
    tagline: 'Wear Your Own Story',
    announcement_text: 'Discover Timeless Sarees for Every Occasion | Complimentary Styling Assistance',
    is_announcement_active: true,
    whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916235035705',
    contact_email: 'concierge@flourishwomen.com',
    contact_phone: '+91 62350 35705',
    address: 'Flourish Studio, Kanchipuram & Chennai, Tamil Nadu, India',
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

    const settingsData = data as SiteSettings | null;

    if (!error && settingsData) {
      return {
        ...fallbackSettings,
        ...settingsData,
        address: settingsData.address || fallbackSettings.address,
        contact_phone: settingsData.contact_phone || fallbackSettings.contact_phone,
        contact_email: settingsData.contact_email || fallbackSettings.contact_email,
        whatsapp_number: settingsData.whatsapp_number || fallbackSettings.whatsapp_number,
      };
    }
  } catch (err) {
    console.warn('Site settings query fallback used:', err);
  }

  return fallbackSettings;
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
