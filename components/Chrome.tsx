"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, SIZES, STYLES, Size, byId, siblings, total } from "@/lib/data";
import { img, money } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Bag, Close, Grid, Heart, Logo, Minus, Plus, Search, Kiss } from "./icons";
import ProductCard from "./ProductCard";
import { kissBurst } from "@/lib/fx";

/* ---------- announcement bar: live same-day cut-off + offers ---------- */
function cutoff() {
  const now = new Date(), dxb = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000), cut = new Date(dxb); cut.setHours(14, 0, 0, 0);
  const ms = +cut - +dxb;
  if (ms > 0) { const h = Math.floor(ms / 36e5), m = Math.floor((ms % 36e5) / 6e4); return `Order in ${h ? h + "h " : ""}${m}m for same-day delivery in Dubai`; }
  return "Order now for next-day delivery across the UAE";
}
const focused = (p: string) => p.startsWith("/checkout");
export function Announcement() {
  const s = useStore(); const path = usePathname();
  const [i, setI] = useState(0);
  const [cut, setCut] = useState("Same-day delivery in Dubai");
  useEffect(() => { setCut(cutoff()); const a = setInterval(() => setCut(cutoff()), 30000), b = setInterval(() => setI((x) => x + 1), 4200); return () => { clearInterval(a); clearInterval(b); }; }, []);
  const left = s.free - s.subtotal;
  if (focused(path)) return null;
  if (s.ready && s.count) return <div className="ann"><button type="button" className={"nudge" + (left <= 0 ? " ok" : "")} onClick={() => s.open("bag")}>{left > 0 ? `You are ${money(left)} away from free same-day delivery` : "Free same-day delivery unlocked ✓"}</button></div>;
  /* real offers only: the cut-off clock, free delivery, the welcome code, the look bundle, returns */
  const msgs = [cut, `Free same-day delivery over ${money(s.free)}`, ...(s.cfg.welcomeOn && !s.promo ? [`${s.cfg.welcomePct}% off your first order · code LENO10`] : []), ...(s.cfg.bundleOn ? [`Buy a dress and a set together, save ${s.cfg.bundlePct}%`] : []), "Free 14-day returns · Pay on delivery"];
  return (
    <div className="ann ut">
      <nav className="ut-l" aria-label="Help"><Link href="/help/">Help</Link><Link href="/help/#track">Track my order</Link><Link href="/story/">Our story</Link></nav>
      <div className="ut-c" aria-live="polite">{msgs.map((m, j) => <div key={j} className={j === i % msgs.length ? "on" : ""}>{m}</div>)}</div>
      <span className="ut-r">UAE · AED</span>
    </div>
  );
}

/* ---------- header ---------- */
export function Header() {
  const s = useStore(), path = usePathname();
  const [solid, setSolid] = useState(false), [hide, setHide] = useState(false);
  useEffect(() => {
    let last = 0;
    const on = () => { const y = window.scrollY; setSolid(y > 30 || path !== "/"); setHide(y > last && y > 400); last = y; };
    on(); window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on);
  }, [path]);
  return (
    <header className={"hdr g solid" + (solid && path === "/" ? " shrunk" : "") + /* always a plain solid bar; it slims down once you scroll */ (hide && !Object.values(s.ui).some(Boolean) ? " hide" : "")}>
      <nav className="l" aria-label="Primary">
        <button className="burger3" type="button" aria-label="Open menu" aria-expanded={s.ui.menu} onClick={() => s.open("menu")}><i /><i /><i /><span>Menu</span></button>
        <Link className={"hx-l" + (path === "/shop/" ? " on" : "")} href="/shop/">Shop all</Link>
        <Link className={"hx-l" + (path === "/shop/dresses/" ? " on" : "")} href="/shop/dresses/">Dresses</Link>
        <Link className={"hx-l" + (path === "/shop/sets/" ? " on" : "")} href="/shop/sets/">Sets</Link>
      </nav>
      <Link className="logo" href="/" aria-label="LENO WEAR home"><Logo /></Link>
      <nav className="r" aria-label="Utility">
        <button className="hx-search" type="button" onClick={() => s.open("search")} aria-label="Search"><Search /><span>Search dresses, sets…</span></button>
        <Link className="nl ic hide-m" href="/wishlist/" aria-label="Wishlist"><Heart />{s.wish.length > 0 && <span className="cnt">{s.wish.length}</span>}</Link>
        <button className="nl ic" type="button" data-bag-target onClick={() => s.open("bag")} aria-label={`Bag, ${s.count} items`}><Bag />{s.count > 0 && <span className="cnt" key={s.count} style={{ animation: "pop .6s" }}>{s.count}</span>}</button>
      </nav>
    </header>
  );
}

/* ---------- mobile menu + tab bar ---------- */
export function MobileMenu() {
  const s = useStore(); const close = () => s.open("menu", false); const path = usePathname();
  const [hov, setHov] = useState(0);
  const vis = s.catalog.filter((p) => !p.hidden);
  const n = (f: (p: (typeof vis)[number]) => boolean) => vis.filter(f).length;
  /* main destinations, each with a picture for the desktop preview */
  const MAIN: { h: string; l: string; c: number; im: string; sub: string }[] = [
    { h: "/shop/", l: "Shop all", c: n(() => true), im: "h-pleat-white", sub: "Every piece from Court 01" },
    { h: "/shop/dresses/", l: "Dresses", c: n((p) => STYLES[p.style].cat === "dresses"), im: "h-knot-navy", sub: "Pleat, Knot and Padel" },
    { h: "/shop/sets/", l: "Sets", c: n((p) => STYLES[p.style].cat === "sets"), im: "h-set-white", sub: "The Studio Set" },
    { h: "/shop/navy-edit/", l: "Navy edit", c: n((p) => p.edit === "navy"), im: "set-navy-3", sub: "Deep navy and royal blue" },
    { h: "/shop/light-edit/", l: "Light edit", c: n((p) => p.edit === "light"), im: "h-tulle-ivory", sub: "White, ivory and sand" },
  ];
  useEffect(() => { if (s.ui.menu) setHov(Math.max(0, MAIN.findIndex((m) => m.h === path))); }, [s.ui.menu]); // eslint-disable-line react-hooks/exhaustive-deps
  return (<>
    <div className={"mx-scrim" + (s.ui.menu ? " open" : "")} onClick={close} aria-hidden="true" />
    <aside className={"mx" + (s.ui.menu ? " open" : "")} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!s.ui.menu}>
      <div className="mx-l">
        <div className="mx-top"><Link className="mx-logo" href="/" onClick={close} aria-label="LENO WEAR home"><Logo /></Link><button type="button" className="mx-x" onClick={close} aria-label="Close menu"><span>Close</span><Close /></button></div>
        <button type="button" className="mx-search" onClick={() => s.open("search")}><Search /><span>Search dresses, sets, colours…</span></button>
        <span className="mx-k" style={{ ["--i" as string]: 0 }}>Shop</span>
        <nav className="mx-main" aria-label="Shop">
          {MAIN.map((m, i) => <Link key={m.h} href={m.h} onClick={close} onMouseEnter={() => setHov(i)} onFocus={() => setHov(i)} className={"mx-a" + (i === hov ? " on" : "") + (path === m.h ? " here" : "")} style={{ ["--i" as string]: i }}>
            <b>{m.l}</b><em>{m.c}</em><i aria-hidden="true">→</i></Link>)}
        </nav>
        <div className="mx-cards" style={{ ["--i" as string]: 5 }}>
          <Link href="/products/pleat-dress-white/" onClick={close} className="mx-card"><span className="mx-ci"><img src={img("pleat-white-2")} alt="" /></span><span className="mx-ct"><small>The signature</small>The Pleat Dress</span></Link>
          <Link href="/#looks" onClick={close} className="mx-card"><span className="mx-ci"><img src={img("set-navy-2")} alt="" /></span><span className="mx-ct"><small>Save {s.cfg.bundlePct}%</small>Shop the look</span></Link>
        </div>
        <span className="mx-k" style={{ ["--i" as string]: 6 }}>Help & info</span>
        <nav className="mx-sub" aria-label="More" style={{ ["--i" as string]: 6 }}>
          <Link href="/story/" onClick={close}>Our story</Link><Link href="/help/" onClick={close}>Track order</Link><Link href="/help/" onClick={close}>Delivery & returns</Link><Link href="/wishlist/" onClick={close}>Wishlist{s.wish.length ? ` (${s.wish.length})` : ""}</Link>
        </nav>
        <ul className="mx-offers" style={{ ["--i" as string]: 7 }}>
          {s.cfg.welcomeOn && <li><Kiss />{s.cfg.welcomePct}% off your first order · code LENO10</li>}
          <li><span className="mx-dot" />Free same-day delivery in Dubai over {money(s.free)}</li>
          <li><span className="mx-dot" />Pay on delivery · free 14-day returns</li>
        </ul>
      </div>
      <div className="mx-r" aria-hidden="true">
        {MAIN.map((m, i) => <figure key={m.h} className={i === hov ? "on" : ""}><img src={img(m.im)} alt="" loading="lazy" /><figcaption><small>{String(m.c).padStart(2, "0")} pieces</small><b>{m.l}</b><span>{m.sub}</span></figcaption></figure>)}
      </div>
    </aside>
  </>);
}
export function TabBar() {
  const s = useStore(), path = usePathname();
  if (focused(path)) return null;
  return (
    <nav className="tabbar" aria-label="Quick">
      <Link href="/shop/" className={path.startsWith("/shop") ? "on" : ""}><Grid /><span>Shop</span></Link>
      <button type="button" onClick={() => s.open("menu")}><span className="tb-menu"><i /><i /><i /></span><span>Menu</span></button>
      <Link href="/wishlist/" className={path === "/wishlist/" ? "on" : ""}><Heart /><span>Wishlist</span></Link>
      <button type="button" data-bag-target onClick={() => s.open("bag")}><Bag /><span>Bag {s.count > 0 && <b className="cnt">{s.count}</b>}</span></button>
    </nav>
  );
}

/* ---------- bag drawer ---------- */
export function BagDrawer() {
  const s = useStore();
  const left = s.free - s.subtotal;
  const picks = useMemo(() => {
    if (left <= 0 || !s.bag.length) return [];
    const inBag = s.bag.map((l) => l.id);
    return s.catalog.filter((p) => !p.hidden && !inBag.includes(p.id) && total(p.stock) > 0)
      .sort((a, b) => { const da = a.price - left, db = b.price - left; return (da >= 0 ? da : 9999 - da) - (db >= 0 ? db : 9999 - db); }).slice(0, 2);
  }, [s.catalog, s.bag, left]);
  useEffect(() => { document.documentElement.style.overflow = s.ui.bag ? "hidden" : ""; }, [s.ui.bag]);
  return (
    <>
      <div className={"scrim" + (s.ui.bag || s.ui.quick ? " on" : "")} onClick={() => { s.open("bag", false); s.quick(null); }} />
      <aside className={"drawer" + (s.ui.bag ? " open" : "")} role="dialog" aria-label="Your bag" aria-hidden={!s.ui.bag}>
        <div className="dr-hd"><span className="H">Your bag <sup className="mono" style={{ fontSize: 12 }}>{s.count}</sup></span><button type="button" aria-label="Close" onClick={() => s.open("bag", false)}><Close /></button></div>
        {s.bag.length > 0 && <div className="dr-ship"><span>{left > 0 ? <><b>{money(left)}</b> away from free same-day delivery</> : "Free same-day delivery unlocked"}</span><div className={"meter" + (left > 0 ? "" : " full")}><i style={{ transform: `scaleX(${Math.min(1, s.subtotal / s.free)})` }} /></div></div>}
        <div className="dr-body">
          {!s.bag.length ? (
            <div className="dr-empty"><Kiss className="ld-kiss" /><span className="H" style={{ fontSize: 40 }}>Your bag is empty</span><p className="mute">Start with the Pleat Dress. It is the one everyone asks about.</p><Link className="btn red" href="/products/pleat-dress-white/" onClick={() => s.open("bag", false)}>The Pleat Dress</Link></div>
          ) : (<>
            {s.isBundle && <div className="bundle-ok">Look bundle unlocked: {s.cfg.bundlePct}% off your order</div>}
            {s.bag.map((l, i) => { const p = s.live(l.id)!; return (
              <div className="ln" key={l.id + l.size}>
                <Link href={`/products/${p.slug}/`} onClick={() => s.open("bag", false)}><img src={img(p.images[0])} alt="" /></Link>
                <div className="t"><b>{STYLES[p.style].name}</b><span>{p.color} · {l.size}</span>
                  <div className="qty"><button type="button" aria-label="Decrease" onClick={() => s.setQty(i, l.qty - 1)}><Minus /></button><span>{l.qty}</span><button type="button" aria-label="Increase" onClick={() => s.setQty(i, l.qty + 1)}><Plus /></button></div>
                  <button type="button" className="rm" onClick={() => s.setQty(i, 0)}>Remove</button></div>
                <span className="p">{money(p.price * l.qty)}</span>
              </div>); })}
            {picks.length > 0 && <div className="gap"><span className="mono">Add {money(left)} for free same-day delivery</span><div className="gap-r">{picks.map((p) => { const z = SIZES.find((q) => p.stock[q])!; return (
              <div className="gap-i" key={p.id}><img src={img(p.images[0])} alt="" /><div><b>{STYLES[p.style].name}</b><span>{p.color} · {money(p.price)}</span></div><button type="button" className="add" onClick={() => s.add(p.id, z as Size, null, { silent: true })}>Add {z}</button></div>); })}</div></div>}
          </>)}
        </div>
        {s.bag.length > 0 && <div className="dr-ft">
          {s.disc > 0 && <div className="tot promo"><span>{s.discLabel}</span><span>−{money(s.disc)}</span></div>}
          <div className="tot"><span>Subtotal <span className="mute" style={{ fontSize: 12 }}>incl. VAT</span></span><b>{money(s.subtotal - s.disc)}</b></div>
          <Link className="btn block" href="/checkout/" onClick={() => s.open("bag", false)}>Checkout</Link>
          <div className="dr-trust"><span>Free 14-day returns</span><span>Secure checkout</span><span>Same-day Dubai</span></div>
        </div>}
      </aside>
    </>
  );
}

/* ---------- search overlay ---------- */
export function SearchOverlay() {
  const s = useStore(); const [q, setQ] = useState(""); const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (s.ui.search) setTimeout(() => ref.current?.focus(), 250); }, [s.ui.search]);
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list = PRODUCTS.filter((p) => { const st = STYLES[p.style]; const hay = [st.name, p.color, st.cat, st.cat === "dresses" ? "dress tennis padel" : "set studio", p.edit, st.code].join(" ").toLowerCase(); return words.every((w) => hay.includes(w)); });
  return (
    <div className={"srch g" + (s.ui.search ? " open" : "")} role="dialog" aria-label="Search" aria-hidden={!s.ui.search}>
      <div className="top"><Link className="logo" href="/" onClick={() => s.open("search", false)}><Logo /></Link><button type="button" aria-label="Close" onClick={() => s.open("search", false)}><Close /></button></div>
      <label htmlFor="sq" className="sr">Search</label>
      <input id="sq" ref={ref} type="search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      <div className="pop"><span className="mono mute" style={{ alignSelf: "center", marginRight: 6 }}>Popular</span>{["White", "Navy", "Dress", "Set", "Padel"].map((w) => <button key={w} type="button" className="chip" onClick={() => setQ(w)}>{w}</button>)}</div>
      <div className="res" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) s.open("search", false); }}>
        {list.length ? <div className="grid g4">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <p className="mute" style={{ fontSize: 18, paddingTop: 20 }}>Nothing found. Try “white” or “dress”.</p>}
      </div>
    </div>
  );
}

/* ---------- quick view ---------- */
export function QuickView() {
  const s = useStore(); const p = s.ui.quick ? s.live(s.ui.quick) : undefined;
  const [size, setSize] = useState<Size | null>(null); const ref = useRef<HTMLImageElement>(null);
  useEffect(() => setSize(null), [s.ui.quick]);
  if (!p) return null;
  const st = STYLES[p.style];
  return (
    <div className="modal open" role="dialog" aria-modal="true" aria-label={st.name} onClick={(e) => { if (e.target === e.currentTarget) s.quick(null); }}>
      <div className="mbox lg">
        <button type="button" className="mx" aria-label="Close" onClick={() => s.quick(null)}><Close /></button>
        <div className="qvw">
          <Link href={`/products/${p.slug}/`} className="qv-m" onClick={() => s.quick(null)}><img ref={ref} src={img(p.images[0])} alt={st.name} /><img className="b" src={img(p.images[1])} alt="" /></Link>
          <div className="qv-i">
            <span className="mono mute">{st.code} · {st.cat === "sets" ? "Sets" : "Dresses"}</span>
            <h3 className="H">{st.name}</h3>
            <div className="price"><b>{money(p.price)}</b><span className="mute"> incl. VAT</span></div>
            <p className="mute">{st.desc}</p>
            <div className="colours">{siblings(p).map((q) => <Link key={q.id} href={`/products/${q.slug}/`} className={q.id === p.id ? "on" : ""} onClick={() => s.quick(null)}><img src={img(q.images[0])} alt={q.color} /></Link>)}</div>
            <span className="mono">Size · {size || "select"}</span>
            <div className="szs">{SIZES.map((z) => <button key={z} type="button" className={(p.stock[z] ? "" : "out") + (size === z ? " on" : "")} onClick={() => p.stock[z] ? setSize(z) : s.toast(`Size ${z} is sold out`)}>{z}{p.stock[z] === 1 && <small>1 left</small>}</button>)}</div>
            <button type="button" className="btn red block atb" style={{ marginTop: 14 }} disabled={!total(p.stock)} onClick={() => { if (!size) { s.toast("Select a size"); return; } s.add(p.id, size, ref.current); }}>{size ? `Add to bag · ${size}` : "Add to bag"}</button>
            <Link className="ulink" href={`/products/${p.slug}/`} style={{ justifySelf: "start", fontSize: 14 }} onClick={() => s.quick(null)}>View full details →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- toast + welcome offer card ---------- */
export function Toast() { const s = useStore(); return <div className={"toast" + (s.toastMsg ? " on" : "")} role="status" aria-live="polite"><Kiss />{s.toastMsg}</div>; }
export function OfferCard() {
  const s = useStore(); const path = usePathname();
  const [show, setShow] = useState(false), [done, setDone] = useState(false), [atFoot, setAtFoot] = useState(false);
  useEffect(() => { const f = document.querySelector("footer"); if (!f) return; const io = new IntersectionObserver(([e]) => setAtFoot(e.isIntersecting)); io.observe(f); return () => io.disconnect(); }, []);
  useEffect(() => {
    if (!s.ready || s.promo || !s.cfg.welcomeOn || s.count) return;
    let snooze = 0; try { snooze = +(localStorage.getItem("leno-offer-snooze") || 0); } catch { /* ignore */ }
    if (Date.now() - snooze < 7 * 864e5) return;
    const t = setTimeout(() => setShow(true), 20000);
    return () => clearTimeout(t);
  }, [s.ready, s.promo, s.cfg.welcomeOn, s.count]);
  if (!show || focused(path) || path.startsWith("/order")) return null;
  const close = () => { setShow(false); try { localStorage.setItem("leno-offer-snooze", String(Date.now())); } catch { /* ignore */ } };
  return (
    <aside className={"offer" + (atFoot ? " away" : "")} aria-label="Welcome offer">
      <button type="button" className="ox" aria-label="Close" onClick={close}><Close /></button>
      <div className="of-top"><Kiss /><div><b>{s.cfg.welcomePct}% off your first order</b><span>Join First Serve for early access to every drop.</span></div></div>
      {done ? <p className="of-done">Code <b>LENO10</b> is saved to your bag. Welcome to LENO WEAR.</p> :
        <form className="field lt" onSubmit={(e) => { e.preventDefault(); s.claim(); setDone(true); s.toast(`${s.cfg.welcomePct}% welcome offer saved to your bag`); setTimeout(() => setShow(false), 4200); }}>
          <input type="email" placeholder="Your email" aria-label="Your email" required /><button className="btn red" type="submit">Join</button></form>}
    </aside>
  );
}

/* ---------- footer ---------- */
export function Footer() {
  const path = usePathname();
  if (focused(path)) return <footer className="co-foot g"><div className="w"><span>Secure checkout · LENO WEAR, Dubai</span><Link className="ulink" href="/help/">Need help?</Link></div></footer>;
  return (
    <footer className="foot"><div className="g"><div className="w">
      <div className="foot-top">
        <div className="foot-brand">
          <Link href="/" className="foot-logo-l" aria-label="LENO WEAR home"><img className="foot-logo" src="/p/leno-logo.png" alt="" width={307} height={320} /></Link>
          <p className="foot-tag">Court-wear from Dubai, made in small runs for padel, tennis and everything after.</p>
        </div>
        <nav className="foot-col" aria-label="Shop"><h4>Shop</h4><ul><li><Link href="/shop/">Shop all</Link></li><li><Link href="/shop/dresses/">Dresses</Link></li><li><Link href="/shop/sets/">Sets</Link></li><li><Link href="/shop/navy-edit/">Navy edit</Link></li><li><Link href="/shop/light-edit/">Light edit</Link></li></ul></nav>
        <nav className="foot-col" aria-label="Help"><h4>Help</h4><ul><li><Link href="/help/">Track order</Link></li><li><Link href="/help/">Delivery</Link></li><li><Link href="/help/">Returns</Link></li><li><Link href="/help/">Contact</Link></li></ul></nav>
        <nav className="foot-col" aria-label="LENO WEAR"><h4>LENO WEAR</h4><ul><li><Link href="/story/">Our story</Link></li><li><Link href="/wishlist/">Wishlist</Link></li><li><Link href="/help/">FAQ</Link></li></ul></nav>
      </div>
      <div className="foot-sig" aria-hidden="true"><i /><Kiss /><span>Leave your mark</span><i /></div>
      <div className="foot-bot"><span>© 2026 LENO WEAR · Dubai</span><span>Secure checkout · Cash on delivery across the UAE</span><span>Prices in AED, VAT included</span></div>
    </div></div></footer>
  );
}
export { byId };
