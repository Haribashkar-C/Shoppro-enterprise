import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";

// Static browsing (no filters) is cached for 30s via ISR.
// When search params are present Next.js automatically opts into dynamic rendering.
export const revalidate = 30;

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const cat = params.category || "";

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        ...(q
          ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] }
          : {}),
        ...(cat ? { category: { slug: cat } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="container page">
      <div className="section-head">
        <div>
          <span className="eyebrow">DISCOVER SOMETHING GREAT</span>
          <h2>All products</h2>
        </div>
        <span className="muted">{products.length} results</span>
      </div>

      <div className="category-row" style={{ gridTemplateColumns: "repeat(5,1fr)", marginBottom: 22 }}>
        <Link className="category-card" href="/products">
          <span>All</span>
        </Link>
        {categories.map((c) => (
          <Link className="category-card" key={c.id} href={`/products?category=${c.slug}`}>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>

      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">No products found. Try a different search or category.</div>
      )}
    </div>
  );
}
