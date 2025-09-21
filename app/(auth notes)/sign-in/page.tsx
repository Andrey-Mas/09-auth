"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  // ВСІ ХУКИ — ДО БУДЬ-ЯКОГО УМОВНОГО return
  const [mounted, setMounted] = useState(false);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (form: { email: string; password: string }) => {
      const user = await login(form);
      setUser(user);
      return user;
    },
    onSuccess: () => router.replace("/profile"),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // форма рендериться лише на клієнті (анти-hydration)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await mutateAsync({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
    });
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={onSubmit} noValidate>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            autoComplete="username email"
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            autoComplete="current-password"
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </div>

        {error && (
          <p className={css.error}>
            {(error as any)?.response?.data?.message || "Login failed"}
          </p>
        )}
      </form>
    </main>
  );
}
