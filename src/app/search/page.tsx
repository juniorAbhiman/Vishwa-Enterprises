'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown,
  Clock,
  Filter,
  Search as SearchIcon,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import { ProductCard } from '../../components/product-card';
import { MOCK_PRODUCTS } from '@/lib/api';
import type { Product } from '../../lib/api';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
  rating_desc: 'Top rated',
  newest: 'Newest first',
};

const PRICE_BANDS = [
  { id: 'u500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 – ₹1000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1000 – ₹2000', min: 1000, max: 2000 },
  { id: 'o2000', label: 'Above ₹2000', min: 2000, max: Infinity },
];

const CATEGORY_LABELS: Record<string, string> = {
  'mens-shirts': "Men's shirts",
  't-shirts': 'Tees & tops',
  jeans: 'Denim & jeans',
  trousers: 'Comfort wear',
  kurtis: 'Kurtis & suits',
  tops: 'Tops & tunics',
  dresses: 'Dresses',
  jeggings: 'Jeans & jeggings',
  sarees: 'Sarees',
  accessories: 'Accessories',
};

const POPULAR_SEARCHES = [
  'Cotton shirts',
  'Blue jeans',
  'Kurti',
  'T-shirt',
  'Saree',
  'Under ₹999',
];

const RECENT_KEY = 'vishwa-recent-searches';

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') ?? '';
  const isMobile = useIsMobile(900);

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(query);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceBands, setSelectedPriceBands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  // Focus after navigation (autoFocus attr doesn't refire in App Router)
  useEffect(() => {
    if (isMobile) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [isMobile]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) return;
    setRecent((prev) => {
      const next = [query, ...prev.filter((x) => x !== query)].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [query]);

  const allCategories = useMemo(() => {
    const map = new Map<string, { slug: string; label: string; count: number }>();
    for (const p of MOCK_PRODUCTS) {
      const slug = p.category ?? 'other';
      if (!map.has(slug)) {
        map.set(slug, {
          slug,
          label: CATEGORY_LABELS[slug] ?? slug,
          count: 0,
        });
      }
      map.get(slug)!.count += 1;
    }
    return Array.from(map.values());
  }, []);

  const results = useMemo<Product[]>(() => {
    let list = MOCK_PRODUCTS.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.category ?? ''} ${p.badge ?? ''}`.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length) {
      list = list.filter((p) => selectedCategories.includes(p.category ?? ''));
    }

    if (selectedPriceBands.length) {
      list = list.filter((p) =>
        selectedPriceBands.some((id) => {
          const band = PRICE_BANDS.find((b) => b.id === id);
          return band && p.price >= band.min && p.price < band.max;
        })
      );
    }

    if (minRating > 0) {
      list = list.filter((p) => (p.rating ?? 0) >= minRating);
    }

    switch (sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'newest':
        list.reverse();
        break;
      case 'featured':
      default:
        break;
    }

    return list;
  }, [query, selectedCategories, selectedPriceBands, minRating, sort]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  function runQuickSearch(q: string) {
    setInputValue(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function clearAllFilters() {
    setSelectedCategories([]);
    setSelectedPriceBands([]);
    setMinRating(0);
    setSort('featured');
  }

  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedPriceBands.length +
    (minRating > 0 ? 1 : 0);

  const showDiscover = !query.trim() && activeFilterCount === 0;

  // ---- filter panel (used in both sidebar and mobile drawer) ----
  const filterPanel = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div className="section-kicker" style={{ marginBottom: 10 }}>
          Categories
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {allCategories.map((cat) => {
            const checked = selectedCategories.includes(cat.slug);
            return (
              <li key={cat.slug} style={{ marginBottom: 6 }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 4px',
                    cursor: 'pointer',
                    fontSize: 13.5,
                    fontWeight: checked ? 600 : 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        checked
                          ? prev.filter((s) => s !== cat.slug)
                          : [...prev, cat.slug]
                      )
                    }
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: 'var(--red, #d33)',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ flex: 1 }}>{cat.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted, #6b7280)' }}>
                    {cat.count}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="section-kicker" style={{ marginBottom: 10 }}>
          Price
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PRICE_BANDS.map((band) => {
            const checked = selectedPriceBands.includes(band.id);
            return (
              <li key={band.id} style={{ marginBottom: 6 }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 4px',
                    cursor: 'pointer',
                    fontSize: 13.5,
                    fontWeight: checked ? 600 : 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedPriceBands((prev) =>
                        checked
                          ? prev.filter((s) => s !== band.id)
                          : [...prev, band.id]
                      )
                    }
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: 'var(--red, #d33)',
                      cursor: 'pointer',
                    }}
                  />
                  {band.label}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="section-kicker" style={{ marginBottom: 10 }}>
          Customer rating
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[4, 3, 2].map((n) => {
            const checked = minRating === n;
            return (
              <li key={n} style={{ marginBottom: 6 }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 4px',
                    cursor: 'pointer',
                    fontSize: 13.5,
                    fontWeight: checked ? 600 : 500,
                  }}
                >
                  <input
                    type="radio"
                    checked={checked}
                    onChange={() => setMinRating(n)}
                    style={{
                      width: 16,
                      height: 16,
                      accentColor: 'var(--red, #d33)',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {n}
                    <Star size={12} fill="currentColor" style={{ color: '#f0a500' }} />
                    &nbsp;& above
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {activeFilterCount > 0 && (
        <button type="button" onClick={clearAllFilters} className="btn btn-outline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container">
      {/* ============ PAGE HEAD + SEARCH TOOLBAR ============ */}
      <div className="page-top">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Search
        </div>
        <h1 className="page-title">
          {query ? `Results for “${query}”` : 'Search the Vishwa edit'}
        </h1>
        <p className="page-subtitle">
          {query
            ? `${results.length} ${results.length === 1 ? 'piece' : 'pieces'} found${
                activeFilterCount > 0
                  ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`
                  : ''
              }`
            : 'Search shirts, jeans, kurtis, sarees — or use the filters to browse the collection.'}
        </p>
      </div>

      {/* Search + sort — same pattern as home catalog toolbar */}
      <form onSubmit={submitSearch} className="toolbar" style={{ marginBottom: 20 }}>
        <label className="search-field" style={{ flex: 1 }}>
          <SearchIcon size={17} />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search shirts, jeans, everyday…"
            aria-label="Search products"
          />
          {inputValue && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setInputValue('');
                router.push('/search');
                inputRef.current?.focus();
              }}
              style={{
                border: 0,
                background: 'transparent',
                color: 'var(--muted, #6b7280)',
                cursor: 'pointer',
                padding: '0 4px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <X size={15} />
            </button>
          )}
          <button type="submit" className="btn btn-dark" style={{ padding: '8px 16px', fontSize: 12.5 }}>
            Search
          </button>
        </label>

        <select
          className="select-field"
          aria-label="Sort products"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <option key={k} value={k}>
              {SORT_LABELS[k]}
            </option>
          ))}
        </select>
      </form>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="chips" style={{ marginBottom: 20 }}>
          {selectedCategories.map((slug) => (
            <button
              key={`cat-${slug}`}
              type="button"
              className="chip active"
              onClick={() =>
                setSelectedCategories((prev) => prev.filter((s) => s !== slug))
              }
            >
              {CATEGORY_LABELS[slug] ?? slug} <X size={12} style={{ marginLeft: 4 }} />
            </button>
          ))}
          {selectedPriceBands.map((id) => {
            const band = PRICE_BANDS.find((b) => b.id === id);
            return (
              <button
                key={`price-${id}`}
                type="button"
                className="chip active"
                onClick={() =>
                  setSelectedPriceBands((prev) => prev.filter((s) => s !== id))
                }
              >
                {band?.label ?? id} <X size={12} style={{ marginLeft: 4 }} />
              </button>
            );
          })}
          {minRating > 0 && (
            <button
              type="button"
              className="chip active"
              onClick={() => setMinRating(0)}
            >
              {minRating}★ & above <X size={12} style={{ marginLeft: 4 }} />
            </button>
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="chip"
            style={{ background: 'transparent', textDecoration: 'underline' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ============ TWO-COLUMN LAYOUT ============ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 240px',
          gap: 28,
          alignItems: 'start',
        }}
      >
        {/* ---------- MAIN COLUMN ---------- */}
        <div style={{ minWidth: 0 }}>
          {/* Mobile filter trigger */}
          {isMobile && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setFiltersOpen(true)}
              style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Filter size={15} /> Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    minWidth: 18,
                    height: 18,
                    padding: '0 5px',
                    borderRadius: 999,
                    background: 'var(--red, #d33)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    lineHeight: '18px',
                    textAlign: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {showDiscover ? (
            /* ---------------- DISCOVER VIEW ---------------- */
            <>
              {recent.length > 0 && (
                <section className="section" style={{ paddingTop: 0 }}>
                  <div className="section-head" style={{ marginBottom: 14 }}>
                    <div>
                      <div className="section-kicker">
                        <Clock size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                        Recent searches
                      </div>
                      <h2 className="section-title" style={{ fontSize: 20 }}>
                        Pick up where you left off
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="text-link"
                      style={{ fontSize: 12, background: 'transparent', border: 0, cursor: 'pointer' }}
                    >
                      Clear history
                    </button>
                  </div>
                  <div className="chips">
                    {recent.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="chip"
                        onClick={() => runQuickSearch(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="section" style={{ paddingTop: recent.length ? 32 : 0 }}>
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <div>
                    <div className="section-kicker">
                      <TrendingUp size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                      Popular on Vishwa
                    </div>
                    <h2 className="section-title" style={{ fontSize: 20 }}>
                      What everyone&apos;s looking for
                    </h2>
                  </div>
                  <p className="section-note">
                    Tap a search to explore — or use the filters on the right.
                  </p>
                </div>
                <div className="chips">
                  {POPULAR_SEARCHES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="chip"
                      onClick={() => runQuickSearch(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </section>

              <section
                className="section"
                style={{
                  paddingTop: 32,
                  paddingBottom: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    padding: 22,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg,#fdf6e3 0%,#fbf1dc 100%)',
                    border: '1px solid #f0e0b8',
                  }}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: '#fff',
                      color: 'var(--red, #d33)',
                      flex: '0 0 36px',
                    }}
                  >
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--navy)' }}>
                      Pro tip: use the filters
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--navy)', opacity: 0.75 }}>
                      Narrow by category, price, or rating on the right to find your fit faster.
                      You can also search by keyword above.
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            /* ---------------- RESULTS ---------------- */
            <>
              {results.length > 0 ? (
                <div className="product-grid">
                  {results.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <SearchIcon size={28} />
                  <h2>No pieces found</h2>
                  <p>Try another search or clear the category filter.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      clearAllFilters();
                      setInputValue('');
                      router.push('/search');
                    }}
                  >
                    Show all pieces
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ---------- DESKTOP SIDEBAR ---------- */}
        {!isMobile && (
          <aside
            style={{
              background: '#fff',
              border: '1px solid var(--line, #e7e9ee)',
              borderRadius: 14,
              padding: 20,
              alignSelf: 'start',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--navy)',
                }}
              >
                Filters
              </span>
              {activeFilterCount > 0 && (
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: '#eef1f6',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--navy)',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </div>
            {filterPanel}
          </aside>
        )}
      </div>

      {/* ============ MOBILE FILTER DRAWER ============ */}
      {isMobile && (
        <>
          <div
            onClick={() => setFiltersOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20,20,40,0.45)',
              opacity: filtersOpen ? 1 : 0,
              pointerEvents: filtersOpen ? 'auto' : 'none',
              transition: 'opacity 0.25s ease',
              zIndex: 90,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100dvh',
              width: 'min(340px, 88vw)',
              background: '#fff',
              boxShadow: '-16px 0 40px -18px rgba(20,20,40,0.35)',
              transform: filtersOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: '1px solid var(--line, #e7e9ee)',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'var(--navy)',
                }}
              >
                FILTERS
              </span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  border: 0,
                  background: '#fafbfc',
                  borderRadius: 10,
                  color: 'var(--navy)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '18px 20px 24px', overflowY: 'auto', flex: 1 }}>
              {filterPanel}
            </div>
            <div
              style={{
                padding: 14,
                borderTop: '1px solid var(--line, #e7e9ee)',
                background: '#fafbfc',
              }}
            >
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setFiltersOpen(false)}
                style={{ width: '100%' }}
              >
                Show {results.length} result{results.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}