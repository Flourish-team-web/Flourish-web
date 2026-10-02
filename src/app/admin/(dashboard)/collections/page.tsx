'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Collection } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { slugify } from '@/lib/utils/formatters';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCol, setEditingCol] = React.useState<Collection | null>(null);

  // Form state
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [bannerUrl, setBannerUrl] = React.useState('');
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isActive, setIsActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchCollections = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) setCollections(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCol(null);
    setName('');
    setSlug('');
    setTagline('');
    setDescription('');
    setBannerUrl('');
    setIsFeatured(false);
    setDisplayOrder('0');
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCol(col);
    setName(col.name);
    setSlug(col.slug);
    setTagline(col.tagline || '');
    setDescription(col.description || '');
    setBannerUrl(col.banner_url || col.thumbnail_url || '');
    setIsFeatured(col.is_featured);
    setDisplayOrder(col.display_order.toString());
    setIsActive(col.is_active);
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
      tagline: tagline.trim() || null,
      description: description.trim() || null,
      banner_url: bannerUrl || null,
      thumbnail_url: bannerUrl || null,
      is_featured: isFeatured,
      display_order: parseInt(displayOrder, 10) || 0,
      is_active: isActive,
    };

    try {
      if (editingCol) {
        const { error } = await (supabase.from('collections') as any)
          .update(payload)
          .eq('id', editingCol.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('collections') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCollections();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete collection "${name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (!error) {
      setCollections(collections.filter((c) => c.id !== id));
    } else {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] uppercase tracking-widest text-amber-500 font-semibold">
              Curated Edits
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-medium">Collections</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage thematic lookbooks — Bridal Splendor, Festive Radiance, Everyday Poise.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl text-center py-20 shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-amber-500 mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-medium">Loading collections...</p>
        </div>
      ) : collections.length > 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#334155]">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[10px] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Collection</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Tagline</th>
                  <th className="px-4 py-3.5 text-center">Featured</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[#94A3B8] text-[11px] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                        {col.display_order}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 bg-[#F1F5F9] rounded-xl shrink-0 overflow-hidden border border-[#E2E8F0]">
                          <Image
                            src={col.banner_url || '/images/placeholder-saree.svg'}
                            alt={col.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-medium text-sm text-[#0F172A] block">
                            {col.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#94A3B8]">
                            /collections/{col.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 hidden md:table-cell text-[#475569] font-light">
                      {col.tagline || '—'}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <Star
                        className={`w-4 h-4 mx-auto ${
                          col.is_featured ? 'text-amber-400 fill-amber-400' : 'text-[#CBD5E1]'
                        }`}
                      />
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {col.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-[#F1F5F9] text-[#64748B] font-semibold border border-[#E2E8F0] rounded-lg">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(col)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0284C7] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(col.id, col.name)}
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
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <p className="font-serif text-lg text-[#0F172A] mb-1">No Collections Yet</p>
          <p className="text-xs text-[#64748B] font-light mb-5">
            Curate your first seasonal saree edit.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="bg-[#071324] text-[#38BDF8] border border-[#38BDF8]/60"
          >
            Add First Collection
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCol ? `Edit: ${editingCol.name}` : 'Create New Collection'}
        className="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Collection Title *"
            required
            placeholder="e.g. Royal Wedding Trousseau"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
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
                    Auto-generate
                  </button>
                )}
              </div>
              <Input
                required
                placeholder="e.g. royal-wedding-trousseau"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
            <Input
              label="Tagline"
              placeholder="e.g. Bridal Splendor"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Heritage weaves for unforgettable occasions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>

          <MediaUploader
            value={bannerUrl}
            onChange={(url) => setBannerUrl(url as string)}
            maxFiles={1}
            folder="flourish-woman/collections"
            label="Collection Cover / Banner"
          />

          <div className="grid grid-cols-3 gap-3 pt-1">
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
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
                />
                <span>Featured</span>
              </label>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0F172A] font-medium">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#0284C7] rounded cursor-pointer"
                />
                <span>Active</span>
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
              Save Collection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
