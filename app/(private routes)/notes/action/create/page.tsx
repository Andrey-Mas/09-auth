"use client";

import * as React from "react";
import NoteForm from "@/components/NoteForm/NoteForm";
import { useRouter } from "next/navigation";

export default function CreateNotePage() {
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1>Create note</h1>
      <NoteForm
        submitLabel="Create"
        onSuccess={() => router.replace("/notes/filter/All")}
      />
    </main>
  );
}
