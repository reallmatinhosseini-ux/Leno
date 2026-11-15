import { admin, ok } from "@/lib/server/http";
import { q } from "@/lib/server/db";
export const dynamic = "force-dynamic";
export const GET = admin(async () => {
  const [waitlist, subscribers] = await Promise.all([
    q("select id, created_at, email, product, size, notified from waitlist order by created_at desc limit 2000"),
    q("select email, created_at, source from subscribers order by created_at desc limit 5000"),
  ]);
  return ok({ waitlist, subscribers });
});
