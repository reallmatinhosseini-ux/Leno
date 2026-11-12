"use client";
import Link from "next/link";
import { byId } from "@/lib/data";
import { asset } from "@/lib/site";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";

export default function Wishlist() {
  const s = useStore(); const list = s.wish.map((id) => byId(id)!).filter(Boolean);
  return (
    <section className="g"><div className="w"><div className="ph"><div className="kick mono">LENO WEAR</div><h1 className="H">Wishlist <sup className="mono red" style={{ fontSize: 14, verticalAlign: "top" }}>{list.length}</sup></h1></div>
      {!s.ready ? <div style={{ minHeight: "40svh" }} /> : list.length ? <div className="grid g4" style={{ paddingBottom: 120 }}>{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        : <div className="empty" style={{ paddingBottom: 140 }}><img src={asset("/p/kiss-tag.png")} alt="" style={{ width: 80 }} /><span className="H">Nothing saved yet</span><p className="mute">Tap the heart on any piece to keep it here.</p><Link className="btn" href="/shop/">Shop all</Link></div>}
    </div></section>
  );
}
