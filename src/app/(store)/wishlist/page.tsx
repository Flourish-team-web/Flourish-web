'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/hooks/useWishlist';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrencyINR } from '@/lib/utils/formatters';
import { Trash2, MessageCircle, Heart, ArrowRight, Layers } from 'lucide-react';
import { buildProductWhatsAppUrl, buildBespokeWhatsAppUrl } from '@/lib/whatsapp/urlBuilder';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, isLoaded } = useWishlist();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xs uppercase tracking-widest text-[#64748B]">Loading your wishlist...</p>
      </div>
    );
  }

  const handleInquireAll = () => {
    const itemNames = wishlist.map((item) => item.name).join(', ');
    const note = `I would like to inquire about the availability of the following wishlist sarees: ${itemNames}`;
    const url = buildBespokeWhatsAppUrl('919876543210', note);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-24 py-8 md:py-14 bg-white">
      <div className="flex items-center gap-2 text-xs text-[#64748B] uppercase tracking-wider font-light mb-3">
        <Link href="/" className="hover:text-[#0F172A] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[#0284C7] font-semibold">Wishlist</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E2E8F0] pb-6 mb-8 gap-4">
        <div>
          <p className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#0284C7] font-bold mb-1">
            Saved Pieces
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0F172A] tracking-tight font-normal">
            Your Flourish Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={clearWishlist}
              className="text-[#E11D48] border-[#FECDD3] hover:bg-[#FFF1F2]"
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInquireAll}
              className="bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8] flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Inquire All on WhatsApp</span>
            </Button>
          </div>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="group bg-white border border-[#E2E8F0] rounded-xl flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/products/${item.slug}`} className="relative aspect-[3/4] w-full bg-[#F1F5F9] block overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-106 transition-transform duration-500"
                />
              </Link>

              <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  {item.fabric && (
                    <p className="text-[10px] uppercase tracking-widest text-[#0284C7] font-bold">
                      {item.fabric}
                    </p>
                  )}
                  <Link href={`/products/${item.slug}`} className="block">
                    <h3 className="font-serif text-sm sm:text-base text-[#0F172A] hover:text-[#0284C7] transition-colors line-clamp-1 mt-0.5 font-medium">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-sans text-sm sm:text-base font-bold text-[#0F172A] mt-1">
                    {formatCurrencyINR(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
                  <a
                    href={buildProductWhatsAppUrl('919876543210', {
                      productName: item.name,
                      price: item.price,
                      productUrl: typeof window !== 'undefined' ? `${window.location.origin}/products/${item.slug}` : undefined,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#071324] hover:bg-[#0E2038] text-[#38BDF8] border border-[#38BDF8] py-2 px-3 text-[11px] uppercase tracking-wider font-semibold text-center flex items-center justify-center gap-1.5 transition-colors rounded"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enquire</span>
                  </a>

                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="p-2 text-[#64748B] hover:text-[#E11D48] hover:bg-[#FFF1F2] rounded transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Explore our handloom saree collections and tap the heart icon on any piece you wish to save or compare."
          actionText="Explore Sarees"
          actionHref="/products"
          icon={<Heart className="w-5 h-5" />}
        />
      )}
    </div>
  );
}
