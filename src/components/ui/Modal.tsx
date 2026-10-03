'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1816]/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-lg bg-[#FAF8F5] border border-[#E0D8C8] shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE3D2] mb-5">
          {title ? (
            <h3 className="font-serif text-xl text-[#1A1816] tracking-tight">{title}</h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-[#706B64] hover:text-[#1A1816] p-1.5 transition-colors focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
