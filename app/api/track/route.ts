import { body, fail, handle, ok } from "@/lib/server/http";
import { orderByNo } from "@/lib/server/shop";
export const dynamic = "force-dynamic";
/* Track an order with its number + the email used at checkout. Returns status only. */
export const POST = handle(async (req: Request) => {
  const b = await body<{ no: string; email: string }>(req);
  await new Promise((r) => setTimeout(r, 300));
  const o = await orderByNo(String(b.no || "").trim().toUpperCase());
  if (!o || o.email !== String(b.email || "").trim().toLowerCase()) return fail("not found", 404);
  return ok({ no: o.no, status: o.status, pay_status: o.pay_status, pay_method: o.pay_method });
});
