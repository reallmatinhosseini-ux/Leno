"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { CATEGORIES, SIZES, Size, total } from "@/lib/data";
import { img } from "@/lib/site";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

export default function ShopView({ kind, title, intro }: { kind: string; title: string; intro: string }) {
  const s = useStore();
  const [size, setSize] = useState<Size | null>(null);
  const [sort, setSort] = useState("cur");
  const grid = useRef<HTMLDivElement>(null); const flip = useRef<Flip.FlipState | null>(null);
  const cat = CATEGORIES.find((c) => c.slug === kind);
  let list = s.catalog.filter((p) => !p.hidden && (!cat || cat.filter(p)) && (!size || p.stock[size] > 0));
  list = sort === "cur" ? [...list].sort((a, b) => +(total(b.stock) > 0) - +(total(a.stock) > 0)) : [...list].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  const change = (fn: () => void) => { if (grid.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) flip.current = Flip.getState(grid.current.querySelectorAll(".card")); fn(); };
  useEffect(() => { if (!flip.current) return; Flip.from(flip.current, { duration: .7, ease: "expo.inOut", absolute: true, scale: true, stagger: .02, onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6 }), onLeave: (els) => gsap.to(els, { opacity: 0, duration: .3 }) }); flip.current = null; }, [size, sort]);
  const chips: [string, string][] = [["/shop/", "All"], ...CATEGORIES.map((c) => [`/shop/${c.slug}/`, c.name] as [string, string])];
  return (
    <section className="g"><div className="w">
      <div className="shop-hd"><div className="kick mono">Court 01</div>
        <h1 className="H" data-rise>{title}<sup>{list.length}</sup></h1>
        <p className="mute" style={{ maxWidth: "52ch" }}>{intro}</p></div>
      <div className="bar">
        <nav aria-label="Categories" style={{ display: "contents" }}>{chips.map(([h, l]) => <Link key={h} href={h} className={"chip" + ((h === "/shop/" && kind === "all") || h === `/shop/${kind}/` ? " on" : "")}>{l}</Link>)}</nav>
        <span className="sp" />
        <div className="sizes-f" role="group" aria-label="Filter by size">{SIZES.map((z) => <button key={z} type="button" aria-pressed={size === z} className={size === z ? "on" : ""} onClick={() => change(() => setSize(size === z ? null : z))}>{z}</button>)}</div>
        <select aria-label="Sort" value={sort} onChange={(e) => change(() => setSort(e.target.value))}><option value="cur">Curated</option><option value="asc">Price: low to high</option><option value="desc">Price: high to low</option></select>
      </div>
      <div className="grid g4" ref={grid}>
        {list.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
        {kind === "all" && !size && <Link className="ed-tile" href="/#looks"><img src={img("set-navy-2")} alt="The Navy Look" loading="lazy" /><span className="mono">Shop the look</span><b className="H">Wear it <em>together</em></b><span className="ed-tile-c">Save {s.cfg.bundlePct}% on a dress and a set →</span></Link>}
      </div>
      {!list.length && <div className="empty"><span className="H">Sold out in {size}</span><button type="button" className="btn" onClick={() => setSize(null)}>Show all sizes</button></div>}
    </div></section>
  );
}
