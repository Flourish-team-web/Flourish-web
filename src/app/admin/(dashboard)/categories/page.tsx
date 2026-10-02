'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { slugify } from '@/lib/utils/formatters';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, AlertCircle, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isActive, setIsActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) setCategories(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder('0');
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setDisplayOrder(cat.display_order.toString());
    setIsActive(cat.is_active);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setErrorMessage('Name and slug are required.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      name: name.trim(),
      slug: slugify(slug),
      description: description.trim() || null,
      image_url: imageUrl || null,
      display_order: parseInt(displayOrder, 10) || 0,
      is_active: isActive,
    };

    try {
      if (editingCategory) {
        const { error } = await (supabase.from('categories') as any)
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('categories') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      alert('Error: ' + error.message);
    }
  };

  const toggleActive = async (cat: Category) => {
    const supabase = createClient();
    const nextState = !cat.is_active;
    await (supabase.from('categories') as any).update({ is_active: nextState }).eq('id', cat.id);
    setCategories(categories.map((c) => (c.id === cat.id ? { ...c, is_active: nextState } : c)));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-violet-500" />
            <span className="text-[11px] uppercase tracking-widest text-violet-500 font-semibold">
              Weave Taxonomy
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-medium">Categories</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage saree weaving categories — Kanchipuram, Banarasi, Organza, Soft Silk.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl text-center py-20 shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-violet-500 mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-medium">Loading categories...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#334155]">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[10px] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">URL Slug</th>
                  <th className="px-4 py-3.5 hidden lg:table-cell">Description</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[#94A3B8] text-[11px] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                        {cat.display_order}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-[#F1F5F9] shrink-0 overflow-hidden border-2 border-[#E2E8F0]">
                          <Image
                            src={cat.image_url || '/images/placeholder-saree.svg'}
                            alt={cat.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-serif font-medium text-sm text-[#0F172A]">
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-md">
                        /categories/{cat.slug}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 hidden lg:table-cell text-[#64748B] max-w-xs truncate font-light">
                      {cat.description || '—'}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleActive(cat)}
                        className="cursor-pointer focus:outline-none"
                      >
                        {cat.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-[#F1F5F9] text-[#64748B] font-semibold border border-[#E2E8F0] rounded-lg">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0284C7] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-[#CBD5E1] rounded-2xl text-center py-20">
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-6 h-6 text-violet-400" />
          </div>
          <p className="font-serif text-lg text-[#0F172A] mb-1">No Categories Found</p>
          <p className="text-xs text-[#64748B] font-light mb-5">
            Create categories to classify your sarees.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="bg-[#071324] text-[#38BDF8] border border-[#38BDF8]/60"
          >
            Add First Category
          </Button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit: ${editingCategory.name}` : 'Create Weave Category'}
        className="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Category Name *"
            required
            placeholder="e.g. Kanchipuram Silk"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
                URL Slug *
              </label>
              {name && (
                <button
                  type="button"
                  onClick={() => setSlug(slugify(name))}
                  className="text-[10px] text-[#0284C7] hover:underline font-semibold cursor-pointer"
                >
                  Auto-generate from Name
                </button>
              )}
            </div>
            <Input
              required
              placeholder="e.g. kanchipuram-silk"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Celebrated bridal silks handwoven in Tamil Nadu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>

          <MediaUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url as string)}
            maxFiles={1}
            folder="flourish-woman/categories"
            label="Category Icon / Photo"
          />

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Input
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0F172A] font-medium">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
                />
                <span>Active on Storefront</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              className="bg-[#071324] text-[#38BDF8] border border-[#38BDF8]/60"
            >
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
