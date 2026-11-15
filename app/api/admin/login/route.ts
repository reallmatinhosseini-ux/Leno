import { NextResponse } from "next/server";
import { COOKIE, adminPassword, checkPassword, makeSession } from "@/lib/server/auth";
import { body } from "@/lib/server/http";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  if (!adminPassword()) return NextResponse.json({ error: "ADMIN_PASSWORD is not set in Vercel → Settings → Environment Variables." }, { status: 503 });
  const { password } = await body<{ password: string }>(req);
  await new Promise((r) => setTimeout(r, 400)); /* slow down guessing */
  if (!(await checkPassword(String(password || "")))) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const s = await makeSession(); const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, s.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: s.maxAge });
  return res;
}
