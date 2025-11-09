import { fetchNoteById } from "@/lib/api/serverApi";
import ViewNoteModal from "@/components/ViewNoteModal/ViewNoteModal";

type Props = {
  params: { id: string };
};

export default async function NotesIdModalPage({ params }: Props) {
  const note = await fetchNoteById(params.id);

  if (!note) return null;

  return <ViewNoteModal note={note} />;
}
