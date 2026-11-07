'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProductWithDetails, Category } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MediaUploader } from './MediaUploader';
import { SmartAutoFillBox, AutoFillPayload } from './SmartAutoFillBox';
import { slugify, calculateDiscountPercentage } from '@/lib/utils/formatters';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Check,
  Package,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Tag,
  TrendingUp,
  Star,
  CopyX,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { AdminToast, ToastProps } from '@/components/admin/AdminToast';

interface ProductFormProps {
  initialProduct?: ProductWithDetails | null;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<Omit<ToastProps, 'onClose'> | null>(null);
  const [duplicateField, setDuplicateField] = React.useState<'slug' | 'sku' | null>(null);
  const slugInputRef = React.useRef<HTMLInputElement>(null);
  const skuInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = React.useState(initialProduct?.name || '');
  const [slug, setSlug] = React.useState(initialProduct?.slug || '');
  const [sku, setSku] = React.useState(initialProduct?.sku || '');
  const [price, setPrice] = React.useState(initialProduct?.price?.toString() || '');
  const [comparePrice, setComparePrice] = React.useState(initialProduct?.compare_price?.toString() || '');
  const [categoryId, setCategoryId] = React.useState(initialProduct?.category_id || '');

  // Textile Specs
  const [fabric, setFabric] = React.useState(initialProduct?.fabric || '');
  const [sareeType, setSareeType] = React.useState(initialProduct?.saree_type || '');
  const [color, setColor] = React.useState(initialProduct?.color || '');
  const [occasion, setOccasion] = React.useState(initialProduct?.occasion || '');
  const [dimensions, setDimensions] = React.useState(initialProduct?.dimensions || '5.5 Meters Saree Length');
  const [blouseDetails, setBlouseDetails] = React.useState(initialProduct?.blouse_details || '0.8 Meter Running Blouse Piece Included');
  const [washCare, setWashCare] = React.useState(initialProduct?.wash_care || 'Dry Clean Only. Store in Muslin Wrap');
  
  // Content & Media
  const [shortDescription, setShortDescription] = React.useState(initialProduct?.short_description || '');
  const [description, setDescription] = React.useState(initialProduct?.description || '');
  const [images, setImages] = React.useState<string[]>(
    initialProduct?.images?.map((img) => img.image_url) || []
  );

  // Status & Badges
  const [availability, setAvailability] = React.useState<'in_stock' | 'out_of_stock' | 'made_to_order'>(
    (initialProduct?.availability as any) || 'in_stock'
  );
  const [isPublished, setIsPublished] = React.useState(initialProduct ? initialProduct.is_published : true);
  const [isFeatured, setIsFeatured] = React.useState(initialProduct ? initialProduct.is_featured : false);
  const [isNewArrival, setIsNewArrival] = React.useState(initialProduct ? initialProduct.is_new_arrival : true);
  const [isBestseller, setIsBestseller] = React.useState(initialProduct ? initialProduct.is_bestseller : false);

  React.useEffect(() => {
    const fetchRelations = async () => {
      const supabase = createClient();
      const { data: cats } = await supabase.from('categories').select('*').eq('is_active', true).order('name');
      if (cats) setCategories(cats);
    };
    fetchRelations();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
    if (duplicateField === 'slug') setDuplicateField(null);
  };

  const handleAutoFill = (data: AutoFillPayload) => {
    setErrorMessage(null);
    setToast(null);
    setDuplicateField(null);
    if (data.name !== undefined) setName(data.name);
    if (data.slug !== undefined) setSlug(data.slug);
    if (data.sku !== undefined) setSku(data.sku);
    if (data.price !== undefined) setPrice(data.price);
    if (data.comparePrice !== undefined) setComparePrice(data.comparePrice);
    if (data.categoryId !== undefined) setCategoryId(data.categoryId);
    if (data.fabric !== undefined) setFabric(data.fabric);
    if (data.sareeType !== undefined) setSareeType(data.sareeType);
    if (data.color !== undefined) setColor(data.color);
    if (data.occasion !== undefined) setOccasion(data.occasion);
    if (data.dimensions !== undefined) setDimensions(data.dimensions);
    if (data.blouseDetails !== undefined) setBlouseDetails(data.blouseDetails);
    if (data.washCare !== undefined) setWashCare(data.washCare);
    if (data.shortDescription !== undefined) setShortDescription(data.shortDescription);
    if (data.description !== undefined) setDescription(data.description);
    if (data.availability !== undefined) setAvailability(data.availability);
    if (data.isPublished !== undefined) setIsPublished(data.isPublished);
    if (data.isFeatured !== undefined) setIsFeatured(data.isFeatured);
    if (data.isNewArrival !== undefined) setIsNewArrival(data.isNewArrival);
    if (data.isBestseller !== undefined) setIsBestseller(data.isBestseller);
    if (data.images && data.images.length > 0) setImages(data.images);
  };

  const discount = calculateDiscountPercentage(parseFloat(price) || 0, parseFloat(comparePrice) || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !price || !slug.trim()) {
      setErrorMessage('Please fill in Saree Name, URL Slug, and Selling Price.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload at least 1 photo for this saree.');
      return;
    }

    if (images.length > 5) {
      setErrorMessage('Maximum 5 images allowed per product.');
      return;
    }

    setErrorMessage(null);
    setToast(null);
    setDuplicateField(null);
    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const productPayload = {
        name: name.trim(),
        slug: slugify(slug),
        sku: sku.trim() || null,
        price: parseFloat(price),
        compare_price: comparePrice ? parseFloat(comparePrice) : null,
        category_id: categoryId || null,
        collection_id: initialProduct?.collection_id || null,
        fabric: fabric.trim() || null,
        saree_type: sareeType.trim() || null,
        color: color.trim() || null,
        occasion: occasion.trim() || null,
        blouse_details: blouseDetails.trim() || null,
        dimensions: dimensions.trim() || null,
        wash_care: washCare.trim() || null,
        short_description: shortDescription.trim() || null,
        description: description.trim() || null,
        availability,
        is_published: isPublished,
        is_featured: isFeatured,
        is_new_arrival: isNewArrival,
        is_bestseller: isBestseller,
      };

      let productId = initialProduct?.id;

      if (isEditing && productId) {
        const { error: updateError } = await (supabase.from('products') as any)
          .update(productPayload)
          .eq('id', productId);

        if (updateError) throw updateError;
        await supabase.from('product_images').delete().eq('product_id', productId);
      } else {
        const { data: newProd, error: insertError } = await (supabase.from('products') as any)
          .insert(productPayload)
          .select('id')
          .single();

        if (insertError) throw insertError;
        productId = newProd.id;
      }

      const imageInserts = images.slice(0, 5).map((url, idx) => ({
        product_id: productId!,
        image_url: url,
        display_order: idx,
        is_primary: idx === 0,
      }));

      const { error: imageError } = await (supabase.from('product_images') as any).insert(imageInserts);
      if (imageError) throw imageError;

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      // Use console.warn instead of console.error so Next.js Turbopack dev server error overlay does NOT interrupt admin interaction
      console.warn('[ProductForm] Product save notice:', err?.message || err);

      const errCode = String(err?.code || '');
      const errMsg = String(err?.message || '');
      const errDetails = String(err?.details || '');
      const fullErrStr = `${errCode} ${errMsg} ${errDetails}`.toLowerCase();

      const isDuplicate =
        errCode === '23505' ||
        fullErrStr.includes('duplicate') ||
        fullErrStr.includes('already exists') ||
        fullErrStr.includes('unique constraint');

      if (isDuplicate) {
        if (fullErrStr.includes('sku')) {
          setDuplicateField('sku');
          const msg = `A saree with SKU code "${sku}" already exists in the catalog. Please enter a different SKU code.`;
          setErrorMessage(msg);
          setToast({
            type: 'warning',
            title: 'Duplicate Saree SKU Detected',
            message: msg,
          });
          setTimeout(() => {
            skuInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            skuInputRef.current?.focus();
          }, 100);
        } else {
          setDuplicateField('slug');
          const targetSlug = slug || slugify(name);
          const msg = `A saree with the slug "${targetSlug}" already exists in the catalog. Please change the slug or click "Auto-Fix Slug".`;
          setErrorMessage(msg);
          setToast({
            type: 'warning',
            title: 'Duplicate Saree Slug Detected',
            message: msg,
            action: {
              label: 'Auto-Fix: Add Unique Suffix',
              onClick: () => {
                const suffix = Math.floor(100 + Math.random() * 900);
                setSlug((prev) => `${prev.replace(/-\d{3,4}$/, '')}-${suffix}`);
                setDuplicateField(null);
                setErrorMessage(null);
                setToast(null);
                setTimeout(() => {
                  slugInputRef.current?.focus();
                }, 50);
              },
            },
          });
          setTimeout(() => {
            slugInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            slugInputRef.current?.focus();
          }, 100);
        }
      } else {
        const fallbackMsg = errMsg || errDetails || 'Failed to save saree. Please check your inputs and try again.';
        setErrorMessage(fallbackMsg);
        setToast({
          type: 'error',
          title: 'Failed to Save Saree',
          message: fallbackMsg,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16 relative">
      {/* Floating Admin Toast for Duplicates & Notifications */}
      {toast && (
        <AdminToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          action={toast.action}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-xs sticky top-20 z-30 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:border-[#CBD5E1] transition-all"
            title="Back to Products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Package className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="text-[10px] uppercase tracking-widest text-[#0284C7] font-bold">
                {isEditing ? 'Edit Handloom Saree' : 'Add New Handloom Saree'}
              </span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl text-[#0F172A] font-medium truncate max-w-md">
              {name.trim() ? name : 'New Saree Entry'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Status Toggle */}
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
              isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]'
            )}
          >
            {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isPublished ? 'Published' : 'Draft'}</span>
          </button>

          <Link href="/admin/products">
            <Button variant="outline" size="sm" type="button">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-1.5 shadow-sm"
            isLoading={isSubmitting}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Changes' : 'Publish Saree'}</span>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5 rounded-2xl animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* 1. Smart Copy-Paste Auto-Fill Box */}
      <SmartAutoFillBox categories={categories} onAutoFill={handleAutoFill} />

      {/* 2. Saree Photography (Separate Dedicated Image Uploading Section) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div>
              <h2 className="font-serif text-base text-[#0F172A] font-medium">Saree Photography (Max 5 Photos)</h2>
            </div>
          </div>
          <span className={cn(
            'text-[11px] font-semibold px-2.5 py-1 rounded-xl border',
            images.length > 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
          )}>
            {images.length} / 5 uploaded
          </span>
        </div>
        <p className="text-xs text-[#64748B]">
          Upload clean portrait saree images (3:4 ratio). The first photo is automatically used as the cover on the storefront.
        </p>
        <MediaUploader
          value={images}
          onChange={(urls) => setImages(urls as string[])}
          maxFiles={5}
          folder="flourish-woman/products"
        />
      </div>

      {/* 3. Single Unified Saree Details & Handloom Specifications Form */}
      {/* Fields strictly mirror the format in "COPY BLANK FORMAT" */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 space-y-6 shadow-xs">
        <div className="border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-[#0284C7]" />
            </div>
            <div>
              <h2 className="font-serif text-base text-[#0F172A] font-medium">Saree Details & Handloom Specifications</h2>
              <p className="text-[11px] text-[#64748B]">
                All product information in one continuous form matching the copy-paste template.
              </p>
            </div>
          </div>
        </div>

        {/* 1. PRODUCT NAME */}
        <Input
          label="Product Name / Saree Title *"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Flourish Royal Kanchipuram Pure Silk Saree"
        />

        {/* 2. PRODUCT SLUG & 3. SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                Product Slug *
              </label>
              <div className="flex items-center gap-2">
                {duplicateField === 'slug' && (
                  <button
                    type="button"
                    onClick={() => {
                      const suffix = Math.floor(100 + Math.random() * 900);
                      setSlug((prev) => `${prev.replace(/-\d{3,4}$/, '')}-${suffix}`);
                      setDuplicateField(null);
                      setErrorMessage(null);
                      setToast(null);
                    }}
                    className="text-[10px] bg-amber-500/10 text-amber-600 border border-amber-300 px-2 py-0.5 rounded-md hover:bg-amber-500/20 font-bold transition-all cursor-pointer"
                  >
                    + Auto-Fix Slug
                  </button>
                )}
                {name && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(slugify(name));
                      if (duplicateField === 'slug') setDuplicateField(null);
                    }}
                    className="text-[10px] text-[#0284C7] hover:underline font-semibold cursor-pointer"
                  >
                    Auto-generate
                  </button>
                )}
              </div>
            </div>
            <Input
              ref={slugInputRef}
              required
              value={slug}
              error={duplicateField === 'slug' ? `Slug "${slug}" already exists. Please make it unique.` : undefined}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                if (duplicateField === 'slug') setDuplicateField(null);
              }}
              placeholder="e.g. flourish-royal-kanchipuram-pure-silk-saree"
            />
          </div>

          <Input
            ref={skuInputRef}
            label="SKU / Product Code"
            value={sku}
            error={duplicateField === 'sku' ? `SKU "${sku}" already exists. Please assign a unique code.` : undefined}
            onChange={(e) => {
              setSku(e.target.value);
              if (duplicateField === 'sku') setDuplicateField(null);
            }}
            placeholder="e.g. FW-KNC-001"
          />
        </div>

        {/* 4. CATEGORY, 5. SELLING PRICE, 6. COMPARE PRICE, 7. AVAILABILITY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="">— Select Category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Selling Price (₹) *"
            type="number"
            step="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="18500"
          />

          <Input
            label="Compare Price (₹)"
            type="number"
            step="1"
            value={comparePrice}
            onChange={(e) => setComparePrice(e.target.value)}
            placeholder="24000"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all cursor-pointer font-medium"
            >
              <option value="in_stock">In Stock (Ready to Dispatch)</option>
              <option value="made_to_order">Made to Order</option>
              <option value="out_of_stock">Sold Out</option>
            </select>
          </div>
        </div>

        {discount && discount > 0 && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Automatic discount badge: <strong>{discount}% OFF</strong> will be shown on the storefront card.</span>
          </div>
        )}

        {/* 8. FABRIC, 9. SAREE TYPE, 10. COLOR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <Input
            label="Fabric / Fiber"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            placeholder="e.g. Pure Mulberry Silk"
          />

          <Input
            label="Saree Type / Weave"
            value={sareeType}
            onChange={(e) => setSareeType(e.target.value)}
            placeholder="e.g. Traditional Korvai Handloom Zari"
          />

          <Input
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Royal Blue & Pure Gold Zari"
          />
        </div>

        {/* 11. OCCASION, 12. DIMENSIONS, 13. BLOUSE DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Bridal, Wedding & Festive"
          />

          <Input
            label="Dimensions / Length"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="e.g. 5.5 Meters Saree Length"
          />

          <Input
            label="Blouse Details"
            value={blouseDetails}
            onChange={(e) => setBlouseDetails(e.target.value)}
            placeholder="e.g. 0.8 Meter Running Blouse Piece Included"
          />
        </div>

        {/* 14. WASH CARE */}
        <Input
          label="Wash Care"
          value={washCare}
          onChange={(e) => setWashCare(e.target.value)}
          placeholder="e.g. Dry Clean Only. Store in Muslin Wrap"
        />

        {/* 15. SHORT DESCRIPTION */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
            Short Description
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief 1-2 line overview of the saree drape..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all resize-none font-medium"
          />
        </div>

        {/* 16. PRODUCT DESCRIPTION */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
            Product Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed handloom story, artisan craftsmanship, motif details, and styling inspiration..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all resize-none font-medium"
          />
        </div>

        {/* 17. PUBLISHED, 18. NEW ARRIVAL, 19. BESTSELLER, 20. FEATURED */}
        <div className="pt-2 border-t border-[#F1F5F9]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A] mb-3">
            Storefront Badges & Visibility
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Published (Live)', icon: Eye, state: isPublished, setState: setIsPublished, activeColor: 'text-emerald-600' },
              { label: 'New Arrival', icon: Tag, state: isNewArrival, setState: setIsNewArrival, activeColor: 'text-[#0284C7]' },
              { label: 'Bestseller', icon: TrendingUp, state: isBestseller, setState: setIsBestseller, activeColor: 'text-rose-500' },
              { label: 'Featured', icon: Star, state: isFeatured, setState: setIsFeatured, activeColor: 'text-amber-500' },
            ].map(({ label, icon: Icon, state, setState, activeColor }) => (
              <label
                key={label}
                className={cn(
                  'flex items-center gap-3 text-xs p-3 rounded-xl border transition-all cursor-pointer select-none',
                  state
                    ? 'bg-[#F0F9FF] border-[#0284C7]/40 text-[#0F172A] font-semibold shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                )}
              >
                <div className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  state ? 'bg-[#0284C7] border-[#0284C7]' : 'bg-white border-[#CBD5E1]'
                )}>
                  {state && <Check className="w-3 h-3 text-white stroke-[2.5]" />}
                </div>
                <input
                  type="checkbox"
                  checked={state}
                  onChange={(e) => setState(e.target.checked)}
                  className="sr-only"
                />
                <Icon className={cn('w-4 h-4 shrink-0', state ? activeColor : 'text-[#94A3B8]')} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-sm">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" type="button">
            Cancel
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] flex items-center gap-2 px-6 py-2.5 shadow-md"
            isLoading={isSubmitting}
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Saree Changes' : 'Publish New Saree'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
