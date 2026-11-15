"use client";
import { useEffect, useState } from "react";
import { AProduct, ASettings, PRODUCTS, SIZES, STYLES, aed, api } from "@/components/admin/lib";
import type { Size } from "@/lib/data";

const src = (im: string) => (/^https?:/.test(im) ? im : `/p/${im}.webp`);

export default function Products() {
  const [ps, setPs] = useState<AProduct[] | null>(null); const [st, setSt] = useState<ASettings | null>(null); const [err, setErr] = useState("");
  useEffect(() => { Promise.all([api<AProduct[]>("products/"), api<ASettings>("settings/")]).then(([p, s]) => { setPs(p); setSt(s); }).catch((e) => setErr(e.message)); }, []);
  if (err) return <div className="ad-err big">{err}</div>;
  if (!ps || !st) return <div className="ad-load">Loading…</div>;
  return (<>
    <Prices st={st} setSt={setSt} />
    <div className="ad-prods">{PRODUCTS.map((p) => { const row = ps.find((r) => r.id === p.id); return row ? <Card key={p.id} row={row} canUpload={st.env.blob} saved={setPs} /> : null; })}</div>
  </>);
}

function Prices({ st, setSt }: { st: ASettings; setSt: (s: ASettings) => void }) {
  const [v, setV] = useState(st.prices); const [msg, setMsg] = useState("");
  const dirty = JSON.stringify(v) !== JSON.stringify(st.prices);
  const save = async () => { try { setSt(await api<ASettings>("settings/", { method: "PUT", json: { prices: v } })); setMsg("Saved"); } catch (e) { setMsg((e as Error).message); } setTimeout(() => setMsg(""), 2500); };
  return (
    <section className="ad-card"><header><h2>Prices</h2><small className="ad-mute">One price per style, in AED with VAT. Applies to every colour.</small></header>
      <div className="ad-prices">{Object.entries(STYLES).map(([k, s]) => <label key={k}><span>{s.name}</span><div className="ad-aed"><i>AED</i><input className="ad-in" type="number" min={1} value={v[k] ?? s.price} onChange={(e) => setV({ ...v, [k]: +e.target.value })} /></div></label>)}</div>
      <div className="ad-row-end">{msg && <span className="ad-ok">{msg}</span>}<button type="button" className="ad-btn dark" disabled={!dirty} onClick={save}>Save prices</button></div>
    </section>
  );
}

function Card({ row, canUpload, saved }: { row: AProduct; canUpload: boolean; saved: (p: AProduct[]) => void }) {
  const p = PRODUCTS.find((x) => x.id === row.id)!; const style = STYLES[p.style];
  const [stock, setStock] = useState(row.stock); const [badge, setBadge] = useState(row.badge); const [hidden, setHidden] = useState(row.hidden);
  const [imgs, setImgs] = useState<string[]>(row.images || p.images); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const base = JSON.stringify([row.stock, row.badge, row.hidden, row.images || p.images]);
  const dirty = JSON.stringify([stock, badge, hidden, imgs]) !== base;
  const total = SIZES.reduce((a, z) => a + (+stock[z] || 0), 0);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const save = async () => {
    setBusy(true);
    try { saved(await api<AProduct[]>("products/", { method: "PATCH", json: { id: row.id, stock, badge, hidden, images: JSON.stringify(imgs) === JSON.stringify(p.images) ? null : imgs } })); flash("Saved"); }
    catch (e) { flash((e as Error).message); }
    setBusy(false);
  };
  const upload = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true);
    try { const urls: string[] = []; for (const f of Array.from(files)) { const fd = new FormData(); fd.append("file", f); urls.push((await api<{ url: string }>("upload/", { method: "POST", body: fd })).url); } setImgs([...imgs, ...urls]); flash("Uploaded. Press Save to publish."); }
    catch (e) { flash((e as Error).message); }
    setBusy(false);
  };
  const move = (i: number, d: number) => { const n = [...imgs]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; setImgs(n); };
  return (
    <section className={"ad-card ad-prod" + (hidden ? " is-hidden" : "")}>
      <header><div><h2>{style.name} · {p.color}</h2><small className="ad-mute">{style.code} · {aed(style.price)} default · {total} in stock</small></div><a href={`/products/${p.slug}/`} target="_blank" rel="noopener">View ↗</a></header>
      <div className="ad-sizes">{SIZES.map((z: Size) => <label key={z}><span>{z}</span><input className={"ad-in" + (!+stock[z] ? " zero" : "")} type="number" min={0} value={stock[z] ?? 0} onChange={(e) => setStock({ ...stock, [z]: Math.max(0, +e.target.value || 0) })} /></label>)}</div>
      <div className="ad-imgs">{imgs.map((im, i) => <figure key={im + i}><img src={src(im)} alt="" />{i === 0 && <em>Main</em>}<div><button type="button" onClick={() => move(i, -1)} aria-label="Move left">←</button><button type="button" onClick={() => move(i, 1)} aria-label="Move right">→</button><button type="button" onClick={() => imgs.length > 1 && setImgs(imgs.filter((_, j) => j !== i))} aria-label="Remove">×</button></div></figure>)}
        <label className={"ad-add" + (canUpload ? "" : " off")} title={canUpload ? "Add photos" : "Connect Blob storage in Settings to upload"}><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={!canUpload || busy} onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />+<small>{canUpload ? "Add photo" : "Connect storage"}</small></label>
      </div>
      <div className="ad-prod-f">
        <label className="ad-field"><span>Badge</span><input className="ad-in" placeholder="e.g. New, Bestseller" maxLength={24} value={badge} onChange={(e) => setBadge(e.target.value)} /></label>
        <label className="ad-check"><input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} /> Hide from store</label>
        <div className="ad-row-end">{msg && <span className="ad-ok">{msg}</span>}<button type="button" className="ad-btn dark" disabled={!dirty || busy} onClick={save}>Save</button></div>
      </div>
    </section>
  );
}
