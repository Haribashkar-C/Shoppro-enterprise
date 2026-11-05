"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store-provider";
import Link from "next/link";

const money = (n: number) => "₹" + n.toLocaleString("en-IN");

export function CheckoutForm() {
  const { cart, user, loading, refreshCart } = useStore();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    refreshCart();
  }, []);

  const subtotal = cart.reduce((s, x) => s + Number(x.product.price) * x.quantity, 0);
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Order failed");
      await refreshCart();
      router.push(`/order-success?order=${d.orderNumber}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: "48px 20px" }}>
        <p className="muted">Verifying your session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty">
        Please sign in before checkout. <Link href="/login?redirect=/checkout">Sign in</Link>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="empty">
        Your cart is empty. <Link href="/products">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      <form className="panel form" onSubmit={submit}>
        <h2>Shipping address</h2>
        <div className="form-grid">
          <label>
            Full name
            <input name="shippingName" defaultValue={user.name || ""} required minLength={2} maxLength={120} />
          </label>
          <label>
            Phone number
            <input name="phone" required pattern="[0-9+() -]{8,20}" placeholder="+91 9876543210" />
          </label>
          <label className="wide">
            Address
            <input name="addressLine" required minLength={5} maxLength={250} placeholder="House/Flat number, Street name" />
          </label>
          <label>
            City
            <input name="city" required minLength={2} maxLength={100} />
          </label>
          <label>
            State
            <input name="state" required minLength={2} maxLength={100} />
          </label>
          <label>
            Postal code
            <input name="postalCode" required minLength={4} maxLength={12} />
          </label>
          <label>
            Payment method
            <select name="paymentMethod">
              <option value="COD">Cash on Delivery</option>
            </select>
          </label>
          <label className="wide">
            Delivery notes (optional)
            <textarea name="notes" maxLength={500} />
          </label>
        </div>
        {error && (
          <div className="notice" style={{ background: "#fff0f0", color: "#a33" }}>
            {error}
          </div>
        )}
        <button className="btn gold" disabled={busy}>
          {busy ? "Placing order…" : "Place order · " + money(subtotal + shipping)}
        </button>
        <p className="muted">Your personal information is sent securely over HTTPS in production.</p>
      </form>
      <aside className="panel">
        <h2>Order summary</h2>
        {cart.map((i) => (
          <div className="summary-line" key={i.id}>
            <span>
              {i.product.name} × {i.quantity}
            </span>
            <b>{money(Number(i.product.price) * i.quantity)}</b>
          </div>
        ))}
        <div className="summary-line">
          <span>Subtotal</span>
          <b>{money(subtotal)}</b>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <b>{shipping ? money(shipping) : "Free"}</b>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <b>{money(subtotal + shipping)}</b>
        </div>
      </aside>
    </div>
  );
}
