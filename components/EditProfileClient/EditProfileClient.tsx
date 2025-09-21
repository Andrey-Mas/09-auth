"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMe } from "@/lib/api/clientApi";
import type { User } from "@/types";
// Використаємо твій існуючий css-модуль зі сторінки
import css from "@/app/(private routes)/profile/edit/EditProfilePage.module.css";

type Props = {
  initialUser: User;
};

export default function EditProfileClient({ initialUser }: Props) {
  const router = useRouter();

  const [username, setUsername] = useState(initialUser.username ?? "");
  const [email] = useState(initialUser.email);
  // підтримуємо і avatarUrl, і (на випадок) avatar
  const initialAvatar =
    (initialUser as any).avatarUrl ??
    (initialUser as any).avatar ??
    "/default-avatar.png";
  const [avatar] = useState<string>(initialAvatar);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateMe({ username });
      router.replace("/profile");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
          priority // ← можна додати, щоб прибрати варн
        />

        <form className={css.profileInfo} onSubmit={onSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
