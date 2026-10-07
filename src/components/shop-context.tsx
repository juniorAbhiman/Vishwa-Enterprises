'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product, ProductVariant } from '../lib/api';

export type CartLine = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, variant: ProductVariant, quantity?: number) => void;
  setQuantity: (variantId: string | number, quantity: number) => void;
  remove: (variantId: string | number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'vishwa-cart-v1';

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved) as CartLine[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      add: (product, variant, quantity = 1) =>
        setLines((current) => {
          const found = current.find((line) => line.variant.id === variant.id);
          if (found) {
            return current.map((line) =>
              line.variant.id === variant.id
                ? { ...line, quantity: Math.min(variant.stock, line.quantity + quantity) }
                : line
            );
          }
          return [...current, { product, variant, quantity: Math.min(variant.stock, quantity) }];
        }),
      setQuantity: (variantId, quantity) =>
        setLines((current) =>
          quantity <= 0
            ? current.filter((line) => line.variant.id !== variantId)
            : current.map((line) =>
                line.variant.id === variantId
                  ? { ...line, quantity: Math.min(line.variant.stock, quantity) }
                  : line
              )
        ),
      remove: (variantId) =>
        setLines((current) => current.filter((line) => line.variant.id !== variantId)),
      clear: () => setLines([]),
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: lines.reduce((sum, line) => sum + line.variant.price * line.quantity, 0),
    }),
    [lines]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useShopCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useShopCart must be used inside ShopProvider');
  return context;
}