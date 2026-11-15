"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AOrder, AProduct, ASettings, PRODUCTS, SIZES, STATUS_LABEL, aed, api, day, isSale, payLabel, pname, thumb, when } from "@/components/admin/lib";

export default function Overview() {
  const [os, setOs] = useState<AOrder[] | null>(null); const [ps, setPs] = useState<AProduct[]>([]); const [st, setSt] = useState<ASettings | null>(null); const [err, setErr] = useState("");
  useEffect(() => { Promise.all([api<AOrder[]>("orders/"), api<AProduct[]>("products/"), api<ASettings>("settings/")]).then(([o, p, s]) => { setOs(o); setPs(p); setSt(s); }).catch((e) => setErr(e.message)); }, []);
  if (err) return <div className="ad-err big">{err}</div>;
  if (!os) return <div className="ad-load">Loading…</div>;

  const sales = os.filter(isSale); const today = day(new Date().toISOString());
  const since = (d: number) => sales.filter((o) => Date.now() - +new Date(o.created_at) < d * 864e5);
  const sum = (a: AOrder[]) => a.reduce((t, o) => t + o.total, 0);
  const todo = os.filter((o) => ["new", "confirmed", "packed"].includes(o.status) && (o.pay_method === "cod" || o.pay_status === "paid"));
  const units = ps.reduce((t, p) => t + SIZES.reduce((a, z) => a + (p.stock[z] || 0), 0), 0);
  const low = ps.flatMap((p) => SIZES.filter((z) => (p.stock[z] || 0) <= 1).map((z) => ({ id: p.id, z, n: p.stock[z] || 0 })));
  const sold: Record<string, number> = {}; sales.forEach((o) => o.items.forEach((l) => { sold[l.id] = (sold[l.id] || 0) + l.qty; }));
  const best = PRODUCTS.map((p) => ({ id: p.id, n: sold[p.id] || 0 })).sort((a, b) => b.n - a.n); const max = Math.max(1, ...best.map((b) => b.n));
  const setup = st && [!st.env.db && "Database", !st.env.card && "Card payments", !st.env.email && "Order emails", !st.env.blob && "Photo uploads"].filter(Boolean);

  return (<>
    {st && !st.env.db && <Link href="/admin/settings/" className="ad-note">Test mode: no database connected yet, so orders and changes are temporary and reset when the site redeploys. Connect Neon in Settings to keep them →</Link>}
    {setup && setup.length > 0 && st?.env.db && <Link href="/admin/settings/" className="ad-note">Still to connect: {setup.join(" · ")}. Open Settings for the steps →</Link>}
    <div className="ad-kpis">
      <div className="ad-kpi"><span>Today</span><b>{aed(sum(sales.filter((o) => day(o.created_at) === today)))}</b><small>{sales.filter((o) => day(o.created_at) === today).length} orders</small></div>
      <div className="ad-kpi"><span>Last 7 days</span><b>{aed(sum(since(7)))}</b><small>{since(7).length} orders</small></div>
      <div className="ad-kpi"><span>All time</span><b>{aed(sum(sales))}</b><small>{sales.length} orders · avg {aed(sales.length ? sum(sales) / sales.length : 0)}</small></div>
      <div className="ad-kpi"><span>Pieces in stock</span><b>{units}</b><small>{low.filter((l) => !l.n).length} sizes sold out</small></div>
    </div>
    <div className="ad-grid2">
      <section className="ad-card"><header><h2>To do</h2><Link href="/admin/orders/?f=todo">All orders →</Link></header>
        {todo.length ? <ul className="ad-list">{todo.slice(0, 8).map((o) => <li key={o.no}><Link href={`/admin/orders/?o=${o.no}`}><b>{o.no}</b><span>{o.name} · {o.address.emirate}{o.speed === "same" ? " · same day" : ""}</span><span className={"ad-pill s-" + o.status}>{STATUS_LABEL[o.status]}</span><span>{aed(o.total)}</span></Link></li>)}</ul> : <p className="ad-empty">Nothing to pack. New orders show up here.</p>}
      </section>
      <section className="ad-card"><header><h2>Low stock</h2><Link href="/admin/products/">Products →</Link></header>
        {low.length ? <ul className="ad-list">{low.slice(0, 10).map((l) => <li key={l.id + l.z}><Link href="/admin/products/"><img src={thumb(ps.find((p) => p.id === l.id)!)} alt="" /><span>{pname(l.id)}</span><span className="ad-pill">{l.z}</span><span className={l.n ? "warn" : "out"}>{l.n ? "1 left" : "Sold out"}</span></Link></li>)}</ul> : <p className="ad-empty">Every size has 2 or more.</p>}
      </section>
      <section className="ad-card"><header><h2>Recent orders</h2></header>
        {os.length ? <ul className="ad-list">{os.slice(0, 6).map((o) => <li key={o.no}><Link href={`/admin/orders/?o=${o.no}`}><b>{o.no}</b><span>{when(o.created_at)} · {payLabel(o)}</span><span className={"ad-pill s-" + o.status}>{STATUS_LABEL[o.status]}</span><span>{aed(o.total)}</span></Link></li>)}</ul> : <p className="ad-empty">No orders yet.</p>}
      </section>
      <section className="ad-card"><header><h2>Best sellers</h2></header>
        <ul className="ad-bars">{best.map((b) => <li key={b.id}><span>{pname(b.id)}</span><i style={{ width: (b.n / max) * 100 + "%" }} /><b>{b.n}</b></li>)}</ul>
      </section>
    </div>
  </>);
}
