import NoteDetails from "@/app/@modal/(.)notes/[id]/NoteDetails.client";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main style={{ padding: 24, maxWidth: 840, margin: "0 auto" }}>
      <NoteDetails id={decodeURIComponent(id)} />
    </main>
  );
}
