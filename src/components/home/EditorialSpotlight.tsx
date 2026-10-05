import * as React from 'react';
import Image from 'next/image';
import { PromotionalBanner } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

interface EditorialSpotlightProps {
  banners: PromotionalBanner[];
}

export function EditorialSpotlight({ banners }: EditorialSpotlightProps) {
  if (!banners || banners.length === 0) return null;

  const displayBanners = banners.slice(0, 3);

  return (
    <section className="py-8 sm:py-12 bg-[#FAF9F5] border-b border-[#EAE3D2] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Section header - Non-clickable, pure editorial title */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#0F1C2E] font-medium tracking-tight">
              The Flourish Edit
            </h2>
            <div className="hidden sm:block h-[1px] w-12 bg-[#CBD5E1]" />
          </div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#0284C7] font-semibold bg-[#E0F2FE] px-3 py-1 rounded-full border border-[#BAE6FD] shrink-0">
            Exclusive Highlights
          </span>
        </div>

        {/* 3-column promo banners - Pure showcase, no redirect links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {displayBanners.map((banner, index) => {
            const hasMobileImg = Boolean(banner.image_mobile_url);
            const desktopImg = banner.image_url || '/images/placeholder-saree.svg';
            const mobileImg = banner.image_mobile_url || desktopImg;

            return (
              <div
                key={banner.id || index}
                className="relative overflow-hidden rounded-2xl shadow-md border border-[#E2E8F0] aspect-[16/9] sm:aspect-[16/10] bg-[#071324] select-none"
              >
                {/* Background Image: Responsive Desktop & Mobile */}
                <div className="absolute inset-0">
                  {/* Desktop Banner Image (tablet & desktop) */}
                  <div className={cn('relative w-full h-full', hasMobileImg ? 'hidden sm:block' : 'block')}>
                    <Image
                      src={desktopImg}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center brightness-90"
                    />
                  </div>

                  {/* Mobile Banner Image (Visible on mobile if configured) */}
                  {hasMobileImg && (
                    <div className="relative w-full h-full block sm:hidden">
                      <Image
                        src={mobileImg}
                        alt={banner.title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center brightness-90"
                      />
                    </div>
                  )}
                </div>

                {/* Rich split dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#030B17]/95 via-[#07172C]/80 to-[#07172C]/30" />

                {/* Promo Content Card */}
                <div className="absolute inset-0 p-5 sm:p-6 md:p-7 flex flex-col justify-between max-w-[85%] sm:max-w-[78%] z-10">
                  <div className="space-y-2">
                    {banner.badge_text && (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] backdrop-blur-xs">
                        <span>{banner.badge_text}</span>
                      </div>
                    )}

                    <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-normal tracking-[0.08em] uppercase text-white drop-shadow-sm leading-tight">
                      {banner.title}
                    </h3>
                  </div>

                  {banner.subtitle && (
                    <p className="text-xs sm:text-[13px] text-white/85 font-light leading-relaxed drop-shadow-xs border-l-2 border-[#38BDF8] pl-2.5 py-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
