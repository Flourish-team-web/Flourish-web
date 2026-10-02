'use client';

import * as React from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { EditorialContent } from '@/types/store.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { slugify } from '@/lib/utils/formatters';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export default function AdminEditorialPage() {
  const [editorials, setEditorials] = React.useState<EditorialContent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<EditorialContent | null>(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [coverImageUrl, setCoverImageUrl] = React.useState('');
  const [readTime, setReadTime] = React.useState('4 min read');
  const [isPublished, setIsPublished] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fetchEditorials = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('editorial_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setEditorials(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchEditorials();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setExcerpt('');
    setContent('');
    setCoverImageUrl('');
    setReadTime('4 min read');
    setIsPublished(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: EditorialContent) => {
    setEditingArticle(article);
    setTitle(article.title);
    setSlug(article.slug);
    setSubtitle(article.subtitle || '');
    setExcerpt(article.excerpt || '');
    setContent(article.content);
    setCoverImageUrl(article.cover_image_url || '');
    setReadTime(article.read_time || '4 min read');
    setIsPublished(article.is_published);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setErrorMessage('Title, slug, and content are required.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      subtitle: subtitle.trim() || null,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image_url: coverImageUrl || null,
      read_time: readTime.trim() || '4 min read',
      is_published: isPublished,
    };

    try {
      if (editingArticle) {
        const { error } = await (supabase.from('editorial_content') as any)
          .update(payload)
          .eq('id', editingArticle.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('editorial_content') as any).insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchEditorials();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save editorial article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from('editorial_content').delete().eq('id', id);
    if (!error) {
      setEditorials(editorials.filter((a) => a.id !== id));
    } else {
      alert('Error deleting editorial: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D2] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1816]">Editorial & Weave Stories</h1>
          <p className="text-xs text-[#706B64] font-sans mt-0.5">
            Publish heritage textile essays, master weaver chronicles, and bridal guides.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreateModal}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Write Story</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
          <p className="text-xs uppercase tracking-widest text-[#706B64]">Loading editorials...</p>
        </div>
      ) : editorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editorials.map((story) => (
            <div
              key={story.id}
              className="bg-[#FDFBF7] border border-[#EAE3D2] overflow-hidden flex flex-col justify-between shadow-xs"
            >
              <div className="relative aspect-[16/9] w-full bg-[#EAE3D2]">
                <Image
                  src={story.cover_image_url || '/images/placeholder-saree.svg'}
                  alt={story.title}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  {story.is_published ? (
                    <span className="px-2 py-0.5 text-[9px] bg-[#EDF5F0] text-[#1B4332] font-semibold border border-[#BFDCCE]">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] bg-gray-100 text-gray-600 font-semibold border border-gray-300">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] text-[#C5A059] uppercase tracking-wider font-medium">
                  {story.read_time || '4 min read'}
                </span>
                <h3 className="font-serif text-base text-[#1A1816] font-medium line-clamp-2">
                  {story.title}
                </h3>
                {story.excerpt && (
                  <p className="text-xs text-[#706B64] font-light line-clamp-2">{story.excerpt}</p>
                )}
              </div>

              <div className="p-3 border-t border-[#EAE3D2] flex items-center justify-between bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8F8A80]">
                  /{story.slug}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(story)}
                    className="p-1.5 text-[#3D3833] hover:text-[#C5A059] transition-colors cursor-pointer"
                    title="Edit Story"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id, story.title)}
                    className="p-1.5 text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Story"
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
          <p className="font-serif text-lg text-[#1A1816] mb-1">No Editorial Stories Yet</p>
          <p className="text-xs text-[#706B64] font-light mb-4">
            Share articles celebrating handloom artistry and styling techniques.
          </p>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            Write First Story
          </Button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? 'Edit Editorial Story' : 'Write Editorial Story'}
        className="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Story Title *"
            required
            placeholder="e.g. The Sacred Korvai Technique of Kanchipuram"
            value={title}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
                  URL Slug *
                </label>
                {title && (
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="text-[10px] text-[#0284C7] hover:underline font-semibold cursor-pointer"
                  >
                    Auto-generate
                  </button>
                )}
              </div>
              <Input
                required
                placeholder="sacred-korvai-technique-kanchipuram"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
            <Input
              label="Estimated Read Time"
              placeholder="4 min read"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
            />
          </div>

          <Input
            label="Subtitle / Lead"
            placeholder="A look into the ancient interlocking warp and weft method..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#706B64]">
              Article Content *
            </label>
            <textarea
              rows={6}
              required
              placeholder="Write the full weave story or styling essay here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-2 text-xs text-[#1A1816] focus:border-[#1A1816] focus:outline-none"
            />
          </div>

          <MediaUploader
            value={coverImageUrl}
            onChange={(url) => setCoverImageUrl(url as string)}
            maxFiles={1}
            folder="flourish-woman/editorial"
            label="Cover Artwork Photo"
          />

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1A1816]">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="accent-[#1A1816]"
              />
              <span className="font-medium">Publish Live on Storefront</span>
            </label>
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
              Save Story
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
