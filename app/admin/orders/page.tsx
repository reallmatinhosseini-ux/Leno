"use client";
import { useEffect, useMemo, useState } from "react";
import { AOrder, NEXT_STEP, STATUS_LABEL, aed, api, payLabel, thumb, when } from "@/components/admin/lib";

const TABS: [string, string, (o: AOrder) => boolean][] = [
  ["todo", "To do", (o) => ["new", "confirmed", "packed"].includes(o.status) && (o.pay_method === "cod" || o.pay_status === "paid")],
  ["shipped", "On the way", (o) => o.status === "shipped"],
  ["delivered", "Delivered", (o) => o.status === "delivered"],
  ["unpaid", "Unpaid card", (o) => o.pay_method === "card" && o.pay_status !== "paid"],
  ["closed", "Cancelled / returned", (o) => ["cancelled", "returned"].includes(o.status)],
  ["all", "All", () => true],
];

export default function Orders() {
  const [os, setOs] = useState<AOrder[] | null>(null); const [err, setErr] = useState("");
  const [tab, setTab] = useState("todo"); const [qs, setQs] = useState(""); const [sel, setSel] = useState<string | null>(null);
  const load = () => api<AOrder[]>("orders/").then(setOs).catch((e) => setErr(e.message));
  useEffect(() => {
    const u = new URLSearchParams(location.search); if (u.get("f")) setTab(u.get("f")!); if (u.get("o")) { setSel(u.get("o")); setTab("all"); }
    load(); const t = setInterval(load, 30000); return () => clearInterval(t);
  }, []);
  const list = useMemo(() => {
    if (!os) return []; const f = TABS.find((t) => t[0] === tab)?.[2] || (() => true); const n = qs.trim().toLowerCase();
    return os.filter(f).filter((o) => !n || [o.no, o.name, o.email, o.phone, o.address.area].join(" ").toLowerCase().includes(n));
  }, [os, tab, qs]);
  const o = os?.find((x) => x.no === sel) || null;

  if (err) return <div className="ad-err big">{err}</div>;
  if (!os) return <div className="ad-load">Loading…</div>;
  return (<>
    <div className="ad-bar">
      <div className="ad-tabs">{TABS.map(([k, l, f]) => <button type="button" key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}<i>{os.filter(f).length}</i></button>)}</div>
      <div className="ad-bar-r"><input className="ad-in" type="search" placeholder="Search name, email, phone, LW-…" value={qs} onChange={(e) => setQs(e.target.value)} /><a className="ad-btn" href="/api/admin/export/?type=orders">Export CSV</a></div>
    </div>
    {list.length ? <div className="ad-table">
      <div className="ad-tr head"><span>Order</span><span>Customer</span><span>Items</span><span>Payment</span><span>Status</span><span>Total</span></div>
      {list.map((x) => <button type="button" key={x.no} className={"ad-tr" + (x.no === sel ? " sel" : "")} onClick={() => setSel(x.no)}>
        <span><b>{x.no}</b><small>{when(x.created_at)}</small></span>
        <span>{x.name}<small>{x.address.emirate}{x.speed === "same" ? " · same day" : ""}</small></span>
        <span>{x.items.reduce((a, l) => a + l.qty, 0)} pcs</span>
        <span className={x.pay_status === "paid" || x.pay_method === "cod" ? "" : "warn"}>{payLabel(x)}</span>
        <span><i className={"ad-pill s-" + x.status}>{STATUS_LABEL[x.status]}</i></span>
        <span><b>{aed(x.total)}</b></span>
      </button>)}
    </div> : <p className="ad-empty card">No orders here.</p>}
    {o && <Detail o={o} close={() => setSel(null)} saved={(n) => setOs(os.map((x) => (x.no === n.no ? n : x)))} />}
  </>);
}

function Detail({ o, close, saved }: { o: AOrder; close: () => void; saved: (o: AOrder) => void }) {
  const [busy, setBusy] = useState(false); const [note, setNote] = useState(o.admin_note); const [err, setErr] = useState("");
  useEffect(() => setNote(o.admin_note), [o.no, o.admin_note]);
  const patch = async (b: Record<string, unknown>, confirmMsg?: string) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    setBusy(true); setErr("");
    try { saved(await api<AOrder>(`orders/${o.no}/`, { method: "PATCH", json: b })); } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  };
  const step = NEXT_STEP[o.status]; const canStep = step && (o.pay_method === "cod" || o.pay_status === "paid");
  const wa = o.phone.replace(/\D/g, "").replace(/^0/, "971");
  const a = o.address;
  return (
    <div className="ad-drawer" role="dialog" aria-label={"Order " + o.no}>
      <div className="ad-scrim" onClick={close} />
      <div className="ad-panel">
        <header><div><h2>{o.no}</h2><small>{when(o.created_at)}</small></div><button type="button" className="ad-x" onClick={close} aria-label="Close">×</button></header>
        <div className="ad-status"><i className={"ad-pill s-" + o.status}>{STATUS_LABEL[o.status]}</i><span>{payLabel(o)}</span></div>
        {err && <div className="ad-err">{err}</div>}
        <div className="ad-actions">
          {canStep && <button type="button" className="ad-btn dark" disabled={busy} onClick={() => patch({ status: step[0] })}>{step[1]}</button>}
          {o.pay_method === "cod" && o.pay_status !== "paid" && o.status === "delivered" && <button type="button" className="ad-btn dark" disabled={busy} onClick={() => patch({ paid: true })}>Cash collected</button>}
          <button type="button" className="ad-btn" onClick={() => print()}>Print slip</button>
          {!["cancelled", "returned", "delivered"].includes(o.status) && <button type="button" className="ad-btn danger" disabled={busy} onClick={() => patch({ status: "cancelled" }, `Cancel ${o.no}? The pieces go back into stock.${o.pay_status === "paid" ? " Refund the card payment in your payment gateway." : ""}`)}>Cancel order</button>}
          {o.status === "delivered" && <button type="button" className="ad-btn" disabled={busy} onClick={() => patch({ status: "returned" }, `Mark ${o.no} as returned? The pieces go back into stock.`)}>Mark returned</button>}
        </div>
        <section className="ad-sec"><h3>Customer</h3>
          <p><b>{o.name}</b><br /><a href={`mailto:${o.email}`}>{o.email}</a><br /><a href={`tel:${o.phone}`}>{o.phone}</a> · <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener">WhatsApp</a></p>
          <p>{a.building}<br />{a.area}, {a.emirate}{a.landmark ? <><br />Near {a.landmark}</> : null}</p>
          <p>{o.speed === "same" ? "Same-day delivery (Dubai)" : "Next-day delivery"}</p>
          {o.gift && <p className="ad-gift">Gift wrap{o.note ? `: “${o.note}”` : ""}</p>}
        </section>
        <section className="ad-sec"><h3>Items</h3>
          {o.items.map((l) => <div className="ad-item" key={l.id + l.size}><img src={thumb({ id: l.id })} alt="" /><span>{l.name}<small>{l.color} · Size {l.size} · × {l.qty}</small></span><b>{aed(l.price * l.qty)}</b></div>)}
          <div className="ad-sum"><span>Subtotal</span><span>{aed(o.subtotal)}</span>{o.discount > 0 && <><span>{o.discount_label}</span><span>−{aed(o.discount)}</span></>}<span>Delivery</span><span>{o.delivery ? aed(o.delivery) : "Free"}</span><b>Total</b><b>{aed(o.total)}</b></div>
          {o.pay_ref && <small className="ad-mute">Payment ref: {o.pay_ref}</small>}
        </section>
        <section className="ad-sec"><h3>Private note</h3>
          <textarea className="ad-in" rows={3} placeholder="Only you see this" value={note} onChange={(e) => setNote(e.target.value)} />
          {note !== o.admin_note && <button type="button" className="ad-btn" disabled={busy} onClick={() => patch({ admin_note: note })}>Save note</button>}
        </section>
      </div>
      <div className="ad-slip">
        <img src="/p/kiss-tag.png" alt="" /><h1>LENO WEAR</h1><p>Order {o.no} · {when(o.created_at)}</p>
        <p><b>{o.name}</b> · {o.phone}<br />{a.building}, {a.area}, {a.emirate}{a.landmark ? ` (near ${a.landmark})` : ""}</p>
        <table><tbody>{o.items.map((l) => <tr key={l.id + l.size}><td>{l.name} · {l.color}</td><td>{l.size}</td><td>× {l.qty}</td></tr>)}</tbody></table>
        <p>{o.pay_method === "cod" ? `COLLECT CASH: ${aed(o.total)}` : "PAID BY CARD"}{o.gift ? " · GIFT WRAP" : ""}</p>
        {o.gift && o.note && <p>Note: “{o.note}”</p>}
        <p className="ad-slip-f">Leave your mark.</p>
      </div>
    </div>
  );
}
