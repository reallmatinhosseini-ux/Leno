"use client";
/* Shopping state (bag, wishlist, offers, orders) shared across the app.
   Uses the same browser-storage keys as the admin panel, so admin edits and
   checkout orders flow between the two. */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, STYLES, SIZES, FREE_DELIVERY, Product, Size, StyleKey, byId, total } from "./data";
import { img } from "./site";

export type Line = { id: string; size: Size; qty: number };
type AdminProduct = { stock?: Partial<Record<Size, number>>; badge?: string; hidden?: boolean };
type Admin = { products?: Record<string, AdminProduct>; prices?: Partial<Record<StyleKey, number>>; cfg?: { free?: number; welcomeOn?: boolean; welcomePct?: number; bundleOn?: boolean; bundlePct?: number } };
export type LiveProduct = Product & { price: number; badge: string; hidden: boolean };
export type Order = { no: string; date: string; name: string; method: string; total: number; status: string; items: { id: string; size: Size; qty: number; price: number }[] };

const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

type Ctx = {
  ready: boolean;
  catalog: LiveProduct[];
  live: (id: string) => LiveProduct | undefined;
  bag: Line[]; wish: string[]; recent: string[];
  count: number; subtotal: number; disc: number; discLabel: string; free: number; isBundle: boolean;
  promo: string | null; cfg: { welcomeOn: boolean; welcomePct: number; bundleOn: boolean; bundlePct: number };
  add: (id: string, size: Size, from?: HTMLElement | null, opts?: { silent?: boolean }) => boolean;
  setQty: (i: number, q: number) => void;
  toggleWish: (id: string) => void;
  seen: (id: string) => void;
  claim: () => void;
  placeOrder: (o: { name: string; method: string; delivery: number }) => Order;
  lastOrder: Order | null;
  ui: { bag: boolean; search: boolean; menu: boolean; quick: string | null; size: boolean };
  open: (k: "bag" | "search" | "menu" | "size", v?: boolean) => void;
  quick: (id: string | null) => void;
  toast: (m: string) => void;
  toastMsg: string | null;
};
const C = createContext<Ctx | null>(null);
export const useStore = () => { const c = useContext(C); if (!c) throw new Error("useStore outside provider"); return c; };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<Admin>({});
  const [bag, setBag] = useState<Line[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [promo, setPromo] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [ui, setUi] = useState({ bag: false, search: false, menu: false, quick: null as string | null, size: false });
  const [toastMsg, setToast] = useState<string | null>(null);
  const tRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setAdmin(read<Admin>("leno-admin", {}));
    setBag(read<Line[]>("leno-bag", []).filter((l) => byId(l.id)));
    setWish(read<string[]>("leno-wish", []).filter((id) => byId(id)));
    setRecent(read<string[]>("leno-recent", []).filter((id) => byId(id)));
    try { setPromo(localStorage.getItem("leno-promo")); } catch { /* ignore */ }
    try { const o = sessionStorage.getItem("leno-last-order"); if (o) setLastOrder(JSON.parse(o)); } catch { /* ignore */ }
    setReady(true);
    const sync = (e: StorageEvent) => { if (e.key === "leno-admin") setAdmin(read<Admin>("leno-admin", {})); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const catalog = useMemo<LiveProduct[]>(() => PRODUCTS.map((p) => {
    const o = admin.products?.[p.id] || {};
    const stock = { ...p.stock } as Record<Size, number>;
    SIZES.forEach((z) => { const v = o.stock?.[z]; if (v != null) stock[z] = Math.max(0, +v || 0); });
    return { ...p, stock, price: +(admin.prices?.[p.style] || STYLES[p.style].price), badge: o.badge || "", hidden: !!o.hidden };
  }), [admin]);
  const live = useCallback((id: string) => catalog.find((p) => p.id === id), [catalog]);

  const cfg = useMemo(() => { const c = admin.cfg || {}; return { welcomeOn: c.welcomeOn !== false, welcomePct: +(c.welcomePct || 10), bundleOn: c.bundleOn !== false, bundlePct: +(c.bundlePct || 10) }; }, [admin]);
  const free = +(admin.cfg?.free || FREE_DELIVERY);
  const subtotal = bag.reduce((a, l) => a + (live(l.id)?.price || 0) * l.qty, 0);
  const count = bag.reduce((a, l) => a + l.qty, 0);
  const cats = bag.map((l) => STYLES[byId(l.id)!.style].cat);
  const isBundle = cfg.bundleOn && cats.includes("dresses") && cats.includes("sets");
  const disc = isBundle ? Math.round(subtotal * cfg.bundlePct / 100) : promo && cfg.welcomeOn ? Math.round(subtotal * cfg.welcomePct / 100) : 0;
  const discLabel = isBundle ? `Look bundle · ${cfg.bundlePct}% off` : `Welcome ${cfg.welcomePct}% · LENO10`;

  const toast = useCallback((m: string) => { setToast(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToast(null), 2600); }, []);
  const open = useCallback((k: "bag" | "search" | "menu" | "size", v = true) => setUi((u) => ({ bag: false, search: false, menu: false, quick: null, size: false, [k]: v } as typeof u)), []);
  const quick = useCallback((id: string | null) => setUi((u) => ({ ...u, quick: id, bag: false })), []);

  const add = useCallback((id: string, size: Size, from?: HTMLElement | null, opts?: { silent?: boolean }) => {
    const p = live(id); if (!p) return false;
    const have = bag.find((l) => l.id === id && l.size === size)?.qty || 0;
    if ((p.stock[size] || 0) <= have) { toast(p.stock[size] ? "No more stock in this size" : "This size is sold out"); return false; }
    const next = have ? bag.map((l) => (l.id === id && l.size === size ? { ...l, qty: l.qty + 1 } : l)) : [...bag, { id, size, qty: 1 }];
    setBag(next); write("leno-bag", next);
    const done = () => { if (!opts?.silent) setUi((u) => ({ ...u, bag: true, quick: null })); };
    const target = Array.from(document.querySelectorAll<HTMLElement>("[data-bag-target]")).find((el) => el.offsetParent !== null);
    if (from && target && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      import("gsap").then(({ gsap }) => {
        const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
        const f = document.createElement("div"); f.className = "flyer"; f.innerHTML = `<img src="${img(p.images[0])}" alt="">`; document.body.appendChild(f);
        const w = 80, sx = a.left + a.width / 2 - w / 2, sy = a.top + a.height / 2 - w * .66;
        gsap.set(f, { x: sx, y: sy, scale: Math.min(2.2, a.width / w) });
        gsap.to(f, { x: b.left + b.width / 2 - w / 2, duration: .85, ease: "power1.inOut" });
        gsap.to(f, { keyframes: [{ y: sy - 150, duration: .35, ease: "power2.out" }, { y: b.top + b.height / 2 - w * .66, duration: .5, ease: "power2.in" }] });
        gsap.to(f, { scale: .18, rotation: 22, duration: .85, ease: "power2.in", onComplete: () => { f.remove(); done(); } });
      });
    } else done();
    return true;
  }, [bag, live, toast]);

  const setQty = useCallback((i: number, q: number) => {
    setBag((b) => { const l = b[i]; if (!l) return b; const max = live(l.id)?.stock[l.size] || 0; const n = Math.max(0, Math.min(q, max)); const next = n ? b.map((x, j) => (j === i ? { ...x, qty: n } : x)) : b.filter((_, j) => j !== i); write("leno-bag", next); return next; });
  }, [live]);
  const toggleWish = useCallback((id: string) => {
    setWish((w) => { const has = w.includes(id); const next = has ? w.filter((x) => x !== id) : [...w, id]; write("leno-wish", next); toast(has ? "Removed from wishlist" : "Saved to wishlist"); return next; });
  }, [toast]);
  const seen = useCallback((id: string) => { setRecent((r) => { const next = [id, ...r.filter((x) => x !== id)].slice(0, 8); write("leno-recent", next); return next; }); }, []);
  const claim = useCallback(() => { setPromo("LENO10"); try { localStorage.setItem("leno-promo", "LENO10"); } catch { /* ignore */ } }, []);

  const placeOrder = useCallback((o: { name: string; method: string; delivery: number }) => {
    const order: Order = { no: "LW-" + (Math.floor(Math.random() * 90000) + 10000), date: new Date().toISOString(), name: o.name || "Guest", method: o.method,
      total: subtotal - disc + o.delivery, status: "Confirmed", items: bag.map((l) => ({ ...l, price: live(l.id)?.price || 0 })) };
    write("leno-orders", [order, ...read<Order[]>("leno-orders", [])]);
    const a = read<Admin>("leno-admin", {}); a.products = a.products || {};
    bag.forEach((l) => { const p = live(l.id); if (!p) return; const e = (a.products![l.id] = a.products![l.id] || {}); e.stock = { ...p.stock, ...(e.stock || {}) }; e.stock[l.size] = Math.max(0, (e.stock[l.size] || 0) - l.qty); });
    write("leno-admin", a); setAdmin(a);
    setBag([]); write("leno-bag", []);
    setLastOrder(order); try { sessionStorage.setItem("leno-last-order", JSON.stringify(order)); } catch { /* ignore */ }
    return order;
  }, [bag, disc, live, subtotal]);

  /* overlays: Escape closes them, and the page behind stops scrolling */
  const anyOpen = ui.bag || ui.search || ui.menu || ui.size || !!ui.quick;
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setUi({ bag: false, search: false, menu: false, quick: null, size: false }); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    const l = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    document.documentElement.classList.toggle("ov-open", anyOpen);
    if (anyOpen) l?.stop(); else l?.start();
  }, [anyOpen]);

  const value: Ctx = { ready, catalog, live, bag, wish, recent, count, subtotal, disc, discLabel, free, isBundle, promo, cfg, add, setQty, toggleWish, seen, claim, placeOrder, lastOrder, ui, open, quick, toast, toastMsg };
  return <C.Provider value={value}>{children}</C.Provider>;
}

export const stockLine = (p: { stock: Record<Size, number> }) => {
  const t = total(p.stock); const ones = SIZES.filter((z) => p.stock[z] === 1);
  if (!t) return { cls: "out", text: "Sold out · join the waitlist" };
  if (ones.length) return { cls: "", text: "Only 1 left in " + ones.join(" · ") };
  return { cls: "ok", text: "In stock · ships today" };
};
