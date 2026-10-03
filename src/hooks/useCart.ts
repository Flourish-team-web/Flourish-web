'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/types/store.types';

const CART_STORAGE_KEY = 'flourish_woman_cart_v1';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    } finally {
      setIsLoaded(true);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          setCartItems(JSON.parse(e.newValue));
        } catch {}
      }
    };

    const handleCustomUpdate = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setCartItems(JSON.parse(stored));
        } else {
          setCartItems([]);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart_updated', handleCustomUpdate);
    };
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('cart_updated'));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  };

  const addToCart = (item: Omit<CartItem, 'addedAt' | 'quantity'>, quantity = 1) => {
    const existingIndex = cartItems.findIndex((i) => i.productId === item.productId);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        ...item,
        quantity,
        addedAt: new Date().toISOString(),
      };
      saveCart([newItem, ...cartItems]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    saveCart(cartItems.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    cartItems,
    isLoaded,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    totalPrice,
  };
}
