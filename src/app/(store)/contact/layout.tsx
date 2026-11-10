import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach our concierge for bespoke saree styling inquiries, custom bridal drapes, or WhatsApp assistance.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/contact',
    siteName: 'Flourish Woman',
    title: 'Contact Us',
    description: 'Reach our concierge for bespoke saree styling inquiries, custom bridal drapes, or WhatsApp assistance.',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us',
    description: 'Reach our concierge for bespoke saree styling inquiries, custom bridal drapes, or WhatsApp assistance.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

