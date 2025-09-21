// lib/api/api.ts
import axios, { AxiosError } from "axios";

function resolveOrigin() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}

const origin = resolveOrigin();
const baseURL = `${origin}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = String(error.config?.url || "");

    // ВАЖЛИВО: не редіректимо для перевірки сесії
    const bypass = url.includes("/auth/session") || url.includes("/users/me");

    if (!bypass && (status === 401 || status === 403)) {
      try {
        const { useAuthStore } = await import("@/lib/store/authStore");
        useAuthStore.getState().clearIsAuthenticated();
      } catch {}
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/sign-in")
      ) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  },
);
