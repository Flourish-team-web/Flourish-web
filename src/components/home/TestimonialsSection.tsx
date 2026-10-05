'use client';

import * as React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { Testimonial } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Ensure enough base items so the marquee flows continuously
  let baseItems = [...testimonials];
  while (baseItems.length < 4) {
    baseItems = [...baseItems, ...testimonials];
  }

  // Duplicate for seamless 50% infinite loop
  const displayTestimonials = [...baseItems, ...baseItems];

  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9]/60 to-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden relative">
      {/* Background subtle luxury glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#38BDF8]/10 via-[#0284C7]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Section Header (without buttons) */}
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 mb-10 text-center sm:text-left">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#0284C7] font-bold mb-1.5">
            Patron Diaries
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] font-medium tracking-tight">
            Cherished by Women Worldwide
          </h2>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Marquee Ticker */}
      <div className="w-full relative py-3 overflow-hidden group">
        {/* Soft edge gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track: Seamlessly pauses in-place on hover */}
        <div className="flex gap-6 w-max animate-marquee-scroll hover:[animation-play-state:paused] cursor-pointer">
          {displayTestimonials.map((t, idx) => {
            const initial = t.client_name ? t.client_name.charAt(0).toUpperCase() : 'F';
            return (
              <div
                key={`${t.id}-${idx}`}
                className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 bg-white border border-[#E2E8F0] hover:border-[#0284C7]/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative shadow-xs hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300 select-none group/card"
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

                  <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center group-hover/card:scale-110 transition-transform">
                    <Quote className="w-3.5 h-3.5 fill-current text-[#0284C7]" />
                  </div>
                </div>

                {/* Testimonial Quote Content */}
                <p className="text-xs sm:text-sm text-[#334155] font-light leading-relaxed italic mb-5 line-clamp-4">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Saree Draped Pill Tag */}
                {t.saree_worn && (
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#0284C7] font-medium w-fit">
                    <span className="truncate max-w-[260px]">Draped in {t.saree_worn}</span>
                  </div>
                )}

                {/* Bottom Patron Bio */}
                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Monogram Avatar */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#071324] to-[#0E2038] text-[#38BDF8] flex items-center justify-center font-serif text-sm font-bold shadow-xs shrink-0 border border-[#38BDF8]/40">
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
