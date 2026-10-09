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
  { name: 'Flourish Edit', href: '/admin/editorial', icon: BookOpen, group: 'Content' },
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

  const sidebarContent = (
    <div className="p-2.5 space-y-2.5">
      {/* Grouped Navigation */}
      <div className="space-y-2">
        {Object.entries(GROUPED).map(([group, items]) => (
          <div key={group}>
            <p className="px-2.5 pb-0.5 text-[9px] uppercase tracking-[0.2em] text-[#475569] font-bold">
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
                      'group flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-sm shadow-[#0284C7]/30 font-semibold'
                        : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-[#38BDF8] group-hover:text-[#7DD3FC]'
                      )}
                    />
                    <span className="flex-1 truncate">{item.name}</span>
                    {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Direct Bottom Actions */}
      <div className="pt-2 border-t border-[#1a3a5c]/50 space-y-1.5">
        {/* Store status compact pill */}
        <div className="bg-[#0A1A2E] border border-[#1d3e6b]/60 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-white font-medium">Store Live</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="text-[10px] text-[#38BDF8] hover:text-white flex items-center gap-0.5 transition-colors font-medium"
          >
            Visit <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
          </Link>
        </div>

        {/* Sign Out Button in Sidebar */}
        {onOpenSignOut && (
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onOpenSignOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Session</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Left Sidebar (Fixed & Non-scrolling) */}
      <aside className="hidden lg:block w-56 xl:w-60 bg-[#071324] border-r border-[#1a3a5c]/50 shrink-0 select-none overflow-hidden h-[calc(100vh-4rem)] sticky top-16 z-20">
        {sidebarContent}
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
          <aside className="relative z-10 w-72 max-w-[85vw] bg-[#071324] border-l border-[#1a3a5c] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            {/* Drawer Header with Close Button */}
            <div className="h-16 px-4 border-b border-[#1a3a5c]/60 flex items-center justify-between bg-[#050F1D] shrink-0 sticky top-0 z-20">
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

            {/* Nav + bottom actions */}
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
