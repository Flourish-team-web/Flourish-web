'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { PromotionalBanner, Category, Collection } from '@/types/store.types';
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
  BadgePercent,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Link2,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ConfirmDeleteModal } from '@/components/admin/ConfirmDeleteModal';

export default function AdminPromoBannersPage() {
  const [banners, setBanners] = React.useState<PromotionalBanner[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<PromotionalBanner | null>(null);

  // Form State (None mandatory)
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [badgeText, setBadgeText] = React.useState('');
  const [ctaText, setCtaText] = React.useState('Explore Collection');
  const [ctaLink, setCtaLink] = React.useState('/products');
  const [selectedDestinationType, setSelectedDestinationType] = React.useState<'category' | 'page' | 'custom'>('category');
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageMobileUrl, setImageMobileUrl] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isActive, setIsActive] = React.useState(true);

  // Input Mode Toggles (Upload vs URL input)
  const [desktopImageMode, setDesktopImageMode] = React.useState<'upload' | 'url'>('upload');
  const [mobileImageMode, setMobileImageMode] = React.useState<'upload' | 'url'>('upload');

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
      supabase.from('promotional_banners').select('*').order('display_order', { ascending: true }),
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
    setTitle('');
    setSubtitle('');
    setBadgeText('');
    setCtaText('Explore Collection');
    setSelectedDestinationType('category');
    if (categories.length > 0) {
      setCtaLink(`/categories/${categories[0].slug}`);
    } else {
      setCtaLink('/products');
    }
    setImageUrl('');
    setImageMobileUrl('');
    setDesktopImageMode('upload');
    setMobileImageMode('upload');
    setDisplayOrder(banners.length.toString());
    setIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: PromotionalBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title || '');
    setSubtitle(banner.subtitle || '');
    setBadgeText(banner.badge_text || '');
    setCtaText(banner.cta_text || 'Explore Collection');
    const link = banner.cta_link || '';
    setCtaLink(link);

    if (link.startsWith('/categories/')) {
      setSelectedDestinationType('category');
    } else if (
      [
        '/products',
        '/products?filter=new-arrivals',
        '/products?sort=newest',
        '/products?filter=bestsellers',
        '/products?sort=popular',
        '/products?filter=featured',
        '/products?sort=featured',
        '/about',
        '/contact',
        '',
      ].includes(link)
    ) {
      setSelectedDestinationType('page');
    } else {
      setSelectedDestinationType('custom');
    }

    setImageUrl(banner.image_url || '');
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
    formData.append('folder', 'flourish-woman/promo');
    formData.append('resourceType', 'image');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to upload desktop image');
      if (data.url) setImageUrl(data.url);
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
    formData.append('folder', 'flourish-woman/promo-mobile');
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
    setErrorMessage(null);
    setIsSubmitting(true);
    const supabase = createClient();

    // Default title if left blank
    const finalTitle = title.trim() || 'Flourish Signature';

    const payload = {
      title: finalTitle,
      subtitle: subtitle.trim() || null,
      badge_text: badgeText.trim() || null,
      cta_text: ctaText.trim() || null,
      cta_link: ctaLink.trim() || null,
      image_url: imageUrl.trim() || null,
      image_mobile_url: imageMobileUrl.trim() || null,
      display_order: parseInt(displayOrder, 10) || 0,
      is_active: isActive,
    };

    try {
      if (editingBanner) {
        const { error } = await (supabase.from('promotional_banners') as any)
          .update(payload)
          .eq('id', editingBanner.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('promotional_banners') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save promotional banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (banner: PromotionalBanner) => {
    const supabase = createClient();
    const nextState = !banner.is_active;
    await (supabase.from('promotional_banners') as any)
      .update({ is_active: nextState })
      .eq('id', banner.id);

    setBanners(
      banners.map((b) => (b.id === banner.id ? { ...b, is_active: nextState } : b))
    );
  };

  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from('promotional_banners').delete().eq('id', deleteTarget.id);
    if (!error) {
      setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      alert('Error deleting banner: ' + error.message);
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BadgePercent className="w-4 h-4 text-[#0284C7]" />
            <span className="text-[10px] uppercase tracking-widest text-[#0284C7] font-bold">
              The Flourish Signature
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl text-[#0F172A] font-medium">Promo Banners</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage the 3 small signature promotional banners with desktop and mobile responsive images on the homepage.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Promo Banner</span>
        </Button>
      </div>

      {/* Notice info pill */}
      <div className="bg-[#E0F2FE]/60 border border-[#BAE6FD] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#0369A1]">
        <BadgePercent className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The top <strong>3 active banners</strong> will automatically showcase in <strong>&quot;The Flourish Signature&quot;</strong> section. Dedicated mobile responsive images automatically adapt on phones and tablets.
        </p>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="text-center py-20 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
          <Loader2 className="w-7 h-7 animate-spin text-[#0284C7] mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest text-[#64748B] font-medium">Loading banners...</p>
        </div>
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header & Preview */}
              <div>
                <div className="relative aspect-[16/10] bg-[#071324] overflow-hidden">
                  {banner.image_url ? (
                    <Image
                      src={banner.image_url}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center brightness-90"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                      <ImageIcon className="w-6 h-6 mb-1 text-slate-500" />
                      <span>Default Silk Imagery Used</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030B17]/95 via-[#07172C]/70 to-[#07172C]/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="bg-[#071324]/80 text-[#38BDF8] border border-[#38BDF8]/40 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      Order #{banner.display_order}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {banner.image_mobile_url && (
                        <span className="bg-[#0284C7]/80 text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5" title="Mobile Optimized Image Active">
                          <Smartphone className="w-2.5 h-2.5" /> Mobile
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleActive(banner)}
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-xs border transition-colors',
                          banner.is_active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                        )}
                      >
                        {banner.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Text in Preview */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                    {banner.badge_text && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#0284C7]/30 border border-[#38BDF8]/40 text-[#7DD3FC] text-[8px] uppercase font-bold tracking-widest">
                        {banner.badge_text}
                      </span>
                    )}
                    <h3 className="text-white text-sm font-serif font-medium line-clamp-1 leading-snug">
                      {banner.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2 text-xs">
                  {banner.subtitle && (
                    <p className="text-[#64748B] line-clamp-2 leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="pt-2 border-t border-[#F1F5F9] flex flex-col gap-1 text-[11px] text-[#475569]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#94A3B8]">Destination:</span>
                      <span className="font-medium text-[#0284C7] truncate max-w-[170px]" title={banner.cta_link || ''}>
                        {banner.cta_link?.startsWith('/categories/')
                          ? `Category: ${categories.find((c) => `/categories/${c.slug}` === banner.cta_link)?.name || banner.cta_link.replace('/categories/', '')}`
                          : banner.cta_link || 'None (Showcase only)'}
                      </span>
                    </div>
                    {banner.cta_text && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#94A3B8]">Button:</span>
                        <span className="font-medium text-[#0F172A]">{banner.cta_text}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(banner)}
                  className="flex-1 text-xs py-1.5 h-8 flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget({ id: banner.id, title: banner.title || 'Promo Banner' })}
                  className="text-xs py-1.5 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 flex items-center justify-center px-2.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center shadow-xs">
          <BadgePercent className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#0F172A] font-medium">No Signature Promo Banners Yet</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Create signature promo banners with custom desktop and mobile imagery to feature them on the homepage.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="mt-4 bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </Button>
        </div>
      )}

      {/* Add / Edit Modal - All fields non-mandatory */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Promo Banner' : 'Add New Promo Banner'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Banner Title (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-1">
              Banner Title
            </label>
            <Input
              type="text"
              placeholder="e.g. PURE SILK MARK CERTIFIED"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Subtitle / Description (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-1">
              Subtitle / Description
            </label>
            <Input
              type="text"
              placeholder="e.g. 100% genuine mulberry silk threads & authentic tested zari."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          {/* Badge Tag (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-1">
              Badge Tag
            </label>
            <Input
              type="text"
              placeholder="e.g. PURITY GUARANTEE or ETHICAL LOOMS"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
            />
          </div>

          {/* Responsive Image Section: Desktop & Mobile Options */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-xs uppercase font-bold text-[#0F172A] tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                Responsive Banner Media
              </span>
              <span className="text-[10px] text-[#64748B]">Upload file or paste direct link</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Desktop Banner Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#0F172A] flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5 text-[#0284C7]" /> Desktop Image
                  </label>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDesktopImageMode('upload')}
                      className={cn(
                        'px-2 py-0.5 rounded font-medium transition-colors',
                        desktopImageMode === 'upload'
                          ? 'bg-[#071324] text-white'
                          : 'bg-slate-200 text-[#475569]'
                      )}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesktopImageMode('url')}
                      className={cn(
                        'px-2 py-0.5 rounded font-medium transition-colors',
                        desktopImageMode === 'url'
                          ? 'bg-[#071324] text-white'
                          : 'bg-slate-200 text-[#475569]'
                      )}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {desktopImageMode === 'upload' ? (
                  <div className="aspect-[16/10] bg-white border-2 border-dashed border-[#CBD5E1] rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-2 text-center group">
                    {imageUrl ? (
                      <>
                        <Image src={imageUrl} alt="Desktop Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center z-10 shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                        <input
                          ref={desktopFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleDesktopUpload}
                          disabled={isUploadingDesktop}
                          className="hidden"
                        />
                        {isUploadingDesktop ? (
                          <Loader2 className="w-5 h-5 text-[#0284C7] animate-spin mb-1" />
                        ) : (
                          <>
                            <UploadCloud className="w-6 h-6 text-[#0284C7] mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold text-[#0F172A]">Upload Desktop Photo</span>
                            <span className="text-[9px] text-[#64748B]">Aspect Ratio ~16:10</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {imageUrl && (
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#E2E8F0]">
                        <Image src={imageUrl} alt="Desktop Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Mobile Responsive Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#0F172A] flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Mobile Responsive Image
                  </label>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setMobileImageMode('upload')}
                      className={cn(
                        'px-2 py-0.5 rounded font-medium transition-colors',
                        mobileImageMode === 'upload'
                          ? 'bg-[#071324] text-white'
                          : 'bg-slate-200 text-[#475569]'
                      )}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileImageMode('url')}
                      className={cn(
                        'px-2 py-0.5 rounded font-medium transition-colors',
                        mobileImageMode === 'url'
                          ? 'bg-[#071324] text-white'
                          : 'bg-slate-200 text-[#475569]'
                      )}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {mobileImageMode === 'upload' ? (
                  <div className="aspect-[16/10] bg-white border-2 border-dashed border-[#CBD5E1] rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-2 text-center group">
                    {imageMobileUrl ? (
                      <>
                        <Image src={imageMobileUrl} alt="Mobile Preview" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageMobileUrl('')}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center z-10 shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                        <input
                          ref={mobileFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMobileUpload}
                          disabled={isUploadingMobile}
                          className="hidden"
                        />
                        {isUploadingMobile ? (
                          <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mb-1" />
                        ) : (
                          <>
                            <Smartphone className="w-6 h-6 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-semibold text-[#0F172A]">Upload Mobile Image</span>
                            <span className="text-[9px] text-[#64748B]">Optional phone crop (~4:5)</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageMobileUrl}
                      onChange={(e) => setImageMobileUrl(e.target.value)}
                    />
                    {imageMobileUrl && (
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#E2E8F0]">
                        <Image src={imageMobileUrl} alt="Mobile Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button Text & Destination */}
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-1">
                Button Text (Optional)
              </label>
              <Input
                type="text"
                placeholder="e.g. Explore Collection"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            </div>

            {/* Special Banner Redirection Target Selector */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                    Banner Redirection Target *
                  </label>
                  <p className="text-[11px] text-[#64748B]">Choose the destination when a customer clicks this banner</p>
                </div>

                {ctaLink && ctaLink.startsWith('/categories/') && (
                  <span className="text-[10px] bg-[#E0F2FE] text-[#0284C7] font-bold px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                    Category Linked
                  </span>
                )}
              </div>

              {/* Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-[#CBD5E1]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestinationType('category');
                    if (categories.length > 0 && !ctaLink.startsWith('/categories/')) {
                      setCtaLink(`/categories/${categories[0].slug}`);
                    }
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    selectedDestinationType === 'category'
                      ? 'bg-[#071324] text-[#38BDF8] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Saree Category</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedDestinationType('page');
                    if (!['/products', '/products?filter=new-arrivals', '/products?filter=bestsellers', '/products?filter=featured', '/about', '/contact', ''].includes(ctaLink)) {
                      setCtaLink('/products');
                    }
                  }}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    selectedDestinationType === 'page'
                      ? 'bg-[#071324] text-[#38BDF8] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  )}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Store Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDestinationType('custom')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    selectedDestinationType === 'custom'
                      ? 'bg-[#071324] text-[#38BDF8] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  )}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Custom URL</span>
                </button>
              </div>

              {/* 1. Dedicated Category Selector */}
              {selectedDestinationType === 'category' && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0F172A]">
                    Select Saree Category to Redirect To:
                  </label>
                  <select
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:outline-none transition-all cursor-pointer font-medium shadow-2xs"
                  >
                    <option value="">— Select Category —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={`/categories/${c.slug}`}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {ctaLink && ctaLink.startsWith('/categories/') && (
                    <div className="flex items-center justify-between text-[11px] text-[#0284C7] bg-[#F0F9FF] border border-[#BAE6FD] px-3.5 py-2 rounded-xl">
                      <span className="font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                        <span>Redirects to:</span>
                        <strong className="text-[#0369A1]">
                          {categories.find((c) => `/categories/${c.slug}` === ctaLink)?.name || ctaLink}
                        </strong>
                      </span>
                      <span className="font-mono text-[10.5px] text-[#0284C7]/80">{ctaLink}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Store Pages Selector */}
              {selectedDestinationType === 'page' && (
                <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0F172A]">
                    Select Store Page:
                  </label>
                  <select
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:outline-none transition-all cursor-pointer font-medium shadow-2xs"
                  >
                    <option value="/products">All Sarees Catalog (/products)</option>
                    <option value="/products?filter=new-arrivals">New Arrivals (/products?filter=new-arrivals)</option>
                    <option value="/products?filter=bestsellers">Best Sellers (/products?filter=bestsellers)</option>
                    <option value="/products?filter=featured">Featured Sarees (/products?filter=featured)</option>
                    <option value="/about">About Flourish (/about)</option>
                    <option value="/contact">Contact & Concierge (/contact)</option>
                    <option value="">-- No Link (Showcase Display Only) --</option>
                  </select>
                </div>
              )}

              {/* 3. Custom URL Input */}
              {selectedDestinationType === 'custom' && (
                <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0F172A]">
                    Custom Path or External Link:
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. /products?fabric=silk or https://..."
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                  />
                  <p className="text-[10px] text-[#64748B]">
                    Enter an internal store route (starting with /) or an external link (https://...).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Display Order & Active Toggle */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#F1F5F9]">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-1">
                Display Order
              </label>
              <Input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                id="is_active_toggle"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#0284C7] rounded border-slate-300 focus:ring-[#0284C7]"
              />
              <label htmlFor="is_active_toggle" className="text-xs font-medium text-[#0F172A] select-none cursor-pointer">
                Active on Homepage
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#EAE3D2]">
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
              className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60"
            >
              {editingBanner ? 'Save Changes' : 'Create Promo Banner'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemType="promotional banner"
        itemName={deleteTarget?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
}
