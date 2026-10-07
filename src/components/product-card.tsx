'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { useShopCart } from './shop-context';
import type { Product } from '../lib/api';

export function money(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useShopCart();

  const variants = product.variants ?? [];
  const images = product.images ?? [];
  const variant = variants.find((item) => item.stock > 0);
  const rating = typeof product.rating === 'number' ? product.rating : 0;

  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      <Link
        href={`/product/${product.slug}`}
        className="product-image"
        aria-label={`View ${product.name}`}
      >
        <img
          src={images[0] || '/products/10-latest-collection.png'}
          alt={product.name}
          loading="lazy"
        />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </Link>

      <div className="product-info">
        <div className="product-meta">{product.category}</div>

        <h3 className="product-name">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="price-row">
          <span className="price">{money(product.price)}</span>
          {product.compareAtPrice && (
            <span className="compare">{money(product.compareAtPrice)}</span>
          )}
          <span className="rating">
            <Star
              size={12}
              fill="currentColor"
              style={{ display: 'inline', verticalAlign: '-2px' }}
            />{' '}
            {rating.toFixed(1)}
          </span>
        </div>

        <button
          type="button"
          className="quick-add"
          disabled={!variant}
          onClick={() => variant && add(product, variant)}
          data-testid={`button-add-${product.id}`}
        >
          <ShoppingCart
            size={14}
            style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }}
          />
          {variant ? 'Add to Cart' : 'Sold out'}
        </button>
      </div>
    </article>
  );
}