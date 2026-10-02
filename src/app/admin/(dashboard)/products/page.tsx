'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { ProductWithDetails } from '@/types/store.types';
import { formatCurrencyINR } from '@/lib/utils/formatters';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  Loader2,
  Package,
  Filter,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'published' | 'draft'>('all');

  const fetchProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(*),
        collection:collections(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as unknown as ProductWithDetails[]);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublished = async (product: ProductWithDetails) => {
    const supabase = createClient();
    const nextState = !product.is_published;
    await (supabase.from('products') as any)
      .update({ is_published: nextState })
      .eq('id', product.id);

    setProducts(
      products.map((p) => (p.id === product.id ? { ...p, is_published: nextState } : p))
    );
  };

  const toggleFeatured = async (product: ProductWithDetails) => {
    const supabase = createClient();
    const nextState = !product.is_featured;
    await (supabase.from('products') as any)
      .update({ is_featured: nextState })
      .eq('id', product.id);

    setProducts(
      products.map((p) => (p.id === product.id ? { ...p, is_featured: nextState } : p))
    );
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}"?`)) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert('Failed to delete: ' + error.message);
    }
    setDeletingId(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.fabric && p.fabric.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && p.is_published) ||
      (filterStatus === 'draft' && !p.is_published);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-[#0284C7]" />
            <span className="text-[11px] uppercase tracking-widest text-[#0284C7] font-semibold">
              Product Catalog
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-medium">
            Saree Collection
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage handloom sarees — photography (max 5 images), specs, pricing & inventory.
          </p>
        </div>

        <Link href="/admin/products/new" className="shrink-0">
          <Button
            variant="primary"
            size="md"
            className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Saree</span>
          </Button>
        </Link>
      </div>

      {/* Search + Filters Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search by name, SKU, or fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
          <div className="flex gap-1 bg-[#F1F5F9] rounded-xl p-1">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all',
                  filterStatus === status
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#64748B] whitespace-nowrap shrink-0">
            {filteredProducts.length} / {products.length}
          </span>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl text-center py-20 shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-[#0284C7] mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-medium">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#334155]">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[10px] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3.5">Saree</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3.5 hidden lg:table-cell">Fabric / Type</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-center hidden sm:table-cell">Featured</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredProducts.map((p) => {
                  const primaryImage =
                    p.images?.find((img) => img.is_primary)?.image_url ||
                    p.images?.[0]?.image_url ||
                    '/images/placeholder-saree.svg';

                  return (
                    <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-14 bg-[#F1F5F9] rounded-lg shrink-0 overflow-hidden border border-[#E2E8F0]">
                            <Image
                              src={primaryImage}
                              alt={p.name}
                              fill
                              sizes="40px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif font-medium text-sm text-[#0F172A] truncate max-w-[160px]">
                              {p.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] mt-0.5">
                              {p.sku && <span className="font-mono">#{p.sku}</span>}
                              <span className="text-[#CBD5E1]">•</span>
                              <span>{p.images?.length || 0}/5 photos</span>
                              {p.is_new_arrival && (
                                <>
                                  <span className="text-[#CBD5E1]">•</span>
                                  <span className="text-[#0284C7] font-semibold">New</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-[#475569]">{p.category?.name || '—'}</span>
                      </td>

                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="font-medium text-[#0F172A]">{p.fabric || '—'}</span>
                        {p.saree_type && (
                          <span className="text-[10px] text-[#94A3B8] block mt-0.5">{p.saree_type}</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-[#0F172A] font-sans text-sm">
                          {formatCurrencyINR(p.price)}
                        </span>
                        {p.compare_price && (
                          <span className="text-[10px] text-[#94A3B8] line-through block">
                            {formatCurrencyINR(p.compare_price)}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => togglePublished(p)}
                          className="cursor-pointer focus:outline-none"
                          title="Toggle publish status"
                        >
                          {p.is_published ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                              <CheckCircle2 className="w-3 h-3" /> Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-[#F1F5F9] text-[#64748B] font-semibold border border-[#E2E8F0] rounded-lg">
                              <XCircle className="w-3 h-3" /> Draft
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className="cursor-pointer focus:outline-none"
                          title="Toggle featured"
                        >
                          <Star
                            className={`w-4 h-4 mx-auto transition-colors ${
                              p.is_featured ? 'text-amber-400 fill-amber-400' : 'text-[#CBD5E1] hover:text-amber-300'
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0284C7] hover:bg-[#EFF6FF] transition-colors"
                            title="View on store"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0284C7] hover:bg-[#EFF6FF] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Delete"
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[#CBD5E1] rounded-2xl text-center py-20 shadow-xs">
          <div className="w-14 h-14 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <p className="font-serif text-lg text-[#0F172A] mb-1">No Sarees Found</p>
          <p className="text-xs text-[#64748B] font-light mb-5">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'Start building your catalog by adding your first handloom creation.'}
          </p>
          {!searchQuery && (
            <Link href="/admin/products/new">
              <Button variant="primary" size="sm" className="bg-[#071324] text-[#38BDF8] border border-[#38BDF8]/60">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add First Saree
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
