'use client';

import * as React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    occasion: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          message: `Occasion: ${formData.occasion || 'General'}\n${formData.message}`,
          source: 'contact_page_form',
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError('Unable to submit enquiry at this moment. Please reach us via WhatsApp directly.');
      }
    } catch (err) {
      setError('Something went wrong. Please connect with us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#706B64] uppercase tracking-wider font-light mb-6">
          <Link href="/" className="hover:text-[#1A1816]">Home</Link>
          <span>/</span>
          <span className="text-[#C5A059]">Contact & Bespoke Styling</span>
        </div>

        <SectionHeading
          eyebrow="Bespoke Inquiries"
          title="Connect with Flourish Concierge"
          subtitle="Our master drapers and bridal stylists are here to assist with weave inquiries, customizations, and bridal trousseau curation"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#EAE3D2] p-6 sm:p-10 shadow-xs">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#1B4332] mx-auto" />
                <h3 className="font-serif text-2xl text-[#1A1816]">Thank You, {formData.name}</h3>
                <p className="text-sm text-[#57524A] font-light max-w-md mx-auto leading-relaxed">
                  Your enquiry has been received. Our dedicated stylist will contact you on {formData.phone} shortly.
                </p>
                <div className="pt-4">
                  <a
                    href={buildBespokeWhatsAppUrl(undefined, `Hi, I submitted an enquiry for ${formData.occasion || 'styling'}. My name is ${formData.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="gold" size="md" className="inline-flex items-center gap-2">
                      <WhatsAppIcon className="w-4 h-4" />
                      Chat Directly on WhatsApp →
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif text-xl text-[#1A1816] mb-2">
                  Request a Consultation
                </h3>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                  />
                  <Input
                    label="WhatsApp / Phone Number *"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ananya@example.com"
                  />
                  <Input
                    label="Occasion / Celebration"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    placeholder="e.g. Bridal Wedding, Reception, Diwali"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
                    Message / Weave Preference
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what color palette, weave style, or budget you have in mind..."
                    className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-4 py-2.5 text-sm text-[#1A1816] placeholder-[#A49F96] focus:border-[#1A1816] focus:bg-white focus:outline-none tracking-wide"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    isLoading={isSubmitting}
                  >
                    Submit Consultation Request
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Channels & Concierge Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1B4332] text-[#FDFBF7] p-6 sm:p-8 shadow-md space-y-4">
              <div className="inline-flex items-center px-3 py-1 bg-[#143225] text-[#A3E3C6] text-[10px] font-sans uppercase tracking-widest font-semibold">
                <span>Instant Stylist Access</span>
              </div>
              <h3 className="font-serif text-2xl text-white">Direct WhatsApp Concierge</h3>
              <p className="text-xs text-[#E2EBE5] font-light leading-relaxed">
                Connect directly with our master drapers for high-resolution video drape previews, blouse measurement guidance, and worldwide shipping estimates.
              </p>
              <div className="pt-2">
                <a
                  href={buildBespokeWhatsAppUrl(undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1B4332] hover:bg-[#FAF8F5] py-3 px-6 text-xs uppercase tracking-widest font-medium transition-all w-full text-center"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Studio Info Card */}
            <div className="bg-[#FAF8F5] border border-[#EAE3D2] p-6 space-y-4 text-xs">
              <h4 className="font-serif text-base text-[#1A1816]">Boutique Hours & Inquiries</h4>
              <div className="space-y-3 text-[#57524A]">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#1A1816] font-medium block">+91 98765 43210</span>
                    <span className="text-[11px] text-[#8F8A80]">Mon – Sat: 10:00 AM – 7:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#1A1816] font-medium block">concierge@flourishwoman.com</span>
                    <span className="text-[11px] text-[#8F8A80]">We respond within 24 business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#1A1816] font-medium block">Flourish Woman Studio</span>
                    <span className="text-[11px] text-[#8F8A80]">India — Global Insured Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
