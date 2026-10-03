'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MessageCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils/formatters';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    sku?: string | null;
    price?: number | null;
    fabric?: string | null;
  };
}

export function EnquiryModal({ isOpen, onClose, product }: EnquiryModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    location: '',
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

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide your name and WhatsApp phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email || null,
          customerLocation: formData.location || null,
          message: formData.message || null,
          source: 'product_pdp_modal',
          item: {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            price: product.price,
            quantity: formData.quantity,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to submit enquiry');
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Saree Concierge Enquiry" className="max-w-md">
      {/* Product Summary Mini Card */}
      <div className="bg-[#F4EFE6] border border-[#E0D8C8] p-3.5 mb-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-[#C5A059] uppercase font-semibold block">
            {product.fabric || 'Pure Handloom'}
          </span>
          <h4 className="font-serif text-sm text-[#1A1816] font-medium line-clamp-1">
            {product.name}
          </h4>
          {product.sku && (
            <span className="text-[10px] text-[#8F8A80]">SKU: {product.sku}</span>
          )}
        </div>
        {product.price && (
          <span className="font-sans text-sm font-semibold text-[#1A1816]">
            {formatCurrencyINR(product.price)}
          </span>
        )}
      </div>

      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EDF5F0] text-[#1B4332] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-[#1A1816]">Enquiry Registered</h3>
          <p className="text-xs text-[#706B64] font-light leading-relaxed">
            Your enquiry has been logged in our system. If WhatsApp did not open automatically, please click below to connect with our master draper.
          </p>
          {whatsappRedirectUrl && (
            <a
              href={whatsappRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white py-3 px-6 text-xs uppercase tracking-widest font-medium w-full"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Chat</span>
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <Input
            label="Your Full Name *"
            required
            placeholder="e.g. Radhika Menon"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="WhatsApp Number (with Country Code) *"
            required
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City / Location"
              placeholder="e.g. Mumbai / Dallas"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
                Quantity
              </label>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) })}
                className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 10].map((q) => (
                  <option key={q} value={q}>
                    {q} {q === 1 ? 'Saree' : 'Sarees'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
              Optional Message or Customization Note
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Blouse stitching request, express wedding delivery date..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] placeholder-[#A49F96] focus:border-[#1A1816] focus:outline-none tracking-wide"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-[#1B4332] hover:bg-[#143225] flex items-center justify-center gap-2"
              isLoading={isSubmitting}
            >
              <MessageCircle className="w-4 h-4 text-[#A3E3C6]" />
              <span>Connect on WhatsApp</span>
            </Button>
          </div>

          <p className="text-[10px] text-[#8F8A80] text-center font-light flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
            Your enquiry is securely saved before opening WhatsApp.
          </p>
        </form>
      )}
    </Modal>
  );
}
