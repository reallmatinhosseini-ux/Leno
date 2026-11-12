"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { byId } from "@/lib/data";
import { asset, img, money } from "@/lib/site";
import { useStore } from "@/lib/store";

export default function Order() {
  const s = useStore(); const o = s.lastOrder; const rain = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!o || !rain.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".conf .in > *", { y: 30, opacity: 0, stagger: .07, duration: 1, ease: "expo.out", delay: .2 });
    for (let i = 0; i < 24; i++) {
      const k = document.createElement("img"); k.src = asset("/p/kiss-tag.png"); k.alt = ""; rain.current.appendChild(k);
      gsap.set(k, { left: Math.random() * 100 + "%", rotation: Math.random() * 60 - 30, scale: .5 + Math.random() * .8 });
      gsap.to(k, { y: innerHeight + 200, rotation: "+=" + (Math.random() * 180 - 90), duration: 2.4 + Math.random() * 2.2, ease: "power1.in", delay: .2 + Math.random() * 1.2, opacity: 0, onComplete: () => k.remove() });
    }
  }, [o]);
  if (!s.ready) return <section className="g"><div className="w" style={{ minHeight: "70svh" }} /></section>;
  if (!o) return <section className="g"><div className="w empty" style={{ minHeight: "70svh", alignContent: "center" }}><img src={asset("/p/kiss-tag.png")} alt="" style={{ width: 80 }} /><span className="H">No recent order</span><Link className="btn" href="/shop/">Keep shopping</Link></div></section>;
  return (
    <section className="conf g"><div className="kissrain" ref={rain} /><div className="in">
      <svg className="ck" viewBox="0 0 86 86" aria-hidden="true"><circle cx="43" cy="43" r="41" /><path d="M27 44l11 11 22-24" /></svg>
      <span className="mono">Order {o.no}</span><h1 className="H">Thank you{o.name && o.name !== "Guest" ? ", " + o.name : ""}</h1>
      <p className="mute" style={{ fontSize: 17, maxWidth: "44ch" }}>Your order is confirmed. We have sent the details by email and WhatsApp.</p>
      <div className="tl"><div className="on"><i />Confirmed</div><div><i />Packed</div><div><i />On the way</div><div><i />Delivered</div></div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>{o.items.map((l) => { const p = byId(l.id); return p ? <img key={l.id + l.size} src={img(p.images[0])} alt="" style={{ width: 74, aspectRatio: "3/4", objectFit: "cover", borderRadius: 3 }} /> : null; })}</div>
      <b style={{ fontSize: 18 }}>Total · {money(o.total)}</b><span className="mute" style={{ fontSize: 12 }}>Demo checkout: no payment is taken and no order is sent.</span>
      <Link className="btn" href="/shop/">Keep shopping</Link></div></section>
  );
}
