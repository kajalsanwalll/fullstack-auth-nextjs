import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // ==============================
  // ✅ AUTH PAGES
  // ==============================
  const authPages =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail";

  // If logged in → block auth pages
  if (authPages && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // ==============================
  // ✅ PUBLIC PAGES
  // ==============================
  const publicPages =
    path === "/" ||            // landing page
    path === "/public-notes";

  if (publicPages) {
    return NextResponse.next();
  }

  // ==============================
  // 🔒 PROTECTED PAGES
  // ==============================
  const protectedPages =
    path === "/dashboard" ||
    path === "/profile" ||
    path.startsWith("/notes");

  if (protectedPages && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/notes/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/public-notes",
  ],
};
