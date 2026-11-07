'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/store.types';
import { FALLBACK_CATEGORIES } from '@/lib/data/catalogFallback';
import { cn } from '@/lib/utils/cn';

interface CollectionCircleListProps {
  categories: Category[];
}

export function CollectionCircleList({ categories }: CollectionCircleListProps) {
  const displayCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll > 0 && scrollLeft >= maxScroll - 15) {
      setActiveIndex(displayCategories.length - 1);
      return;
    }

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    const containerRect = container.getBoundingClientRect();
    const targetX = containerRect.left + 16;

    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childRect = child.getBoundingClientRect();
      const distance = Math.abs(childRect.left - targetX);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, [displayCategories.length]);

  const scrollToCategory = (idx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    const targetChild = children[idx];
    if (targetChild) {
      const containerRect = container.getBoundingClientRect();
      const childRect = targetChild.getBoundingClientRect();
      const targetScroll = container.scrollLeft + (childRect.left - containerRect.left) - 16;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
      setActiveIndex(idx);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-[#E2E8F0] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Simple & Clean Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] font-normal tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Categories: Horizontal Scroll on Mobile, Centered & Aligned on Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto md:flex-wrap md:justify-center items-start gap-3 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-5xl mx-auto pb-2 pt-1 px-1 sm:px-0 scrollbar-none snap-x touch-pan-x min-w-0"
        >
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group shrink-0 flex flex-col items-center text-center w-[82px] sm:w-[100px] md:w-[120px] snap-start transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Circle Avatar with Ring & Subtle Hover Shadow */}
              <div className="relative w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-[3px] bg-gradient-to-tr from-[#E2E8F0] via-white to-[#BAE6FD] ring-1 ring-[#CBD5E1] group-hover:ring-2 group-hover:ring-[#0284C7] group-hover:shadow-xl transition-all duration-300">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F8FAFC]">
                  <Image
                    src={cat.image_url || '/images/placeholder-saree.svg'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 120px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="font-sans text-xs sm:text-sm text-[#0F172A] font-medium tracking-tight transition-colors mt-2.5 leading-snug group-hover:text-[#0284C7] line-clamp-2 capitalize">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Scroll Indicator Dots */}
        {displayCategories.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-3 sm:mt-4">
            {displayCategories.map((cat, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={cat.id || idx}
                  type="button"
                  onClick={() => scrollToCategory(idx)}
                  aria-label={`Scroll to ${cat.name}`}
                  className={cn(
                    'transition-all duration-300 rounded-full cursor-pointer',
                    isActive
                      ? 'w-6 h-1.5 bg-[#0F172A]'
                      : 'w-1.5 h-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
