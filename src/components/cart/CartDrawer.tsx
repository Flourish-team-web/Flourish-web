'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X, Trash2, Plus, Minus, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrencyINR } from '@/lib/utils/formatters';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, totalCount, totalPrice, clearCart } = useCart();

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `*🌸 Flourish Woman — Bag Checkout Request*\n\n`;
    message += `Hello, I would like to order the following saree(s) from my bag:\n\n`;

    cartItems.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      if (item.sku) message += `• Code / SKU: ${item.sku}\n`;
      if (item.fabric) message += `• Fabric: ${item.fabric}\n`;
      message += `• Qty: ${item.quantity} × ${formatCurrencyINR(item.price)} = ${formatCurrencyINR(item.price * item.quantity)}\n`;
      message += `• Link: ${typeof window !== 'undefined' ? `${window.location.origin}/products/${item.slug}` : ''}\n\n`;
    });

    message += `*Total Amount:* ${formatCurrencyINR(totalPrice)}\n\n`;
    message += `Please confirm availability and share payment/dispatch details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const targetNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${targetNumber}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#030E1C] via-[#082547] to-[#041326] text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base text-white font-medium">Your Shopping Bag</h3>
                <p className="text-[11px] text-white/60">{totalCount} {totalCount === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#94A3B8]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="font-serif text-base text-[#0F172A] font-medium">Your bag is empty</h4>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                  Explore our authentic handloom saree collection and add your favorite creations.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    <span>Browse Sarees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complimentary Insured Delivery applied to your order</span>
                </div>

                <div className="divide-y divide-[#F1F5F9] space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="pt-3 first:pt-0 flex gap-3.5 items-center">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={onClose}
                        className="relative w-16 h-20 bg-[#F1F5F9] rounded-xl overflow-hidden shrink-0 border border-[#E2E8F0]"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="font-serif text-xs sm:text-sm text-[#0F172A] font-medium hover:text-[#0284C7] truncate block transition-colors"
                        >
                          {item.name}
                        </Link>
                        
                        <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                          {item.fabric && <span>{item.fabric}</span>}
                          {item.sku && <span>• Code: {item.sku}</span>}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-sans font-bold text-xs sm:text-sm text-[#0F172A]">
                            {formatCurrencyINR(item.price * item.quantity)}
                          </span>

                          {/* Stepper */}
                          <div className="flex items-center gap-1 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-1 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold px-1.5 min-w-[20px] text-center text-[#0F172A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-1 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 text-[#94A3B8] hover:text-rose-500 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-[#64748B] font-semibold">Subtotal</span>
                <span className="font-sans text-lg sm:text-xl font-bold text-[#0F172A]">
                  {formatCurrencyINR(totalPrice)}
                </span>
              </div>

              <p className="text-[10px] text-[#64748B] text-center">
                Prices inclusive of all taxes & doorstep delivery across India.
              </p>

              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1EBE5D] text-white border border-[#25D366] hover:border-[#20BA5A] py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <MessageCircle className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
                <span>Checkout on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-[#64748B] hover:text-[#0F172A] font-medium py-1 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
