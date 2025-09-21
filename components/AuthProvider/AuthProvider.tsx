"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getSessionClient } from "@/lib/api/clientApi";
import type { User } from "@/types";

type Props = {
  children: React.ReactNode;
  initialUser?: User | null; // ← опційно
};

const PRIVATE_PREFIX = ["/profile", "/notes"];

export default function AuthProvider({ children, initialUser }: Props) {
  const pathname = usePathname();

  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clearIsAuthenticated);

  const [checking, setChecking] = useState(true);

  // 1) Праймимо стор з initialUser, якщо його передали з сервера
  useEffect(() => {
    if (typeof initialUser !== "undefined") {
      if (initialUser) setUser(initialUser);
      else clear();
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // лише на маунт

  // 2) Перевірка сесії при зміні маршруту (допомагає, якщо initialUser не передають)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const user = await getSessionClient(); // User | null
        if (user) setUser(user);
        else clear();
      } catch {
        clear();
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pathname, setUser, clear]);

  const isPrivate = PRIVATE_PREFIX.some((p) => pathname?.startsWith(p));
  if (isPrivate && checking) return null; // можна показувати лоадер

  return <>{children}</>;
}
