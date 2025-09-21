import NotePreview from "../[id]/NotePreview.client";
import NoteForm from "@/components/NoteForm/NoteForm";
export default function NewNoteModal() {
  return (
    <NotePreview>
      <NoteForm />
    </NotePreview>
  );
}
