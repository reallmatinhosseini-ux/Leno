import { orderByNo } from "@/lib/server/shop";
import { gateway, markPaid } from "@/lib/server/pay";
import { ok, fail } from "@/lib/server/http";
export const dynamic = "force-dynamic";

/* Server-to-server notice from the gateway. We never trust its body alone: we look the
   order up and ask the gateway to confirm before marking it paid. */
export async function POST(req: Request) {
  const g = gateway(); if (!g) return fail("No gateway", 404);
  const u = new URL(req.url); let no = u.searchParams.get("no") || "";
  const raw = await req.text(); const params = new URLSearchParams(u.searchParams);
  try { const j = JSON.parse(raw); if (j && typeof j === "object") for (const [k, v] of Object.entries(j)) if (typeof v === "string" || typeof v === "number") params.set(k, String(v)); } catch { new URLSearchParams(raw).forEach((v, k) => params.set(k, v)); }
  no = no || params.get("no") || params.get("reference") || params.get("order") || "";
  const o = await orderByNo(no); if (!o) return fail("Unknown order", 404);
  const r = await g.verify(o, params); if (r.paid) await markPaid(o.no, r.ref || "");
  return ok({ received: true });
}
