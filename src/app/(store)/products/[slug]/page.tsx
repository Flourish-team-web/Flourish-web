import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/services/productService';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ProductCarouselSection } from '@/components/home/ProductCarouselSection';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Saree Not Found — Flourish Woman',
    };
  }

  const primaryImage = product.images?.[0]?.image_url;

  return {
    title: product.meta_title || `${product.name} — Flourish Woman`,
    description: product.meta_description || product.short_description || `Exquisite handwoven ${product.name} crafted in pure ${product.fabric || 'silk'}.`,
    openGraph: {
      title: product.name,
      description: product.short_description || undefined,
      images: primaryImage ? [{ url: primaryImage }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related sarees from same category or general catalog
  let relatedResults = await getProducts({
    categorySlug: product.category?.slug,
    limit: 6,
  });

  let relatedProducts = relatedResults.data.filter((p) => p.id !== product.id && p.slug !== product.slug).slice(0, 4);

  if (relatedProducts.length === 0) {
    const generalResults = await getProducts({ limit: 6 });
    relatedProducts = generalResults.data.filter((p) => p.id !== product.id && p.slug !== product.slug).slice(0, 4);
  }

  // Schema.org Product Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img) => img.image_url) || [],
    description: product.description || product.short_description,
    sku: product.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Flourish Woman',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl">
          {/* Main Product Presentation (Proportionate split screen) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start mb-10 lg:mb-14">
            {/* Left: Compact Gallery Column */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-start lg:sticky lg:top-20">
              <ProductGallery
                images={product.images || []}
                productName={product.name}
              />
            </div>

            {/* Right: Info Column */}
            <div className="lg:col-span-6 xl:col-span-6">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Related Creations Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#E2E8F0]">
            <ProductCarouselSection
              eyebrow="Curated For You"
              title="You May Also Cherish"
              subtitle="More handpicked drapes crafted by master artisans"
              viewAllLink="/products"
              products={relatedProducts}
            />
          </div>
        )}
      </div>
    </>
  );
}
