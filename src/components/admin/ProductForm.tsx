'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProductWithDetails, Category } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MediaUploader } from './MediaUploader';
import { slugify, calculateDiscountPercentage } from '@/lib/utils/formatters';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Check,
  Package,
  Image as ImageIcon,
  Ruler,
  Eye,
  EyeOff,
  Tag,
  TrendingUp,
  Star,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface ProductFormProps {
  initialProduct?: ProductWithDetails | null;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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
  const [availability, setAvailability] = React.useState(initialProduct?.availability || 'in_stock');
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
      console.error('Error saving product:', err);
      setErrorMessage(err.message || 'Failed to save saree.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
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
                {isEditing ? 'Edit Handloom Product' : 'Add New Handloom Product'}
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

      {/* 1. Saree Information & Pricing */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
          <Package className="w-4 h-4 text-[#0284C7]" />
          <h2 className="font-serif text-base text-[#0F172A] font-medium">1. General Information & Pricing</h2>
        </div>

        {/* Saree Name */}
        <Input
          label="Saree Title / Product Name *"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Royal Sapphire Korvai Kanchipuram Silk Saree"
        />

        {/* URL Slug & SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
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
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="e.g. royal-sapphire-kanchipuram"
            />
          </div>

          <Input
            label="Product Code"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. FW-KAN-001"
          />
        </div>

        {/* Pricing & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
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
            label="Original / Compare Price (₹)"
            type="number"
            step="1"
            value={comparePrice}
            onChange={(e) => setComparePrice(e.target.value)}
            placeholder="24000"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
              Availability Status
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
            <span>Automatic discount badge: <strong>{discount}% OFF</strong> will be shown on the product card.</span>
          </div>
        )}

        {/* Category */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
            Weave Category
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
      </div>

      {/* 2. Textile & Handloom Specifications */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
          <Ruler className="w-4 h-4 text-[#0284C7]" />
          <h2 className="font-serif text-base text-[#0F172A] font-medium">2. Textile & Craft Specifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            label="Fabric / Fiber"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            placeholder="e.g. Pure Mulberry Silk"
          />

          <Input
            label="Weave Technique / Type"
            value={sareeType}
            onChange={(e) => setSareeType(e.target.value)}
            placeholder="e.g. Korvai Interlocking Zari"
          />

          <Input
            label="Color Palette"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Royal Blue & Pure Gold Zari"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            label="Occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. Bridal, Wedding, Festive"
          />

          <Input
            label="Saree Length / Dimensions"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            placeholder="e.g. 5.5 Meters"
          />

          <Input
            label="Blouse Details"
            value={blouseDetails}
            onChange={(e) => setBlouseDetails(e.target.value)}
            placeholder="e.g. 0.8m Included"
          />
        </div>

        <Input
          label="Wash & Storage Care"
          value={washCare}
          onChange={(e) => setWashCare(e.target.value)}
          placeholder="e.g. Dry Clean Only. Store in breathable muslin wrap."
        />
      </div>

      {/* 3. Photography */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#0284C7]" />
            <h2 className="font-serif text-base text-[#0F172A] font-medium">3. Saree Photography (Max 5 Photos)</h2>
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

      {/* 4. Description & Story */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
          <FileText className="w-4 h-4 text-[#0284C7]" />
          <h2 className="font-serif text-base text-[#0F172A] font-medium">4. Story & Descriptions</h2>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
            Short Summary
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief 1-2 line overview of the saree drape..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
            Full Craft Story & Weaver Details
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed handloom story, artisan background, motif details, and styling inspiration..."
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] focus:border-[#0284C7] focus:bg-white focus:outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* 5. Badges & Storefront Highlights */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
          <Tag className="w-4 h-4 text-[#0284C7]" />
          <h2 className="font-serif text-base text-[#0F172A] font-medium">5. Storefront Badges & Visibility</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {[
            { label: 'Published on Store', icon: Eye, state: isPublished, setState: setIsPublished, activeColor: 'text-emerald-600' },
            { label: 'New Arrival Badge', icon: Tag, state: isNewArrival, setState: setIsNewArrival, activeColor: 'text-[#0284C7]' },
            { label: 'Bestseller Badge', icon: TrendingUp, state: isBestseller, setState: setIsBestseller, activeColor: 'text-rose-500' },
            { label: 'Featured Highlight', icon: Star, state: isFeatured, setState: setIsFeatured, activeColor: 'text-amber-500' },
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
