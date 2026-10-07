'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { useShopCart } from '../../components/shop-context';
import { money } from '../../components/product-card';
import { useCreateOrder, type Order, type OrderInput } from '../../lib/api';

export default function CheckoutPage() {
  const cart = useShopCart();
  const router = useRouter();
  const createOrder = useCreateOrder();
  const [placed, setPlaced] = useState<Order | null>(null);
  const [formError, setFormError] = useState('');
  const shippingFee = cart.subtotal >= 999 ? 0 : 99;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const form = new FormData(event.currentTarget);
    const payload: OrderInput = {
      customerName: String(form.get('customerName') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      addressLine1: String(form.get('addressLine1') || '').trim(),
      addressLine2: String(form.get('addressLine2') || '').trim() || null,
      city: String(form.get('city') || '').trim(),
      state: String(form.get('state') || '').trim(),
      pinCode: String(form.get('pinCode') || '').trim(),
      note: String(form.get('note') || '').trim() || null,
      lines: cart.lines.map((line) => ({
        variantId: line.variant.id,
        quantity: line.quantity,
      })),
    };

    if (!payload.lines.length) {
      setFormError('Your bag is empty. Add a piece before checking out.');
      return;
    }

    createOrder.mutate(
      { data: payload },
      {
        onSuccess: (order) => {
          cart.clear();
          setPlaced(order);
        },
        onError: () =>
          setFormError(
            'We couldn’t place the order just now. Please check your details and try again.'
          ),
      }
    );
  }

  if (placed) {
    return (
      <div className="container">
        <div className="order-success">
          <div className="success-mark">
            <Check size={28} />
          </div>
          <div className="section-kicker">Order received</div>
          <h1 className="page-title" style={{ fontSize: 38, marginTop: 8 }}>
            Shukriya, {placed.customerName.split(' ')[0]}.
          </h1>
          <p className="page-subtitle">
            Your order is recorded. The store will confirm sample prices and stock before
            fulfillment.
          </p>
          <div className="order-number">{placed.orderNumber}</div>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Payment: Cash on delivery · Status: {placed.status.replaceAll('_', ' ')}
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>
            Save your order number and use it with {placed.email} to check status.
          </p>
          <Link
            className="btn btn-dark"
            href={`/order-lookup?orderNumber=${encodeURIComponent(
              placed.orderNumber
            )}&email=${encodeURIComponent(placed.email)}`}
          >
            View order details
          </Link>
          <p>
            <Link href="/" className="text-link" style={{ fontSize: 12 }}>
              Back to Vishwa home
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!cart.lines.length) {
    return (
      <div className="container">
        <div className="page-top">
          <h1 className="page-title">Checkout</h1>
        </div>
        <div className="empty-state" style={{ marginBottom: 70 }}>
          <h2>Your bag is empty</h2>
          <p>Add something you love and it will be waiting here.</p>
          <Link href="/#catalog" className="btn btn-dark">
            Browse the collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-top">
        <div className="breadcrumb">
          <Link href="/cart">Your bag</Link> / Checkout
        </div>
        <h1 className="page-title">Delivery details</h1>
        <p className="page-subtitle">
          Just a few details, then your Vishwa picks are on their way.
        </p>
      </div>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={submit}>
          <h2>
            <MapPin
              size={19}
              style={{ display: 'inline', verticalAlign: '-3px', marginRight: 8, color: 'var(--red)' }}
            />
            Where should we deliver?
          </h2>

          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="customerName">Full name *</label>
              <input
                id="customerName"
                name="customerName"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address *</label>
              <input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Phone number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                minLength={10}
                maxLength={16}
                autoComplete="tel"
                placeholder="10-digit number"
              />
            </div>
            <div className="form-field full">
              <label htmlFor="addressLine1">House / street / area *</label>
              <input
                id="addressLine1"
                name="addressLine1"
                required
                minLength={3}
                maxLength={200}
                autoComplete="address-line1"
              />
            </div>
            <div className="form-field full">
              <label htmlFor="addressLine2">Landmark (optional)</label>
              <input
                id="addressLine2"
                name="addressLine2"
                maxLength={200}
                autoComplete="address-line2"
              />
            </div>
            <div className="form-field">
              <label htmlFor="city">Town / city *</label>
              <input
                id="city"
                name="city"
                required
                defaultValue="Jaunpur"
                autoComplete="address-level2"
              />
            </div>
            <div className="form-field">
              <label htmlFor="state">State *</label>
              <input
                id="state"
                name="state"
                required
                defaultValue="Uttar Pradesh"
                autoComplete="address-level1"
              />
            </div>
            <div className="form-field">
              <label htmlFor="pinCode">PIN code *</label>
              <input
                id="pinCode"
                name="pinCode"
                required
                pattern="[0-9]{6}"
                maxLength={6}
                inputMode="numeric"
                autoComplete="postal-code"
              />
            </div>
            <div className="form-field full">
              <label htmlFor="note">Delivery note (optional)</label>
              <textarea
                id="note"
                name="note"
                maxLength={500}
                placeholder="Anything our delivery team should know?"
              />
            </div>
          </div>

          <div className="cod-box">
            <CreditCard size={23} />
            <div>
              <strong>Cash on delivery</strong>
              Pay in cash when your order reaches you. No online payment needed.
            </div>
          </div>

          {formError && (
            <p className="error-note" role="alert">
              {formError}
            </p>
          )}
          {createOrder.isError && !formError && (
            <p className="error-note" role="alert">
              Order could not be placed. Please try again.
            </p>
          )}

          <button
            className="btn btn-dark"
            style={{ width: '100%' }}
            type="submit"
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? 'Placing your order…' : 'Place COD order'} <ShieldCheck size={16} />
          </button>
        </form>

        <aside className="summary-card">
          <h2>Your picks</h2>
          {cart.lines.map((line) => (
            <div className="summary-line" key={line.variant.id}>
              <span>
                {line.product.name} · {line.variant.size} × {line.quantity}
              </span>
              <strong>{money(line.variant.price * line.quantity)}</strong>
            </div>
          ))}
          <div className="summary-line">
            <span>Items subtotal</span>
            <span>{money(cart.subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <span>{shippingFee ? money(shippingFee) : 'Free'}</span>
          </div>
          <div className="summary-line summary-total">
            <span>Estimated total</span>
            <span>{money(cart.subtotal + shippingFee)}</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
            Sample estimate only. The store confirms actual price, stock, and delivery before
            fulfillment.
          </p>
          <Link href="/cart" className="text-link" style={{ fontSize: 12 }}>
            Edit your bag
          </Link>
        </aside>
      </div>
    </div>
  );
}