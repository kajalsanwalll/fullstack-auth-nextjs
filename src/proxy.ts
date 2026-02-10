import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // ✅ AUTH PAGES (redirect logged-in users)
  const authPages =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail";

  if (authPages && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.nextUrl)
    );
  }

  // ✅ PUBLIC PAGE (accessible to everyone)
  if (path === "/public-notes") {
    return NextResponse.next();
  }

  // 🔒 PROTECTED PAGES
  const protectedPages =
    path === "/" ||
    path === "/dashboard" ||
    path === "/profile" ||
    path.startsWith("/notes");

  if (protectedPages && !token) {
    return NextResponse.redirect(
      new URL("/login", request.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/profile",
    "/notes/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/public-notes",
  ],
};
