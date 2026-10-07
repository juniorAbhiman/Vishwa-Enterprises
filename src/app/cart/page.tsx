"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgePercent,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useShopCart } from "../../components/shop-context";
import { money } from "../../components/product-card";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

/** Simple breakpoint hook so we don't need CSS media queries. */
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

export default function CartPage() {
  const cart = useShopCart();
  const isMobile = useIsMobile(900);
  const [coupon, setCoupon] = useState("");

  const shippingFee =
    cart.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = cart.subtotal + shippingFee;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.subtotal);
  const progress = Math.min(
    100,
    (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  // ----- shared style tokens -----
  const colors = {
    navy: "#1a1a2e",
    red: "#d33",
    muted: "#6b7280",
    line: "#e7e9ee",
    bg: "#f4f5f7",
    green: "#0a8a4c",
    gold: "#c47b00",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: `1px solid ${colors.line}`,
    borderRadius: 14,
    padding: 16,
  };

  const iconBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    border: 0,
    background: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    color: "#a53a36",
  };

  const qtyBtnStyle: React.CSSProperties = {
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    border: 0,
    background: "transparent",
    borderRadius: 8,
    color: colors.navy,
    cursor: "pointer",
  };

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 9px",
    background: colors.bg,
    borderRadius: 999,
    fontSize: 11,
    color: "#566072",
  };

  const btnDark: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "13px 18px",
    background: colors.navy,
    color: "#fff",
    border: 0,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
    letterSpacing: "0.01em",
  };

  const btnOutline: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: "#fff",
    color: colors.navy,
    border: `1px solid ${colors.line}`,
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: isMobile ? "20px 16px 60px" : "28px 24px 80px",
      }}
    >
      {/* ---------- Breadcrumb + heading ---------- */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            fontSize: 12,
            color: colors.muted,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Link
            href="/"
            style={{ color: colors.muted, textDecoration: "none" }}
          >
            Home
          </Link>
          <span>/</span>
          <span style={{ color: colors.navy, fontWeight: 600 }}>Your Cart</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? 26 : 34,
              fontWeight: 800,
              color: colors.navy,
              letterSpacing: "-0.02em",
            }}
          >
            Your Cart
          </h1>
          {cart.count > 0 && (
            <span
              style={{
                padding: "4px 10px",
                background: "#eef1f6",
                color: colors.navy,
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 999,
              }}
            >
              {cart.count} {cart.count === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      </div>

      {/* ---------- Empty state ---------- */}
      {!cart.lines.length ? (
        <div
          style={{
            ...cardStyle,
            textAlign: "center",
            padding: "56px 24px 64px",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 18px",
              display: "grid",
              placeItems: "center",
              background: colors.bg,
              borderRadius: "50%",
              color: "#7c8598",
            }}
          >
            <ShoppingCart size={34} strokeWidth={1.5} />
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, color: colors.navy }}>
            Your cart is waiting
          </h2>
          <p style={{ margin: "0 0 22px", color: colors.muted, fontSize: 14 }}>
            There&apos;s plenty to discover on the Vishwa shelves.
          </p>
          <Link
            href="/#catalog"
            style={{ ...btnDark, width: "auto", padding: "12px 22px" }}
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 360px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ================= LEFT COLUMN ================= */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Free-shipping banner */}
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: "14px 16px",
                background: "linear-gradient(180deg,#fdf6e3 0%,#fbf1dc 100%)",
                border: "1px solid #f0e0b8",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  flex: "0 0 34px",
                  height: 34,
                  display: "grid",
                  placeItems: "center",
                  background: "#fff",
                  color: colors.red,
                  borderRadius: 10,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <Truck size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 13,
                    color: colors.navy,
                  }}
                >
                  {remaining > 0 ? (
                    <>
                      Add <strong>{money(remaining)}</strong> more to unlock{" "}
                      <strong>FREE delivery</strong>
                    </>
                  ) : (
                    <>
                      🎉 <strong>You&apos;ve unlocked FREE delivery!</strong>
                    </>
                  )}
                </p>
                <div
                  style={{
                    height: 6,
                    background: "#ece1c4",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: `linear-gradient(90deg,${colors.red},#f08a5d)`,
                      borderRadius: 999,
                      transition: "width 0.35s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Cart items */}
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {cart.lines.map((line) => {
                const lineTotal = line.variant.price * line.quantity;
                const atMax = line.quantity >= line.variant.stock;
                const lowStock = line.variant.stock <= 5;

                return (
                  <li
                    key={line.variant.id}
                    style={{
                      ...cardStyle,
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "88px minmax(0,1fr)"
                        : "110px minmax(0,1fr)",
                      gap: 16,
                      padding: isMobile ? 12 : 16,
                    }}
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/product/${line.product.slug}`}
                      style={{
                        display: "block",
                        width: isMobile ? 88 : 110,
                        height: isMobile ? 104 : 130,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: colors.bg,
                      }}
                    >
                      <img
                        src={
                          line.product.images?.[0] ||
                          "/products/10-latest-collection.png"
                        }
                        alt={line.product.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Link>

                    {/* Details */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minWidth: 0,
                      }}
                    >
                      {/* Top row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <h3
                            style={{
                              margin: "0 0 6px",
                              fontSize: 15,
                              fontWeight: 600,
                              lineHeight: 1.35,
                            }}
                          >
                            <Link
                              href={`/product/${line.product.slug}`}
                              style={{
                                color: colors.navy,
                                textDecoration: "none",
                              }}
                            >
                              {line.product.name}
                            </Link>
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {line.variant.color && (
                              <span style={chipStyle}>
                                Colour:{" "}
                                <strong style={{ color: colors.navy }}>
                                  {line.variant.color}
                                </strong>
                              </span>
                            )}
                            <span style={chipStyle}>
                              Size:{" "}
                              <strong style={{ color: colors.navy }}>
                                {line.variant.size}
                              </strong>
                            </span>
                            {line.variant.sku && (
                              <span
                                style={{
                                  ...chipStyle,
                                  background: "transparent",
                                  color: "#9aa1af",
                                  paddingLeft: 0,
                                }}
                              >
                                SKU: {line.variant.sku}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${line.product.name}`}
                          onClick={() => cart.remove(line.variant.id)}
                          style={iconBtnStyle}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Bottom row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginTop: 14,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          role="group"
                          aria-label="Quantity"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 2,
                            border: `1px solid ${colors.line}`,
                            borderRadius: 10,
                            padding: 2,
                            background: "#fff",
                          }}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              cart.setQuantity(
                                line.variant.id,
                                line.quantity - 1,
                              )
                            }
                            style={qtyBtnStyle}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            aria-live="polite"
                            style={{
                              minWidth: 26,
                              textAlign: "center",
                              fontSize: 13,
                              fontWeight: 600,
                              color: colors.navy,
                            }}
                          >
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={atMax}
                            onClick={() =>
                              cart.setQuantity(
                                line.variant.id,
                                line.quantity + 1,
                              )
                            }
                            style={{
                              ...qtyBtnStyle,
                              opacity: atMax ? 0.35 : 1,
                              cursor: atMax ? "not-allowed" : "pointer",
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {lowStock && (
                          <span
                            style={{
                              fontSize: 11,
                              color: colors.gold,
                              background: "#fdf3dc",
                              padding: "3px 9px",
                              borderRadius: 999,
                              fontWeight: 600,
                            }}
                          >
                            Only {line.variant.stock} left
                          </span>
                        )}

                        <div
                          style={{
                            marginLeft: isMobile ? 0 : "auto",
                            textAlign: isMobile ? "left" : "right",
                            width: isMobile ? "100%" : "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <strong style={{ fontSize: 15, color: colors.navy }}>
                            {money(lineTotal)}
                          </strong>
                          {line.quantity > 1 && (
                            <span style={{ fontSize: 11, color: colors.muted }}>
                              {money(line.variant.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Continue shopping */}
            <div>
              <Link href="/#catalog" style={btnOutline}>
                <ArrowLeft size={15} /> Continue shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
                gap: 10,
                padding: 16,
                background: "#fafbfc",
                border: `1px solid ${colors.line}`,
                borderRadius: 14,
              }}
            >
              {[
                { Icon: ShieldCheck, label: "Secure checkout" },
                { Icon: Truck, label: "COD available" },
                { Icon: RotateCcw, label: "Easy returns" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: "#4b5563",
                    fontWeight: 500,
                  }}
                >
                  <Icon
                    size={18}
                    style={{ color: colors.red, flex: "0 0 auto" }}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT COLUMN (SUMMARY) ================= */}
          <aside
            style={{
              ...cardStyle,
              padding: 22,
              position: isMobile ? "static" : "sticky",
              top: 20,
              boxShadow: isMobile
                ? "none"
                : "0 8px 30px -20px rgba(20,20,40,0.25)",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: 16,
                fontWeight: 700,
                color: colors.navy,
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                fontSize: 13.5,
                color: "#4b5563",
              }}
            >
              <span>Items ({cart.count})</span>
              <span>{money(cart.subtotal)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                fontSize: 13.5,
                color: "#4b5563",
              }}
            >
              <span>Delivery</span>
              <span
                style={{
                  color: shippingFee === 0 ? colors.green : undefined,
                  fontWeight: shippingFee === 0 ? 700 : undefined,
                  letterSpacing: shippingFee === 0 ? "0.02em" : undefined,
                }}
              >
                {shippingFee ? money(shippingFee) : "FREE"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: `1px dashed ${colors.line}`,
                marginTop: 8,
                paddingTop: 14,
                fontSize: 15,
                fontWeight: 700,
                color: colors.navy,
              }}
            >
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            {/* Coupon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "16px 0 14px",
                padding: "8px 12px",
                border: "1px dashed #cbd2dc",
                borderRadius: 10,
                background: "#fafbfc",
              }}
            >
              <Tag
                size={15}
                style={{ color: colors.muted, flex: "0 0 auto" }}
              />
              <input
                type="text"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                aria-label="Coupon code"
                style={{
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  color: colors.navy,
                }}
              />
              <button
                type="button"
                disabled={!coupon.trim()}
                style={{
                  border: 0,
                  background: "transparent",
                  color: coupon.trim() ? colors.red : "#b7bcc6",
                  fontWeight: 700,
                  fontSize: 12.5,
                  padding: "4px 6px",
                  borderRadius: 6,
                  cursor: coupon.trim() ? "pointer" : "not-allowed",
                }}
              >
                Apply
              </button>
            </div>

            <Link href="/checkout" style={btnDark}>
              Proceed to checkout
            </Link>

            <p
              style={{
                fontSize: 11,
                color: colors.muted,
                lineHeight: 1.55,
                margin: "14px 0 0",
              }}
            >
              Sample estimate only; the store confirms actual price, stock, and
              delivery before fulfillment. Pay in cash if the order is
              confirmed.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${colors.line}`,
                fontSize: 12,
                color: "#4b5563",
              }}
            >
              <BadgePercent size={15} style={{ color: colors.red }} />
              <span>Best prices guaranteed on every piece</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
