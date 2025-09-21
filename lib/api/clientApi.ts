// lib/api/clientApi.ts
import { api } from "./api";
import type {
  User,
  Note,
  Tag,
  NotesQuery,
  PaginatedNotes,
  UpdateNoteDto,
} from "@/types";

/* ========== AUTH ========== */
export async function login(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await api.post<User>("/auth/login", payload);
  return res.data;
}
export async function register(payload: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await api.post<User>("/auth/register", payload);
  return res.data;
}
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
export async function getSessionClient(): Promise<User | null> {
  try {
    const res = await api.get<User | null>("/auth/session");
    const data: any = res.data;
    if (data && typeof data === "object" && (data.email || data.id))
      return data as User;
    try {
      const me = await api.get<User>("/users/me");
      return me.data;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/* ========== USERS ========== */
export async function getMe(): Promise<User> {
  const res = await api.get<User>("/users/me");
  return res.data;
}
export async function updateMe(dto: Partial<User>): Promise<User> {
  const res = await api.patch<User>("/users/me", dto);
  return res.data;
}

/* ========== NOTES ========== */
export async function getNotes(params: NotesQuery): Promise<PaginatedNotes> {
  const res = await api.get<unknown>("/notes", { params });
  const raw: unknown = res.data;
  const perPage = params.perPage ?? 12;
  const page = Number(params.page ?? 1);

  if (Array.isArray(raw)) {
    const items = raw as Note[];
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    return { items, page, perPage, totalItems, totalPages };
  }
  const data = raw as any;
  const items: Note[] =
    data?.items ?? data?.results ?? data?.data ?? data?.notes ?? [];
  const totalItems: number =
    typeof data?.totalItems === "number" ? data.totalItems : items.length;
  const totalPages: number =
    typeof data?.totalPages === "number"
      ? data.totalPages
      : Math.max(1, Math.ceil(totalItems / (data?.perPage ?? perPage)));

  return {
    items,
    page: data?.page ?? page,
    perPage: data?.perPage ?? perPage,
    totalItems,
    totalPages,
  };
}
export async function getNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}
export async function createNote(payload: {
  title: string;
  content: string;
  tag: Tag;
}): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}
export async function updateNote(
  id: string,
  dto: UpdateNoteDto,
): Promise<Note> {
  const res = await api.patch<Note>(`/notes/${id}`, dto);
  return res.data;
}
export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}

/* ---- aliases для зворотної сумісності ---- */
export { getMe as getMeClient, updateMe as updateMeClient };
