'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
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
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return;
      if (e.key === 'Escape') setIsZoomOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, displayImages.length]);

  const currentImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto lg:mx-0 select-none">
      {/* 1. Main Luxury Saree Frame */}
      <div
        className="relative aspect-[4/5] w-full bg-[#FAF9F6] border border-[#E2E8F0] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg shadow-slate-200/60 cursor-zoom-in"
        onClick={() => setIsZoomOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || `${productName} view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
          className={cn(
            'object-cover object-top transition-transform duration-700 ease-out',
            isHovered ? 'scale-105' : 'scale-100'
          )}
        />

        {/* Subtle Top Gradient overlay with Brand Badge */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3.5 left-3.5 flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-[10px] uppercase font-semibold tracking-widest shadow-sm">
          <span>Handloom Silk</span>
        </div>

        {/* Zoom Expand Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(true);
          }}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 cursor-pointer"
          title="Click to view full screen"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#0F172A]" />
        </button>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 cursor-pointer border border-[#E2E8F0]"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-[#0F172A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 cursor-pointer border border-[#E2E8F0]"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Bottom Floating Index Pill */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider shadow-sm flex items-center gap-1 border border-white/10">
            <span>{activeIndex + 1}</span>
            <span className="text-white/40">/</span>
            <span>{displayImages.length}</span>
          </div>
        )}
      </div>

      {/* 2. High-End Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4 w-full overflow-x-auto scrollbar-none py-1">
          {displayImages.map((img, index) => {
            const isCurrent = activeIndex === index;
            return (
              <button
                key={img.id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative aspect-[4/5] w-16 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 transition-all duration-200 cursor-pointer shadow-xs',
                  isCurrent
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/25 shadow-md scale-105'
                    : 'border-[#E2E8F0] opacity-60 hover:opacity-100 hover:border-[#94A3B8]'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Full-screen Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Close zoomed view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Full-screen Image Viewport */}
          <div
            className="relative w-full max-w-4xl h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text || productName}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 text-white text-xs font-mono border border-white/20">
              {activeIndex + 1} / {displayImages.length} • {productName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
