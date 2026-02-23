"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useAuthViewModel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pass }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    setLoading(true);
    // Bu komut seni Apple'ın resmi sitesine (appleid.apple.com) yönlendirir
    await signIn("apple", { callbackUrl: "/dashboard" });
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    // Bu komut seni Google'ın resmi sitesine (accounts.google.com) yönlendirir
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return {
    login,
    loginWithApple,
    loginWithGoogle,
    loading,
    error,
  };
}
