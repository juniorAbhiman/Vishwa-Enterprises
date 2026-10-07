'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Heart,
  Info,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  ThumbsUp,
  Truck,
  X,
} from 'lucide-react';
import { money, ProductCard } from './product-card';
import { useShopCart } from './shop-context';
import type { Product, ProductVariant } from '../lib/api';

/* ----------------------------------------------------------------
   Local demo catalog (kept self-contained so this file just works)
   Replace with your real data source when ready.
------------------------------------------------------------------*/

type Spec = { label: string; value: string };

type Review = {
  id: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
};

type ExtendedProduct = Product & {
  mrp?: number;
  highlights?: string[];
  specs?: Spec[];
  offers?: string[];
  reviewsList?: Review[];
  relatedSlugs?: string[];
};

const COLOR_HEX: Record<string, string> = {
  Ivory: '#f5efe0',
  Sand: '#d9c4a0',
  Navy: '#1a1a2e',
  Black: '#111111',
  White: '#ffffff',
  Maroon: '#7b1e2b',
  Olive: '#6b7440',
  Teal: '#0f6f6c',
  Pink: '#e6a4b4',
  Blue: '#3b6fa0',
  Indigo: '#2b3a67',
  Brown: '#6b4b2f',
  Charcoal: '#3b3b3b',
  Mustard: '#c99022',
  Sky: '#bfe0ef',
  Rose: '#c65a76',
  Green: '#3a7a4a',
};

const PRODUCT: ExtendedProduct = {
  id: 'linen-shirt',
  slug: 'linen-shirt',
  name: 'Relaxed Linen Shirt',
  category: 'mens-shirts',
  description:
    'A relaxed everyday essential designed for breathable comfort, clean tailoring, and effortless layering throughout the season. Cut from a soft linen-cotton blend with a relaxed drape.',
  price: 1499,
  mrp: 2499,
  rating: 4.6,
  badge: 'Bestseller',
  images: [
    '/products/10-latest-collection.png',
    '/products/12-printed-check-shirt-catalog.png',
    '/products/13-shirt-worn-in-store.jpg',
    '/products/06-boxy-fit-t-shirt.png',
  ],
  variants: [
    { id: 'ivory-s', color: 'Ivory', size: 'S', stock: 4, sku: 'LS-IV-S', price: 1499 },
    { id: 'ivory-m', color: 'Ivory', size: 'M', stock: 6, sku: 'LS-IV-M', price: 1499 },
    { id: 'ivory-l', color: 'Ivory', size: 'L', stock: 3, sku: 'LS-IV-L', price: 1499 },
    { id: 'ivory-xl', color: 'Ivory', size: 'XL', stock: 2, sku: 'LS-IV-XL', price: 1499 },
    { id: 'sand-s', color: 'Sand', size: 'S', stock: 0, sku: 'LS-SA-S', price: 1499 },
    { id: 'sand-m', color: 'Sand', size: 'M', stock: 5, sku: 'LS-SA-M', price: 1499 },
    { id: 'sand-l', color: 'Sand', size: 'L', stock: 2, sku: 'LS-SA-L', price: 1499 },
    { id: 'sand-xl', color: 'Sand', size: 'XL', stock: 0, sku: 'LS-SA-XL', price: 1499 },
    { id: 'navy-m', color: 'Navy', size: 'M', stock: 8, sku: 'LS-NV-M', price: 1599 },
    { id: 'navy-l', color: 'Navy', size: 'L', stock: 6, sku: 'LS-NV-L', price: 1599 },
    { id: 'navy-xl', color: 'Navy', size: 'XL', stock: 4, sku: 'LS-NV-XL', price: 1599 },
  ],
  highlights: [
    'Breathable 55% linen / 45% cotton blend',
    'Relaxed fit with a clean drape — true to size',
    'Corozo buttons and single chest pocket',
    'Made in India, hand-finished seams',
  ],
  specs: [
    { label: 'Material', value: '55% Linen, 45% Cotton' },
    { label: 'Fit', value: 'Relaxed' },
    { label: 'Sleeve', value: 'Full sleeve, button cuff' },
    { label: 'Neckline', value: 'Classic collar' },
    { label: 'Pattern', value: 'Solid' },
    { label: 'Care', value: 'Machine wash cold, do not bleach' },
    { label: 'Country of origin', value: 'India' },
  ],
  offers: [
    'Extra 10% off on your first COD order — code VISHWA10',
    'Buy 2 shirts, get flat ₹300 off — auto applied at checkout',
    'Free delivery on orders above ₹999',
  ],
  reviewsList: [
    {
      id: 'r1',
      name: 'Aarav S.',
      rating: 5,
      title: 'Perfect for Jaunpur summers',
      body: 'Fabric is light and breathable. Fits true to size, no shrinking after first wash.',
      date: '2 weeks ago',
      verified: true,
      helpful: 24,
    },
    {
      id: 'r2',
      name: 'Neha K.',
      rating: 4,
      title: 'Great quality, slightly loose',
      body: 'Ordered my usual size — the fit is relaxed as described. Colour matched the photos.',
      date: '1 month ago',
      verified: true,
      helpful: 12,
    },
    {
      id: 'r3',
      name: 'Rohit M.',
      rating: 5,
      title: 'Worth every rupee',
      body: 'Stitching is solid, buttons feel premium. Will order another colour.',
      date: '1 month ago',
      verified: false,
      helpful: 6,
    },
  ],
  relatedSlugs: [],
};

const FALLBACK = PRODUCT;

/* ----------------------------------------------------------------
   Small building blocks
------------------------------------------------------------------*/

function StarRow({
  value,
  size = 13,
}: {
  value: number;
  size?: number;
}) {
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}
      aria-label={`Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value >= n - 0.25;
        return (
          <Star
            key={n}
            size={size}
            fill={filled ? 'currentColor' : 'none'}
            strokeWidth={filled ? 0 : 1.4}
            style={{ color: filled ? '#f0a500' : 'var(--muted, #6b7280)' }}
          />
        );
      })}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 18,
        fontWeight: 800,
        color: 'var(--navy, #1a1a2e)',
        margin: '0 0 14px',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  );
}

/* ----------------------------------------------------------------
   Main component
------------------------------------------------------------------*/

export default function ProductDetailClient({ slug }: { slug: string }) {
  const product = (slug === PRODUCT.slug ? PRODUCT : FALLBACK) as ExtendedProduct;
  const cart = useShopCart();

  const colors = useMemo(() => {
    const seen: string[] = [];
    for (const v of product.variants) {
      if (v.color && !seen.includes(v.color)) seen.push(v.color);
    }
    return seen;
  }, [product.variants]);

  const sizes = ['S', 'M', 'L', 'XL'];

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState<string>(
    () =>
      product.variants.find((v) => v.stock > 0)?.color ?? colors[0] ?? ''
  );
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<null | {
    ok: boolean;
    text: string;
  }>(null);
  const [tab, setTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [zoom, setZoom] = useState(false);

  // Variant matching the selected color + size
  const selectedVariant: ProductVariant | null =
    product.variants.find((v) => v.color === color && v.size === size) ?? null;

  const variantBySize = (s: string) =>
    product.variants.find((v) => v.color === color && v.size === s) ?? null;

  // Price: falls back to first variant of the selected color
  const priceVariant =
    selectedVariant ??
    product.variants.find((v) => v.color === color) ??
    product.variants[0];

  const displayPrice = priceVariant?.price ?? product.price ?? 0;
  const mrp = product.mrp ?? Math.round(displayPrice * 1.5);
  const discount = mrp > displayPrice
    ? Math.round(((mrp - displayPrice) / mrp) * 100)
    : 0;

  const reviews = product.reviewsList ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating ?? 0;

  const canAdd = !!selectedVariant && selectedVariant.stock > 0;

  function addToCart() {
    if (!selectedVariant) return;
    cart.add(product, selectedVariant, quantity);
  }

  function checkPincode() {
    const code = pincode.trim();
    if (!/^\d{6}$/.test(code)) {
      setPincodeResult({ ok: false, text: 'Enter a valid 6-digit PIN code.' });
      return;
    }
    // Demo: 222001 = Jaunpur (serviceable), anything starting with 2 is OK
    const ok = code.startsWith('2');
    setPincodeResult({
      ok,
      text: ok
        ? `Delivery by ${new Date(Date.now() + 3 * 864e5).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · COD available`
        : 'Sorry, we don’t deliver here yet.',
    });
  }

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      {/* ---------- Breadcrumb + back ---------- */}
      <div className="page-top">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/#catalog">Collection</Link> /{' '}
          {product.name}
        </div>
        <Link href="/#catalog" className="text-link" style={{ fontSize: 11 }}>
          <ArrowLeft
            size={13}
            style={{ display: 'inline', verticalAlign: '-2px' }}
          />{' '}
          Back to collection
        </Link>
      </div>

      {/* ---------- Two-column layout ---------- */}
      <div
        className="checkout-layout"
        style={{
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          alignItems: 'start',
          gap: 40,
          paddingBottom: 40,
        }}
      >
        {/* ==================== LEFT: GALLERY ==================== */}
        <div>
          <div
            onClick={() => setZoom(true)}
            style={{
              position: 'relative',
              background: '#eee9dd',
              borderRadius: 14,
              overflow: 'hidden',
              cursor: 'zoom-in',
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src={product.images[activeImage] || '/products/10-latest-collection.png'}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {product.badge && (
              <span
                className="product-badge"
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                }}
              >
                {product.badge}
              </span>
            )}
            <button
              type="button"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted((v) => !v);
              }}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 38,
                height: 38,
                display: 'grid',
                placeItems: 'center',
                border: 0,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.92)',
                color: wishlisted ? 'var(--red, #d33)' : 'var(--navy, #1a1a2e)',
                cursor: 'pointer',
                boxShadow: '0 4px 12px -6px rgba(0,0,0,0.25)',
              }}
            >
              <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              marginTop: 12,
            }}
          >
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setActiveImage(i)}
                style={{
                  padding: 0,
                  border:
                    activeImage === i
                      ? '2px solid var(--navy, #1a1a2e)'
                      : '2px solid transparent',
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#eee9dd',
                  cursor: 'pointer',
                  aspectRatio: '1 / 1',
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Trust row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              marginTop: 18,
              padding: 14,
              background: '#fafbfc',
              border: '1px solid var(--line, #e7e9ee)',
              borderRadius: 12,
            }}
          >
            {[
              { icon: ShieldCheck, label: 'Secure payment' },
              { icon: Truck, label: 'COD available' },
              { icon: RefreshCw, label: '7-day returns' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  color: '#4b5563',
                  fontWeight: 500,
                }}
              >
                <Icon size={16} style={{ color: 'var(--red, #d33)', flex: '0 0 auto' }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== RIGHT: BUY BOX ==================== */}
        <div>
          <div className="section-kicker">{product.category}</div>
          <h1 className="page-title" style={{ marginTop: 8 }}>
            {product.name}
          </h1>

          {/* Rating row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
              fontSize: 13,
              color: 'var(--muted, #6b7280)',
            }}
          >
            <StarRow value={avgRating} />
            <strong style={{ color: 'var(--navy, #1a1a2e)' }}>
              {avgRating.toFixed(1)}
            </strong>
            <span>·</span>
            <button
              type="button"
              onClick={() => setTab('reviews')}
              style={{
                border: 0,
                background: 'transparent',
                color: 'var(--muted, #6b7280)',
                fontSize: 13,
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {reviews.length} reviews
            </button>
            <span>·</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: '#0a8a4c',
                fontWeight: 600,
              }}
            >
              <BadgeCheck size={14} /> Verified fit
            </span>
          </div>

          {/* Price block */}
          <div
            style={{
              marginTop: 20,
              padding: '16px 18px',
              background: '#fff',
              border: '1px solid var(--line, #e7e9ee)',
              borderRadius: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: 'var(--navy, #1a1a2e)',
                  letterSpacing: '-0.02em',
                }}
              >
                {money(displayPrice)}
              </span>
              {mrp > displayPrice && (
                <>
                  <span
                    style={{
                      fontSize: 14,
                      textDecoration: 'line-through',
                      color: 'var(--muted, #6b7280)',
                    }}
                  >
                    {money(mrp)}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#0a8a4c',
                      background: '#e6f4ec',
                      padding: '3px 8px',
                      borderRadius: 999,
                    }}
                  >
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 11.5,
                color: 'var(--muted, #6b7280)',
              }}
            >
              Inclusive of all taxes · Free delivery above ₹999
            </p>
          </div>

          {/* Offers */}
          {product.offers && product.offers.length > 0 && (
            <div
              style={{
                marginTop: 14,
                padding: '14px 16px',
                background: 'linear-gradient(180deg,#fdf6e3 0%,#fbf1dc 100%)',
                border: '1px solid #f0e0b8',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: 'var(--navy, #1a1a2e)',
                  marginBottom: 8,
                }}
              >
                <Tag size={14} style={{ color: 'var(--red, #d33)' }} />
                Available offers
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {product.offers.map((o) => (
                  <li
                    key={o}
                    style={{
                      fontSize: 12.5,
                      color: '#5b4c1c',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <Check
                      size={13}
                      style={{ color: '#0a8a4c', flex: '0 0 auto', marginTop: 3 }}
                    />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Colour selector */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <span
                className="section-kicker"
                style={{ margin: 0 }}
              >
                Colour:{' '}
                <strong style={{ color: 'var(--navy, #1a1a2e)' }}>{color}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {colors.map((c) => {
                const active = c === color;
                const hex = COLOR_HEX[c] ?? '#ccc';
                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Colour ${c}`}
                    aria-pressed={active}
                    onClick={() => {
                      setColor(c);
                      setSize(null);
                      setQuantity(1);
                    }}
                    style={{
                      position: 'relative',
                      width: 34,
                      height: 34,
                      padding: 0,
                      borderRadius: '50%',
                      border: active
                        ? '2px solid var(--navy, #1a1a2e)'
                        : '1px solid var(--line, #e7e9ee)',
                      background: hex,
                      cursor: 'pointer',
                      boxShadow:
                        hex === '#ffffff' ? 'inset 0 0 0 1px #e7e9ee' : undefined,
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: -5,
                          border: '1px solid var(--navy, #1a1a2e)',
                          borderRadius: '50%',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size selector */}
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <span className="section-kicker" style={{ margin: 0 }}>
                Size
              </span>
              <button
                type="button"
                className="text-link"
                style={{
                  fontSize: 11.5,
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Ruler size={13} /> Size guide
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sizes.map((s) => {
                const variant = variantBySize(s);
                const soldOut = !variant || variant.stock === 0;
                const active = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => !soldOut && setSize(s)}
                    disabled={soldOut}
                    aria-pressed={active}
                    style={{
                      minWidth: 46,
                      padding: '9px 14px',
                      border: active
                        ? '1px solid var(--navy, #1a1a2e)'
                        : '1px solid var(--line, #e7e9ee)',
                      background: active ? 'var(--navy, #1a1a2e)' : '#fff',
                      color: active
                        ? '#fff'
                        : soldOut
                        ? 'var(--muted, #6b7280)'
                        : 'var(--navy, #1a1a2e)',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: soldOut ? 'not-allowed' : 'pointer',
                      textDecoration: soldOut ? 'line-through' : 'none',
                      opacity: soldOut ? 0.55 : 1,
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && (
              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: '#c47b00',
                  background: '#fdf3dc',
                  padding: '6px 10px',
                  borderRadius: 8,
                  display: 'inline-block',
                }}
              >
                Only {selectedVariant.stock} left in {color} / {size}
              </p>
            )}
            {!size && (
              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: 'var(--muted, #6b7280)',
                }}
              >
                Please choose a size to continue.
              </p>
            )}
          </div>

          {/* Quantity */}
          <div style={{ marginTop: 22 }}>
            <span className="section-kicker" style={{ margin: 0 }}>
              Quantity
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid var(--line, #e7e9ee)',
                  borderRadius: 10,
                  padding: 2,
                  background: '#fff',
                }}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: 32,
                    height: 32,
                    display: 'grid',
                    placeItems: 'center',
                    border: 0,
                    background: 'transparent',
                    borderRadius: 8,
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    opacity: quantity <= 1 ? 0.35 : 1,
                    color: 'var(--navy, #1a1a2e)',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    minWidth: 30,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: 'var(--navy, #1a1a2e)',
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(selectedVariant?.stock ?? 10, q + 1)
                    )
                  }
                  disabled={
                    !!selectedVariant && quantity >= selectedVariant.stock
                  }
                  style={{
                    width: 32,
                    height: 32,
                    display: 'grid',
                    placeItems: 'center',
                    border: 0,
                    background: 'transparent',
                    borderRadius: 8,
                    cursor: 'pointer',
                    color: 'var(--navy, #1a1a2e)',
                    opacity:
                      selectedVariant && quantity >= selectedVariant.stock
                        ? 0.35
                        : 1,
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
              {selectedVariant && (
                <span
                  style={{ fontSize: 12, color: 'var(--muted, #6b7280)' }}
                >
                  {selectedVariant.stock} available · SKU {selectedVariant.sku}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginTop: 24,
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              disabled={!canAdd}
              onClick={addToCart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 18px',
                opacity: canAdd ? 1 : 0.55,
              }}
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button
              type="button"
              className="btn btn-dark"
              disabled={!canAdd}
              onClick={addToCart}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 18px',
                opacity: canAdd ? 1 : 0.55,
              }}
            >
              Buy now
            </button>
          </div>

          {/* Pincode check */}
          <div
            style={{
              marginTop: 20,
              padding: '14px 16px',
              background: '#fafbfc',
              border: '1px solid var(--line, #e7e9ee)',
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--navy, #1a1a2e)',
                marginBottom: 10,
              }}
            >
              <MapPin size={14} style={{ color: 'var(--red, #d33)' }} />
              Check delivery availability
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit PIN code"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  setPincodeResult(null);
                }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '10px 12px',
                  border: '1px solid var(--line, #e7e9ee)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'var(--navy, #1a1a2e)',
                  outline: 'none',
                  background: '#fff',
                }}
              />
              <button
                type="button"
                className="btn btn-dark"
                onClick={checkPincode}
                disabled={pincode.length !== 6}
                style={{
                  padding: '10px 16px',
                  fontSize: 12.5,
                  opacity: pincode.length !== 6 ? 0.55 : 1,
                }}
              >
                Check
              </button>
            </div>
            {pincodeResult && (
              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: 12.5,
                  color: pincodeResult.ok ? '#0a8a4c' : 'var(--red, #d33)',
                  fontWeight: 600,
                }}
              >
                {pincodeResult.text}
              </p>
            )}
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div className="section-kicker" style={{ marginBottom: 10 }}>
                Product highlights
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {product.highlights.map((h) => (
                  <li
                    key={h}
                    style={{
                      display: 'flex',
                      gap: 8,
                      fontSize: 13,
                      color: '#3b4252',
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    <Check
                      size={14}
                      style={{ color: '#0a8a4c', flex: '0 0 auto', marginTop: 3 }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ==================== TABS ==================== */}
      <section style={{ marginTop: 40 }}>
        <div
          style={{
            display: 'flex',
            gap: 4,
            borderBottom: '1px solid var(--line, #e7e9ee)',
            marginBottom: 22,
          }}
        >
          {(
            [
              ['desc', 'Description'],
              ['specs', 'Specifications'],
              ['reviews', `Reviews (${reviews.length})`],
            ] as const
          ).map(([key, label]) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                style={{
                  padding: '12px 16px',
                  border: 0,
                  background: 'transparent',
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: active ? 'var(--navy, #1a1a2e)' : 'var(--muted, #6b7280)',
                  borderBottom: active
                    ? '2px solid var(--red, #d33)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  marginBottom: -1,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {tab === 'desc' && (
          <div style={{ maxWidth: 760 }}>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: '#3b4252',
                margin: '0 0 16px',
              }}
            >
              {product.description}
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.75,
                color: '#3b4252',
                margin: 0,
              }}
            >
              Designed and finished in India, this piece is made to be worn
              every day. Pair it with denim for the weekend or chinos for work
              — the relaxed cut keeps it comfortable without losing shape.
            </p>
          </div>
        )}

        {tab === 'specs' && product.specs && (
          <div
            style={{
              maxWidth: 640,
              border: '1px solid var(--line, #e7e9ee)',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#fff',
            }}
          >
            {product.specs.map((s, i) => (
              <div
                key={s.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  padding: '12px 16px',
                  background: i % 2 === 0 ? '#fafbfc' : '#fff',
                  fontSize: 13.5,
                  borderTop: i === 0 ? 'none' : '1px solid var(--line, #e7e9ee)',
                }}
              >
                <span style={{ color: 'var(--muted, #6b7280)', fontWeight: 600 }}>
                  {s.label}
                </span>
                <span style={{ color: 'var(--navy, #1a1a2e)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '240px 1fr',
              gap: 32,
              alignItems: 'start',
            }}
          >
            {/* Rating summary */}
            <div
              style={{
                padding: 20,
                border: '1px solid var(--line, #e7e9ee)',
                borderRadius: 12,
                background: '#fff',
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 800,
                  color: 'var(--navy, #1a1a2e)',
                  lineHeight: 1,
                }}
              >
                {avgRating.toFixed(1)}
              </div>
              <div style={{ marginTop: 6, marginBottom: 4 }}>
                <StarRow value={avgRating} size={15} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted, #6b7280)' }}>
                Based on {reviews.length} reviews
              </div>
              <div style={{ marginTop: 16 }}>
                {[5, 4, 3, 2, 1].map((n) => {
                  const count = reviews.filter((r) => r.rating === n).length;
                  const pct = reviews.length
                    ? (count / reviews.length) * 100
                    : 0;
                  return (
                    <div
                      key={n}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ width: 12 }}>{n}</span>
                      <Star size={11} fill="#f0a500" color="#f0a500" />
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: '#eceef2',
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: '#f0a500',
                            borderRadius: 999,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          width: 24,
                          textAlign: 'right',
                          color: 'var(--muted, #6b7280)',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {reviews.map((r) => (
                <article
                  key={r.id}
                  style={{
                    padding: 18,
                    border: '1px solid var(--line, #e7e9ee)',
                    borderRadius: 12,
                    background: '#fff',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: '#eef1f6',
                          color: 'var(--navy, #1a1a2e)',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: 'var(--navy, #1a1a2e)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          {r.name}
                          {r.verified && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: '#0a8a4c',
                                background: '#e6f4ec',
                                padding: '2px 6px',
                                borderRadius: 999,
                              }}
                            >
                              <BadgeCheck size={11} /> Verified
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: 3 }}>
                          <StarRow value={r.rating} size={12} />
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: 'var(--muted, #6b7280)',
                      }}
                    >
                      {r.date}
                    </span>
                  </div>
                  <h4
                    style={{
                      margin: '4px 0 6px',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--navy, #1a1a2e)',
                    }}
                  >
                    {r.title}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: '#4b5563',
                    }}
                  >
                    {r.body}
                  </p>
                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      fontSize: 12,
                      color: 'var(--muted, #6b7280)',
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        border: 0,
                        background: 'transparent',
                        color: 'inherit',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: 0,
                      }}
                    >
                      <ThumbsUp size={12} /> Helpful ({r.helpful})
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ==================== FOOTER NOTE ==================== */}
      <div
        style={{
          marginTop: 40,
          padding: 16,
          background: '#f2ecdd',
          fontSize: 12,
          lineHeight: 1.7,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <Info
          size={16}
          style={{ color: 'var(--red, #d33)', flex: '0 0 auto', marginTop: 2 }}
        />
        <span>
          Sample price and stock; the store confirms availability and delivery
          before fulfilling a cash-on-delivery order.
        </span>
      </div>

      {/* ==================== LIGHTBOX ==================== */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,15,25,0.9)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 200,
            padding: 24,
            cursor: 'zoom-out',
          }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoom(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: 0,
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <X size={20} />
          </button>
          <img
            src={product.images[activeImage]}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 12,
            }}
          />
        </div>
      )}
    </div>
  );
}