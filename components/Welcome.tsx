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
    /* calm timing, never on arrival (the campaign film comes first). The offer waits until the
       visitor has looked around: a second page, a real scroll after 12 seconds, or 35 seconds on site */
    const g = window as unknown as { __lenoT0?: number; __lenoSeen?: Set<string>; __lenoShown?: boolean };
    if (g.__lenoShown) return; /* once per visit */
    const fire = () => { if (g.__lenoShown) return; g.__lenoShown = true; setShow(true); };
    const t0 = (g.__lenoT0 ??= Date.now());
    const seen = (g.__lenoSeen ??= new Set()); seen.add(path);
    if (seen.size >= 2) { const t = setTimeout(fire, 1600); return () => clearTimeout(t); }
    const t = setTimeout(fire, Math.max(2000, 35000 - (Date.now() - t0)));
    const onScroll = () => { if (scrollY > innerHeight * 1.2 && Date.now() - t0 > 12000) fire(); };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); removeEventListener("scroll", onScroll); };
  }, [s.ready, s.promo, s.cfg.welcomeOn, path]);

  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* open sequence: seal lifts, flap opens, letter rises, kiss stamps, kisses float out */
  const open = useCallback(() => {
    if (opened.current || !root.current) return; opened.current = true;
    tl.current?.kill();
    const q = gsap.utils.selector(root.current);
    const env = q(".we-env")[0] as HTMLElement, card = q(".we-card")[0] as HTMLElement;
    const H = env.offsetHeight;
    /* where the kiss comes to rest: just above the LENO WEAR name on the envelope front */
    const drop = H * .065, rest = { y: drop, scale: .8, rotate: -6 };
    if (reduce()) {
      gsap.set(q(".we-flap"), { rotateX: 180, zIndex: 1 }); gsap.set(card, { y: 0 }); gsap.set(q(".we-seal"), rest);
      gsap.set(q(".we-in > *"), { opacity: 1, y: 0 }); setStage("open"); return;
    }
    const t = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: () => setStage("open") });
    t.to(q(".we-hint"), { opacity: 0, y: 6, duration: .3 }, 0)
      /* the seal lifts softly off the flap and hovers */
      .to(q(".we-seal"), { y: -H * .07, scale: 1.08, rotate: -9, duration: .6, ease: "power3.out" }, 0)
      .to(q(".we-seal"), { y: -H * .09, rotate: -4, duration: .7, ease: "sine.inOut" }, .6)
      /* flap swings open and drops behind the letter */
      .to(q(".we-flap"), { rotateX: 180, duration: .85, ease: "power3.inOut" }, .2)
      .set(q(".we-flap"), { zIndex: 1 }, .58)
      /* envelope settles with a small bounce */
      .to(env, { y: 8, duration: .25, ease: "power2.out" }, .5).to(env, { y: 0, duration: .9, ease: "elastic.out(1,.45)" }, .75)
      /* letter slides up out of the pocket */
      .to(card, { y: 0, duration: 1.2, ease: "expo.out" }, .7)
      .fromTo(card, { rotate: -1.2 }, { rotate: 0, duration: 1.2, ease: "elastic.out(1,.5)" }, .7)
      /* text arrives line by line */
      .fromTo(q(".we-in > *"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .06, duration: .8 }, 1.3)
      /* the kiss drifts down and presses onto the envelope, above the name */
      .to(q(".we-seal"), { y: drop, scale: .8, rotate: -6, duration: .95, ease: "power2.inOut" }, 1.35)
      .to(q(".we-seal"), { scaleX: .92, scaleY: .66, duration: .08, ease: "power1.out" }, 2.3)
      .to(q(".we-seal"), { scaleX: .8, scaleY: .8, duration: .7, ease: "elastic.out(1,.4)" }, 2.38)
      .fromTo(q(".we-ring"), { scale: .5, opacity: .45 }, { scale: 2, opacity: 0, duration: 1, ease: "expo.out" }, 2.3);
    /* a few tiny kisses rise from where it lands */
    q(".we-burst img").slice(0, 5).forEach((k, i) => {
      const side = i % 2 ? 1 : -1;
      t.fromTo(k, { x: 0, y: 0, scale: .2, opacity: 0, rotate: 0 },
        { keyframes: [
          { opacity: .9, scale: .35 + Math.random() * .25, x: side * (14 + i * 10), y: -H * (.18 + Math.random() * .1), rotate: side * 18, duration: .6, ease: "power2.out" },
          { opacity: 0, x: side * (30 + i * 16), y: -H * (.4 + Math.random() * .15), rotate: side * 40, duration: .9, ease: "power1.in" },
        ] }, 2.32 + i * .05);
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
    gsap.set(q(".we-in > *"), { opacity: 0 }); gsap.set(q(".we-seal"), { y: 0, x: 0 });
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
    const email = String(new FormData(e.currentTarget as HTMLFormElement).get("email") || "");
    fetch("/api/subscribe/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "welcome" }) }).catch(() => {});
    if (root.current && !reduce()) {
      const q = gsap.utils.selector(root.current);
      gsap.fromTo(q(".we-done > *"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .07, duration: .7, ease: "expo.out" });
      gsap.fromTo(q(".we-seal"), { scale: .8 }, { scale: .95, duration: .18, yoyo: true, repeat: 1, ease: "power2.out" });
      q(".we-burst img").forEach((k, i) => gsap.fromTo(k, { x: 0, y: 0, opacity: 0, scale: .2 }, { opacity: .9, scale: .45, x: (i % 2 ? 1 : -1) * (20 + i * 12), y: -90 - i * 14, rotate: (i % 2 ? 1 : -1) * 35, duration: 1.1, ease: "power2.out", delay: i * .04, onComplete: () => { gsap.to(k, { opacity: 0, duration: .4 }); } }));
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
                {!done ? (
                  <div className="we-in">
                    <span className="we-k">A kiss from LENO WEAR</span>
                    <h2 id="we-t">Your welcome <em>gift</em></h2>
                    <p className="we-off"><b>{s.cfg.welcomePct}% off</b> your first order</p>
                    <form className="we-f" onSubmit={claim}>
                      <input name="email" type="email" required placeholder="Your email address" aria-label="Your email address" autoComplete="email" />
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
            <span className="we-ring" aria-hidden="true" />
            <div className="we-burst" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <img key={i} src={KISS()} alt="" />)}</div>
          </div>
          <span className="we-hint">{stage === "closed" ? "Tap the kiss to open" : ""}</span>
        </div>
      </div>
    </div>
  );
}
