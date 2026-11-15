import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, validSession } from "@/lib/server/auth";

/* Everything under /admin and /api/admin needs the admin cookie, except the sign-in. */
export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith("/admin/login") || p.startsWith("/api/admin/login")) return NextResponse.next();
  if (await validSession(req.cookies.get(COOKIE)?.value)) {
    const r = NextResponse.next(); r.headers.set("X-Robots-Tag", "noindex"); r.headers.set("Cache-Control", "no-store"); return r;
  }
  if (p.startsWith("/api/")) return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
  const u = req.nextUrl.clone(); u.pathname = "/admin/login/"; u.search = ""; return NextResponse.redirect(u);
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
