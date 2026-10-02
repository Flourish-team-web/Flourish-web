import * as React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/services/productService';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Sarees — Handloom Heritage Collection — Flourish Woman',
  description: 'Explore the complete Flourish Woman collection of authentic handloom silk, organza, and festive sarees.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'featured';
    category?: string;
    fabric?: string;
    occasion?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const pageSize = 12;
  const offset = (currentPage - 1) * pageSize;

  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;

  const result = await getProducts({
    categorySlug: resolvedParams.category,
    sortBy: resolvedParams.sort || 'newest',
    fabric: resolvedParams.fabric,
    occasion: resolvedParams.occasion,
    color: resolvedParams.color,
    minPrice,
    maxPrice,
    limit: pageSize,
    offset,
  });

  const totalPages = Math.ceil(result.count / pageSize);

  const getPageUrl = (newPage: number) => {
    const p = new URLSearchParams();
    if (resolvedParams.sort) p.set('sort', resolvedParams.sort);
    if (resolvedParams.category) p.set('category', resolvedParams.category);
    if (resolvedParams.fabric) p.set('fabric', resolvedParams.fabric);
    if (resolvedParams.occasion) p.set('occasion', resolvedParams.occasion);
    if (resolvedParams.color) p.set('color', resolvedParams.color);
    if (resolvedParams.minPrice) p.set('minPrice', resolvedParams.minPrice);
    if (resolvedParams.maxPrice) p.set('maxPrice', resolvedParams.maxPrice);
    p.set('page', newPage.toString());
    return `/products?${p.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-6 sm:py-10 bg-white">
      {/* Clean Luxury Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 mb-8 border-b border-[#EAE3D2]">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#706B64] uppercase tracking-[0.18em] mb-2 font-medium">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#0284C7] font-semibold">All Sarees</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0F1C2E] font-medium tracking-tight">
            All Sarees
          </h1>
        </div>

        <span className="text-xs uppercase tracking-[0.18em] text-[#64748B] font-light">
          {result.count} Handloom Creation{result.count === 1 ? '' : 's'}
        </span>
      </div>

      {/* Main Layout: Filters + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters />

        <div className="flex-1 space-y-8">
          <ProductGrid
            products={result.data}
            emptyTitle="No sarees match your current filters"
            emptyDescription="Try clearing some of your selected filters or check back soon for our newest loom additions."
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8 border-t border-[#E2E8F0]">
              {currentPage > 1 && (
                <Link
                  href={getPageUrl(currentPage - 1)}
                  className="flex items-center gap-1 px-4 py-2 border border-[#CBD5E1] text-xs uppercase tracking-wider hover:bg-[#0F172A] hover:text-white rounded transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              )}

              <span className="text-xs text-[#64748B] font-medium px-2">
                Page {currentPage} of {totalPages}
              </span>

              {result.hasMore && (
                <Link
                  href={getPageUrl(currentPage + 1)}
                  className="flex items-center gap-1 px-4 py-2 border border-[#CBD5E1] text-xs uppercase tracking-wider hover:bg-[#0F172A] hover:text-white rounded transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
