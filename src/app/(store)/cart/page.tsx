'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, ArrowRight, Sparkles, Award } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useCart } from '@/hooks/useCart';
import { formatCurrencyINR } from '@/lib/utils/formatters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { CartCheckoutModal } from '@/components/cart/CartCheckoutModal';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalCount, totalPrice, clearCart, isLoaded } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);

  if (!isLoaded) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-[#64748B]">Loading your bag...</p>
      </div>
    );
  }

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="w-full bg-[#FCFCFD] min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-12 pb-28 lg:pb-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] uppercase tracking-wider font-light mb-3">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0284C7] font-semibold">Shopping Bag</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E2E8F0] pb-4 sm:pb-6 mb-6 gap-3">
          <div>
            <p className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold mb-1">
              Curated Handloom Bag
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight font-normal">
              Your Shopping Bag {totalCount > 0 && <span className="text-[#64748B] text-xl sm:text-2xl font-light">({totalCount})</span>}
            </h1>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-[#E11D48] border-[#FECDD3] hover:bg-[#FFF1F2] text-xs h-8 sm:h-9"
              >
                Clear Bag
              </Button>
            </div>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Delivery info banner */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Complimentary Insured Delivery & Silk Mark Guarantee applied to all items.</span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-3 sm:p-4.5 flex gap-3 sm:gap-4.5 items-start shadow-xs hover:border-[#CBD5E1] transition-all"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative w-20 sm:w-24 aspect-[3/4] bg-[#F1F5F9] rounded-lg overflow-hidden shrink-0 border border-[#E2E8F0] block"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover object-top"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[105px] sm:min-h-[120px]">
                      <div>
                        {item.fabric && (
                          <span className="text-[10px] font-sans tracking-widest text-[#0284C7] uppercase font-semibold block">
                            {item.fabric}
                          </span>
                        )}
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif text-sm sm:text-base font-medium text-[#0F172A] hover:text-[#0284C7] line-clamp-1 transition-colors mt-0.5"
                        >
                          {item.name}
                        </Link>
                        {item.sku && (
                          <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                            Code: {item.sku}
                          </p>
                        )}
                      </div>

                      {/* Controls and Price Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9] mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-semibold px-2 min-w-[24px] text-center text-[#0F172A]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-sans font-bold text-sm sm:text-base text-[#0F172A]">
                              {formatCurrencyINR(item.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[10px] text-[#64748B]">
                                ({formatCurrencyINR(item.price)} each)
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1.5 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                <h2 className="font-serif text-lg text-[#0F172A] font-medium border-b border-[#F1F5F9] pb-3">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Items Total ({totalCount} {totalCount === 1 ? 'piece' : 'pieces'})</span>
                    <span className="font-medium text-[#0F172A]">{formatCurrencyINR(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Insured Shipping (India)</span>
                    <span className="text-emerald-600 font-semibold uppercase">Free</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Authenticity Certificate</span>
                    <span className="text-emerald-600 font-semibold uppercase">Included</span>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-sm font-semibold text-[#0F172A]">Estimated Total</span>
                  </div>
                  <span className="font-sans text-xl sm:text-2xl font-bold text-[#0F172A]">
                    {formatCurrencyINR(totalPrice)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1EBE5D] text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Order on WhatsApp</span>
                </button>

                <div className="pt-2 text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:underline"
                  >
                    <span>Continue Exploring Sarees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2 text-[11px] text-[#475569]">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span>100% Handloom Certified Silk Mark</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Artisan Handcraft & Safe Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span>Personalized Concierge & Fall/Pico Support</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Your Shopping Bag is Empty"
            description="Explore our authentic handloom saree collection and add your favorite creations to checkout via WhatsApp."
            actionText="Browse Saree Collections"
            actionHref="/products"
            icon={<ShoppingBag className="w-5 h-5" />}
          />
        )}

        {/* WhatsApp Order Modal for Cart */}
        <CartCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          cartItems={cartItems}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
}
