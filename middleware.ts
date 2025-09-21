// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_PREFIXES = ["/profile", "/notes"]; // приватні маршрути
const PUBLIC_AUTH = ["/sign-in", "/sign-up"]; // публічні маршрути (логін/реєстрація)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = PUBLIC_AUTH.some((p) => pathname.startsWith(p));

  const TOKENS = ["accessToken", "refreshToken", "session"];
  const hasAccess = TOKENS.some((n) => req.cookies.has(n));

  // якщо користувач НЕ авторизований і йде на приватний маршрут → редірект на sign-in
  if (isPrivate && !hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // якщо користувач АВТОРИЗОВАНИЙ і йде на публічний маршрут → редірект на profile
  if (isAuthPage && hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
