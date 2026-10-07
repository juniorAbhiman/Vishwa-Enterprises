import Link from 'next/link';
import {
  ArrowLeft,
  Home,
  Search,
  ShoppingBag,
  LifeBuoy,
} from 'lucide-react';

const colors = {
  navy: '#1a1a2e',
  red: '#d33',
  muted: '#6b7280',
  line: '#e7e9ee',
  bg: '#f4f5f7',
  soft: '#fafbfc',
};

const quickLinks = [
  { label: 'Shop all', href: '/#catalog', icon: ShoppingBag },
  { label: 'Track order', href: '/order-lookup', icon: Search },
  { label: 'Your bag', href: '/cart', icon: LifeBuoy },
];

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'grid',
        placeItems: 'center',
        padding: '60px 20px 80px',
        background:
          'radial-gradient(1200px 400px at 50% -10%, #eef1f6 0%, transparent 60%)',
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Big 404 typographic lockup */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 26,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: colors.red,
              textTransform: 'uppercase',
            }}
          >
            Error
          </span>
          <span
            style={{
              width: 28,
              height: 1,
              background: colors.line,
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: colors.muted,
              textTransform: 'uppercase',
            }}
          >
            404
          </span>
        </div>

        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(60px, 12vw, 120px)',
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: `linear-gradient(180deg, ${colors.navy} 0%, #4b5563 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2
          style={{
            margin: '18px 0 12px',
            fontSize: 'clamp(22px, 3.2vw, 30px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: colors.navy,
          }}
        >
          This rack is empty.
        </h2>

        <p
          style={{
            margin: '0 auto 32px',
            maxWidth: 480,
            fontSize: 15,
            lineHeight: 1.6,
            color: colors.muted,
          }}
        >
          The page you&apos;re looking for may have moved, been renamed, or is
          hiding behind a different shelf. Let&apos;s get you back to the
          collection.
        </p>

        {/* Primary actions */}
        <div
          style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 44,
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              background: colors.navy,
              color: '#fff',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 10px 24px -12px rgba(26,26,46,0.5)',
            }}
          >
            <Home size={16} /> Back to home
          </Link>

          <Link
            href="/#catalog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              background: '#fff',
              color: colors.navy,
              border: `1px solid ${colors.line}`,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Browse collection
          </Link>
        </div>

        {/* Quick links card */}
        <div
          style={{
            background: '#fff',
            border: `1px solid ${colors.line}`,
            borderRadius: 16,
            padding: 6,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 6,
            boxShadow: '0 20px 40px -30px rgba(20,20,40,0.35)',
          }}
        >
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '18px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                color: colors.navy,
                fontSize: 13,
                fontWeight: 600,
                transition: 'background 0.15s ease',
              }}
            >
              <span
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: colors.soft,
                  color: colors.red,
                }}
              >
                <Icon size={18} />
              </span>
              {label}
            </Link>
          ))}
        </div>

        {/* Footnote */}
        <p
          style={{
            marginTop: 26,
            fontSize: 12,
            color: colors.muted,
          }}
        >
          Vishwa Enterprises · Kuttupur, Jaunpur
        </p>
      </div>
    </div>
  );
}