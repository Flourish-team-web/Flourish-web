'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { HeroBanner } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export default function AdminHeroBannersPage() {
  const [banners, setBanners] = React.useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<HeroBanner | null>(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [ctaText, setCtaText] = React.useState('Explore Collection');
  const [ctaLink, setCtaLink] = React.useState('/products');
  const [imageDesktopUrl, setImageDesktopUrl] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isActive, setIsActive] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('hero_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) setBanners(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setCtaText('Explore Collection');
    setCtaLink('/products');
    setImageDesktopUrl('');
    setDisplayOrder('0');
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setCtaText(banner.cta_text || 'Explore Collection');
    setCtaLink(banner.cta_link || '/products');
    setImageDesktopUrl(banner.image_desktop_url);
    setDisplayOrder(banner.display_order.toString());
    setIsActive(banner.is_active);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageDesktopUrl) {
      setErrorMessage('Title and banner image are required.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      cta_text: ctaText.trim() || 'Explore Collection',
      cta_link: ctaLink.trim() || '/products',
      image_desktop_url: imageDesktopUrl,
      display_order: parseInt(displayOrder, 10) || 0,
      is_active: isActive,
    };

    try {
      if (editingBanner) {
        const { error } = await (supabase.from('hero_banners') as any)
          .update(payload)
          .eq('id', editingBanner.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('hero_banners') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save hero banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete banner "${name}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('hero_banners').delete().eq('id', id);
    if (!error) {
      setBanners(banners.filter((b) => b.id !== id));
    } else {
      alert('Error deleting banner: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1816]">Hero Banners</h1>
          <p className="text-xs text-[#706B64] font-sans mt-0.5">
            Manage high-impact editorial banners showcased at the top of the storefront homepage.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest text-[#706B64]">Loading hero banners...</p>
        </div>
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-[#FDFBF7] border border-[#EAE3D2] overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div className="relative aspect-[16/9] w-full bg-[#EAE3D2]">
                <Image
                  src={banner.image_desktop_url}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute top-2.5 right-2.5">
                  {banner.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#EDF5F0] text-[#1B4332] font-medium border border-[#BFDCCE] rounded-xs">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 font-medium border border-gray-300 rounded-xs">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-serif text-lg text-[#1A1816] line-clamp-1">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-xs text-[#706B64] font-light line-clamp-2">{banner.subtitle}</p>
                )}
                <div className="text-[11px] text-[#C5A059] font-medium">
                  CTA: {banner.cta_text || 'Explore'} → {banner.cta_link || '/products'}
                </div>
              </div>

              <div className="p-3 border-t border-[#EAE3D2] flex items-center justify-between bg-[#FAF8F5]">
                <span className="text-[11px] font-mono text-[#8F8A80]">
                  Display Order: {banner.display_order}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1.5 text-[#3D3833] hover:text-[#C5A059] transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id, banner.title)}
                    className="p-1.5 text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FDFBF7] border border-dashed border-[#E0D8C8]">
          <p className="font-serif text-lg text-[#1A1816] mb-1">No Hero Banners Found</p>
          <p className="text-xs text-[#706B64] font-light mb-4">
            Create an editorial banner to greet customers on the homepage.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            Add First Banner
          </Button>
        </div>
      )}

      {/* Create / Edit Hero Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
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
            label="Banner Heading / Headline *"
            required
            placeholder="e.g. WEAR YOUR OWN STORY"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
              Subtitle / Narrative
            </label>
            <textarea
              rows={3}
              placeholder="Exquisite sarees for every chapter of your life. Tradition, craftsmanship and contemporary elegance..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CTA Button Text"
              placeholder="Explore Collection"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
            />
            <Input
              label="CTA Link URL"
              placeholder="/products"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
            />
          </div>

          <MediaUploader
            value={imageDesktopUrl}
            onChange={(url) => setImageDesktopUrl(url as string)}
            maxFiles={1}
            folder="flourish-woman/hero"
            label="Hero Artwork Photo *"
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
                <span>Active Banner</span>
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
              Save Banner
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
