import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/logout-button";

export const dynamic = "force-dynamic";

export default async function Account() {
  const u = await currentUser();
  if (!u) redirect("/login");
  const [orders, wishlist] = await Promise.all([
    prisma.order.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.wishlist.count({ where: { userId: u.id } }),
  ]);

  return (
    <div className="container page">
      <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow">MY ACCOUNT</span>
          <h2>Welcome back, {u.name}</h2>
        </div>
        <LogoutButton />
      </div>
      <div className="stats">
        <div className="stat">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="stat">
          <span>Wishlist items</span>
          <strong>{wishlist}</strong>
        </div>
        <div className="stat">
          <span>Account type</span>
          <strong>{u.role}</strong>
        </div>
        <div className="stat">
          <span>Support</span>
          <strong>24/7</strong>
        </div>
      </div>
      <div className="panel">
        <h2>Recent orders</h2>
        {orders.map((o) => (
          <div className="summary-line" key={o.id}>
            <span>
              #{o.orderNumber} · {o.status}
            </span>
            <b>₹{Number(o.total).toLocaleString("en-IN")}</b>
            <Link href={`/tracking/${o.orderNumber}`}>Track</Link>
          </div>
        ))}
        {!orders.length && <p className="muted">No orders yet.</p>}
        <div style={{ marginTop: 16 }}>
          <Link className="btn light" href="/orders">
            View all orders
          </Link>
        </div>
      </div>
    </div>
  );
}
