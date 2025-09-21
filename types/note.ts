// types/note.ts

/** Бекенд теги */
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

/** Нотатка */
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
  perPage?: number; // завжди 12 за ТЗ, але лишаємо як опцію
}

/** Нормалізована відповідь пагінації */
export interface PaginatedNotes {
  items: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

/** Сумісність зі старим ім'ям типу */
export type FetchNotesResponse = PaginatedNotes;

/** UI-список тегів для меню/сайдбару */
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

/** Елемент масиву TAGS_UI як об'єкт */
export type UITagOption = (typeof TAGS_UI)[number];

/** Значення тега для UI (рядок "All" або будь-який Tag) */
export type UITag = UITagOption["value"];
