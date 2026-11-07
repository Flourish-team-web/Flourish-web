'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, ZoomOut } from 'lucide-react';
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
  const [isZoomed, setIsZoomed] = React.useState(false);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  const toggleZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed((prev) => !prev);
  };

  const currentImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto select-none">
      {/* 1. Main Luxury Saree Frame: Displays 100% full image without any cropping or cutting */}
      <div
        onClick={toggleZoom}
        className={cn(
          'relative w-full aspect-[4/5] bg-[#FAF9F6] border border-[#E2E8F0] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg shadow-black/5 transition-all duration-300 flex items-center justify-center p-1 sm:p-2',
          'h-[420px] sm:h-[480px] lg:h-[510px] max-h-[66vh]',
          isZoomed ? 'cursor-zoom-out ring-2 ring-[#0284C7]/30' : 'cursor-zoom-in'
        )}
        title={isZoomed ? 'Click to restore normal size' : 'Click to enlarge saree in this frame'}
      >
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || `${productName} view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
          className={cn(
            'object-contain object-center pointer-events-none select-none transition-transform duration-300 ease-out',
            isZoomed
              ? 'scale-[1.4]'
              : 'scale-100 group-hover:scale-[1.01]'
          )}
        />

        {/* Discrete In-Place Zoom Toggle Button in the Corner */}
        <button
          type="button"
          onClick={toggleZoom}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#0F172A] backdrop-blur-md flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer border border-[#E2E8F0] z-10"
          title={isZoomed ? 'Click to restore normal view' : 'Click to enlarge in same area'}
          aria-label={isZoomed ? 'Restore normal view' : 'Enlarge view'}
        >
          {isZoomed ? (
            <ZoomOut className="w-4 h-4 text-[#0284C7]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-[#475569]" />
          )}
        </button>

        {/* Navigation Arrows on Main Frame */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer border border-[#E2E8F0] z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer border border-[#E2E8F0] z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Bottom Floating Index Pill */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider shadow-sm flex items-center gap-1 border border-white/10 pointer-events-none z-10">
            <span>{activeIndex + 1}</span>
            <span className="text-white/40">/</span>
            <span>{displayImages.length}</span>
          </div>
        )}
      </div>

      {/* 2. Related Product Images Thumbnails - Displayed in full without cropping */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 mt-3 sm:mt-4 w-full overflow-x-auto scrollbar-none py-1">
          {displayImages.map((img, index) => {
            const isCurrent = activeIndex === index;
            return (
              <button
                key={img.id || index}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setIsZoomed(false);
                }}
                className={cn(
                  'relative aspect-[4/5] w-16 sm:w-20 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#FAF9F6] border-2 transition-all duration-200 cursor-pointer shadow-xs p-1 flex items-center justify-center',
                  isCurrent
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md scale-105'
                    : 'border-[#E2E8F0] opacity-75 hover:opacity-100 hover:border-[#94A3B8]'
                )}
                aria-label={`View photo ${index + 1}`}
                title={`View photo ${index + 1}`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="90px"
                  className="object-contain object-center p-0.5"
                />
                {isCurrent && (
                  <div className="absolute inset-0 bg-[#0284C7]/10 pointer-events-none rounded-xl" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
