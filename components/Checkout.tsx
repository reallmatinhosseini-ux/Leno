"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { STYLES, byId } from "@/lib/data";
import { asset, img, money } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Lock, Return, Truck } from "./icons";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
const REQ = ["email", "name", "area", "building"] as const;

function Field({ id, label, v, set, err, type = "text", full, auto }: { id: string; label: string; v: string; set: (x: string) => void; err?: boolean; type?: string; full?: boolean; auto?: string }) {
  return <div className={"inp" + (full ? " full" : "") + (err ? " err" : "")}><input id={id} type={type} placeholder=" " autoComplete={auto} value={v} onChange={(e) => set(e.target.value)} /><label htmlFor={id}>{label}</label></div>;
}

export default function Checkout() {
  const s = useStore(); const router = useRouter(); const root = useRef<HTMLElement>(null);
  const [f, setF] = useState({ email: "", name: "", emirate: "Dubai", area: "", building: "", landmark: "", note: "" });
  const [speed, setSpeed] = useState<"same" | "next">("same");
  const [pay, setPay] = useState("card");
  const [gift, setGift] = useState(false);
  const [errs, setErrs] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [sum, setSum] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => { setF({ ...f, [k]: v }); setErrs(errs.filter((e) => e !== k)); };
  const sub = s.subtotal - s.disc;
  const same = f.emirate === "Dubai" && speed === "same";
  const fee = same && sub < s.free ? 25 : 0;
  useEffect(() => { if (f.emirate !== "Dubai") setSpeed("next"); }, [f.emirate]);
  useEffect(() => { if (!s.ready || !root.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return; gsap.from(".co-l > *", { y: 40, opacity: 0, stagger: .06, duration: 1, ease: "expo.out", clearProps: "transform,opacity" }); }, [s.ready]);

  if (!s.ready) return <section className="g"><div className="w" style={{ minHeight: "70svh" }} /></section>;
  if (!s.bag.length) return <section className="g"><div className="w empty" style={{ minHeight: "70svh", alignContent: "center" }}><img src={asset("/p/kiss-tag.png")} alt="" style={{ width: 80 }} /><span className="H">Your bag is empty</span><Link className="btn" href="/shop/">Shop all</Link></div></section>;

  const place = (method?: string) => {
    const bad = REQ.filter((k) => !f[k].trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(f.email)));
    if (bad.length) { setErrs(bad); s.toast("Please fill in the highlighted fields"); document.getElementById("c-" + bad[0])?.focus(); return; }
    s.placeOrder({ name: f.name.trim().split(" ")[0], method: method || pay, delivery: fee });
    router.push("/order/");
  };
  const apply = () => { if (code.trim().toUpperCase() === "LENO10") { s.claim(); s.toast(`LENO10 applied: ${s.cfg.welcomePct}% off`); } else s.toast("That code is not valid"); };

  return (
    <section className="co" ref={root}>
      <div className="co-l"><h1 className="H">Checkout</h1>
        <ol className="co-steps"><li className="done"><button type="button" onClick={() => s.open("bag")}>Bag</button></li><li className="on">Details</li><li>Payment</li><li>Done</li></ol>
        <div className="demo-note">Demo checkout: no payment is taken and no order is sent.</div>
        <div className="step"><span className="mono mute">Express checkout</span><div className="xp"><button type="button" className="ap" onClick={() => place("apple")}>Apple Pay</button><button type="button" className="tb" onClick={() => place("tabby")}>tabby</button><button type="button" className="tm" onClick={() => place("tamara")}>tamara</button></div><div className="or">or pay another way</div></div>
        <div className="step"><h3><span>01</span>Contact</h3><Field id="c-email" label="Email" type="email" auto="email" v={f.email} set={set("email")} err={errs.includes("email")} /></div>
        <div className="step"><h3><span>02</span>Delivery</h3><div className="fg">
          <Field id="c-name" label="Full name" auto="name" full v={f.name} set={set("name")} err={errs.includes("name")} />
          <div className="inp"><select id="c-emi" value={f.emirate} onChange={(e) => set("emirate")(e.target.value)}>{EMIRATES.map((e) => <option key={e}>{e}</option>)}</select><label htmlFor="c-emi">Emirate</label></div>
          <Field id="c-area" label="Area" auto="address-level2" v={f.area} set={set("area")} err={errs.includes("area")} />
          <Field id="c-building" label="Building, villa, apartment" auto="street-address" full v={f.building} set={set("building")} err={errs.includes("building")} />
          <Field id="c-landmark" label="Landmark (optional)" full v={f.landmark} set={set("landmark")} />
        </div>
          <div className="opt">
            <label style={{ opacity: f.emirate === "Dubai" ? 1 : .45 }}><input type="radio" name="spd" checked={speed === "same"} disabled={f.emirate !== "Dubai"} onChange={() => setSpeed("same")} /><span>Same day · Dubai<small>Order before 2 pm</small></span><b>{sub >= s.free ? "Free" : money(25)}</b></label>
            <label><input type="radio" name="spd" checked={speed === "next"} onChange={() => setSpeed("next")} /><span>Next day<small>All emirates</small></span><b>Free</b></label>
          </div></div>
        <div className="step"><h3><span>03</span>Payment</h3><div className="opt">
          {[["card", "Card", "Visa · Mastercard · Amex"], ["tabby", "tabby", "4 interest-free payments"], ["tamara", "tamara", "Split in 4"], ["cod", "Cash on delivery", "Confirmed by SMS"]].map(([v, l, d]) =>
            <label key={v}><input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} /><span>{v === "tabby" ? <span className="tabby">tabby</span> : l}<small>{d}</small></span><span /></label>)}
        </div></div>
        <label className="gift"><input type="checkbox" checked={gift} onChange={(e) => { setGift(e.target.checked); if (e.target.checked) s.toast("Gift wrap added, free"); }} /><span><b>Free gift wrap</b> in our kiss-print tissue, with a handwritten note</span></label>
        {gift && <Field id="c-note" label="Your note (optional)" v={f.note} set={set("note")} />}
        <button type="button" className="btn red block" style={{ height: 60 }} onClick={() => place()}>Place order · {money(sub + fee)}</button>
        <ul className="co-trust"><li><Lock />Encrypted, secure payment</li><li><Return />Free 14-day returns</li><li><Truck />Same-day delivery in Dubai</li></ul>
      </div>
      <aside className={"co-r" + (sum ? " open" : "")}>
        <button type="button" className="sum-toggle" onClick={() => setSum(!sum)}><span>{sum ? "Hide" : "Show"} order summary</span><b>{money(sub + fee)}</b></button>
        <div className="in"><span className="mono">Order summary</span>
          {s.bag.map((l) => { const p = s.live(l.id) || byId(l.id)!; return <div className="sum-ln" key={l.id + l.size}><div className="th"><img src={img(p.images[0])} alt="" /><b>{l.qty}</b></div><span>{STYLES[p.style].name}<br /><span className="mute">{p.color} · {l.size}</span></span><span>{money((s.live(l.id)?.price || 0) * l.qty)}</span></div>; })}
          <div className="sum-row"><span>Subtotal</span><span>{money(s.subtotal)}</span></div>
          {s.disc ? <div className="sum-row promo"><span>{s.discLabel}</span><span>−{money(s.disc)}</span></div>
            : s.cfg.welcomeOn && <div className="promo-f"><input type="text" placeholder="Discount code" aria-label="Discount code" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} /><button type="button" onClick={apply}>Apply</button></div>}
          <div className="sum-row"><span>Delivery</span><span>{fee ? money(fee) : "Free"}</span></div>
          <div className="sum-row big"><span>Total</span><span>{money(sub + fee)}</span></div><span className="mute" style={{ fontSize: 12 }}>Including 5% VAT</span></div>
      </aside>
    </section>
  );
}
