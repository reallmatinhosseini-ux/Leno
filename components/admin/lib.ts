"use client";
import { PRODUCTS, STYLES, SIZES, type Size } from "@/lib/data";

export type AOrder = {
  no: string; created_at: string; status: string; pay_status: string; pay_method: string; pay_ref: string | null;
  email: string; phone: string; name: string; address: { emirate: string; area: string; building: string; landmark: string };
  items: { id: string; size: Size; qty: number; price: number; name: string; color: string }[];
  subtotal: number; discount: number; discount_label: string; delivery: number; total: number; gift: boolean; note: string; speed: string; admin_note: string;
};
export type AProduct = { id: string; stock: Record<Size, number>; badge: string; hidden: boolean; images: string[] | null };
export type ASettings = {
  prices: Record<string, number>;
  cfg: { free: number; welcomeOn: boolean; welcomePct: number; bundleOn: boolean; bundlePct: number; sameDayFee: number; cod: boolean; announcement: string };
  env: { card: boolean; provider: string; email: boolean; adminEmail: string; blob: boolean; db: boolean };
};

export async function api<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const r = await fetch("/api/admin/" + path, { ...init, cache: "no-store", headers: init?.json !== undefined ? { "Content-Type": "application/json" } : undefined, body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body });
  if (r.status === 401) { location.href = "/admin/login/"; throw new Error("Please sign in again"); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Request failed");
  return j as T;
}

export const aed = (n: number) => "AED " + Math.round(n).toLocaleString("en-US");
export const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dubai" });
export const day = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });
export const thumb = (p: { id: string; images?: string[] | null }) => { const im = p.images?.[0] || PRODUCTS.find((x) => x.id === p.id)?.images[0] || ""; return /^https?:/.test(im) ? im : `/p/${im}.webp`; };
export const pname = (id: string) => { const p = PRODUCTS.find((x) => x.id === id); return p ? `${STYLES[p.style].name} · ${p.color}` : id; };
export { PRODUCTS, STYLES, SIZES };

/* An order counts as a sale once it is paid or cash-on-delivery, and not cancelled/returned. */
export const isSale = (o: AOrder) => (o.pay_status === "paid" || o.pay_method === "cod") && !["cancelled", "returned"].includes(o.status);
export const STATUS_LABEL: Record<string, string> = { new: "New", confirmed: "To pack", packed: "Packed", shipped: "On the way", delivered: "Delivered", cancelled: "Cancelled", returned: "Returned" };
export const NEXT_STEP: Record<string, [string, string]> = { new: ["confirmed", "Confirm order"], confirmed: ["packed", "Mark packed"], packed: ["shipped", "Mark on the way"], shipped: ["delivered", "Mark delivered"] };
export const payLabel = (o: AOrder) => o.pay_method === "cod" ? (o.pay_status === "paid" ? "Cash · collected" : "Cash on delivery") : o.pay_status === "paid" ? "Card · paid" : o.pay_status === "pending" ? "Card · awaiting" : "Card · " + o.pay_status;
