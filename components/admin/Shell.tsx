"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [["/admin/", "Overview"], ["/admin/orders/", "Orders"], ["/admin/products/", "Products"], ["/admin/customers/", "Customers"], ["/admin/settings/", "Settings"]];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/admin/"; const here = path.endsWith("/") ? path : path + "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  if (here.startsWith("/admin/login/")) return <>{children}</>;
  const out = async () => { await fetch("/api/admin/logout/", { method: "POST" }); location.href = "/admin/login/"; };
  return (
    <div className="ad">
      <aside className={"ad-side" + (open ? " open" : "")}>
        <Link href="/admin/" className="ad-brand"><img src="/p/kiss-tag.png" alt="" /><span>LENO WEAR<small>Admin</small></span></Link>
        <nav>{NAV.map(([h, l]) => <Link key={h} href={h} className={here === h ? "on" : ""}>{l}</Link>)}</nav>
        <div className="ad-side-f"><a href="/" target="_blank" rel="noopener">View store ↗</a><button type="button" onClick={out}>Sign out</button></div>
      </aside>
      <div className="ad-main">
        <header className="ad-top"><button type="button" className="ad-burger" aria-label="Menu" onClick={() => setOpen(!open)}><i /><i /></button><b>{NAV.find(([h]) => h === here)?.[1] || "Admin"}</b></header>
        <div className="ad-body">{children}</div>
      </div>
      {open && <div className="ad-scrim" onClick={() => setOpen(false)} />}
    </div>
  );
}
