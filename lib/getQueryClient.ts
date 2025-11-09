// lib/getQueryClient.ts
import { QueryClient } from "@tanstack/react-query";

export default function getQueryClient() {
  return new QueryClient();
}
