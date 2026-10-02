import * as React from 'react';
import type { Metadata } from 'next';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Add New Saree — Admin Portal',
};

export default function NewProductPage() {
  return <ProductForm />;
}
