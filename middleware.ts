// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ONLY = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  const isPublicOnly = PUBLIC_ONLY.includes(pathname);
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));

  let isAuth = false;

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (res.ok) {
      // session route завжди 200 і повертає { success: boolean }
      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
      } | null;
      isAuth = !!data?.success;
    }
  } catch {
    isAuth = false;
  }

  if (isPrivate && !isAuth) {
    url.pathname = "/sign-in";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isPublicOnly && isAuth) {
    url.pathname = "/profile";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
