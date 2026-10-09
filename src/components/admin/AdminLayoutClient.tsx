'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  Menu,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface AdminLayoutClientProps {
  userEmail: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userEmail, children }: AdminLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleToggleMobileMenu = React.useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = React.useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const handleOpenSignOutModal = React.useCallback(() => {
    setIsSignOutModalOpen(true);
  }, []);

  const handleConfirmSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsSigningOut(false);
      setIsSignOutModalOpen(false);
    }
  };

  const mobileBottomNavItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col antialiased">
      {/* 1. Header with mobile hamburger toggle & sign-out trigger */}
      <AdminHeader
        userEmail={userEmail}
        isMobileMenuOpen={isMobileSidebarOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
        onOpenSignOut={handleOpenSignOutModal}
      />

      {/* 2. Main Body: Fixed Left Sidebar + Right Scrollable Page */}
      <div className="flex flex-1 relative">
        {/* Persistent Left Sidebar */}
        <AdminSidebar
          isMobileOpen={isMobileSidebarOpen}
          onClose={handleCloseMobileMenu}
          onOpenSignOut={handleOpenSignOutModal}
        />

        {/* Right side page content - Standard Window / Page Scrolling */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* 3. Mobile Bottom Quick Navigation Bar (< lg screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071324]/95 backdrop-blur-md border-t border-[#1a3a5c] px-2 py-1.5 shadow-2xl">
        <div className="flex items-center justify-around">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 text-[10px] font-medium min-w-[56px]',
                  isActive
                    ? 'text-[#38BDF8] font-semibold scale-105'
                    : 'text-[#64748B] hover:text-white'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-lg flex items-center justify-center mb-0.5 transition-colors',
                    isActive ? 'bg-[#0284C7]/20 text-[#38BDF8]' : 'text-current'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* More / All Menu Drawer Trigger */}
          <button
            type="button"
            onClick={handleToggleMobileMenu}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 text-[10px] font-medium min-w-[56px] cursor-pointer',
              isMobileSidebarOpen
                ? 'text-[#38BDF8] font-semibold scale-105'
                : 'text-[#64748B] hover:text-white'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-lg flex items-center justify-center mb-0.5 transition-colors',
                isMobileSidebarOpen ? 'bg-[#0284C7]/20 text-[#38BDF8]' : 'text-current'
              )}
            >
              <Menu className="w-4 h-4" />
            </div>
            <span>All Menu</span>
          </button>
        </div>
      </nav>

      {/* 4. Sign Out Confirmation Modal */}
      <Modal
        isOpen={isSignOutModalOpen}
        onClose={() => !isSigningOut && setIsSignOutModalOpen(false)}
        title="Confirm Sign Out"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[#475569]">
              Are you sure you want to end your administrative session on <strong className="text-[#0F172A]">Flourish Women</strong>? You will need your credentials to log in again.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE3D2]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSigningOut}
              onClick={() => setIsSignOutModalOpen(false)}
            >
              Stay Logged In
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSigningOut}
              onClick={handleConfirmSignOut}
              className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600 flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Confirm Sign Out</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
