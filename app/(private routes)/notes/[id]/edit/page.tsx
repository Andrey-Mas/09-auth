import { fetchNoteById } from "@/lib/api/serverApi";
import EditNoteModal from "@/components/EditNoteModal/EditNoteModal";

type Props = {
  params: { id: string };
};

export default async function EditNotePage({ params }: Props) {
  const note = await fetchNoteById(params.id);

  if (!note) {
    return (
      <main>
        <p>Note not found.</p>
      </main>
    );
  }

  // Повноекранний варіант редагування
  return (
    <main>
      <EditNoteModal note={note} from="/notes" />
    </main>
  );
}
