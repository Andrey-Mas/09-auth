import NotePreview from "../NotePreview.client";
import EditNoteForm from "@/components/NoteForm/EditNoteForm";

export default async function EditNoteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <NotePreview>
      <EditNoteForm id={decodeURIComponent(id)} />
    </NotePreview>
  );
}
