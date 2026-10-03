'use client';

import * as React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, HeartHandshake, Compass, ArrowRight, ChevronDown } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export function Footer() {
  const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <footer className="bg-gradient-to-b from-[#06182E] via-[#041021] to-[#01060E] text-[#F8FAFC] pt-16 pb-24 lg:pb-12 border-t border-[#163860]">
      {/* Brand Value Pillars */}
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 pb-12 mb-12 border-b border-[#163860]/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#092240]/40 to-transparent border border-[#163860]/40">
            <div className="w-10 h-10 rounded-full bg-[#0A2647] border border-[#1E4D7E] flex items-center justify-center text-[#38BDF8] mb-3 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs sm:text-sm tracking-wider uppercase text-white font-medium">Authentic Weaves</h4>
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-light mt-1">Direct from master Indian weavers</p>
          </div>

          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#092240]/40 to-transparent border border-[#163860]/40">
            <div className="w-10 h-10 rounded-full bg-[#0A2647] border border-[#1E4D7E] flex items-center justify-center text-[#38BDF8] mb-3 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs sm:text-sm tracking-wider uppercase text-white font-medium">Purity Certified</h4>
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-light mt-1">100% Genuine silk & natural fibers</p>
          </div>

          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#092240]/40 to-transparent border border-[#163860]/40">
            <div className="w-10 h-10 rounded-full bg-[#0A2647] border border-[#1E4D7E] flex items-center justify-center text-[#38BDF8] mb-3 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs sm:text-sm tracking-wider uppercase text-white font-medium">Personal Styling</h4>
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-light mt-1">Dedicated saree & bridal concierge</p>
          </div>

          <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#092240]/40 to-transparent border border-[#163860]/40">
            <div className="w-10 h-10 rounded-full bg-[#0A2647] border border-[#1E4D7E] flex items-center justify-center text-[#38BDF8] mb-3 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs sm:text-sm tracking-wider uppercase text-white font-medium">Worldwide Delivery</h4>
            <p className="text-[11px] sm:text-xs text-[#94A3B8] font-light mt-1">Secure bespoke packaging to your doorstep</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 pb-4 md:pb-0">
            <BrandLogo size="lg" showTagline={true} theme="dark" />
            <p className="text-xs text-[#94A3B8] font-light leading-relaxed max-w-sm pt-2">
              Celebrating the timeless poetry of Indian handlooms. Each drape is handcrafted to honor tradition, grace modern womanhood, and weave unforgettable memories for every chapter of your life.
            </p>
            <div className="pt-2">
              <a
                href={buildBespokeWhatsAppUrl(undefined)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8] hover:text-[#7DD3FC] hover:underline font-medium transition-colors"
              >
                <span>Connect with Concierge on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b border-[#162E52]/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left group"
              aria-expanded={!!openSections['collections']}
            >
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#38BDF8] font-semibold">
                Saree Collections
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 md:hidden ${
                  openSections['collections'] ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            <div className={`${openSections['collections'] ? 'block pt-3 pb-2' : 'hidden md:block'} md:mt-3`}>
              <ul className="space-y-2 text-xs text-[#94A3B8] font-light">
                <li>
                  <Link href="/products?sort=newest" className="hover:text-white transition-colors block py-0.5">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors block py-0.5">
                    All Sarees & Collections
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors block py-0.5">
                    Explore Weaves
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Brand & Boutique */}
          <div className="border-b border-[#162E52]/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('heritage')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left group"
              aria-expanded={!!openSections['heritage']}
            >
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#38BDF8] font-semibold">
                Flourish Heritage
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 md:hidden ${
                  openSections['heritage'] ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            <div className={`${openSections['heritage'] ? 'block pt-3 pb-2' : 'hidden md:block'} md:mt-3`}>
              <ul className="space-y-2 text-xs text-[#94A3B8] font-light">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors block py-0.5">
                    Our Brand Story
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors block py-0.5">
                    Bespoke Bridal Inquiries
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors block py-0.5">
                    Contact & Studio
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-white transition-colors block py-0.5">
                    Staff / Admin Access
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Saree Care & Assistance */}
          <div className="border-b border-[#162E52]/80 md:border-b-0 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('inquiries')}
              className="w-full flex items-center justify-between py-2 md:py-0 md:cursor-default text-left group"
              aria-expanded={!!openSections['inquiries']}
            >
              <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-[#38BDF8] font-semibold">
                Bespoke Inquiries
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-[#38BDF8] transition-transform duration-200 md:hidden ${
                  openSections['inquiries'] ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            <div className={`${openSections['inquiries'] ? 'block pt-3 pb-2' : 'hidden md:block'} md:mt-3 space-y-3`}>
              <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
                Have questions about fabric, blouse customization, or bridal timelines?
              </p>
              <div className="pt-1">
                <p className="text-xs text-white font-medium">+91 98765 43210</p>
                <p className="text-xs text-[#64748B] font-light">Mon – Sat, 10am – 7pm IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#162E52] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B] font-light">
          <p>© {new Date().getFullYear()} Flourish Women&apos;s. All rights reserved. Handcrafted with reverence for Indian artisans.</p>
          <div className="flex gap-6 text-[#94A3B8]">
            <span>Authentic Weaves</span>
            <span>Handloom Purity</span>
            <span>Global Concierge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
