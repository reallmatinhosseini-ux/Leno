"use client";
import { useEffect, useState } from "react";
import { ASettings, api } from "@/components/admin/lib";

export default function Settings() {
  const [st, setSt] = useState<ASettings | null>(null); const [c, setC] = useState<ASettings["cfg"] | null>(null); const [err, setErr] = useState(""); const [msg, setMsg] = useState("");
  useEffect(() => { api<ASettings>("settings/").then((s) => { setSt(s); setC(s.cfg); }).catch((e) => setErr(e.message)); }, []);
  if (err) return <div className="ad-err big">{err}</div>;
  if (!st || !c) return <div className="ad-load">Loading…</div>;
  const dirty = JSON.stringify(c) !== JSON.stringify(st.cfg);
  const save = async () => { try { const s = await api<ASettings>("settings/", { method: "PUT", json: { cfg: c } }); setSt(s); setC(s.cfg); setMsg("Saved. The store updates right away."); } catch (e) { setMsg((e as Error).message); } setTimeout(() => setMsg(""), 3000); };
  const n = (k: keyof ASettings["cfg"]) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: +e.target.value });
  const b = (k: keyof ASettings["cfg"]) => (e: React.ChangeEvent<HTMLInputElement>) => setC({ ...c, [k]: e.target.checked });
  const E = st.env;
  return (<>
    <section className="ad-card"><header><h2>Offers</h2></header>
      <div className="ad-form">
        <label className="ad-check"><input type="checkbox" checked={c.welcomeOn} onChange={b("welcomeOn")} /> Welcome offer (envelope popup, code LENO10)</label>
        <label className="ad-field sm"><span>Welcome discount %</span><input className="ad-in" type="number" min={1} max={50} value={c.welcomePct} onChange={n("welcomePct")} /></label>
        <label className="ad-check"><input type="checkbox" checked={c.bundleOn} onChange={b("bundleOn")} /> Look bundle (a dress + a set in one order)</label>
        <label className="ad-field sm"><span>Bundle discount %</span><input className="ad-in" type="number" min={1} max={50} value={c.bundlePct} onChange={n("bundlePct")} /></label>
      </div>
    </section>
    <section className="ad-card"><header><h2>Delivery & payment</h2></header>
      <div className="ad-form">
        <label className="ad-field sm"><span>Same-day fee in Dubai (AED)</span><input className="ad-in" type="number" min={0} value={c.sameDayFee} onChange={n("sameDayFee")} /></label>
        <label className="ad-field sm"><span>Free same-day from (AED)</span><input className="ad-in" type="number" min={0} value={c.free} onChange={n("free")} /></label>
        <label className="ad-check"><input type="checkbox" checked={c.cod} onChange={b("cod")} /> Accept cash on delivery</label>
      </div>
    </section>
    <div className="ad-row-end sticky">{msg && <span className="ad-ok">{msg}</span>}<button type="button" className="ad-btn dark" disabled={!dirty} onClick={save}>Save settings</button></div>

    <section className="ad-card"><header><h2>Connections</h2><small className="ad-mute">Set in Vercel → your project → Settings → Environment Variables, then redeploy.</small></header>
      <ul className="ad-conn">
        <li className={E.db ? "on" : ""}><b>Database</b><span>{E.db ? "Connected" : "Not connected. Vercel → Storage → Create Database → Neon (free) → connect to this project. It adds DATABASE_URL."}</span></li>
        <li className={E.card ? "on" : ""}><b>Card payments</b><span>{E.card ? `Live through ${E.provider}` : "Not connected yet. Send the payment gateway keys to your developer. Until then customers can pay cash on delivery."}</span></li>
        <li className={E.email ? "on" : ""}><b>Order emails</b><span>{E.email ? `Sending. New-order alerts go to ${E.adminEmail || "(set ADMIN_EMAIL)"}` : "Not connected. Create a free resend.com account, verify your domain, then add RESEND_API_KEY, MAIL_FROM (e.g. LENO WEAR <orders@yourdomain.com>) and ADMIN_EMAIL."}</span></li>
        <li className={E.blob ? "on" : ""}><b>Photo uploads</b><span>{E.blob ? "Connected" : "Not connected. Vercel → Storage → Create → Blob → connect to this project. It adds BLOB_READ_WRITE_TOKEN."}</span></li>
      </ul>
    </section>
  </>);
}
