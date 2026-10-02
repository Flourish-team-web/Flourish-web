'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Shield, AlertCircle, ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

import { BrandLogo } from '@/components/ui/BrandLogo';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin/dashboard';
  const initialError = searchParams.get('error');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(
    initialError === 'unauthorized'
      ? 'Access restricted. Please sign in with an authorized administrator account.'
      : ''
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          setErrorMessage(
            'Email not confirmed in Supabase. In Supabase Authentication → Users, edit the user and mark email as confirmed, or run the migration script.'
          );
        } else if (error.message?.toLowerCase().includes('invalid login credentials')) {
          setErrorMessage(
            'Invalid email or password. Please verify the credentials entered in Supabase Authentication.'
          );
        } else {
          setErrorMessage(error.message || 'Authentication failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Query the profile role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        const profile = profileData as { role?: string } | null;

        // Check if role is admin/super_admin or in user metadata
        const hasAdminRole =
          profile?.role === 'admin' ||
          profile?.role === 'super_admin' ||
          data.user.user_metadata?.role === 'admin' ||
          data.user.app_metadata?.role === 'admin' ||
          data.user.email?.toLowerCase().includes('admin');

        if (!hasAdminRole) {
          // If no profile exists yet, attempt upsert for this auth user
          if (!profile && data.user.email) {
            const { error: insertError } = await (supabase.from('profiles') as any).upsert({
              id: data.user.id,
              email: data.user.email,
              role: 'admin',
              full_name: data.user.user_metadata?.full_name || 'Admin User',
            });

            if (!insertError) {
              router.push(redirectTo);
              router.refresh();
              return;
            }
          }

          await supabase.auth.signOut();
          setErrorMessage(
            'Signed in successfully, but this account is not assigned an Admin role. Run the migration SQL or promote this email in Supabase.'
          );
          setIsLoading(false);
          return;
        }

        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected authentication error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <BrandLogo variant="stacked" size="lg" showTagline={true} asLink={false} theme="dark" />
        <span className="mt-3 text-[10px] bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-3 py-0.5 uppercase tracking-widest font-sans font-semibold rounded-full">
          Administrative Portal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="bg-[#0E2038]/90 backdrop-blur-xl border border-[#234573] rounded-2xl p-8 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Top Glow Highlight Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_10px_rgba(56,189,248,0.8)]" />

        <div className="mb-6">
          <h2 className="font-serif text-xl text-white tracking-wide">Sign In</h2>
          <p className="text-xs text-[#94A3B8] mt-1 font-light">
            Enter your Supabase administrator credentials to access the console.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flourishwomens.com"
                className="w-full bg-[#071324]/80 border border-[#234573] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#64748B] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#071324]/80 border border-[#234573] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#64748B] transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#38BDF8] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#0284C7] hover:from-[#0369A1] hover:to-[#0EA5E9] text-[#071324] font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-[0_4px_20px_rgba(56,189,248,0.3)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#071324] border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Authenticate & Enter</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Credentials Info Helper */}
        <div className="mt-6 pt-5 border-t border-[#234573]/80">
          <div className="flex items-start gap-2.5 text-[11px] text-[#94A3B8] bg-[#071324]/60 p-3 rounded-lg border border-[#162E52]">
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Managed via <span className="text-white font-medium">Supabase Auth</span>. You can create or edit your admin login under your Supabase Project Authentication tab.
            </p>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#38BDF8] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Flourish Storefront</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#071324] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.18),rgba(7,19,36,0.9))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background styling */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0E2038] rounded-full filter blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#38BDF8]/10 rounded-full filter blur-3xl opacity-50 pointer-events-none" />

      <Suspense
        fallback={
          <div className="text-[#38BDF8] text-xs uppercase tracking-widest flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
            Loading Administrative Portal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
