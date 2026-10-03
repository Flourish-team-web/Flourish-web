'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderKanban,
  MessageSquare,
  Image as ImageIcon,
  Film,
  Star,
  Settings,
  BookOpen,
  ExternalLink,
  ChevronRight,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BrandLogo } from '@/components/ui/BrandLogo';

export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, group: 'Overview' },
  { name: 'Products', href: '/admin/products', icon: Package, group: 'Catalog' },
  { name: 'Categories', href: '/admin/categories', icon: Layers, group: 'Catalog' },
  { name: 'Collections', href: '/admin/collections', icon: FolderKanban, group: 'Catalog' },
  { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, group: 'CRM' },
  { name: 'Hero Banners', href: '/admin/banners', icon: ImageIcon, group: 'Content' },
  { name: 'Flourish Reels', href: '/admin/reels', icon: Film, group: 'Content' },
  { name: 'Testimonials', href: '/admin/testimonials', icon: Star, group: 'Content' },
  { name: 'Editorial Story', href: '/admin/editorial', icon: BookOpen, group: 'Content' },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings, group: 'System' },
];

const GROUPED = ADMIN_NAV.reduce<Record<string, typeof ADMIN_NAV>>((acc, item) => {
  if (!acc[item.group]) acc[item.group] = [];
  acc[item.group].push(item);
  return acc;
}, {});

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
  onOpenSignOut?: () => void;
}

export function AdminSidebar({
  isMobileOpen = false,
  onClose,
  onOpenSignOut,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);

  // Close mobile sidebar ONLY on route change (pathname change)
  React.useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose?.();
    }
  }, [pathname, onClose]);

  const navContent = (
    <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
      {Object.entries(GROUPED).map(([group, items]) => (
        <div key={group}>
          <p className="px-3 pb-1.5 text-[9px] uppercase tracking-[0.2em] text-[#334155] font-bold">
            {group}
          </p>
          <nav className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-[#0284C7]/20 font-semibold'
                      : 'text-[#64748B] hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-white' : 'text-[#38BDF8] group-hover:text-[#7DD3FC]'
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  const bottomSection = (
    <div className="p-3 border-t border-[#1a3a5c]/40 space-y-2.5">
      {/* Store status card */}
      <div className="bg-gradient-to-br from-[#0E2038] to-[#091928] border border-[#1d3e6b]/60 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-white font-semibold">Store Live</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[10px] text-[#38BDF8] hover:text-white flex items-center gap-0.5 transition-colors"
          >
            Visit <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </Link>
        </div>
        <p className="text-[10px] text-[#475569] leading-relaxed">
          Flourish Women admin console — real-time DB sync enabled.
        </p>
      </div>

      {/* Sign Out Button in Sidebar */}
      {onOpenSignOut && (
        <button
          type="button"
          onClick={() => {
            onClose?.();
            onOpenSignOut();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/25 hover:border-rose-500/40 transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Session</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-60 bg-[#071324] border-r border-[#1a3a5c]/50 min-h-[calc(100vh-4rem)] flex-col shrink-0">
        {navContent}
        {bottomSection}
      </aside>

      {/* 2. Mobile Slide-out Drawer Sidebar (Right Side) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
          />

          {/* Drawer Body Sliding in from Right */}
          <aside className="relative z-10 w-72 max-w-[85vw] bg-[#071324] border-l border-[#1a3a5c] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header with Close Button */}
            <div className="h-16 px-4 border-b border-[#1a3a5c]/60 flex items-center justify-between bg-[#050F1D] shrink-0">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" showTagline={false} asLink={false} theme="dark" />
                <span className="text-[10px] uppercase font-bold text-[#38BDF8] tracking-widest bg-[#0284C7]/20 border border-[#0284C7]/30 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable nav */}
            {navContent}

            {/* Bottom status + Sign Out button */}
            {bottomSection}
          </aside>
        </div>
      )}
    </>
  );
}
