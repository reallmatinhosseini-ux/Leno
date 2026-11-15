/* Store rules on the server: live catalogue, prices, offers, and order creation.
   The browser never decides a price or stock level; it only sends what is in the bag. */
import "server-only";
import { randomBytes } from "node:crypto";
import { FREE_DELIVERY, PRODUCTS, SIZES, STYLES, Size, StyleKey, byId } from "@/lib/data";
import { db, q, type Q } from "./db";

export type Cfg = { free: number; welcomeOn: boolean; welcomePct: number; bundleOn: boolean; bundlePct: number; sameDayFee: number; cod: boolean; announcement: string };
export type Settings = { prices: Record<StyleKey, number>; cfg: Cfg };
export type Stock = Record<Size, number>;
export type ProductRow = { id: string; stock: Stock; badge: string; hidden: boolean; images: string[] | null };

const DEF_CFG: Cfg = { free: FREE_DELIVERY, welcomeOn: true, welcomePct: 10, bundleOn: true, bundlePct: 10, sameDayFee: 25, cod: true, announcement: "" };
const DEF_PRICES = Object.fromEntries(Object.entries(STYLES).map(([k, s]) => [k, s.price])) as Record<StyleKey, number>;

const json = <T,>(v: unknown): T => (typeof v === "string" ? JSON.parse(v) : v) as T;

export async function getSettings(x: Q = q): Promise<Settings> {
  const rows = await x<{ key: string; value: unknown }>("select key, value from settings where key in ('prices','cfg')");
  const m = Object.fromEntries(rows.map((r) => [r.key, json(r.value)])) as Partial<Settings>;
  return { prices: { ...DEF_PRICES, ...(m.prices || {}) }, cfg: { ...DEF_CFG, ...(m.cfg || {}) } };
}
export async function saveSettings(s: Partial<Settings>) {
  const cur = await getSettings();
  if (s.prices) {
    const p = { ...cur.prices }; for (const k of Object.keys(STYLES) as StyleKey[]) if (s.prices[k] != null) p[k] = Math.max(1, Math.round(+s.prices[k] || p[k]));
    await q("insert into settings (key, value) values ('prices', $1::jsonb) on conflict (key) do update set value = excluded.value", [JSON.stringify(p)]);
  }
  if (s.cfg) {
    const c = { ...cur.cfg, ...s.cfg };
    const n = (v: unknown, lo: number, hi: number, d: number) => Math.min(hi, Math.max(lo, Math.round(+(v as number)))) || d;
    const clean: Cfg = { free: Math.max(0, Math.round(+c.free) || 0), welcomeOn: !!c.welcomeOn, welcomePct: n(c.welcomePct, 1, 50, 10), bundleOn: !!c.bundleOn, bundlePct: n(c.bundlePct, 1, 50, 10), sameDayFee: Math.max(0, Math.round(+c.sameDayFee) || 0), cod: !!c.cod, announcement: String(c.announcement || "").slice(0, 140) };
    await q("insert into settings (key, value) values ('cfg', $1::jsonb) on conflict (key) do update set value = excluded.value", [JSON.stringify(clean)]);
  }
  return getSettings();
}

export async function getProducts(x: Q = q): Promise<ProductRow[]> {
  const rows = await x<ProductRow>("select id, stock, badge, hidden, images from products");
  return rows.map((r) => ({ ...r, stock: json<Stock>(r.stock), images: r.images ? json<string[]>(r.images) : null }));
}

/* Public catalogue for the storefront: same shape the store already understands. */
export async function publicCatalog() {
  const [s, rows] = await Promise.all([getSettings(), getProducts()]);
  const products: Record<string, { stock: Stock; badge: string; hidden: boolean; images?: string[] }> = {};
  for (const r of rows) products[r.id] = { stock: r.stock, badge: r.badge, hidden: r.hidden, ...(r.images?.length ? { images: r.images } : {}) };
  const { gatewayReady } = await import("./pay");
  return { products, prices: s.prices, cfg: s.cfg, pay: { card: gatewayReady(), cod: s.cfg.cod } };
}

/* ---------- pricing ---------- */
export type LineIn = { id: string; size: Size; qty: number };
export function priceBag(lines: LineIn[], s: Settings, opts: { promo?: string; emirate: string; speed: string }) {
  const items = lines.map((l) => { const p = byId(l.id)!; return { id: l.id, size: l.size, qty: l.qty, price: s.prices[p.style], name: STYLES[p.style].name, color: p.color }; });
  const subtotal = items.reduce((a, l) => a + l.price * l.qty, 0);
  const cats = items.map((l) => STYLES[byId(l.id)!.style].cat);
  const bundle = s.cfg.bundleOn && cats.includes("dresses") && cats.includes("sets");
  const welcome = !bundle && s.cfg.welcomeOn && (opts.promo || "").trim().toUpperCase() === "LENO10";
  const discount = bundle ? Math.round(subtotal * s.cfg.bundlePct / 100) : welcome ? Math.round(subtotal * s.cfg.welcomePct / 100) : 0;
  const discountLabel = bundle ? `Look bundle · ${s.cfg.bundlePct}% off` : welcome ? `Welcome ${s.cfg.welcomePct}% · LENO10` : "";
  const speed = opts.emirate === "Dubai" && opts.speed === "same" ? "same" : "next";
  const after = subtotal - discount;
  const delivery = speed === "same" && after < s.cfg.free ? s.cfg.sameDayFee : 0;
  return { items, subtotal, discount, discountLabel, delivery, speed, total: after + delivery };
}

/* ---------- orders ---------- */
export const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
export type OrderIn = { items: LineIn[]; email: string; phone: string; name: string; emirate: string; area: string; building: string; landmark?: string; speed: string; method: string; promo?: string; gift?: boolean; note?: string };
export class ShopError extends Error { constructor(msg: string, public status = 400) { super(msg); } }

const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export function validate(b: Partial<OrderIn>): OrderIn {
  const email = clip(b.email, 160).toLowerCase(), name = clip(b.name, 100), phone = clip(b.phone, 30);
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ShopError("Please enter a valid email address");
  if (!name) throw new ShopError("Please enter your name");
  if (!/^[+\d][\d\s-]{6,}$/.test(phone)) throw new ShopError("Please enter a valid phone number");
  const emirate = EMIRATES.includes(String(b.emirate)) ? String(b.emirate) : "";
  if (!emirate) throw new ShopError("Please choose an emirate");
  const area = clip(b.area, 120), building = clip(b.building, 200);
  if (!area || !building) throw new ShopError("Please complete your delivery address");
  const merged = new Map<string, LineIn>();
  for (const l of Array.isArray(b.items) ? b.items : []) {
    const p = byId(String(l?.id)); const size = String(l?.size) as Size; const qty = Math.floor(+l?.qty);
    if (!p || !SIZES.includes(size) || !(qty > 0) || qty > 20) throw new ShopError("Your bag has an item we could not read. Please refresh and try again.");
    const k = p.id + "|" + size; const m = merged.get(k); merged.set(k, { id: p.id, size, qty: (m?.qty || 0) + qty });
  }
  if (!merged.size) throw new ShopError("Your bag is empty");
  return { items: [...merged.values()], email, phone, name, emirate, area, building, landmark: clip(b.landmark, 160), speed: b.speed === "same" ? "same" : "next", method: b.method === "cod" ? "cod" : "card", promo: clip(b.promo, 20), gift: !!b.gift, note: clip(b.note, 300) };
}

export type OrderRow = {
  id: number; no: string; token: string; created_at: string; status: string; pay_status: string; pay_method: string; pay_ref: string | null;
  email: string; phone: string; name: string; address: { emirate: string; area: string; building: string; landmark: string };
  items: { id: string; size: Size; qty: number; price: number; name: string; color: string }[];
  subtotal: number; discount: number; discount_label: string; delivery: number; total: number; gift: boolean; note: string; speed: string; stock_back: boolean; admin_note: string;
};
export const parseOrder = (r: OrderRow): OrderRow => ({ ...r, address: json(r.address), items: json(r.items), created_at: new Date(r.created_at).toISOString() });

export async function createOrder(input: OrderIn) {
  const { gatewayReady } = await import("./pay");
  const d = await db();
  return d.tx(async (x) => {
    const s = await getSettings(x);
    if (input.method === "cod" && !s.cfg.cod) throw new ShopError("Cash on delivery is not available right now");
    if (input.method === "card" && !gatewayReady()) throw new ShopError("Card payment is not available yet. Please choose cash on delivery.");
    const rows = await x<ProductRow>("select id, stock, hidden from products where id = any($1::text[]) for update", [input.items.map((l) => l.id)]);
    const stock = new Map(rows.map((r) => [r.id, json<Stock>(r.stock)]));
    for (const l of input.items) {
      const st = stock.get(l.id); const left = st?.[l.size] || 0;
      if (left < l.qty) { const p = byId(l.id)!; throw new ShopError(left ? `Only ${left} left of ${STYLES[p.style].name} ${p.color} in ${l.size}. Please update your bag.` : `${STYLES[p.style].name} ${p.color} in ${l.size} just sold out. Please update your bag.`, 409); }
      st![l.size] = left - l.qty;
    }
    for (const [id, st] of stock) await x("update products set stock = $2::jsonb, updated_at = now() where id = $1", [id, JSON.stringify(st)]);
    const pr = priceBag(input.items, s, { promo: input.promo, emirate: input.emirate, speed: input.speed });
    const token = randomBytes(16).toString("hex");
    const [o] = await x<OrderRow>(
      `insert into orders (no, token, pay_method, pay_status, email, phone, name, address, items, subtotal, discount, discount_label, delivery, total, gift, note, speed)
       values ('tmp-' || $1, $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11, $12, $13, $14, $15, $16) returning *`,
      [token, input.method, input.method === "cod" ? "cod" : "pending", input.email, input.phone, input.name,
        JSON.stringify({ emirate: input.emirate, area: input.area, building: input.building, landmark: input.landmark || "" }), JSON.stringify(pr.items),
        pr.subtotal, pr.discount, pr.discountLabel, pr.delivery, pr.total, !!input.gift, input.note || "", pr.speed]);
    const no = "LW-" + (10000 + o.id);
    await x("update orders set no = $2 where id = $1", [o.id, no]);
    return parseOrder({ ...o, no });
  });
}

export async function orderByNo(no: string) {
  const [r] = await q<OrderRow>("select * from orders where no = $1", [no]);
  return r ? parseOrder(r) : null;
}

/* Cancelling (or an abandoned card payment) puts the pieces back on the shelf, once. */
export async function restock(no: string, x: Q) {
  const [o] = await x<OrderRow>("select * from orders where no = $1 for update", [no]);
  if (!o || o.stock_back) return;
  for (const l of json<OrderRow["items"]>(o.items)) {
    const [p] = await x<ProductRow>("select stock from products where id = $1 for update", [l.id]);
    if (!p) continue; const st = json<Stock>(p.stock); st[l.size] = (st[l.size] || 0) + l.qty;
    await x("update products set stock = $2::jsonb, updated_at = now() where id = $1", [l.id, JSON.stringify(st)]);
  }
  await x("update orders set stock_back = true where no = $1", [no]);
}

/* Card orders that were never paid within 2 hours release their pieces. */
export async function releaseAbandoned() {
  const old = await q<{ no: string }>("select no from orders where pay_status = 'pending' and status = 'new' and created_at < now() - interval '2 hours'");
  const d = await db();
  for (const { no } of old) await d.tx(async (x) => { await restock(no, x); await x("update orders set status = 'cancelled', pay_status = 'expired' where no = $1", [no]); });
}

export const STATUSES = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"] as const;
export const PRODUCT_IDS = PRODUCTS.map((p) => p.id);
