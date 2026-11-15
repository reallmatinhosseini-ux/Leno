import { orderByNo } from "@/lib/server/shop";
export const dynamic = "force-dynamic";

/* Local-only pretend payment page (PAYMENT_PROVIDER=test). Disabled in production. */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production" || process.env.PAYMENT_PROVIDER !== "test") return new Response("Not found", { status: 404 });
  const u = new URL(req.url); const o = await orderByNo(u.searchParams.get("no") || "");
  if (!o || o.token !== u.searchParams.get("t")) return new Response("Not found", { status: 404 });
  const back = (ok: string) => `/api/pay/return/?no=${o.no}&t=${o.token}&ok=${ok}`;
  return new Response(`<!doctype html><meta name=viewport content="width=device-width"><body style="font:16px system-ui;display:grid;place-items:center;height:100vh;margin:0;background:#f4f1ea"><div style="text-align:center"><p>TEST GATEWAY</p><h2>Pay AED ${o.total} for ${o.no}</h2><p><a href="${back("1")}" style="padding:12px 20px;background:#14110f;color:#fff;border-radius:99px;text-decoration:none">Pay (test)</a> &nbsp; <a href="${back("0")}">Cancel</a></p></div>`, { headers: { "Content-Type": "text/html" } });
}
