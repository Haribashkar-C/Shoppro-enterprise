import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { rateLimit } from "@/lib/http";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "register", 5)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  try {
    const data = registerSchema.parse(await req.json());
    const email = data.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email,
        passwordHash: await bcrypt.hash(data.password, 12),
      },
    });
    await createSession(user.id, { name: user.name, email: user.email, role: user.role });
    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.issues?.[0]?.message || "Invalid registration data" }, { status: 400 });
  }
}
