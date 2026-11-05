"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "./store-provider";

export function AuthForm({
  mode,
  redirect,
}: {
  mode: "login" | "register";
  redirect?: string;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { refreshUser, refreshCart, setUser } = useStore();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const r = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Unable to continue");

      // Synchronously update store state
      setUser(d);
      await refreshCart();
      await refreshUser();

      const target = redirect && redirect.startsWith("/") ? redirect : "/account";
      router.push(target);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const switchHref = redirect
    ? `${mode === "login" ? "/register" : "/login"}?redirect=${encodeURIComponent(redirect)}`
    : mode === "login"
    ? "/register"
    : "/login";

  return (
    <form className="form" onSubmit={submit}>
      {mode === "register" && (
        <label>
          Full name
          <input name="name" required minLength={2} maxLength={100} />
        </label>
      )}
      <label>
        Email address
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 10 : 1}
          maxLength={72}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      {error && (
        <div className="notice" style={{ background: "#fff0f0", color: "#a33" }}>
          {error}
        </div>
      )}
      <button className="btn gold" disabled={busy}>
        {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="muted">
        {mode === "login" ? (
          <>
            New here? <Link href={switchHref}>Create an account</Link>
          </>
        ) : (
          <>
            Already registered? <Link href={switchHref}>Sign in</Link>
          </>
        )}
      </p>
    </form>
  );
}
