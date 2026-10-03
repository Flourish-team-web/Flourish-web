'use client';

import * as React from 'react';
import Link from 'next/link';
import { LogOut, ExternalLink, ShieldCheck, User, Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface AdminHeaderProps {
  userEmail?: string | null;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onOpenSignOut?: () => void;
}

export function AdminHeader({
  userEmail,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onOpenSignOut,
}: AdminHeaderProps) {
  return (
    <header className="bg-[#071324] text-white h-16 border-b border-[#1a3a5c]/60 px-3.5 sm:px-5 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/30">
      {/* Left: Brand Logo + Admin Console Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        <BrandLogo size="sm" showTagline={false} asLink={false} theme="dark" />

        <div className="hidden md:flex items-center gap-1.5 text-[10px] bg-gradient-to-r from-[#0284C7]/20 to-[#38BDF8]/10 text-[#38BDF8] border border-[#0284C7]/30 px-2.5 py-1 uppercase tracking-widest font-semibold rounded-full">
          <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
          Admin Console
        </div>
      </div>

      {/* Right: User Email + Storefront + Sign Out (Desktop) + Mobile Hamburger Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* User pill (Desktop) */}
        {userEmail && (
          <div className="hidden lg:flex items-center gap-2 text-[#94A3B8] bg-[#0E2038] border border-[#1d3e6b] px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0284C7] to-[#38BDF8] flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-mono text-[11px] text-white max-w-[140px] truncate">
              {userEmail}
            </span>
          </div>
        )}

        {/* View Storefront */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-[#38BDF8] hover:text-white transition-all font-semibold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/25 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px]"
          title="Open storefront in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Storefront</span>
        </Link>

        {/* Desktop Sign Out Button with confirmation trigger */}
        {onOpenSignOut && (
          <button
            type="button"
            onClick={onOpenSignOut}
            className="hidden lg:flex items-center gap-1.5 text-[#64748B] hover:text-rose-400 transition-colors cursor-pointer bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 px-3 py-1.5 rounded-full font-medium text-[11px]"
            title="Sign out of admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}

        {/* Right-aligned Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close sidebar menu' : 'Open sidebar menu'}
            className="lg:hidden p-2 text-[#38BDF8] bg-[#0284C7]/15 hover:bg-[#0284C7]/25 border border-[#0284C7]/30 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-[#38BDF8]" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
