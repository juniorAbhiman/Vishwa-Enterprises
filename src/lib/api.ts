'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Product = {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  mrp?: number;
  image?: string;
  images: string[];
  category?: string;
  badge?: string | null;
  rating?: number;
  description?: string;
  variants: ProductVariant[];
  [key: string]: unknown;
};

export type ProductVariant = {
  id: string | number;
  productId?: string | number;
  size: string;
  color?: string;
  price: number;
  mrp?: number;
  stock: number;
  sku?: string;
};



export type Category = {
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
  count?: string;
};

export type StorefrontSummary = {
  announcement?: string;
  categories?: Category[];
};

export type GetProductsParams = {
  search?: string;
  category?: string;
  sort: 'featured' | 'newest' | 'price_asc' | 'price_desc';
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export function useGetProducts(params: GetProductsParams) {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.category) qs.set('category', params.category);
  qs.set('sort', params.sort);
  const query = qs.toString();

  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiFetch<Product[]>(`/api/products?${query}`),
    placeholderData: (prev) => prev,
  });
}

export function useGetCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<Category[]>('/api/categories'),
  });
}

export function useGetStorefrontSummary() {
  return useQuery({
    queryKey: ['storefront-summary'],
    queryFn: () => apiFetch<StorefrontSummary>('/api/storefront/summary'),
  });
}

// ---------- Orders ----------

export type GetOrderParams = {
  orderNumber: string;
  email: string;
};

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export type OrderLine = {
  sku: string;
  productName: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  lines: OrderLine[];
  total: number;
  createdAt: string;
};

export function getGetOrderQueryKey(params: GetOrderParams) {
  return ['order', params.orderNumber, params.email] as const;
}

export function useGetOrder(params: GetOrderParams | null) {
  const orderNumber = params?.orderNumber ?? '';
  const email = params?.email ?? '';
  const enabled = Boolean(orderNumber && email);

  return useQuery({
    queryKey: getGetOrderQueryKey({ orderNumber, email }),
    queryFn: async () => {
      const qs = new URLSearchParams({ orderNumber, email });
      return apiFetch<Order>(`/api/orders/lookup?${qs.toString()}`);
    },
    enabled,
    retry: false,
  });
}

export type OrderInput = {
  customerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pinCode: string;
  note?: string | null;
  lines: { variantId: string | number; quantity: number }[];
};

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: { data: OrderInput }) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args.data),
      });
      if (!res.ok) {
        const message = await res.text().catch(() => '');
        throw new Error(message || `Order failed: ${res.status}`);
      }
      return (await res.json()) as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}


function variantsFor(
  basePrice: number,
  sizes = ['S', 'M', 'L', 'XL'],
  colors = ['Navy']
): ProductVariant[] {
  return sizes.flatMap((size, si) =>
    colors.map((color, ci) => ({
      id: `${size}-${color}`,
      size,
      color,
      price: basePrice,
      stock: 12 + si + ci * 3,
      sku: `VISH-${size}-${color.slice(0, 3).toUpperCase()}`,
    }))
  );
}

/** Uses picsum.photos with a fixed 3:4 crop so every card has the same ratio. */
function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/600/800`;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-01',
    name: 'Classic Printed Check Shirt',
    slug: 'classic-printed-check-shirt',
    price: 899,
    compareAtPrice: 1299,
    category: 'mens-shirts',
    badge: 'Bestseller',
    rating: 4.6,
    images: [img('shirt-01'), img('shirt-01b'), img('shirt-01c')],
    variants: variantsFor(899, ['S', 'M', 'L', 'XL'], ['Navy', 'Maroon']),
  },
  {
    id: 'p-02',
    name: 'Boxy Fit Cotton T-Shirt',
    slug: 'boxy-fit-cotton-tshirt',
    price: 599,
    compareAtPrice: 799,
    category: 't-shirts',
    badge: 'New',
    rating: 4.4,
    images: [img('tee-01'), img('tee-01b')],
    variants: variantsFor(599, ['S', 'M', 'L', 'XL'], ['White', 'Black']),
  },
  {
    id: 'p-03',
    name: 'Slim Fit Blue Denim Jeans',
    slug: 'slim-fit-blue-denim-jeans',
    price: 1499,
    compareAtPrice: 2199,
    category: 'jeans',
    badge: null,
    rating: 4.7,
    images: [img('jeans-01'), img('jeans-01b')],
    variants: variantsFor(1499, ['30', '32', '34', '36'], ['Indigo']),
  },
  {
    id: 'p-04',
    name: 'Everyday Terry Lounge Pant',
    slug: 'everyday-terry-lounge-pant',
    price: 799,
    compareAtPrice: 1099,
    category: 'trousers',
    badge: null,
    rating: 4.3,
    images: [img('pant-01'), img('pant-01b')],
    variants: variantsFor(799, ['S', 'M', 'L', 'XL'], ['Charcoal', 'Olive']),
  },
  {
    id: 'p-05',
    name: 'Anarkali Kurti with Print',
    slug: 'anarkali-kurti-print',
    price: 1099,
    compareAtPrice: 1599,
    category: 'kurtis',
    badge: 'Trending',
    rating: 4.8,
    images: [img('kurti-01'), img('kurti-01b')],
    variants: variantsFor(1099, ['S', 'M', 'L', 'XL'], ['Teal', 'Pink']),
  },
  {
    id: 'p-06',
    name: 'Relaxed Fit Tunic Top',
    slug: 'relaxed-fit-tunic-top',
    price: 749,
    compareAtPrice: 999,
    category: 'tops',
    badge: null,
    rating: 4.5,
    images: [img('top-01'), img('top-01b')],
    variants: variantsFor(749, ['S', 'M', 'L'], ['Mustard', 'Sky']),
  },
  {
    id: 'p-07',
    name: 'Floral Midi Dress',
    slug: 'floral-midi-dress',
    price: 1399,
    compareAtPrice: 1999,
    category: 'dresses',
    badge: 'New',
    rating: 4.6,
    images: [img('dress-01'), img('dress-01b')],
    variants: variantsFor(1399, ['S', 'M', 'L', 'XL'], ['Rose']),
  },
  {
    id: 'p-08',
    name: 'High-Rise Jegging',
    slug: 'high-rise-jegging',
    price: 899,
    compareAtPrice: 1199,
    category: 'jeggings',
    badge: null,
    rating: 4.4,
    images: [img('jegging-01'), img('jegging-01b')],
    variants: variantsFor(899, ['26', '28', '30', '32'], ['Black', 'Blue']),
  },
  {
    id: 'p-09',
    name: 'Handloom Cotton Saree',
    slug: 'handloom-cotton-saree',
    price: 1899,
    compareAtPrice: 2699,
    category: 'sarees',
    badge: 'Handpicked',
    rating: 4.9,
    images: [img('saree-01'), img('saree-01b')],
    variants: variantsFor(1899, ['Free'], ['Maroon', 'Green']),
  },
  {
    id: 'p-10',
    name: 'Leather Belt Combo',
    slug: 'leather-belt-combo',
    price: 499,
    compareAtPrice: 799,
    category: 'accessories',
    badge: null,
    rating: 4.2,
    images: [img('belt-01'), img('belt-01b')],
    variants: variantsFor(499, ['32', '34', '36'], ['Brown', 'Black']),
  },
];
