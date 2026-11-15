import { admin, ok } from "@/lib/server/http";
import { q } from "@/lib/server/db";
import { parseOrder, releaseAbandoned, type OrderRow } from "@/lib/server/shop";
export const dynamic = "force-dynamic";
export const GET = admin(async () => {
  await releaseAbandoned();
  const rows = await q<OrderRow>("select * from orders where no not like 'tmp-%' order by created_at desc limit 1000");
  return ok(rows.map(parseOrder));
});
