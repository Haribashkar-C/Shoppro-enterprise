import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@shoppro.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: "ShopPro Admin", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: "ADMIN" }
  });
  const categoryData = [
    ["Electronics","electronics","https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800"],
    ["Fashion","fashion","https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"],
    ["Home & Living","home-living","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    ["Office Supplies","office-supplies","https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"],
    ["Beauty & Care","beauty-care","https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800"]
  ];
  for (const [name,slug,imageUrl] of categoryData) {
    const category = await prisma.category.upsert({ where:{slug}, update:{}, create:{name,slug,imageUrl} });
    const products = [
      ["Sony WH-1000XM5 Wireless Headphones","sony-wh1000xm5","Premium noise cancelling wireless headphones with exceptional comfort.","SONY",32999,39999,18,"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",true],
      ["MacBook Air M2","macbook-air-m2","Powerful, lightweight laptop for work and creativity.","APPLE",79999,89999,12,"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900",true],
      ["Samsung Galaxy S24","samsung-galaxy-s24","A flagship smartphone with a brilliant display and camera.","SAMSUNG",64999,72999,20,"https://images.unsplash.com/photo-151170 use?x=1",false],
      ["AirPods Pro","airpods-pro","Wireless earbuds with active noise cancellation.","APPLE",24999,27999,30,"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=900",false]
    ];
    for (const [name,slug,description,brand,price,compareAtPrice,stock,imageUrl,featured] of products) {
      if (category.slug !== "electronics") continue;
      const safeImage = String(imageUrl).includes("151170 use") ? "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900" : String(imageUrl);
      await prisma.product.upsert({where:{slug:String(slug)},update:{},create:{name:String(name),slug:String(slug),description:String(description),brand:String(brand),sku:String(slug).toUpperCase(),price:Number(price),compareAtPrice:Number(compareAtPrice),stock:Number(stock),imageUrl:safeImage,featured:Boolean(featured),categoryId:category.id}});
    }
  }
}
main().finally(()=>prisma.$disconnect());
