'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles, Ruler, Scissors, Droplets, Truck, ShieldCheck } from 'lucide-react';
import { ProductWithDetails } from '@/types/store.types';
import { formatCurrencyINR, calculateDiscountPercentage } from '@/lib/utils/formatters';
import { useWishlist } from '@/hooks/useWishlist';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

interface ProductInfoProps {
  product: ProductWithDetails;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);
  const discount = calculateDiscountPercentage(product.price, product.compare_price);
  const primaryImage = product.images?.[0]?.image_url || '/images/placeholder-saree.svg';

  const categorySlug = product.category?.slug || (product.fabric ? product.fabric.toLowerCase().replace(/\s+/g, '-') : 'kanchipuram');
  const categoryName = product.category?.name || product.fabric || 'Pure Silk';

  const handleWishlistToggle = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: primaryImage,
      fabric: product.fabric,
    });
  };

  const handleWhatsAppOrder = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.slug}` : undefined;
    const waUrl = buildProductWhatsAppUrl('919876543210', {
      productName: product.name,
      sku: product.sku,
      price: product.price,
      productUrl: url,
    });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col space-y-4 max-w-xl">
      {/* 1. Header: Breadcrumb & SKU */}
      <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5 uppercase tracking-wider font-light text-[11px]">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#0F172A] transition-colors">Sarees</Link>
          <span>/</span>
          <Link href={`/categories/${categorySlug}`} className="text-[#0284C7] font-semibold hover:underline">
            {categoryName}
          </Link>
        </div>

        {product.sku && (
          <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider">
            {product.sku}
          </span>
        )}
      </div>

      {/* 2. Title */}
      <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] tracking-tight font-normal leading-snug">
        {product.name}
      </h1>

      {/* 3. Price & Discount Bar */}
      <div className="flex items-baseline gap-3 pb-3 border-b border-[#E2E8F0]">
        <span className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
          {formatCurrencyINR(product.price)}
        </span>
        {product.compare_price && product.compare_price > product.price && (
          <span className="font-sans text-sm sm:text-base text-[#94A3B8] line-through">
            {formatCurrencyINR(product.compare_price)}
          </span>
        )}
        {discount && discount > 0 && (
          <span className="bg-[#0F172A] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
            {discount}% OFF
          </span>
        )}
        <span className="text-[11px] text-emerald-700 font-medium ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Ready to Dispatch
        </span>
      </div>

      {/* 4. Attribute Tags */}
      <div className="flex flex-wrap gap-1.5">
        {product.fabric && (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
            {product.fabric}
          </span>
        )}
        {product.saree_type && (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
            {product.saree_type}
          </span>
        )}
        {product.color && (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
            {product.color}
          </span>
        )}
      </div>

      {/* 5. Short Description */}
      {product.short_description && (
        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
          {product.short_description}
        </p>
      )}

      {/* 6. Primary Action: WhatsApp Order & Wishlist */}
      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="flex-1 bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] py-3 px-5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#38BDF8]" />
          <span>Order on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'h-11 px-3.5 rounded-lg border flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer',
            isFavorited
              ? 'bg-[#E0F2FE] border-[#38BDF8] text-[#0284C7]'
              : 'border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC]'
          )}
        >
          <Heart className={cn('w-4 h-4', isFavorited && 'fill-current text-[#0284C7]')} />
          <span className="text-[11px] hidden sm:inline">{isFavorited ? 'Saved' : 'Wishlist'}</span>
        </button>
      </div>

      {/* 7. Key Specs Grid */}
      <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-[11px] font-medium">{product.dimensions || '5.5m Saree'}</span>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-[11px] font-medium">{product.blouse_details || '0.8m Blouse'}</span>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-[11px] font-medium">{product.wash_care || 'Dry Clean Only'}</span>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-[11px] font-medium">Free Insured Delivery</span>
          </div>
        </div>
      </div>

      {/* 8. Authentic Craft Narrative */}
      {product.description && (
        <div className="pt-3 border-t border-[#E2E8F0] space-y-1">
          <h3 className="text-[11px] uppercase tracking-wider text-[#0F172A] font-bold">
            About the Weave
          </h3>
          <p className="text-xs text-[#475569] leading-relaxed font-light line-clamp-3 hover:line-clamp-none transition-all">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
