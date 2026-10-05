import * as React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Heart,
  Gem,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export const metadata: Metadata = {
  title: "About Flourish Woman — Woven with Tradition. Designed for Today.",
  description: "Discover Flourish Woman: thoughtfully selected handloom sarees that celebrate India's rich weaving traditions with contemporary elegance.",
};

const PHILOSOPHY_POINTS = [
  {
    icon: ShieldCheck,
    title: 'Authenticity First',
    desc: 'We value the individuality of every handloom saree. The subtle variations in texture, weave, colour, and finish are part of what makes each piece special.',
  },
  {
    icon: Sparkles,
    title: 'Crafted with Purpose',
    desc: 'We believe beautiful clothing should also carry meaning. Our collections honour traditional weaving techniques while embracing the evolving style of today’s woman.',
  },
  {
    icon: Award,
    title: 'Curated with Care',
    desc: 'Rather than simply offering more, we focus on offering pieces worth choosing. Every collection is thoughtfully curated for quality, versatility, and timeless appeal.',
  },
  {
    icon: Heart,
    title: 'Made to Flourish',
    desc: 'Flourish Woman is for women who express themselves with confidence — women who value where tradition comes from while creating their own way forward.',
  },
];

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16 bg-[#FCFCFD]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] uppercase tracking-wider font-light mb-8">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0284C7] font-semibold">About Flourish Woman</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-12">
          <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
            About Flourish Woman
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight font-normal leading-tight">
            Woven with Tradition. Designed for Today.
          </h1>
          <p className="text-sm sm:text-base text-[#475569] font-light leading-relaxed max-w-2xl mx-auto">
            At <strong className="font-medium text-[#0F172A]">Flourish Woman</strong>, we believe a saree is more than something you wear — it is a reflection of heritage, craftsmanship, individuality, and timeless elegance.
          </p>
        </div>

        {/* Hero Intro & Image Alignment Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:p-10 mb-14 shadow-xs">
          {/* Image Frame */}
          {/* Image Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] shadow-xs">
              <Image
                src="/images/Traditional Indian Silk Weaving Workshop (1).png"
                alt="Flourish Woman Traditional Indian Silk Weaving Workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#38BDF8] font-bold block">Master Artisan Looms</span>
                <p className="text-xs font-serif font-medium">Traditional Indian Silk Weaving</p>
              </div>
            </div>
          </div>

          {/* Intro Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-normal tracking-tight">
              Contemporary Grace Rooted in Heritage
            </h2>
            <p className="text-sm text-[#475569] font-light leading-relaxed">
              We bring together thoughtfully selected handloom sarees that celebrate India&apos;s rich weaving traditions while fitting beautifully into the modern woman&apos;s wardrobe. Every saree is chosen with attention to its weave, texture, craftsmanship, colour, and character.
            </p>
            <p className="text-sm text-[#475569] font-light leading-relaxed">
              Our collection is created for women who appreciate the beauty of authentic craftsmanship and want to carry tradition with confidence and contemporary grace.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Authentic Weave</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Rich Texture</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Distinct Character</span>
              </span>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:p-10 mb-14 space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
              Our Journey
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-normal">
              Our Story
            </h2>
          </div>

          <p className="text-sm text-[#475569] font-light leading-relaxed">
            Flourish Woman was born from a simple idea — to make the beauty of Indian handloom more accessible to the modern woman.
          </p>

          <p className="text-sm text-[#475569] font-light leading-relaxed">
            Behind every handloom saree is a story. A story of skilled hands, generations of knowledge, carefully chosen threads, and hours of patient craftsmanship. We want those stories to continue being celebrated.
          </p>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <p className="text-xs font-sans uppercase tracking-widest text-[#0284C7] font-bold mb-1">
              Our Approach
            </p>
            <p className="font-serif text-base sm:text-lg text-[#0F172A] font-normal">
              Select with care, present with elegance, and deliver with trust.
            </p>
          </div>

          <p className="text-sm text-[#475569] font-light leading-relaxed">
            From classic weaves to contemporary interpretations, we curate sarees that can become part of everyday moments, celebrations, milestones, and memories.
          </p>
        </div>

        {/* Our Philosophy Section (4 Cards Grid) */}
        <div className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
              Guiding Principles
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-normal">
              Our Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PHILOSOPHY_POINTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-2.5 shadow-xs hover:border-[#0284C7]/40 hover:shadow-xs transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg text-[#0F172A] font-medium">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Celebrating the Hands Behind Every Saree */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:p-10 mb-14 shadow-xs space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
              Artisan Tribute
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-normal">
              Celebrating the Hands Behind Every Saree
            </h2>
          </div>

          <p className="text-sm text-[#475569] font-light leading-relaxed">
            A handloom saree is the result of patience, precision, and craftsmanship. Every thread passes through skilled hands. Every weave carries the character of the artisan and the tradition behind it.
          </p>
          <p className="text-sm text-[#475569] font-light leading-relaxed">
            By bringing these sarees to you, we hope to celebrate not only the finished garment but also the craftsmanship and heritage that make it possible.
          </p>
        </div>

        {/* Our Promise Section */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]/80 border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:p-10 mb-14 space-y-6">
          <div className="space-y-1">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
              Our Commitment
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-normal">
              Our Promise
            </h2>
          </div>

          <p className="text-sm text-[#475569] font-light leading-relaxed">
            We are committed to bringing you sarees that feel as special as they look. From the moment a saree is selected to the moment it reaches your hands, we focus on thoughtful curation, honest presentation, and a refined shopping experience.
          </p>

          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#64748B] font-semibold">
              Because when you choose Flourish Woman, you are not simply choosing a saree:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <Gem className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#0F172A]">You are choosing craftsmanship.</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <Award className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#0F172A]">You are choosing heritage.</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <Sparkles className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#0F172A]">Your own expression of elegance.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Brand Closing & CTA Section */}
        <div className="text-center bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 space-y-6 shadow-xs">
          <div className="space-y-2 max-w-xl mx-auto">
            <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold">
              Flourish Woman
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0F172A] font-normal">
              Tradition, Woven for You.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] font-light leading-relaxed">
              Discover handloom sarees thoughtfully curated for the modern woman — timeless in craft, effortless in elegance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#071324] text-white px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xs"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>

            <a
              href={buildBespokeWhatsAppUrl(undefined)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] text-white px-7 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xs"
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
