import { body, fail, handle, ok } from "@/lib/server/http";
import { q } from "@/lib/server/db";
import { SIZES, byId } from "@/lib/data";
export const dynamic = "force-dynamic";
export const POST = handle(async (req: Request) => {
  const b = await body<{ email: string; id: string; size: string }>(req);
  const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Please enter a valid email address");
  if (!byId(String(b.id))) return fail("Unknown product");
  const size = SIZES.includes(b.size as never) ? String(b.size) : "any";
  await q("insert into waitlist (email, product, size) values ($1, $2, $3)", [email, b.id, size]);
  return ok({ ok: true });
});
