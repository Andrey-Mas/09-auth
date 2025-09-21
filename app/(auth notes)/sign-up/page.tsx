"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  // УСІ ХУКИ — ДО БУДЬ-ЯКОГО УМОВНОГО return
  const [mounted, setMounted] = useState(false);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const user = await register(payload);
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
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    });
  }

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={onSubmit} noValidate>
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
            autoComplete="new-password"
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </div>

        {error && (
          <p className={css.error}>
            {(error as any)?.response?.data?.message || "Registration failed"}
          </p>
        )}
      </form>
    </main>
  );
}
