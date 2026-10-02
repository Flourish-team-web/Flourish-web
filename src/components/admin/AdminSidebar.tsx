'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Film,
  Star,
  Settings,
  BookOpen,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, group: 'Overview' },
  { name: 'Products', href: '/admin/products', icon: Package, group: 'Catalog' },
  { name: 'Categories', href: '/admin/categories', icon: Layers, group: 'Catalog' },
  { name: 'Collections', href: '/admin/collections', icon: Sparkles, group: 'Catalog' },
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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#071324] border-r border-[#1a3a5c]/50 min-h-[calc(100vh-4rem)] flex flex-col shrink-0">
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
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
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-[#0284C7]/20'
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

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-[#1a3a5c]/40">
        <div className="bg-gradient-to-br from-[#0E2038] to-[#091928] border border-[#1d3e6b]/60 rounded-xl p-3 space-y-2.5">
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
      </div>
    </aside>
  );
}
