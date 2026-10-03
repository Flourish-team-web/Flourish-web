'use client';

import * as React from 'react';
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '@/types/store.types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Ensure enough cards for smooth continuous loop
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 440;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden relative">
      {/* Background subtle luxury accents */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#38BDF8]/10 via-[#0284C7]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#0284C7] font-bold mb-1.5">
              Patron Diaries
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] font-medium tracking-tight">
              Cherished by Women Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-light mt-1 max-w-lg">
              Authentic stories and reviews from our patrons celebrating milestone moments.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline-block">
              Hover cards to pause
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                className="w-10 h-10 rounded-full border border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center hover:bg-[#071324] hover:text-[#38BDF8] hover:border-[#071324] transition-all shadow-xs cursor-pointer"
                aria-label="Scroll testimonials left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                className="w-10 h-10 rounded-full border border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center hover:bg-[#071324] hover:text-[#38BDF8] hover:border-[#071324] transition-all shadow-xs cursor-pointer"
                aria-label="Scroll testimonials right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Single-Row Auto-Scrolling Marquee Ticker */}
      <div
        className="w-full relative py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft edge gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track (Single Row) */}
        <div
          ref={scrollContainerRef}
          className={cn(
            'flex gap-6 px-4 sm:px-8 w-full overflow-x-auto scrollbar-none scroll-smooth',
            !isPaused && 'animate-marquee-scroll'
          )}
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {displayTestimonials.map((t, idx) => {
            const initial = t.client_name ? t.client_name.charAt(0).toUpperCase() : 'F';
            return (
              <div
                key={`${t.id}-${idx}`}
                className="w-[340px] sm:w-[420px] md:w-[460px] shrink-0 bg-white border border-[#E2E8F0] hover:border-[#0284C7]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 group select-none"
              >
                {/* Top Row: Stars + Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] font-bold text-[#0F172A] ml-1.5 font-mono">
                      5.0
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Quote className="w-4 h-4 fill-current text-[#0284C7]" />
                  </div>
                </div>

                {/* Testimonial Quote Content */}
                <p className="text-xs sm:text-sm text-[#334155] font-light leading-relaxed italic mb-6 line-clamp-4">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Saree Draped Pill Tag */}
                {t.saree_worn && (
                  <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#0284C7] font-medium w-fit">
                    <span className="truncate max-w-[280px]">Draped in {t.saree_worn}</span>
                  </div>
                )}

                {/* Bottom Patron Bio */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Monogram Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#071324] to-[#0E2038] text-[#38BDF8] flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0 border border-[#38BDF8]/40">
                      {initial}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif text-sm sm:text-base text-[#0F172A] font-medium leading-tight">
                          {t.client_name}
                        </h4>
                        <span title="Verified Patron">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5 font-light">
                        {t.location && <span>{t.location}</span>}
                        <span className="text-[#CBD5E1]">•</span>
                        <span className="text-emerald-700 font-medium">Verified Patron</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
