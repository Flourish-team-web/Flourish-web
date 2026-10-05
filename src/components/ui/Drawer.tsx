'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  side?: 'left' | 'right';
  theme?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  theme = 'light',
  children,
  className,
  hideHeader = false,
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden touch-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#020A14]/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 flex max-w-full touch-auto',
          side === 'left' ? 'left-0' : 'right-0'
        )}
      >
        <div
          className={cn(
            'w-screen max-w-xs sm:max-w-sm p-6 shadow-2xl flex flex-col justify-between animate-in duration-300',
            isDark
              ? 'bg-gradient-to-b from-[#030D1A] via-[#082240] to-[#041224] text-white border-[#163860]'
              : 'bg-white text-[#0F172A] border-[#E2E8F0]',
            side === 'left' ? 'slide-in-from-left border-r' : 'slide-in-from-right border-l',
            className
          )}
        >
          {/* Header */}
          {!hideHeader && (
            <div
              className={cn(
                'flex items-center justify-between pb-4 border-b',
                isDark ? 'border-[#163860]' : 'border-[#E2E8F0]'
              )}
            >
              {title ? (
                typeof title === 'string' ? (
                  <h2 className={cn('font-serif text-xl tracking-tight', isDark ? 'text-white' : 'text-[#0F172A]')}>
                    {title}
                  </h2>
                ) : (
                  title
                )
              ) : (
                <div />
              )}
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-full focus:outline-none transition-all cursor-pointer',
                  isDark
                    ? 'text-white/70 hover:text-[#38BDF8] hover:bg-white/10'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                )}
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-5 scrollbar-none">{children}</div>
        </div>
      </div>
    </div>
  );
}
