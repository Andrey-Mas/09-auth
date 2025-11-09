import { fetchNoteById } from "@/lib/api/serverApi";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import NoteDetailsClient from "./NoteDetails.client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
