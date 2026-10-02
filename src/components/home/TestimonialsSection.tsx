import * as React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types/store.types';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        <SectionHeading
          eyebrow="Patron Voices"
          title="Flourish Stories"
          subtitle="Real brides, connoisseurs, and women celebrating their milestones in Flourish drapes"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-[#E2E8F0] rounded-md p-6 sm:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#38BDF8]/40 mb-4" />

              <p className="text-sm text-[#334155] font-light leading-relaxed italic mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-[#071324] font-medium">
                    {t.client_name}
                  </h4>
                  {t.location && (
                    <p className="text-xs text-[#64748B] font-light">{t.location}</p>
                  )}
                  {t.saree_worn && (
                    <p className="text-[10px] text-[#0284C7] uppercase tracking-wider font-medium mt-0.5">
                      Draped in {t.saree_worn}
                    </p>
                  )}
                </div>

                <div className="flex text-[#38BDF8]">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
