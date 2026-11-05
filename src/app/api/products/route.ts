import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const category = req.nextUrl.searchParams.get("category") || "";

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(q ? { OR: [{ name: { contains: q } }, { description: { contains: q } }] } : {}),
      ...(category ? { category: { slug: category } } : {}),
    },
    take: 60,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
