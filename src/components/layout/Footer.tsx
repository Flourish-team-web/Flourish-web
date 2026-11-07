'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { SiteSettings } from '@/types/store.types';
import { createClient } from '@/lib/supabase/client';

interface FooterProps {
  initialSettings?: SiteSettings | null;
}

export function Footer({ initialSettings }: FooterProps = {}) {
  const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({});
  const [settings, setSettings] = React.useState<SiteSettings | null>(initialSettings ?? null);

  React.useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  React.useEffect(() => {
    const fetchLatestSettings = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .single();
        if (!error && data) {
          setSettings(data as SiteSettings);
        }
      } catch {
        // Fallbacks will gracefully handle display
      }
    };

    if (!initialSettings) {
      fetchLatestSettings();
    }

    const handleUpdate = () => {
      fetchLatestSettings();
    };

    window.addEventListener('site_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('site_settings_updated', handleUpdate);
    };
  }, [initialSettings]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const currentYear = new Date().getFullYear();

  // Admin added settings with graceful fallbacks
  const address = settings?.address?.trim() || 'Flourish Studio, Kanchipuram & Chennai, Tamil Nadu, India';
  const phone = settings?.contact_phone?.trim() || settings?.whatsapp_number?.trim() || '+91 62350 35705';
  const cleanTelHref = phone.replace(/[^0-9+]/g, '');
  const email = settings?.contact_email?.trim() || 'concierge@flourishwomen.com';
  const whatsappNumber = settings?.whatsapp_number?.trim();

  return (
    <footer className="bg-gradient-to-b from-[#06182E] via-[#041021] to-[#01060E] text-[#F8FAFC] pt-14 pb-24 lg:pb-10 border-t border-[#163860]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12">
          {/* 1. Brand Column */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
            <BrandLogo size="lg" showTagline={true} theme="dark" />
            <p className="text-xs text-[#94A3B8] font-light leading-relaxed max-w-sm pt-2">
              Celebrating the timeless poetry of Indian handlooms. Each drape is handcrafted to honor tradition, grace modern womanhood, and weave unforgettable memories for every chapter of your life.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="border-b border-[#162E52]/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('quick-links')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left group"
              aria-expanded={!!openSections['quick-links']}
            >
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#38BDF8] font-semibold">
                Quick Links
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 md:hidden ${
                  openSections['quick-links'] ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            <div className={`${openSections['quick-links'] ? 'block pt-3 pb-2' : 'hidden md:block'} md:mt-4`}>
              <ul className="space-y-2.5 text-xs text-[#94A3B8] font-light">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors block py-0.5">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors block py-0.5">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link href="/products?sort=newest" className="hover:text-white transition-colors block py-0.5">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-white transition-colors block py-0.5">
                    Curated Favorites
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Customer Policies */}
          <div className="border-b border-[#162E52]/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('customer-policies')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left group"
              aria-expanded={!!openSections['customer-policies']}
            >
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#38BDF8] font-semibold">
                Customer Policies
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 md:hidden ${
                  openSections['customer-policies'] ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            <div className={`${openSections['customer-policies'] ? 'block pt-3 pb-2' : 'hidden md:block'} md:mt-4`}>
              <ul className="space-y-2.5 text-xs text-[#94A3B8] font-light">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors block py-0.5">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy" className="hover:text-white transition-colors block py-0.5">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors block py-0.5">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href={buildBespokeWhatsAppUrl(whatsappNumber || undefined)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors block py-0.5"
                  >
                    WhatsApp Inquiry
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. Contact & Location */}
          <div className="border-b border-[#162E52]/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('contact-location')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left group"
              aria-expanded={!!openSections['contact-location']}
            >
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#38BDF8] font-semibold">
                Contact & Location
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 md:hidden ${
                  openSections['contact-location'] ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            <div className={`${openSections['contact-location'] ? 'block pt-3 pb-2' : 'hidden md:block'} md:mt-4 space-y-3.5`}>
              {/* Place / Address */}
              {address && (
                <div className="flex items-start gap-2.5 text-xs text-[#94A3B8] font-light">
                  <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line leading-relaxed">{address}</span>
                </div>
              )}

              {/* Phone */}
              {phone && (
                <div className="flex items-center gap-2.5 text-xs text-[#94A3B8] font-light">
                  <Phone className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <a
                    href={`tel:${cleanTelHref}`}
                    className="hover:text-white transition-colors tracking-wide"
                  >
                    {phone}
                  </a>
                </div>
              )}

              {/* Mail */}
              {email && (
                <div className="flex items-center gap-2.5 text-xs text-[#94A3B8] font-light">
                  <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-white transition-colors truncate"
                  >
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Ekodrix Attribution */}
        <div className="pt-8 border-t border-[#162E52] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] font-light">
          <p className="text-center sm:text-left">
            © {currentYear} Flourish Women&apos;s. All rights reserved.
          </p>

          <p className="text-center sm:text-right">
            Crafted by{' '}
            <a
              href="https://www.ekodrix.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] hover:text-[#7DD3FC] hover:underline font-medium transition-colors"
            >
              Ekodrix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
