// lib/api/serverApi.ts
import axios, {
  isAxiosError,
  type AxiosError,
  type AxiosInstance,
} from "axios";
import { cookies } from "next/headers";
import type { User } from "@/types";

/** Абсолютний baseURL до наших app/api-роутів */
function resolveBaseURL() {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env) return env.replace(/\/+$/, "") + "/api";
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/+$/, "");
    const url = host.startsWith("http") ? host : `https://${host}`;
    return `${url}/api`;
  }
  return "http://localhost:3000/api";
}

/** Next 15: cookies() — async */
async function buildCookieHeader(): Promise<string> {
  const store = await cookies(); // обов’язково await
  const list = store.getAll();
  if (!list.length) return "";
  return list
    .map(
      (c: { name: string; value: string }) =>
        `${c.name}=${encodeURIComponent(c.value)}`,
    )
    .join("; ");
}

/** Axios-клієнт із куками поточного SSR-запиту */
export async function withServerCookies(): Promise<AxiosInstance> {
  const Cookie = await buildCookieHeader();
  return axios.create({
    baseURL: resolveBaseURL(), // ← тут реальний вираз
    withCredentials: true,
    headers: {
      ...(Cookie ? { Cookie } : {}),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

/** Читання профілю: 401 -> null */
export async function getMeServer(): Promise<User | null> {
  const client = await withServerCookies();
  try {
    const res = await client.get<User>("/users/me");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      const e = err as AxiosError<any>;
      if (e.response?.status === 401) return null;
    }
    throw err;
  }
}

/** Оновлення профілю: 401 -> null */
export async function updateMeServer(dto: Partial<User>): Promise<User | null> {
  const client = await withServerCookies();
  try {
    const res = await client.patch<User>("/users/me", dto);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      const e = err as AxiosError<any>;
      if (e.response?.status === 401) return null;
    }
    throw err;
  }
}
