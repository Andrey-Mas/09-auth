import NotePreview from "./NotePreview.client";
import NoteDetails from "./NoteDetails.client";

export default async function NoteModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <NotePreview>
      <NoteDetails id={decodeURIComponent(id)} />
    </NotePreview>
  );
}
