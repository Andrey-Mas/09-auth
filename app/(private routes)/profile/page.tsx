// app/(private routes)/profile/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import css from "./ProfilePage.module.css";
import { getMeServer } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile page",
  openGraph: { title: "Profile", description: "User profile page" },
};

export default async function ProfilePage() {
  const user = await getMeServer();

  // надійний фолбек навіть якщо прийде "" або пробіли
  const avatarSrc =
    typeof user.avatar === "string" && user.avatar.trim().length > 0
      ? user.avatar
      : "/default-avatar.png";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src="/default-avatar.png"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username ?? "your_username"}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
