"use client";
/* Desktop-only refinements: a label that follows the pointer over imagery marked
   with data-cursor ("View", "Shop", "Zoom"), and primary buttons that lean gently
   toward the pointer. The native cursor stays; touch and reduced motion get nothing. */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = el.current!, label = c.querySelector("span")!;
    const x = gsap.quickTo(c, "x", { duration: .45, ease: "power3" }), y = gsap.quickTo(c, "y", { duration: .45, ease: "power3" });
    let on: Element | null = null, mag: HTMLElement | null = null;
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY);
      const t = (e.target as Element)?.closest?.("[data-cursor]");
      if (t !== on) {
        on = t;
        if (t) { label.textContent = t.getAttribute("data-cursor") || "View"; gsap.to(c, { scale: 1, opacity: 1, duration: .35, ease: "back.out(2)" }); }
        else gsap.to(c, { scale: .3, opacity: 0, duration: .25 });
      }
      const m = (e.target as Element)?.closest?.(".btn.red, .hx-cta .btn, .we-tab") as HTMLElement | null;
      if (m !== mag) { if (mag) gsap.to(mag, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.4)" }); mag = m; }
      if (mag && !mag.closest(".we-tab")) {
        const r = mag.getBoundingClientRect();
        gsap.to(mag, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .28, duration: .4, ease: "power3" });
      }
    };
    const leave = () => { gsap.to(c, { scale: .3, opacity: 0, duration: .25 }); on = null; };
    addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerleave", leave);
    return () => { removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, []);
  return <div className="lc" ref={el} aria-hidden="true"><span>View</span></div>;
}
