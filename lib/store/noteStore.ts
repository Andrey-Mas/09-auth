"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DraftTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface DraftState {
  title: string;
  content: string;
  tag: DraftTag;
}

export const initialDraft: DraftState = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: DraftState;
  setDraft: (next: Partial<DraftState>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (next) =>
        set((state) => ({ draft: { ...state.draft, ...next } })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "notehub-draft", // ключ для localStorage
      partialize: (state) => ({ draft: state.draft }),
      version: 1,
    },
  ),
);
