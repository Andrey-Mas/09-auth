import NotePreview from "../NotePreview.client";
import DeleteConfirm from "@/components/NoteActions/DeleteConfirm.client";

export default async function DeleteNoteModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <NotePreview>
      <DeleteConfirm id={decodeURIComponent(id)} />
    </NotePreview>
  );
}
