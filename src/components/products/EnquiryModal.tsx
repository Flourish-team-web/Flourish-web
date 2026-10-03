'use client';

import * as React from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MessageCircle, CheckCircle2, ShieldCheck, MapPin, Phone, User, Package, Sparkles, Loader2 } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils/formatters';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    quantity: 1,
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
    ].filter(Boolean).join(', ');

    const productUrl = typeof window !== 'undefined' && product.slug
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
            price: product.price,
            quantity: formData.quantity,
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

      // Open WhatsApp automatically
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryImage = product.images?.[0]?.image_url;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order on WhatsApp"
      className="max-w-lg bg-white border border-[#E2E8F0] text-[#0F172A]"
    >
      {/* Product Summary Mini Card */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl mb-5 flex items-center gap-3.5">
        {primaryImage && (
          <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-[#E2E8F0] shrink-0 border border-[#E2E8F0]">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-sans tracking-widest text-[#0284C7] uppercase font-semibold block">
            {product.fabric || 'Pure Handloom Saree'}
          </span>
          <h4 className="font-serif text-sm text-[#0F172A] font-medium line-clamp-1">
            {product.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            {product.sku && (
              <span className="text-[10px] text-[#64748B] font-mono">Code: {product.sku}</span>
            )}
          </div>
        </div>
        {product.price && (
          <div className="text-right shrink-0">
            <span className="font-sans text-base font-bold text-[#0F172A]">
              {formatCurrencyINR(product.price)}
            </span>
          </div>
        )}
      </div>

      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl text-[#0F172A] font-medium">Order Details Prepared!</h3>
          <p className="text-xs text-[#64748B] font-light leading-relaxed max-w-sm mx-auto">
            Your order has been recorded in our system. We are opening WhatsApp so you can send your order directly to our concierge.
          </p>
          {whatsappRedirectUrl && (
            <div className="pt-2">
              <a
                href={whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-bold w-full transition-all shadow-md shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                <span>Open WhatsApp Chat Now</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
              Your Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Radhika Menon"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* WhatsApp Phone Number */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
              WhatsApp Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Full Delivery Address */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
              Full Delivery Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
              <textarea
                required
                rows={2}
                placeholder="House / Flat No., Apartment / Street, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* City, Pincode & Quantity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
                City / Town
              </label>
              <input
                type="text"
                placeholder="e.g. Chennai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
                Pincode / ZIP
              </label>
              <input
                type="text"
                placeholder="e.g. 600028"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
                Quantity
              </label>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 10].map((q) => (
                  <option key={q} value={q}>
                    {q} {q === 1 ? 'Saree' : 'Sarees'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customization Note */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#475569] mb-1">
              Customization / Order Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Fall & pico request, blouse stitching, preferred delivery date..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1EBE5D] disabled:opacity-75 text-white py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Preparing Order...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span>Send Order to WhatsApp</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-[#64748B] text-center font-light flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Your order details are securely recorded before opening WhatsApp.
          </p>
        </form>
      )}
    </Modal>
  );
}

