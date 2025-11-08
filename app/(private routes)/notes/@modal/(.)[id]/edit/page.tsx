import { fetchNoteById } from "@/lib/api/serverApi";
import EditNoteModal from "@/components/EditNoteModal/EditNoteModal";

export default async function EditNoteModalPage({ params, searchParams }: any) {
  const note = await fetchNoteById(params.id);
  const from = searchParams?.from || "/notes";
  if (!note) return null;
  return <EditNoteModal note={note} from={from} />;
}
