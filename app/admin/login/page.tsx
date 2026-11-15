"use client";
import { useState } from "react";
export default function Login() {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { location.href = "/admin/"; return; }
    setErr((await r.json().catch(() => ({}))).error || "Could not sign in"); setBusy(false);
  };
  return (
    <div className="ad-login"><form onSubmit={go}>
      <img src="/p/kiss-tag.png" alt="" /><h1>LENO WEAR</h1><p>Admin</p>
      <input type="password" autoFocus autoComplete="current-password" placeholder="Password" aria-label="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
      {err && <div className="ad-err">{err}</div>}
      <button className="ad-btn dark" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form></div>
  );
}
