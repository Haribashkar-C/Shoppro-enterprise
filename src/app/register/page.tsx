import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="container page" style={{ maxWidth: 520 }}>
      <div className="panel">
        <span className="eyebrow">JOIN SHOPPRO</span>
        <h2 style={{ fontFamily: "Manrope", fontSize: 28 }}>Create your account</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthForm mode="register" redirect={params.redirect} />
        </Suspense>
      </div>
    </div>
  );
}
