"use client";
/* Desktop pointer: the normal system cursor everywhere. Over imagery marked with
   data-cursor, a small label ("View", "Shop") glides in beside the pointer, and the
   main red buttons lean gently toward it. Touch screens and reduced motion get the
   plain pointer only. */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const lab = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = lab.current!, txt = l.querySelector("span")!;
    const lx = gsap.quickTo(l, "x", { duration: .35, ease: "power3" }), ly = gsap.quickTo(l, "y", { duration: .35, ease: "power3" });
    let on = false, placed = false, mag: HTMLElement | null = null;
    const show = (label: string | null) => {
      if (label) txt.textContent = label;
      if (!!label === on) return; on = !!label;
      gsap.to(l, { opacity: on ? 1 : 0, scale: on ? 1 : .8, duration: on ? .3 : .2, ease: on ? "power3.out" : "power2.in" });
    };
    const move = (e: PointerEvent) => {
      /* label sits just below-right of the arrow so it never covers what you point at */
      if (!placed) { placed = true; gsap.set(l, { x: e.clientX + 18, y: e.clientY + 20 }); }
      lx(e.clientX + 18); ly(e.clientY + 20);
      const t = e.target as Element;
      const v = t.closest?.("[data-cursor]");
      /* no label over buttons (quick view, quick add, sizes), so it never covers them */
      show(v && !t.closest?.("button, select, input, .quick") ? v.getAttribute("data-cursor") || "View" : null);
      const m = t.closest?.(".btn.red, .hx-cta .btn") as HTMLElement | null;
      if (m !== mag) { if (mag) gsap.to(mag, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" }); mag = m; }
      if (mag) { const r = mag.getBoundingClientRect(); gsap.to(mag, { x: (e.clientX - r.left - r.width / 2) * .12, y: (e.clientY - r.top - r.height / 2) * .2, duration: .4, ease: "power3" }); }
    };
    const out = () => { placed = false; show(null); };
    addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", out);
    return () => { removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", out); };
  }, []);
  return <div className="lc" ref={lab} aria-hidden="true"><span>View</span><i>→</i></div>;
}
