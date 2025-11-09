"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

type Props = {
  noteId?: string;
};

export default function NoteDetailsClient({ noteId }: Props) {
  const params = useParams();
  const id = noteId || (params?.id as string);

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (!id) return <p>Note ID is missing</p>;
  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Note not found</p>;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.content}</p>
      <p>{data.tag}</p>
    </div>
  );
}
