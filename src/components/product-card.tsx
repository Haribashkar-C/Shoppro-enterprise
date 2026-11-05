import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} prefetch={false}>
        <div className="product-photo">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width:700px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>
      </Link>
      <div className="product-body">
        <div className="product-brand">{product.brand || "ShopPro"}</div>
        <Link href={`/products/${product.slug}`} prefetch={false}>
          <h3>{product.name}</h3>
        </Link>
        <div className="rating">★★★★★ <span className="muted">4.8</span></div>
        <div className="price">
          ₹{Number(product.price).toLocaleString("en-IN")}
          {product.compareAtPrice && (
            <span className="old-price">
              ₹{Number(product.compareAtPrice).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <div className="product-actions">
          <Link className="btn light" href={`/products/${product.slug}`} prefetch={false}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
