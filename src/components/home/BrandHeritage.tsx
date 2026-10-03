import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function BrandHeritage() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#0A2647] via-[#05172E] to-[#020A14] text-[#F8FAFC] relative overflow-hidden border-y border-[#163860]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Artwork */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden border border-[#162E52] shadow-2xl rounded-sm">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
                alt="Flourish Women's Handloom Artistry"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-4 border border-[#38BDF8]/40 pointer-events-none" />
            </div>
          </div>

          {/* Editorial Brand Narrative */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 bg-[#0E2038] border border-[#234573] rounded-full">
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#38BDF8] font-semibold">
                The Flourish Ethos
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight font-normal leading-tight">
              Honoring The Loom, Celebrating You
            </h2>

            <p className="text-sm text-[#94A3B8] font-light leading-relaxed">
              Every saree in the Flourish Women&apos;s collection carries generations of patience, master craft, and poetic geometry. Hand-spun yarns, zari borders dipped in legacy, and motifs drawn from timeless temple architectures.
            </p>

            <p className="text-sm text-[#94A3B8] font-light leading-relaxed">
              We work intimately with heritage weaver clusters across Kanchipuram, Varanasi, and Bengal to ensure absolute purity of fiber and authentic compensation for artisans.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/about">
                <Button variant="gold" size="lg" className="group shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  <span>Discover Our Story</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-white border-[#38BDF8]/50 hover:bg-[#38BDF8] hover:text-[#071324] hover:border-[#38BDF8]">
                  Book Bespoke Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
