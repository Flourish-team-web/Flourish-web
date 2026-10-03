'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, MessageCircle, Layers } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { cn } from '@/lib/utils/cn';

export function MobileNav() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();

  // Don't show on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Collections', href: '/products', icon: Layers },
    { label: 'New Arrivals', href: '/products?sort=newest', icon: ShoppingBag },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#030D1A] via-[#082240] to-[#041224] backdrop-blur-md border-t border-[#163860] px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 relative transition-colors',
                isActive ? 'text-[#38BDF8]' : 'text-white/60 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-sans tracking-tight mt-1 font-medium">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 bg-[#0284C7] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(56,189,248,0.8)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick WhatsApp Concierge Button */}
        <a
          href={buildBespokeWhatsAppUrl(undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 text-white/60 hover:text-[#38BDF8] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-sans tracking-tight mt-1 font-medium">
            Stylist
          </span>
        </a>
      </div>
    </div>
  );
}
