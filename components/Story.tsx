"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { byId } from "@/lib/data";
import { asset, img } from "@/lib/site";
import { splitChars } from "./Motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
const CH = [
  { time: "07:00", t: "Studio", sub: "Morning hours", p: "The Studio Set zips up for the warm-up and stays on for the coffee after.", im: "set-white-3", id: "set-white", bg: "#F2EEE6", fg: "#0D0D10" },
  { time: "13:00", t: "Court", sub: "Midday hours", p: "The Pleat Dress swings through every rally. The Knot Dress ties at the hip and moves with you.", im: "pleat-blue-2", id: "pleat-blue", bg: "#E3E3E0", fg: "#0D0D10" },
  { time: "19:00", t: "City", sub: "Evening hours", p: "The Tulle Dress floats from the last game into the evening.", im: "tulle-ivory-1", id: "tulle-ivory", bg: "#0B0E1E", fg: "#F2EEE6" },
];

export default function Story() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(splitChars(document.querySelector("#sth")!), { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: .018 });
      gsap.from(".st-kiss", { scale: 0, rotation: -60, duration: 1.4, ease: "elastic.out(1,.5)", delay: .4 });
      gsap.to(".st-kiss", { rotation: 25, scale: 1.3, ease: "none", scrollTrigger: { trigger: ".st-hero", start: "top top", end: "bottom top", scrub: true } });
      if (innerWidth > 900) {
        const track = document.querySelector<HTMLElement>(".hday-track")!, panels = gsap.utils.toArray<HTMLElement>(".hd");
        const tw = gsap.to(track, { xPercent: (-100 * (panels.length - 1)) / panels.length, ease: "none", scrollTrigger: { trigger: ".hday", pin: true, scrub: 1, end: () => "+=" + innerWidth * (panels.length - 1), invalidateOnRefresh: true } });
        panels.forEach((pn) => {
          const st = { trigger: pn, containerAnimation: tw, start: "left right", end: "right left", scrub: true };
          gsap.fromTo(pn.querySelector(".hd-m"), { rotateY: -30, z: -200, transformPerspective: 1600 }, { rotateY: 20, z: 0, ease: "none", scrollTrigger: st });
          gsap.fromTo(pn.querySelector(".hd-m img"), { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: st });
          gsap.fromTo(pn.querySelector(".hd-time"), { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: st });
        });
      }
      const words: HTMLElement[] = [];
      const wrap = (node: Node) => Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) { const fr = document.createDocumentFragment(); (n.textContent || "").split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) { fr.appendChild(document.createTextNode(w)); return; } const sp = document.createElement("span"); sp.className = "w"; sp.textContent = w; fr.appendChild(sp); words.push(sp); }); n.parentNode!.replaceChild(fr, n); }
        else if (n.nodeType === 1) wrap(n);
      });
      wrap(document.querySelector("#stw")!);
      gsap.to(words, { color: (_i: number, el: HTMLElement) => (el.closest("em") ? "#D3203A" : "#0D0D10"), stagger: .1, ease: "none", scrollTrigger: { trigger: "#stw", start: "top 80%", end: "bottom 45%", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root}>
      <section className="st-hero g"><div className="w"><div className="kick mono">Our story</div><h1 className="H" id="sth">Made for the hours <em>around the game.</em></h1>
        <div className="st-row"><p className="mute">LENO WEAR is court-wear from Dubai. Four styles in small runs, built for padel, tennis and the studio, and cut to be worn long after.</p><img src={asset("/p/kiss-tag.png")} alt="" className="st-kiss" /></div></div></section>
      <section className="hday"><div className="hday-track">{CH.map((c, i) => (
        <article className="hd" key={c.t} style={{ ["--bg" as string]: c.bg, ["--fg" as string]: c.fg }}><div className="hd-in"><div className="hd-t"><span className="hd-time">{c.time}</span><span className="mono">{c.sub} · 0{i + 1} / 03</span><h2 className="H">{c.t}</h2><p>{c.p}</p><Link className={"btn" + (i === 2 ? " light" : "")} href={`/products/${byId(c.id)!.slug}/`}>Shop the look</Link></div>
          <Link className="hd-m" href={`/products/${byId(c.id)!.slug}/`}><img src={img(c.im)} alt={`${c.t}: ${c.p}`} loading="lazy" /></Link></div></article>))}</div></section>
      <section className="g"><div className="w st-words"><p className="big" id="stw">Small runs. When a size is gone, it is gone. Every piece is chosen to move on court and to look right off it. <em>The court is the runway.</em></p></div></section>
      <section className="g"><div className="w st-pr">
        <div data-fade><b>01</b><h3>Small runs</h3><p>Each colourway is made in a few pieces per size, so what you wear stays rare.</p></div>
        <div data-fade><b>02</b><h3>Made to move</h3><p>Inner shorts, open backs, stretch and pleats: every detail is there for the game.</p></div>
        <div data-fade><b>03</b><h3>Dubai first</h3><p>Same-day delivery in Dubai, WhatsApp styling and free returns across the UAE.</p></div>
      </div></section>
      <section className="g st-end"><div className="w"><h2 className="H" data-rise>Start with Court 01</h2><div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}><Link className="btn" href="/shop/">Shop all</Link><Link className="btn line" href="/products/pleat-dress-white/">The Pleat Dress</Link></div></div></section>
    </div>
  );
}
