'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProductWithDetails } from '@/types/store.types';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils/cn';

const CATEGORY_FILTERS = ['All', 'Kanchipuram', 'Banarasi', 'Soft Silk', 'Organza', 'Cotton'];

interface ProductCarouselSectionProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  viewAllLink?: string;
  products: ProductWithDetails[];
  showFilters?: boolean;
}

export function ProductCarouselSection({
  title,
  eyebrow,
  subtitle,
  viewAllLink = '/products',
  products,
  showFilters = true,
}: ProductCarouselSectionProps) {
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filteredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    if (activeFilter === 'All') return products;
    return products.filter((p) => {
      const matchCategory = p.category?.name?.toLowerCase().includes(activeFilter.toLowerCase());
      const matchFabric = p.fabric?.toLowerCase().includes(activeFilter.toLowerCase());
      const matchType = p.saree_type?.toLowerCase().includes(activeFilter.toLowerCase());
      const matchName = p.name?.toLowerCase().includes(activeFilter.toLowerCase());
      return matchCategory || matchFabric || matchType || matchName;
    });
  }, [products, activeFilter]);

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-[#E2E8F0] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
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

          <div className="flex items-center gap-3 sm:gap-4 self-start md:self-end flex-wrap max-w-full min-w-0">
            {/* Center Filter Tabs */}
            {showFilters && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full min-w-0">
                {CATEGORY_FILTERS.map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        'px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-sans tracking-wide transition-all cursor-pointer whitespace-nowrap border shrink-0',
                        isActive
                          ? 'bg-[#0F172A] text-white border-[#0F172A] font-medium shadow-sm'
                          : 'bg-white text-[#475569] border-[#CBD5E1] hover:border-[#0F172A] hover:text-[#0F172A]'
                      )}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            )}

            {/* View All Link */}
            <Link
              href={viewAllLink}
              className="text-[11px] sm:text-xs uppercase tracking-widest text-[#0F172A] font-bold hover:text-[#0284C7] transition-colors flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-md hover:bg-[#F0F9FF]"
            >
              <span>View All</span>
              <span className="text-sm">→</span>
            </Link>
          </div>
        </div>

        {/* Product Cards Grid - 5 cards per row on desktop */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredProducts.slice(0, 10).map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 5} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1]">
            <p className="text-sm text-[#64748B]">No sarees match the selected filter.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-3 text-xs uppercase tracking-wider font-semibold text-[#0284C7] hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
