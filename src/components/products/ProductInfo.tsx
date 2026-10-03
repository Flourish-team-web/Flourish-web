'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ShoppingBag,
  Ruler,
  Scissors,
  Droplets,
  Truck,
  ShieldCheck,
  Check,
  Award,
} from 'lucide-react';
import { ProductWithDetails } from '@/types/store.types';
import { formatCurrencyINR, calculateDiscountPercentage } from '@/lib/utils/formatters';
import { useCart } from '@/hooks/useCart';
import { EnquiryModal } from '@/components/products/EnquiryModal';
import { cn } from '@/lib/utils/cn';

interface ProductInfoProps {
  product: ProductWithDetails;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

  const discount = calculateDiscountPercentage(product.price, product.compare_price);
  const primaryImage = product.images?.[0]?.image_url || '/images/placeholder-saree.svg';

  const categorySlug = product.category?.slug || (product.fabric ? product.fabric.toLowerCase().replace(/\s+/g, '-') : 'sarees');
  const categoryName = product.category?.name || product.fabric || 'Pure Silk';

  const handleWhatsAppOrder = () => {
    setIsEnquiryModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: primaryImage,
      fabric: product.fabric,
      sku: product.sku,
    }, 1);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  return (
    <div className="flex flex-col space-y-5 max-w-xl">
      {/* 1. Breadcrumb & Product Code */}
      <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5 uppercase tracking-wider font-light text-[11px]">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span className="text-[#CBD5E1]">/</span>
          <Link href="/products" className="hover:text-[#0F172A] transition-colors">Sarees</Link>
          <span className="text-[#CBD5E1]">/</span>
          <Link href={`/categories/${categorySlug}`} className="text-[#0284C7] font-semibold hover:underline">
            {categoryName}
          </Link>
        </div>

        {product.sku && (
          <span className="font-mono text-[10.5px] text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
            Code: {product.sku}
          </span>
        )}
      </div>

      {/* 2. Saree Title */}
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] text-[#0F172A] tracking-tight font-normal leading-snug">
        {product.name}
      </h1>

      {/* 3. Price & Discount (Clean without Ready to Dispatch) */}
      <div className="flex items-baseline gap-3 pb-3.5 border-b border-[#E2E8F0]">
        <span className="font-sans text-2xl sm:text-3xl font-bold text-[#0F172A]">
          {formatCurrencyINR(product.price)}
        </span>
        {product.compare_price && product.compare_price > product.price && (
          <span className="font-sans text-sm sm:text-base text-[#94A3B8] line-through">
            {formatCurrencyINR(product.compare_price)}
          </span>
        )}
        {discount && discount > 0 && (
          <span className="bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase shadow-xs">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* 4. Attribute Tags */}
      <div className="flex flex-wrap gap-2">
        {product.fabric && (
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
            {product.fabric}
          </span>
        )}
        {product.saree_type && (
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
            {product.saree_type}
          </span>
        )}
        {product.color && (
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
            {product.color}
          </span>
        )}
      </div>

      {/* 5. Short Summary */}
      {product.short_description && (
        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
          {product.short_description}
        </p>
      )}

      {/* 6. Textile Specs Grid */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2.5">
            <Ruler className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium">{product.dimensions || '5.5m Saree Length'}</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2.5">
            <Scissors className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium">{product.blouse_details || '0.8m Blouse Piece Included'}</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium">{product.wash_care || 'Dry Clean Only. Muslin Wrap'}</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium">Free Insured Delivery</span>
          </div>
        </div>
      </div>

      {/* 7. Action CTAs: ORDER ON WHATSAPP & ADD TO CART Side by Side (Placed on Top of About the Weave) */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Order on WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1EBE5D] text-white border border-[#25D366] hover:border-[#20BA5A] py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <MessageCircle className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
            <span>Order on WhatsApp</span>
          </button>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'w-full py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border',
              isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white hover:bg-[#0F172A] text-[#0F172A] hover:text-white border-[#0F172A]'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8. About the Weave Section */}
      {product.description && (
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-[#0F172A] font-bold">
            About the Weave
          </h3>
          <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed font-light">
            {product.description}
          </p>
        </div>
      )}

      {/* 9. Authentic Handloom Trust Footer */}
      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-medium">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Authentic Pure Silk Mark</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Direct Weaver Heritage</span>
        </div>
      </div>

      {/* WhatsApp Order Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
}
