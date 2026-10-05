'use client';

import * as React from 'react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { buildProductWhatsAppUrl, buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { cn } from '@/lib/utils/cn';

interface WhatsAppEnquiryButtonProps {
  productName?: string;
  sku?: string | null;
  price?: number | null;
  productUrl?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'bespoke';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function WhatsAppEnquiryButton({
  productName,
  sku,
  price,
  productUrl,
  className,
  variant = 'primary',
  size = 'md',
  label,
}: WhatsAppEnquiryButtonProps) {
  const currentUrl = typeof window !== 'undefined' ? (productUrl || window.location.href) : productUrl;

  const href = productName
    ? buildProductWhatsAppUrl(undefined, {
        productName,
        sku,
        price,
        productUrl: currentUrl,
      })
    : buildBespokeWhatsAppUrl(undefined);

  const defaultLabel = productName ? 'Enquire on WhatsApp' : 'WhatsApp Enquiry';

  const variants = {
    primary: 'bg-[#071324] hover:bg-[#0E2038] text-white border border-[#38BDF8] shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]',
    secondary: 'bg-[#F0F6FA] hover:bg-[#E0F2FE] text-[#071324] border border-[#CBD5E1]',
    outline: 'border border-[#071324] text-[#071324] hover:bg-[#071324] hover:text-[#38BDF8]',
    bespoke: 'bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0EA5E9] text-[#071324] font-bold shadow-md hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]',
  };

  const sizes = {
    sm: 'py-2 px-3.5 text-[11px]',
    md: 'py-3 px-5 text-xs',
    lg: 'py-4 px-8 text-sm',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans uppercase tracking-widest font-medium transition-all duration-300 focus:outline-none cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
    >
      <WhatsAppIcon className="w-4 h-4 shrink-0" />
      <span>{label || defaultLabel}</span>
    </a>
  );
}
