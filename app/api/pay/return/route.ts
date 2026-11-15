import { NextResponse } from "next/server";
import { orderByNo } from "@/lib/server/shop";
import { gateway, markPaid } from "@/lib/server/pay";
import { origin } from "@/lib/server/http";
export const dynamic = "force-dynamic";

/* The gateway sends the customer back here. We check with the gateway, then show the order. */
export async function GET(req: Request) {
  const u = new URL(req.url), no = u.searchParams.get("no") || "", t = u.searchParams.get("t") || "";
  const base = origin(req); const o = await orderByNo(no);
  if (!o || o.token !== t) return NextResponse.redirect(`${base}/checkout/?pay=failed`);
  const g = gateway();
  if (g && o.pay_status !== "paid") { const r = await g.verify(o, u.searchParams); if (r.paid) await markPaid(o.no, r.ref || ""); }
  return NextResponse.redirect(`${base}/order/?no=${o.no}&t=${o.token}`);
}
