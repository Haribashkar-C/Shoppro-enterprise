import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AddToCart } from "@/components/product-actions";

export const revalidate = 60; // Cache product details for 60 seconds

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p || !p.active) notFound();

  return (
    <div className="container page">
      <div className="crumb">
        Home / Products / {p.name}
      </div>
      <div className="detail-grid">
        <div className="detail-image">
          <Image
            src={p.imageUrl}
            alt={p.name}
            width={800}
            height={800}
            priority
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        <div className="detail-info">
          <span className="eyebrow">{p.brand || "SHOPPRO COLLECTION"}</span>
          <h1>{p.name}</h1>
          <div className="rating">
            ★★★★★ <span className="muted">4.8 customer rating</span>
          </div>
          <div className="price">
            ₹{Number(p.price).toLocaleString("en-IN")}{" "}
            {p.compareAtPrice && (
              <span className="old-price">₹{Number(p.compareAtPrice).toLocaleString("en-IN")}</span>
            )}
          </div>
          <p>{p.description}</p>
          <p className="stock">
            {p.stock > 0 ? `✓ In stock · ${p.stock} available` : "Currently unavailable"}
          </p>
          <ul className="muted">
            <li>Secure and verified checkout</li>
            <li>Easy returns within 7 days</li>
            <li>Dedicated customer support</li>
          </ul>
          <AddToCart productId={p.id} stock={p.stock} />
          <p className="muted">SKU: {p.sku}</p>
        </div>
      </div>
    </div>
  );
}
