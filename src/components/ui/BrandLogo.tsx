'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface BrandLogoProps {
  /** Variant of the logo display */
  variant?: 'image' | 'full' | 'horizontal' | 'icon-only' | 'stacked';
  /** Theme scheme */
  theme?: 'dark' | 'light' | 'auto';
  /** Size preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show the tagline (for vector mode) */
  showTagline?: boolean;
  /** Whether it should link to homepage */
  asLink?: boolean;
  /** Custom class for the wrapper */
  className?: string;
  /** Custom class for the image/icon */
  imageClassName?: string;
  /** Priority loading for LCP */
  priority?: boolean;
  /** Ambient electric cyan glow effect */
  glow?: boolean;
}

/**
 * High-fidelity Vector Icon of the Flourish Women's Needle & Thread Emblem
 */
export function FlourishIcon({
  className = 'w-10 h-10',
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  const gradientId = React.useId();
  const shadowId = React.useId();

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none overflow-visible', className)}
      aria-label="Flourish Women's Emblem"
    >
      <defs>
        <linearGradient id={gradientId} x1="20%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="35%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {glow && (
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#38BDF8" floodOpacity="0.45" />
          </filter>
        )}
      </defs>

      <g filter={glow ? `url(#${shadowId})` : undefined}>
        <path
          d="M 58 30 C 56 18, 64 12, 73 16 C 80 19, 81 26, 76 34"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="77"
          cy="34"
          rx="7"
          ry="9.5"
          transform="rotate(35 77 34)"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.6"
        />
        <ellipse
          cx="77"
          cy="34"
          rx="2.6"
          ry="4.2"
          transform="rotate(35 77 34)"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M 83 26 L 39 88"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        <path
          d="M 39 88 L 35 94"
          stroke={`url(#${gradientId})`}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 77 40 C 85 46, 88 56, 81 65 C 74 72, 59 70, 48 65 C 34 60, 27 53, 30 45 C 33 38, 41 39, 55 47 C 67 54, 78 67, 63 82 C 54 88, 56 97, 65 99"
          stroke={`url(#${gradientId})`}
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/**
 * Official Brand Logo Component — renders the official /images/flourish-logo.png asset
 */
export function BrandLogo({
  size = 'md',
  asLink = true,
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  // Height presets for the official rectangular logo asset
  const sizeMap = {
    xs: { height: 40, width: 120, className: 'h-7 sm:h-8 w-auto' },
    sm: { height: 56, width: 168, className: 'h-8 sm:h-10 md:h-12 w-auto' },
    md: { height: 80, width: 240, className: 'h-8 sm:h-10 md:h-12 lg:h-14 w-auto' },
    lg: { height: 104, width: 312, className: 'h-12 sm:h-16 md:h-20 w-auto' },
    xl: { height: 140, width: 420, className: 'h-16 sm:h-22 md:h-28 w-auto' },
  }[size];

  const content = (
    <div className={cn('relative inline-flex items-center select-none bg-transparent max-w-full', className)}>
      <Image
        src="/images/logo.png"
        alt="Flourish Women's"
        width={sizeMap.width * 2}
        height={sizeMap.height * 2}
        priority={priority}
        className={cn('object-contain bg-transparent max-w-full', sizeMap.className, imageClassName)}
      />
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex shrink-0 items-center focus:outline-none bg-transparent" aria-label="Flourish Women's Home">
        {content}
      </Link>
    );
  }

  return content;
}
