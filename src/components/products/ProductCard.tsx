'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { ProductWithDetails } from '@/types/store.types';
import { formatCurrencyINR, calculateDiscountPercentage } from '@/lib/utils/formatters';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils/cn';

interface ProductCardProps {
  product: ProductWithDetails;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = React.useState(false);

  const images = product.images || [];
  const primaryImage = images.find((img) => img.is_primary)?.image_url || images[0]?.image_url || '/images/placeholder-saree.svg';
  const secondaryImage = images[1]?.image_url || primaryImage;

  const isFavorited = isInWishlist(product.id);
  const discount = calculateDiscountPercentage(product.price, product.compare_price);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: primaryImage,
      fabric: product.fabric,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col bg-white border border-[#E2E8F0] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#0284C7]/40 hover:-translate-y-1 block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8FAFC]">
        <Image
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle hover gradient bottom overlay */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top-Left Badges (Refined compact pill layout) */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none max-w-[70%]">
          {product.is_new_arrival && (
            <span className="bg-[#0F172A]/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider uppercase border border-white/20">
              NEW
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-[#832729]/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wider uppercase border border-white/20">
              BESTSELLER
            </span>
          )}
          {discount && discount > 0 && (
            <span className="bg-amber-500/95 backdrop-blur-sm text-[#0F172A] text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm tracking-wide uppercase">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Top-Right: Wishlist Heart */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-sm border',
            isFavorited
              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-[0_2px_8px_rgba(2,132,199,0.4)] scale-105'
              : 'bg-white/90 text-[#334155] border-white/70 hover:bg-white hover:text-[#0284C7] hover:scale-105'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform', isFavorited && 'fill-current scale-110')} />
        </button>
      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-0.5">
          {product.fabric && (
            <p className="text-[10px] font-sans tracking-[0.18em] uppercase font-bold text-[#0284C7] truncate">
              {product.fabric}
            </p>
          )}
          <h3 className="font-serif text-[13.5px] sm:text-[14.5px] text-[#0F172A] group-hover:text-[#0284C7] transition-colors line-clamp-1 leading-snug font-medium">
            {product.name}
          </h3>
        </div>

        {/* Price and Stock Status */}
        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-sans text-[13.5px] sm:text-[15px] font-bold text-[#0F172A]">
              {formatCurrencyINR(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="font-sans text-[11px] sm:text-xs text-[#94A3B8] line-through">
                {formatCurrencyINR(product.compare_price)}
              </span>
            )}
          </div>

          {product.availability === 'out_of_stock' ? (
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-[9.5px] uppercase text-rose-600 font-bold tracking-wider">Sold</span>
            </div>
          ) : product.availability === 'made_to_order' ? (
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span className="text-[9.5px] uppercase text-[#0284C7] font-bold tracking-wider">Custom</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9.5px] uppercase text-emerald-700 font-bold tracking-wider">In Stock</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
