"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { SIZES, STYLES, siblings, total, Product } from "@/lib/data";
import { img, money } from "@/lib/site";
import { stockLine, useStore } from "@/lib/store";
import { Heart } from "./icons";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const s = useStore();
  const p = s.live(product.id) || { ...product, price: STYLES[product.style].price, badge: "", hidden: false };
  const [preview, setPreview] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  if (p.hidden) return null;
  const st = STYLES[p.style], t = total(p.stock), line = stockLine(p);
  const badge = p.badge || (t === 0 ? "Sold out" : t === 1 ? "Last one" : t <= 3 ? "Few left" : "");
  const badgeCls = p.badge ? (p.badge === "Best seller" ? "badge adm red" : "badge adm") : t === 1 ? "badge red" : "badge";
  const href = `/products/${p.slug}/`;
  return (
    <article className="card" data-id={p.id}>
      <div className="cm">
        <Link href={href} aria-label={`${st.name} in ${p.color}`} className="cm-link" data-cursor="View">
          <img ref={imgRef} className="a" src={img(preview || p.images[0])} alt={`${st.name} in ${p.color}`} loading={priority ? "eager" : "lazy"} decoding="async" />
          <img className="b" src={img(p.images[1])} alt="" loading="lazy" decoding="async" />
        </Link>
        {badge && <span className={badgeCls}>{badge}</span>}
        <button type="button" className="wish" aria-pressed={s.wish.includes(p.id)} aria-label="Save to wishlist" onClick={() => s.toggleWish(p.id)}><Heart /></button>
        <button type="button" className="qvb" onClick={() => s.quick(p.id)}>Quick view</button>
        <div className="quick">
          <span className="mono mute" style={{ fontSize: 9.5 }}>Quick add</span>
          <div className="r">{SIZES.map((z) => (
            <button key={z} type="button" disabled={!p.stock[z]} aria-label={`Add size ${z}`} onClick={() => s.add(p.id, z, imgRef.current)}>{z}</button>
          ))}</div>
        </div>
      </div>
      <div className="ci">
        <Link className="nm" href={href}>{st.name}<small>{p.color}</small></Link>
        <span className="pr">{money(p.price)}</span>
      </div>
      <span className={"cmeta " + line.cls}>{line.text}</span>
      <div className="sws" onMouseLeave={() => setPreview(null)}>
        {siblings(p).map((q) => (
          <Link key={q.id} href={`/products/${q.slug}/`} className={q.id === p.id ? "on" : ""} style={{ background: q.hex }} aria-label={q.color} onMouseEnter={() => setPreview(q.images[0])} />
        ))}
      </div>
    </article>
  );
}
