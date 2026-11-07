'use client';

import * as React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info, X, CopyX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ToastType = 'error' | 'warning' | 'success' | 'info';

export interface ToastProps {
  type?: ToastType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
  duration?: number; // ms, default 7000
}

export function AdminToast({
  type = 'warning',
  title,
  message,
  action,
  onClose,
  duration = 7000,
}: ToastProps) {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    if (duration <= 0) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const config = {
    warning: {
      bg: 'bg-[#0F172A]',
      border: 'border-amber-500/40',
      iconBg: 'bg-amber-500/15 border border-amber-500/30 text-amber-400',
      icon: AlertTriangle,
      titleColor: 'text-amber-400',
      progressBg: 'bg-amber-500',
    },
    error: {
      bg: 'bg-[#0F172A]',
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/15 border border-rose-500/30 text-rose-400',
      icon: CopyX,
      titleColor: 'text-rose-400',
      progressBg: 'bg-rose-500',
    },
    success: {
      bg: 'bg-[#0F172A]',
      border: 'border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400',
      icon: CheckCircle2,
      titleColor: 'text-emerald-400',
      progressBg: 'bg-emerald-500',
    },
    info: {
      bg: 'bg-[#0F172A]',
      border: 'border-sky-500/40',
      iconBg: 'bg-sky-500/15 border border-sky-500/30 text-sky-400',
      icon: Info,
      titleColor: 'text-sky-400',
      progressBg: 'bg-sky-500',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className="fixed top-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in slide-in-from-top-3 fade-in duration-300"
    >
      <div
        className={cn(
          'relative rounded-2xl p-4 shadow-2xl backdrop-blur-xl border flex flex-col gap-3',
          config.bg,
          config.border,
          'text-white'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Accent Icon */}
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', config.iconBg)}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>

          {/* Toast Text Content */}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className={cn('text-sm font-semibold tracking-wide flex items-center gap-1.5', config.titleColor)}>
              {title}
            </h4>
            <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed break-words">
              {message}
            </p>

            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/15 transition-all cursor-pointer"
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar (countdown indicator) */}
        {duration > 0 && (
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
            <div
              className={cn('h-full rounded-full transition-all duration-75 ease-linear', config.progressBg)}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
