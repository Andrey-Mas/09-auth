// types/note.ts

// Теги з бекенда
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

// Значення тегу у UI (включає "All")
export type UITagValue = "All" | Tag;

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

export type UITag = (typeof TAGS_UI)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export interface NotesQuery {
  search?: string;
  tag?: Tag;
  page?: number;
  perPage?: number; // 12
}

export interface PaginatedNotes {
  items: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tag?: Tag;
}
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tag?: Tag; // той самий Tag, що й у Note
}