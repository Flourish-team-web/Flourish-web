'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Ruler,
  Scissors,
  Droplets,
  Truck,
  ShieldCheck,
  Check,
  Award,
  Plus,
  Minus,
  Banknote,
} from 'lucide-react';
import { ProductWithDetails } from '@/types/store.types';
import { formatCurrencyINR, calculateDiscountPercentage } from '@/lib/utils/formatters';
import { parseProductSizes } from '@/lib/utils/productSizes';
import { isProductCodAvailable } from '@/lib/utils/productCod';
import { useCart } from '@/hooks/useCart';
import { EnquiryModal } from '@/components/products/EnquiryModal';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { cn } from '@/lib/utils/cn';

interface ProductInfoProps {
  product: ProductWithDetails;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

  // Available Sizes Detection (For Variety Dresses, Kurtis, Gowns)
  const availableSizes = React.useMemo(() => parseProductSizes(product.dimensions), [product.dimensions]);
  const hasSizes = availableSizes.length > 0;
  const [selectedSize, setSelectedSize] = React.useState<string>(availableSizes[0] || '');
  const [sizeError, setSizeError] = React.useState(false);

  // Cash on Delivery Availability (Active by default, admin controllable)
  const isCodAvailable = React.useMemo(() => isProductCodAvailable(product), [product]);

  const discount = calculateDiscountPercentage(product.price, product.compare_price);
  const primaryImage = product.images?.[0]?.image_url || '/images/placeholder-saree.svg';

  const categorySlug = product.category?.slug || (product.fabric ? product.fabric.toLowerCase().replace(/\s+/g, '-') : 'sarees');
  const categoryName = product.category?.name || product.fabric || 'Pure Silk';

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleWhatsAppOrder = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return;
    }
    setIsEnquiryModalOpen(true);
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: primaryImage,
      fabric: product.fabric,
      sku: product.sku,
      size: hasSizes ? selectedSize : null,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  };

  return (
    <div className="flex flex-col space-y-3.5 sm:space-y-4 max-w-xl">
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
      <h1 className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] text-[#0F172A] tracking-tight font-normal leading-snug">
        {product.name}
      </h1>

      {/* 3. Price & Discount (Clean without Ready to Dispatch) */}
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
          <span className="bg-[#0F172A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase shadow-xs">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* 4. Attribute Tags & Badges */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {isCodAvailable && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>COD Available</span>
          </span>
        )}
        {product.fabric && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
            {product.fabric}
          </span>
        )}
        {product.saree_type && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
            {product.saree_type}
          </span>
        )}
        {product.color && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
            {product.color}
          </span>
        )}
      </div>

      {/* 5. Short Summary */}
      {product.short_description && (
        <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed font-light">
          {product.short_description}
        </p>
      )}

      {/* 6. Textile / Apparel Specs Grid */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium truncate">
              {hasSizes ? `Sizes: ${availableSizes.join(', ')}` : (product.dimensions || '5.5m Saree Length')}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium truncate">
              {product.blouse_details || (hasSizes ? 'Tailored Fit Included' : '0.8m Blouse Piece Included')}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium truncate">
              {product.wash_care || (hasSizes ? 'Dry Clean / Gentle Wash' : 'Dry Clean Only. Muslin Wrap')}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span className="text-[#334155] text-xs font-medium truncate">Shipping Fee Extra</span>
          </div>
        </div>
      </div>

      {/* 6.5. Size Selection Card (Shown on Storefront when Size Option is Active) */}
      {hasSizes && (
        <div className={cn(
          "p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2.5 mt-2",
          sizeError
            ? "bg-rose-50/70 border-rose-300 ring-1 ring-rose-300"
            : "bg-[#F8FAFC] border-[#E2E8F0]"
        )}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-[#0F172A] text-xs">
                Select Size
              </span>
              {selectedSize && (
                <span className="font-bold text-[#0284C7] bg-[#E0F2FE] border border-[#BAE6FD] px-2 py-0.5 rounded-md text-[11px]">
                  Selected: {selectedSize}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#64748B] font-medium">Standard Fit</span>
          </div>

          {/* Size Pills */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size);
                    if (sizeError) setSizeError(false);
                  }}
                  className={cn(
                    "min-w-[46px] h-[40px] px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer border select-none",
                    isSelected
                      ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm scale-102"
                      : "bg-white text-[#334155] border-[#CBD5E1] hover:border-[#0F172A] hover:bg-[#F1F5F9]"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {sizeError && (
            <p className="text-[11px] font-medium text-rose-600 animate-in fade-in">
              Please choose a size before adding to bag or ordering.
            </p>
          )}
        </div>
      )}

      {/* 7. Action CTAs */}
      <div className="pt-2 space-y-3">
        {/* Row 1: Quantity Selector + Add to Cart in Same Horizontal Row */}
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Quantity Selector [ - 1 + ] */}
          <div className="flex items-center justify-between border border-[#CBD5E1] rounded-xl bg-[#F8FAFC] p-1 shrink-0 w-28 sm:w-32 h-[46px]">
            <button
              type="button"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-white rounded-lg transition-colors disabled:opacity-35 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs sm:text-sm font-semibold text-center text-[#0F172A] select-none font-mono">
              {quantity}
            </span>
            <button
              type="button"
              onClick={incrementQuantity}
              className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-white rounded-lg transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'flex-1 h-[46px] px-3 sm:px-4 rounded-xl text-xs uppercase tracking-wider sm:tracking-widest font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer border min-w-0',
              isAdded
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white hover:bg-[#0F172A] text-[#0F172A] hover:text-white border-[#0F172A]'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5] shrink-0" />
                <span className="truncate">Added ({quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate">Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Row 2: Order on WhatsApp Button Below Quantity & Add to Cart */}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1EBE5D] text-white border border-[#25D366] hover:border-[#20BA5A] py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <WhatsAppIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Order on WhatsApp</span>
        </button>
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
      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-medium flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Authentic Pure Silk Mark</span>
        </div>
        {isCodAvailable && (
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cash on Delivery</span>
          </div>
        )}
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
        quantity={quantity}
        size={hasSizes ? selectedSize : null}
        isCodAvailable={isCodAvailable}
      />
    </div>
  );
}
