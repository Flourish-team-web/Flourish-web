'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Eye } from 'lucide-react';
import { Reel } from '@/types/store.types';
import { Modal } from '@/components/ui/Modal';

// Placeholder reels shown when no data is in the database yet
const PLACEHOLDER_REELS = [
  { id: 'r1', title: 'Wedding Look', view_count_label: '12.4K views', thumbnail_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop', video_url: null },
  { id: 'r2', title: 'Festive Edit', view_count_label: '8.7K views', thumbnail_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop', video_url: null },
  { id: 'r3', title: 'Kanchipuram Love', view_count_label: '15.2K views', thumbnail_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop', video_url: null },
  { id: 'r4', title: 'Everyday Elegance', view_count_label: '9.1K views', thumbnail_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop&crop=faces', video_url: null },
  { id: 'r5', title: 'Behind the Weaves', view_count_label: '11.6K views', thumbnail_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop&crop=top', video_url: null },
  { id: 'r6', title: 'Styling Tips', view_count_label: '7.4K views', thumbnail_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop&crop=bottom', video_url: null },
];

interface ReelsSectionProps {
  reels: Reel[];
}

export function ReelsSection({ reels }: ReelsSectionProps) {
  const [activeVideoUrl, setActiveVideoUrl] = React.useState<string | null>(null);

  const displayReels = (reels && reels.length > 0 ? reels : PLACEHOLDER_REELS) as typeof PLACEHOLDER_REELS;

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-[#EAE3D2] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Section header */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#0F1C2E] font-medium tracking-tight">
              Flourish Reels
            </h2>
            <div className="hidden sm:block h-[1px] w-8 bg-[#CBD5E1]" />
            <span className="hidden sm:block text-xs text-[#64748B] font-light tracking-wide">
              Real Women, Real Stories, Real Sarees.
            </span>
          </div>
          <Link
            href="/products"
            className="text-[11px] sm:text-xs uppercase tracking-widest text-[#0F1C2E] font-semibold hover:text-[#0284C7] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>View All Reels</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* 6 Cards Grid / Horizontal Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {displayReels.slice(0, 6).map((reel) => (
            <div
              key={reel.id}
              onClick={() => reel.video_url && setActiveVideoUrl(reel.video_url)}
              className="group relative w-full aspect-[9/16] bg-[#071324] overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={reel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={reel.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Card Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

              {/* Three-dot vertical menu */}
              <div className="absolute top-3 right-3 flex flex-col gap-0.5 z-10">
                <div className="w-1 h-1 rounded-full bg-white/90" />
                <div className="w-1 h-1 rounded-full bg-white/90" />
                <div className="w-1 h-1 rounded-full bg-white/90" />
              </div>

              {/* Center Translucent Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-[#0F1C2E] transition-all duration-300 shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Card Title & Views */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white space-y-0.5">
                <h4 className="font-sans text-xs sm:text-sm font-semibold text-white leading-tight drop-shadow-sm">
                  {reel.title}
                </h4>
                {reel.view_count_label && (
                  <p className="text-[10px] sm:text-[11px] text-white/80 font-normal">
                    {reel.view_count_label}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={!!activeVideoUrl}
        onClose={() => setActiveVideoUrl(null)}
        className="max-w-md p-0 overflow-hidden bg-black"
      >
        {activeVideoUrl && (
          <div className="relative aspect-[9/16] w-full bg-black">
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </Modal>
    </section>
  );
}
