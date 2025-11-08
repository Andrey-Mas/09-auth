"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, updateMe } from "@/lib/api/clientApi";
import type { User } from "@/types/user";
import css from "./page.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const me = await getMe();
        if (!cancelled) {
          setUser(me);
          setUsername(me?.username || "");
        }
      } catch {
        if (!cancelled) setError("Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setError("");
      await updateMe({ username: username.trim() });
      router.push("/profile");
    } catch (err) {
      setError((err as Error).message || "Failed to update profile");
    }
  }

  if (loading) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>Loading...</div>
      </main>
    );
  }

  const avatarSrc =
    user?.avatar || "https://ac.goit.global/img/photo-placeholder.jpg";

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatarSrc}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
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

          <p>Email: {user?.email ?? "user_email@example.com"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
