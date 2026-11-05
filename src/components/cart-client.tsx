"use client";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "./store-provider";
import { useEffect } from "react";

const money = (n: number) => "₹" + n.toLocaleString("en-IN");

export function CartClient() {
  const { cart, removeFromCart, updateQuantity, user, loading, refreshCart } = useStore();

  useEffect(() => {
    refreshCart();
  }, []);

  const total = cart.reduce((s, x) => s + Number(x.product.price) * x.quantity, 0);

  if (loading) {
    return (
      <div className="panel" style={{ textAlign: "center", padding: "48px 20px" }}>
        <p className="muted">Loading your cart...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty">
        Please <Link href="/login?redirect=/cart">sign in</Link> to view your cart.
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="panel">
        <h2>Cart items ({cart.length})</h2>
        {cart.map((i) => (
          <div className="cart-row" key={i.id}>
            <Image src={i.product.imageUrl} alt={i.product.name} width={80} height={80} />
            <div>
              <h3>{i.product.name}</h3>
              <div className="muted">{money(Number(i.product.price))}</div>
              <div className="qty">
                <button type="button" onClick={() => updateQuantity(i.id, Math.max(1, i.quantity - 1))}>−</button>
                {i.quantity}
                <button type="button" onClick={() => updateQuantity(i.id, Math.min(i.product.stock, i.quantity + 1))}>＋</button>
                <button type="button" className="btn light" onClick={() => removeFromCart(i.id)}>
                  Remove
                </button>
              </div>
            </div>
            <b>{money(Number(i.product.price) * i.quantity)}</b>
          </div>
        ))}
        {!cart.length && (
          <div className="empty">
            Your cart is empty. <Link href="/products">Explore products →</Link>
          </div>
        )}
      </section>
      <aside className="panel">
        <h2>Order summary</h2>
        <div className="summary-line">
          <span>Subtotal</span>
          <b>{money(total)}</b>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <b>{total >= 2999 || total === 0 ? "Free" : money(99)}</b>
        </div>
        <div className="summary-line">
          <span>Tax (included)</span>
          <b>Included</b>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <b>{money(total + (total >= 2999 || total === 0 ? 0 : 99))}</b>
        </div>
        <Link className="btn gold" style={{ width: "100%" }} href={cart.length ? "/checkout" : "/products"}>
          Proceed to checkout →
        </Link>
      </aside>
    </div>
  );
}
