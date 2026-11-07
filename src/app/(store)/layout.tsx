import * as React from 'react';
import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { getCategories } from '@/services/categoryService';
import { getSiteSettings } from '@/services/settingsService';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full relative">
      <Suspense fallback={<div className="h-20 w-full bg-[#030D1A]" />}>
        <Header initialCategories={categories} />
      </Suspense>
      <main className="flex-1 w-full max-w-full min-w-0">{children}</main>
      <Footer initialSettings={settings} />
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </div>
  );
}
