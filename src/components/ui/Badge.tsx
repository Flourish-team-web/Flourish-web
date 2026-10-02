import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'maroon' | 'neutral' | 'outline' | 'forest';
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  const variants = {
    neutral: 'bg-[#F1F5F9] text-[#1E293B] border-[#E2E8F0]',
    gold: 'bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]',
    maroon: 'bg-[#FAF0F0] text-[#832729] border-[#E9C3C3]',
    forest: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    outline: 'bg-transparent text-[#64748B] border-[#CBD5E1]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
