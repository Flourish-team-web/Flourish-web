'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { HeroBanner as HeroBannerType } from '@/types/store.types';

interface HeroBannerProps {
  banners: HeroBannerType[];
}

const DEFAULT_BANNERS = [
  {
    id: 'hero-1',
    title: 'WEAR YOUR\nOWN STORY',
    subtitle: 'Exquisite sarees for every chapter of your life. Tradition, craftsmanship and contemporary elegance — woven for the modern woman.',
    cta_text: 'Explore Collection',
    cta_link: '/products',
    image_desktop_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2400&auto=format&fit=crop',
    image_mobile_url: null,
    display_order: 0,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'hero-2',
    title: 'TIMELESS\nELEGANCE',
    subtitle: 'Handcrafted Kanchipuram silks and Banarasi brocades woven by master artisans across India.',
    cta_text: 'Shop New Arrivals',
    cta_link: '/products?sort=newest',
    image_desktop_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2400&auto=format&fit=crop',
    image_mobile_url: null,
    display_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'hero-3',
    title: 'ARTISAN\nCRAFTED',
    subtitle: 'Each saree tells a story — centuries of technique, passed from hand to hand, generation to generation.',
    cta_text: 'Discover Collections',
    cta_link: '/collections',
    image_desktop_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2400&auto=format&fit=crop',
    image_mobile_url: null,
    display_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
];

export function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const activeBanners = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;

  // Auto-advance
  React.useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      goTo((prev) => (prev < activeBanners.length - 1 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const goTo = (indexOrFn: number | ((prev: number) => number)) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(typeof indexOrFn === 'function' ? indexOrFn(currentIndex) : indexOrFn);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => goTo((prev) => (prev > 0 ? prev - 1 : activeBanners.length - 1));
  const handleNext = () => goTo((prev) => (prev < activeBanners.length - 1 ? prev + 1 : 0));

  const current = activeBanners[currentIndex] || activeBanners[0];

  const trustBadges = [
    { icon: Sparkles, label: 'Authentic Craftsmanship' },
    { icon: ShieldCheck, label: 'Premium Quality' },
    { icon: Truck, label: 'Secure Shopping' },
  ];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'min(88vh, 720px)' }}>
      {/* Full-bleed background images */}
      {activeBanners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === currentIndex ? 1 : 0, zIndex: i === currentIndex ? 1 : 0 }}
        >
          <Image
            src={banner.image_desktop_url}
            alt={banner.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-[center_25%]"
          />
        </div>
      ))}

      {/* Subtle luxury warm-toned editorial overlay gradient on the left */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Hero Content */}
      <div className="relative z-20 h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl sm:max-w-2xl space-y-5 sm:space-y-6 animate-fadeInUp" key={currentIndex}>
          {/* Eyebrow */}
          <p className="text-[10px] sm:text-xs font-sans font-medium tracking-[0.18em] sm:tracking-[0.3em] uppercase text-white/90">
            TIMELESS SAREES &nbsp;|&nbsp; MODERN WOMEN
          </p>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-tight font-medium leading-[1.05] uppercase whitespace-pre-line drop-shadow-sm">
            {current.title}
          </h1>

          {/* Subtitle */}
          {current.subtitle && (
            <p className="text-xs sm:text-sm md:text-base text-white/90 font-light leading-relaxed max-w-lg">
              {current.subtitle}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-2 sm:pt-4">
            <Link
              href={current.cta_link || '/products'}
              className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#0F1C2E] hover:bg-[#1E3048] text-white px-5 sm:px-8 py-3 sm:py-4 text-xs font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-all duration-300 group rounded-sm shadow-xl"
            >
              <span>{current.cta_text || 'EXPLORE COLLECTION'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white/90" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-3.5 sm:gap-6 lg:gap-8 border-t border-white/25">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/40 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[10.5px] sm:text-xs text-white/90 font-normal tracking-wide">Authentic Craftsmanship</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/40 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[10.5px] sm:text-xs text-white/90 font-normal tracking-wide">Premium Quality</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/40 flex items-center justify-center text-white shrink-0">
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[10.5px] sm:text-xs text-white/90 font-normal tracking-wide">Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      {activeBanners.length > 1 && (
        <>
          {/* Circular Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white flex items-center justify-center transition-all border border-white/30"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Circular Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#0F1C2E] flex items-center justify-center transition-all shadow-lg"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator on bottom right */}
          <div className="absolute bottom-6 right-8 z-30 hidden sm:flex items-center gap-3 text-white/80 text-xs font-mono tracking-widest bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <span>0{currentIndex + 1}</span>
            <span className="text-white/40">/</span>
            <span>0{activeBanners.length}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 text-white" />
          </div>
        </>
      )}
    </section>
  );
}
