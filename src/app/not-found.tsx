import Link from 'next/link';
import { Compass, Home, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06182E] via-[#041021] to-[#01060E] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#38BDF8] selection:text-[#071324]">
      {/* Top Header Bar */}
      <header className="py-6 px-6 sm:px-12 border-b border-[#163860]/50 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <BrandLogo size="md" showTagline={false} theme="dark" />
        </Link>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-[#94A3B8] hover:text-[#38BDF8] transition-colors flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Return to Home</span>
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main className="container mx-auto px-6 sm:px-12 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A2647] border border-[#1E4D7E] text-[#38BDF8] text-xs uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Page Not Found</span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-light tracking-tight text-white">
            4<span className="text-[#38BDF8] italic font-normal">0</span>4
          </h1>

          <h2 className="text-xl sm:text-2xl font-serif text-white tracking-wide">
            The Drape You Seek Seems to Have Moved
          </h2>

          <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed max-w-md mx-auto">
            The saree design or boutique page you are looking for might have been updated or retired. Let us guide you back to our curated handlooms.
          </p>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs uppercase tracking-widest font-medium transition-all shadow-[0_4px_20px_rgba(2,132,199,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Sarees</span>
            </Link>

            <a
              href={buildBespokeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A2647]/80 hover:bg-[#0E325E] border border-[#1E4D7E] text-[#7DD3FC] text-xs uppercase tracking-widest font-medium transition-all"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          {/* Quick Category Links */}
          <div className="pt-8 border-t border-[#163860]/60 mt-10">
            <p className="text-[11px] uppercase tracking-widest text-[#64748B] mb-3">Popular Categories</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[#94A3B8]">
              <Link href="/categories/kanchipuram-silk" className="px-3 py-1 rounded-full bg-[#0A2647]/50 hover:text-white hover:bg-[#0A2647] border border-[#163860] transition-colors">
                Kanchipuram Silk
              </Link>
              <Link href="/categories/banarasi" className="px-3 py-1 rounded-full bg-[#0A2647]/50 hover:text-white hover:bg-[#0A2647] border border-[#163860] transition-colors">
                Banarasi
              </Link>
              <Link href="/categories/soft-silk" className="px-3 py-1 rounded-full bg-[#0A2647]/50 hover:text-white hover:bg-[#0A2647] border border-[#163860] transition-colors">
                Soft Silk
              </Link>
              <Link href="/categories/organza" className="px-3 py-1 rounded-full bg-[#0A2647]/50 hover:text-white hover:bg-[#0A2647] border border-[#163860] transition-colors">
                Organza
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-6 px-6 text-center text-xs text-[#64748B] font-light border-t border-[#163860]/40">
        © {new Date().getFullYear()} Flourish Women&apos;s. Authentic Indian Handlooms.
      </footer>
    </div>
  );
}
