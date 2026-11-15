import { admin, body, fail, ok } from "@/lib/server/http";
import { q } from "@/lib/server/db";
import { getProducts } from "@/lib/server/shop";
import { SIZES, byId } from "@/lib/data";
export const dynamic = "force-dynamic";
export const GET = admin(async () => ok(await getProducts()));

/* Update one colourway: stock per size, badge, hidden, photo order. */
export const PATCH = admin(async (req: Request) => {
  const b = await body<{ id: string; stock: Record<string, number>; badge: string; hidden: boolean; images: string[] | null }>(req);
  if (!byId(String(b.id))) return fail("Unknown product", 404);
  if (b.stock) { const st: Record<string, number> = {}; for (const z of SIZES) st[z] = Math.max(0, Math.min(9999, Math.floor(+b.stock[z] || 0))); await q("update products set stock = $2::jsonb, updated_at = now() where id = $1", [b.id, JSON.stringify(st)]); }
  if (typeof b.badge === "string") await q("update products set badge = $2 where id = $1", [b.id, b.badge.slice(0, 24)]);
  if (typeof b.hidden === "boolean") await q("update products set hidden = $2 where id = $1", [b.id, b.hidden]);
  if (b.images !== undefined) {
    const imgs = Array.isArray(b.images) ? b.images.filter((s) => typeof s === "string" && (/^https:\/\//.test(s) || /^[a-z0-9-]+$/.test(s))).slice(0, 12) : null;
    await q("update products set images = $2::jsonb where id = $1", [b.id, imgs && imgs.length ? JSON.stringify(imgs) : null]);
  }
  return ok(await getProducts());
});
