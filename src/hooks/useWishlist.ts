'use client';

import { useState, useEffect } from 'react';
import { WishlistItem } from '@/types/store.types';

const WISHLIST_STORAGE_KEY = 'flourish_woman_wishlist_v1';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading wishlist from storage', e);
    } finally {
      setIsLoaded(true);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
        try {
          setWishlist(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveWishlist = (items: WishlistItem[]) => {
    setWishlist(items);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      // Dispatch custom event for cross-component sync
      window.dispatchEvent(new Event('wishlist_updated'));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    if (isInWishlist(item.productId)) {
      const updated = wishlist.filter((i) => i.productId !== item.productId);
      saveWishlist(updated);
    } else {
      const newItem: WishlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };
      saveWishlist([newItem, ...wishlist]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    saveWishlist(wishlist.filter((i) => i.productId !== productId));
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  return {
    wishlist,
    isLoaded,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    count: wishlist.length,
  };
}
