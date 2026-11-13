/* The LENO WEAR signature motion: the kiss. One stamp (press, squash, settle, ring)
   and one burst (small kisses floating up), reused across the site so every
   interaction feels like the same brand. Client-only, reduced-motion aware. */
import { gsap } from "gsap";
import { asset } from "./site";

const off = () => typeof window === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches;
const KISS = () => asset("/p/kiss-tag.png");

function centre(from: Element | { x: number; y: number }) {
  if ("x" in from && "y" in from && !(from instanceof Element)) return from;
  const r = (from as Element).getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/** A small kiss presses onto a point, squashes, settles and fades (or stays). */
export function stampKiss(at: Element | { x: number; y: number }, opts: { size?: number; stay?: boolean; rotate?: number; ring?: boolean } = {}) {
  if (off()) return;
  const { x, y } = centre(at), size = opts.size ?? 46, rot = opts.rotate ?? -10;
  const k = document.createElement("img"); k.src = KISS(); k.alt = ""; k.className = "fx-kiss";
  Object.assign(k.style, { width: size + "px", left: x - size / 2 + "px", top: y - size * .37 + "px" });
  document.body.appendChild(k);
  const tl = gsap.timeline({ onComplete: () => { if (!opts.stay) k.remove(); } });
  tl.fromTo(k, { opacity: 0, scale: 2.6, rotate: rot - 18, filter: "blur(4px)" }, { opacity: 1, scale: 1, rotate: rot, filter: "blur(0px)", duration: .42, ease: "power4.in" })
    .to(k, { scaleX: 1.14, scaleY: .86, duration: .07 })
    .to(k, { scaleX: 1, scaleY: 1, duration: .5, ease: "elastic.out(1,.35)" });
  if (opts.ring !== false) {
    const r = document.createElement("span"); r.className = "fx-ring";
    Object.assign(r.style, { width: size + "px", height: size + "px", left: x - size / 2 + "px", top: y - size / 2 + "px" });
    document.body.appendChild(r);
    gsap.fromTo(r, { scale: .4, opacity: .55 }, { scale: 2.1, opacity: 0, duration: .8, ease: "expo.out", delay: .42, onComplete: () => r.remove() });
  }
  if (!opts.stay) tl.to(k, { opacity: 0, y: -12, duration: .5, ease: "power2.in" }, "+=.5");
  return k;
}

/** A handful of small kisses float up and away from a point. */
export function kissBurst(at: Element | { x: number; y: number }, count = 7, spread = 1) {
  if (off()) return;
  const { x, y } = centre(at);
  for (let i = 0; i < count; i++) {
    const k = document.createElement("img"); k.src = KISS(); k.alt = ""; k.className = "fx-kiss sm";
    const s = 16 + Math.random() * 16;
    Object.assign(k.style, { width: s + "px", left: x - s / 2 + "px", top: y - s / 2 + "px" });
    document.body.appendChild(k);
    const side = i % 2 ? 1 : -1, dx = side * (20 + Math.random() * 70) * spread, dy = -(50 + Math.random() * 90) * spread;
    gsap.timeline({ onComplete: () => k.remove(), delay: i * .03 })
      .fromTo(k, { opacity: 0, scale: .3, rotate: 0 }, { opacity: 1, scale: 1, x: dx * .5, y: dy * .5, rotate: side * 20, duration: .4, ease: "power2.out" })
      .to(k, { opacity: 0, x: dx, y: dy, rotate: side * (40 + Math.random() * 40), duration: .7, ease: "power1.in" });
  }
}

/** Gentle bump for an icon that just received something (the bag). */
export function bump(el: Element | null) {
  if (!el || off()) return;
  gsap.fromTo(el, { scale: 1 }, { scale: 1.22, duration: .16, yoyo: true, repeat: 1, ease: "power2.out", clearProps: "transform" });
}
