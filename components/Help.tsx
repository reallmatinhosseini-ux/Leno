"use client";
import { useState } from "react";
import { FAQ } from "@/lib/faq";
import { useStore } from "@/lib/store";

type Res = { no: string; status: string; pay_status: string } | "none" | null;
export default function Help() {
  const s = useStore(); const [no, setNo] = useState(""); const [em, setEm] = useState(""); const [res, setRes] = useState<Res>(null); const [busy, setBusy] = useState(false);
  const track = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { const r = await fetch("/api/track/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ no, email: em }) }); setRes(r.ok ? await r.json() : "none"); } catch { setRes("none"); }
    setBusy(false);
  };
  const steps = ["Confirmed", "Packed", "On the way", "Delivered"];
  const map: Record<string, number> = { new: 0, confirmed: 0, packed: 1, shipped: 2, delivered: 3 };
  const at = res && res !== "none" ? map[res.status] ?? 0 : 0;
  const off = res && res !== "none" && (res.status === "cancelled" || res.status === "returned");
  return (
    <section className="g"><div className="w"><div className="ph"><div className="kick mono">Client care</div><h1 className="H" data-rise>How can we help?</h1></div>
      <div className="hl-grid">
        <div className="hl-card dark" id="track"><span className="mono">Track your order</span><h2 className="H hl-h">Where is my order?</h2>
          <form className="trk" onSubmit={track}><div className="inp"><input id="t-no" placeholder=" " required value={no} onChange={(e) => setNo(e.target.value)} /><label htmlFor="t-no">Order number, e.g. LW-10001</label></div><div className="inp"><input id="t-em" type="email" placeholder=" " required autoComplete="email" value={em} onChange={(e) => setEm(e.target.value)} /><label htmlFor="t-em">Email used at checkout</label></div><button className="btn light" type="submit" disabled={busy}>{busy ? "Checking…" : "Track"}</button></form>
          {res === "none" && <p style={{ marginTop: 16, color: "rgba(242,238,230,.7)" }}>We could not find {no.toUpperCase() || "that order"} with that email. Check the number in your confirmation email.</p>}
          {off && <p style={{ marginTop: 16, color: "rgba(242,238,230,.8)" }}>This order was {(res as { status: string }).status}.</p>}
          {res && res !== "none" && !off && <div className="tl" style={{ marginTop: 22, color: "var(--ivory)" }}>{steps.map((x, i) => <div key={x} className={i <= at ? "on" : ""}><i />{x}</div>)}</div>}
        </div>
        <div className="hl-card" id="delivery"><span className="mono">Delivery</span><div className="dtable"><div><b>Dubai</b><span>Same day, order by 2 pm</span><span>Free over AED {s.free}</span></div><div><b>Abu Dhabi · Sharjah · Ajman</b><span>Next day</span><span>Free</span></div><div><b>Umm Al Quwain · Ras Al Khaimah · Fujairah</b><span>Next day</span><span>Free</span></div></div></div>
        <div className="hl-card" id="returns"><span className="mono">Returns</span><h3 className="H hl-h">14 days, free</h3><p className="mute">Unworn, tags on. We collect from your door. Refunds go back to your original payment method.</p></div>
        <div className="hl-card red" id="contact"><span className="mono">Talk to a stylist</span><h3 className="H hl-h">WhatsApp</h3><p>Real people, 10 am to 10 pm, every day.{process.env.NEXT_PUBLIC_WHATSAPP ? <> <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g, "")}`} target="_blank" rel="noopener">Message us</a></> : " Number coming at launch."}</p></div>
      </div>
      <div className="faq" id="faq"><h2 className="H" data-rise>Questions</h2><div className="acc">{FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}<i /></summary><div className="ab"><p>{a}</p></div></details>)}</div></div>
      <div style={{ paddingBottom: 120 }} />
    </div></section>
  );
}
