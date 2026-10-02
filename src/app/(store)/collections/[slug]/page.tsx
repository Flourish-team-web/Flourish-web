import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCollectionBySlug } from '@/services/collectionService';
import { getProducts } from '@/services/productService';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'featured';
    fabric?: string;
    occasion?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return { title: 'Collection Not Found — Flourish Woman' };
  }

  return {
    title: collection.meta_title || `${collection.name} Collection — Flourish Woman`,
    description: collection.meta_description || collection.description || `Explore the curated ${collection.name} saree edit.`,
  };
}

export default async function CollectionDetailPage({ params, searchParams }: CollectionDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const collection = await getCollectionBySlug(slug);
  if (!collection) {
    notFound();
  }

  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = 12;
  const offset = (currentPage - 1) * pageSize;

  const minPrice = resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined;

  const result = await getProducts({
    collectionSlug: slug,
    sortBy: resolvedSearchParams.sort || 'newest',
    fabric: resolvedSearchParams.fabric,
    occasion: resolvedSearchParams.occasion,
    color: resolvedSearchParams.color,
    minPrice,
    maxPrice,
    limit: pageSize,
    offset,
  });

  const totalPages = Math.ceil(result.count / pageSize);

  const getPageUrl = (newPage: number) => {
    const p = new URLSearchParams();
    if (resolvedSearchParams.sort) p.set('sort', resolvedSearchParams.sort);
    if (resolvedSearchParams.fabric) p.set('fabric', resolvedSearchParams.fabric);
    if (resolvedSearchParams.occasion) p.set('occasion', resolvedSearchParams.occasion);
    if (resolvedSearchParams.color) p.set('color', resolvedSearchParams.color);
    if (resolvedSearchParams.minPrice) p.set('minPrice', resolvedSearchParams.minPrice);
    if (resolvedSearchParams.maxPrice) p.set('maxPrice', resolvedSearchParams.maxPrice);
    p.set('page', newPage.toString());
    return `/collections/${slug}?${p.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-6 sm:py-10 bg-white">
      {/* Clean Luxury Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 mb-8 border-b border-[#EAE3D2]">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#706B64] uppercase tracking-[0.18em] mb-2 font-medium">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0F172A] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#0284C7] font-semibold">{collection.name}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0F1C2E] font-medium tracking-tight">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-xs sm:text-sm text-[#64748B] font-light max-w-2xl mt-1.5 leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        <span className="text-xs uppercase tracking-[0.18em] text-[#64748B] font-light shrink-0">
          {result.count} Handloom Creation{result.count === 1 ? '' : 's'}
        </span>
      </div>

      {/* Main Layout: Filters + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters />

        <div className="flex-1 space-y-8">
          <ProductGrid
            products={result.data}
            emptyTitle={`No sarees found in ${collection.name}`}
            emptyDescription="Pieces for this edit are being assembled by our master weavers. Explore our full catalog or inquire via WhatsApp."
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
