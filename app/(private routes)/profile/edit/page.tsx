// app/(private routes)/profile/edit/page.tsx
import { redirect } from "next/navigation";
import { getMeServer } from "@/lib/api/serverApi";
import EditProfileClient from "@/components/EditProfileClient/EditProfileClient";

export const metadata = {
  title: "Edit Profile — NoteHub",
  description: "Update your profile information",
};

export default async function EditProfilePage() {
  // SSR-перевірка сесії через куки запиту
  const user = await getMeServer();
  if (!user) {
    redirect("/sign-in");
  }

  return <EditProfileClient initialUser={user} />;
}
