'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, MessageCircle, ChevronDown } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { SearchModal } from './SearchModal';
import { Drawer } from '@/components/ui/Drawer';
import { BrandLogo, FlourishIcon } from '@/components/ui/BrandLogo';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/store.types';
import { FALLBACK_CATEGORIES } from '@/lib/data/catalogFallback';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { name: 'Categories', href: '#', hasDropdown: true },
  { name: 'New Arrivals', href: '/products?sort=newest' },
  { name: 'Collections', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>(FALLBACK_CATEGORIES);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        // Fallback categories active
      }
    };
    fetchCats();
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b border-[#163860]/80',
          isScrolled 
            ? 'shadow-2xl shadow-black/50 py-2 sm:py-2.5 bg-gradient-to-r from-[#020A14] via-[#061C36] to-[#020A14] backdrop-blur-md' 
            : 'py-2.5 sm:py-3.5 bg-gradient-to-r from-[#030E1C] via-[#082547] to-[#041326] shadow-[0_4px_30px_rgba(2,10,20,0.6)]'
        )}
      >
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Brand Identity / Official Large Logo */}
            <BrandLogo size="md" asLink={true} priority={true} className="ml-0 sm:ml-2 lg:ml-6" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              {NAV_LINKS.map((link) => {
                const isCategoryActive = link.hasDropdown && pathname.startsWith('/categories');
                const isActive = pathname === link.href || isCategoryActive;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative group/cat py-2"
                    >
                      <button
                        type="button"
                        className={cn(
                          'text-[11.5px] uppercase tracking-[0.2em] font-medium transition-all hover:text-[#38BDF8] flex items-center gap-1.5 py-1 cursor-pointer select-none bg-transparent border-none',
                          isCategoryActive ? 'text-[#38BDF8] font-semibold' : 'text-[#E2E8F0]/85 hover:text-white'
                        )}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover/cat:rotate-180 text-white/50 group-hover/cat:text-[#38BDF8]" />
                        {isCategoryActive && (
                          <span className="absolute bottom-0.5 left-0 right-0 h-[1.5px] bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)] rounded-full" />
                        )}
                      </button>

                      {/* Desktop Dropdown Menu */}
                      <div
                        className={cn(
                          'absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 pointer-events-none opacity-0 translate-y-1',
                          'group-hover/cat:pointer-events-auto group-hover/cat:opacity-100 group-hover/cat:translate-y-0'
                        )}
                      >
                        <div className="w-72 bg-gradient-to-b from-[#07172B] to-[#030C18] border border-[#163860] rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/50">
                          <div className="px-3 py-2 border-b border-[#163860]/60 mb-1 flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#38BDF8]">
                              Curated Weaves
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">
                              {categories.length} varieties
                            </span>
                          </div>

                          <div className="max-h-80 overflow-y-auto space-y-1 py-1 scrollbar-none">
                            {categories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/85 hover:text-white hover:bg-[#0B2544] transition-all group/item"
                              >
                                {cat.image_url ? (
                                  <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/20">
                                    <Image
                                      src={cat.image_url}
                                      alt={cat.name}
                                      fill
                                      sizes="28px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-[#163860] flex items-center justify-center text-[10px] text-[#38BDF8] font-bold shrink-0">
                                    {cat.name.charAt(0)}
                                  </div>
                                )}
                                <span className="font-serif font-normal tracking-wide group-hover/item:translate-x-1 transition-transform">
                                  {cat.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'text-[11.5px] uppercase tracking-[0.2em] font-medium transition-all hover:text-[#38BDF8] relative py-1',
                      isActive ? 'text-[#38BDF8] font-semibold' : 'text-[#E2E8F0]/85 hover:text-white'
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Utilities */}
            <div className="flex items-center space-x-2 sm:space-x-3.5">
              {/* Desktop Search Pill */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center justify-between gap-2.5 w-44 lg:w-56 px-3.5 py-1.5 lg:py-2 rounded-full border border-[#1E4575] bg-gradient-to-r from-[#07192F]/90 to-[#0B2544]/90 hover:from-[#0B2544] hover:to-[#0F345E] text-white/60 hover:text-white hover:border-[#38BDF8]/70 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all text-xs tracking-wide group"
                aria-label="Open search dialog"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-light truncate text-white/50 group-hover:text-white/80 transition-colors">Search sarees...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-[#38BDF8]/90 bg-[#061426] border border-[#1E4575] rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-white/80 hover:text-[#38BDF8] hover:scale-105 transition-all"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist / Heart (Desktop only) */}
              <Link
                href="/wishlist"
                className="hidden lg:flex items-center justify-center p-2 text-white/80 hover:text-[#38BDF8] hover:scale-105 transition-all relative"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                <span className="absolute top-1 right-1 bg-[#0284C7] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.8)]">
                  {wishlistCount}
                </span>
              </Link>

              {/* Shopping Bag CTA / Cart (Mobile & Desktop) */}
              <a
                href={buildBespokeWhatsAppUrl('919876543210')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 text-white/80 hover:text-[#38BDF8] hover:scale-105 transition-all relative"
                title="Shopping Bag / Connect on WhatsApp"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                <span className="absolute top-1 right-1 bg-[#0284C7] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.8)]">
                  0
                </span>
              </a>

              {/* Mobile menu trigger (Right side on mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-white/80 hover:text-[#38BDF8] focus:outline-none transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Side Drawer Navigation - Right slide-in */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Flourish Women's"
        side="right"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <div className="pt-2 pb-2">
              <BrandLogo size="sm" showTagline={true} theme="light" />
            </div>
            <p className="text-[11px] font-sans tracking-[0.2em] text-[#0284C7] uppercase font-semibold">
              Explore Collections
            </p>
            <nav className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div key={link.name} className="space-y-2 border-b border-[#F1F5F9] pb-3">
                      <button
                        type="button"
                        onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                        className="w-full flex items-center justify-between font-serif text-lg text-[#071324] hover:text-[#0284C7] transition-colors py-1 text-left cursor-pointer"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform duration-200 text-[#64748B]',
                            isMobileCategoriesOpen && 'rotate-180 text-[#0284C7]'
                          )}
                        />
                      </button>

                      {/* Expandable Categories sub-list */}
                      {isMobileCategoriesOpen && (
                        <div className="pl-3 py-1 space-y-2 border-l-2 border-[#0284C7]/30 ml-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/categories/${cat.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2.5 text-sm text-[#475569] hover:text-[#0284C7] py-1 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                              <span>{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-lg text-[#071324] hover:text-[#0284C7] transition-colors py-1"
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-lg text-[#071324] hover:text-[#0284C7] transition-colors flex items-center justify-between py-1"
              >
                <span>My Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="text-xs bg-[#38BDF8] text-[#071324] px-2 py-0.5 rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          <div className="border-t border-[#E2E8F0] pt-6 space-y-4">
            <a
              href={buildBespokeWhatsAppUrl('919876543210')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#071324] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#0E2038] hover:text-[#38BDF8] transition-all rounded shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-[#38BDF8]" />
              <span>WhatsApp Stylist</span>
            </a>
            <p className="text-[11px] text-[#64748B] text-center font-light">
              Crafted with authentic handloom traditions.
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
}
