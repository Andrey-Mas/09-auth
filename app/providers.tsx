// app/providers.tsx
"use client";

import type { ReactNode } from "react";
import QueryProvider from "@/components/QueryProvider/QueryProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
