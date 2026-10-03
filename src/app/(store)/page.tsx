import * as React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { ReelsSection } from '@/components/home/ReelsSection';
import { CollectionCircleList } from '@/components/home/CollectionCircleList';
import { EditorialSpotlight } from '@/components/home/EditorialSpotlight';
import { ProductCarouselSection } from '@/components/home/ProductCarouselSection';
import { BrandHeritage } from '@/components/home/BrandHeritage';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { getHeroBanners, getPromotionalBanners, getReels, getFeaturedTestimonials } from '@/services/bannerService';
import { getCategories } from '@/services/categoryService';
import { getFeaturedCollections } from '@/services/collectionService';
import { getNewArrivalProducts, getFeaturedProducts } from '@/services/productService';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [
    heroBanners,
    promotionalBanners,
    categories,
    newArrivals,
    featuredProducts,
    reels,
    testimonials,
  ] = await Promise.all([
    getHeroBanners(),
    getPromotionalBanners(),
    getCategories(),
    getNewArrivalProducts(10),
    getFeaturedProducts(10),
    getReels(),
    getFeaturedTestimonials(),
  ]);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: "Flourish Women's",
    description: "Authentic handwoven Indian sarees: Kanchipuram silk, Banarasi brocades, Soft Silk, and Organzas.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://flourishwoman.com',
    priceRange: '₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Direct WhatsApp Concierge Enquiry',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="flex flex-col">
        {/* 1. Full-bleed Hero Carousel */}
        <HeroBanner banners={heroBanners} />

        {/* 2. Flourish Reels — Real women, real stories */}
        <ReelsSection reels={reels} />

        {/* 3. Shop by Collection (circles) */}
        <CollectionCircleList categories={categories} />

        {/* 4. The Flourish Edit (3-column promotional banners - showcase without redirects) */}
        <EditorialSpotlight banners={promotionalBanners} />

        {/* 5. New Arrivals */}
        <ProductCarouselSection
          eyebrow="Fresh Off The Loom"
          title="New Arrivals"
          subtitle="The latest handpicked creations from master weavers across India"
          viewAllLink="/products?sort=newest"
          products={newArrivals}
        />

        {/* 6. Featured Masterpieces */}
        {featuredProducts.length > 0 && (
          <ProductCarouselSection
            eyebrow="Signature Drapes"
            title="Curated Favorites"
            subtitle="Timeless classics chosen by our styling team"
            viewAllLink="/products?sort=featured"
            products={featuredProducts}
          />
        )}

        {/* 7. Brand Heritage & Master Weaver Ethos */}
        <BrandHeritage />

        {/* 8. Patron Voices / Testimonials */}
        <TestimonialsSection testimonials={testimonials} />
      </div>
    </>
  );
}
