import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#071324',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Flourish Women's",
    default: "Flourish Women's — Wear Your Own Story",
  },
  description:
    'Discover authentic handwoven Indian sarees. Curated Kanchipuram, Banarasi, Soft Silk, and Organza creations crafted for life’s most cherished celebrations.',
  keywords: [
    "Flourish Women's",
    'Flourish Sarees',
    'Kanchipuram Silk Saree',
    'Banarasi Saree',
    'Indian Bridal Saree',
    'Handloom Sarees',
    'Pure Silk Saree',
  ],
  authors: [{ name: "Flourish Women's" }],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} antialiased selection:bg-[#38BDF8] selection:text-[#071324]`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#071324] font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
