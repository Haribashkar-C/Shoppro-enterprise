"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store-provider";

export function AddToCart({ productId, stock }: { productId: string; stock: number }) {
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const { addToCart, user, loading } = useStore();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user && !loading) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/products";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setBusy(true);
    try {
      await addToCart(productId, qty);
      router.push("/cart");
    } catch (e: any) {
      if (e.message === "Unauthorized") {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "/products";
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        alert(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user && !loading) {
      router.push(`/login?redirect=/checkout`);
      return;
    }
    setBusy(true);
    try {
      await addToCart(productId, qty);
      router.push("/checkout");
    } catch (e: any) {
      if (e.message === "Unauthorized") {
        router.push(`/login?redirect=/checkout`);
      } else {
        alert(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="qty">
        <b>Quantity</b>
        <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
        {qty}
        <button type="button" onClick={() => setQty(Math.min(stock, qty + 1))}>＋</button>
      </div>
      <div className="product-actions">
        <button
          type="button"
          className="btn"
          disabled={!stock || busy}
          onClick={handleAddToCart}
        >
          {busy ? "Adding..." : "Add to cart"}
        </button>
        <button
          type="button"
          className="btn gold"
          disabled={!stock || busy}
          onClick={handleBuyNow}
        >
          {busy ? "Processing..." : "Buy now"}
        </button>
      </div>
    </>
  );
}
