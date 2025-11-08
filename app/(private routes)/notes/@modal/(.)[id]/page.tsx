import { fetchNoteById } from "@/lib/api/serverApi";
import ViewNoteModal from "@/components/ViewNoteModal/ViewNoteModal";

export default async function ViewNoteModalPage({ params, searchParams }: any) {
  const note = await fetchNoteById(params.id);
  const from = searchParams?.from || "/notes";
  if (!note) return null;
  return <ViewNoteModal note={note} from={from} />;
}
