'use client';

import * as React from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected client-side error
    console.error('App runtime error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06182E] via-[#041021] to-[#01060E] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#38BDF8] selection:text-[#071324]">
      {/* Header */}
      <header className="py-6 px-6 sm:px-12 border-b border-[#163860]/50 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <BrandLogo size="md" showTagline={false} theme="dark" />
        </Link>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-[#94A3B8] hover:text-[#38BDF8] transition-colors flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>
      </header>

      {/* Error Body */}
      <main className="container mx-auto px-6 sm:px-12 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#0A2647] border border-[#1E4D7E] flex items-center justify-center text-[#38BDF8] mx-auto shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <RefreshCw className="w-6 h-6" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
            Something Paused Our Loom
          </h1>

          <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed">
            We encountered a momentary hiccup while preparing this drape. Please try refreshing the page or connect with our concierge.
          </p>

          {error.digest && (
            <p className="text-[11px] font-mono text-[#64748B] bg-[#0A2647]/40 px-3 py-1.5 rounded border border-[#163860] inline-block">
              Ref ID: {error.digest}
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs uppercase tracking-widest font-medium transition-all shadow-[0_4px_20px_rgba(2,132,199,0.35)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <a
              href={buildBespokeWhatsAppUrl(undefined, 'Hi, I experienced an issue on the website. Could you please assist me?')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A2647]/80 hover:bg-[#0E325E] border border-[#1E4D7E] text-[#7DD3FC] text-xs uppercase tracking-widest font-medium transition-all"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Contact Concierge</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-[#64748B] font-light border-t border-[#163860]/40">
        © {new Date().getFullYear()} Flourish Women&apos;s. All rights reserved.
      </footer>
    </div>
  );
}
