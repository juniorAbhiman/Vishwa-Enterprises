'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, BadgeIndianRupee, Search, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/product-card';
import {
  useGetProducts,
  useGetCategories,
  useGetStorefrontSummary,
  type GetProductsParams,
  type Category,
} from '../lib/api';
import { CatalogSection } from '@/components/catalog-section';

const fallbackCategories: Category[] = [
  { name: 'Men’s shirts', slug: 'mens-shirts', image: '/products/12-printed-check-shirt-catalog.png', count: 'Easy everyday layers' },
  { name: 'Denim & jeans', slug: 'jeans', image: '/products/10-latest-collection.png', count: 'Fits that move with you' },
  { name: 'Tees & tops', slug: 't-shirts', image: '/products/06-boxy-fit-t-shirt.png', count: 'The daily rotation' },
  { name: 'Comfort wear', slug: 'trousers', image: '/products/07-ns-terry-pant.jpg', count: 'Made for all-day comfort' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<GetProductsParams['sort']>('featured');

  const params = useMemo<GetProductsParams>(
    () => ({
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(category ? { category } : {}),
      sort,
    }),
    [search, category, sort]
  );

  const summary = useGetStorefrontSummary();
  const categoryQuery = useGetCategories();
  const catalog = useGetProducts(params);

  const categories: Category[] = categoryQuery.data?.length
    ? categoryQuery.data
    : summary.data?.categories?.length
      ? summary.data.categories
      : fallbackCategories.map((item) => ({ ...item, productCount: 0 }));

  const announcement = summary.data?.announcement;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">Kuttupur, Jaunpur · Vishwa Enterprises</div>
            <h1>
              Apna style.
              <br />
              <em>Apna shehar.</em>
            </h1>
            <p>
              Roz ke kapdon se lekar naye favourite tak — achhi quality aur sahi daam, seedha aapke ghar.
            </p>
            <Link className="btn" href="#catalog">
              Explore the collection <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-visual">
            <img
              src="/products/13-shirt-worn-in-store.jpg"
              alt="A customer trying a shirt at Vishwa Enterprises in Jaunpur"
            />
            <div className="hero-stamp">
              REAL FIT
              <br />
              LOCAL STYLE
              <br />
              JNP SINCE DAY ONE
            </div>
          </div>
        </div>
      </section>

      {announcement && (
        <div
          style={{
            background: '#f1e2b8',
            textAlign: 'center',
            padding: '10px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--navy)',
          }}
        >
          {announcement}
        </div>
      )}

      <div className="container benefits">
        <div className="benefit">
          <div className="benefit-icon"><BadgeIndianRupee size={20} /></div>
          <div><strong>Daam bilkul sahi</strong><span>Fair prices, no surprises</span></div>
        </div>
        <div className="benefit">
          <div className="benefit-icon"><ShieldCheck size={20} /></div>
          <div><strong>Quality you can feel</strong><span>Picked for everyday wear</span></div>
        </div>
        <div className="benefit">
          <div className="benefit-icon"><Truck size={20} /></div>
          <div><strong>Pay when it arrives</strong><span>Cash on delivery available</span></div>
        </div>
      </div>

      <section className="section" id="categories">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Find your kind of fit</div>
              <h2 className="section-title">Aaj kya pehenna hai?</h2>
            </div>
            <p className="section-note">
              From a crisp shirt for the day to your most-worn jeans. Browse the racks, right here.
            </p>
          </div>
          <div className="category-grid">
            {categories.slice(0, 4).map((item, index) => (
              <Link
                className="category-tile"
                href="/#catalog"
                key={item.slug}
                onClick={() => setCategory(item.slug)}
              >
                <img
                  src={item.image || fallbackCategories[index % 4].image}
                  alt={item.name}
                  loading="lazy"
                />
                <span className="category-label">
                  {item.name}
                  <small>
                    {item.productCount ?? fallbackCategories[index % 4].count}{' '}
                    {typeof item.productCount === 'number' ? 'styles' : ''}
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-section section" id="catalog">
        <CatalogSection />
      </section>

      <section className="container section" style={{ paddingTop: 40 }}>
        <div className="editorial">
          <img
            src="/products/12-printed-check-shirt-catalog.png"
            alt="Printed check shirt from Vishwa Enterprises collection"
            loading="lazy"
          />
          <div className="editorial-copy">
            <div className="section-kicker">Chosen close to home</div>
            <h2>Good style feels even better when it fits.</h2>
            <p>
              We’re your neighbourhood clothing shop in Kuttupur. Browse the latest designs online,
              then get them delivered with the same straight-up service you know from our store.
            </p>
            <Link className="btn btn-dark" href="#catalog">
              See what’s new <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}