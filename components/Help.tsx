"use client";
import { useState } from "react";
import { FAQ } from "@/lib/faq";
import { useStore, Order } from "@/lib/store";

export default function Help() {
  const s = useStore(); const [no, setNo] = useState(""); const [res, setRes] = useState<Order | null | "none">(null);
  const track = (e: React.FormEvent) => {
    e.preventDefault(); const n = no.trim().toUpperCase();
    let all: Order[] = []; try { all = JSON.parse(localStorage.getItem("leno-orders") || "[]"); } catch { /* ignore */ }
    setRes(all.find((o) => o.no === n) || (s.lastOrder?.no === n ? s.lastOrder : null) || "none");
  };
  const steps = ["Confirmed", "Packed", "On the way", "Delivered"];
  const at = res && res !== "none" ? Math.max(0, steps.findIndex((x) => x.toLowerCase() === (res.status || "").toLowerCase().replace("shipped", "on the way"))) : 0;
  return (
    <section className="g"><div className="w"><div className="ph"><div className="kick mono">Client care</div><h1 className="H" data-rise>How can we help?</h1></div>
      <div className="hl-grid">
        <div className="hl-card dark"><span className="mono">Track your order</span><h2 className="H" style={{ fontSize: "inherit" }}>Where is my order?</h2>
          <form className="trk" onSubmit={track}><div className="inp"><input id="t-no" placeholder=" " required value={no} onChange={(e) => setNo(e.target.value)} /><label htmlFor="t-no">Order number, e.g. LW-12345</label></div><button className="btn light" type="submit">Track</button></form>
          {res === "none" && <p style={{ marginTop: 16, color: "rgba(242,238,230,.7)" }}>We could not find {no.toUpperCase() || "that order"}. Check the number in your confirmation message. (Demo: only orders placed in this browser can be tracked.)</p>}
          {res && res !== "none" && <div className="tl" style={{ marginTop: 22, color: "var(--ivory)" }}>{steps.map((x, i) => <div key={x} className={i <= at ? "on" : ""}><i />{x}</div>)}</div>}
        </div>
        <div className="hl-card"><span className="mono">Delivery</span><div className="dtable"><div><b>Dubai</b><span>Same day, order by 2 pm</span><span>Free over AED {s.free}</span></div><div><b>Abu Dhabi · Sharjah · Ajman</b><span>Next day</span><span>Free</span></div><div><b>Umm Al Quwain · Ras Al Khaimah · Fujairah</b><span>Next day</span><span>Free</span></div></div></div>
        <div className="hl-card"><span className="mono">Returns</span><h3 className="H" style={{ fontSize: 46 }}>14 days, free</h3><p className="mute">Unworn, tags on. We collect from your door. Refunds go back to your original payment method.</p></div>
        <div className="hl-card red"><span className="mono">Talk to a stylist</span><h3 className="H" style={{ fontSize: 46 }}>WhatsApp</h3><p>Real people, 10 am to 10 pm, every day. Number coming at launch.</p></div>
      </div>
      <div className="faq"><h2 className="H" data-rise>Questions</h2><div className="acc">{FAQ.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}<i /></summary><div className="ab"><p>{a}</p></div></details>)}</div></div>
      <p className="mute" style={{ fontSize: 12, paddingBottom: 120 }}>Delivery fees and return terms shown here are proposals for the demo store and will be confirmed before launch.</p>
    </div></section>
  );
}
