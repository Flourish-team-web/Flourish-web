'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { ProductWithDetails } from '@/types/store.types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface SearchInterfaceProps {
  initialQuery: string;
  initialProducts: ProductWithDetails[];
  totalCount: number;
}

export function SearchInterface({
  initialQuery,
  initialProducts,
  totalCount,
}: SearchInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState(initialQuery);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  React.useEffect(() => {
    setIsSearching(false);
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#706B64]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by weave, fabric, color, occasion, or saree title..."
            className="w-full bg-[#FAF8F5] border border-[#E0D8C8] pl-12 pr-28 py-3.5 text-sm text-[#1A1816] placeholder-[#8F8A80] focus:border-[#1A1816] focus:bg-white focus:outline-none tracking-wide"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-24 p-1 text-[#8F8A80] hover:text-[#1A1816]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="absolute right-2 h-9 px-4"
            isLoading={isSearching}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Result Count and Status */}
      <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-4">
        <div>
          {initialQuery ? (
            <p className="text-sm text-[#57524A]">
              Showing <span className="font-semibold text-[#1A1816]">{totalCount}</span> results for &ldquo;
              <span className="font-serif italic font-medium text-[#1A1816]">{initialQuery}</span>&rdquo;
            </p>
          ) : (
            <p className="text-sm text-[#57524A]">
              Enter a search keyword above to explore the collection.
            </p>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {initialProducts.length > 0 ? (
        <ProductGrid products={initialProducts} />
      ) : initialQuery ? (
        <EmptyState
          title="No Matching Sarees Found"
          description={`We could not find any sarees matching "${initialQuery}". Try searching for broader terms like "Silk", "Banarasi", "Bridal", or "Pastel".`}
          actionText="Browse All Sarees"
          actionHref="/products"
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-xs uppercase tracking-widest text-[#706B64] font-medium mb-4">
            Popular Searches
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {['Kanchipuram Silk', 'Banarasi Brocade', 'Soft Silk', 'Organza Florals', 'Bridal Sarees', 'Pastel Tones'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchTerm(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-3.5 py-2 bg-[#F4EFE6] hover:bg-[#EAE3D2] text-[#3D3833] text-xs font-sans tracking-wide transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
