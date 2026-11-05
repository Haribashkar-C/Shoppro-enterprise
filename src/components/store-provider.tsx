"use client";
import { createContext, useContext, useEffect, useState } from "react";

type CartLine = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
    stock: number;
    sku: string;
  };
};

type StoreCtx = {
  cart: CartLine[];
  count: number;
  refreshCart: () => Promise<void>;
  addToCart: (id: string, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, q: number) => Promise<void>;
  user: any;
  loading: boolean;
  setUser: (u: any) => void;
  refreshUser: () => Promise<any>;
  toast: (s: string) => void;
};

const C = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const toast = (s: string) => {
    setMessage(s);
    setTimeout(() => setMessage(""), 2600);
  };

  // Parallel user and cart initialization (cuts roundtrip latency in half)
  const refreshUser = async () => {
    try {
      const [meRes, cartRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/cart"),
      ]);
      if (meRes.ok) {
        const u = await meRes.json();
        setUser(u);
        if (cartRes.ok) {
          const d = await cartRes.json();
          setCart(d.items || []);
        }
        return u;
      } else {
        setUser(null);
        setCart([]);
        return null;
      }
    } catch {
      setUser(null);
      setCart([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    try {
      const r = await fetch("/api/cart");
      if (r.ok) {
        const d = await r.json();
        setCart(d.items || []);
      }
    } catch {}
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const addToCart = async (productId: string, quantity = 1) => {
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Could not add to cart");
    setCart(d.items || []);
    toast("Added to cart");
  };

  const removeFromCart = async (id: string) => {
    const r = await fetch("/api/cart/" + id, { method: "DELETE" });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    setCart(d.items || []);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const r = await fetch("/api/cart/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    setCart(d.items || []);
  };

  return (
    <C.Provider
      value={{
        cart,
        count: cart.reduce((n, x) => n + x.quantity, 0),
        refreshCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        user,
        loading,
        setUser,
        refreshUser,
        toast,
      }}
    >
      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
      {children}
    </C.Provider>
  );
}

export function useStore() {
  const v = useContext(C);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
