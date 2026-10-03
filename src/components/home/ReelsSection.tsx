'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reel } from '@/types/store.types';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils/cn';

// High-quality placeholder reels if database items are empty or fewer
const PLACEHOLDER_REELS = [
  {
    id: 'r1',
    title: 'Bridal Kanchipuram Styling',
    view_count_label: '18.4K views',
    tag: '✨ Bestseller Drape',
    thumbnail_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'r2',
    title: 'Festive Kadwa Banarasi Gold',
    view_count_label: '12.8K views',
    tag: '👑 Handwoven Korvai',
    thumbnail_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'r3',
    title: 'Heritage Temple Jewellery Match',
    view_count_label: '24.2K views',
    tag: '✨ Restocked on demand',
    thumbnail_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'r4',
    title: 'Pastel Organza Featherlight Drape',
    view_count_label: '9.6K views',
    tag: '🌸 Styling Tip',
    thumbnail_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  },
  {
    id: 'r5',
    title: 'Behind the Master Weaving Looms',
    view_count_label: '15.1K views',
    tag: '🌿 Pure Silk Mark',
    thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
];

interface ReelsSectionProps {
  reels: Reel[];
}

export function ReelsSection({ reels }: ReelsSectionProps) {
  const [activeVideoUrl, setActiveVideoUrl] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(true);

  // Touch tracking for mobile swipe gestures
  const touchStartXRef = React.useRef<number | null>(null);
  const touchEndXRef = React.useRef<number | null>(null);

  // Combine database reels with placeholders to ensure at least 5 rich cards
  const displayReels = React.useMemo(() => {
    if (reels && reels.length >= 5) {
      return reels;
    }
    if (reels && reels.length > 0) {
      const remainingNeeded = 5 - reels.length;
      return [...reels, ...PLACEHOLDER_REELS.slice(0, remainingNeeded)];
    }
    return PLACEHOLDER_REELS;
  }, [reels]);

  // Ensure 5 cards on desktop
  const desktopReels = displayReels.slice(0, 5);

  const total = displayReels.length;
  const leftIndex = (activeIndex - 1 + total) % total;
  const centerIndex = activeIndex;
  const rightIndex = (activeIndex + 1) % total;

  const leftReel = displayReels[leftIndex];
  const centerReel = displayReels[centerIndex];
  const rightReel = displayReels[rightIndex];

  const handlePrev = React.useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diffX = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 40; // px

    if (diffX > minSwipeDistance) {
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const openVideo = (reel: any) => {
    if (reel.video_url) {
      setActiveVideoUrl(reel.video_url);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-[#EAE3D2] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Section Header */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#0F1C2E] font-medium tracking-tight">
              Flourish Reels
            </h2>
            <div className="hidden sm:block h-[1px] w-8 bg-[#CBD5E1]" />
            <span className="hidden sm:block text-xs text-[#64748B] font-light tracking-wide">
              Real Women, Real Stories, Real Sarees.
            </span>
          </div>
          <Link
            href="/products"
            className="text-[11px] sm:text-xs uppercase tracking-widest text-[#0F1C2E] font-semibold hover:text-[#0284C7] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>View All Reels</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* ================================================================================================== */}
        {/* 1. MOBILE RESPONSIVE 3-CARD CAROUSEL (Always 3 cards: Left half, Center Big, Right half on ALL views) */}
        {/* ================================================================================================== */}
        <div className="block md:hidden relative -mx-4 sm:mx-0">
          <div
            className="relative overflow-hidden w-full h-[420px] min-[400px]:h-[450px] sm:h-[490px] flex items-center justify-center touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 1. LEFT CARD (Showing right ~45% half, scaled down) */}
            <div
              key={`left-${leftReel.id || leftIndex}`}
              onClick={handlePrev}
              style={{ width: '56vw' }}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+56vw+14px)] max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer scale-[0.84] opacity-60 shadow-md brightness-90 transition-all duration-300 z-0 origin-center"
            >
              <Image
                src={leftReel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={leftReel.title}
                fill
                sizes="60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white opacity-60">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* 2. CENTER CARD (Active Reel: Big, Elevated, Centered) */}
            <div
              key={`center-${centerReel.id || centerIndex}`}
              onClick={() => openVideo(centerReel)}
              style={{ width: '56vw' }}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer scale-100 opacity-100 shadow-2xl ring-1 ring-black/10 transition-all duration-300 z-10 origin-center"
            >
              <Image
                src={centerReel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={centerReel.title}
                fill
                sizes="60vw"
                className="object-cover object-center"
                priority
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

              {/* Top Sound / Audio Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                }}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center shadow-md hover:bg-black/60 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Optional Tag/Badge */}
              {'tag' in centerReel && centerReel.tag && (
                <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[10px] text-white font-medium shadow-xs truncate max-w-[70%]">
                  {centerReel.tag}
                </div>
              )}

              {/* Center Translucent Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-13 h-13 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-lg transition-all duration-300">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Card Title & Views */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white space-y-0.5 pointer-events-none">
                <h4 className="font-sans text-xs sm:text-sm font-semibold text-white leading-tight drop-shadow-sm line-clamp-2">
                  {centerReel.title}
                </h4>
                {centerReel.view_count_label && (
                  <p className="text-[10px] text-white/80 font-normal">
                    {centerReel.view_count_label}
                  </p>
                )}
              </div>
            </div>

            {/* 3. RIGHT CARD (Showing left ~45% half, scaled down) */}
            <div
              key={`right-${rightReel.id || rightIndex}`}
              onClick={handleNext}
              style={{ width: '56vw' }}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-[calc(-50%+56vw+14px)] max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer scale-[0.84] opacity-60 shadow-md brightness-90 transition-all duration-300 z-0 origin-center"
            >
              <Image
                src={rightReel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={rightReel.title}
                fill
                sizes="60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white opacity-60">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Left Circular Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Reel"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#0F1C2E] shadow-xl flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-black/5"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Right Circular Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Reel"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#0F1C2E] shadow-xl flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-black/5"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </div>

          {/* Mobile Pagination Pill & Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {displayReels.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to reel ${idx + 1}`}
                  className={cn(
                    'transition-all duration-300 rounded-full cursor-pointer',
                    isActive
                      ? 'w-6 h-1.5 bg-[#0F1C2E]'
                      : 'w-1.5 h-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DESKTOP VIEW: EXACTLY 5 REEL CARDS IN A 5-COLUMN GRID                  */}
        {/* ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-5">
          {desktopReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => openVideo(reel)}
              className="group relative w-full aspect-[9/16] bg-[#071324] overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-black/5"
            >
              <Image
                src={reel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={reel.title}
                fill
                sizes="(max-width: 1024px) 20vw, 18vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Card Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

              {/* Top Sound / Action Indicator */}
              <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Volume2 className="w-3.5 h-3.5" />
              </div>

              {/* Center Translucent Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-[#0F1C2E] transition-all duration-300 shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Card Title & Views */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white space-y-0.5">
                <h4 className="font-sans text-xs sm:text-sm font-semibold text-white leading-tight drop-shadow-sm line-clamp-2">
                  {reel.title}
                </h4>
                {reel.view_count_label && (
                  <p className="text-[10px] sm:text-[11px] text-white/80 font-normal">
                    {reel.view_count_label}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={!!activeVideoUrl}
        onClose={() => setActiveVideoUrl(null)}
        className="max-w-md p-0 overflow-hidden bg-black rounded-2xl"
      >
        {activeVideoUrl && (
          <div className="relative aspect-[9/16] w-full bg-black">
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              muted={isMuted}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </Modal>
    </section>
  );
}
