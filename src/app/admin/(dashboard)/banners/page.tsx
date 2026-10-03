'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { HeroBanner, Category, Collection } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  UploadCloud,
  X,
  Smartphone,
  Monitor,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function AdminHeroBannersPage() {
  const [banners, setBanners] = React.useState<HeroBanner[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<HeroBanner | null>(null);

  // Form State
  const [ctaText, setCtaText] = React.useState('Explore Collection');
  const [ctaLink, setCtaLink] = React.useState('/products');
  const [selectedDestinationType, setSelectedDestinationType] = React.useState<'preset' | 'custom'>('preset');
  const [imageDesktopUrl, setImageDesktopUrl] = React.useState('');
  const [imageMobileUrl, setImageMobileUrl] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isActive, setIsActive] = React.useState(true);
  const [isUploadingDesktop, setIsUploadingDesktop] = React.useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const desktopFileInputRef = React.useRef<HTMLInputElement>(null);
  const mobileFileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const [{ data: bannerData }, { data: catData }, { data: colData }] = await Promise.all([
      supabase.from('hero_banners').select('*').order('display_order', { ascending: true }),
      supabase.from('categories').select('*').eq('is_active', true).order('name'),
      supabase.from('collections').select('*').eq('is_active', true).order('name'),
    ]);

    if (bannerData) setBanners(bannerData);
    if (catData) setCategories(catData);
    if (colData) setCollections(colData);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setCtaText('Explore Collection');
    setCtaLink('/products');
    setSelectedDestinationType('preset');
    setImageDesktopUrl('');
    setImageMobileUrl('');
    setDisplayOrder(banners.length.toString());
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setCtaText(banner.cta_text || 'Explore Collection');
    const link = banner.cta_link || '/products';
    setCtaLink(link);

    const knownPresets = [
      '/products',
      '/products?sort=newest',
      '/products?sort=popular',
      ...categories.map((c) => `/categories/${c.slug}`),
      ...collections.map((c) => `/collections/${c.slug}`),
    ];
    if (knownPresets.includes(link)) {
      setSelectedDestinationType('preset');
    } else {
      setSelectedDestinationType('custom');
    }

    setImageDesktopUrl(banner.image_desktop_url);
    setImageMobileUrl(banner.image_mobile_url || '');
    setDisplayOrder(banner.display_order.toString());
    setIsActive(banner.is_active);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDesktop(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'flourish-woman/hero');
    formData.append('resourceType', 'image');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to upload desktop image');
      if (data.url) setImageDesktopUrl(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading desktop image');
    } finally {
      setIsUploadingDesktop(false);
      if (desktopFileInputRef.current) desktopFileInputRef.current.value = '';
    }
  };

  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMobile(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'flourish-woman/hero-mobile');
    formData.append('resourceType', 'image');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to upload mobile image');
      if (data.url) setImageMobileUrl(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading mobile image');
    } finally {
      setIsUploadingMobile(false);
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDesktopUrl) {
      setErrorMessage('Please upload at least the desktop banner image.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      title: ctaText.trim() || 'Hero Banner',
      subtitle: null,
      cta_text: ctaText.trim() || 'Explore Collection',
      cta_link: ctaLink.trim() || '/products',
      image_desktop_url: imageDesktopUrl,
      image_mobile_url: imageMobileUrl.trim() || null,
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
      fetchData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save hero banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    const supabase = createClient();
    const { error } = await supabase.from('hero_banners').delete().eq('id', id);
    if (!error) {
      setBanners(banners.filter((b) => b.id !== id));
    } else {
      alert('Error deleting banner: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-4 h-4 text-[#0284C7]" />
            <span className="text-[10px] uppercase tracking-widest text-[#0284C7] font-bold">
              Homepage Showcase
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl text-[#0F172A] font-medium">Hero Banners</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage desktop (16:9) & mobile responsive (4:5 portrait) banners with collection redirect links.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </Button>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="text-center py-20 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-[#0284C7] mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest text-[#64748B] font-medium">Loading banners...</p>
        </div>
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
            >
              {/* 16:9 Banner Preview + Mobile indicator */}
              <div className="relative aspect-[16/9] w-full bg-[#F1F5F9] overflow-hidden">
                <Image
                  src={banner.image_desktop_url}
                  alt={`Hero Banner ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {banner.image_mobile_url && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-sky-950/80 text-[#38BDF8] font-semibold border border-[#38BDF8]/40 rounded-lg backdrop-blur-md">
                      <Smartphone className="w-3 h-3" /> Mobile Ready
                    </span>
                  )}
                  {banner.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#F1F5F9] text-[#64748B] font-semibold border border-[#CBD5E1] rounded-lg backdrop-blur-md">
                      <XCircle className="w-3.5 h-3.5" /> Inactive
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 bg-black/65 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-0.5 rounded-md border border-white/10">
                  Slide {index + 1}
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-4 space-y-2.5 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">
                      Button:
                    </span>
                    <span className="font-semibold text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-0.5 rounded-md">
                      {banner.cta_text || 'Explore Collection'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748B]">
                    Order: {banner.display_order}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#0284C7] truncate">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate font-mono text-[11px]">{banner.cta_link || '/products'}</span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2 bg-[#F8FAFC]">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-2 text-[#64748B] hover:text-[#0284C7] hover:bg-white rounded-lg border border-transparent hover:border-[#CBD5E1] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Edit Banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-dashed border-[#CBD5E1] rounded-2xl shadow-xs">
          <div className="w-14 h-14 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
            <ImageIcon className="w-7 h-7" />
          </div>
          <p className="font-serif text-lg text-[#0F172A] mb-1">No Hero Banners Found</p>
          <p className="text-xs text-[#64748B] mb-5">
            Upload your first desktop & mobile hero banners with collection redirect links.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="bg-[#071324] text-[#38BDF8] border border-[#38BDF8]/60"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add First Banner
          </Button>
        </div>
      )}

      {/* Create / Edit Hero Banner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Dual Uploaders: Desktop (16:9) & Mobile (4:5 / 9:16) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Desktop Banner Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-[#0284C7]" />
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                    Desktop Banner *
                  </label>
                </div>
                <span className="text-[10px] text-[#64748B]">16:9 Landscape</span>
              </div>

              {imageDesktopUrl ? (
                <div className="relative aspect-[16/9] w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl overflow-hidden group shadow-xs">
                  <Image
                    src={imageDesktopUrl}
                    alt="Desktop preview"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-2.5 py-1 bg-white text-[#0F172A] rounded-lg text-[11px] font-semibold shadow-md cursor-pointer hover:bg-[#F8FAFC]">
                      <span>Change</span>
                      <input
                        ref={desktopFileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleDesktopUpload}
                        disabled={isUploadingDesktop}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageDesktopUrl('')}
                      className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-md cursor-pointer"
                      title="Remove Desktop Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className={cn(
                    'relative aspect-[16/9] w-full border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-[#F8FAFC] hover:bg-[#F0F9FF] rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group',
                    isUploadingDesktop && 'opacity-60 pointer-events-none'
                  )}
                >
                  <input
                    ref={desktopFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleDesktopUpload}
                    disabled={isUploadingDesktop}
                    className="hidden"
                  />
                  {isUploadingDesktop ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <Loader2 className="w-6 h-6 text-[#0284C7] animate-spin" />
                      <span className="text-[11px] font-semibold text-[#0F172A]">Uploading desktop...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">
                        Upload Desktop Banner
                      </span>
                      <span className="text-[10px] text-[#64748B] mt-0.5">
                        16:9 • 2400 × 1000px
                      </span>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* 2. Mobile Responsive Banner Upload (4:5 / 9:16 portrait) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#0284C7]" />
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                    Mobile Banner (Optional)
                  </label>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Portrait / Square</span>
              </div>

              {imageMobileUrl ? (
                <div className="relative aspect-[16/9] md:aspect-[16/9] w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl overflow-hidden group shadow-xs">
                  <Image
                    src={imageMobileUrl}
                    alt="Mobile preview"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-2.5 py-1 bg-white text-[#0F172A] rounded-lg text-[11px] font-semibold shadow-md cursor-pointer hover:bg-[#F8FAFC]">
                      <span>Change</span>
                      <input
                        ref={mobileFileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleMobileUpload}
                        disabled={isUploadingMobile}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageMobileUrl('')}
                      className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-md cursor-pointer"
                      title="Remove Mobile Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  className={cn(
                    'relative aspect-[16/9] md:aspect-[16/9] w-full border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-[#F8FAFC] hover:bg-[#F0F9FF] rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group',
                    isUploadingMobile && 'opacity-60 pointer-events-none'
                  )}
                >
                  <input
                    ref={mobileFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleMobileUpload}
                    disabled={isUploadingMobile}
                    className="hidden"
                  />
                  {isUploadingMobile ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <Loader2 className="w-6 h-6 text-[#0284C7] animate-spin" />
                      <span className="text-[11px] font-semibold text-[#0F172A]">Uploading mobile...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">
                        Upload Mobile Banner
                      </span>
                      <span className="text-[10px] text-[#64748B] mt-0.5">
                        Portrait (4:5 / 9:16) • e.g. 1080 × 1350px
                      </span>
                    </div>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* 3. Collection Redirect Link & Button Setup */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2.5">
              <ArrowRight className="w-4 h-4 text-[#0284C7]" />
              <h4 className="font-semibold text-xs text-[#0F172A] uppercase tracking-wider">
                Collection Redirect Button
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* CTA Button Text */}
              <Input
                label="Button Label"
                required
                placeholder="e.g. Explore Collection"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />

              {/* Destination Type Preset */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                  Redirect Destination
                </label>
                <select
                  value={selectedDestinationType === 'custom' ? 'custom' : ctaLink}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setSelectedDestinationType('custom');
                    } else {
                      setSelectedDestinationType('preset');
                      setCtaLink(val);
                    }
                  }}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:border-[#0284C7] focus:outline-none transition-all cursor-pointer font-medium"
                >
                  <optgroup label="Storefront Pages">
                    <option value="/products">All Sarees Catalog (/products)</option>
                    <option value="/products?sort=newest">New Arrivals (/products?sort=newest)</option>
                    <option value="/products?sort=popular">Bestsellers (/products?sort=popular)</option>
                  </optgroup>

                  {categories.length > 0 && (
                    <optgroup label="Weave Categories">
                      {categories.map((cat) => (
                        <option key={cat.id} value={`/categories/${cat.slug}`}>
                          {cat.name} (/categories/{cat.slug})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {collections.length > 0 && (
                    <optgroup label="Curated Collections">
                      {collections.map((col) => (
                        <option key={col.id} value={`/collections/${col.slug}`}>
                          {col.name} (/collections/{col.slug})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  <optgroup label="Other">
                    <option value="custom">Custom URL / Path...</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Custom URL input if selected */}
            {selectedDestinationType === 'custom' && (
              <div className="pt-1">
                <Input
                  label="Custom Destination URL / Link"
                  required
                  placeholder="e.g. /products?fabric=silk or https://..."
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* 4. Display Order & Status Toggle */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <Input
              label="Display Order"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#0F172A] select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#0284C7] focus:ring-[#0284C7] accent-[#0284C7]"
                />
                <span>Active on Homepage</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2.5">
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
              className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] px-5 shadow-sm"
              isLoading={isSubmitting || isUploadingDesktop || isUploadingMobile}
            >
              {editingBanner ? 'Save Changes' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
