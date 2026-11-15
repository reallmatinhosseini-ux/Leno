"use client";
/* Desktop cursor: a crisp vector kiss that follows the pointer. It tilts and grows
   over anything clickable, squashes on click, and hands over to a "View" label on
   imagery marked with data-cursor. Inputs keep the text cursor. Touch screens and
   reduced motion keep the normal pointer. */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { asset } from "@/lib/site";

const CLICK = "a,button,summary,select,label,[role='button'],.chip,.we-env,.we-tab,.c2,.hs";

export default function Cursor() {
  const kiss = useRef<HTMLImageElement>(null); const lab = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const k = kiss.current!, l = lab.current!, txt = l.querySelector("span")!;
    document.documentElement.classList.add("kc-on");
    gsap.set([k, l], { xPercent: -50, yPercent: -50 });
    const kx = gsap.quickTo(k, "x", { duration: .12, ease: "power3" }), ky = gsap.quickTo(k, "y", { duration: .12, ease: "power3" });
    const lx = gsap.quickTo(l, "x", { duration: .45, ease: "power3" }), ly = gsap.quickTo(l, "y", { duration: .45, ease: "power3" });
    let mode = "", shown = false, mag: HTMLElement | null = null;
    const set = (m: string, label?: string) => {
      if (m === mode) return; mode = m;
      if (m === "view") { txt.textContent = label || "View"; gsap.to(l, { scale: 1, opacity: 1, duration: .35, ease: "back.out(2)" }); gsap.to(k, { scale: .45, rotate: -18, opacity: .9, duration: .3 }); }
      else { gsap.to(l, { scale: .3, opacity: 0, duration: .25 }); }
      if (m === "link") gsap.to(k, { scale: 1.35, rotate: -16, opacity: 1, duration: .35, ease: "back.out(2.4)" });
      if (m === "text") gsap.to(k, { scale: .4, opacity: 0, duration: .2 });
      if (m === "") gsap.to(k, { scale: 1, rotate: -10, opacity: 1, duration: .35, ease: "power3" });
    };
    const move = (e: PointerEvent) => {
      if (!shown) { shown = true; gsap.set([k, l], { x: e.clientX, y: e.clientY }); gsap.to(k, { opacity: 1, duration: .3 }); }
      kx(e.clientX); ky(e.clientY); lx(e.clientX + 34); ly(e.clientY - 34);
      const t = e.target as Element;
      const v = t.closest?.("[data-cursor]");
      if (v) set("view", v.getAttribute("data-cursor") || "View");
      else if (t.closest?.("input,textarea,[contenteditable]")) set("text");
      else if (t.closest?.(CLICK)) set("link");
      else set("");
      const m = t.closest?.(".btn.red, .hx-cta .btn") as HTMLElement | null;
      if (m !== mag) { if (mag) gsap.to(mag, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" }); mag = m; }
      if (mag) { const r = mag.getBoundingClientRect(); gsap.to(mag, { x: (e.clientX - r.left - r.width / 2) * .16, y: (e.clientY - r.top - r.height / 2) * .26, duration: .4, ease: "power3" }); }
    };
    const down = () => gsap.to(k, { scaleX: "*=1.18", scaleY: "*=.72", duration: .08, ease: "power2.out" });
    const up = () => gsap.to(k, { scaleX: mode === "link" ? 1.35 : mode === "view" ? .45 : 1, scaleY: mode === "link" ? 1.35 : mode === "view" ? .45 : 1, duration: .55, ease: "elastic.out(1,.35)" });
    const out = () => { shown = false; gsap.to([k, l], { opacity: 0, duration: .2 }); };
    addEventListener("pointermove", move, { passive: true }); addEventListener("pointerdown", down); addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", out);
    return () => {
      document.documentElement.classList.remove("kc-on");
      removeEventListener("pointermove", move); removeEventListener("pointerdown", down); removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", out);
    };
  }, []);
  return (<>
    <img ref={kiss} className="kc" src={asset("/p/lips.svg")} alt="" aria-hidden="true" draggable={false} />
    <div className="lc" ref={lab} aria-hidden="true"><span>View</span></div>
  </>);
}
