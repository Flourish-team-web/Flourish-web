'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, Layers, Sparkle } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils/cn';

export function MobileNav() {
  const pathname = usePathname();
  const { count: wishlistCount } = useWishlist();
  const { totalCount: cartCount } = useCart();

  // Don't show on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Collections', href: '/products', icon: Layers },
    { label: 'New Arrivals', href: '/products?sort=newest', icon: Sparkle },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#030D1A] via-[#082240] to-[#041224] backdrop-blur-md border-t border-[#163860] px-2 py-2 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2.5 relative transition-colors',
                isActive ? 'text-[#38BDF8]' : 'text-white/60 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-sans tracking-tight mt-1 font-medium text-center">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1.5 bg-[#0284C7] text-white text-[8px] font-bold min-w-[14px] h-3.5 px-0.5 rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(56,189,248,0.8)]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
