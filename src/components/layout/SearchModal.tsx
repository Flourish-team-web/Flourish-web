'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Loader2, ArrowRight, Clock, X, Sparkles, Flame, Tag, Layers } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchSuggestion } from '@/types/store.types';
import { cn } from '@/lib/utils/cn';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'flourish_recent_searches_v1';

const POPULAR_SEARCHES = [
  'Kanchipuram Silk',
  'Banarasi Brocade',
  'Pure Organza',
  'Soft Silk',
  'Bridal Red',
  'Temple Border',
  'Handloom Cotton',
  'Pastel Drapes',
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchTerm, 200);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {}
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setSuggestions([]);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setIsLoading(true);
      fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.suggestions || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      onClose();
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (url: string, title: string) => {
    saveRecentSearch(title);
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200">
      {/* Dark backdrop with glassmorphism */}
      <div
        className="fixed inset-0 bg-[#010814]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#081E36] via-[#051325] to-[#020B17] border border-[#1B487A] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden ring-1 ring-white/10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
      >
        {/* Top Search Input Area */}
        <form onSubmit={handleSearchSubmit} className="relative p-4 sm:p-5 border-b border-[#163860]">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-[#38BDF8]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search sarees by weave, fabric, occasion or color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#030E1C] border border-[#1E4575] focus:border-[#38BDF8] focus:bg-[#041224] pl-11 pr-24 py-3 sm:py-3.5 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 tracking-wide rounded-xl transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-white/50 hover:text-white transition-colors"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isLoading && (
                <Loader2 className="w-4 h-4 text-[#38BDF8] animate-spin" />
              )}
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-white/50 bg-[#0E2744] hover:bg-[#163860] hover:text-white border border-[#1E4575] rounded transition-colors"
              >
                ESC
              </button>
            </div>
          </div>
        </form>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-none flex-1">
          {/* 1. Live Search Suggestions */}
          {suggestions.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#163860]/80">
                <span className="text-[11px] uppercase tracking-widest text-[#38BDF8] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Matches
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {suggestions.length} results
                </span>
              </div>

              <div className="space-y-1.5">
                {suggestions.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSuggestionClick(item.url, item.title)}
                    className="p-2.5 sm:p-3 rounded-xl flex items-center justify-between bg-[#06182D]/60 hover:bg-[#0B2544] border border-[#163860]/50 hover:border-[#38BDF8]/60 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {item.imageUrl ? (
                        <div className="relative w-11 h-13 bg-[#020A14] rounded-lg shrink-0 overflow-hidden border border-[#1B487A]">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : item.type === 'category' ? (
                        <div className="w-11 h-13 bg-[#08203E] rounded-lg flex items-center justify-center text-[#38BDF8] shrink-0 border border-[#1B487A]">
                          <Layers className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-11 h-13 bg-[#08203E] rounded-lg flex items-center justify-center text-[#38BDF8] shrink-0 border border-[#1B487A]">
                          <Tag className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="font-serif text-sm sm:text-base text-white font-medium group-hover:text-[#38BDF8] transition-colors truncate">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-[11px] text-[#38BDF8]/80 uppercase tracking-wider font-sans font-medium mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-3">
                      <span className="text-xs text-white/50 group-hover:text-[#38BDF8] transition-colors hidden sm:inline">
                        View
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#38BDF8] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs uppercase tracking-widest text-[#38BDF8] hover:text-white font-semibold transition-colors py-1 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>See all catalog results for &ldquo;{searchTerm}&rdquo;</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ) : searchTerm.trim().length >= 2 && !isLoading ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#0B2544] border border-[#163860] flex items-center justify-center mx-auto text-[#38BDF8]">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm text-white/80 font-serif">
                No instant matches found for &ldquo;{searchTerm}&rdquo;
              </p>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B2544] border border-[#1E4575] hover:border-[#38BDF8] text-xs font-semibold text-[#38BDF8] uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Search entire saree collection</span>
                <span>→</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#163860]/80 pb-2">
                    <span className="text-[11px] uppercase tracking-widest text-[#38BDF8] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[10px] text-white/40 uppercase tracking-wider hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push(`/search?q=${encodeURIComponent(term)}`);
                        }}
                        className="px-3.5 py-1.5 bg-[#06182D] border border-[#163860] hover:border-[#38BDF8] hover:bg-[#0B2544] text-white/85 hover:text-white text-xs font-sans tracking-wide transition-all rounded-full flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3 h-3 text-white/40" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular / Trending Searches */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-[#163860]/80 pb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] uppercase tracking-widest text-white/80 font-bold">
                    Popular & Trending Weaves
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(tag);
                        onClose();
                        router.push(`/search?q=${encodeURIComponent(tag)}`);
                      }}
                      className="px-3.5 py-1.5 bg-[#071D37]/80 hover:bg-[#0D325E] border border-[#1B487A]/70 hover:border-[#38BDF8] text-white/80 hover:text-white text-xs font-sans tracking-wide transition-all rounded-full cursor-pointer shadow-xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="p-3 px-5 bg-[#020A14] border-t border-[#163860] flex items-center justify-between text-[11px] text-white/40 font-light">
          <span>Tip: Press <kbd className="font-mono text-[#38BDF8] bg-white/5 px-1 py-0.5 rounded border border-white/10">Enter</kbd> to search</span>
          <span>Authentic Handloom Catalog</span>
        </div>
      </div>
    </div>
  );
}
