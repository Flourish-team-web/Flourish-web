import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/store.types';

// Placeholder categories with Unsplash saree images
const PLACEHOLDER_CATEGORIES = [
  { id: 'c1', name: 'Kanchipuram Sarees', slug: 'kanchipuram', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop', description: null, display_order: 0, is_featured: true, created_at: '', updated_at: '' },
  { id: 'c2', name: 'Banarasi Sarees', slug: 'banarasi', image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop', description: null, display_order: 1, is_featured: true, created_at: '', updated_at: '' },
  { id: 'c3', name: 'Soft Silk', slug: 'soft-silk', image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop', description: null, display_order: 2, is_featured: true, created_at: '', updated_at: '' },
  { id: 'c4', name: 'Organza Sarees', slug: 'organza', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop&crop=top', description: null, display_order: 3, is_featured: true, created_at: '', updated_at: '' },
  { id: 'c5', name: 'Cotton Sarees', slug: 'cotton', image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop&crop=bottom', description: null, display_order: 4, is_featured: true, created_at: '', updated_at: '' },
  { id: 'c6', name: 'Festive Collection', slug: 'festive', image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop&crop=faces', description: null, display_order: 5, is_featured: true, created_at: '', updated_at: '' },
  { id: 'c7', name: 'Designer Sarees', slug: 'designer', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop&crop=entropy', description: null, display_order: 6, is_featured: true, created_at: '', updated_at: '' },
];

interface CollectionCircleListProps {
  categories: Category[];
}

export function CollectionCircleList({ categories }: CollectionCircleListProps) {
  const displayCategories = (categories && categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES) as typeof PLACEHOLDER_CATEGORIES;

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-[#E2E8F0] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        {/* Simple & Clean Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] font-normal tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Categories: Horizontal Scroll on Mobile, Centered & Aligned on Desktop */}
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center items-start gap-3 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-5xl mx-auto pb-2 pt-1 px-1 sm:px-0 scrollbar-none snap-x touch-pan-x min-w-0">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group shrink-0 flex flex-col items-center text-center w-[82px] sm:w-[100px] md:w-[120px] snap-start transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Circle Avatar with Ring & Subtle Hover Shadow */}
              <div className="relative w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-[3px] bg-gradient-to-tr from-[#E2E8F0] via-white to-[#BAE6FD] ring-1 ring-[#CBD5E1] group-hover:ring-2 group-hover:ring-[#0284C7] group-hover:shadow-xl transition-all duration-300">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F8FAFC]">
                  <Image
                    src={cat.image_url || '/images/placeholder-saree.svg'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 120px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="font-sans text-xs sm:text-sm text-[#0F172A] font-medium tracking-tight transition-colors mt-2.5 leading-snug group-hover:text-[#0284C7] line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
