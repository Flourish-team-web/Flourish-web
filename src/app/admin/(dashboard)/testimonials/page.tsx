'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import { Testimonial } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { Plus, Edit2, Trash2, Star, Loader2, AlertCircle } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTestimonial, setEditingTestimonial] = React.useState<Testimonial[] | any>(null);

  // Form State
  const [clientName, setClientName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [content, setContent] = React.useState('');
  const [sareeWorn, setSareeWorn] = React.useState('');
  const [rating, setRating] = React.useState('5');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [isFeatured, setIsFeatured] = React.useState(true);
  const [displayOrder, setDisplayOrder] = React.useState('0');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) setTestimonials(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setClientName('');
    setLocation('');
    setContent('');
    setSareeWorn('');
    setRating('5');
    setAvatarUrl('');
    setIsFeatured(true);
    setDisplayOrder('0');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setClientName(t.client_name);
    setLocation(t.location || '');
    setContent(t.content);
    setSareeWorn(t.saree_worn || '');
    setRating(t.rating.toString());
    setAvatarUrl(t.avatar_url || '');
    setIsFeatured(t.is_featured);
    setDisplayOrder(t.display_order.toString());
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !content.trim()) {
      setErrorMessage('Client name and review content are required.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      client_name: clientName.trim(),
      location: location.trim() || null,
      content: content.trim(),
      saree_worn: sareeWorn.trim() || null,
      rating: parseInt(rating, 10) || 5,
      avatar_url: avatarUrl || null,
      is_featured: isFeatured,
      display_order: parseInt(displayOrder, 10) || 0,
    };

    try {
      if (editingTestimonial) {
        const { error } = await (supabase.from('testimonials') as any)
          .update(payload)
          .eq('id', editingTestimonial.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('testimonials') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete review from "${name}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } else {
      alert('Error deleting testimonial: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1816]">Patron Testimonials</h1>
          <p className="text-xs text-[#706B64] font-sans mt-0.5">
            Manage authentic bridal and customer reviews displayed on the storefront.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest text-[#706B64]">Loading reviews...</p>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#FDFBF7] border border-[#EAE3D2] p-5 flex flex-col justify-between shadow-xs space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-[#C5A059]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  {t.is_featured && (
                    <span className="text-[9px] bg-[#FAF3E5] text-[#9A7428] px-2 py-0.5 uppercase tracking-wider font-semibold border border-[#E8D4A8]">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#3D3833] font-light italic leading-relaxed line-clamp-4 mb-3">
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="border-t border-[#EAE3D2]/60 pt-3">
                  <h4 className="font-serif text-sm text-[#1A1816] font-medium">{t.client_name}</h4>
                  {t.location && <p className="text-[11px] text-[#706B64]">{t.location}</p>}
                  {t.saree_worn && (
                    <p className="text-[10px] text-[#C5A059] uppercase tracking-wider font-medium mt-0.5">
                      {t.saree_worn}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-[#EAE3D2] pt-2 flex items-center justify-between text-[11px] text-[#8F8A80]">
                <span>Order #{t.display_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1 text-[#3D3833] hover:text-[#C5A059] transition-colors cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id, t.client_name)}
                    className="p-1 text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Review"
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
          <p className="font-serif text-lg text-[#1A1816] mb-1">No Testimonials Found</p>
          <p className="text-xs text-[#706B64] font-light mb-4">
            Add feedback from brides and patrons who cherished their Flourish Woman sarees.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            Add First Testimonial
          </Button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Patron Testimonial'}
        className="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Patron Name *"
              required
              placeholder="e.g. Shalini Sundaram"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <Input
              label="Location / City"
              placeholder="e.g. Bangalore / London"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Saree Worn / Occasion"
              placeholder="e.g. Muhurtham Crimson Kanchipuram"
              value={sareeWorn}
              onChange={(e) => setSareeWorn(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
                Rating (1–5)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                <option value="3">⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
              Testimonial Content *
            </label>
            <textarea
              rows={4}
              required
              placeholder="The luster of the silk and the intricate temple border made my wedding drape so memorable..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
            />
          </div>

          <MediaUploader
            value={avatarUrl}
            onChange={(url) => setAvatarUrl(url as string)}
            maxFiles={1}
            folder="flourish-woman/testimonials"
            label="Patron Photo (Optional)"
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
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-[#1A1816]"
                />
                <span>Featured on Home</span>
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
              Save Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
