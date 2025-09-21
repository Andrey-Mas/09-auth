"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import css from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <ul className={css.leftList}>
          <li>
            <Link
              href="/"
              prefetch={false}
              className={`${css.navigationLink} ${isActive("/") ? css.active : ""}`}
            >
              Home
            </Link>
          </li>

          {/* Клік по пункту меню відкриває дропдаун,
              а пункт "All" усередині веде на /notes */}
          <li>
            <div
              className={`${css.navigationLink} ${isActive("/notes") ? css.active : ""}`}
            >
              <TagsMenu />
            </div>
          </li>

          <li>
            <Link
              href="/about"
              prefetch={false}
              className={`${css.navigationLink} ${isActive("/about") ? css.active : ""}`}
            >
              About
            </Link>
          </li>
        </ul>

        <ul className={css.rightList}>
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}
