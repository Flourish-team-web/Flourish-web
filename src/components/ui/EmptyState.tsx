import * as React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No items found',
  description = 'We are currently curating new additions to this collection.',
  actionText = 'Explore All Sarees',
  actionHref = '/products',
  icon,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto my-8 border border-dashed border-[#E0D8C8] bg-[#FAF8F5] p-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F4EFE6] text-[#C5A059] mb-4">
        {icon || <PackageOpen className="w-5 h-5" />}
      </div>
      <h3 className="font-serif text-xl text-[#1A1816] mb-2">{title}</h3>
      <p className="text-sm text-[#706B64] font-light mb-6 leading-relaxed">
        {description}
      </p>
      {actionHref && actionText && (
        <Link href={actionHref}>
          <Button variant="primary" size="md">
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
}
