'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, ExternalLink, ShieldCheck, User, Bell, Search } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface AdminHeaderProps {
  userEmail?: string | null;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <header className="bg-[#071324] text-white h-16 border-b border-[#1a3a5c]/60 px-5 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/30">
      {/* Left: Brand + Badge */}
      <div className="flex items-center gap-3">
        <BrandLogo size="sm" showTagline={false} asLink={false} theme="dark" />
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] bg-gradient-to-r from-[#0284C7]/20 to-[#38BDF8]/10 text-[#38BDF8] border border-[#0284C7]/30 px-2.5 py-1 uppercase tracking-widest font-semibold rounded-full">
          <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
          Admin Console
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* User pill */}
        {userEmail && (
          <div className="hidden md:flex items-center gap-2 text-[#94A3B8] bg-[#0E2038] border border-[#1d3e6b] px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0284C7] to-[#38BDF8] flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-mono text-[11px] text-white max-w-[160px] truncate">{userEmail}</span>
          </div>
        )}

        {/* View Store */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-[#38BDF8] hover:text-white transition-all font-semibold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/25 px-3 py-1.5 rounded-full text-[11px]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Storefront</span>
        </Link>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-[#64748B] hover:text-rose-400 transition-colors cursor-pointer bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 px-3 py-1.5 rounded-full font-medium text-[11px]"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
