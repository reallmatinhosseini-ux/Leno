"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { LOOKS, PRODUCTS, SIZES, STYLES, Size, byId } from "@/lib/data";
import { asset, img, money } from "@/lib/site";
import { kissBurst } from "@/lib/fx";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import { splitChars } from "./Motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, Flip);
const reduce = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const desk = () => typeof window !== "undefined" && window.innerWidth > 900;

/* ---------- hero: three columns of campaign photos that wipe to new looks ---------- */
const COLS = [["h-pleat-white", "knot-sand-2", "h-set-white"], ["h-knot-navy", "pleat-blue-2", "h-tulle-ivory"], ["set-navy-3", "pleat-white-1", "knot-navy-3"]];
const LOOK = ["knot-navy", "pleat-blue", "tulle-ivory"];
export function Hero() {
  const s = useStore();
  const [slide, setSlide] = useState(0);
  const root = useRef<HTMLElement>(null);
  const bar = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    if (reduce()) return;
    const ctx = gsap.context(() => {
      const ch = Array.from(root.current!.querySelectorAll(".hx-h .ln")).flatMap((el) => splitChars(el));
      gsap.fromTo(".hx-col", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", stagger: .1 });
      gsap.fromTo(".hx-col img", { scale: 1.3 }, { scale: 1, duration: 2, ease: "expo.out", stagger: .1 });
      gsap.from(ch, { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: .03, delay: .4 });
      gsap.from(".hx-l > *:not(h1), .hx-r > *", { opacity: 0, y: 24, duration: 1, ease: "expo.out", stagger: .07, delay: .85 });
      gsap.utils.toArray<HTMLElement>(".hx-col").forEach((c, i) => gsap.to(c, { yPercent: [8, 15, 5][i], ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } }));
      gsap.to(".hx-txt", { yPercent: -25, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "25% top", end: "80% top", scrub: true } });
    }, root);
    COLS.forEach((c) => c.slice(1).forEach((n) => { const i = new Image(); i.src = img(n); }));
    return () => ctx.revert();
  }, []);
  useEffect(() => {
    if (reduce()) { const t = setTimeout(() => setSlide((x) => (x + 1) % 3), 6000); return () => clearTimeout(t); }
    const b = root.current!.querySelectorAll<HTMLElement>(".hx-dots b")[slide];
    root.current!.querySelectorAll<HTMLElement>(".hx-dots b").forEach((x) => gsap.set(x, { scaleX: 0 }));
    bar.current?.kill();
    bar.current = gsap.to(b, { scaleX: 1, duration: 6, ease: "none", delay: slide === 0 ? 1.4 : 0, onComplete: () => setSlide((x) => (x + 1) % 3) });
    return () => { bar.current?.kill(); };
  }, [slide]);
  const prev = useRef(0);
  useEffect(() => {
    if (prev.current === slide) return; prev.current = slide;
    root.current!.querySelectorAll<HTMLElement>(".hx-col").forEach((col, ci) => {
      const cur = col.querySelector(".sl"), nx = document.createElement("div"); nx.className = "sl";
      nx.innerHTML = `<img src="${img(COLS[ci][slide])}" alt="" draggable="false">`; col.appendChild(nx);
      if (reduce()) { cur?.remove(); return; }
      gsap.fromTo(nx, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", delay: ci * .1 });
      gsap.fromTo(nx.querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.9, ease: "expo.out", delay: ci * .1 });
      if (cur) gsap.to(cur.querySelector("img"), { scale: .94, yPercent: -5, duration: 1.3, ease: "expo.inOut", delay: ci * .1, onComplete: () => cur.remove() });
    });
  }, [slide]);
  return (
    <section className="hx" ref={root} aria-label="Court 01 campaign">
      <div className="hx-cols">{COLS.map((c, ci) => <div className="hx-col" key={ci}><div className="sl"><img src={img(c[0])} alt={ci === 0 ? "The Pleat Dress in White" : ""} fetchPriority={ci === 0 ? "high" : "auto"} draggable={false} /></div></div>)}</div>
      <div className="hx-shade" />
      <div className="hx-txt">
        <div className="hx-l">          <h1 className="H hx-h"><span className="ln">Leave your</span><span className="ln"><em>mark.</em></span></h1>
          <div className="hx-cta"><Link className="btn red" href="/shop/">Shop the collection</Link></div></div>
        <div className="hx-r"><button type="button" className="look-pill" onClick={() => s.quick(LOOK[slide])}><i />Shop this look</button>
          <div className="hx-dots">{[0, 1, 2].map((i) => <button key={i} type="button" className={i === slide ? "on" : ""} aria-label={`Look ${i + 1}`} onClick={() => setSlide(i)}><b /></button>)}</div></div>
      </div>
    </section>
  );
}

/* ---------- categories ---------- */
export function Categories() {
  const cats: [string, string, string][] = [["/shop/dresses/", "Dresses", "pleat-white-3"], ["/shop/sets/", "Sets", "set-navy-3"], ["/shop/navy-edit/", "The Navy Edit", "knot-navy-2"], ["/shop/light-edit/", "The Light Edit", "tulle-ivory-1"]];
  return (
    <section className="g cat2" aria-label="Shop by category"><div className="w cat2-grid">
      {cats.map(([h, n, i]) => <Link className="c2" href={h} key={h}><div className="c2-m" data-reveal><img src={img(i)} alt={n} loading="lazy" /></div><div className="c2-t"><span>{n}</span><i>→</i></div></Link>)}
    </div></section>
  );
}

/* ---------- continue browsing (returning visitors) ---------- */
export function ContinueBrowsing() {
  const s = useStore(); const rec = s.recent.map((id) => byId(id)!).filter(Boolean).slice(0, 4);
  if (!s.ready || rec.length < 2) return null;
  return <section className="g cont"><div className="w"><div className="sh-hd"><h2 className="H">Continue <em>browsing</em></h2><span className="mono mute">Picked up from your last visit</span></div><div className="grid g4">{rec.map((p) => <ProductCard key={p.id} product={p} />)}</div></div></section>;
}

/* ---------- shop grid with tabs ---------- */
const TABS: [string, string][] = [["all", "All"], ["dresses", "Dresses"], ["sets", "Sets"], ["navy", "Navy"], ["light", "Light"]];
export function ShopGrid() {
  const [tab, setTab] = useState("all"); const grid = useRef<HTMLDivElement>(null); const state = useRef<Flip.FlipState | null>(null);
  const show = (id: string) => { const p = byId(id)!; return tab === "all" || (tab === "dresses" && STYLES[p.style].cat === "dresses") || (tab === "sets" && STYLES[p.style].cat === "sets") || p.edit === tab; };
  const pick = (t: string) => { if (t === tab) return; if (!reduce() && grid.current) state.current = Flip.getState(grid.current.querySelectorAll(".card")); setTab(t); };
  useEffect(() => { if (state.current) { Flip.from(state.current, { duration: .7, ease: "expo.inOut", absolute: true, scale: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6 }), onLeave: (els) => gsap.to(els, { opacity: 0, duration: .3 }) }); state.current = null; } }, [tab]);
  return (
    <section className="g shop-sec"><div className="w">
      <div className="sh-hd"><h2 className="H" data-rise>New <em>season</em><img className="h-kiss" data-stamp src={asset("/p/kiss-tag.png")} alt="" aria-hidden="true" /></h2>
        <div className="tabs" role="tablist">{TABS.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => pick(k)}>{l}</button>)}</div></div>
      <div className="grid g4" ref={grid}>{PRODUCTS.map((p, i) => <div key={p.id} style={{ display: show(p.id) ? "contents" : "none" }}><ProductCard product={p} priority={i < 4} /></div>)}</div>
      <div className="shop-more"><Link className="ulink mono" href="/shop/">View all pieces →</Link></div>
    </div></section>
  );
}

/* ---------- shop the look ---------- */
export function Looks() {
  const s = useStore();
  return (
    <section className="g looks" id="looks"><div className="w">
      <div className="sh-hd"><h2 className="H" data-rise>Shop the <em>look</em><img className="h-kiss" data-stamp src={asset("/p/kiss-tag.png")} alt="" aria-hidden="true" /></h2><span className="mono mute">Buy the outfit together and save {s.cfg.bundlePct}%</span></div>
      <div className="looks-grid">{LOOKS.map((lk) => <LookCard key={lk.id} lk={lk} />)}</div>
    </div></section>
  );
}
function LookCard({ lk }: { lk: (typeof LOOKS)[number] }) {
  const s = useStore(); const ps = lk.items.map((id) => s.live(id) || { ...byId(id)!, price: STYLES[byId(id)!.style].price, badge: "", hidden: false });
  const [sz, setSz] = useState<Size[]>(ps.map((p) => SIZES.find((z) => p.stock[z]) || "M"));
  const [ok, setOk] = useState(false); const refs = useRef<(HTMLImageElement | null)[]>([]);
  const full = ps.reduce((a, p) => a + p.price, 0), now = Math.round(full * (1 - s.cfg.bundlePct / 100));
  return (
    <article className="lk">
      <div className="lk-m" data-reveal><img src={img(lk.img)} alt={lk.name} loading="lazy" />
        {ps.filter((p) => STYLES[p.style].cat === "sets").map((p) => <button key={p.id} type="button" className="hs" style={{ left: "50%", top: "55%" }} aria-label={`Quick view ${STYLES[p.style].name}`} onClick={() => s.quick(p.id)}><span>{STYLES[p.style].name} · {p.color}</span></button>)}</div>
      <div className="lk-t">
        <div className="lk-h"><h3 className="H">{lk.name}</h3><span className="lk-save">Save {money(full - now)}</span></div>
        {ps.map((p, i) => (
          <div className="lk-i" key={p.id}><Link href={`/products/${p.slug}/`}><img ref={(el) => { refs.current[i] = el; }} src={img(p.images[0])} alt="" /></Link><div><b>{STYLES[p.style].name}</b><span>{p.color} · {money(p.price)}</span></div>
            <select aria-label={`Size for ${STYLES[p.style].name}`} value={sz[i]} onChange={(e) => setSz(sz.map((x, j) => (j === i ? (e.target.value as Size) : x)))}>
              {SIZES.map((z) => <option key={z} value={z} disabled={!p.stock[z]}>{z}{p.stock[z] ? (p.stock[z] === 1 ? " · last one" : "") : " · sold out"}</option>)}</select></div>))}
        <button type="button" className={"btn red block lk-add" + (ok ? " ok" : "")} onClick={(e) => { kissBurst(e.currentTarget, 9); ps.forEach((p, i) => setTimeout(() => s.add(p.id, sz[i], refs.current[i], { silent: i === 0 }), i * 280)); setOk(true); setTimeout(() => setOk(false), 2500); }}>
          {ok ? "Look added ✓" : <>Add the look · {money(now)} <s>{money(full)}</s></>}</button>
      </div>
    </article>
  );
}

/* ---------- signature story (pinned, three frames) ---------- */
export function Signature() {
  const root = useRef<HTMLElement>(null); const s = useStore();
  useEffect(() => {
    if (reduce() || !desk()) return;
    const ctx = gsap.context(() => {
      gsap.set(".chap-media .f2, .chap-media .f3", { clipPath: "inset(100% 0% 0% 0%)" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", pin: true, scrub: 1 } });
      tl.to(".chap-media .f2", { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" }).from(".chap-media .f2 img", { scale: 1.3, duration: 1, ease: "none" }, "<")
        .to(".chap-step.s1", { opacity: 0, y: -24, duration: .4 }, "<.1").fromTo(".chap-step.s2", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4 }, ">-.1").to(".chap-bar i", { scaleX: .66, duration: 1, ease: "none" }, "<-.5")
        .to(".chap-media .f3", { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" }).from(".chap-media .f3 img", { scale: 1.3, duration: 1, ease: "none" }, "<")
        .to(".chap-step.s2", { opacity: 0, y: -24, duration: .4 }, "<.1").fromTo(".chap-step.s3", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4 }, ">-.1").to(".chap-bar i", { scaleX: 1, duration: 1, ease: "none" }, "<-.5");
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="chap" ref={root}><div className="g"><div className="w chap-in">
      <div className="chap-media"><button type="button" className="hs" style={{ left: "50%", top: "60%" }} aria-label="Shop the Pleat Dress" onClick={() => s.quick("pleat-white")}><span>The Pleat Dress · {money(s.live("pleat-white")?.price || 365)}</span></button>
        <div className="fr"><img src={img("h-pleat-white")} alt="The Pleat Dress, front" loading="lazy" /></div><div className="fr f2"><img src={img("pleat-white-1")} alt="The Pleat Dress in motion" loading="lazy" /></div><div className="fr f3"><img src={img("pleat-white-4")} alt="The Pleat Dress, open back" loading="lazy" /></div></div>
      <div className="chap-txt"><span className="mono" style={{ color: "var(--cream)" }}>The signature</span><h2 className="H" data-rise>The Pleat <em>Dress</em></h2>
        <div className="chap-steps"><div className="chap-step s1"><p>Knife pleats that move with every step.</p></div><div className="chap-step s2"><p>A V-shaped waist that lengthens the line.</p></div><div className="chap-step s3"><p>An open back, held by a single band.</p></div></div>
        <div className="chap-bar"><i /></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link className="btn light" href="/products/pleat-dress-white/">Shop white</Link><Link className="btn line light" href="/products/pleat-dress-blue/">Shop blue</Link></div></div>
    </div></div></section>
  );
}

/* ---------- last pieces (true scarcity from live stock) ---------- */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let down: { x: number; s: number } | null = null, moved = 0;
    const dn = (e: PointerEvent) => { if (e.pointerType !== "mouse" || (e.target as HTMLElement).closest("button")) return; down = { x: e.clientX, s: el.scrollLeft }; moved = 0; el.classList.add("drag"); };
    const mv = (e: PointerEvent) => { if (!down) return; moved = Math.abs(e.clientX - down.x); el.scrollLeft = down.s - (e.clientX - down.x); };
    const up = () => { down = null; el.classList.remove("drag"); };
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } };
    el.addEventListener("pointerdown", dn); addEventListener("pointermove", mv); addEventListener("pointerup", up); el.addEventListener("click", click, true);
    return () => { el.removeEventListener("pointerdown", dn); removeEventListener("pointermove", mv); removeEventListener("pointerup", up); el.removeEventListener("click", click, true); };
  }, []);
  return ref;
}
export function LastPieces() {
  const track = useDragScroll();
  const s = useStore(); const refs = useRef<Record<string, HTMLImageElement | null>>({}); const [added, setAdded] = useState<string[]>([]);
  const last = s.catalog.filter((p) => !p.hidden).map((p) => ({ p, zs: SIZES.filter((z) => p.stock[z] === 1) })).filter((x) => x.zs.length);
  if (!last.length) return null;
  return (
    <section className="ag"><div className="g"><div className="w sh-hd"><h2 className="H" data-rise>Last <em>pieces</em><img className="h-kiss" data-stamp src={asset("/p/kiss-tag.png")} alt="" aria-hidden="true" /></h2><span className="mono mute">One left in these sizes</span></div></div>
      <div className="ag-track" ref={track}>{last.map(({ p, zs }) => (
        <article className="ag-card" key={p.id}>
          <Link className="ag-m" href={`/products/${p.slug}/`}><img ref={(el) => { refs.current[p.id] = el; }} src={img(p.images[0])} alt={`${STYLES[p.style].name} in ${p.color}`} loading="lazy" draggable={false} /><span className="ag-badge">Last one · {zs.join(" · ")}</span></Link>
          <div className="ag-i"><div><b>{STYLES[p.style].name}</b><span className="mute">{p.color}</span></div><span>{money(p.price)}</span></div>
          <div className="ag-btns">{zs.map((z) => { const k = p.id + z; return <button key={z} type="button" className="btn ag-add" disabled={added.includes(k)} onClick={() => { if (s.add(p.id, z, refs.current[p.id])) setAdded([...added, k]); }}>{added.includes(k) ? "Added ✓" : `Add ${z}`}</button>; })}</div>
        </article>))}</div>
    </section>
  );
}

/* ---------- Tulle edition ---------- */
export function Edition() {
  const s = useStore(); const t = s.live("tulle-ivory");
  if (t?.hidden) return null;
  return (
    <section className="edition"><div className="g"><div className="w ed-in">
      <Link className="ed-media" href="/products/tulle-dress-ivory/" data-reveal><img src={img("tulle-ivory-lips")} alt="The Tulle Dress in Ivory, with the LENO WEAR kiss" loading="lazy" /></Link>
      <div className="ed-txt"><span className="ed-stock mono"><i />Edition · {t && t.stock.M === 1 ? "1 piece left" : "limited"}</span><h2 className="H" data-rise>The Tulle <em>Dress</em></h2><p>Ivory tulle over a racer-back bodice.</p>
        <div><Link className="btn red" href="/products/tulle-dress-ivory/">Shop the last one</Link></div></div>
    </div></div></section>
  );
}
