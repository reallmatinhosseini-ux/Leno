/* LENO WEAR · v9 home page. Every section has one job. */
(function(){
"use strict";
var L = window.LENO, V = L.V, $ = L.$, $$ = L.$$, G = L.G, RM = L.reduce;
var desk = function(){ return window.innerWidth > 900; };

function reveals(root){
  if (!G || RM || !window.ScrollTrigger) return;
  $$("[data-rise]", root).forEach(function(h){ var ch = L.split(h); gsap.from(ch, {yPercent:110, duration:1.1, ease:"expo.out", stagger:.018, scrollTrigger:{trigger:h, start:"top 88%"}}); });
  $$("[data-fade]", root).forEach(function(el){ gsap.from(el, {y:30, opacity:0, duration:1, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 92%"}}); });
  $$("[data-reveal]", root).forEach(function(el){
    gsap.fromTo(el, {clipPath:"inset(12% 6% 12% 6%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:1.4, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 90%"}});
    var im = $("img", el); if (im) gsap.fromTo(im, {scale:1.18}, {scale:1, duration:1.8, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 90%"}});
  });
}
function dragScroll(el){
  var down = null, vel = 0, moved = 0, raf;
  el.addEventListener("pointerdown", function(e){ if (e.pointerType !== "mouse" || e.target.closest("button")) return; down = {x:e.clientX, s:el.scrollLeft}; moved = 0; vel = 0; cancelAnimationFrame(raf); el.classList.add("drag"); });
  var mv = function(e){ if (!down) return; var dx = e.clientX - down.x; moved = Math.max(moved, Math.abs(dx)); var p = el.scrollLeft; el.scrollLeft = down.s - dx; vel = el.scrollLeft - p; };
  var up = function(){ if (!down) return; down = null; el.classList.remove("drag"); (function glide(){ vel *= .94; el.scrollLeft += vel; if (Math.abs(vel) > .4) raf = requestAnimationFrame(glide); })(); };
  window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  el.addEventListener("click", function(e){ if (moved > 6){ e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
  return function(){ window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
}

var COLS = [["h-pleat-white","knot-sand-2","h-set-white"], ["h-knot-navy","pleat-blue-2","h-tulle-ivory"], ["set-navy-3","pleat-white-1","knot-navy-3"]];
var LOOK = ["knot-navy","pleat-blue","tulle-ivory"];
var TABS = [["all","All"],["dresses","Dresses"],["sets","Sets"],["navy","Navy"],["light","Light"]];

V.home = function(){
  var last = [];
  L.P.forEach(function(p){ var zs = L.SIZES.filter(function(z){ return p.stock[z] === 1; }); if (zs.length) last.push({p:p, zs:zs}); });
  var cats = [["#dresses","Dresses","pleat-white-3"],["#sets","Sets","set-navy-3"],["#navy-edit","The Navy Edit","knot-navy-2"],["#light-edit","The Light Edit","tulle-ivory-1"]];

  var html =
  /* 1 · HERO: one message, one action */
  '<section class="hx" id="hx">' +
    '<div class="hx-cols">' + COLS.map(function(c, ci){ return '<div class="hx-col"><div class="sl"><img src="' + L.img(c[0]) + '" alt="" ' + (ci === 0 ? 'fetchpriority="high"' : 'loading="eager"') + ' draggable="false"></div></div>'; }).join("") + '</div>' +
    '<div class="hx-shade"></div>' +
    '<div class="hx-txt">' +
      '<div class="hx-l"><span class="hx-k mono">Court 01</span>' +
        '<h1 class="H hx-h"><span class="ln">Leave your</span><span class="ln"><em>mark.</em></span></h1>' +
        '<div class="hx-cta"><a class="btn red" href="#shop" data-mag>Shop the collection</a></div></div>' +
      '<div class="hx-r"><button type="button" class="look-pill" id="hxLook"><i></i>Shop this look</button>' +
        '<div class="hx-dots">' + [0,1,2].map(function(i){ return '<button type="button" data-hx="' + i + '" class="' + (i ? "" : "on") + '" aria-label="Look ' + (i + 1) + '"><b></b></button>'; }).join("") + '</div></div>' +
    '</div>' +
  '</section>' +

  /* 2 · CATEGORIES: the fastest route into the shop */
  '<section class="g cat2"><div class="w cat2-grid" id="cats">' + cats.map(function(c, i){
    return '<a class="c2' + (i < 2 ? " big" : "") + '" href="' + c[0] + '" data-cursor="Shop"><div class="c2-m" data-reveal><img src="' + L.img(c[2]) + '" alt="" loading="lazy"></div><div class="c2-t"><span>' + c[1] + '</span><i>' + L.I.arrow + '</i></div></a>'; }).join("") +
  '</div></section>' +

  /* 3 · SHOP GRID */
  '<section class="g shop-sec"><div class="w"><div class="sh-hd"><h2 class="H" data-rise>New <em>season</em></h2>' +
    '<div class="tabs" id="tabs">' + TABS.map(function(tb, i){ return '<button type="button" data-tab="' + tb[0] + '" class="' + (i ? "" : "on") + '">' + tb[1] + '</button>'; }).join("") + '</div></div>' +
    '<div class="grid g4" id="rail">' + L.P.map(function(p){ return L.card(p); }).join("") + '</div>' +
    '<div class="shop-more"><a class="ulink mono" href="#shop">View all pieces →</a></div></div></section>' +

  /* 4 · SIGNATURE STORY (one editorial moment) */
  '<section class="chap" id="chap"><div class="g"><div class="w chap-in">' +
    '<div class="chap-media" data-cursor="View" data-href="#p-pleat-white"><button type="button" class="hs" data-qv="pleat-white" style="left:50%;top:60%" aria-label="Shop the Pleat Dress"><span>The Pleat Dress · ' + L.money(365) + '</span></button>' +
      '<div class="fr"><img src="' + L.img("h-pleat-white") + '" alt="Pleat Dress, front"></div><div class="fr f2"><img src="' + L.img("pleat-white-1") + '" alt="Pleat Dress, in motion"></div><div class="fr f3"><img src="' + L.img("pleat-white-4") + '" alt="Pleat Dress, open back"></div></div>' +
    '<div class="chap-txt"><span class="mono" style="color:var(--cream)">The signature</span><h2 class="H" data-rise>The Pleat <em>Dress</em></h2>' +
      '<div class="chap-steps"><div class="chap-step s1"><p>Knife pleats that move with every step.</p></div><div class="chap-step s2"><p>A V-shaped waist that lengthens the line.</p></div><div class="chap-step s3"><p>An open back, held by a single band.</p></div></div>' +
      '<div class="chap-bar"><i></i></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn light" href="#p-pleat-white" data-mag>Shop white</a><a class="btn line light" href="#p-pleat-blue">Shop blue</a></div></div>' +
  '</div></div></section>' +

  /* 5 · LAST PIECES (true scarcity from the stock sheet) */
  (last.length ? '<section class="ag" id="ag"><div class="g"><div class="w sh-hd"><h2 class="H" data-rise>Last <em>pieces</em></h2><span class="mono mute">One left in these sizes</span></div></div>' +
    '<div class="ag-track" id="agt">' + last.map(function(x){ var s = L.st(x.p);
      return '<article class="ag-card"><div class="ag-m" data-href="#p-' + x.p.id + '" data-cursor="View"><img src="' + L.img(x.p.im[0]) + '" alt="' + s.en + ' in ' + x.p.c.en + '" loading="lazy" draggable="false"><span class="ag-badge">Last one · ' + x.zs.join(" · ") + '</span></div>' +
        '<div class="ag-i"><div><b>' + s.en + '</b><span class="mute">' + x.p.c.en + '</span></div><span>' + L.money(s.price) + '</span></div>' +
        '<div class="ag-btns">' + x.zs.map(function(z){ return '<button type="button" class="btn ag-add" data-agadd="' + x.p.id + '" data-size="' + z + '">Add ' + z + '</button>'; }).join("") + '</div></article>'; }).join("") +
    '</div></section>' : "") +

  /* 6 · EDITION */
  '<section class="edition"><div class="g"><div class="w ed-in">' +
    '<div class="ed-media" data-href="#p-tulle-ivory" data-cursor="View"><img id="edimg" src="' + L.img("tulle-ivory-lips") + '" alt="The Tulle Dress in Ivory, with the LENO WEAR kiss"></div>' +
    '<div class="ed-txt"><span class="ed-stock mono"><i></i>Edition · 1 piece left</span><h2 class="H" data-rise>The Tulle <em>Dress</em></h2><p>Ivory tulle over a racer-back bodice.</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn red" href="#p-tulle-ivory">Shop the last one</a></div></div>' +
  '</div></div></section>' +

  /* 7 · TRUST */
  '<section class="g trust"><div class="w trust-in">' +
    [["truck","Same-day delivery","In Dubai, order by 2 pm"],["return","Free 14-day returns","Collected from your door"],["card","Pay your way","Apple Pay, cards, Tabby, Tamara"],["chat","Personal styling","WhatsApp, 10 am to 10 pm"]].map(function(t){ return '<div data-fade>' + L.ICON(t[0]) + '<b>' + t[1] + '</b><span>' + t[2] + '</span></div>'; }).join("") +
  '</div></section>';

  return {title:"", html:html, init:function(){
    var kill = [], introDone = false, slide = 0, timer = null, gx = null, cols = $$(".hx-col");

    function setDots(i){ $$(".hx-dots button").forEach(function(b, j){ b.classList.toggle("on", j === i); }); }
    function runBar(){
      if (!G || RM) return;
      timer && timer.kill();
      $$(".hx-dots b").forEach(function(b){ gsap.set(b, {scaleX:0}); });
      timer = gsap.to($$(".hx-dots b")[slide], {scaleX:1, duration:6, ease:"none", onComplete:function(){ go((slide + 1) % 3); }});
    }
    function go(i){
      if (i === slide) return;
      slide = i; setDots(i);
      cols.forEach(function(col, ci){
        var cur = $(".sl", col), nx = document.createElement("div"); nx.className = "sl";
        nx.innerHTML = '<img src="' + L.img(COLS[ci][i]) + '" alt="" draggable="false">';
        col.appendChild(nx);
        if (G && !RM){
          gsap.fromTo(nx, {clipPath:"inset(100% 0% 0% 0%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:1.3, ease:"expo.inOut", delay:ci * .1});
          gsap.fromTo($("img", nx), {scale:1.25}, {scale:1, duration:1.9, ease:"expo.out", delay:ci * .1});
          gsap.to($("img", cur), {scale:.94, yPercent:-5, duration:1.3, ease:"expo.inOut", delay:ci * .1, onComplete:function(){ if (cur.parentNode) cur.parentNode.removeChild(cur); }});
        } else if (cur.parentNode) cur.parentNode.removeChild(cur);
      });
      runBar();
    }
    $$(".hx-dots button").forEach(function(b){ b.addEventListener("click", function(){ go(+b.getAttribute("data-hx")); }); });
    $("#hxLook").addEventListener("click", function(e){ e.stopPropagation(); L.quick(LOOK[slide]); });
    kill.push(function(){ timer && timer.kill(); });
    COLS.forEach(function(c){ c.slice(1).forEach(function(n){ var im = new Image(); im.src = L.img(n); }); });

    /* tabs filter the grid with a smooth re-layout */
    var rail = $("#rail");
    $("#tabs").addEventListener("click", function(e){
      var b = e.target.closest("[data-tab]"); if (!b || b.classList.contains("on")) return;
      var tab = b.getAttribute("data-tab");
      $$("#tabs button").forEach(function(x){ x.classList.toggle("on", x === b); });
      var show = function(p){ return tab === "all" || (tab === "dresses" && L.st(p).cat === "dresses") || (tab === "sets" && L.st(p).cat === "sets") || p.edit === tab; };
      var cards = $$(".card", rail), state = G && window.Flip && !RM ? Flip.getState(cards) : null;
      cards.forEach(function(c){ c.style.display = show(L.byId(c.getAttribute("data-id"))) ? "" : "none"; });
      if (state) Flip.from(state, {duration:.7, ease:"expo.inOut", absolute:true, scale:true,
        onEnter:function(els){ return gsap.fromTo(els, {opacity:0, y:30}, {opacity:1, y:0, duration:.6, ease:"expo.out"}); },
        onLeave:function(els){ return gsap.to(els, {opacity:0, duration:.3}); }});
    });

    var agt = $("#agt");
    if (agt){
      kill.push(dragScroll(agt));
      agt.addEventListener("click", function(e){ var b = e.target.closest("[data-agadd]"); if (!b) return; e.stopPropagation();
        if (L.add(b.getAttribute("data-agadd"), b.getAttribute("data-size"), $("img", b.closest(".ag-card")))){ b.textContent = "Added ✓"; b.disabled = true; } });
    }

    if (G && !RM && window.ScrollTrigger){
      gx = gsap.context(function(){
        if (!introDone){ gsap.set(".hx-col", {clipPath:"inset(100% 0% 0% 0%)"}); gsap.set(".hx-l > *:not(h1), .hx-r > *", {opacity:0, y:24}); }
        cols.forEach(function(c, i){ gsap.to(c, {yPercent:[8, 15, 5][i], ease:"none", scrollTrigger:{trigger:"#hx", start:"top top", end:"bottom top", scrub:true}}); });
        gsap.to(".hx-txt", {yPercent:-25, opacity:0, ease:"none", scrollTrigger:{trigger:"#hx", start:"25% top", end:"80% top", scrub:true}});
        gsap.from("#rail .card", {y:70, opacity:0, stagger:.06, duration:1.1, ease:"expo.out", clearProps:"transform,opacity", scrollTrigger:{trigger:"#rail", start:"top 90%"}});
        if (desk()){
          gsap.set(".chap-media .f2, .chap-media .f3", {clipPath:"inset(100% 0% 0% 0%)"});
          var tl = gsap.timeline({scrollTrigger:{trigger:"#chap", start:"top top", end:"+=200%", pin:true, scrub:1}});
          tl.to(".chap-media .f2", {clipPath:"inset(0% 0% 0% 0%)", duration:1, ease:"none"})
            .from(".chap-media .f2 img", {scale:1.3, duration:1, ease:"none"}, "<")
            .to(".chap-step.s1", {opacity:0, y:-24, duration:.4}, "<.1").fromTo(".chap-step.s2", {opacity:0, y:24}, {opacity:1, y:0, duration:.4}, ">-.1")
            .to(".chap-bar i", {scaleX:.66, duration:1, ease:"none"}, "<-.5")
            .to(".chap-media .f3", {clipPath:"inset(0% 0% 0% 0%)", duration:1, ease:"none"})
            .from(".chap-media .f3 img", {scale:1.3, duration:1, ease:"none"}, "<")
            .to(".chap-step.s2", {opacity:0, y:-24, duration:.4}, "<.1").fromTo(".chap-step.s3", {opacity:0, y:24}, {opacity:1, y:0, duration:.4}, ">-.1")
            .to(".chap-bar i", {scaleX:1, duration:1, ease:"none"}, "<-.5");
        }
        if ($("#ag")) gsap.from(".ag-card", {x:120, opacity:0, stagger:.07, duration:1.2, ease:"expo.out", scrollTrigger:{trigger:"#ag", start:"top 78%"}});
        gsap.fromTo("#edimg", {yPercent:-6}, {yPercent:6, ease:"none", scrollTrigger:{trigger:".edition", start:"top bottom", end:"bottom top", scrub:true}});
        gsap.from(".ed-media", {clipPath:"inset(0% 0% 100% 0%)", duration:1.5, ease:"expo.inOut", scrollTrigger:{trigger:".edition", start:"top 75%"}});
        reveals(document);
      });
      kill.push(function(){ gx.revert(); });
    }

    function intro(){
      if (introDone) return; introDone = true;
      if (!G || RM) return;
      var ch = [];
      $$(".hx-h .ln").forEach(function(el){ ch = ch.concat(L.split(el)); });
      gsap.to(".hx-col", {clipPath:"inset(0% 0% 0% 0%)", duration:1.4, ease:"expo.inOut", stagger:.1});
      gsap.fromTo(".hx-col img", {scale:1.3}, {scale:1, duration:2, ease:"expo.out", stagger:.1});
      gsap.from(ch, {yPercent:115, duration:1.3, ease:"expo.out", stagger:.03, delay:.4});
      gsap.to(".hx-l > *:not(h1), .hx-r > *", {opacity:1, y:0, duration:1, ease:"expo.out", stagger:.07, delay:.85, onComplete:runBar});
    }
    if (!G || RM) runBar();
    return {cleanup:function(){ kill.forEach(function(f){ try { f(); } catch(e){} }); }, intro:intro, enter:function(){ if (L.loaded) intro(); }};
  }};
};

/* ---------------- line icons ---------------- */
L.ICON = function(n){
  var p = {
    truck:'<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
    return:'<path d="M9 7 5 11l4 4"/><path d="M5 11h9a5 5 0 0 1 0 10h-3"/>',
    card:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
    chat:'<path d="M4 18l1.4-3.6A7.5 7.5 0 1 1 8 17.2z"/>',
    lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    ruler:'<path d="M3 15 15 3l6 6L9 21z"/><path d="M7 11l2 2M10 8l2 2M13 5l2 2"/>'
  }[n] || "";
  return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
};

/* ---------------- welcome offer: a quiet corner card, never a blocking pop-up ---------------- */
L.promo = null;
try { L.promo = localStorage.getItem("leno-promo"); } catch(e){}
L.disc = function(){ return L.promo ? Math.round(L.bagTotal() * .10) : 0; };
L.claim = function(){ L.promo = "LENO10"; try { localStorage.setItem("leno-promo", "LENO10"); } catch(e){} L.renderBag(); };
var offer = null;
function closeOffer(snooze){
  if (!offer) return;
  if (snooze) try { localStorage.setItem("leno-offer-snooze", String(Date.now())); } catch(e){}
  var o = offer; offer = null;
  if (G && !RM) gsap.to(o, {y:40, opacity:0, duration:.4, ease:"power2.in", onComplete:function(){ o.parentNode && o.parentNode.removeChild(o); }}); else o.parentNode && o.parentNode.removeChild(o);
}
L.welcome = function(force){
  if (L.promo || offer) return;
  if (!force){
    var sn = 0; try { sn = +localStorage.getItem("leno-offer-snooze") || 0; } catch(e){}
    if (Date.now() - sn < 7 * 864e5) return;
    if (L.route && (L.route.name === "checkout" || L.route.name === "confirmed")) return;
  }
  offer = document.createElement("aside"); offer.className = "offer"; offer.setAttribute("aria-label", "Welcome offer");
  offer.innerHTML = '<button type="button" class="ox" aria-label="Close">' + L.I.close + '</button>' +
    '<div class="of-top"><span class="kiss-m"></span><div><b>10% off your first order</b><span>Join First Serve for early access to every drop.</span></div></div>' +
    '<form class="field lt" id="ofForm"><input type="email" placeholder="Your email" aria-label="Your email" required><button class="btn red" type="submit">Join</button></form>';
  document.body.appendChild(offer);
  if (G && !RM) gsap.fromTo(offer, {y:60, opacity:0}, {y:0, opacity:1, duration:.8, ease:"expo.out"});
  $(".ox", offer).addEventListener("click", function(){ closeOffer(true); });
  $("#ofForm", offer).addEventListener("submit", function(e){
    e.preventDefault(); L.claim();
    $("#ofForm", offer).outerHTML = '<p class="of-done">Code <b>LENO10</b> is saved to your bag. Welcome to LENO WEAR.</p>';
    L.toast("10% welcome offer saved to your bag");
    setTimeout(function(){ closeOffer(false); }, 4200);
  });
};
/* show once the visitor has engaged: 20 seconds in, or halfway down a page */
var armed = false;
function arm(){ if (armed) return; armed = true; L.welcome(); }
setTimeout(function(){ if (L.loaded) arm(); }, 20000);
window.addEventListener("scroll", function(){ if (!armed && L.loaded && scrollY > (document.documentElement.scrollHeight - innerHeight) * .5 && scrollY > 900) arm(); }, {passive:true});
})();
