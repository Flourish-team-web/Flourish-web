'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroBanner as HeroBannerType } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

interface HeroBannerProps {
  banners: HeroBannerType[];
}

const DEFAULT_BANNERS = [
  {
    id: 'hero-1',
    title: 'WEAR YOUR\nOWN STORY',
    subtitle: 'Exquisite sarees for every chapter of your life.',
    cta_text: 'Explore Collection',
    cta_link: '/products',
    image_desktop_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2400&auto=format&fit=crop',
    image_mobile_url: null,
    display_order: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

export function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const activeBanners = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;

  // Auto-advance continuous loop
  React.useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeBanners.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const current = activeBanners[currentIndex] || activeBanners[0];

  return (
    <section className="relative w-full overflow-hidden h-[75vh] sm:h-[80vh] md:h-[min(88vh,720px)]">
      {/* Full-bleed background images with Mobile & Desktop Responsive Switching */}
      {activeBanners.map((banner, i) => {
        const isCurrent = i === currentIndex;
        return (
          <div
            key={banner.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isCurrent ? 1 : 0, zIndex: isCurrent ? 1 : 0 }}
          >
            {/* Desktop Banner Image (Visible on tablet & desktop) */}
            <div className={cn("relative w-full h-full", banner.image_mobile_url ? "hidden sm:block" : "block")}>
              <Image
                src={banner.image_desktop_url}
                alt={banner.title || 'Flourish Woman Hero Banner'}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-[center_25%]"
              />
            </div>

            {/* Mobile Banner Image (Visible on mobile if uploaded, falls back to desktop) */}
            {banner.image_mobile_url && (
              <div className="relative w-full h-full block sm:hidden">
                <Image
                  src={banner.image_mobile_url}
                  alt={banner.title || 'Flourish Woman Mobile Hero Banner'}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Optional Title Overlay only for banners with explicit distinct titles */}
      {current.title && current.title !== current.cta_text && current.title !== 'Hero Banner' && (
        <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-none">
          <div className="max-w-xl space-y-4 animate-fadeInUp" key={currentIndex}>
            <p className="text-[10px] sm:text-xs font-sans font-medium tracking-[0.25em] uppercase text-white/90">
              TIMELESS SAREES &nbsp;|&nbsp; MODERN WOMEN
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white tracking-tight font-medium leading-[1.05] uppercase drop-shadow-md">
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-lg">
                {current.subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Right Bottom Placed Explore Collection CTA Button */}
      <div className="absolute bottom-5 sm:bottom-10 right-4 sm:right-8 md:right-16 lg:right-24 z-30 flex items-center gap-3.5 animate-fadeInUp" key={`cta-${currentIndex}`}>
        <Link
          href={current.cta_link || '/products'}
          className="inline-flex items-center gap-2 sm:gap-3 bg-[#071324]/90 hover:bg-[#071324] backdrop-blur-md text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] px-5 sm:px-8 py-2.5 sm:py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all duration-300 group rounded-xl shadow-2xl hover:shadow-[#0284C7]/30 hover:scale-105 cursor-pointer"
        >
          <span>{current.cta_text || 'EXPLORE COLLECTION'}</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1 text-[#38BDF8]" />
        </Link>
      </div>

      {/* Slider Left/Right Arrows Controls */}
      {activeBanners.length > 1 && (
        <>
          {/* Circular Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/30 cursor-pointer shadow-lg hover:scale-105"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Circular Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/30 cursor-pointer shadow-lg hover:scale-105"
            aria-label="Next banner"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}
    </section>
  );
}
