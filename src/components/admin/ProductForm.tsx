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
  Shirt,
  Banknote,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { AdminToast, ToastProps } from '@/components/admin/AdminToast';
import { STANDARD_SIZES, parseProductSizes, formatSizesToDimensions } from '@/lib/utils/productSizes';
import { isProductCodAvailable, formatMetaDescriptionWithCod } from '@/lib/utils/productCod';

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

  // Textile Specs & Apparel Sizing
  const initialParsedSizes = React.useMemo(() => parseProductSizes(initialProduct?.dimensions), [initialProduct?.dimensions]);
  const initialHasSizes = initialParsedSizes.length > 0;
  const [hasSizes, setHasSizes] = React.useState(initialHasSizes);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>(
    initialHasSizes ? initialParsedSizes : ['S', 'M', 'L', 'XL', 'XXL']
  );
  const [customSizeInput, setCustomSizeInput] = React.useState('');

  const [fabric, setFabric] = React.useState(initialProduct?.fabric || '');
  const [sareeType, setSareeType] = React.useState(initialProduct?.saree_type || '');
  const [color, setColor] = React.useState(initialProduct?.color || '');
  const [occasion, setOccasion] = React.useState(initialProduct?.occasion || '');
  // If product already had sizes, initialize saree dimensions state to default saree drape length
  const [dimensions, setDimensions] = React.useState(
    initialHasSizes ? '5.5 Meters Saree Length' : (initialProduct?.dimensions || '5.5 Meters Saree Length')
  );
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
  // Cash on Delivery (COD) availability: Active by default (true), admin can deactivate (false)
  const [isCodAvailable, setIsCodAvailable] = React.useState<boolean>(isProductCodAvailable(initialProduct));

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

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const addCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes([...selectedSizes, trimmed]);
      setCustomSizeInput('');
    }
  };

  const handleToggleSizes = (enable: boolean) => {
    setHasSizes(enable);
    if (enable) {
      if (selectedSizes.length === 0) {
        setSelectedSizes(['S', 'M', 'L', 'XL', 'XXL']);
      }
    } else {
      // Deactivating sizes: reset dimensions and blouse details to standard saree drape specifications
      if (!dimensions || parseProductSizes(dimensions).length > 0) {
        setDimensions('5.5 Meters Saree Length');
      }
      if (!blouseDetails || blouseDetails.toLowerCase().includes('lining')) {
        setBlouseDetails('0.8 Meter Running Blouse Piece Included');
      }
    }
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
    if (data.dimensions !== undefined) {
      const parsed = parseProductSizes(data.dimensions);
      if (parsed.length > 0) {
        setHasSizes(true);
        setSelectedSizes(parsed);
      } else {
        setHasSizes(false);
        setDimensions(data.dimensions);
      }
    }
    if (data.blouseDetails !== undefined) setBlouseDetails(data.blouseDetails);
    if (data.washCare !== undefined) setWashCare(data.washCare);
    if (data.shortDescription !== undefined) setShortDescription(data.shortDescription);
    if (data.description !== undefined) setDescription(data.description);
    if (data.availability !== undefined) setAvailability(data.availability);
    if (data.isPublished !== undefined) setIsPublished(data.isPublished);
    if (data.isFeatured !== undefined) setIsFeatured(data.isFeatured);
    if (data.isNewArrival !== undefined) setIsNewArrival(data.isNewArrival);
    if (data.isBestseller !== undefined) setIsBestseller(data.isBestseller);
    if (data.isCodAvailable !== undefined) setIsCodAvailable(data.isCodAvailable);
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

    if (hasSizes && selectedSizes.length === 0) {
      setErrorMessage('Please choose at least one available size (e.g. S, M, L, XL, XXL) or disable size options.');
      return;
    }

    setErrorMessage(null);
    setToast(null);
    setDuplicateField(null);
    setIsSubmitting(true);
    const supabase = createClient();

    let finalDimensions: string | null = null;
    if (hasSizes) {
      finalDimensions = formatSizesToDimensions(selectedSizes);
    } else {
      const rawDim = dimensions.trim();
      // When sizes are deactivated, guarantee dimensions reverts to clean saree specs and does not retain "Sizes: ..."
      if (!rawDim || parseProductSizes(rawDim).length > 0) {
        finalDimensions = '5.5 Meters Saree Length';
      } else {
        finalDimensions = rawDim;
      }
    }

    try {
      const basePayload: any = {
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
        dimensions: finalDimensions,
        wash_care: washCare.trim() || null,
        short_description: shortDescription.trim() || null,
        description: description.trim() || null,
        availability,
        is_published: isPublished,
        is_featured: isFeatured,
        is_new_arrival: isNewArrival,
        is_bestseller: isBestseller,
        meta_description: formatMetaDescriptionWithCod(initialProduct?.meta_description, isCodAvailable),
      };

      const productPayload: any = {
        ...basePayload,
        is_cod_available: isCodAvailable,
      };

      let productId = initialProduct?.id;

      if (isEditing && productId) {
        let { error: updateError } = await (supabase.from('products') as any)
          .update(productPayload)
          .eq('id', productId);

        // Fallback: If remote database doesn't have is_cod_available column yet, retry with basePayload
        if (updateError) {
          const errStr = String(updateError.message || '').toLowerCase();
          if (errStr.includes('is_cod_available') || (errStr.includes('column') && errStr.includes('schema cache'))) {
            const retryRes = await (supabase.from('products') as any)
              .update(basePayload)
              .eq('id', productId);
            updateError = retryRes.error;
          }
        }

        if (updateError) throw updateError;
        await supabase.from('product_images').delete().eq('product_id', productId);
      } else {
        let { data: newProd, error: insertError } = await (supabase.from('products') as any)
          .insert(productPayload)
          .select('id')
          .single();

        // Fallback: If remote database doesn't have is_cod_available column yet, retry with basePayload
        if (insertError) {
          const errStr = String(insertError.message || '').toLowerCase();
          if (errStr.includes('is_cod_available') || (errStr.includes('column') && errStr.includes('schema cache'))) {
            const retryRes = await (supabase.from('products') as any)
              .insert(basePayload)
              .select('id')
              .single();
            insertError = retryRes.error;
            newProd = retryRes.data;
          }
        }

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

        {/* APPAREL SIZING & VARIETY OPTIONS (Active toggle for Kurtis, Gowns & Variety Dresses) */}
        <div className={cn(
          "p-4 sm:p-5 rounded-2xl border transition-all space-y-4",
          hasSizes
            ? "bg-[#F0F9FF]/90 border-[#38BDF8]/60 shadow-xs"
            : "bg-[#F8FAFC] border-[#E2E8F0]"
        )}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                hasSizes ? "bg-[#0284C7] text-white border-[#0284C7]" : "bg-white text-[#64748B] border-[#CBD5E1]"
              )}>
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Dress Sizing Options (Kurtis, Gowns, Salwars & Dresses)
                  </h3>
                  {hasSizes && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Active on Storefront
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {hasSizes
                    ? 'Size Selection Card is ACTIVE. Customers can choose their size (S, M, L, XL, XXL) on the product page.'
                    : 'Currently using standard Saree specifications (5.5m length & blouse piece). Turn ON for variety dresses requiring sizes.'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-center">
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={(e) => handleToggleSizes(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#CBD5E1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD5E1] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
              <span className="ml-2.5 text-xs font-bold text-[#0F172A] select-none">
                {hasSizes ? 'Sizes Active' : 'Enable Sizes'}
              </span>
            </label>
          </div>

          {/* When Enabled: Size Selection Pills & Controls */}
          {hasSizes && (
            <div className="pt-3 border-t border-[#BAE6FD]/60 space-y-3 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                  Select Available Sizes for this Dress *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSizes(['S', 'M', 'L', 'XL', 'XXL'])}
                    className="text-[10px] font-semibold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    Select S–XXL
                  </button>
                  <span className="text-[#CBD5E1]">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes([...STANDARD_SIZES])}
                    className="text-[10px] font-semibold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-[#CBD5E1]">•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes([])}
                    className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Standard Size Buttons */}
              <div className="flex flex-wrap gap-2">
                {STANDARD_SIZES.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border select-none",
                        isSelected
                          ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm scale-102"
                          : "bg-white text-[#475569] border-[#CBD5E1] hover:border-[#0F172A] hover:bg-[#F8FAFC]"
                      )}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>{size}</span>
                    </button>
                  );
                })}

                {/* Custom Sizes Added */}
                {selectedSizes
                  .filter((s) => !STANDARD_SIZES.includes(s as any))
                  .map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className="h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-[#0284C7] text-white border-[#0284C7] shadow-sm select-none"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{size}</span>
                    </button>
                  ))}
              </div>

              {/* Add Custom Size Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSize();
                    }
                  }}
                  placeholder="Add custom size (e.g. 36, 38, Petite)..."
                  className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#0284C7] focus:outline-none w-64"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomSize}
                  className="text-xs h-8 px-3"
                >
                  Add Size
                </Button>
              </div>

              {/* Preview Box */}
              <div className="p-2.5 rounded-xl bg-white border border-[#BAE6FD] text-xs text-[#0F172A] flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[#475569]">
                  Product Detail Page Card: <strong className="text-[#0F172A]">{selectedSizes.length > 0 ? selectedSizes.join(' · ') : '(No sizes selected)'}</strong>
                </span>
                <span className="text-[11px] font-semibold text-[#0284C7]">
                  {selectedSizes.length} {selectedSizes.length === 1 ? 'size' : 'sizes'} available
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 11. OCCASION, 12. DIMENSIONS/SIZING, 13. BLOUSE/LINING DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Bridal, Festive & Evening Wear"
          />

          {hasSizes ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                Dimensions / Sizing
              </label>
              <div className="w-full bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5 text-xs text-[#0284C7] font-semibold truncate flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Sizes: {selectedSizes.join(', ') || 'None'}</span>
              </div>
            </div>
          ) : (
            <Input
              label="Dimensions / Length"
              value={parseProductSizes(dimensions).length > 0 ? '5.5 Meters Saree Length' : dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 5.5 Meters Saree Length"
            />
          )}

          <Input
            label={hasSizes ? "Lining / Stitching Details (Optional)" : "Blouse Details"}
            value={blouseDetails}
            onChange={(e) => setBlouseDetails(e.target.value)}
            placeholder={hasSizes ? "e.g. Premium Cotton Lining Included" : "e.g. 0.8 Meter Running Blouse Piece Included"}
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

        {/* 21. CASH ON DELIVERY (COD) AVAILABILITY */}
        <div className="pt-3 border-t border-[#F1F5F9]">
          <div className={cn(
            "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
            isCodAvailable
              ? "bg-emerald-50/70 border-emerald-200 shadow-xs"
              : "bg-[#F8FAFC] border-[#E2E8F0]"
          )}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                isCodAvailable
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-[#64748B] border-[#CBD5E1]"
              )}>
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Cash on Delivery (COD) Available
                  </h4>
                  {isCodAvailable ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Active on Product Page
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
                      Deactivated (Hidden)
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {isCodAvailable
                    ? 'Default is Active. "Cash on Delivery Available" badge is visible to customers on the product page.'
                    : 'Deactivated. The COD badge is hidden from customers on the product detail page.'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
              <input
                type="checkbox"
                checked={isCodAvailable}
                onChange={(e) => setIsCodAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#CBD5E1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#CBD5E1] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2.5 text-xs font-bold text-[#0F172A] select-none">
                {isCodAvailable ? 'COD Active' : 'COD Deactivated'}
              </span>
            </label>
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
