"use client";
/* Welcome gift: an envelope sealed with the LENO WEAR kiss. It rises in, the seal
   lifts, the flap opens, the letter slides out and the kiss stamps itself onto it
   while smaller kisses float out of the envelope. One offer, shown once, easy to close. */
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { asset } from "@/lib/site";
import { useStore } from "@/lib/store";
import { Close } from "./icons";

const SNOOZE = "leno-offer-snooze";
const KISS = () => asset("/p/kiss-tag.png");

export default function Welcome() {
  const s = useStore(); const path = usePathname();
  const [show, setShow] = useState(false);
  const [stage, setStage] = useState<"closed" | "open">("closed");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const opened = useRef(false);

  /* first visit only: not claimed, not snoozed, never during checkout */
  useEffect(() => {
    if (!s.ready || s.promo || !s.cfg.welcomeOn) return;
    if (/^\/(checkout|order|admin)/.test(path)) return;
    let snooze = 0; try { snooze = +(localStorage.getItem(SNOOZE) || 0); } catch { /* ignore */ }
    if (Date.now() - snooze < 7 * 864e5) return;
    const t = setTimeout(() => setShow(true), 1400);
    return () => clearTimeout(t);
  }, [s.ready, s.promo, s.cfg.welcomeOn, path]);

  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* open sequence: seal lifts, flap opens, letter rises, kiss stamps, kisses float out */
  const open = useCallback(() => {
    if (opened.current || !root.current) return; opened.current = true;
    tl.current?.kill();
    const q = gsap.utils.selector(root.current);
    const env = q(".we-env")[0] as HTMLElement, card = q(".we-card")[0] as HTMLElement;
    const H = env.offsetHeight;
    if (reduce()) {
      gsap.set(q(".we-flap"), { rotateX: 180, zIndex: 1 }); gsap.set(card, { y: 0 }); gsap.set(q(".we-seal"), { opacity: 0 });
      gsap.set(q(".we-stamp"), { opacity: 1, scale: 1 }); gsap.set(q(".we-in > *"), { opacity: 1, y: 0 }); setStage("open"); return;
    }
    const t = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => setStage("open") });
    t.to(q(".we-hint"), { opacity: 0, y: 6, duration: .3 }, 0)
      /* seal pops off the flap */
      .to(q(".we-seal"), { scale: 1.35, rotate: -14, duration: .35, ease: "back.out(3)" }, 0)
      .to(q(".we-seal"), { y: -H * .9, x: 10, rotate: 18, scale: .2, opacity: 0, duration: .7, ease: "power3.in" }, .32)
      /* flap swings open and drops behind the letter */
      .to(q(".we-flap"), { rotateX: 180, duration: .8, ease: "power3.inOut" }, .25)
      .set(q(".we-flap"), { zIndex: 1 }, .62)
      /* envelope gives a little bounce */
      .to(env, { y: 10, duration: .25, ease: "power2.out" }, .55).to(env, { y: 0, duration: .9, ease: "elastic.out(1,.45)" }, .8)
      /* letter slides up out of the pocket */
      .to(card, { y: 0, duration: 1.15, ease: "expo.out" }, .78)
      .fromTo(card, { rotate: -1.5 }, { rotate: 0, duration: 1.2, ease: "elastic.out(1,.5)" }, .78)
      /* the big kiss stamps onto the letter */
      .fromTo(q(".we-stamp"), { opacity: 0, scale: 2.8, rotate: -24, filter: "blur(6px)" }, { opacity: 1, scale: 1, rotate: -8, filter: "blur(0px)", duration: .55, ease: "power4.in" }, 1.25)
      .to(q(".we-stamp"), { scaleX: 1.12, scaleY: .88, duration: .08, ease: "power1.out" }, 1.8)
      .to(q(".we-stamp"), { scaleX: 1, scaleY: 1, duration: .6, ease: "elastic.out(1,.35)" }, 1.88)
      .fromTo(q(".we-ring"), { scale: .4, opacity: .5 }, { scale: 2.2, opacity: 0, duration: .9, ease: "expo.out" }, 1.8)
      /* text arrives line by line */
      .fromTo(q(".we-in > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .06, duration: .8 }, 1.45);
    /* small kisses float out of the envelope mouth */
    q(".we-burst img").forEach((k, i) => {
      const side = i % 2 ? 1 : -1, spread = 40 + Math.random() * 150;
      t.fromTo(k, { x: 0, y: 0, scale: .2, opacity: 0, rotate: 0 },
        { keyframes: [
          { opacity: 1, scale: .5 + Math.random() * .5, x: side * spread * .55, y: -H * (.55 + Math.random() * .45), rotate: side * (15 + Math.random() * 30), duration: .7, ease: "power2.out" },
          { opacity: 0, x: side * spread, y: -H * (1.1 + Math.random() * .6), rotate: side * (40 + Math.random() * 50), duration: 1.1, ease: "power1.in" },
        ] }, 1.0 + i * .06);
    });
    tl.current = t;
  }, []);

  /* entrance: backdrop, envelope rises, seal breathes; auto-opens unless tapped first */
  useEffect(() => {
    if (!show || !root.current) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void } }).__lenis; lenis?.stop();
    document.documentElement.classList.add("ov-open");
    const q = gsap.utils.selector(root.current);
    const env = q(".we-env")[0] as HTMLElement, card = q(".we-card")[0] as HTMLElement;
    const H = env.offsetHeight;
    gsap.set(card, { y: card.offsetHeight - H * .17 }); gsap.set(q(".we-flap"), { transformPerspective: 900, rotateX: 0, zIndex: 4 });
    gsap.set(q(".we-in > *"), { opacity: 0 }); gsap.set(q(".we-stamp"), { opacity: 0 });
    if (reduce()) { gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: .3 }); open(); return; }
    const t = gsap.timeline({ defaults: { ease: "expo.out" } });
    t.fromTo(q(".we-bg"), { opacity: 0 }, { opacity: 1, duration: .6, ease: "power2.out" })
      .fromTo(q(".we-stage"), { y: innerHeight * .6, rotate: -8, scale: .8 }, { y: 0, rotate: 0, scale: 1, duration: 1.1, ease: "back.out(1.4)" }, .05)
      .fromTo(q(".we-x"), { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .5 }, .6)
      .fromTo(q(".we-seal"), { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: .7, ease: "back.out(2.6)" }, .55)
      .fromTo(q(".we-hint"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .6 }, .9)
      .to(q(".we-seal"), { scale: 1.08, duration: .45, yoyo: true, repeat: 1, ease: "sine.inOut" }, 1.2)
      .add(() => open(), 2.3);
    tl.current = t;
    return () => { t.kill(); };
  }, [show, open]);

  /* gentle 3D tilt that follows the pointer */
  useEffect(() => {
    if (!show || !root.current || !matchMedia("(pointer: fine)").matches || reduce()) return;
    const stage = root.current.querySelector<HTMLElement>(".we-tilt")!;
    const rx = gsap.quickTo(stage, "rotateX", { duration: .8, ease: "power3" }), ry = gsap.quickTo(stage, "rotateY", { duration: .8, ease: "power3" });
    const mv = (e: PointerEvent) => { rx(-(e.clientY / innerHeight - .5) * 10); ry((e.clientX / innerWidth - .5) * 14); };
    addEventListener("pointermove", mv); return () => removeEventListener("pointermove", mv);
  }, [show]);

  const close = useCallback((snooze = true) => {
    if (snooze) { try { localStorage.setItem(SNOOZE, String(Date.now())); } catch { /* ignore */ } }
    const end = () => {
      setShow(false); setStage("closed"); opened.current = false; document.documentElement.classList.remove("ov-open");
      (window as unknown as { __lenis?: { start: () => void } }).__lenis?.start();
    };
    if (!root.current || reduce()) { end(); return; }
    tl.current?.kill();
    gsap.timeline({ onComplete: end })
      .to(root.current.querySelector(".we-stage"), { y: 40, scale: .92, opacity: 0, duration: .45, ease: "power2.in" })
      .to(root.current.querySelector(".we-bg"), { opacity: 0, duration: .35 }, .15);
  }, []);

  useEffect(() => { if (!show) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [show, close]);

  const claim = (e: React.FormEvent) => {
    e.preventDefault(); s.claim(); setDone(true);
    if (root.current && !reduce()) {
      const q = gsap.utils.selector(root.current);
      gsap.fromTo(q(".we-done > *"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .07, duration: .7, ease: "expo.out" });
      gsap.fromTo(q(".we-stamp"), { scale: 1 }, { scale: 1.18, rotate: -2, duration: .18, yoyo: true, repeat: 1, ease: "power2.out" });
      q(".we-burst img").forEach((k, i) => gsap.fromTo(k, { x: 0, y: 0, opacity: 0, scale: .2 }, { opacity: 1, scale: .6, x: (i % 2 ? 1 : -1) * (60 + i * 18), y: -260 - i * 20, rotate: (i % 2 ? 1 : -1) * 50, duration: 1.2, ease: "power2.out", delay: i * .04, onComplete: () => { gsap.to(k, { opacity: 0, duration: .4 }); } }));
    }
  };
  const copy = async () => { try { await navigator.clipboard.writeText("LENO10"); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ } };

  const reopen = () => { opened.current = false; setDone(!!s.promo); setStage("closed"); setShow(true); };
  const hidden = !s.ready || !s.cfg.welcomeOn || /^\/(checkout|order|admin)/.test(path);
  const tab = !hidden && !show && (
    <button type="button" className={"we-tab" + (s.promo ? " got" : "")} onClick={reopen} aria-label={s.promo ? "Your 10% welcome code" : `Get ${s.cfg.welcomePct}% off`}>
      <img src={KISS()} alt="" /><span className="full">{s.promo ? "Your code: LENO10" : `Get ${s.cfg.welcomePct}% off`}</span><span className="short">{s.promo ? "LENO10" : `${s.cfg.welcomePct}%`}</span>
    </button>
  );
  if (!show) return tab || null;
  return (
    <div className="we" ref={root} role="dialog" aria-modal="true" aria-labelledby="we-t">
      <div className="we-bg" onClick={() => close()} />
      <button type="button" className="we-x" aria-label="Close" onClick={() => close()}><Close /></button>
      <div className="we-stage">
        <div className="we-tilt">
          <div className="we-env" onClick={() => stage === "closed" && open()}>
            <div className="we-back" />
            <div className="we-flap"><i className="we-flap-out" /><i className="we-flap-in" /></div>
            <div className="we-slot">
              <div className="we-card">
                <img className="we-stamp" src={KISS()} alt="" draggable={false} />
                <span className="we-ring" />
                {!done ? (
                  <div className="we-in">
                    <span className="we-k">A kiss from LENO WEAR</span>
                    <h2 id="we-t">Your welcome gift</h2>
                    <p className="we-off"><b>{s.cfg.welcomePct}% off</b> your first order</p>
                    <form className="we-f" onSubmit={claim}>
                      <input type="email" required placeholder="Your email address" aria-label="Your email address" autoComplete="email" />
                      <button className="btn red block" type="submit">Claim my {s.cfg.welcomePct}% off</button>
                    </form>
                    <button type="button" className="we-later" onClick={() => close()}>Maybe later</button>
                  </div>
                ) : (
                  <div className="we-in we-done">
                    <span className="we-k">Sealed with a kiss</span>
                    <h2 id="we-t">It&apos;s yours</h2>
                    <button type="button" className="we-code" onClick={copy} aria-label="Copy code LENO10"><b>LENO10</b><span>{copied ? "Copied" : "Copy"}</span></button>
                    <p className="we-note">Already saved to your bag. It applies at checkout.</p>
                    <button type="button" className="btn red block" onClick={() => close(false)}>Start shopping</button>
                  </div>
                )}
              </div>
            </div>
            <div className="we-front"><span className="we-brand">LENO WEAR<small>Leave your mark</small></span></div>
            <button type="button" className="we-seal" aria-label="Open your gift" onClick={(e) => { e.stopPropagation(); open(); }}><img src={KISS()} alt="" draggable={false} /></button>
            <div className="we-burst" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <img key={i} src={KISS()} alt="" />)}</div>
          </div>
          <span className="we-hint">{stage === "closed" ? "Tap the kiss to open" : ""}</span>
        </div>
      </div>
    </div>
  );
}
