import { admin } from "@/lib/server/http";
import { q } from "@/lib/server/db";
import { parseOrder, type OrderRow } from "@/lib/server/shop";
export const dynamic = "force-dynamic";
const cell = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) || /^[=+\-@]/.test(s) ? `"${s.replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"` : s; };
export const GET = admin(async (req: Request) => {
  const t = new URL(req.url).searchParams.get("type") || "orders"; let rows: unknown[][] = [];
  if (t === "orders") {
    const os = (await q<OrderRow>("select * from orders where no not like 'tmp-%' order by created_at desc")).map(parseOrder);
    rows = [["Order", "Date", "Status", "Payment", "Paid", "Name", "Email", "Phone", "Emirate", "Area", "Building", "Items", "Subtotal", "Discount", "Delivery", "Total"],
      ...os.map((o) => [o.no, o.created_at, o.status, o.pay_method, o.pay_status, o.name, o.email, o.phone, o.address.emirate, o.address.area, o.address.building, o.items.map((l) => `${l.name} ${l.color} ${l.size} x${l.qty}`).join("; "), o.subtotal, o.discount, o.delivery, o.total])];
  } else if (t === "waitlist") {
    rows = [["Date", "Email", "Product", "Size"], ...(await q<{ created_at: string; email: string; product: string; size: string }>("select * from waitlist order by created_at desc")).map((r) => [new Date(r.created_at).toISOString(), r.email, r.product, r.size])];
  } else {
    rows = [["Date", "Email", "Source"], ...(await q<{ created_at: string; email: string; source: string }>("select * from subscribers order by created_at desc")).map((r) => [new Date(r.created_at).toISOString(), r.email, r.source])];
  }
  return new Response(rows.map((r) => r.map(cell).join(",")).join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="leno-${t}.csv"`, "Cache-Control": "no-store" } });
});
