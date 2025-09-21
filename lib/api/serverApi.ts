// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api } from "./api";
import type { User, UpdateUserDto } from "@/types";

// створюємо клієнт axios з куками із запиту
async function withServerCookies() {
  const cookieStore = await cookies(); // <-- важливо: await
  const cookieHeader = cookieStore.toString(); // формуємо Cookie header
  return api.create({
    headers: { Cookie: cookieHeader },
  });
}

export async function getMeServer(): Promise<User> {
  const client = await withServerCookies();
  const res = await client.get<User>("/users/me");
  return res.data;
}

export async function updateMeServer(dto: UpdateUserDto): Promise<User> {
  const client = await withServerCookies();
  const res = await client.patch<User>("/users/me", dto);
  return res.data;
}

export async function getSessionServer(): Promise<User | null> {
  const client = await withServerCookies();
  const res = await client.get<User | null>("/auth/session");
  return (res.data as User) ?? null;
}
