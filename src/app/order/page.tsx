"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { PackageCheck, Search, MapPin, RefreshCw } from "lucide-react";
import { money } from "../../components/product-card";
import { useGetOrder, type GetOrderParams } from "../../lib/api";

const progress = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;
const labels = [
  "Order placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

function OrderLookupInner() {
  const searchParams = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(
    searchParams?.get("orderNumber") ?? "",
  );
  const [email, setEmail] = useState(searchParams?.get("email") ?? "");

  const [lookup, setLookup] = useState<GetOrderParams | null>(
    searchParams?.get("orderNumber") && searchParams?.get("email")
      ? {
          orderNumber: searchParams.get("orderNumber")!,
          email: searchParams.get("email")!,
        }
      : null,
  );

  const order = useGetOrder(lookup);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookup({ orderNumber: orderNumber.trim(), email: email.trim() });
  }

  const current = order.data ? progress.indexOf(order.data.status) : -1;

  return (
    <div className="container">
      <div className="page-top" style={{ textAlign: "center" }}>
        <div className="section-kicker">Here when you need us</div>
        <h1 className="page-title">Track your order</h1>
        <p className="page-subtitle">
          Enter the order number and email used at checkout.
        </p>
      </div>

      <div className="lookup-card">
        <form className="form-card" onSubmit={submit}>
          <h2>
            <PackageCheck
              size={20}
              style={{
                display: "inline",
                verticalAlign: "-4px",
                marginRight: 8,
                color: "var(--red)",
              }}
            />
            Find your Vishwa order
          </h2>

          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="orderNumber">Order number</label>
              <input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                placeholder="For example, VE-…"
                data-testid="input-order-number"
              />
            </div>
            <div className="form-field full">
              <label htmlFor="lookupEmail">Email address</label>
              <input
                id="lookupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="The email used for your order"
                data-testid="input-lookup-email"
              />
            </div>
          </div>

          <button
            className="btn btn-dark"
            style={{ width: "100%", marginTop: 19 }}
            disabled={order.isFetching}
          >
            <Search size={15} />
            {order.isFetching ? "Checking…" : "Look up order"}
          </button>
        </form>

        {order.isLoading && lookup && (
          <div className="form-card" style={{ marginTop: 16 }}>
            <div
              className="skeleton"
              style={{ height: 20, width: "45%", marginBottom: 18 }}
            />
            <div className="skeleton" style={{ height: 70 }} />
          </div>
        )}

        {order.isError && lookup && (
          <div className="empty-state" style={{ marginTop: 16 }}>
            <RefreshCw size={24} />
            <h2>We couldn’t find that order</h2>
            <p>Check the order number and email, then try again.</p>
            <button className="btn btn-outline" onClick={() => order.refetch()}>
              Try again
            </button>
          </div>
        )}

        {order.data && (
          <section className="form-card" style={{ marginTop: 17 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 15,
                alignItems: "start",
              }}
            >
              <div>
                <div className="section-kicker">
                  Order {order.data.orderNumber}
                </div>
                <h2 style={{ marginTop: 6 }}>
                  {order.data.status
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </h2>
              </div>
              <span className="product-badge" style={{ position: "static" }}>
                Cash on delivery
              </span>
            </div>

            <div className="status-steps">
              {labels.map((label, index) => (
                <div
                  className={`status-step ${index <= current ? "done" : ""}`}
                  key={label}
                >
                  <div className="status-dot" />
                  {label}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, color: "var(--muted)" }}>
              <MapPin
                size={14}
                style={{ display: "inline", verticalAlign: "-3px" }}
              />{" "}
              {order.data.addressLine1}
              {order.data.addressLine2
                ? `, ${order.data.addressLine2}`
                : ""}, {order.data.city}, {order.data.state}{" "}
              {order.data.pinCode}
            </p>

            <hr
              style={{
                border: 0,
                borderTop: "1px solid var(--line)",
                margin: "19px 0",
              }}
            />

            {order.data.lines.map((line, index) => (
              <div className="summary-line" key={`${line.sku}-${index}`}>
                <span>
                  {line.productName} · {line.color} / {line.size} ×{" "}
                  {line.quantity}
                </span>
                <strong>{money(line.unitPrice * line.quantity)}</strong>
              </div>
            ))}

            <div className="summary-line summary-total">
              <span>Total</span>
              <span>{money(order.data.total)}</span>
            </div>

            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              Placed{" "}
              {new Date(order.data.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default function OrderLookupPage() {
  return (
    <Suspense fallback={null}>
      <OrderLookupInner />
    </Suspense>
  );
}
