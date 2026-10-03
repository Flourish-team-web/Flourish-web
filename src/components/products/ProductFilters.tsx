'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/store.types';
import { FALLBACK_CATEGORIES } from '@/lib/data/catalogFallback';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';

const SORT_OPTIONS = [
  { label: 'Newest Off Loom', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Bestselling', value: 'popular' },
];

const SLIDER_MIN = 0;
const SLIDER_MAX = 50000;
const SLIDER_STEP = 1000;

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>(FALLBACK_CATEGORIES);

  // Fetch only active categories from database
  React.useEffect(() => {
    const fetchCats = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch {
        // Fallback used
      }
    };
    fetchCats();
  }, []);

  const currentSort = searchParams.get('sort') || 'newest';
  const currentMaxPrice = searchParams.get('maxPrice');
  
  // Local state for smooth slider dragging
  const [maxPriceValue, setMaxPriceValue] = React.useState<number>(
    currentMaxPrice ? parseInt(currentMaxPrice, 10) : SLIDER_MAX
  );

  React.useEffect(() => {
    if (currentMaxPrice) {
      setMaxPriceValue(parseInt(currentMaxPrice, 10));
    } else {
      setMaxPriceValue(SLIDER_MAX);
    }
  }, [currentMaxPrice]);

  // Category from URL searchParams or pathname
  const isCategoryRoute = pathname.startsWith('/categories/');
  const routeCategorySlug = isCategoryRoute ? pathname.split('/categories/')[1]?.split('/')[0] : '';
  const currentCategory = searchParams.get('category') || routeCategorySlug || '';

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (categorySlug: string | null) => {
    if (isCategoryRoute) {
      if (!categorySlug) {
        router.push('/products');
      } else {
        router.push(`/categories/${categorySlug}`);
      }
    } else {
      updateFilters({ category: categorySlug });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPriceValue(parseInt(e.target.value, 10));
  };

  const handleSliderCommit = () => {
    if (maxPriceValue >= SLIDER_MAX) {
      updateFilters({ maxPrice: null });
    } else {
      updateFilters({ maxPrice: maxPriceValue.toString() });
    }
  };

  const clearAll = () => {
    setMaxPriceValue(SLIDER_MAX);
    if (isCategoryRoute) {
      router.push(pathname);
    } else {
      router.push('/products');
    }
    setIsMobileDrawerOpen(false);
  };

  const isPriceFiltered = currentMaxPrice && parseInt(currentMaxPrice, 10) < SLIDER_MAX;

  const activeFiltersCount = [
    currentCategory && !isCategoryRoute ? currentCategory : null,
    isPriceFiltered ? `Max ₹${Number(currentMaxPrice).toLocaleString('en-IN')}` : null,
    currentSort !== 'newest' ? currentSort : null,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  // Percentage for filled track
  const trackPercentage = ((maxPriceValue - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  const filterContent = (
    <div className="space-y-6">
      {/* Active Filters Reset Header */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <span className="text-xs text-[#0284C7] font-semibold flex items-center gap-1.5">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
          </span>
          <button
            onClick={clearAll}
            className="text-xs text-[#64748B] hover:text-[#0284C7] font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      )}

      {/* 1. Weave Categories with Luxury Checkboxes */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#64748B] block">
          Weaves & Categories
        </label>

        <div className="space-y-1">
          {/* All Sarees Option */}
          <button
            type="button"
            onClick={() => handleCategorySelect(null)}
            className={cn(
              'group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer',
              !currentCategory
                ? 'bg-[#F0F9FF] text-[#0369A1] font-semibold'
                : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
            )}
          >
            <div
              className={cn(
                'w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all',
                !currentCategory
                  ? 'bg-[#0284C7] border-[#0284C7] text-white shadow-xs'
                  : 'bg-white border-[#CBD5E1] group-hover:border-[#0284C7]'
              )}
            >
              {!currentCategory && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>All Sarees</span>
          </button>

          {/* Dynamic Categories with Checkboxes */}
          {categories.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(isSelected ? null : cat.slug)}
                className={cn(
                  'group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer capitalize',
                  isSelected
                    ? 'bg-[#F0F9FF] text-[#0369A1] font-semibold'
                    : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                )}
              >
                {/* Checkbox square */}
                <div
                  className={cn(
                    'w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all',
                    isSelected
                      ? 'bg-[#0284C7] border-[#0284C7] text-white shadow-xs'
                      : 'bg-white border-[#CBD5E1] group-hover:border-[#0284C7]'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                {/* Optional category image thumbnail */}
                {cat.image_url && (
                  <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-black/10">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="16px"
                      className="object-cover"
                    />
                  </div>
                )}

                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#F1F5F9]" />

      {/* 2. Sort Options with Radio Checkboxes */}
      <div className="space-y-2.5">
        <label className="text-[10px] font-sans uppercase font-bold tracking-[0.2em] text-[#64748B] block">
          Sort By
        </label>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateFilters({ sort: opt.value })}
                className={cn(
                  'group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer',
                  isSelected
                    ? 'bg-[#F0F9FF] text-[#0369A1] font-semibold'
                    : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all',
                    isSelected
                      ? 'bg-[#0284C7] border-[#0284C7] text-white shadow-xs'
                      : 'bg-white border-[#CBD5E1] group-hover:border-[#0284C7]'
                  )}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#F1F5F9]" />

      {/* 3. Sleek Price Slider Model */}
      <div className="space-y-3 pt-1">
        {/* Header: MAX PRICE & Current Value */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-sans uppercase tracking-wider text-[#0F172A]">
            MAX PRICE
          </span>
          <span className="text-sm font-bold text-[#0284C7] font-sans">
            ₹{maxPriceValue.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Custom Range Slider */}
        <div className="relative py-1">
          <input
            type="range"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={SLIDER_STEP}
            value={maxPriceValue}
            onChange={handleSliderChange}
            onMouseUp={handleSliderCommit}
            onTouchEnd={handleSliderCommit}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all"
            style={{
              background: `linear-gradient(to right, #0284C7 0%, #0284C7 ${trackPercentage}%, #E2E8F0 ${trackPercentage}%, #E2E8F0 100%)`,
            }}
          />
        </div>

        {/* Bottom Labels: ₹0 and ₹50,000 */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] font-medium pt-0.5">
          <span>₹0</span>
          <span>₹{SLIDER_MAX.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Filter Bar */}
      <div className="lg:hidden flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl mb-6 shadow-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 bg-white rounded-xl shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#0284C7]" />
          <span className="font-medium">Filter & Sort</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#0284C7] uppercase tracking-wider font-bold hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Desktop Sidebar (Minimalist Luxury Card) */}
      <aside className="hidden lg:block w-64 shrink-0 pr-4">
        <div className="sticky top-24 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Refine Sarees"
        side="right"
      >
        <div className="flex flex-col h-full justify-between pb-6">
          <div className="overflow-y-auto pr-1">{filterContent}</div>
          <div className="pt-4 border-t border-[#E2E8F0] flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={clearAll}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              className="flex-1 bg-[#0F1C2E] text-white rounded-xl"
              onClick={() => {
                handleSliderCommit();
                setIsMobileDrawerOpen(false);
              }}
            >
              Show Sarees
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
