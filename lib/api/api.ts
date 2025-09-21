// lib/api/api.ts
import axios from "axios";

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

export const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
