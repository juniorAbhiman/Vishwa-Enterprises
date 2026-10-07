"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useShopCart } from "./shop-context";
import type { ReactNode } from "react";

const MENU = {
  men: [
    { label: "Shirts", href: "/#catalog" },
    { label: "T-Shirts & Polos", href: "/#catalog" },
    { label: "Jeans & Denim", href: "/#catalog" },
    { label: "Trousers & Chinos", href: "/#catalog" },
    { label: "Ethnic Wear", href: "/#catalog" },
    { label: "Accessories", href: "/#catalog" },
  ],
  women: [
    { label: "Kurtis & Suits", href: "/#catalog" },
    { label: "Tops & Tunics", href: "/#catalog" },
    { label: "Dresses", href: "/#catalog" },
    { label: "Jeans & Jeggings", href: "/#catalog" },
    { label: "Sarees", href: "/#catalog" },
    { label: "Accessories", href: "/#catalog" },
  ],
};

const colors = {
  navy: "#1a1a2e",
  red: "#d33",
  muted: "#6b7280",
  line: "#e7e9ee",
  bg: "#f4f5f7",
  soft: "#fafbfc",
};

/** Time between each row's animation start (ms) */
const STAGGER = 55;
/** Per-row animation duration (ms) */
const ITEM_DURATION = 480;
/** Height per row (px) — used to size the container so it expands in sync */
const ITEM_HEIGHT = 40;
/** Grace period when the mouse leaves the dropdown before it closes (ms) */
const CLOSE_DELAY = 180;

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/**
 * A single row that rolls down from its top edge.
 * Opening: index * STAGGER → rolls out 0, 1, 2, 3...
 * Closing: reversed → last rolls in first, then back up to 0.
 */
function RollRow({
  open,
  index,
  total,
  children,
}: {
  open: boolean;
  index: number;
  total: number;
  children: ReactNode;
}) {
  const delay = open ? index * STAGGER : (total - 1 - index) * STAGGER;

  return (
    <li
      style={{
        listStyle: "none",
        transformOrigin: "center top",
        transform: open
          ? "perspective(1100px) rotateX(0deg)"
          : "perspective(1100px) rotateX(-92deg)",
        opacity: open ? 1 : 0,
        transition: `transform ${ITEM_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 240ms ease ${delay}ms`,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {children}
    </li>
  );
}

function NavDropdown({
  label,
  items,
  isMobile,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string }[];
  isMobile: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const total = items.length;

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  function openNow() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function closeSoon() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }

  /** Panel height that expands in sync with the staggered roll-out */
  const panelMaxHeight = open ? total * ITEM_HEIGHT + (isMobile ? 32 : 48) : 0;
  const panelDuration = total * STAGGER + ITEM_DURATION;

  const rows = items.map((item, i) => (
    <RollRow key={item.label} open={open} index={i} total={total}>
      <Link
        href={item.href}
        onClick={onNavigate}
        style={{
          display: "block",
          padding: isMobile ? "11px 8px" : "10px 12px",
          fontSize: isMobile ? 14 : 13.5,
          color: "#3b4252",
          textDecoration: "none",
          borderRadius: 8,
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.soft;
          e.currentTarget.style.color = colors.red;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#3b4252";
        }}
      >
        {item.label}
      </Link>
    </RollRow>
  ));

  // ---------- MOBILE ----------
  if (isMobile) {
    return (
      <div style={{ borderBottom: `1px solid ${colors.line}` }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 4px",
            border: 0,
            background: "transparent",
            fontSize: 15,
            fontWeight: 600,
            color: colors.navy,
            cursor: "pointer",
          }}
        >
          {label}
          <ChevronDown
            size={16}
            style={{
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        <div
          style={{
            overflow: "hidden",
            maxHeight: panelMaxHeight,
            transition: `max-height ${panelDuration}ms cubic-bezier(0.4,0,0.2,1)`,
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: "4px 4px 12px 8px",
              margin: 0,
            }}
          >
            {rows}
          </ul>
        </div>
      </div>
    );
  }

  // ---------- DESKTOP ----------
  return (
    <div
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openNow())}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "8px 10px",
          border: 0,
          background: "transparent",
          fontSize: 13.5,
          fontWeight: 600,
          color: open ? colors.red : colors.navy,
          cursor: "pointer",
          borderRadius: 8,
          transition: "color 0.15s ease",
        }}
      >
        {label}
        <ChevronDown
          size={14}
          style={{
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Wrapper: absolute panel. The paddingTop is a hover bridge so the
          pointer never leaves the parent when crossing to the items. */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          paddingTop: 6,
          minWidth: 240,
          pointerEvents: open ? "auto" : "none",
          zIndex: 60,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            maxHeight: Math.max(0, panelMaxHeight - 6),
            transition: `max-height ${panelDuration}ms cubic-bezier(0.4,0,0.2,1)`,
            background: open ? "#fff" : "transparent",
            border: open ? `1px solid ${colors.line}` : "1px solid transparent",
            borderRadius: 12,
            boxShadow: open
              ? "0 20px 44px -22px rgba(20,20,40,0.35)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
        >
          <ul style={{ listStyle: "none", padding: "8px 8px 12px", margin: 0 }}>
            {rows}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ShopShell({ children }: { children: ReactNode }) {
  const { count } = useShopCart();
  const isMobile = useIsMobile(900);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const iconLinkStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 10,
    color: colors.navy,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1,
    textDecoration: "none",
    transition: "background 0.15s ease",
    position: "relative",
  };

  const iconBoxStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    flex: "0 0 22px",
  };

  return (
    <>
      {/* Announcement */}
      <div
        style={{
          background: colors.navy,
          color: "#fff",
          textAlign: "center",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.02em",
          padding: "9px 14px",
        }}
      >
        Kuttupur, Jaunpur se aapke ghar tak · Fair prices. Fresh styles. COD
        available.
      </div>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "saturate(180%) blur(10px)",
          WebkitBackdropFilter: "saturate(180%) blur(10px)",
          borderBottom: `1px solid ${colors.line}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: isMobile ? "10px 16px" : "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            aria-label="Vishwa Enterprises home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: colors.navy,
              flex: "0 0 auto",
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 38,
                height: 38,
                borderRadius: 10,
                background: colors.navy,
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.02em",
              }}
            >
              V
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.06em",
                lineHeight: 1.15,
              }}
            >
              VISHWA
              <br />
              ENTERPRISES
            </span>
          </Link>

          {/* Desktop nav */}
          {!isMobile && (
            <nav
              aria-label="Main navigation"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: 12,
              }}
            >
              <NavDropdown
                label="Men's wear"
                items={MENU.men}
                isMobile={false}
              />
              <NavDropdown
                label="Women's wear"
                items={MENU.women}
                isMobile={false}
              />
            </nav>
          )}

          {/* Right actions */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Link
              href="/search"
              aria-label="Search products"
              style={iconLinkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = colors.soft)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={iconBoxStyle}>
                <Search size={18} />
              </span>
              {!isMobile && <span>Search</span>}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart, ${count} items`}
              style={iconLinkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = colors.soft)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={iconBoxStyle}>
                <ShoppingBag size={19} />
                {count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -8,
                      minWidth: 17,
                      height: 17,
                      padding: "0 4px",
                      borderRadius: 999,
                      background: colors.red,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      lineHeight: "17px",
                      textAlign: "center",
                      boxShadow: "0 0 0 2px #fff",
                      pointerEvents: "none",
                    }}
                  >
                    {count}
                  </span>
                )}
              </span>
              {!isMobile && <span>Cart</span>}
            </Link>

            {isMobile && (
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  border: `1px solid ${colors.line}`,
                  borderRadius: 10,
                  background: "#fff",
                  color: colors.navy,
                  cursor: "pointer",
                }}
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobile && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(20,20,40,0.45)",
              opacity: menuOpen ? 1 : 0,
              pointerEvents: menuOpen ? "auto" : "none",
              transition: "opacity 0.25s ease",
              zIndex: 90,
            }}
          />
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100dvh",
              width: "min(340px, 88vw)",
              background: "#fff",
              boxShadow: "-16px 0 40px -18px rgba(20,20,40,0.35)",
              transform: menuOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: `1px solid ${colors.line}`,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  color: colors.navy,
                }}
              >
                MENU
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  border: 0,
                  background: colors.soft,
                  borderRadius: 10,
                  color: colors.navy,
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                padding: "8px 16px 20px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              <NavDropdown
                label="Men's wear"
                items={MENU.men}
                isMobile
                onNavigate={() => setMenuOpen(false)}
              />
              <NavDropdown
                label="Women's wear"
                items={MENU.women}
                isMobile
                onNavigate={() => setMenuOpen(false)}
              />
              <Link
                href="/order-lookup"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 4px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: colors.navy,
                  textDecoration: "none",
                  borderBottom: `1px solid ${colors.line}`,
                }}
              >
                Track order
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 4px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: colors.navy,
                  textDecoration: "none",
                  borderBottom: `1px solid ${colors.line}`,
                }}
              >
                <span>Your bag</span>
                <span
                  style={{
                    minWidth: 22,
                    height: 22,
                    padding: "0 7px",
                    borderRadius: 999,
                    background: colors.red,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: "22px",
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
              </Link>
            </div>

            <div
              style={{
                padding: "14px 16px",
                borderTop: `1px solid ${colors.line}`,
                background: colors.soft,
                fontSize: 12,
                color: colors.muted,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MapPin size={13} />
              Kuttupur, Jaunpur, Uttar Pradesh
            </div>
          </div>
        </>
      )}

      <main>{children}</main>

      <footer
        style={{ marginTop: 40, background: colors.navy, color: "#e6e8ef" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "36px 24px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.06em",
                marginBottom: 10,
                color: "#fff",
              }}
            >
              VISHWA ENTERPRISES JNP
            </div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 12.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MapPin size={13} /> Kuttupur, Jaunpur, Uttar Pradesh
            </p>
            <p style={{ margin: 0, fontSize: 12.5, opacity: 0.85 }}>
              Achhe kapde. Sahi daam. Apne shehar ki dukaan.
            </p>
          </div>

          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            <Link
              href="/#catalog"
              style={{
                color: "#e6e8ef",
                fontSize: 12.5,
                textDecoration: "none",
              }}
            >
              Shop collection
            </Link>
            <Link
              href="/cart"
              style={{
                color: "#e6e8ef",
                fontSize: 12.5,
                textDecoration: "none",
              }}
            >
              Your bag
            </Link>
            <Link
              href="/order-lookup"
              style={{
                color: "#e6e8ef",
                fontSize: 12.5,
                textDecoration: "none",
              }}
            >
              Order lookup
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
