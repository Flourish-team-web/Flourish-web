import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden relative">
      <Header />
      <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
