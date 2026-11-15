import { body, fail, handle, ok } from "@/lib/server/http";
import { q } from "@/lib/server/db";
export const dynamic = "force-dynamic";
export const POST = handle(async (req: Request) => {
  const b = await body<{ email: string; source: string }>(req);
  const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Please enter a valid email address");
  await q("insert into subscribers (email, source) values ($1, $2) on conflict (email) do nothing", [email, String(b.source || "welcome").slice(0, 30)]);
  return ok({ ok: true });
});
