"use client";
/* Order confirmation: the order letter slides into a LENO WEAR envelope, the flap
   closes and the kiss seals it, the reverse of the welcome gift. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { byId } from "@/lib/data";
import { asset, img, money } from "@/lib/site";
import { useStore } from "@/lib/store";
import { kissBurst } from "@/lib/fx";

export default function Order() {
  const s = useStore(); const o = s.lastOrder; const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!o || !root.current) return;
    const q = gsap.utils.selector(root.current);
    const env = q(".we-env")[0] as HTMLElement, card = q(".we-card")[0] as HTMLElement;
    const H = env.offsetHeight, inY = card.offsetHeight - H * .17;
    gsap.set(q(".we-flap"), { transformPerspective: 900, rotateX: 180, zIndex: 1 });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(card, { y: inY }); gsap.set(q(".we-flap"), { rotateX: 0, zIndex: 4 }); gsap.set(q(".we-seal"), { opacity: 1 }); return;
    }
    gsap.set(q(".we-seal"), { opacity: 0 }); gsap.set(q(".conf-after > *"), { opacity: 0, y: 18 });
    const t = gsap.timeline({ defaults: { ease: "expo.out" }, delay: .35 });
    t.fromTo(q(".seal"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .9 })
      /* letter is read for a beat, then slides into the envelope */
      .to(card, { y: inY, duration: 1, ease: "power3.inOut" }, 1.3)
      /* flap closes over it */
      .to(q(".we-flap"), { rotateX: 0, duration: .75, ease: "power3.inOut" }, 2.05)
      .set(q(".we-flap"), { zIndex: 4 }, 2.4)
      /* the kiss seals it */
      .fromTo(q(".we-seal"), { opacity: 0, scale: 2.8, rotate: -30, filter: "blur(6px)" }, { opacity: 1, scale: 1, rotate: -6, filter: "blur(0px)", duration: .45, ease: "power4.in" }, 2.75)
      .to(q(".we-seal"), { scaleX: 1.16, scaleY: .84, duration: .07 }, 3.2)
      .to(q(".we-seal"), { scaleX: 1, scaleY: 1, duration: .6, ease: "elastic.out(1,.35)" }, 3.27)
      .to(env, { y: 8, duration: .12, ease: "power2.out" }, 3.2).to(env, { y: 0, duration: .9, ease: "elastic.out(1,.4)" }, 3.32)
      .add(() => { const sl = q(".we-seal")[0]; if (sl) kissBurst(sl, 10, 1.2); }, 3.25)
      /* sealed envelope floats gently, details arrive */
      .to(q(".conf-after > *"), { opacity: 1, y: 0, stagger: .07, duration: .8 }, 3.4)
      .to(q(".seal"), { y: -8, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 }, 4.2);
    return () => { t.kill(); };
  }, [o]);

  if (!s.ready) return <section className="g"><div className="w" style={{ minHeight: "70svh" }} /></section>;
  if (!o) return <section className="g"><div className="w empty" style={{ minHeight: "70svh", alignContent: "center" }}><img src={asset("/p/kiss-tag.png")} alt="" style={{ width: 80 }} /><span className="H">No recent order</span><Link className="btn" href="/shop/">Keep shopping</Link></div></section>;
  return (
    <section className="conf g" ref={root}><div className="in">
      <div className="seal" aria-hidden="true">
        <div className="we-env">
          <div className="we-back" />
          <div className="we-flap"><i className="we-flap-out" /><i className="we-flap-in" /></div>
          <div className="we-slot"><div className="we-card"><div className="we-in">
            <span className="we-k">Order {o.no}</span>
            <b className="seal-t">Thank you{o.name && o.name !== "Guest" ? ", " + o.name : ""}</b>
            <span className="seal-s">{o.items.reduce((a, l) => a + l.qty, 0)} {o.items.length === 1 && o.items[0].qty === 1 ? "piece" : "pieces"} · {money(o.total)}</span>
          </div></div></div>
          <div className="we-front"><span className="we-brand">LENO WEAR<small>Sealed with a kiss</small></span></div>
          <span className="we-seal"><img src={asset("/p/kiss-tag.png")} alt="" /></span>
        </div>
      </div>
      <div className="conf-after">
        <span className="mono">Order {o.no}</span>
        <h1 className="H">Sealed with a kiss{o.name && o.name !== "Guest" ? ", " + o.name : ""}</h1>
        <p className="mute" style={{ fontSize: 16, maxWidth: "44ch", margin: 0 }}>Your order is confirmed. We have sent the details by email and WhatsApp.</p>
        <div className="tl"><div className="on"><i />Confirmed</div><div><i />Packed</div><div><i />On the way</div><div><i />Delivered</div></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>{o.items.map((l) => { const p = byId(l.id); return p ? <img key={l.id + l.size} src={img(p.images[0])} alt="" style={{ width: 64, aspectRatio: "3/4", objectFit: "cover", borderRadius: 6 }} /> : null; })}</div>
        <b style={{ fontSize: 17 }}>Total · {money(o.total)}</b>
        <span className="mute" style={{ fontSize: 12 }}>Demo checkout: no payment is taken and no order is sent.</span>
        <Link className="btn red" href="/shop/">Keep shopping</Link>
      </div>
    </div></section>
  );
}
