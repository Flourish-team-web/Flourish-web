'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  hideHeader = false,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto scrollbar-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071324]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto scrollbar-none my-auto animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        {!hideHeader && (
          <div className="flex items-start justify-between pb-3.5 border-b border-[#F1F5F9] mb-4">
            <div>
              {title && (
                <h3 className="font-serif text-lg sm:text-xl text-[#0F172A] font-semibold tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#64748B] font-light mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] p-1.5 rounded-full transition-all focus:outline-none cursor-pointer -mr-1.5"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
