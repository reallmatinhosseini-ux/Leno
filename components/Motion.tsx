"use client";
/* Smooth scrolling (desktop), scroll reveals and route-change motion.
   Pages mark elements with data-rise (headline letters), data-fade, data-reveal (images). */
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function splitChars(el: Element): HTMLElement[] {
  if ((el as HTMLElement).dataset.split) return Array.from(el.querySelectorAll<HTMLElement>("[data-ch]"));
  (el as HTMLElement).dataset.split = "1";
  const out: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent || "").split(/(\s+)/).forEach((word) => {
          if (!word) return;
          if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(" ")); return; }
          const wr = document.createElement("span"); wr.style.cssText = "display:inline-block;white-space:nowrap";
          word.split("").forEach((c) => {
            const w = document.createElement("span"); w.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.04em";
            const s = document.createElement("span"); s.style.display = "inline-block"; s.dataset.ch = "1"; s.textContent = c; w.appendChild(s); wr.appendChild(w); out.push(s);
          });
          frag.appendChild(wr);
        });
        n.parentNode!.replaceChild(frag, n);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
  return out;
}

export default function Motion() {
  const path = usePathname();

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const lenis = new Lenis({ lerp: .09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
    document.documentElement.classList.toggle("focus-co", path.startsWith("/checkout"));
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("#view", { opacity: 0 }, { opacity: 1, duration: .6, ease: "power2.out", clearProps: "opacity" });
      document.querySelectorAll("[data-rise]").forEach((h) => {
        gsap.from(splitChars(h), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: .018, scrollTrigger: { trigger: h, start: "top 88%" } });
      });
      document.querySelectorAll("[data-fade]").forEach((el) => gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%" } }));
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(12% 6% 12% 6%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
        const im = el.querySelector("img"); if (im) gsap.fromTo(im, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });
      document.querySelectorAll<HTMLElement>("[data-stamp]").forEach((k) => {
        gsap.timeline({ scrollTrigger: { trigger: k, start: "top 85%" }, delay: .5 })
          .fromTo(k, { opacity: 0, scale: 2.6, rotate: -32, filter: "blur(5px)" }, { opacity: 1, scale: 1, rotate: -12, filter: "blur(0px)", duration: .45, ease: "power4.in" })
          .to(k, { scaleX: 1.15, scaleY: .85, duration: .07 }).to(k, { scaleX: 1, scaleY: 1, duration: .6, ease: "elastic.out(1,.35)" });
      });
      gsap.utils.toArray<HTMLElement>(".grid .card").forEach((c, i) => {
        const st = { trigger: c, start: "top 94%" }, d = (i % 4) * .07;
        gsap.from(c, { y: 90, rotate: i % 2 ? 1.6 : -1.6, opacity: 0, duration: 1.2, ease: "expo.out", delay: d, clearProps: "transform,opacity", scrollTrigger: st });
        const im = c.querySelector(".cm"); if (im) gsap.from(im, { clipPath: "inset(100% 0% 0% 0% round 6px)", duration: 1.1, ease: "expo.inOut", delay: d, clearProps: "clipPath", scrollTrigger: st });
      });
    });
    const r = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => { clearTimeout(r); ctx.revert(); };
  }, [path]);

  return <div className="route-line" key={path} aria-hidden="true" />;
}
