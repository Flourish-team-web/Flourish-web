import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProductWithDetails } from '@/types/store.types';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Edit Saree — Admin Portal',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      category:categories(*),
      collection:collections(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as unknown as ProductWithDetails;
  if (product.images) {
    product.images.sort((a, b) => a.display_order - b.display_order);
  }

  return <ProductForm initialProduct={product} />;
}
