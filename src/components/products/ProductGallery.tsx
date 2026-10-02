'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const displayImages = (images && images.length > 0 ? images : [
    { id: 'default', image_url: '/images/placeholder-saree.svg', alt_text: productName, display_order: 0, is_primary: true, product_id: 'default', created_at: '' }
  ]).slice(0, 5);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const currentImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col items-center w-full max-w-[420px] mx-auto lg:mx-0">
      {/* 1. Main Image Viewport (Compact, properly proportioned) */}
      <div className="relative aspect-[3/4] w-full max-h-[440px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden group shadow-xs">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || `${productName} view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 420px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-104"
        />

        {/* Carousel Prev/Next Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:bg-white hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm hover:bg-white hover:scale-105 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter Tag */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] tracking-wider font-mono uppercase">
            {activeIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* 2. Bottom Thumbnails (Clean horizontal row under the main image) */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-3.5 w-full overflow-x-auto scrollbar-none py-0.5">
          {displayImages.map((img, index) => {
            const isCurrent = activeIndex === index;
            return (
              <button
                key={img.id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative aspect-[3/4] w-14 sm:w-16 shrink-0 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 transition-all duration-200 cursor-pointer',
                  isCurrent
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-xs scale-105'
                    : 'border-[#E2E8F0] opacity-60 hover:opacity-100 hover:border-[#94A3B8]'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
