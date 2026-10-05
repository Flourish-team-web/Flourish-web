'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProductWithDetails } from '@/types/store.types';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils/cn';

interface ProductCarouselSectionProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  viewAllLink?: string;
  products: ProductWithDetails[];
  mobileLimit?: number;
}

export function ProductCarouselSection({
  title,
  eyebrow,
  subtitle,
  viewAllLink = '/products',
  products,
  mobileLimit,
}: ProductCarouselSectionProps) {
  const displayProducts = products || [];

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-[#E2E8F0] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            {eyebrow && (
              <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold mb-1">
                {eyebrow}
              </p>
            )}
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] font-normal tracking-tight">
                {title}
              </h2>
              <div className="hidden sm:block h-[1px] w-12 bg-[#CBD5E1]" />
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-light max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* View All Link */}
          <Link
            href={viewAllLink}
            className="text-[11px] sm:text-xs uppercase tracking-widest text-[#0F172A] font-bold hover:text-[#0284C7] transition-colors flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-md hover:bg-[#F0F9FF] self-start sm:self-auto"
          >
            <span>View All</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Product Cards Grid - 5 cards per row on desktop */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {displayProducts.slice(0, 10).map((product, idx) => (
              <div
                key={product.id}
                className={cn(mobileLimit && idx >= mobileLimit ? 'hidden sm:block' : 'block')}
              >
                <ProductCard product={product} priority={idx < 5} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
            <p className="text-sm text-[#64748B]">No sarees available in this collection yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
