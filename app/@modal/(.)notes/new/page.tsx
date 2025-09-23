"use client";
import { useRouter } from "next/navigation";
import NotePreview from "../[id]/NotePreview.client";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function NewNoteModal() {
  const router = useRouter();
  const handleSuccess = () => {
    // закрити модалку; список оновиться через invalidateQueries у NoteForm
    router.back();
  };

  return (
    <NotePreview>
      <NoteForm submitLabel="Create" onSuccess={handleSuccess} />
    </NotePreview>
  );
}
