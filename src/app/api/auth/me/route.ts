import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }
  return NextResponse.json(user, {
    headers: {
      // Private — only the browser may cache; never a shared proxy
      "Cache-Control": "private, no-store",
    },
  });
}
