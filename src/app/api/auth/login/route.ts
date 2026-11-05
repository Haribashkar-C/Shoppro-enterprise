import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { rateLimit } from "@/lib/http";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "login", 8)) {
    return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }
  try {
    const data = loginSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession(user.id, { name: user.name, email: user.email, role: user.role });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch {
    return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
  }
}
