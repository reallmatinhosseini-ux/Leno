import { fail, handle, ok } from "@/lib/server/http";
import { orderByNo } from "@/lib/server/shop";
export const dynamic = "force-dynamic";

/* The customer's own order, readable only with the private token from their link. */
export const GET = handle(async (req: Request, { params }: { params: Promise<{ no: string }> }) => {
  const { no } = await params; const t = new URL(req.url).searchParams.get("t") || "";
  const o = await orderByNo(no);
  if (!o || !t || o.token !== t) return fail("Order not found", 404);
  const { token: _t, admin_note: _n, stock_back: _s, id: _i, ...pub } = o;
  return ok(pub);
});
