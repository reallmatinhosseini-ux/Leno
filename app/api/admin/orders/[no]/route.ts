import { admin, body, fail, ok } from "@/lib/server/http";
import { db } from "@/lib/server/db";
import { STATUSES, orderByNo, restock } from "@/lib/server/shop";
import { markPaid } from "@/lib/server/pay";
export const dynamic = "force-dynamic";

/* Change status, payment or the private note. Cancel/return puts the stock back once. */
export const PATCH = admin(async (req: Request, { params }: { params: Promise<{ no: string }> }) => {
  const { no } = await params; const b = await body<{ status: string; paid: boolean; admin_note: string }>(req);
  const o = await orderByNo(no); if (!o) return fail("Order not found", 404);
  const d = await db();
  await d.tx(async (x) => {
    if (b.status && b.status !== o.status) {
      if (!STATUSES.includes(b.status as never)) throw new Error("bad status");
      await x("update orders set status = $2 where no = $1", [no, b.status]);
      if (b.status === "cancelled" || b.status === "returned") await restock(no, x);
    }
    if (typeof b.admin_note === "string") await x("update orders set admin_note = $2 where no = $1", [no, b.admin_note.slice(0, 1000)]);
  });
  if (b.paid === true && o.pay_status !== "paid") await markPaid(no, "manual");
  return ok(await orderByNo(no));
});
