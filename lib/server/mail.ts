/* Order emails through Resend (RESEND_API_KEY). Without a key, emails are skipped
   and the order still goes through; the admin panel always has every order. */
import "server-only";
import { SITE_URL } from "@/lib/site";
import type { OrderRow } from "./shop";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const aed = (n: number) => "AED " + Math.round(n).toLocaleString("en-US");

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY; if (!key || !to) return;
  const from = process.env.MAIL_FROM || "LENO WEAR <onboarding@resend.dev>";
  try {
    const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to, subject, html }) });
    if (!r.ok) console.error("mail failed", r.status, await r.text());
  } catch (e) { console.error("mail failed", e); }
}

function body(o: OrderRow, intro: string) {
  const rows = o.items.map((l) => `<tr><td style="padding:6px 0">${esc(l.name)} · ${esc(l.color)} · ${l.size} × ${l.qty}</td><td align="right">${aed(l.price * l.qty)}</td></tr>`).join("");
  const a = o.address;
  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:auto;color:#14110f">
  <img src="${SITE_URL}/p/kiss-tag.png" alt="" width="64" style="display:block;margin:24px auto 8px">
  <h1 style="text-align:center;font-size:22px;letter-spacing:.08em;margin:0 0 4px">LENO WEAR</h1>
  <p style="text-align:center;color:#6b645c;margin:0 0 24px">Order ${o.no}</p>
  <p>${intro}</p>
  <table width="100%" style="border-top:1px solid #e6e0d6;border-bottom:1px solid #e6e0d6;margin:16px 0;font-size:14px">${rows}
  ${o.discount ? `<tr><td>${esc(o.discount_label)}</td><td align="right">−${aed(o.discount)}</td></tr>` : ""}
  <tr><td>Delivery (${o.speed === "same" ? "same day" : "next day"})</td><td align="right">${o.delivery ? aed(o.delivery) : "Free"}</td></tr>
  <tr><td style="padding-top:8px"><b>Total</b></td><td align="right" style="padding-top:8px"><b>${aed(o.total)}</b></td></tr></table>
  <p style="font-size:14px;color:#6b645c">Payment: ${o.pay_method === "cod" ? "Cash on delivery" : "Card (paid)"}<br>
  Deliver to: ${esc(o.name)}, ${esc(a.building)}, ${esc(a.area)}, ${esc(a.emirate)}${a.landmark ? " (" + esc(a.landmark) + ")" : ""}<br>Phone: ${esc(o.phone)}</p>
  ${o.gift ? `<p style="font-size:14px">Gift wrap${o.note ? `, note: “${esc(o.note)}”` : ""}</p>` : ""}
  <p style="text-align:center;margin:32px 0;color:#6b645c;font-size:13px">Leave your mark.</p></div>`;
}

export async function sendOrderMails(o: OrderRow) {
  await Promise.all([
    send(o.email, `Your LENO WEAR order ${o.no}`, body(o, `Thank you, ${esc(o.name.split(" ")[0])}. Your order is confirmed and we are preparing it now. We will message you on WhatsApp when it is on the way.`)),
    send(process.env.ADMIN_EMAIL || "", `New order ${o.no} · ${aed(o.total)}`, body(o, `New order from ${esc(o.name)} (${esc(o.email)}). Open the admin to pack it: ${SITE_URL}/admin/orders/`)),
  ]);
}
