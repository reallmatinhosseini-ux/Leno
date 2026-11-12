/* LENO WEAR · v7 home page (red / cream / black). Replaces V.home. */
(function(){
"use strict";
var L = window.LENO, V = L.V, $ = L.$, $$ = L.$$, G = L.G, RM = L.reduce;
var desk = function(){ return window.innerWidth > 900; };
var K = function(cls){ return '<span class="kiss-m ' + (cls || "") + '" aria-hidden="true"></span>'; };

function reveals(root){
  if (!G || RM || !window.ScrollTrigger) return;
  $$("[data-rise]", root).forEach(function(h){ var ch = L.split(h); gsap.from(ch, {yPercent:110, duration:1.2, ease:"expo.out", stagger:.02, scrollTrigger:{trigger:h, start:"top 88%"}}); });
  $$("[data-fade]", root).forEach(function(el){ gsap.from(el, {y:40, opacity:0, duration:1.1, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 90%"}}); });
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

/* hero columns: each column cycles through its own photos */
var COLS = [["h-pleat-white","knot-sand-2","h-set-white"], ["h-knot-navy","pleat-blue-2","h-tulle-ivory"], ["set-navy-3","pleat-white-1","knot-navy-3"]];
var LOOK = ["knot-navy","pleat-blue","tulle-ivory"];
var TABS = [["all","All"],["dresses","Dresses"],["sets","Sets"],["navy","Navy edit"],["light","Light edit"]];

V.home = function(){
  var lineup = ["pleat","knot","set","tulle"].map(function(k, i){
    var ps = L.P.filter(function(p){ return p.s === k; }), st = L.STYLES[k];
    return '<div class="lrow" data-href="#p-' + ps[0].id + '" data-img="' + ps[0].im[0] + '" role="link" tabindex="0"><span class="mono mute">0' + (i + 1) + '</span><span class="H">' + st.en + '</span><span class="verb">' + st.verb.en + '.</span>' +
      '<span class="dots">' + ps.map(function(p){ return '<i style="background:' + p.hex + '"></i>'; }).join("") + '</span><span class="arr">' + L.I.arrow + '</span></div>';
  }).join("");
  var marqWords = ["Leave your mark","Court 01","Padel","Tennis","Studio","Dubai"];
  var mq = marqWords.map(function(w, i){ return (i % 2 ? "<em>" + w + "</em>" : "<span>" + w + "</span>") + K(); }).join("");
  var last = [];
  L.P.forEach(function(p){ var zs = L.SIZES.filter(function(z){ return p.stock[z] === 1; }); if (zs.length) last.push({p:p, zs:zs}); });
  var cylIm = [["set-navy-1","set-navy"],["set-white-1","set-white"],["set-navy-3","set-navy"],["set-white-3","set-white"],["set-navy-2","set-navy"],["set-white-4","set-white"],["set-navy-5","set-navy"],["set-white-2","set-white"]];

  var html =
  /* HERO */
  '<section class="hx" id="hx">' +
    '<div class="hx-cols">' + COLS.map(function(c, ci){ return '<div class="hx-col" data-c="' + ci + '"><div class="sl"><img src="' + L.img(c[0]) + '" alt="" ' + (ci === 0 ? 'fetchpriority="high"' : "") + ' draggable="false"></div></div>'; }).join("") + '</div>' +
    '<div class="hx-shade"></div>' +
    '<div class="hx-txt">' +
      '<div class="hx-l"><span class="hx-k mono">Court 01 · New season</span>' +
        '<h1 class="H hx-h"><span class="ln">Leave your</span><span class="ln"><em>mark.</em></span></h1>' +
        '<p class="hx-p">Court-wear made in Dubai, for padel, tennis and everything after.</p>' +
        '<div class="hx-cta"><a class="btn red" href="#shop" data-mag>Shop Court 01</a><a class="btn line light" href="#dresses">Shop dresses</a></div></div>' +
      '<div class="hx-r"><button type="button" class="look-pill" id="hxLook"><i></i>Shop this look</button><span class="hx-count" id="hxN">01 / 03</span>' +
        '<div class="hx-dots">' + [0,1,2].map(function(i){ return '<button type="button" data-hx="' + i + '" class="' + (i ? "" : "on") + '" aria-label="Look ' + (i + 1) + '"><b></b></button>'; }).join("") + '</div></div>' +
    '</div>' +
  '</section>' +
  /* MARQUEE */
  '<div class="marq red" aria-hidden="true"><div class="t" id="mq">' + mq + mq + mq + mq + '</div></div>' +
  /* NEW IN RAIL */
  '<section class="rail-sec"><div class="g"><div class="w rail-hd"><div><div class="kick mono">Court 01</div><h2 class="H" data-rise>New <em>in</em></h2></div>' +
    '<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div class="tabs" id="tabs">' + TABS.map(function(tb, i){ return '<button type="button" data-tab="' + tb[0] + '" class="' + (i ? "" : "on") + '">' + tb[1] + '</button>'; }).join("") + '</div>' +
    '<div class="arrows"><button type="button" data-rail="-1" aria-label="Previous">' + L.I.arrow.replace("<svg", '<svg style="transform:scaleX(-1)"') + '</button><button type="button" data-rail="1" aria-label="Next">' + L.I.arrow + '</button></div></div></div></div>' +
    '<div class="rail" id="rail">' + L.P.map(function(p){ return L.card(p); }).join("") + '</div></section>' +
  /* CATEGORIES + PROMISES */
  '<section class="g"><div class="w cats" id="cats" style="padding-top:70px">' +
    [["#dresses","Dresses","5 colourways","pleat-white-3"],["#sets","Sets","2 colourways","set-navy-3"],["#navy-edit","Navy Edit","3 pieces","knot-navy-2"],["#light-edit","Light Edit","4 pieces","tulle-ivory-1"]].map(function(c){
      return '<a class="cat" href="' + c[0] + '" data-cursor="Shop"><div class="cat-m"><img src="' + L.img(c[3]) + '" alt="" loading="lazy"></div><div class="cat-t"><span class="H">' + c[1] + '</span><span class="mono mute">' + c[2] + '</span></div></a>'; }).join("") +
  '</div></section>' +
  '<section class="g"><div class="w svc svc-top"><div data-fade><b>Same-day Dubai</b><span>Order by 2 pm</span></div><div data-fade><b>Free returns</b><span>14 days, collected from you</span></div><div data-fade><b>Tabby · Tamara</b><span>4 interest-free payments</span></div><div data-fade><b>WhatsApp styling</b><span>Real people, 10am to 10pm</span></div></div></section>' +
  /* RED CHAPTER */
  '<section class="chap" id="chap" style="margin-top:120px"><div class="g"><div class="w chap-in">' +
    '<div class="chap-media" data-cursor="View" data-href="#p-pleat-white"><button type="button" class="hs" data-qv="pleat-white" style="left:50%;top:60%" aria-label="Shop the Pleat Dress"><span>Shop the Pleat Dress</span></button><span class="tag">The Pleat Dress · Court 01</span>' +
      '<div class="fr"><img src="' + L.img("h-pleat-white") + '" alt="Pleat Dress, front"></div><div class="fr f2"><img src="' + L.img("pleat-white-1") + '" alt="Pleat Dress, twirl"></div><div class="fr f3"><img src="' + L.img("pleat-white-4") + '" alt="Pleat Dress, open back"></div></div>' +
    '<div class="chap-txt"><div class="kick mono" style="color:var(--cream)">The signature</div><h2 class="H" data-rise>The open <em>back</em></h2>' +
      '<div class="chap-steps"><div class="chap-step s1"><b>01</b><h3 class="H" style="font-size:38px">Knife pleats</h3><p>Pleats that swing with every step, on court and off it.</p></div><div class="chap-step s2"><b>02</b><h3 class="H" style="font-size:38px">The V waist</h3><p>The front waist dips into a V that lengthens the whole line.</p></div><div class="chap-step s3"><b>03</b><h3 class="H" style="font-size:38px">Cut wide open</h3><p>The back opens wide and is held in place by a single band.</p></div></div>' +
      '<div class="chap-bar"><i></i></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn light" href="#p-pleat-white" data-mag>Shop white</a><a class="btn line light" href="#p-pleat-blue">Shop blue</a></div></div>' +
  '</div></div></section>' +
  /* LINEUP */
  '<section class="g"><div class="w"><div class="shead"><div><div class="kick mono">Shop by style</div><h2 class="H" data-rise>Four <em>styles</em></h2></div><p data-fade>Each style is built around one movement.</p></div><div class="lineup" id="lineup">' + lineup + '</div></div></section>' +
  '<div class="lfloat" id="lfloat"><img id="lf1" alt=""><img id="lf2" alt="" style="opacity:0"></div>' +
  /* DUO */
  '<section class="duo" id="duo" data-cursor="Drag" style="margin-top:130px">' +
    '<div class="layer light">' + ["pleat-white-3","tulle-ivory-1","set-white-3"].map(function(n){ return '<img src="' + L.img(n) + '" alt="">'; }).join("") + '</div>' +
    '<div class="layer navy" id="duoNavy">' + ["knot-navy-2","set-navy-3","pleat-blue-2"].map(function(n){ return '<img src="' + L.img(n) + '" alt="">'; }).join("") + '</div>' +
    '<div class="shade"></div>' +
    '<div class="lab l"><span class="H">Navy <em>hours</em></span><a class="btn red" href="#navy-edit">Navy edit</a></div>' +
    '<div class="lab r"><span class="H" style="color:#fff">Light <em>hours</em></span><a class="btn" href="#light-edit">Light edit</a></div>' +
    '<div class="hdl" id="duoH"><span>⇆</span></div><input type="range" id="duoR" min="0" max="100" value="50" aria-label="Compare Navy and Light edits">' +
  '</section>' +
  /* MANIFESTO */
  '<section class="mf" id="mf"><div class="g"><div class="w mf-in"><span class="mono">The LENO WEAR promise</span>' +
    '<p class="mf-t" id="mft">Made in small runs. Built to move on court. Cut to be seen off it. Wear it hard and <em>leave your mark.</em></p>' + K("mf-kiss") + '</div></div></section>' +
  /* CYLINDER */
  '<section class="cyl-sec" id="cylsec"><div class="cyl-stage"><div class="cyl" id="cyl">' + cylIm.map(function(c, i){ return '<div class="cc" data-href="#p-' + c[1] + '" data-cursor="View"><img src="' + L.img(c[0]) + '" alt=""><span>0' + (i % 4 + 1) + '</span></div>'; }).join("") + '</div>' +
    '<div class="cyl-txt"><div><span class="mono">The Studio Set · Navy and White</span><h2 class="H">Four ways to <em>wear it</em></h2><a class="btn red" href="#sets" data-mag>Shop the set</a></div></div></div></section>' +
  /* LAST ONES */
  '<section class="ag" id="ag"><div class="g"><div class="w ag-head"><div><div class="kick mono">Live stock</div><h2 class="H" data-rise>Last <em>ones</em></h2></div>' +
    '<p class="mute">These sizes have a single piece left. When they go, they are gone until the next drop. <span class="ag-drag">Drag to browse →</span></p></div></div>' +
    '<div class="ag-track" id="agt">' + last.map(function(x){ var s = L.st(x.p);
      return '<article class="ag-card"><div class="ag-m" data-href="#p-' + x.p.id + '" data-cursor="View"><img src="' + L.img(x.p.im[0]) + '" alt="' + s.en + ' in ' + x.p.c.en + '" loading="lazy" draggable="false"><span class="ag-badge">Last one · ' + x.zs.join(" · ") + '</span></div>' +
        '<div class="ag-i"><div><b>' + s.en + '</b><span class="mute">' + x.p.c.en + '</span></div><span>' + L.money(s.price) + '</span></div>' +
        '<div class="ag-btns">' + x.zs.map(function(z){ return '<button type="button" class="btn ag-add" data-agadd="' + x.p.id + '" data-size="' + z + '">Add ' + z + '</button>'; }).join("") + '</div></article>'; }).join("") +
    '</div></section>' +
  /* EDITION */
  '<section class="edition" style="margin-top:120px"><div class="g"><div class="w ed-in">' +
    '<div class="ed-media" data-href="#p-tulle-ivory" data-cursor="View"><button type="button" class="hs" data-qv="tulle-ivory" style="left:52%;top:66%" aria-label="Shop the Tulle Dress"><span>Shop the Tulle Dress</span></button><img id="edimg" src="' + L.img("tulle-ivory-lips") + '" alt="The Tulle Dress in Ivory with the LENO WEAR kiss"></div>' +
    '<div class="ed-txt"><div class="ed-stock mono"><i></i>Edition · Last piece</div><h2 class="H" data-rise>The Tulle <em>Dress</em></h2><p>Ivory tulle over a racer-back bodice. One piece left in M. Join the list for the next release.</p>' +
      '<form class="field" data-form="wl"><input type="text" placeholder="Email or mobile" aria-label="Email or mobile" required><button class="btn red" type="submit">Join the list</button></form>' +
      '<a class="ulink" href="#p-tulle-ivory" style="justify-self:start">View the last one →</a></div>' +
  '</div></div></section>';

  return {title:"", html:html, init:function(){
    var kill = [], introDone = false, slide = 0, timer = null, gx = null;
    var cols = $$(".hx-col");

    /* ---- hero cycling ---- */
    function setDots(i){ $$(".hx-dots button").forEach(function(b, j){ b.classList.toggle("on", j === i); }); $("#hxN").textContent = "0" + (i + 1) + " / 03"; }
    function runBar(){
      if (!G || RM) return;
      timer && timer.kill();
      $$(".hx-dots b").forEach(function(b){ gsap.set(b, {scaleX:0}); });
      timer = gsap.to($$(".hx-dots b")[slide], {scaleX:1, duration:5.5, ease:"none", onComplete:function(){ go((slide + 1) % 3); }});
    }
    function go(i){
      if (i === slide) return;
      slide = i; setDots(i);
      cols.forEach(function(col, ci){
        var cur = $(".sl", col), nx = document.createElement("div"); nx.className = "sl";
        nx.innerHTML = '<img src="' + L.img(COLS[ci][i]) + '" alt="" draggable="false">';
        col.appendChild(nx);
        if (G && !RM){
          gsap.fromTo(nx, {clipPath:"inset(100% 0% 0% 0%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:1.25, ease:"expo.inOut", delay:ci * .12});
          gsap.fromTo($("img", nx), {scale:1.35}, {scale:1, duration:1.8, ease:"expo.out", delay:ci * .12});
          gsap.to($("img", cur), {scale:.92, yPercent:-6, duration:1.25, ease:"expo.inOut", delay:ci * .12, onComplete:function(){ if (cur.parentNode) cur.parentNode.removeChild(cur); }});
        } else if (cur.parentNode) cur.parentNode.removeChild(cur);
      });
      runBar();
    }
    $$(".hx-dots button").forEach(function(b){ b.addEventListener("click", function(){ go(+b.getAttribute("data-hx")); }); });
    $("#hxLook").addEventListener("click", function(e){ e.stopPropagation(); L.quick(LOOK[slide]); });
    kill.push(function(){ timer && timer.kill(); });
    /* preload the other hero photos */
    COLS.forEach(function(c){ c.slice(1).forEach(function(n){ var im = new Image(); im.src = L.img(n); }); });

    /* ---- rail ---- */
    var rail = $("#rail");
    kill.push(dragScroll(rail));
    $$("[data-rail]").forEach(function(b){ b.addEventListener("click", function(){ var c = $(".card", rail); rail.scrollBy({left:(+b.getAttribute("data-rail")) * ((c ? c.offsetWidth : 300) + 8) * 2, behavior:"smooth"}); }); });
    $("#tabs").addEventListener("click", function(e){
      var b = e.target.closest("[data-tab]"); if (!b) return;
      var tab = b.getAttribute("data-tab");
      $$("#tabs button").forEach(function(x){ x.classList.toggle("on", x === b); });
      var show = function(p){ return tab === "all" || (tab === "dresses" && L.st(p).cat === "dresses") || (tab === "sets" && L.st(p).cat === "sets") || p.edit === tab; };
      var cards = $$(".card", rail);
      var apply = function(){ cards.forEach(function(c){ c.style.display = show(L.byId(c.getAttribute("data-id"))) ? "" : "none"; }); rail.scrollLeft = 0; };
      if (G && !RM){ gsap.to(cards, {opacity:0, y:20, duration:.25, stagger:.02, onComplete:function(){ apply(); gsap.fromTo(cards.filter(function(c){ return c.style.display !== "none"; }), {opacity:0, y:40}, {opacity:1, y:0, duration:.8, ease:"expo.out", stagger:.06}); }}); }
      else apply();
    });

    /* ---- last ones ---- */
    var agt = $("#agt");
    kill.push(dragScroll(agt));
    agt.addEventListener("click", function(e){ var b = e.target.closest("[data-agadd]"); if (!b) return; e.stopPropagation(); var card = b.closest(".ag-card");
      if (L.add(b.getAttribute("data-agadd"), b.getAttribute("data-size"), $("img", card))){ b.textContent = "Added ✓"; b.disabled = true; } });

    /* ---- forms ---- */
    var wl = $("[data-form=wl]");
    wl.addEventListener("submit", function(e){ e.preventDefault(); wl.reset(); L.toast("You are on the list"); });

    /* ---- lineup floating photo ---- */
    var lf = $("#lfloat"); document.body.appendChild(lf); kill.push(function(){ if (lf.parentNode) lf.parentNode.removeChild(lf); });
    if (G && L.fine && !RM){
      var qx = gsap.quickTo(lf, "x", {duration:.6, ease:"power3"}), qy = gsap.quickTo(lf, "y", {duration:.6, ease:"power3"}), qr = gsap.quickTo(lf, "rotation", {duration:.8, ease:"power3"});
      var lastX = 0, on = 0, lu = $("#lineup");
      lu.addEventListener("pointermove", function(e){ qx(e.clientX + 170); qy(e.clientY); qr(Math.max(-14, Math.min(14, (e.clientX - lastX) * .6))); lastX = e.clientX; });
      $$(".lrow", lu).forEach(function(r){ r.addEventListener("pointerenter", function(){ var a = $("#lf1"), b = $("#lf2"); on ^= 1; var s = on ? b : a, h = on ? a : b; s.src = L.img(r.getAttribute("data-img")); s.style.opacity = 1; h.style.opacity = 0; gsap.to(lf, {opacity:1, scale:1, duration:.5, ease:"expo.out"}); }); });
      lu.addEventListener("pointerleave", function(){ gsap.to(lf, {opacity:0, scale:.6, duration:.4, ease:"power2.in"}); });
    }

    /* ---- duo ---- */
    var duoR = $("#duoR"), dn = $("#duoNavy"), dh = $("#duoH");
    function duo(v){ dn.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)"; dh.style.left = v + "%"; }
    duoR.addEventListener("input", function(){ duo(+duoR.value); }); duo(50);

    /* ---- cylinder ---- */
    var cyl = $("#cyl"), cc = $$(".cc", cyl);
    function cylLayout(){ var w = cyl.offsetWidth, R = Math.round((w / 2) / Math.tan(Math.PI / cc.length) + (desk() ? 60 : 30)); cc.forEach(function(c, i){ c.style.transform = "rotateY(" + (i * 360 / cc.length) + "deg) translateZ(" + R + "px)"; }); }
    cylLayout(); window.addEventListener("resize", cylLayout); kill.push(function(){ window.removeEventListener("resize", cylLayout); });

    /* ---- marquee words for manifesto ---- */
    var words = [];
    (function wrap(node){ Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if (n.nodeType === 3){ var f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(function(w){ if (!w) return; if (/^\s+$/.test(w)){ f.appendChild(document.createTextNode(w)); return; } var s = document.createElement("span"); s.className = "w"; s.textContent = w; f.appendChild(s); words.push(s); }); n.parentNode.replaceChild(f, n); }
      else if (n.nodeType === 1) wrap(n); }); })($("#mft"));

    if (G && !RM && window.ScrollTrigger){
      gx = gsap.context(function(){
        if (!introDone){ gsap.set(".hx-col", {clipPath:"inset(100% 0% 0% 0%)"}); gsap.set(".hx-l > *:not(h1), .hx-r > *", {opacity:0, y:30}); }
        /* hero parallax: columns move at different speeds, headline lifts away */
        cols.forEach(function(c, i){ gsap.to(c, {yPercent:[8, 16, 4][i], ease:"none", scrollTrigger:{trigger:"#hx", start:"top top", end:"bottom top", scrub:true}}); });
        gsap.to(".hx-txt", {yPercent:-30, opacity:0, ease:"none", scrollTrigger:{trigger:"#hx", start:"20% top", end:"80% top", scrub:true}});
        if (L.fine){
          var hx = $("#hx"), qs = cols.map(function(c){ return gsap.quickTo(c, "y", {duration:1.2, ease:"power3"}); }), qh = gsap.quickTo(".hx-h", "x", {duration:1.2, ease:"power3"});
          hx.addEventListener("pointermove", function(e){ var py = e.clientY / innerHeight - .5, px = e.clientX / innerWidth - .5; qs.forEach(function(q, i){ q(py * [-14, 18, -8][i]); }); qh(px * -30); });
        }
        /* marquee speed follows scroll velocity */
        var mq = $("#mq"), mxv = 0, vel = 0, dir = 1, half = 0;
        var measure = function(){ half = mq.scrollWidth / 2; }; measure(); setTimeout(measure, 900);
        ScrollTrigger.create({trigger:".marq", start:"top bottom", end:"bottom top", onUpdate:function(s){ vel = s.getVelocity(); dir = s.direction; }});
        var tick = function(){ vel *= .92; mxv -= (1.2 + Math.min(Math.abs(vel) * .006, 14)) * dir; if (half){ if (mxv < -half) mxv += half; if (mxv > 0) mxv -= half; }
          mq.style.transform = "translate3d(" + mxv.toFixed(1) + "px,0,0) skewX(" + Math.max(-10, Math.min(10, -vel * .003)).toFixed(2) + "deg)"; };
        gsap.ticker.add(tick); kill.push(function(){ gsap.ticker.remove(tick); });
        /* rail cards rise in */
        gsap.from("#rail .card", {y:110, opacity:0, rotateX:-20, transformPerspective:1200, stagger:.07, duration:1.3, ease:"expo.out", clearProps:"transform,opacity", scrollTrigger:{trigger:"#rail", start:"top 88%"}});
        /* categories drift */
        $$(".cat-m img").forEach(function(im){ gsap.fromTo(im, {yPercent:-6, scale:1.12}, {yPercent:6, scale:1.12, ease:"none", scrollTrigger:{trigger:im.parentNode, start:"top bottom", end:"bottom top", scrub:true}}); });
        gsap.from(".cat", {y:80, opacity:0, stagger:.08, duration:1.2, ease:"expo.out", clearProps:"transform,opacity", scrollTrigger:{trigger:"#cats", start:"top 88%"}});
        /* red chapter: pinned three-frame story */
        if (desk()){
          gsap.set(".chap-media .f2, .chap-media .f3", {clipPath:"inset(100% 0% 0% 0%)"});
          var tl = gsap.timeline({scrollTrigger:{trigger:"#chap", start:"top top", end:"+=230%", pin:true, scrub:1}});
          tl.to(".chap-media .f2", {clipPath:"inset(0% 0% 0% 0%)", duration:1, ease:"none"})
            .from(".chap-media .f2 img", {scale:1.35, duration:1, ease:"none"}, "<")
            .to(".chap-step.s1", {opacity:0, y:-30, duration:.4}, "<.1").fromTo(".chap-step.s2", {opacity:0, y:30}, {opacity:1, y:0, duration:.4}, ">-.1")
            .to(".chap-bar i", {scaleX:.66, duration:1, ease:"none"}, "<-.5")
            .to(".chap-media .f3", {clipPath:"inset(0% 0% 0% 0%)", duration:1, ease:"none"})
            .from(".chap-media .f3 img", {scale:1.35, duration:1, ease:"none"}, "<")
            .to(".chap-step.s2", {opacity:0, y:-30, duration:.4}, "<.1").fromTo(".chap-step.s3", {opacity:0, y:30}, {opacity:1, y:0, duration:.4}, ">-.1")
            .to(".chap-bar i", {scaleX:1, duration:1, ease:"none"}, "<-.5");
          gsap.from(".chap-media", {rotateY:-25, rotateX:8, scale:.85, transformPerspective:1600, ease:"none", scrollTrigger:{trigger:"#chap", start:"top bottom", end:"top top", scrub:1}});
        }
        gsap.from(".hs", {scale:0, duration:.9, ease:"back.out(2.5)", stagger:.2, scrollTrigger:{trigger:"#chap", start:"top 60%"}});
        gsap.from(".lrow", {yPercent:60, opacity:0, stagger:.08, duration:1.2, ease:"expo.out", scrollTrigger:{trigger:"#lineup", start:"top 85%"}});
        /* duo hint */
        ScrollTrigger.create({trigger:"#duo", start:"top 60%", once:true, onEnter:function(){ var o = {v:50};
          gsap.timeline().to(o, {v:18, duration:.9, ease:"power2.inOut", onUpdate:function(){ duo(o.v); duoR.value = o.v; }}).to(o, {v:82, duration:1.2, ease:"power2.inOut", onUpdate:function(){ duo(o.v); duoR.value = o.v; }}).to(o, {v:50, duration:.9, ease:"power2.inOut", onUpdate:function(){ duo(o.v); duoR.value = o.v; }}); }});
        /* manifesto: words light up, then the kiss stamps down */
        gsap.to(words, {color:function(i, el){ return el.closest("em") ? "#D71E28" : "#F4EEE4"; }, stagger:.1, ease:"none", scrollTrigger:{trigger:"#mft", start:"top 78%", end:"bottom 45%", scrub:true}});
        gsap.fromTo(".mf-kiss", {scale:3.2, rotation:-30, opacity:0}, {scale:1, rotation:-8, opacity:1, duration:.55, ease:"power4.in", scrollTrigger:{trigger:"#mft", start:"bottom 55%"},
          onComplete:function(){ gsap.fromTo(".mf-in", {x:-6}, {x:0, duration:.5, ease:"elastic.out(1,.3)"}); }});
        /* cylinder */
        if (desk()) gsap.fromTo("#cyl", {rotateY:0, rotateX:-6}, {rotateY:-315, rotateX:6, ease:"none", scrollTrigger:{trigger:"#cylsec", start:"top top", end:"+=180%", pin:true, scrub:1}});
        else gsap.fromTo("#cyl", {rotateY:40}, {rotateY:-280, ease:"none", scrollTrigger:{trigger:"#cylsec", start:"top bottom", end:"bottom top", scrub:1}});
        gsap.from(".cyl-txt .H", {scale:.6, opacity:0, ease:"none", scrollTrigger:{trigger:"#cylsec", start:"top 80%", end:"top 20%", scrub:1}});
        /* last ones */
        gsap.from(".ag-card", {x:160, opacity:0, rotateY:-25, transformPerspective:1200, stagger:.08, duration:1.4, ease:"expo.out", scrollTrigger:{trigger:"#ag", start:"top 75%"}});
        /* edition */
        gsap.fromTo("#edimg", {yPercent:-7}, {yPercent:7, ease:"none", scrollTrigger:{trigger:".edition", start:"top bottom", end:"bottom top", scrub:true}});
        gsap.from(".ed-media", {clipPath:"inset(0% 0% 100% 0%)", duration:1.6, ease:"expo.inOut", scrollTrigger:{trigger:".edition", start:"top 75%"}});
        reveals(document);
      });
      kill.push(function(){ gx.revert(); });
    }

    function intro(){
      if (introDone) return; introDone = true;
      if (!G || RM){ return; }
      var ch = [];
      $$(".hx-h .ln").forEach(function(el){ ch = ch.concat(L.split(el)); });
      gsap.to(".hx-col", {clipPath:"inset(0% 0% 0% 0%)", duration:1.5, ease:"expo.inOut", stagger:.12});
      gsap.fromTo(".hx-col img", {scale:1.4}, {scale:1, duration:2.2, ease:"expo.out", stagger:.12});
      gsap.from(ch, {yPercent:115, duration:1.4, ease:"expo.out", stagger:.035, delay:.45});
      gsap.to(".hx-l > *:not(h1), .hx-r > *", {opacity:1, y:0, duration:1.1, ease:"expo.out", stagger:.07, delay:.9, onComplete:runBar});
    }
    if (!G || RM) runBar();
    return {cleanup:function(){ kill.forEach(function(f){ try { f(); } catch(e){} }); }, intro:intro, enter:function(){ if (L.loaded) intro(); }};
  }};
};

/* ---------------- welcome gift (first visit, after a short delay) ---------------- */
function welcome(){
  var seen = false; try { seen = localStorage.getItem("leno-welcome") === "1"; } catch(e){}
  if (seen) return;
  setTimeout(function(){
    if (document.querySelector(".modal.open, .drawer.open, .srch.open, .mmenu.open") || (L.route && L.route.name === "checkout")) return;
    try { localStorage.setItem("leno-welcome", "1"); } catch(e){}
    L.openModal('<div class="wg"><div class="wg-card"><span class="kiss-m wg-stamp" id="wgk"></span><span class="mono">Sealed with a kiss</span><h3 class="H">Your welcome <em>gift</em></h3>' +
      '<span class="wg-off">10% off</span><p class="mute" style="max-width:32ch">your first order when you join First Serve: early access to every drop.</p></div>' +
      '<form class="field lt" id="wgf"><input type="text" placeholder="Email or mobile" aria-label="Email or mobile" required><button class="btn red" type="submit">Claim 10%</button></form>' +
      '<button type="button" class="later" data-mclose>Maybe later</button><span class="mute" style="font-size:11.5px">Demo: offer and code are placeholders.</span></div>', "sm");
    if (G && !RM) gsap.fromTo("#wgk", {scale:3, rotation:-35, opacity:0}, {scale:1, rotation:-8, opacity:1, duration:.5, ease:"power4.in", delay:.45, onComplete:function(){ gsap.fromTo(".wg-card", {y:-4}, {y:0, duration:.5, ease:"elastic.out(1,.3)"}); }});
    $("#wgf").addEventListener("submit", function(e){
      e.preventDefault();
      var f = $("#wgf"); f.outerHTML = '<div style="display:grid;gap:10px;justify-items:center"><span class="mono">Your code</span><span class="wg-code">LENO10</span><span class="mute" style="font-size:13px">Use it at checkout. Welcome to LENO WEAR.</span></div>';
    });
  }, 9000);
}
window.addEventListener("load", function(){ setTimeout(welcome, 0); });
})();
