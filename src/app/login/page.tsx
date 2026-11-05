import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="container page" style={{ maxWidth: 520 }}>
      <div className="panel">
        <span className="eyebrow">WELCOME BACK</span>
        <h2 style={{ fontFamily: "Manrope", fontSize: 28 }}>Sign in to ShopPro</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm mode="login" redirect={params.redirect} />
        </Suspense>
      </div>
    </div>
  );
}
