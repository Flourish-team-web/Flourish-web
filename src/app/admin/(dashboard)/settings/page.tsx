'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, CheckCircle2, AlertCircle, Loader2, Phone, Mail, MapPin, Award, Share2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Form State
  const [siteName, setSiteName] = React.useState('Flourish Woman');
  const [tagline, setTagline] = React.useState('Timeless Sarees for Modern Women');
  const [announcementText, setAnnouncementText] = React.useState('');
  const [isAnnouncementActive, setIsAnnouncementActive] = React.useState(true);
  const [whatsappNumber, setWhatsappNumber] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [instagramUrl, setInstagramUrl] = React.useState('');
  const [facebookUrl, setFacebookUrl] = React.useState('');
  const [pinterestUrl, setPinterestUrl] = React.useState('');
  const [youtubeUrl, setYoutubeUrl] = React.useState('');

  const fetchSettings = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data: settingsData, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    const data = settingsData as SiteSettings | null;

    if (!error && data) {
      setSettings(data);
      setSiteName(data.site_name || 'Flourish Woman');
      setTagline(data.tagline || '');
      setAnnouncementText(data.announcement_text || '');
      setIsAnnouncementActive(data.is_announcement_active);
      setWhatsappNumber(data.whatsapp_number || '');
      setContactEmail(data.contact_email || '');
      setContactPhone(data.contact_phone || '');
      setAddress(data.address || '');
      setInstagramUrl(data.instagram_url || '');
      setFacebookUrl(data.facebook_url || '');
      setPinterestUrl(data.pinterest_url || '');
      setYoutubeUrl(data.youtube_url || '');
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const supabase = createClient();
    const payload = {
      id: 'global',
      site_name: siteName.trim(),
      tagline: tagline.trim() || null,
      announcement_text: announcementText.trim() || null,
      is_announcement_active: isAnnouncementActive,
      whatsapp_number: whatsappNumber.trim() || null,
      contact_email: contactEmail.trim() || null,
      contact_phone: contactPhone.trim() || null,
      address: address.trim() || null,
      instagram_url: instagramUrl.trim() || null,
      facebook_url: facebookUrl.trim() || null,
      pinterest_url: pinterestUrl.trim() || null,
      youtube_url: youtubeUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await (supabase.from('site_settings') as any)
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;

      setSuccessMessage('Site settings successfully updated.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
        <p className="text-xs uppercase tracking-widest text-[#706B64]">Loading site settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1816]">Boutique Site Settings</h1>
          <p className="text-xs text-[#706B64] font-sans mt-0.5">
            Manage your storefront WhatsApp number, contact information, announcement bar, and social channels.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="flex items-center gap-1.5"
          isLoading={isSaving}
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </Button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-[#EDF5F0] border border-[#BFDCCE] text-xs text-[#1B4332] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. WhatsApp & Direct Concierge Channel */}
      <div className="bg-[#FDFBF7] border border-[#EAE3D2] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#EAE3D2] pb-2">
          <Phone className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-base text-[#1A1816]">WhatsApp Concierge & Ordering</h3>
        </div>

        <p className="text-xs text-[#706B64] font-light">
          This WhatsApp number is used dynamically on every customer enquiry button across the website without modifying code.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="WhatsApp Business Number (with country code) *"
            required
            placeholder="919876543210"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
          <Input
            label="Customer Support Calling Phone"
            placeholder="+91 98765 43210"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Brand Identity & Tagline */}
      <div className="bg-[#FDFBF7] border border-[#EAE3D2] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#EAE3D2] pb-2">
          <Award className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-base text-[#1A1816]">Brand Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Brand Name *"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
          <Input
            label="Brand Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Official Contact Email"
            type="email"
            placeholder="concierge@flourishwoman.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <Input
            label="Boutique Studio / City"
            placeholder="Boutique Studio, India"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Top Announcement Bar */}
      <div className="bg-[#FDFBF7] border border-[#EAE3D2] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-2">
          <h3 className="font-serif text-base text-[#1A1816]">Storefront Announcement Ticker</h3>
          <label className="flex items-center gap-2 text-xs text-[#1A1816] cursor-pointer">
            <input
              type="checkbox"
              checked={isAnnouncementActive}
              onChange={(e) => setIsAnnouncementActive(e.target.checked)}
              className="accent-[#1A1816]"
            />
            <span className="font-medium">Active on Storefront</span>
          </label>
        </div>

        <Input
          label="Announcement Text"
          placeholder="Discover Timeless Sarees for Every Occasion | Complimentary Styling Assistance"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
        />
      </div>

      {/* 4. Social Media Links */}
      <div className="bg-[#FDFBF7] border border-[#EAE3D2] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#EAE3D2] pb-2">
          <Share2 className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-base text-[#1A1816]">Social Channels</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Instagram Profile URL"
            placeholder="https://instagram.com/flourishwoman"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
          />
          <Input
            label="Facebook Page URL"
            placeholder="https://facebook.com/flourishwoman"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
          />
          <Input
            label="Pinterest URL"
            placeholder="https://pinterest.com/flourishwoman"
            value={pinterestUrl}
            onChange={(e) => setPinterestUrl(e.target.value)}
          />
          <Input
            label="YouTube Channel URL"
            placeholder="https://youtube.com/@flourishwoman"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
