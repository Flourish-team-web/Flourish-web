import * as React from 'react';
import { ProductWithDetails } from '@/types/store.types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProductGridProps {
  products: ProductWithDetails[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  emptyTitle = 'No sarees match your selection',
  emptyDescription = 'Try adjusting your filters or explore our complete handloom catalog.',
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
}
