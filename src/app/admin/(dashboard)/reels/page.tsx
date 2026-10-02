'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Reel, ProductWithDetails } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Play, Loader2, AlertCircle, Eye } from 'lucide-react';

export default function AdminReelsPage() {
  const [reels, setReels] = React.useState<Reel[]>([]);
  const [products, setProducts] = React.useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingReel, setEditingReel] = React.useState<Reel | null>(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [thumbnailUrl, setThumbnailUrl] = React.useState('');
  const [viewCountLabel, setViewCountLabel] = React.useState('12.4k views');
  const [productId, setProductId] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isActive, setIsActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchReelsAndProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const [{ data: reelsData }, { data: productsData }] = await Promise.all([
      supabase.from('reels').select('*').order('display_order', { ascending: true }),
      supabase.from('products').select('*').eq('is_published', true).order('name'),
    ]);

    if (reelsData) setReels(reelsData);
    if (productsData) setProducts(productsData as unknown as ProductWithDetails[]);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchReelsAndProducts();
  }, []);

  const openCreateModal = () => {
    setEditingReel(null);
    setTitle('');
    setVideoUrl('');
    setThumbnailUrl('');
    setViewCountLabel('12.4k views');
    setProductId('');
    setDisplayOrder('0');
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (reel: Reel) => {
    setEditingReel(reel);
    setTitle(reel.title);
    setVideoUrl(reel.video_url || '');
    setThumbnailUrl(reel.thumbnail_url);
    setViewCountLabel(reel.view_count_label || '10.2k views');
    setProductId(reel.product_id || '');
    setDisplayOrder(reel.display_order.toString());
    setIsActive(reel.is_active);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !thumbnailUrl) {
      setErrorMessage('Title and thumbnail image are required.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      title: title.trim(),
      video_url: videoUrl.trim() || null,
      thumbnail_url: thumbnailUrl,
      view_count_label: viewCountLabel.trim() || '10.5k views',
      product_id: productId || null,
      display_order: parseInt(displayOrder, 10) || 0,
      is_active: isActive,
    };

    try {
      if (editingReel) {
        const { error } = await (supabase.from('reels') as any)
          .update(payload)
          .eq('id', editingReel.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('reels') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchReelsAndProducts();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save reel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete reel "${title}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('reels').delete().eq('id', id);
    if (!error) {
      setReels(reels.filter((r) => r.id !== id));
    } else {
      alert('Error deleting reel: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1816]">Flourish Reels</h1>
          <p className="text-xs text-[#706B64] font-sans mt-0.5">
            Manage fashion drape videos and saree highlights (Max 3 MB per video).
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Reel</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest text-[#706B64]">Loading reels...</p>
        </div>
      ) : reels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-[#FDFBF7] border border-[#EAE3D2] overflow-hidden flex flex-col justify-between shadow-xs group"
            >
              <div className="relative aspect-[9/16] w-full bg-[#1A1816]">
                <Image
                  src={reel.thumbnail_url || '/images/placeholder-saree.svg'}
                  alt={reel.title}
                  fill
                  sizes="200px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2 right-2">
                  {reel.is_active ? (
                    <span className="px-1.5 py-0.5 text-[9px] bg-[#EDF5F0] text-[#1B4332] font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[9px] bg-gray-200 text-gray-700 font-semibold">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 left-2 right-2 text-white text-[10px] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#E8D4A8]" />
                  <span>{reel.view_count_label || '8.5k views'}</span>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h4 className="font-serif text-xs text-[#1A1816] font-medium line-clamp-2 leading-tight">
                  {reel.title}
                </h4>
              </div>

              <div className="p-2 border-t border-[#EAE3D2] flex items-center justify-between bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8F8A80]">
                  #{reel.display_order}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(reel)}
                    className="p-1 text-[#3D3833] hover:text-[#C5A059] transition-colors cursor-pointer"
                    title="Edit Reel"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reel.id, reel.title)}
                    className="p-1 text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Reel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FDFBF7] border border-dashed border-[#E0D8C8]">
          <p className="font-serif text-lg text-[#1A1816] mb-1">No Video Reels Found</p>
          <p className="text-xs text-[#706B64] font-light mb-4">
            Upload vertical fashion drape clips and styling tips to engage shoppers.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            Add First Reel
          </Button>
        </div>
      )}

      {/* Create / Edit Reel Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReel ? 'Edit Flourish Reel' : 'Add Flourish Reel'}
        className="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Reel Title *"
            required
            placeholder="e.g. Traditional Muhurtham Drape Guide"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="View Count Label"
            placeholder="e.g. 15.2k views"
            value={viewCountLabel}
            onChange={(e) => setViewCountLabel(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
              Associated Saree Product (Optional)
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
            >
              <option value="">— None / General Styling —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.fabric || 'Saree'})
                </option>
              ))}
            </select>
          </div>

          <MediaUploader
            value={thumbnailUrl}
            onChange={(url) => setThumbnailUrl(url as string)}
            maxFiles={1}
            folder="flourish-woman/reels/thumbs"
            label="Portrait Thumbnail Photo *"
          />

          <MediaUploader
            value={videoUrl}
            onChange={(url) => setVideoUrl(url as string)}
            maxFiles={1}
            resourceType="video"
            folder="flourish-woman/reels/videos"
            label="Video Clip (Max 3 MB Limit)"
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Input
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1A1816]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#1A1816]"
                />
                <span>Active on Storefront</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE3D2] flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Save Reel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
