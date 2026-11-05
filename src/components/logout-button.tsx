"use client";
import { useRouter } from "next/navigation";
import { useStore } from "./store-provider";

export function LogoutButton() {
  const router = useRouter();
  const { setUser } = useStore();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <button type="button" className="btn light" onClick={handleLogout}>
      Sign out
    </button>
  );
}
