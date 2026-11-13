"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SIZES, STYLES, Size, byId, partnerOf, siblings, total } from "@/lib/data";
import { img, money } from "@/lib/site";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import { Arrow, Close, Heart, Lock, Return, Ruler, Truck } from "./icons";

function cutoff() {
  const now = new Date(), dxb = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000), cut = new Date(dxb); cut.setHours(14, 0, 0, 0);
  const ms = +cut - +dxb;
  if (ms > 0) { const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000); return { t: "Arrives today in Dubai", s: "Order within " + (h ? h + "h " : "") + m + "m" }; }
  return { t: "Arrives tomorrow in Dubai", s: "Next day to every other emirate" };
}
const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ProductView({ id }: { id: string }) {
  const s = useStore(); const router = useRouter();
  const base = byId(id)!;
  const p = s.live(id) || { ...base, price: STYLES[base.style].price, badge: "", hidden: false };
  const st = STYLES[p.style], tot = total(p.stock), sib = siblings(p);
  const partner = s.live(partnerOf(p).id)!;
  const also = s.catalog.filter((q) => !q.hidden && q.style !== p.style && q.id !== partner.id).sort((a, b) => +(b.edit === p.edit) - +(a.edit === p.edit)).slice(0, 4);
  const rec = s.recent.filter((x) => x !== id).map((x) => byId(x)!).filter(Boolean).slice(0, 4);
  const ones = SIZES.filter((z) => p.stock[z] === 1);
  const [size, setSize] = useState<Size | null>(null);
  const [need, setNeed] = useState(0);
  const [done, setDone] = useState(false);
  const [idx, setIdx] = useState(0);
  const [lb, setLb] = useState<number | null>(null);
  const [guide, setGuide] = useState(false);
  const [wait, setWait] = useState<Size | "any" | null>(null); const [waitDone, setWaitDone] = useState(false);
  const joinWait = (email: string) => {
    try { const k = "leno-waitlist", a = JSON.parse(localStorage.getItem(k) || "[]"); a.unshift({ id: p.id, size: wait, email, date: new Date().toISOString() }); localStorage.setItem(k, JSON.stringify(a)); } catch { /* storage unavailable */ }
    setWaitDone(true);
  };
  const [ship, setShip] = useState({ t: "Same-day delivery in Dubai", s: "Order by 2 pm" });
  const [sticky, setSticky] = useState(false);
  const first = (q: typeof p) => SIZES.find((z) => q.stock[z]) || "M";
  const [z1, setZ1] = useState<Size>(first(p)); const [z2, setZ2] = useState<Size>(first(partner));
  const [both, setBoth] = useState(false);
  const track = useRef<HTMLDivElement>(null); const addBtn = useRef<HTMLButtonElement>(null); const info = useRef<HTMLDivElement>(null); const msg = useRef<HTMLParagraphElement>(null);

  useEffect(() => { s.seen(id); setShip(cutoff()); const iv = setInterval(() => setShip(cutoff()), 30000); return () => clearInterval(iv); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!reduce()) {
      gsap.from(info.current!.children, { y: 24, opacity: 0, stagger: .04, duration: .9, ease: "expo.out", delay: .1, clearProps: "transform,opacity" });
      gsap.from(".pd-thumbs button", { x: -20, opacity: 0, stagger: .05, duration: .8, ease: "expo.out", delay: .3, clearProps: "transform,opacity" });
    }
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    if (addBtn.current) io.observe(addBtn.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => { if (size && msg.current && !reduce()) gsap.fromTo(msg.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .4 }); }, [size]);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (lb === null) return; if (e.key === "Escape") setLb(null); if (e.key === "ArrowRight") setLb((lb + 1) % p.images.length); if (e.key === "ArrowLeft") setLb((lb - 1 + p.images.length) % p.images.length); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [lb, p.images.length]);

  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setWait(null); setGuide(false); } }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  useEffect(() => { document.documentElement.classList.toggle("ov-open", !!wait || guide || lb !== null); }, [wait, guide, lb]);
  const show = (i: number) => { const n = p.images.length, j = (i + n) % n; track.current?.scrollTo({ left: j * track.current.clientWidth, behavior: "smooth" }); };
  const onScroll = () => { const t = track.current!; setIdx(Math.round(t.scrollLeft / (t.clientWidth || 1))); };
  const message = tot === 0 ? "Sold out in every size. Join the waitlist below." : need ? "Choose your size to continue." : size ? (p.stock[size] === 1 ? `Only one left in ${size}.` : p.stock[size] === 2 ? `Two left in ${size}.` : `In stock in ${size}, ready to ship.`) : ones.length ? `Only one left in ${ones.join(" and ")}.` : "In stock and ready to ship.";
  const low = !!need || (size ? p.stock[size] <= 2 : ones.length > 0);

  const pick = (z: Size) => { if (!p.stock[z]) { setWaitDone(false); setWait(z); return; } setSize(z); setNeed(0); };
  const resolve = (): Size | null => {
    if (!tot) { setWaitDone(false); setWait("any"); return null; }
    if (size) return size;
    const only = SIZES.filter((z) => p.stock[z]); if (only.length === 1) { setSize(only[0]); return only[0]; }
    setNeed((n) => n + 1);
    if (innerWidth <= 900) { const o = document.querySelector(".pd-sizes"); if (o) scrollTo({ top: o.getBoundingClientRect().top + scrollY - 140, behavior: "smooth" }); }
    return null;
  };
  const addNow = () => { const z = resolve(); if (!z) return; if (s.add(p.id, z, document.querySelector<HTMLElement>(".pd-sl img"))) { setDone(true); setTimeout(() => setDone(false), 1600); } };
  const buyNow = () => { const z = resolve(); if (z && s.add(p.id, z, null, { silent: true })) router.push("/checkout/"); };
  const full = p.price + partner.price, now = s.cfg.bundleOn ? Math.round(full * (1 - s.cfg.bundlePct / 100)) : full;
  const labels = <>{<span className="lbl">New season</span>}{p.id === "pleat-white" && <span className="lbl dark">Signature</span>}{p.badge && <span className="lbl dark">{p.badge}</span>}{tot === 0 ? <span className="lbl mute">Sold out</span> : tot === 1 ? <span className="lbl red">Last one</span> : tot <= 3 ? <span className="lbl red">Low stock</span> : null}</>;

  return (<>
    <section className="pd">
      <div className="pd-gal">
        <div className="pd-thumbs">{p.images.map((n, i) => <button key={n} type="button" className={i === idx ? "on" : ""} aria-label={`Image ${i + 1}`} onClick={() => show(i)}><img src={img(n)} alt="" /></button>)}</div>
        <div className="pd-main">
          <div className="pd-track" ref={track} onScroll={onScroll}>{p.images.map((n, i) => <Slide key={n} src={img(n)} alt={`${st.name} in ${p.color}, image ${i + 1}`} first={i === 0} onOpen={() => setLb(i)} />)}</div>
          <span className="pd-count">{idx + 1} / {p.images.length}</span>
          <div className="pd-dots">{p.images.map((n, i) => <i key={n} className={i === idx ? "on" : ""} />)}</div>
          <button type="button" className="pd-arrow l" aria-label="Previous image" onClick={() => show(idx - 1)}><Arrow flip /></button>
          <button type="button" className="pd-arrow r" aria-label="Next image" onClick={() => show(idx + 1)}><Arrow /></button>
        </div>
      </div>
      <div className="pd-info" ref={info}>
        <nav className="pd-crumb mono" aria-label="Breadcrumb"><Link href="/shop/">Shop</Link><span>/</span><Link href={`/shop/${st.cat}/`}>{st.cat === "sets" ? "Sets" : "Dresses"}</Link></nav>
        <div className="pd-labels">{labels}</div>
        <h1 className="pd-name">{st.name} <span className="mute" style={{ fontWeight: 400 }}>· {p.color}</span></h1>
        <div className="pd-price"><b>{money(p.price)}</b><span>incl. VAT</span></div>
        <p className="pd-bnpl">Or 4 interest-free payments of {money(Math.round(p.price / 4))} with <span className="tabby">tabby</span></p>
        <div className="pd-opt"><div className="pd-row"><span>Colour <b>{p.color}</b></span></div>
          <div className="pd-sw">{sib.map((q) => <Link key={q.id} href={`/products/${q.slug}/`} className={q.id === p.id ? "on" : ""} aria-label={q.color} aria-current={q.id === p.id ? "page" : undefined}><img src={img(q.images[0])} alt="" /><span>{q.color}</span></Link>)}</div></div>
        <div className="pd-opt"><div className="pd-row"><span>Size <b>{size || "Select"}</b></span><button type="button" className="pd-guide" onClick={() => setGuide(true)}><Ruler />Size guide</button></div>
          <div className={"pd-sizes" + (need ? " need" : "")} key={need}>{SIZES.map((z) => <button key={z} type="button" className={(p.stock[z] ? "" : "out") + (size === z ? " on" : "")} aria-pressed={size === z} aria-label={`Size ${z}${p.stock[z] ? "" : ", sold out"}`} onClick={() => pick(z)}>{z}</button>)}</div>
          <p className={"pd-msg" + (low ? " low" : "")} ref={msg} aria-live="polite">{message}</p></div>
        <div className="pd-buy"><button ref={addBtn} type="button" className={"btn red pd-add" + (done ? " done" : "")} onClick={addNow}><span className="a1">{tot ? (size ? `Add to bag · ${size}` : "Add to bag") : "Join the waitlist"}</span><span className="a2">Added to bag ✓</span></button>
          <button type="button" className="pd-wish" aria-pressed={s.wish.includes(p.id)} aria-label="Save to wishlist" onClick={() => s.toggleWish(p.id)}><Heart /></button></div>
        {tot > 0 && <button type="button" className="apay" onClick={buyNow}>Buy now with Apple Pay</button>}
        <ul className="pd-trust">
          <li><Truck /><div><b>{ship.t}</b><span>{ship.s} · free over {money(s.free)}</span></div></li>
          <li><Return /><div><b>Free 14-day returns</b><span>We collect from your door</span></div></li>
          <li><Lock /><div><b>Secure checkout</b><span>Apple Pay, cards, Tabby and Tamara</span></div></li>
        </ul>
        <div className="acc pd-acc">
          <details open><summary>Description<i /></summary><div className="ab"><p>{st.desc}</p></div></details>
          <details><summary>Details<i /></summary><div className="ab"><ul>{st.points.map((x) => <li key={x}>{x}</li>)}</ul><span className="mono mute">Style {st.code}</span></div></details>
          <details><summary>Size &amp; fit<i /></summary><div className="ab"><p>Available in S, M, L and XL. The full measurement chart is coming soon; our stylists can help you choose on WhatsApp.</p></div></details>
          <details><summary>Fabric &amp; care<i /></summary><div className="ab"><p>Composition and care instructions will be added once confirmed by the supplier.</p></div></details>
          <details><summary>Delivery &amp; returns<i /></summary><div className="ab"><p>Same-day delivery in Dubai on orders before 2 pm. Next-day delivery to every other emirate. Free returns within 14 days, collected from your door.</p></div></details>
        </div>
      </div>
    </section>

    {!partner.hidden && <section className="g ctl2"><div className="w ctl2-in">
      <div className="ctl2-m" data-reveal><img src={img(partner.images[0])} alt={`${STYLES[partner.style].name} in ${partner.color}`} loading="lazy" /><img src={img(p.images[0])} alt="" loading="lazy" className="b" /></div>
      <div className="ctl2-t"><span className="mono mute">Complete the look</span><h2 className="H" data-rise>Wear it <em>together</em></h2>
        <div className="ctl2-l">{[[p, z1, setZ1], [partner, z2, setZ2]].map(([q, z, set]) => { const qq = q as typeof p; return (
          <div className="ctl2-i" key={qq.id}><Link href={`/products/${qq.slug}/`}><img src={img(qq.images[0])} alt="" /></Link><div><b>{STYLES[qq.style].name}</b><span>{qq.color} · {money(qq.price)}</span></div>
            <select aria-label={`Size for ${STYLES[qq.style].name}`} value={z as Size} onChange={(e) => (set as (v: Size) => void)(e.target.value as Size)}>{SIZES.map((x) => <option key={x} value={x} disabled={!qq.stock[x]}>{x}{qq.stock[x] ? (qq.stock[x] === 1 ? " · last one" : "") : " · sold out"}</option>)}</select></div>); })}</div>
        <button type="button" className="btn red block" disabled={!tot || !total(partner.stock)} onClick={() => { const ims = document.querySelectorAll<HTMLElement>(".ctl2-i img"); s.add(p.id, z1, ims[0], { silent: true }); setTimeout(() => s.add(partner.id, z2, ims[1]), 260); setBoth(true); }}>
          {both ? "Both added ✓" : <>Add both · {money(now)} {now !== full && <s>{money(full)}</s>}</>}</button>
        <span className="mute" style={{ fontSize: 12.5 }}>{s.cfg.bundleOn ? `Save ${s.cfg.bundlePct}% when you buy the look together.` : "Made to be worn together."} Free same-day delivery in Dubai included.</span>
      </div></div></section>}

    <section className="g pd-more"><div className="w"><div className="sh-hd"><h2 className="H" data-rise>You may also <em>like</em></h2></div><div className="grid g4">{also.map((q) => <ProductCard key={q.id} product={q} />)}</div></div></section>
    {rec.length > 0 && <section className="g pd-more" style={{ paddingTop: 0 }}><div className="w"><div className="sh-hd"><h2 className="H">Recently <em>viewed</em></h2></div><div className="grid g4">{rec.map((q) => <ProductCard key={q.id} product={q} />)}</div></div></section>}

    <div className={"sticky-buy" + (sticky ? " on" : "")}><img src={img(p.images[0])} alt="" /><span className="sb-t"><b>{st.name}</b><span>{money(p.price)}{size ? ` · Size ${size}` : ""}</span></span><button type="button" className="btn red" onClick={addNow}>{tot ? (size ? `Add to bag · ${size}` : "Add to bag") : "Join the waitlist"}</button></div>

    <div className={"lb" + (lb !== null ? " open" : "")} role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(e) => { if (e.target === e.currentTarget) setLb(null); }}>
      {lb !== null && <img src={img(p.images[lb])} alt={`${st.name} in ${p.color}, image ${lb + 1}`} />}
      <button type="button" className="x" aria-label="Close" onClick={() => setLb(null)}><Close /></button>
      <button type="button" className="nv p" aria-label="Previous" onClick={() => setLb(((lb || 0) - 1 + p.images.length) % p.images.length)}>‹</button>
      <button type="button" className="nv n" aria-label="Next" onClick={() => setLb(((lb || 0) + 1) % p.images.length)}>›</button>
    </div>
    <div className={"modal" + (wait ? " open" : "")} role="dialog" aria-modal="true" aria-label="Join the waitlist" onClick={(e) => { if (e.target === e.currentTarget) setWait(null); }}>
      <div className="mbox sm wl"><button type="button" className="mx" aria-label="Close" onClick={() => setWait(null)} style={{ position: "absolute", top: 14, right: 14 }}><Close /></button>
        <span className="mono mute">Back in stock</span>
        <h3 className="H">{st.name} · {p.color}{wait && wait !== "any" ? ` · ${wait}` : ""}</h3>
        {waitDone ? <p>You're on the list. We'll email you once, as soon as it's back. No other emails.</p> : <>
          <p className="mute">{wait && wait !== "any" ? `Size ${wait} is sold out.` : "This piece is sold out."} Leave your email and we'll tell you when it returns.</p>
          <form className="wl-f" onSubmit={(e) => { e.preventDefault(); joinWait(String(new FormData(e.currentTarget).get("email") || "")); }}>
            <input name="email" type="email" required placeholder="Email address" aria-label="Email address" autoComplete="email" />
            <button className="btn red" type="submit">Notify me</button>
          </form></>}
      </div>
    </div>
    <div className={"modal" + (guide ? " open" : "")} role="dialog" aria-modal="true" aria-label="Size guide" onClick={(e) => { if (e.target === e.currentTarget) setGuide(false); }}>
      <div className="mbox sm"><button type="button" className="mx" aria-label="Close" onClick={() => setGuide(false)} style={{ position: "absolute", top: 14, right: 14 }}><Close /></button>
        <div className="sg"><span className="mono">Fit &amp; size</span><h3 className="H">Size guide</h3>
          <div className="sg-sz">{SIZES.map((z) => <span key={z}>{z}</span>)}</div>
          <div className="sg-how"><div><b>01 · Bust</b><p className="mute">Measure around the fullest part, keeping the tape level.</p></div><div><b>02 · Waist</b><p className="mute">Measure around the narrowest part of your waist.</p></div><div><b>03 · Hips</b><p className="mute">Measure around the fullest part of your hips.</p></div></div>
          <p>Every style comes in S, M, L and XL. The full measurement chart is being finalised with our supplier and will appear here before launch.</p>
          <p className="mute">Between sizes? Our stylists will help you choose on WhatsApp.</p></div></div>
    </div>
  </>);
}

function Slide({ src, alt, first, onOpen }: { src: string; alt: string; first: boolean; onOpen: () => void }) {
  const [zoom, setZoom] = useState(false); const [o, setO] = useState("50% 50%");
  return (
    <div className={"pd-sl" + (zoom ? " zoom" : "")} onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)} onPointerLeave={() => setZoom(false)}
      onPointerMove={(e) => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); setO(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}>
      <img src={src} alt={alt} loading={first ? "eager" : "lazy"} fetchPriority={first ? "high" : "auto"} draggable={false} style={{ transformOrigin: o }} />
    </div>
  );
}
