import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PromotionalBanner } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

interface FlourishSignatureProps {
  banners: PromotionalBanner[];
}

export function FlourishSignature({ banners }: FlourishSignatureProps) {
  if (!banners || banners.length === 0) return null;

  // Render up to 3 signature promo banners
  const displayBanners = banners.slice(0, 3);

  return (
    <section className="py-10 sm:py-16 bg-[#FAF9F5] border-b border-[#EAE3D2] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] mb-2">
              <span>Signature Edits</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#0F1C2E] font-medium tracking-tight">
              The Flourish Signature
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-light mt-1 max-w-xl">
              Artisanal hallmarks, master craft heritage, and bespoke assurances crafted into every handwoven drape.
            </p>
          </div>
        </div>

        {/* 3 Small Promo Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {displayBanners.map((banner, index) => {
            const hasMobileImg = Boolean(banner.image_mobile_url);
            const desktopImg = banner.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop';
            const mobileImg = banner.image_mobile_url || desktopImg;
            const hasLink = Boolean(banner.cta_link);

            const cardContent = (
              <div
                className={cn(
                  'group relative overflow-hidden rounded-2xl shadow-md border border-[#E2E8F0] aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/11] bg-[#071324] select-none flex flex-col justify-end transition-all duration-300',
                  hasLink && 'hover:shadow-xl hover:border-[#0284C7]/50 hover:-translate-y-1 cursor-pointer'
                )}
              >
                {/* Background Images */}
                <div className="absolute inset-0 z-0">
                  {/* Desktop Banner Image */}
                  <div className={cn('relative w-full h-full', hasMobileImg ? 'hidden sm:block' : 'block')}>
                    <Image
                      src={desktopImg}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Mobile Banner Image */}
                  {hasMobileImg && (
                    <div className="relative w-full h-full block sm:hidden">
                      <Image
                        src={mobileImg}
                        alt={banner.title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}
                </div>

                {/* Subtle bottom scrim + CTA arrow only when there's a link */}
                {hasLink && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent z-[1] pointer-events-none" />
                    <div className="relative z-10 px-4 pb-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                        <span>{banner.cta_text || 'Explore'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );

            if (hasLink && banner.cta_link) {
              return (
                <Link key={banner.id || index} href={banner.cta_link} className="block">
                  {cardContent}
                </Link>
              );
            }

            return <div key={banner.id || index}>{cardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
