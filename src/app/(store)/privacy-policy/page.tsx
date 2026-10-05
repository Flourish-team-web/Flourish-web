import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Truck,
  Cookie,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Privacy Policy — Flourish Woman",
  description: "Learn how Flourish Woman collects, protects, and respects your personal data. Transparent privacy practices for our valued patrons.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 md:py-16 bg-[#FCFCFD]">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] uppercase tracking-wider font-light mb-8">
          <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
          <span className="text-[#CBD5E1]">/</span>
          <span className="text-[#0284C7] font-semibold">Privacy Policy</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#E2E8F0] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-[11px] font-sans tracking-[0.2em] uppercase font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Customer Trust & Data Protection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] font-normal tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-light mt-2 max-w-2xl leading-relaxed">
            At Flourish Woman, we are committed to upholding your trust and safeguarding your personal information with complete transparency.
          </p>
          <div className="flex items-center gap-3 mt-4 text-[11px] text-[#64748B]">
            <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] font-medium text-[#334155]">
              Last Updated: October 2026
            </span>
            <span>•</span>
            <span>Effective worldwide for all patrons</span>
          </div>
        </div>

        {/* 4 Core Guarantees Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-12">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <Eye className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Zero Data Selling</p>
            <p className="text-[11px] text-[#64748B] font-light">Never rented or shared</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <Lock className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Encrypted Safety</p>
            <p className="text-[11px] text-[#64748B] font-light">Standard SSL & HTTPS</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <Truck className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Secure Logistics</p>
            <p className="text-[11px] text-[#64748B] font-light">Only for order transit</p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center space-y-1.5 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto">
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-[#0F172A]">Patron Rights</p>
            <p className="text-[11px] text-[#64748B] font-light">Full control & erasure</p>
          </div>
        </div>

        {/* Structured Policy Sections */}
        <div className="space-y-6 text-sm text-[#475569] font-light leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">1. Introduction & Our Commitment</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              This Privacy Policy explains how <strong className="font-medium text-[#0F172A]">Flourish Woman</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, stores, and protects information when you browse our website, place saree enquiries, or complete WhatsApp concierge orders.
            </p>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              We operate under a strict principle of data minimization: we only collect information essential to fulfilling your orders, customizing your drapes, and providing personal styling care.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3.5">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">2. Information We Collect</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569]">
              Depending on how you interact with us, we may collect the following details:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <h3 className="text-xs font-semibold text-[#0F172A]">Contact & Shipping Details</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Full name, WhatsApp phone number, email address, and doorstep postal address provided during checkout or enquiry.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <h3 className="text-xs font-semibold text-[#0F172A]">Order & Customization Specs</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Selected saree SKU, colorway, blouse measurements, fall/pico finish requests, and bridal timelines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <h3 className="text-xs font-semibold text-[#0F172A]">Communication History</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Messages and styling queries shared with our concierge via WhatsApp to ensure seamless continuity in assistance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <h3 className="text-xs font-semibold text-[#0F172A]">Technical & Device Log Data</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Anonymous browser type, IP address, and device characteristics used strictly for page rendering speed and security monitoring.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">3. How We Use Your Information</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569]">
              We use the collected information exclusively for legitimate business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#475569]">
              <li>Processing, dispatching, and tracking your saree orders and bespoke bridal requests.</li>
              <li>Communicating order status updates, tracking IDs, and delivery schedules directly via WhatsApp or email.</li>
              <li>Coordinating with our master tailors for blouse stitching, unstitched fabric cuts, or fall/edging attachments.</li>
              <li>Preventing fraudulent inquiries, rate-limiting abusive traffic, and preserving system security.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">4. Absolute Protection: No Sale of Personal Data</h2>
            </div>
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] text-xs sm:text-sm leading-relaxed">
              <strong>Our Pledge:</strong> We strictly <strong>never sell, monetize, rent, or trade</strong> your personal contact details, purchasing history, or phone numbers to third-party data brokers or marketing agencies.
            </div>
            <p className="text-xs sm:text-sm text-[#475569]">
              Your details are shared solely with verified service partners essential to your order fulfillment:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#475569]">
              <li><strong>Insured Logistics Providers:</strong> Reputable courier partners (e.g. Blue Dart, Delhivery, DHL) to deliver parcels directly to your doorstep.</li>
              <li><strong>Payment Gateways:</strong> Regulated, PCI-DSS compliant banking partners for secure payment links. We do not store credit/debit card numbers on our servers.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <Cookie className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">5. Cookies & Local Session Data</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Our website uses minimal, functional local storage and essential cookies to maintain your shopping cart items, remember your wishlist preferences, and ensure seamless navigation between pages. We do not use intrusive third-party cross-site tracking cookies.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-[#0F172A]">
              <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium">6. Your Rights & Data Erasure</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              As our valued patron, you maintain complete control over your personal data. At any time, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#475569]">
              <li>Request a copy of the personal information we hold in relation to your orders.</li>
              <li>Request correction or updating of any outdated contact details or shipping addresses.</li>
              <li>Request complete erasure or anonymization of your records from our systems (subject to mandatory tax and invoicing regulations).</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
