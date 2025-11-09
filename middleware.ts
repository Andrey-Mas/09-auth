// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_PREFIXES = ["/profile", "/notes"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = PUBLIC_ROUTES.includes(pathname);
  const isPrivateRoute = PRIVATE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = false;
  let response: NextResponse | null = null;

  // 1. Якщо є accessToken — вважаємо користувача авторизованим
  if (accessToken) {
    isAuthenticated = true;
  }

  // 2. Якщо accessToken немає, але є refreshToken — пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    const cookieHeader = request.headers.get("cookie") ?? "";

    try {
      const session = await checkSession(cookieHeader);

      if (session.ok && session.data) {
        isAuthenticated = true;

        // Якщо бекенд повернув оновлені куки — прокидуємо їх далі
        const setCookie = session.headers["set-cookie"];
        if (setCookie) {
          response = NextResponse.next();
          // важливо: не чіпаємо інші заголовки, просто додаємо set-cookie
          response.headers.set("set-cookie", setCookie);
        }
      }
    } catch {
      // якщо впало — просто вважатимемо, що не авторизований
      isAuthenticated = false;
    }
  }

  // 3. Захист приватних маршрутів
  if (isPrivateRoute && !isAuthenticated) {
    const url = new URL("/sign-in", request.url);
    return NextResponse.redirect(url);
  }

  // 4. Якщо користувач вже залогінений — не пускаємо на /sign-in /sign-up
  if (isAuthRoute && isAuthenticated) {
    const url = new URL("/profile", request.url);
    return NextResponse.redirect(url);
  }

  // 5. За замовчуванням — йдемо далі (з урахуванням можливого set-cookie)
  return response ?? NextResponse.next();
}

// Обмежуємо дію middleware тільки потрібними маршрутами
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
