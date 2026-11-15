"use client";
/* Between pages a cream sheet slides up, a kiss presses at its centre, and the sheet
   lifts away to reveal the new page. Intercepts internal link clicks only; modified
   clicks, new tabs, downloads, hash links and the static admin keep normal behaviour. */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BASE, asset } from "@/lib/site";

export default function PageTransition() {
  const router = useRouter(); const path = usePathname();
  const sheet = useRef<HTMLDivElement>(null); const pending = useRef(false); const safety = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reveal = () => {
    clearTimeout(safety.current);
    const s = sheet.current; if (!s || !pending.current) return; pending.current = false;
    gsap.timeline()
      .to(s.querySelector("img"), { scale: .6, opacity: 0, duration: .25, ease: "power2.in" }, .05)
      .to(s, { yPercent: -100, duration: .65, ease: "expo.inOut" }, .1)
      .set(s, { yPercent: 100, visibility: "hidden" });
  };

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = sheet.current!; gsap.set(s, { yPercent: 100, visibility: "hidden" });
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      let to = url.pathname; if (BASE && to.startsWith(BASE)) to = to.slice(BASE.length) || "/";
      if (to.startsWith("/admin")) return;
      const here = location.pathname.replace(BASE, "") || "/";
      if (to === here) return;
      e.preventDefault();
      if (pending.current) return; pending.current = true;
      const k = s.querySelector("img")!;
      gsap.timeline({ onComplete: () => { router.push(to + url.search + url.hash); safety.current = setTimeout(reveal, 2500); } })
        .set(s, { visibility: "visible" })
        .to(s, { yPercent: 0, duration: .5, ease: "expo.inOut" })
        .fromTo(k, { opacity: 0, scale: 2.4, rotate: -24 }, { opacity: 1, scale: 1, rotate: -10, duration: .32, ease: "power4.in" }, "-=.2")
        .to(k, { scaleX: 1.14, scaleY: .84, duration: .07 }).to(k, { scaleX: 1, scaleY: 1, duration: .25, ease: "power2.out" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (pending.current) requestAnimationFrame(() => setTimeout(reveal, 60)); }, [path]);

  return <div className="pt" ref={sheet} aria-hidden="true"><img src={asset("/p/lips.svg")} alt="" /><span>LENO WEAR</span></div>;
}
