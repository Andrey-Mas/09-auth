// app/(private routes)/profile/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getMeServer } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile Page — NoteHub",
  description: "User profile",
};

export default async function ProfilePage() {
  const user = await getMeServer();
  if (!user) redirect("/sign-in");

  const avatarSrc =
    (typeof (user as any).avatarUrl === "string" &&
      (user as any).avatarUrl.trim()) ||
    (typeof (user as any).avatar === "string" && (user as any).avatar.trim()) ||
    "/default-avatar.png";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatarSrc}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username ?? "—"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
