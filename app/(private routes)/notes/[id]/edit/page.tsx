import EditNoteForm from "@/components/NoteForm/EditNoteForm";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditNoteForm id={decodeURIComponent(id)} />;
}
