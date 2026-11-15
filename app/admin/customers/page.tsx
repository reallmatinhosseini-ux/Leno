"use client";
import { useEffect, useMemo, useState } from "react";
import { AOrder, aed, api, isSale, pname, when } from "@/components/admin/lib";

type W = { id: number; created_at: string; email: string; product: string; size: string };
type S = { email: string; created_at: string; source: string };

export default function Customers() {
  const [os, setOs] = useState<AOrder[] | null>(null); const [p, setP] = useState<{ waitlist: W[]; subscribers: S[] } | null>(null); const [err, setErr] = useState(""); const [tab, setTab] = useState("buyers");
  useEffect(() => { Promise.all([api<AOrder[]>("orders/"), api<{ waitlist: W[]; subscribers: S[] }>("people/")]).then(([o, x]) => { setOs(o); setP(x); }).catch((e) => setErr(e.message)); }, []);
  const buyers = useMemo(() => {
    const m = new Map<string, { email: string; name: string; phone: string; n: number; spent: number; last: string }>();
    (os || []).filter(isSale).forEach((o) => { const b = m.get(o.email) || { email: o.email, name: o.name, phone: o.phone, n: 0, spent: 0, last: o.created_at }; b.n++; b.spent += o.total; if (o.created_at > b.last) b.last = o.created_at; m.set(o.email, b); });
    return [...m.values()].sort((a, b) => b.spent - a.spent);
  }, [os]);
  if (err) return <div className="ad-err big">{err}</div>;
  if (!os || !p) return <div className="ad-load">Loading…</div>;
  return (<>
    <div className="ad-bar"><div className="ad-tabs">
      <button type="button" className={tab === "buyers" ? "on" : ""} onClick={() => setTab("buyers")}>Buyers<i>{buyers.length}</i></button>
      <button type="button" className={tab === "subs" ? "on" : ""} onClick={() => setTab("subs")}>Welcome sign-ups<i>{p.subscribers.length}</i></button>
      <button type="button" className={tab === "wait" ? "on" : ""} onClick={() => setTab("wait")}>Waitlist<i>{p.waitlist.length}</i></button>
    </div>{tab !== "buyers" && <div className="ad-bar-r"><a className="ad-btn" href={`/api/admin/export/?type=${tab === "wait" ? "waitlist" : "subscribers"}`}>Export CSV</a></div>}</div>
    {tab === "buyers" && (buyers.length ? <div className="ad-table c4"><div className="ad-tr head"><span>Customer</span><span>Orders</span><span>Spent</span><span>Last order</span></div>{buyers.map((b) => <div className="ad-tr" key={b.email}><span><b>{b.name}</b><small>{b.email} · {b.phone}</small></span><span>{b.n}</span><span>{aed(b.spent)}</span><span>{when(b.last)}</span></div>)}</div> : <p className="ad-empty card">No buyers yet.</p>)}
    {tab === "subs" && (p.subscribers.length ? <div className="ad-table c3"><div className="ad-tr head"><span>Email</span><span>From</span><span>Date</span></div>{p.subscribers.map((s) => <div className="ad-tr" key={s.email}><span>{s.email}</span><span>{s.source}</span><span>{when(s.created_at)}</span></div>)}</div> : <p className="ad-empty card">No sign-ups yet. They come from the 10% welcome envelope.</p>)}
    {tab === "wait" && (p.waitlist.length ? <div className="ad-table c3"><div className="ad-tr head"><span>Email</span><span>Waiting for</span><span>Date</span></div>{p.waitlist.map((w) => <div className="ad-tr" key={w.id}><span>{w.email}</span><span>{pname(w.product)} · {w.size}</span><span>{when(w.created_at)}</span></div>)}</div> : <p className="ad-empty card">Nobody is waiting. Sold-out sizes collect emails here.</p>)}
  </>);
}
