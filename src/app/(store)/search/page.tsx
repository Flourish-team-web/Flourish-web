import * as React from 'react';
import type { Metadata } from 'next';
import { searchProducts } from '@/services/searchService';
import { SearchInterface } from '@/components/search/SearchInterface';
import { SectionHeading } from '@/components/ui/SectionHeading';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search Sarees & Weaves — Flourish Woman',
  description: 'Search across our catalog of authentic handloom silk, banarasi, and designer sarees.',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;

  const results = query ? await searchProducts(query, { page, limit: 16 }) : { data: [], count: 0, hasMore: false, page: 1, pageSize: 16 };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-8 md:py-16">
      <div className="flex items-center gap-2 text-xs text-[#706B64] uppercase tracking-wider font-light mb-3">
        <Link href="/" className="hover:text-[#1A1816]">Home</Link>
        <span>/</span>
        <span className="text-[#C5A059]">Search</span>
      </div>

      <SectionHeading
        eyebrow="Direct Discovery"
        title="Search Catalog"
        subtitle="Find specific weaves, saree types, motifs, and colors across our collection"
        centered
        className="mb-8"
      />

      <SearchInterface
        initialQuery={query}
        initialProducts={results.data}
        totalCount={results.count}
      />
    </div>
  );
}
