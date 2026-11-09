'use client';

import * as React from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import {
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Loader2,
  Package,
} from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils/formatters';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity?: number;
  size?: string | null;
  isCodAvailable?: boolean;
  product: {
    id: string;
    name: string;
    slug?: string;
    sku?: string | null;
    price?: number | null;
    fabric?: string | null;
    images?: Array<{ image_url: string }>;
  };
}

export function EnquiryModal({ isOpen, onClose, product, quantity = 1, size, isCodAvailable = true }: EnquiryModalProps) {
  const selectedQuantity = Math.max(1, quantity);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setIsSubmitted(false);
      setWhatsappRedirectUrl(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please provide your WhatsApp contact number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide your full delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const fullFormattedAddress = [
      formData.address.trim(),
      formData.city.trim() ? `City: ${formData.city.trim()}` : '',
      formData.pincode.trim() ? `PIN: ${formData.pincode.trim()}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const productUrl =
      typeof window !== 'undefined' && product.slug
        ? `${window.location.origin}/products/${product.slug}`
        : undefined;

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerPhone: formData.phone.trim(),
          customerAddress: fullFormattedAddress,
          customerLocation: formData.city.trim() || fullFormattedAddress,
          message: formData.message.trim() || null,
          source: 'product_whatsapp_order_form',
          item: {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            size: size || null,
            price: product.price,
            quantity: selectedQuantity,
            productUrl,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to submit order enquiry');
      }

      setIsSubmitted(true);
      setWhatsappRedirectUrl(data.whatsappUrl);

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryImage = product?.images?.[0]?.image_url;

  if (!isOpen || !product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order on WhatsApp"
      description="Direct concierge order & personalized saree dispatch"
      className="max-w-3xl w-full bg-white border border-[#E2E8F0] shadow-2xl p-5 sm:p-7 md:p-8"
    >
      {/* ── Product Summary Card ── */}
      <div className="bg-gradient-to-r from-[#F8FAFC] via-[#F1F5F9]/80 to-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-4 mb-6 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          {primaryImage && (
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-[#E2E8F0] shrink-0 border border-[#CBD5E1]/60 shadow-xs">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover object-top"
              />
            </div>
          )}
          <div className="min-w-0">
            <span className="inline-block text-[9px] sm:text-[10px] font-sans tracking-[0.2em] text-[#0284C7] bg-[#E0F2FE]/70 border border-[#BAE6FD] px-2.5 py-0.5 rounded-md uppercase font-bold mb-1">
              {product.fabric || 'Pure Handloom Silk'}
            </span>
            <h4 className="font-serif text-sm sm:text-base md:text-lg text-[#0F172A] font-medium line-clamp-1 leading-snug">
              {product.name}
            </h4>
            <div className="flex items-center gap-2.5 mt-1.5 text-xs text-[#64748B] flex-wrap">
              {product.sku && (
                <span className="font-mono bg-[#E2E8F0] px-2 py-0.5 rounded text-[11px] font-medium text-[#334155]">
                  #{product.sku}
                </span>
              )}
              {size && (
                <span className="font-bold text-[#0284C7] bg-[#E0F2FE] border border-[#BAE6FD] px-2 py-0.5 rounded text-[11px]">
                  Size: {size}
                </span>
              )}
              {isCodAvailable && (
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                  COD Available
                </span>
              )}
              <span className="flex items-center gap-1 font-medium text-[#0F172A]">
                <Package className="w-3.5 h-3.5 text-[#0284C7]" />
                Qty: {selectedQuantity}
              </span>
            </div>
          </div>
        </div>

        {product.price && (
          <div className="text-right shrink-0 pl-3 border-l border-[#E2E8F0]">
            <span className="text-[10px] uppercase tracking-wider text-[#64748B] block font-medium">
              Total Amount
            </span>
            <span className="font-sans text-xl sm:text-2xl font-bold text-[#0F172A] block">
              {formatCurrencyINR(product.price * selectedQuantity)}
            </span>
            {selectedQuantity > 1 && (
              <span className="block text-[11px] text-[#64748B] font-normal mt-0.5">
                ({formatCurrencyINR(product.price)} each)
              </span>
            )}
          </div>
        )}
      </div>

      {isSubmitted ? (
        /* ── Success State ── */
        <div className="text-center py-8 sm:py-10 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-[#0F172A] font-semibold">
              Order Prepared Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] font-light leading-relaxed mt-2">
              Your details are recorded. Click below to open WhatsApp and send your order confirmation directly to our concierge team.
            </p>
          </div>
          {whatsappRedirectUrl && (
            <div className="pt-2">
              <a
                href={whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851] text-white py-3.5 px-6 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold w-full transition-all shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>Open WhatsApp to Confirm</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        /* ── Order Form ── */
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2 animate-fadeInUp">
              <span className="text-rose-500 font-bold shrink-0 mt-px">⚠</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ── 2-Column Responsive Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* ── Left Column: Contact & Customization ── */}
            <div className="space-y-4">
              {/* Section 1: Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[#F1F5F9]">
                  <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#0F172A] font-bold">
                    Contact Details
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <User className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Menon"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <Phone className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Notes & Customization */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between pb-1 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0284C7]/20 text-[#0284C7] text-[10px] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[#0F172A] font-bold">
                      Order Customization
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">
                    Optional
                  </span>
                </div>

                <textarea
                  rows={3}
                  placeholder="Fall & pico request, blouse stitching, preferred delivery date, gift wrap..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-xl p-3 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 focus:outline-none transition-all resize-none shadow-2xs"
                />
              </div>
            </div>

            {/* ── Right Column: Delivery Address ── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-[#F1F5F9]">
                <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="text-xs uppercase tracking-wider text-[#0F172A] font-bold">
                  Delivery Address
                </span>
              </div>

              <div className="space-y-3">
                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Street Address & Landmark <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative group">
                    <MapPin className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#0284C7] absolute left-3.5 top-3 transition-colors pointer-events-none" />
                    <textarea
                      required
                      rows={3}
                      placeholder="House / Flat No., Building Name, Street, Landmark"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 focus:outline-none transition-all resize-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* City + Pincode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      City / Town
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Pincode / ZIP
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 600028"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-[#F8FAFC] focus:bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15 focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Submit Button & Trust Assurances ── */}
          <div className="pt-2 space-y-3.5 border-t border-[#F1F5F9]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0E7A6E] active:from-[#1DA851] active:to-[#0C6A5F] disabled:opacity-70 text-white py-3.5 sm:py-4 px-6 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold transition-all shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/35 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Your Order...</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                  <span>Send Order to WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
