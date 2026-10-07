'use client';

import { useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { ProductCard } from './product-card';
import { MOCK_PRODUCTS } from '@/lib/api';
import type { Product } from '../lib/api';

type Sort = 'featured' | 'newest' | 'price_asc' | 'price_desc';

const CATEGORY_LABELS: Record<string, string> = {
  'mens-shirts': "Men's Shirts",
  't-shirts': 'T-Shirts & Polos',
  jeans: 'Jeans & Denim',
  trousers: 'Trousers & Chinos',
  kurtis: 'Kurtis & Suits',
  tops: 'Tops & Tunics',
  dresses: 'Dresses',
  jeggings: 'Jeans & Jeggings',
  sarees: 'Sarees',
  accessories: 'Accessories',
};

/**
 * Standalone catalog section with built-in mock data.
 * Drop it anywhere — no API, no context needed except ShopProvider for the cart.
 */
export function CatalogSection({ products = MOCK_PRODUCTS }: { products?: Product[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive the category list from whatever products were passed in
  const categories = useMemo(() => {
    const seen = new Map<string, { slug: string; name: string; count: number }>();
    for (const p of products) {
      const slug = p.category ?? 'other';
      if (!seen.has(slug)) {
        seen.set(slug, {
          slug,
          name: CATEGORY_LABELS[slug] ?? slug,
          count: 0,
        });
      }
      seen.get(slug)!.count += 1;
    }
    return Array.from(seen.values());
  }, [products]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = products.slice();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.category ?? ''}`.toLowerCase().includes(q)
      );
    }

    if (category) {
      list = list.filter((p) => p.category === category);
    }

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.reverse(); // mock: newest = reverse of listed order
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }, [products, search, category, sort]);

  function resetAll() {
    setSearch('');
    setCategory('');
    setSort('featured');
  }

  function simulateRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }

  return (
    <section className="catalog-section section" id="catalog">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-kicker">The Vishwa edit</div>
            <h2 className="section-title">Fresh from our shelves</h2>
          </div>
          <p className="section-note">
            Current designs for real days and real plans. Prices shown here are
            sample estimates.
          </p>
        </div>

        <div className="toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              aria-label="Search clothing"
              placeholder="Search shirts, jeans, everyday…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              data-testid="input-product-search"
            />
          </label>
          <select
            className="select-field"
            aria-label="Sort products"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>

        <div className="chips">
          <button
            className={`chip ${!category ? 'active' : ''}`}
            onClick={() => setCategory('')}
          >
            All pieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`chip ${category === cat.slug ? 'active' : ''}`}
              onClick={() => setCategory(category === cat.slug ? '' : cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isRefreshing ? (
          <div className="product-grid" aria-label="Loading products">
            {[1, 2, 3, 4].map((i) => (
              <div className="product-card" key={i}>
                <div className="product-image skeleton" />
                <div className="product-info">
                  <div
                    className="skeleton"
                    style={{ height: 13, width: '50%', marginBottom: 12 }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 19, width: '75%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={28} />
            <h2>No pieces found</h2>
            <p>Try another search or clear the category filter.</p>
            <button className="btn btn-outline" onClick={resetAll}>
              Show all pieces
            </button>
          </div>
        )}

        {/* Optional inline retry trigger, mirrors the original error state's action */}
        {filtered.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={simulateRefresh}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RefreshCw size={14} /> Refresh collection
            </button>
          </div>
        )}
      </div>
    </section>
  );
}