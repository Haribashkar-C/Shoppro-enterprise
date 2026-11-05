import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "development-secret-change-this-before-deploying-32");
const COOKIE = "shoppro_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function createSession(userId: string, data?: { name?: string; email?: string; role?: string }) {
  const payload: Record<string, any> = { sub: userId };
  if (data?.name) payload.name = data.name;
  if (data?.email) payload.email = data.email;
  if (data?.role) payload.role = data.role;

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub !== "string") return null;

    // Fast path: in-memory verification directly from JWT payload
    if (payload.name && payload.email && payload.role) {
      return {
        id: payload.sub,
        name: String(payload.name),
        email: String(payload.email),
        role: String(payload.role),
      };
    }

    // Fallback: database lookup for older tokens
    return await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function originGuard(req: NextRequest) {
  const origin = req.headers.get("origin");
  const expected = process.env.APP_URL;
  if (origin && expected && new URL(origin).host !== new URL(expected).host) return false;
  return true;
}
