"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { LOOKS, PRODUCTS, SIZES, STYLES, Size, StyleKey, byId } from "@/lib/data";
import { asset, img, money } from "@/lib/site";
import { kissBurst } from "@/lib/fx";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import { splitChars } from "./Motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, Flip);
const reduce = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const desk = () => typeof window !== "undefined" && window.innerWidth > 900;

/* each film ships twice: HEVC (sharper at the same size; Safari, Chrome and Edge with hardware support) and H.264 for everything else */
const FilmSrc = ({ s }: { s: string }) => <><source src={asset(s.replace(/\.mp4$/, "-hevc.mp4"))} type='video/mp4; codecs="hvc1"' /><source src={asset(s)} type="video/mp4" /></>;

/* ---------- hero: a wide campaign banner. Ink panel on the left with a big two-line title,
   the photo on the right melting into it, two small rounded buttons. ---------- */
/* the two court films play one after the other on the right of the banner; the studio photo shows while they load */
const COURT = [
  { s: "/v/court-duo.mp4", p: "/v/court-duo.webp", l: "The Knot Dress in Sand and Navy on a Downtown Dubai court" },
  { s: "/v/court-pleat.mp4", p: "/v/court-pleat.webp", l: "The Pleat Dress in White on a Downtown Dubai court" },
];
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [cur, setCur] = useState(0), [live, setLive] = useState(false), [paused, setPaused] = useState(false);
  /* films play only while the banner is on screen, and never for people who ask for reduced motion */
  useEffect(() => {
    if (reduce()) return;
    const io = new IntersectionObserver(([e]) => { const v = vids.current[cur]; if (!v) return; if (e.isIntersecting && !paused) v.play().catch(() => {}); else v.pause(); }, { threshold: .1 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, [cur, paused]);
  const next = (i: number) => { if (i !== cur) return; const n = (i + 1) % COURT.length, v = vids.current[n]; if (v) { v.currentTime = 0; v.play().catch(() => {}); } setCur(n); };
  const toggle = () => { const p = !paused; setPaused(p); const v = vids.current[cur]; if (v) { if (p) v.pause(); else v.play().catch(() => {}); } };
  preload(img("hero-1200"), { as: "image", fetchPriority: "high", imageSrcSet: `${img("hero-1200")} 1200w, ${img("hero-2400")} 2400w`, imageSizes: "(max-width: 900px) 100vw, 65vw" });
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce()) return;
      gsap.fromTo(".df-img", { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: "expo.out" });
      gsap.from(".df-h .df-ln", { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: .1, delay: .2 });
      gsap.from(".df-k, .df-cta > *", { opacity: 0, y: 14, duration: .9, ease: "expo.out", stagger: .07, delay: .55 });
      gsap.to(".df-img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="df" ref={root} aria-label="LENO WEAR, new season">
      <div className="df-pic"><img className="df-img" src={img("hero-1200")} srcSet={`${img("hero-1200")} 1200w, ${img("hero-2400")} 2400w`} sizes="(max-width: 900px) 100vw, 65vw" alt="Wearing the Studio Set in White on a reformer in a Dubai studio" fetchPriority="high" />
        {COURT.map((f, i) => <video key={f.s} ref={(el) => { vids.current[i] = el; }} className={"df-v" + (live && i === cur ? " on" : "")} muted playsInline preload={i ? "metadata" : "auto"} onPlaying={() => setLive(true)} onEnded={() => next(i)} aria-label={f.l}><FilmSrc s={f.s} /></video>)}
      </div>
      <button type="button" className="df-pp" onClick={toggle} aria-label={paused ? "Play the films" : "Pause the films"} aria-pressed={paused}>{paused ? <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg> : <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" /></svg>}</button>
      <div className="df-txt">
        <span className="df-k">New season. Made in Dubai.</span>
        <h1 className="df-h"><span className="df-row"><span className="df-ln">Leave your</span></span><span className="df-row"><span className="df-ln df-o">mark</span></span></h1>
        <div className="df-cta"><Link className="df-pill" href="/shop/dresses/">Shop dresses</Link><Link className="df-pill" href="/shop/sets/">Shop sets</Link></div>
      </div>
    </section>
  );
}

/* ---------- categories ---------- */
/* ---------- brand promise ribbon ---------- */
export function Ribbon() {
  const items = ["Same-day delivery in Dubai", "Free 14-day returns", "Made in small runs", "Cash on delivery across the UAE", "Leave your mark"];
  const row = (k: number) => <div className="rb-row" aria-hidden={k > 0}>{items.map((t) => <span key={t + k}><em>{t}</em><img src={asset("/p/kiss-tag.png")} alt="" /></span>)}</div>;
  return <section className="rb" aria-label="Our promises"><div className="rb-track">{row(0)}{row(1)}</div></section>;
}

export function Categories() {
  const cats: [string, string, string][] = [["/shop/dresses/", "Dresses", "pleat-white-3"], ["/shop/sets/", "Sets", "set-navy-3"], ["/shop/navy-edit/", "The Navy Edit", "knot-navy-2"], ["/shop/light-edit/", "The Light Edit", "tulle-ivory-1"]];
  return (
    <section className="g cat2" aria-label="Shop by category"><div className="w cat2-grid">
      {cats.map(([h, n, i]) => <Link className="c2" href={h} key={h} data-cursor="Explore"><div className="c2-m" data-reveal><img src={img(i)} alt={n} loading="lazy" /></div><div className="c2-t"><span>{n}</span><i>→</i></div></Link>)}
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
const PICKS = ["pleat-white", "knot-navy", "set-navy", "tulle-ivory"];
export function ShopGrid() {
  return (
    <section className="g shop-sec"><div className="w">
      <div className="sh-hd"><h2 className="H" data-rise>New <em>season</em><img className="h-kiss" data-stamp src={asset("/p/kiss-tag.png")} alt="" aria-hidden="true" /></h2>
        <Link className="ulink sh-link" href="/shop/">Shop all 7 pieces →</Link></div>
      <div className="grid g4">{PICKS.map((id, i) => <ProductCard key={id} product={byId(id)!} priority={i < 4} />)}</div>
    </div></section>
  );
}

/* ---------- The Mark: a kiss presses onto the page and the line writes itself ---------- */
export function Mark() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduce()) return;
    const ctx = gsap.context(() => {
      const ch = Array.from(root.current!.querySelectorAll(".mk-h .ln")).flatMap((el) => splitChars(el));
      /* plays once as soon as it comes into view: never a blank screen */
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 72%", once: true } });
      tl.fromTo(".mk-kiss", { scale: 3.2, opacity: 0, rotate: -28, filter: "blur(10px)" }, { scale: 1, opacity: 1, rotate: -10, filter: "blur(0px)", duration: .6, ease: "power4.in" })
        .to(".mk-kiss", { scaleX: 1.12, scaleY: .86, duration: .08 })
        .to(".mk-kiss", { scaleX: 1, scaleY: 1, duration: .7, ease: "elastic.out(1,.4)" })
        .fromTo(".mk-ring", { scale: .4, opacity: .5 }, { scale: 2.4, opacity: 0, duration: .9, ease: "expo.out" }, "<-.05")
        .from(ch, { yPercent: 110, duration: 1, stagger: .022, ease: "expo.out" }, "<-.15")
        .from(".mk-p, .mk-cta", { y: 20, opacity: 0, duration: .8, stagger: .1, ease: "expo.out" }, "-=.6");
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="mk" ref={root} aria-label="Leave your mark"><div className="mk-in">
      <span className="mk-stage"><img className="mk-kiss" src={asset("/p/kiss-tag.png")} alt="" /><i className="mk-ring" /></span>
      <h2 className="H mk-h"><span className="ln">Leave your</span> <span className="ln"><em>mark.</em></span></h2>
      <p className="mk-p">Court-wear from Dubai, made in small runs. Every piece is chosen to move on court and to look right long after the last game.</p>
      <Link className="ulink mk-cta" href="/story/">Our story →</Link>
    </div></section>
  );
}

/* ---------- Shop by moment ---------- */
const MOMENTS = [
  { time: "07:00", t: "Studio", sub: "The warm-up and the coffee after", img: "set-white-3", ids: ["set-white", "set-navy"] },
  { time: "13:00", t: "Court", sub: "Every rally, every point", img: "pleat-blue-2", ids: ["pleat-white", "pleat-blue", "knot-navy"] },
  { time: "19:00", t: "City", sub: "From the last game into the evening", img: "tulle-ivory-1", ids: ["tulle-ivory", "knot-sand"] },
];
export function Moments() {
  const s = useStore();
  return (
    <section className="g mo"><div className="w">
      <div className="sh-hd"><h2 className="H" data-rise>Shop by <em>moment</em></h2><span className="mono mute">One day, three looks</span></div>
      <div className="mo-row">{MOMENTS.map((m) => (
        <article className="mo-p" key={m.t}>
          <img className="mo-img" src={img(m.img)} alt={`${m.t}: ${m.sub}`} loading="lazy" />
          <div className="mo-t"><span className="mo-time">{m.time}</span><h3>{m.t}</h3><p>{m.sub}</p>
            <ul>{m.ids.map((id) => { const p = s.live(id) || { ...byId(id)!, price: STYLES[byId(id)!.style].price, hidden: false }; return p.hidden ? null : (
              <li key={id}><Link href={`/products/${p.slug}/`}><img src={img(p.images[0])} alt="" /><span><b>{STYLES[p.style].name}</b>{p.color} · {money(p.price)}</span></Link></li>); })}</ul></div>
        </article>))}</div>
    </div></section>
  );
}

/* ---------- shop the look ---------- */
export function Looks() {
  const s = useStore();
  return (
    <section className="g looks" id="looks"><div className="w">
      <div className="sx-hd"><div><span className="sx-k">Buy it together · save {s.cfg.bundlePct}%</span><h2 className="sx-h">Shop the <em>look</em></h2></div><div className="sx-r"><Link className="sx-all" href="/shop/">View all</Link></div></div>
      <div className="looks-grid">{LOOKS.map((lk, i) => <LookCard key={lk.id} lk={lk} n={i + 1} />)}</div>
    </div></section>
  );
}
const LOOK_LINE: Record<string, string> = { navy: "The Knot Dress for the match, the Studio Set for the warm-up and the drive home.", light: "The Pleat Dress and the White Studio Set: one colour from the first serve to dinner." };
function LookCard({ lk, n }: { lk: (typeof LOOKS)[number]; n: number }) {
  const s = useStore(); const ps = lk.items.map((id) => s.live(id) || { ...byId(id)!, price: STYLES[byId(id)!.style].price, badge: "", hidden: false });
  const [sz, setSz] = useState<Size[]>(ps.map((p) => SIZES.find((z) => p.stock[z]) || "M"));
  const [ok, setOk] = useState(false); const refs = useRef<(HTMLImageElement | null)[]>([]);
  const full = ps.reduce((a, p) => a + p.price, 0), now = Math.round(full * (1 - s.cfg.bundlePct / 100));
  return (
    <article className="lk">
      <div className="lk-m" data-reveal><img src={img(lk.img)} alt={lk.name} loading="lazy" />
        {ps.filter((p) => STYLES[p.style].cat === "sets").map((p) => <button key={p.id} type="button" className="hs" style={{ left: "50%", top: "55%" }} aria-label={`Quick view ${STYLES[p.style].name}`} onClick={() => s.quick(p.id)}><span>{STYLES[p.style].name} · {p.color}</span></button>)}</div>
      <div className="lk-t">
        <span className="lk-n mono">Look 0{n} · {ps.length} pieces</span>
        <div className="lk-h"><h3 className="H">{lk.name.replace("The ", "")}</h3><span className="lk-save">Save {money(full - now)}</span></div>
        <p className="lk-line">{LOOK_LINE[lk.id] || ""}</p>
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
      /* frames crossfade (no hard wipe edge), the caption swaps, the bar fills */
      gsap.set(".chap-media .f2, .chap-media .f3", { opacity: 0 });
      gsap.set(".chap-step.s2, .chap-step.s3", { opacity: 0, y: 20 });
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: .6, anticipatePin: 1 } });
      tl.to(".chap-media .f2", { opacity: 1, duration: .14 }, .45).fromTo(".chap-media .f2 img", { scale: 1.08 }, { scale: 1, duration: 1 }, .45)
        .to(".chap-step.s1", { opacity: 0, y: -20, duration: .25 }, .3).to(".chap-step.s2", { opacity: 1, y: 0, duration: .25 }, .5).to(".chap-bar i", { scaleX: .66, duration: .5 }, .25)
        .to(".chap-media .f3", { opacity: 1, duration: .14 }, 1.45).fromTo(".chap-media .f3 img", { scale: 1.08 }, { scale: 1, duration: 1 }, 1.45)
        .to(".chap-step.s2", { opacity: 0, y: -20, duration: .25 }, 1.3).to(".chap-step.s3", { opacity: 1, y: 0, duration: .25 }, 1.5).to(".chap-bar i", { scaleX: 1, duration: .5 }, 1.25)
        .to({}, { duration: .3 });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    /* the pin wraps this section in a spacer; the outer div keeps React's node tree intact on navigation */
    <div className="pin-wrap"><section className="chap" ref={root}><div className="g"><div className="w chap-in">
      <div className="chap-media"><button type="button" className="hs" style={{ left: "50%", top: "60%" }} aria-label="Shop the Pleat Dress" onClick={() => s.quick("pleat-white")}><span>The Pleat Dress · {money(s.live("pleat-white")?.price || 365)}</span></button>
        <div className="fr"><img src={img("h-pleat-white")} alt="The Pleat Dress, front" loading="lazy" /></div><div className="fr f2"><img src={img("pleat-white-1")} alt="The Pleat Dress in motion" loading="lazy" /></div><div className="fr f3"><img src={img("pleat-white-4")} alt="The Pleat Dress, open back" loading="lazy" /></div></div>
      <div className="chap-txt"><span className="mono" style={{ color: "var(--cream)" }}>The signature</span><h2 className="H" data-rise>The Pleat <em>Dress</em></h2>
        <div className="chap-steps"><div className="chap-step s1"><p>Knife pleats that move with every step.</p></div><div className="chap-step s2"><p>A V-shaped waist that lengthens the line.</p></div><div className="chap-step s3"><p>An open back, held by a single band.</p></div></div>
        <div className="chap-bar"><i /></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link className="btn light" href="/products/pleat-dress-white/">Shop white</Link><Link className="btn line light" href="/products/pleat-dress-blue/">Shop blue</Link></div></div>
    </div></div></section></div>
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
          <Link className="ag-m" href={`/products/${p.slug}/`} data-cursor="View"><img ref={(el) => { refs.current[p.id] = el; }} src={img(p.images[0])} alt={`${STYLES[p.style].name} in ${p.color}`} loading="lazy" draggable={false} /><span className="ag-badge">Last one · {zs.join(" · ")}</span></Link>
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
  const left = t ? SIZES.reduce((a, z) => a + (t.stock[z] || 0), 0) : 0;
  const stockTxt = !t ? "Small edition" : left === 0 ? "Sold out · waitlist open" : left === 1 ? "1 piece left" : `Small edition · ${left} pieces`;
  return (
    <section className="edition"><div className="g"><div className="w ed-in">
      <Link className="ed-media" href="/products/tulle-dress-ivory/" data-reveal data-cursor="View"><img src={img("tulle-ivory-lips")} alt="The Tulle Dress in Ivory, with the LENO WEAR kiss" loading="lazy" /></Link>
      <div className="ed-txt"><span className="ed-stock mono"><i />{stockTxt}</span><h2 className="H" data-rise>The Tulle <em>Dress</em></h2><p>Ivory tulle over a racer-back bodice.</p>
        <div><Link className="btn red" href="/products/tulle-dress-ivory/">{left === 1 ? "Shop the last one" : left === 0 ? "Join the waitlist" : "Shop the Tulle Dress"}</Link></div></div>
    </div></div></section>
  );
}

/* ---------- the two edits: big edge-to-edge tiles, like a campaign spread ---------- */
export function Edits() {
  const s = useStore(); const vis = s.catalog.filter((p) => !p.hidden);
  const n = (cat: string) => vis.filter((p) => STYLES[p.style].cat === cat).length;
  const tiles: [string, string, string, string, number][] = [["/shop/dresses/", "Dresses", "Pleat, Knot and Tulle", "h-knot-navy", n("dresses")], ["/shop/sets/", "Sets", "The Studio Set", "h-set-white", n("sets")]];
  return (
    <section className="edits" id="after-hero" aria-label="Shop by edit">{tiles.map(([h, t, sub, im, c]) => (
      <Link className="edit" href={h} key={h} data-cursor="Shop">
        <div className="edit-m" data-reveal><img src={img(im)} alt={`${t}: ${sub}`} loading="lazy" /></div>
        <div className="edit-t"><span className="mono">{String(c).padStart(2, "0")} pieces</span><h2 className="H">{t}</h2><span className="edit-sub">{sub}</span><span className="edit-go">Shop {t.toLowerCase()} <i>→</i></span></div>
      </Link>))}
    </section>
  );
}

/* ---------- worn in Dubai: short films and stills, each tagged with what she wears ---------- */
const REEL: { v?: string; im: string; pid: string; cap: string }[] = [
  { v: "/v/court-duo.mp4", im: "/v/court-duo.webp", pid: "knot-sand", cap: "Downtown Dubai" },
  { im: "tulle-ivory-lips", pid: "tulle-ivory", cap: "After the last game" },
  { v: "/v/court-pleat.mp4", im: "/v/court-pleat.webp", pid: "pleat-white", cap: "Morning rally" },
  { im: "pleat-blue-2", pid: "pleat-blue", cap: "Match day" },
];
export function InMotion() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const vs = Array.from(root.current?.querySelectorAll("video") || []);
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target as HTMLVideoElement; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .35 });
    vs.forEach((v) => io.observe(v)); return () => io.disconnect();
  }, []);
  return (
    <section className="g reel" ref={root} aria-label="Worn in Dubai"><div className="w">
      <div className="sx-hd"><div><span className="sx-k">Our community</span><h2 className="sx-h">Worn in <em>Dubai</em></h2></div><div className="sx-r"><span className="sx-note">Real days, real courts.</span></div></div>
      <div className="reel-row">{REEL.map((r) => { const p = byId(r.pid)!; return (
        <Link className="reel-c" href={`/products/${p.slug}/`} key={r.pid} data-cursor="Shop">
          {r.v ? <video poster={asset(r.im)} muted loop playsInline preload="metadata"><FilmSrc s={r.v} /></video> : <img src={img(r.im)} alt="" loading="lazy" />}
          <span className="reel-cap mono">{r.cap}</span>
          <span className="reel-p"><img src={img(p.images[0])} alt="" /><span><b>{STYLES[p.style].name}</b>{p.color} · {money(STYLES[p.style].price)}</span></span>
          <span className="reel-go">Shop the fit</span>
        </Link>); })}</div>
    </div></section>
  );
}

/* ---------- the collection: tabs switch a swipeable row of pieces (arrows on desktop) ---------- */
const CTABS: [string, string, (p: { style: StyleKey; edit: string }) => boolean][] = [
  ["all", "All", () => true], ["dresses", "Dresses", (p) => STYLES[p.style].cat === "dresses"], ["sets", "Sets", (p) => STYLES[p.style].cat === "sets"],
  ["navy", "Navy edit", (p) => p.edit === "navy"], ["light", "Light edit", (p) => p.edit === "light"],
];
export function Collection({ kicker = "Court 01 · New season", title = <>The <em>collection</em></>, start = "all" }: { kicker?: string; title?: React.ReactNode; start?: string }) {
  const s = useStore(); const [tab, setTab] = useState(start); const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ l: true, r: false });
  const list = s.catalog.filter((p) => !p.hidden).filter(CTABS.find((t) => t[0] === tab)![2]);
  const upd = () => { const t = track.current; if (!t) return; setEdge({ l: t.scrollLeft < 8, r: t.scrollLeft + t.clientWidth > t.scrollWidth - 8 }); };
  useEffect(() => { const t = track.current; if (!t) return; t.scrollTo({ left: 0 }); upd(); if (!reduce()) gsap.fromTo(t.querySelectorAll(".card"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: .05, duration: .7, ease: "expo.out", clearProps: "transform,opacity" }); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = (d: number) => { const t = track.current; if (!t) return; t.scrollBy({ left: d * t.clientWidth * .8, behavior: "smooth" }); };
  return (
    <section className="g coll" aria-label="The collection"><div className="w">
      <div className="sx-hd"><div><span className="sx-k">{kicker}</span><h2 className="sx-h">{title}</h2></div>
        <div className="sx-r"><Link className="sx-all" href="/shop/">View all</Link>
          <div className="sx-arr"><button type="button" aria-label="Previous" disabled={edge.l} onClick={() => go(-1)}>←</button><button type="button" aria-label="Next" disabled={edge.r} onClick={() => go(1)}>→</button></div></div></div>
      <div className="sx-tabs" role="tablist">{CTABS.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
      <div className="sx-track" ref={track} onScroll={upd}>{list.map((p, i) => <ProductCard key={p.id} product={byId(p.id)!} priority={i < 4} />)}</div>
    </div></section>
  );
}

/* ---------- sign up and save: the honest welcome offer, inline ---------- */
export function SignUp() {
  const s = useStore(); const [done, setDone] = useState(false); const path = usePathname();
  if (!s.cfg.welcomeOn || /^\/(checkout|order)/.test(path)) return null;
  return (
    <section className="su" aria-label="Sign up and save"><div className="g"><div className="w su-in">
      <img className="su-kiss" src={asset("/p/kiss-tag.png")} alt="" aria-hidden="true" />
      <div><span className="sx-k light">First Serve</span><h2 className="sx-h light">Sign up <em>and save</em></h2><p>{s.cfg.welcomePct}% off your first order, early access to every drop, and nothing else in your inbox.</p></div>
      {done ? <p className="su-ok">Welcome to LENO. Code <b>LENO10</b> is saved to your bag.</p> :
        <form className="su-f" onSubmit={(e) => { e.preventDefault(); const email = String(new FormData(e.currentTarget).get("email") || ""); fetch("/api/subscribe/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "home" }) }).catch(() => {}); s.claim(); setDone(true); kissBurst(e.currentTarget, 10); }}>
          <input name="email" type="email" required placeholder="Your email address" aria-label="Your email address" autoComplete="email" /><button className="btn red" type="submit">Get {s.cfg.welcomePct}% off</button></form>}
    </div></div></section>
  );
}
