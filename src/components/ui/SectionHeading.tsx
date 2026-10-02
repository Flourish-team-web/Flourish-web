import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4',
        centered && 'text-center md:flex-col md:items-center border-b-0 pb-0',
        className
      )}
    >
      <div className={cn(centered ? 'max-w-2xl mx-auto' : 'max-w-xl')}>
        {eyebrow && (
          <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] mb-1.5 font-semibold">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#071324] tracking-tight font-normal">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#64748B] font-sans mt-2 font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#071324] hover:text-[#0284C7] font-medium transition-colors self-start md:self-end pb-1"
        >
          <span>{viewAllText}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[#38BDF8]" />
        </Link>
      )}
    </div>
  );
}
