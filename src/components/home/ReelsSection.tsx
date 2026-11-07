'use client';

import * as React from 'react';
import Image from 'next/image';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Reel } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

// High-quality placeholder reels if database items are empty or fewer
const isVisibleTitle = (title?: string | null): boolean => {
  if (!title) return false;
  const trimmed = title.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  return lower !== 'flourish reel' && lower !== 'untitled reel';
};

const PLACEHOLDER_REELS = [
  {
    id: 'r1',
    title: 'Bridal Kanchipuram Styling',
    view_count_label: '18.4K views',
    tag: 'Bestseller Drape',
    thumbnail_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'r2',
    title: 'Festive Kadwa Banarasi Gold',
    view_count_label: '12.8K views',
    tag: 'Handwoven Korvai',
    thumbnail_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'r3',
    title: 'Heritage Temple Jewellery Match',
    view_count_label: '24.2K views',
    tag: 'Restocked on Demand',
    thumbnail_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'r4',
    title: 'Pastel Organza Featherlight Drape',
    view_count_label: '9.6K views',
    tag: 'Styling Tip',
    thumbnail_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  },
  {
    id: 'r5',
    title: 'Behind the Master Weaving Looms',
    view_count_label: '15.1K views',
    tag: 'Pure Silk Mark',
    thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
];

interface ReelVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  initialMuted?: boolean;
  onMutePreferenceChange?: (isMuted: boolean) => void;
  onClose: () => void;
}

function ReelVideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  initialMuted = false,
  onMutePreferenceChange,
  onClose,
}: ReelVideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState<boolean>(initialMuted);
  const [audioToast, setAudioToast] = React.useState<string | null>(null);
  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = React.useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setAudioToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setAudioToast(null);
    }, 1800);
  }, []);

  // Play immediately on mount (user explicitly clicked play)
  React.useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    setHasError(false);
    setIsBuffering(true);

    const startPlayback = async () => {
      try {
        // Explicitly set full volume and initial mute preference
        vid.volume = 1.0;
        vid.muted = initialMuted;

        await vid.play();
        setIsPlaying(true);
        setIsBuffering(false);
        setIsMuted(initialMuted);
      } catch {
        // Fallback: If browser autoplay policy blocks unmuted audio on mount,
        // fall back to muted play and update the UI state to Muted immediately
        if (vid) {
          vid.muted = true;
          setIsMuted(true);
          onMutePreferenceChange?.(true);
          try {
            await vid.play();
            setIsPlaying(true);
            setIsBuffering(false);
          } catch {
            setIsPlaying(false);
            setIsBuffering(false);
          }
        }
      }
    };

    startPlayback();

    // Clean pause on unmount — NEVER delete 'src' attribute
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      try {
        vid.pause();
      } catch {}
    };
  }, [videoUrl, initialMuted, onMutePreferenceChange]);

  // Synchronize with native volumechange events
  const handleVolumeChange = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const realMuted = vid.muted || vid.volume === 0;
    setIsMuted(realMuted);
  };

  // Direct synchronous mute toggle within user click gesture
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.muted || isMuted) {
      // Direct user gesture: unmute and set full volume
      vid.muted = false;
      vid.volume = 1.0;
      setIsMuted(false);
      onMutePreferenceChange?.(false);
      showToast('Sound On');
      if (vid.paused) {
        vid.play().catch(() => {});
      }
    } else {
      // Direct user gesture: mute
      vid.muted = true;
      setIsMuted(true);
      onMutePreferenceChange?.(true);
      showToast('Muted');
    }
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.volume = 1.0;
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
    }
    onClose();
  };

  const handleStopAndClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
    }
    onClose();
  };

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#071324] z-10 cursor-pointer select-none overflow-hidden"
      onClick={handleTogglePlay}
    >
      {/* Background Thumbnail Image — stays visible so it is NEVER a blank black screen */}
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 60vw, 20vw"
          className={cn(
            'object-cover object-center transition-opacity duration-300',
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
          priority
        />
      )}

      {/* HTML5 Video Element */}
      {!hasError ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          playsInline
          webkit-playsinline="true"
          autoPlay
          muted={isMuted}
          preload="auto"
          onVolumeChange={handleVolumeChange}
          onPlaying={() => {
            setIsPlaying(true);
            setIsBuffering(false);
          }}
          onCanPlay={() => setIsBuffering(false)}
          onWaiting={() => setIsBuffering(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onError={() => {
            setHasError(true);
            setIsBuffering(false);
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isPlaying ? 'opacity-100' : 'opacity-0'
          )}
        />
      ) : (
        /* Graceful error state if video fails to load */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/85 text-white z-20">
          <p className="text-xs font-medium text-rose-300 mb-2">Video preview unavailable</p>
          <button
            type="button"
            onClick={handleStopAndClose}
            className="text-[10px] uppercase tracking-wider underline text-white/80 hover:text-white"
          >
            Back to cover
          </button>
        </div>
      )}

      {/* Buffering Spinner */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none z-20">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        {/* Stop / Close Video Button */}
        <button
          type="button"
          onClick={handleStopAndClose}
          aria-label="Stop video"
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center shadow-lg hover:bg-black/80 hover:scale-105 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Audio / Mute Toggle Button with Clear State Indicator */}
        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className={cn(
            'px-2.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-all cursor-pointer',
            isMuted
              ? 'bg-black/70 hover:bg-black/90 text-white border border-white/20'
              : 'bg-[#0F1C2E]/85 hover:bg-[#0F1C2E] text-[#38BDF8] border border-[#38BDF8]/40 ring-1 ring-[#38BDF8]/20'
          )}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-medium tracking-wide">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[10px] font-medium tracking-wide text-[#38BDF8]">Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* Audio Toast Indicator */}
      {audioToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          {audioToast}
        </div>
      )}

      {/* Paused State Overlay */}
      {!isPlaying && !isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/35 pointer-events-none transition-opacity z-20">
          <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-xl">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}

interface ReelsSectionProps {
  reels: Reel[];
}

export function ReelsSection({ reels }: ReelsSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [playingReelId, setPlayingReelId] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  // Default to sound on (unmuted) so user hears audio immediately when clicking play
  const [isMuted, setIsMuted] = React.useState(false);

  // Touch tracking for mobile swipe gestures
  const touchStartXRef = React.useRef<number | null>(null);
  const touchEndXRef = React.useRef<number | null>(null);

  // Automatically turn off playing video when user scrolls away from the reels section
  React.useEffect(() => {
    if (!playingReelId) return;

    const currentSection = sectionRef.current;
    if (!currentSection || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If video section is scrolled out of viewport (less than 25% visible), turn video off
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
            setPlayingReelId(null);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5],
      }
    );

    observer.observe(currentSection);

    return () => {
      observer.disconnect();
    };
  }, [playingReelId]);

  // Combine database reels with placeholders to ensure at least 5 rich cards
  const displayReels = React.useMemo(() => {
    if (reels && reels.length >= 5) {
      return reels;
    }
    if (reels && reels.length > 0) {
      const remainingNeeded = 5 - reels.length;
      return [...reels, ...PLACEHOLDER_REELS.slice(0, remainingNeeded)];
    }
    return PLACEHOLDER_REELS;
  }, [reels]);

  // Ensure 5 cards on desktop
  const desktopReels = displayReels.slice(0, 5);

  const total = displayReels.length;
  const leftIndex = (activeIndex - 1 + total) % total;
  const centerIndex = activeIndex;
  const rightIndex = (activeIndex + 1) % total;

  const leftReel = displayReels[leftIndex];
  const centerReel = displayReels[centerIndex];
  const rightReel = displayReels[rightIndex];

  const handlePrev = React.useCallback(() => {
    setPlayingReelId(null);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = React.useCallback(() => {
    setPlayingReelId(null);
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diffX = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 40; // px

    if (diffX > minSwipeDistance) {
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-12 bg-white border-b border-[#EAE3D2] overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#0F1C2E] font-medium tracking-tight">
              Flourish Reels
            </h2>
            <div className="hidden sm:block h-[1px] w-8 bg-[#CBD5E1]" />
            <span className="hidden sm:block text-xs text-[#64748B] font-light tracking-wide">
              Real Women, Real Stories, Real Sarees.
            </span>
          </div>
        </div>

        {/* ================================================================================================== */}
        {/* 1. MOBILE RESPONSIVE 3-CARD CAROUSEL (Inline card playback on center active card)                 */}
        {/* ================================================================================================== */}
        <div className="block md:hidden relative -mx-4 sm:mx-0">
          <div
            className="relative overflow-hidden w-full h-[420px] min-[400px]:h-[450px] sm:h-[490px] flex items-center justify-center touch-pan-y select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 1. LEFT CARD (Showing right ~45% half, scaled down) */}
            <div
              key={`left-${leftReel.id || leftIndex}`}
              onClick={handlePrev}
              style={{ width: '56vw' }}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-[calc(50%+56vw+14px)] max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer scale-[0.84] opacity-60 shadow-md brightness-90 transition-all duration-300 z-0 origin-center"
            >
              <Image
                src={leftReel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={leftReel.title}
                fill
                sizes="60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white opacity-60">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* 2. CENTER CARD (Active Reel: Big, Elevated, Centered, Inline Video Playback) */}
            <div
              key={`center-${centerReel.id || centerIndex}`}
              style={{ width: '56vw' }}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 transition-all duration-300 z-10 origin-center bg-black"
            >
              {playingReelId === centerReel.id && centerReel.video_url ? (
                /* INLINE VIDEO PLAYING INSIDE MOBILE CARD */
                <ReelVideoPlayer
                  key={`mobile-video-${centerReel.id}`}
                  videoUrl={centerReel.video_url}
                  thumbnailUrl={centerReel.thumbnail_url}
                  title={centerReel.title}
                  initialMuted={isMuted}
                  onMutePreferenceChange={setIsMuted}
                  onClose={() => setPlayingReelId(null)}
                />
              ) : (
                /* THUMBNAIL COVER STATE (User clicks play button to start) */
                <div
                  onClick={() => {
                    if (centerReel.video_url) {
                      setPlayingReelId(centerReel.id);
                    }
                  }}
                  className="relative w-full h-full cursor-pointer group"
                >
                  <Image
                    src={centerReel.thumbnail_url || '/images/placeholder-saree.svg'}
                    alt={centerReel.title}
                    fill
                    sizes="60vw"
                    className="object-cover object-center"
                    priority
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

                  {/* Optional Tag/Badge */}
                  {'tag' in centerReel && centerReel.tag && (
                    <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[10px] text-white font-medium shadow-xs truncate max-w-[70%]">
                      {centerReel.tag}
                    </div>
                  )}

                  {/* Center Translucent Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-white group-hover:text-[#0F1C2E] transition-all duration-300">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Title & Views (Only show if custom title or views present) */}
              {(isVisibleTitle(centerReel.title) || centerReel.view_count_label) && (
                <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white space-y-0.5 pointer-events-none z-20">
                  {isVisibleTitle(centerReel.title) && (
                    <h4 className="font-sans text-xs sm:text-sm font-semibold text-white leading-tight drop-shadow-sm line-clamp-2">
                      {centerReel.title}
                    </h4>
                  )}
                  {centerReel.view_count_label && (
                    <p className="text-[10px] text-white/80 font-normal">
                      {centerReel.view_count_label}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 3. RIGHT CARD (Showing left ~45% half, scaled down) */}
            <div
              key={`right-${rightReel.id || rightIndex}`}
              onClick={handleNext}
              style={{ width: '56vw' }}
              className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-[calc(-50%+56vw+14px)] max-w-[270px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer scale-[0.84] opacity-60 shadow-md brightness-90 transition-all duration-300 z-0 origin-center"
            >
              <Image
                src={rightReel.thumbnail_url || '/images/placeholder-saree.svg'}
                alt={rightReel.title}
                fill
                sizes="60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white opacity-60">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Left Circular Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Reel"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#0F1C2E] shadow-xl flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-black/5 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Right Circular Navigation Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Reel"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 text-[#0F1C2E] shadow-xl flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all border border-black/5 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </div>

          {/* Mobile Pagination Pill & Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {displayReels.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPlayingReelId(null);
                    setActiveIndex(idx);
                  }}
                  aria-label={`Go to reel ${idx + 1}`}
                  className={cn(
                    'transition-all duration-300 rounded-full cursor-pointer',
                    isActive
                      ? 'w-6 h-1.5 bg-[#0F1C2E]'
                      : 'w-1.5 h-1.5 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DESKTOP VIEW: EXACTLY 5 REEL CARDS IN A 5-COLUMN GRID                  */}
        {/* ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-5">
          {desktopReels.map((reel) => {
            const isThisPlaying = playingReelId === reel.id && !!reel.video_url;

            return (
              <div
                key={reel.id}
                className="group relative w-full aspect-[9/16] bg-[#071324] overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-black/5"
              >
                {isThisPlaying ? (
                  /* INLINE VIDEO PLAYING INSIDE CARD */
                  <ReelVideoPlayer
                    key={`desktop-video-${reel.id}`}
                    videoUrl={reel.video_url!}
                    thumbnailUrl={reel.thumbnail_url}
                    title={reel.title}
                    initialMuted={isMuted}
                    onMutePreferenceChange={setIsMuted}
                    onClose={() => setPlayingReelId(null)}
                  />
                ) : (
                  /* THUMBNAIL COVER STATE (User clicks play button to start) */
                  <div
                    onClick={() => {
                      if (reel.video_url) {
                        setPlayingReelId(reel.id);
                      }
                    }}
                    className="relative w-full h-full cursor-pointer"
                  >
                    <Image
                      src={reel.thumbnail_url || '/images/placeholder-saree.svg'}
                      alt={reel.title}
                      fill
                      sizes="(max-width: 1024px) 20vw, 18vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Card Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                    {/* Optional Tag/Badge */}
                    {'tag' in reel && reel.tag && (
                      <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] text-white font-medium shadow-xs truncate max-w-[75%]">
                        {reel.tag}
                      </div>
                    )}

                    {/* Center Translucent Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-[#0F1C2E] transition-all duration-300 shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Card Title & Views (Only show if custom title or views present) */}
                {(isVisibleTitle(reel.title) || reel.view_count_label) && (
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white space-y-0.5 pointer-events-none z-20">
                    {isVisibleTitle(reel.title) && (
                      <h4 className="font-sans text-xs sm:text-sm font-semibold text-white leading-tight drop-shadow-sm line-clamp-2">
                        {reel.title}
                      </h4>
                    )}
                    {reel.view_count_label && (
                      <p className="text-[10px] sm:text-[11px] text-white/80 font-normal">
                        {reel.view_count_label}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
