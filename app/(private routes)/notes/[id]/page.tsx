import { fetchNoteById } from "@/lib/api/serverApi";
import css from "./page.module.css";

type Props = {
  params: { id: string };
};

export default async function NotePage({ params }: Props) {
  const note = await fetchNoteById(params.id);

  if (!note) {
    return (
      <main className={css.main}>
        <p>Note not found.</p>
      </main>
    );
  }

  return (
    <main className={css.main}>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.tag}>{note.tag}</p>
      <p className={css.content}>{note.content}</p>
    </main>
  );
}
