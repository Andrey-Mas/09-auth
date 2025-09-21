// types/note.ts

/** Доступні теги з бекенда */
export type Tag =
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Ideas"
  | "Travel"
  | "Finance"
  | "Health"
  | "Important"
  | "Todo";

/** Модель нотатки */
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt?: string;
  updatedAt?: string;
}

/** Параметри запиту списку нотаток */
export interface NotesQuery {
  search?: string;
  tag?: Tag;
  page?: number;
  perPage?: number; // ← ВАЖЛИВО: є perPage
}

/** Нормалізована відповідь зі списком (для пагінації) */
export interface PaginatedNotes {
  items: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

/** Сумісність зі старою назвою */
export type FetchNotesResponse = PaginatedNotes;

/** DTO для оновлення нотатки */
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tag?: Tag;
}

/** UI-набір тегів (для меню/сайдбару) */
export const TAGS_UI = [
  { value: "All", label: "All" },
  { value: "Work", label: "Work" },
  { value: "Personal", label: "Personal" },
  { value: "Meeting", label: "Meeting" },
  { value: "Shopping", label: "Shopping" },
  { value: "Ideas", label: "Ideas" },
  { value: "Travel", label: "Travel" },
  { value: "Finance", label: "Finance" },
  { value: "Health", label: "Health" },
  { value: "Important", label: "Important" },
  { value: "Todo", label: "Todo" },
] as const;

/** Тип одного елемента TAGS_UI */
export type UITagOption = (typeof TAGS_UI)[number];

/** Значення тега для UI (рядок) */
export type UITag = UITagOption["value"];
