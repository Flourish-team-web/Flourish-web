import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Award, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export const metadata: Metadata = {
  title: "Our Heritage & Story — Flourish Women's",
  description: "Learn about the Flourish Women's philosophy: timeless Indian handloom craft, master weaver empowerment, and bespoke bridal couture.",
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16 bg-[#FCFCFD]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] uppercase tracking-wider font-light mb-8">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0284C7] font-semibold">About Flourish Women's</span>
        </div>

        {/* Hero Narrative Section */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-16">
          <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
            The Philosophy of Draping
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#0F172A] tracking-tight font-normal leading-tight">
            Where Ancient Weaves Meet Modern Womanhood
          </h1>
          <p className="text-sm sm:text-base text-[#475569] font-light leading-relaxed max-w-2xl mx-auto">
            Flourish Women&apos;s was born from an unyielding devotion to authentic Indian textiles. We believe that a saree is not merely six yards of fabric; it is a timeless canvas of identity, heritage, and poetic memory.
          </p>
        </div>

        {/* Editorial Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20">
          <div className="relative aspect-[4/5] bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
              alt="Flourish Women's Saree Drapery"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
              alt="Artisanal Handloom Loom"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-8 md:p-14 mb-20 shadow-xs">
          <SectionHeading
            eyebrow="Our Commitments"
            title="The Flourish Purity Code"
            subtitle="The enduring values that guide every saree we select and present to you"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-3.5 text-center md:text-left shadow-xs hover:border-[#0284C7]/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center mx-auto md:mx-0 shadow-2xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#0F172A] font-medium">100% Handloom Origin</h3>
              <p className="text-xs sm:text-sm text-[#475569] font-light leading-relaxed">
                We partner exclusively with authentic regional weaving cooperatives across Kanchipuram, Varanasi, Chanderi, and Bengal. No powerloom substitutions.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-3.5 text-center md:text-left shadow-xs hover:border-[#0284C7]/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center mx-auto md:mx-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#0F172A] font-medium">Pure Fibers & Real Zari</h3>
              <p className="text-xs sm:text-sm text-[#475569] font-light leading-relaxed">
                Natural mulberry silk, organza, raw tussar, and fine cottons tested for pure thread density, genuine weight, and lustrous fall.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-3.5 text-center md:text-left shadow-xs hover:border-[#0284C7]/40 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center mx-auto md:mx-0 shadow-2xs">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-[#0F172A] font-medium">Fair Weaver Patronage</h3>
              <p className="text-xs sm:text-sm text-[#475569] font-light leading-relaxed">
                By purchasing through Flourish Women&apos;s, you directly empower master weavers and their artisan families with honorable remuneration.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div>
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold mb-2">
              Bespoke Bridal & Occasion Care
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-normal tracking-tight">
              Let Us Weave Your Next Chapter
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] font-light mt-2 max-w-lg mx-auto">
              Whether for your wedding day, reception, or a milestone festival, our saree stylists are delighted to assist you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#071324] text-white px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>

            <a
              href={buildBespokeWhatsAppUrl(undefined)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] text-white px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-[#25D366]/20"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
