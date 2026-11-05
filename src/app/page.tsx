import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const revalidate = 60; // Cache for 60 seconds (ISR)

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { featured: "desc" },
      take: 8,
    }),
    prisma.category.findMany({ take: 5 }),
  ]);

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">SMART SHOPPING. BETTER BUSINESS.</span>
          <h1>
            Premium products
            <br />
            for <span>your world.</span>
          </h1>
          <p>Discover quality electronics, lifestyle essentials and workplace favourites — all in one seamless shopping experience.</p>
          <Link className="btn gold" href="/products">
            Shop now →
          </Link>
        </div>
        <div className="hero-image">
          <Image
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200"
            alt="Premium technology products"
            fill
            priority
            sizes="(max-width:700px) 100vw, 50vw"
            style={{ objectFit: "cover", borderRadius: 12 }}
          />
          <div className="hero-sticker">
            <b>THE SMARTER CHOICE</b>
            <br />
            <span className="muted">Curated for work and life</span>
          </div>
        </div>
      </section>
      <section className="benefits">
        <div className="benefit">
          <Truck size={20} /> Free shipping over ₹2,999
        </div>
        <div className="benefit">
          <ShieldCheck size={20} /> Secure checkout
        </div>
        <div className="benefit">
          <RefreshCw size={20} /> Easy 7-day returns
        </div>
        <div className="benefit">
          <Headphones size={20} /> Dedicated support
        </div>
      </section>
      <section>
        <div className="section-head">
          <div>
            <span className="eyebrow">EXPLORE DEPARTMENTS</span>
            <h2>Shop by category</h2>
          </div>
          <Link className="muted" href="/products">
            View all →
          </Link>
        </div>
        <div className="category-row">
          {categories.map((c) => (
            <Link className="category-card" key={c.id} href={`/products?category=${c.slug}`}>
              {c.imageUrl && (
                <Image
                  src={c.imageUrl}
                  alt={c.name}
                  width={280}
                  height={105}
                  style={{ width: "100%", height: 105, objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              )}
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <div className="section-head">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Featured products</h2>
          </div>
          <Link className="muted" href="/products">
            View all →
          </Link>
        </div>
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>
    </div>
  );
}
