/* Card payments. One adapter per gateway; PAYMENT_PROVIDER picks which one is live.
   Flow: order is created (pieces reserved) → customer is sent to the gateway's hosted
   payment page → gateway returns to /api/pay/return and/or calls /api/pay/webhook →
   we verify with the gateway, mark the order paid and email the receipt.
   "test" is a local-only fake gateway for trying the flow; it never runs in production. */
import "server-only";
import { q } from "./db";
import type { OrderRow } from "./shop";

export type Gateway = {
  /** URL of the gateway's payment page for this order */
  start(o: OrderRow, origin: string): Promise<string>;
  /** Ask the gateway whether this order is paid; never trust the browser's word for it */
  verify(o: OrderRow, params: URLSearchParams): Promise<{ paid: boolean; ref?: string }>;
};

const provider = () => (process.env.PAYMENT_PROVIDER || "").toLowerCase();

const test: Gateway = {
  async start(o, origin) { return `${origin}/api/pay/test/?no=${o.no}&t=${o.token}`; },
  async verify(_o, p) { return { paid: p.get("ok") === "1", ref: "TEST-" + Date.now() }; },
};

const GATEWAYS: Record<string, Gateway> = { test };

export function gateway(): Gateway | null {
  const p = provider();
  if (p === "test" && process.env.NODE_ENV === "production") return null;
  return GATEWAYS[p] || null;
}
export const gatewayReady = () => !!gateway();

export async function markPaid(no: string, ref: string) {
  const rows = await q<{ no: string; pay_method: string }>("update orders set pay_status = 'paid', pay_ref = $2, status = case when status = 'new' and pay_method <> 'cod' then 'confirmed' else status end where no = $1 and pay_status <> 'paid' returning no, pay_method", [no, ref]);
  /* card: the receipt goes out now. Cash on delivery already got its email at checkout. */
  if (rows.length && rows[0].pay_method !== "cod") { const { sendOrderMails } = await import("./mail"); const { orderByNo } = await import("./shop"); const o = await orderByNo(no); if (o) await sendOrderMails(o); }
}
