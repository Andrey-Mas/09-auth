"use client";
import { useRouter } from "next/navigation";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function NewNotePage() {
  const router = useRouter();
  return (
    <NoteForm
      submitLabel="Create"
      onSuccess={() => router.replace("/notes/filter/All")}
    />
  );
}
