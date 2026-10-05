import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  RefreshCw,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Mail,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export const metadata: Metadata = {
  title: "Return & Exchange Policy — Flourish Woman",
  description: "Learn about our handloom return, exchange, and authenticity inspection policies. Transparent and patron-first service.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="py-8 md:py-16 bg-[#FCFCFD]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] uppercase tracking-wider font-light mb-8">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0284C7] font-semibold">Return & Exchange Policy</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#E2E8F0] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-[11px] font-sans tracking-[0.2em] uppercase font-bold mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Patron Assurance & Fair Policies</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] font-normal tracking-tight">
            Return & Exchange Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-light mt-2 max-w-2xl leading-relaxed">
            Every Flourish saree is handcrafted by master Indian artisans with genuine Silk Mark certification. We want your experience to be effortless and secure.
          </p>
          <div className="flex items-center gap-3 mt-4 text-[11px] text-[#64748B]">
            <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] font-medium text-[#334155]">
              Last Updated: October 2026
            </span>
            <span>•</span>
            <span>Handloom Quality Guarantee</span>
          </div>
        </div>

        {/* 4 Policy Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-12">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">48-Hour Notice</p>
            <p className="text-[11px] text-[#64748B] font-light">For transit damages</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Silk Mark Certified</p>
            <p className="text-[11px] text-[#64748B] font-light">100% genuine weaves</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <Truck className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Insured Pickup</p>
            <p className="text-[11px] text-[#64748B] font-light">Direct doorstep returns</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Replacement/Credit</p>
            <p className="text-[11px] text-[#64748B] font-light">Hassle-free resolutions</p>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6 text-sm text-[#475569] font-light leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">1. Handloom Craft Authenticity & Variations</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Authentic handloom sarees are woven by human hands on traditional wooden looms. Minor slubs, slight asymmetries in motifs, and subtle differences in dye hue are natural hallmarks of human craftsmanship — not manufacturing defects.
            </p>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Each saree is rigorously inspected for warp integrity, zari density, and dimensional accuracy by our quality team before being dispatched in custom luxury packaging.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3.5">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">2. Eligibility for Returns & Exchanges</h2>
            </div>
            
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <h3 className="text-xs font-semibold text-[#0F172A]">Transit Damage or Incorrect Item</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  If your saree arrives damaged during transit or differs from what you ordered, please inform our concierge team within <strong>48 hours</strong> of delivery with clear photos or an unboxing video.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <h3 className="text-xs font-semibold text-[#0F172A]">Original Condition & Security Tags</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Sarees must remain unworn, unwashed, unaltered, and folded in their original state with all security tags, Silk Mark tags, and packaging materials intact.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FEF3C7] space-y-1 text-[#92400E]">
                <h3 className="text-xs font-semibold">Customized & Tailored Items</h3>
                <p className="text-xs leading-relaxed">
                  Sarees with customized fall/pico stitching, cut/stitched blouse pieces, or bespoke bridal modifications are tailored uniquely to your specifications and cannot be returned unless verified as physically defective.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">3. Return Shipping & Resolution Process</h2>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-[#475569]">
              <li><strong>Step 1:</strong> Contact our WhatsApp Concierge or email <code className="text-[#0284C7] font-semibold">concierge@flourishwomen.com</code> with your order details.</li>
              <li><strong>Step 2:</strong> Upon verification, we schedule an insured reverse courier pickup from your doorstep at our expense.</li>
              <li><strong>Step 3:</strong> Once received and inspected at our studio (within 2-3 business days), you may choose an immediate replacement, store credit voucher, or refund to your original payment mode.</li>
            </ol>
          </section>

          {/* Concierge Help Card */}
          <section className="bg-gradient-to-br from-[#0F172A] via-[#0B1527] to-[#071324] border border-[#1E293B] rounded-2xl p-6 sm:p-8 text-white shadow-md space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-medium">Need Assistance with an Order or Return?</h2>
                <p className="text-xs text-[#94A3B8] font-light">Our concierge team is available Monday to Saturday, 10am – 7pm IST.</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light leading-relaxed">
              We are committed to making your saree shopping experience completely worry-free. Reach out anytime.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={buildBespokeWhatsAppUrl(undefined, 'Hello, I have an inquiry regarding my saree order / return.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                <span>Contact via WhatsApp</span>
              </a>

              <a
                href="mailto:concierge@flourishwomen.com"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>concierge@flourishwomen.com</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
