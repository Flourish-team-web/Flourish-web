'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  children,
  className,
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden touch-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs transition-opacity"
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
            'w-screen max-w-xs sm:max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between border-[#E2E8F0] animate-in duration-300',
            side === 'left' ? 'slide-in-from-left border-r' : 'slide-in-from-right border-l',
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D2]">
            {title ? (
              <h2 className="font-serif text-xl tracking-tight text-[#1A1816]">{title}</h2>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#706B64] hover:text-[#1A1816] focus:outline-none transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
