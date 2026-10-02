import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'editorial';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans tracking-wider uppercase text-xs transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary: 'bg-[#071324] text-white hover:bg-[#0E2038] hover:text-[#38BDF8] focus:ring-[#38BDF8] shadow-sm',
      secondary: 'bg-[#F0F6FA] text-[#071324] hover:bg-[#E0F2FE] hover:text-[#0284C7] focus:ring-[#38BDF8]',
      outline: 'border border-[#071324] text-[#071324] hover:bg-[#071324] hover:text-[#38BDF8] focus:ring-[#38BDF8]',
      gold: 'bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white hover:from-[#0369A1] hover:to-[#0EA5E9] focus:ring-[#38BDF8] shadow-sm shadow-[#38BDF8]/20',
      ghost: 'bg-transparent text-[#071324] hover:bg-[#F0F6FA] hover:text-[#0284C7] focus:ring-[#38BDF8]',
      editorial: 'border-b border-[#071324] pb-1 text-[#071324] hover:border-[#38BDF8] hover:text-[#0284C7] rounded-none px-0',
    };

    const sizes = {
      sm: 'h-8 px-4 text-[10px]',
      md: 'h-11 px-6 text-xs',
      lg: 'h-13 px-8 text-sm',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
