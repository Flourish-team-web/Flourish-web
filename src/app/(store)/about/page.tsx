import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Sparkles, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export const metadata: Metadata = {
  title: 'Our Heritage & Story — Flourish Woman',
  description: 'Learn about the Flourish Woman philosophy: timeless Indian handloom craft, master weaver empowerment, and bespoke bridal couture.',
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#706B64] uppercase tracking-wider font-light mb-6">
          <Link href="/" className="hover:text-[#1A1816]">Home</Link>
          <span>/</span>
          <span className="text-[#C5A059]">About Flourish Woman</span>
        </div>

        {/* Hero Narrative Section */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <p className="text-xs font-sans tracking-[0.25em] uppercase text-[#C5A059] font-semibold">
            The Philosophy of Draping
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1A1816] tracking-tight font-normal leading-tight">
            Where Ancient Weaves Meet Modern Womanhood
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] font-light leading-relaxed">
            Flourish Woman was born from an unyielding devotion to authentic Indian textiles. We believe that a saree is not merely six yards of fabric; it is a timeless canvas of identity, heritage, and poetic memory.
          </p>
        </div>

        {/* Editorial Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="relative aspect-[4/5] bg-[#F4EFE6] border border-[#EAE3D2] overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
              alt="Flourish Woman Saree Drapery"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] bg-[#F4EFE6] border border-[#EAE3D2] overflow-hidden shadow-lg">
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
        <div className="bg-[#FAF8F5] border border-[#EAE3D2] p-8 md:p-14 mb-20">
          <SectionHeading
            eyebrow="Our Commitments"
            title="The Flourish Purity Code"
            subtitle="The enduring values that guide every saree we select and present to you"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E5] text-[#C5A059] flex items-center justify-center mx-auto md:mx-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1A1816]">100% Handloom Origin</h3>
              <p className="text-xs text-[#706B64] font-light leading-relaxed">
                We partner exclusively with authentic regional weaving cooperatives across Kanchipuram, Varanasi, Chanderi, and Bengal. No powerloom substitutions.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E5] text-[#C5A059] flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1A1816]">Pure Fibers & Real Zari</h3>
              <p className="text-xs text-[#706B64] font-light leading-relaxed">
                Natural mulberry silk, organza, raw tussar, and fine cottons tested for pure thread density, genuine weight, and lustrous fall.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-[#FAF3E5] text-[#C5A059] flex items-center justify-center mx-auto md:mx-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1A1816]">Fair Weaver Patronage</h3>
              <p className="text-xs text-[#706B64] font-light leading-relaxed">
                By purchasing through Flourish Woman, you directly empower master weavers and their artisan families with honorable remuneration.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="text-center max-w-xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl text-[#1A1816]">Let Us Weave Your Next Chapter</h2>
          <p className="text-sm text-[#706B64] font-light">
            Whether for your wedding day, reception, or a milestone festival, our stylists are delighted to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg">Explore Collection</Button>
            </Link>
            <a
              href={buildBespokeWhatsAppUrl('919876543210')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gold" size="lg">Connect with Stylist</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
