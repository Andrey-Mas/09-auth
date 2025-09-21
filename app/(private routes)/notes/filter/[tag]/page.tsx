import NoteList from "@/components/NoteList/NoteList";
import type { Tag } from "@/types";

type Params = { tag: string };

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag) as Tag | "All";
  return <NoteList tag={decoded === "All" ? undefined : (decoded as Tag)} />;
}
