import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

// Security Config
const SECRET_KEY = process.env.NEXTAUTH_SECRET || "mana-industrial-secret-123";
const key = new TextEncoder().encode(SECRET_KEY);

// Intl Config
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always"
});

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Security Check for Admin Routes
  const isApi = pathname.startsWith("/api/");
  const isAdminPath = pathname.includes("/admin");
  const isLoginPage = pathname.includes("/login");

  // Skip security check for public API
  const isProtectedApi = pathname.startsWith("/api/admin");

  if ((isAdminPath && !isLoginPage) || isProtectedApi) {
    const token = req.cookies.get("mana_admin_token")?.value;

    if (!token) {
      if (isApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Redirect to login with locale
      const pathLocale = locales.find(l => pathname.startsWith(`/${l}`)) || defaultLocale;
      const loginUrl = new URL(`/${pathLocale}/admin/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, key);
      if (payload.role !== "ADMIN") throw new Error("Not admin");
    } catch (error) {
      if (isApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const pathLocale = locales.find(l => pathname.startsWith(`/${l}`)) || defaultLocale;
      const loginUrl = new URL(`/${pathLocale}/admin/login`, req.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("mana_admin_token");
      return res;
    }
  }

  // 2. Run Intl Middleware for pages (skip API)
  if (isApi) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
