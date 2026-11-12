/* LENO WEAR store: Story, Help, quick view, notify-me, recently viewed. Boots the app. */
(function(){
"use strict";
var L = window.LENO, V = L.V, $ = L.$, $$ = L.$$, t = L.t, G = L.G, RM = L.reduce;
var isDesk = function(){ return window.innerWidth > 900; };

/* ---------------- modal ---------------- */
var modal = $("#modal"), mbox = $("#mbox");
L.openModal = function(html, cls){
  L.closeAll();
  mbox.className = "mbox " + (cls || ""); mbox.innerHTML = '<button type="button" class="mx" data-mclose aria-label="Close">' + L.I.close + '</button>' + html;
  modal.classList.add("open"); document.documentElement.style.overflow = "hidden"; if (L.lenis) L.lenis.stop();
  L.syncCounts();
  if (G && !RM) gsap.fromTo(mbox, {y:60, opacity:0, rotateX:-12, transformPerspective:1200}, {y:0, opacity:1, rotateX:0, duration:.8, ease:"expo.out"});
  setTimeout(function(){ var f = $("input, button:not([data-mclose])", mbox); f && f.focus({preventScroll:true}); }, 300);
};
L.closeModal = function(){
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open"); document.documentElement.style.overflow = ""; if (L.lenis) L.lenis.start();
};
modal.addEventListener("click", function(e){ if (e.target === modal || e.target.closest("[data-mclose]")) L.closeModal(); });
document.addEventListener("keydown", function(e){ if (e.key === "Escape") L.closeModal(); });
document.addEventListener("click", function(e){ if (e.target.closest("#modal a[href^='#'], #modal [data-href]")) L.closeModal(); }, true);

/* notify me */
L.notify = function(id, size){
  var p = L.byId(id), s = L.st(p);
  var opts = L.SIZES.filter(function(z){ return !p.stock[z]; });
  L.openModal('<div class="nt"><img src="p/kiss.svg" alt="" class="nt-k"><span class="mono">Notify me</span><h3 class="H">' + s.en + '</h3>' +
    '<p class="mute">' + p.c.en + (size ? " · size " + size : "") + ' is sold out. Leave your email or mobile and we will tell you the moment it is back.</p>' +
    (size ? "" : '<div class="nt-sz">' + opts.map(function(z, i){ return '<label><input type="radio" name="ntz" value="' + z + '"' + (i ? "" : " checked") + '><span>' + z + '</span></label>'; }).join("") + '</div>') +
    '<form class="field lt" id="ntf"><input type="text" placeholder="Email or mobile" aria-label="Email or mobile" required><button class="btn" type="submit">Notify me</button></form>' +
    '<span class="mute" style="font-size:12px">Demo: nothing is sent.</span></div>', "sm");
  $("#ntf").addEventListener("submit", function(e){ e.preventDefault(); var z = size || ($("input[name=ntz]:checked") || {}).value || ""; L.closeModal(); L.toast("We will tell you when " + (z ? "size " + z : "it") + " is back"); });
};

/* quick view */
L.quick = function(id){
  var p = L.byId(id), s = L.st(p), sel = null;
  var sizes = L.SIZES.map(function(z){ var n = p.stock[z]; return '<button type="button" data-qs="' + z + '" class="' + (n ? "" : "out") + '">' + z + (n && n <= 2 ? "<small>" + n + " left</small>" : "") + '</button>'; }).join("");
  L.openModal('<div class="qvw"><div class="qv-m" data-href="#p-' + p.id + '"><img src="' + L.img(p.im[0]) + '" alt="' + s.en + '"><img class="b" src="' + L.img(p.im[1]) + '" alt=""></div>' +
    '<div class="qv-i"><span class="mono mute">' + s.code + ' · ' + t(s.cat) + '</span><h3 class="H">' + s.en + '<em>' + s.verb.en + '.</em></h3>' +
    '<div class="price"><b>' + L.money(s.price) + '</b><span class="mute"> incl. VAT</span></div><p class="mute">' + s.desc.en + '</p>' +
    '<div class="colours">' + L.sib(p).map(function(q){ return '<a href="#p-' + q.id + '" class="' + (q.id === p.id ? "on" : "") + '"><img src="' + L.img(q.im[0]) + '" alt="' + q.c.en + '"></a>'; }).join("") + '</div>' +
    '<span class="mono">Size · <span id="qsz">select</span></span><div class="szs" id="qszs">' + sizes + '</div>' +
    '<button type="button" class="btn block atb" id="qadd" style="margin-top:14px">' + (L.total(p) ? "Add to bag" : "Notify me") + '</button>' +
    '<a class="ulink" href="#p-' + p.id + '" style="justify-self:start;font-size:14px">View full details →</a></div></div>', "lg");
  $("#qszs").addEventListener("click", function(e){ var b = e.target.closest("button"); if (!b) return; var z = b.getAttribute("data-qs");
    if (!p.stock[z]){ L.notify(p.id, z); return; } sel = z; $("#qsz").textContent = z; $$("#qszs button").forEach(function(x){ x.classList.toggle("on", x === b); }); $("#qadd").textContent = "Add to bag · " + z; });
  $("#qadd").addEventListener("click", function(){
    if (!L.total(p)){ L.notify(p.id, null); return; }
    if (!sel){ L.toast("Select a size"); if (G) gsap.fromTo("#qszs", {x:-10}, {x:0, duration:.6, ease:"elastic.out(1,.3)"}); return; }
    var img = $(".qv-m img", mbox); L.closeModal(); L.add(p.id, sel, img);
  });
};
var baseCard = L.card;
L.card = function(p, cls){
  return baseCard(p, cls).replace('<div class="quick">', '<button type="button" class="qvb" data-qv="' + p.id + '">Quick view</button><div class="quick">');
};
document.addEventListener("click", function(e){ var b = e.target.closest("[data-qv]"); if (b){ e.preventDefault(); e.stopPropagation(); L.quick(b.getAttribute("data-qv")); } }, true);

/* recently viewed */
function loadR(){ try { return JSON.parse(localStorage.getItem("leno-recent")) || []; } catch(e){ return []; } }
function saveR(a){ try { localStorage.setItem("leno-recent", JSON.stringify(a)); } catch(e){} }
var baseProduct = V.product;
V.product = function(r){
  var v = baseProduct(r), rec = loadR().filter(function(id){ return id !== r.id && L.byId(id); }).slice(0, 4);
  saveR([r.id].concat(loadR().filter(function(id){ return id !== r.id; })).slice(0, 8));
  if (rec.length) v.html = v.html.replace('<div class="sticky-buy"', '<section class="g" style="padding-bottom:120px"><div class="w"><div class="shead" style="padding-top:0"><h2 class="H" data-rise style="font-size:clamp(44px,6vw,90px)">Recently viewed</h2></div><div class="grid">' + rec.map(function(id){ return L.card(L.byId(id)); }).join("") + '</div></div></section><div class="sticky-buy"');
  return v;
};

/* ---------------- STORY ---------------- */
V.story = function(){
  var ch = [
    {time:"07:00", t:"Studio", sub:"Morning hours", p:"The Studio Set zips up for the warm-up and stays on for the coffee after.", im:"set-white-3", id:"set-white", bg:"#F2EEE6", fg:"#0D0D10"},
    {time:"13:00", t:"Court", sub:"Midday hours", p:"The Pleat Dress swings through every rally. The Knot Dress ties at the hip and moves with you.", im:"pleat-blue-2", id:"pleat-blue", bg:"#E3E3E0", fg:"#0D0D10"},
    {time:"19:00", t:"City", sub:"Evening hours", p:"The Tulle Dress floats from the last game into the evening.", im:"tulle-ivory-1", id:"tulle-ivory", bg:"#0B0E1E", fg:"#F2EEE6"}
  ];
  var html =
  '<section class="st-hero g"><div class="w"><div class="kick mono">Our story</div><h1 class="H" id="sth">Made for the hours <em>around the game.</em></h1>' +
    '<div class="st-row"><p class="mute">LENO WEAR is court-wear from Dubai. Four styles in small runs, built for padel, tennis and the studio, and cut to be worn long after.</p><img src="p/kiss.svg" alt="" class="st-kiss" id="stkiss"></div></div></section>' +
  '<section class="hday" id="hday"><div class="hday-track" id="hdt">' + ch.map(function(c, i){
    return '<article class="hd" style="--bg:' + c.bg + ';--fg:' + c.fg + '"><div class="hd-in"><div class="hd-t"><span class="hd-time">' + c.time + '</span><span class="mono">' + c.sub + ' · 0' + (i + 1) + ' / 03</span><h2 class="H">' + c.t + '</h2><p>' + c.p + '</p><a class="btn' + (i === 2 ? " light" : "") + '" href="#p-' + c.id + '">Shop the look</a></div>' +
      '<div class="hd-m" data-href="#p-' + c.id + '" data-cursor="View"><img src="' + L.img(c.im) + '" alt=""></div></div></article>';
  }).join("") + '</div></section>' +
  '<section class="g"><div class="w st-words"><p class="big" id="stw">Small runs. When a size is gone, it is gone. Every piece is chosen to move on court and to look right off it. <em>The court is the runway.</em></p></div></section>' +
  '<section class="g"><div class="w st-pr">' +
    '<div data-fade><b>01</b><h3>Small runs</h3><p>Each colourway is made in a few pieces per size, so what you wear stays rare.</p></div>' +
    '<div data-fade><b>02</b><h3>Made to move</h3><p>Inner shorts, open backs, stretch and pleats: every detail is there for the game.</p></div>' +
    '<div data-fade><b>03</b><h3>Dubai first</h3><p>Same-day delivery in Dubai, WhatsApp styling and free returns across the UAE.</p></div>' +
  '</div></section>' +
  '<section class="g st-end"><div class="w"><h2 class="H" data-rise>Start with Court 01</h2><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><a class="btn" href="#shop" data-mag>Shop all</a><a class="btn line" href="#p-pleat-white">The Pleat Dress</a></div></div></section>';
  return {title:"Our story", html:html, init:function(){
    var gx = G && !RM && window.ScrollTrigger ? gsap.context(function(){
      if (isDesk()){
        var track = $("#hdt"), panels = $$(".hd", track);
        var tw = gsap.to(track, {xPercent:-100 * (panels.length - 1) / panels.length, ease:"none", scrollTrigger:{trigger:"#hday", pin:true, scrub:1, end:function(){ return "+=" + innerWidth * (panels.length - 1); }, invalidateOnRefresh:true}});
        panels.forEach(function(pn){
          var st = {trigger:pn, containerAnimation:tw, start:"left right", end:"right left", scrub:true};
          gsap.fromTo($(".hd-m", pn), {rotateY:-30, z:-200, transformPerspective:1600}, {rotateY:20, z:0, ease:"none", scrollTrigger:st});
          gsap.fromTo($(".hd-m img", pn), {xPercent:-8}, {xPercent:8, ease:"none", scrollTrigger:st});
          gsap.fromTo($(".hd-time", pn), {xPercent:30}, {xPercent:-30, ease:"none", scrollTrigger:st});
        });
      }
      var words = [];
      (function wrap(node){ Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3){ var f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(function(w){ if (!w) return; if (/^\s+$/.test(w)){ f.appendChild(document.createTextNode(w)); return; } var s = document.createElement("span"); s.className = "w"; s.textContent = w; f.appendChild(s); words.push(s); }); n.parentNode.replaceChild(f, n); }
        else if (n.nodeType === 1) wrap(n); }); })($("#stw"));
      gsap.to(words, {color:function(i, el){ return el.closest("em") ? "#D3203A" : "#0D0D10"; }, stagger:.1, ease:"none", scrollTrigger:{trigger:"#stw", start:"top 80%", end:"bottom 45%", scrub:true}});
      gsap.to("#stkiss", {rotation:25, scale:1.3, ease:"none", scrollTrigger:{trigger:".st-hero", start:"top top", end:"bottom top", scrub:true}});
    }) : null;
    return {cleanup:function(){ gx && gx.revert(); }, enter:function(){
      if (!G || RM) return;
      var ch = L.split($("#sth"));
      gsap.from(ch, {yPercent:110, duration:1.3, ease:"expo.out", stagger:.018});
      gsap.from("#stkiss", {scale:0, rotation:-60, duration:1.4, ease:"elastic.out(1,.5)", delay:.4});
      gsap.from(".st-row p", {y:30, opacity:0, duration:1, ease:"expo.out", delay:.5});
    }};
  }};
};

/* ---------------- HELP ---------------- */
V.help = function(){
  var faq = [
    ["When will my order arrive?","Orders in Dubai placed before 2 pm arrive the same day. Orders to every other emirate arrive the next day."],
    ["How much is delivery?","Next-day delivery is free across the UAE. Same-day delivery in Dubai is free on orders over AED 600 and AED 25 below that."],
    ["How do returns work?","You have 14 days to return unworn pieces with tags attached. We collect from your door and refund to your original payment method."],
    ["Which payment methods do you accept?","Apple Pay, Visa, Mastercard, Amex, Tabby and Tamara (4 interest-free payments), and cash on delivery."],
    ["How do I choose my size?","Every style comes in S, M, L and XL. A full size chart with measurements is coming soon; until then our stylists can help on WhatsApp."],
    ["A size is sold out. Will it come back?","Tap the sold-out size and choose Notify me. We will message you as soon as it is back."],
    ["Do you dress clubs and teams?","Yes. We are building team orders for padel and tennis clubs. Send us a message to join the list."]
  ];
  var html =
  '<section class="g"><div class="w"><div class="ph"><div class="kick mono">Client care</div><h1 class="H" id="hlh">How can we help?</h1></div>' +
  '<div class="hl-grid">' +
    '<div class="hl-card dark"><span class="mono">Track your order</span><h3 class="H">Where is my order?</h3><form id="trk" class="trk"><div class="inp"><input id="t-no" placeholder=" " required><label for="t-no">Order number, e.g. LW-12345</label></div><button class="btn light" type="submit">Track</button></form><div id="trkr"></div></div>' +
    '<div class="hl-card"><span class="mono">Delivery</span><div class="dtable"><div><b>Dubai</b><span>Same day, order by 2 pm</span><span>Free over AED 600</span></div><div><b>Abu Dhabi · Sharjah · Ajman</b><span>Next day</span><span>Free</span></div><div><b>Umm Al Quwain · Ras Al Khaimah · Fujairah</b><span>Next day</span><span>Free</span></div></div></div>' +
    '<div class="hl-card"><span class="mono">Returns</span><h3 class="H" style="font-size:46px">14 days, free</h3><p class="mute">Unworn, tags on. We collect from your door. Refunds go back to your original payment method.</p></div>' +
    '<div class="hl-card red"><span class="mono">Talk to a stylist</span><h3 class="H" style="font-size:46px">WhatsApp</h3><p>Real people, 10 am to 10 pm, every day. Number coming at launch.</p></div>' +
  '</div>' +
  '<div class="faq"><h2 class="H" data-rise>Questions</h2><div class="acc">' + faq.map(function(q, i){ return '<details' + (i ? "" : " open") + '><summary>' + q[0] + '<i></i></summary><div class="ab"><p>' + q[1] + '</p></div></details>'; }).join("") + '</div></div>' +
  '<p class="mute" style="font-size:12px;padding-bottom:120px">Delivery fees and return terms shown here are proposals for the demo store and will be confirmed before launch.</p>' +
  '</div></section>';
  return {title:"Help", html:html, init:function(){
    $("#trk").addEventListener("submit", function(e){
      e.preventDefault();
      var no = $("#t-no").value.trim().toUpperCase(), o = L.lastOrder, out = $("#trkr");
      if (o && o.no === no){
        out.innerHTML = '<div class="tl" style="margin-top:22px;color:var(--ivory)"><div class="on"><i></i>Confirmed</div><div><i></i>Packed</div><div><i></i>On the way</div><div><i></i>Delivered</div></div>';
      } else out.innerHTML = '<p style="margin-top:16px;color:rgba(242,238,230,.7)">We could not find ' + L.esc(no || "that order") + '. Check the number in your confirmation message. (Demo: only orders placed in this browser session can be tracked.)</p>';
      if (G && !RM) gsap.from(out.children, {y:20, opacity:0, duration:.7, ease:"expo.out"});
    });
    return {enter:function(){ if (!G || RM) return; gsap.from(L.split($("#hlh")), {yPercent:110, duration:1.2, ease:"expo.out", stagger:.02}); gsap.from(".hl-card", {y:80, opacity:0, rotateX:-15, transformPerspective:1200, stagger:.08, duration:1.2, ease:"expo.out", delay:.2, clearProps:"all"}); }};
  }};
};

/* size guide */
L.sizeGuide = function(){
  L.openModal('<div class="sg"><span class="mono">Fit &amp; size</span><h3 class="H">Size guide</h3>' +
    '<div class="sg-sz">' + L.SIZES.map(function(z){ return '<span>' + z + '</span>'; }).join("") + '</div>' +
    '<div class="sg-how"><div><b>01 · Bust</b><p class="mute">Measure around the fullest part, keeping the tape level.</p></div><div><b>02 · Waist</b><p class="mute">Measure around the narrowest part of your waist.</p></div><div><b>03 · Hips</b><p class="mute">Measure around the fullest part of your hips.</p></div></div>' +
    '<p>Every style comes in S, M, L and XL. The full measurement chart is being finalised with our supplier and will appear here before launch.</p>' +
    '<p class="mute">Between sizes? Our stylists will help you choose on WhatsApp.</p></div>', "sm");
};
document.addEventListener("click", function(e){ if (e.target.closest("[data-sizeguide]")){ e.preventDefault(); L.sizeGuide(); } });

/* ================= v6: shoppable home, honest urgency, faster buying ================= */
var baseHome = V.home;
V.home = function(r){
  var v = baseHome(r), h = v.html;
  /* 1. move the service promises up, right under the category tiles */
  var si = h.indexOf('<section class="g"><div class="w svc">');
  if (si > -1){
    var svc = h.slice(si).replace('<div class="w svc">', '<div class="w svc svc-top">');
    h = h.slice(0, si);
    var ci = h.indexOf('id="cats"'), ce = h.indexOf('</div></section>', ci);
    if (ci > -1 && ce > -1) h = h.slice(0, ce + 16) + svc + h.slice(ce + 16);
  }
  /* 2. shoppable hotspots */
  h = h.replace('<div class="hero-title"', '<button type="button" class="look-pill" id="heroLook"><i></i>Shop this look</button><div class="hero-title"');
  h = h.replace('<span class="tag">', '<button type="button" class="hs" data-qv="pleat-white" style="left:50%;top:60%" aria-label="Shop the Pleat Dress"><span>Shop the Pleat Dress</span></button><span class="tag">');
  h = h.replace('<img id="edimg"', '<button type="button" class="hs" data-qv="tulle-ivory" style="left:52%;top:66%" aria-label="Shop the Tulle Dress"><span>Shop the Tulle Dress</span></button><img id="edimg"');
  /* 3. "Last ones": every size that has exactly one piece left, straight from the stock sheet */
  var last = [];
  L.P.forEach(function(p){ var zs = L.SIZES.filter(function(z){ return p.stock[z] === 1; }); if (zs.length) last.push({p:p, zs:zs}); });
  var ag = '<section class="ag" id="ag"><div class="g"><div class="w ag-head"><div><div class="kick mono">Live stock</div><h2 class="H" data-rise>Last ones</h2></div>' +
    '<p class="mute">These sizes have a single piece left. When they go, they are gone until the next drop. <span class="ag-drag">Drag to browse →</span></p></div></div>' +
    '<div class="ag-track" id="agt">' + last.map(function(x){ var s = L.st(x.p);
      return '<article class="ag-card"><div class="ag-m" data-href="#p-' + x.p.id + '" data-cursor="View"><img src="' + L.img(x.p.im[0]) + '" alt="' + s.en + ' in ' + x.p.c.en + '" loading="lazy" draggable="false"><span class="ag-badge">Last one · ' + x.zs.join(" · ") + '</span></div>' +
        '<div class="ag-i"><div><b>' + s.en + '</b><span class="mute">' + x.p.c.en + '</span></div><span>' + L.money(s.price) + '</span></div>' +
        '<div class="ag-btns">' + x.zs.map(function(z){ return '<button type="button" class="btn ag-add" data-agadd="' + x.p.id + '" data-size="' + z + '">Add ' + z + '</button>'; }).join("") + '</div></article>'; }).join("") +
    '</div></section>';
  h = h.replace('<section class="edition"', ag + '<section class="edition"');
  v.html = h;
  var baseInit = v.init;
  v.init = function(){
    var res = baseInit() || {}, gx = null;
    $("#heroLook").addEventListener("click", function(e){ e.stopPropagation(); var id = ($("#hshop").getAttribute("href") || "#p-pleat-white").slice(3); L.quick(id); });
    /* drag-to-scroll with momentum for the Last ones track (mouse); touch scrolls natively */
    var tr = $("#agt"), down = null, vel = 0, moved = 0, raf;
    tr.addEventListener("pointerdown", function(e){ if (e.pointerType !== "mouse" || e.target.closest("button")) return; down = {x:e.clientX, s:tr.scrollLeft, t:performance.now()}; moved = 0; vel = 0; cancelAnimationFrame(raf); tr.classList.add("drag"); });
    window.addEventListener("pointermove", function(e){ if (!down) return; var dx = e.clientX - down.x; moved = Math.max(moved, Math.abs(dx)); var prev = tr.scrollLeft; tr.scrollLeft = down.s - dx; vel = tr.scrollLeft - prev; });
    var up = function(){ if (!down) return; down = null; tr.classList.remove("drag"); (function glide(){ vel *= .94; tr.scrollLeft += vel; if (Math.abs(vel) > .4) raf = requestAnimationFrame(glide); })(); };
    window.addEventListener("pointerup", up);
    tr.addEventListener("click", function(e){ if (moved > 6){ e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);
    tr.addEventListener("click", function(e){ var b = e.target.closest("[data-agadd]"); if (!b) return; e.stopPropagation(); var card = b.closest(".ag-card");
      if (L.add(b.getAttribute("data-agadd"), b.getAttribute("data-size"), $("img", card))){ b.textContent = "Added ✓"; b.disabled = true; } });
    if (G && !RM && window.ScrollTrigger){
      gx = gsap.context(function(){
        gsap.from(".ag-card", {x:160, opacity:0, rotateY:-25, transformPerspective:1200, stagger:.08, duration:1.4, ease:"expo.out", scrollTrigger:{trigger:"#ag", start:"top 75%"}});
        $$(".cat-m img").forEach(function(im){ gsap.fromTo(im, {yPercent:-6, scale:1.12}, {yPercent:6, scale:1.12, ease:"none", scrollTrigger:{trigger:im.parentNode, start:"top bottom", end:"bottom top", scrub:true}}); });
        gsap.from(".hs", {scale:0, duration:.9, ease:"back.out(2.5)", stagger:.2, scrollTrigger:{trigger:"#chap", start:"top 60%"}});
        gsap.from("#heroLook", {y:20, opacity:0, duration:1, ease:"expo.out", delay:1.6});
      });
    }
    return {cleanup:function(){ res.cleanup && res.cleanup(); gx && gx.revert(); window.removeEventListener("pointerup", up); }, intro:res.intro, enter:res.enter};
  };
  return v;
};

/* free same-day delivery nudge in the announcement bar */
var baseRenderBag = L.renderBag;
L.renderBag = function(){
  baseRenderBag();
  var ann = $("#ann"); if (!ann) return;
  var nudge = $(".nudge", ann);
  if (!L.bag.length){ if (nudge) nudge.parentNode.removeChild(nudge); return; }
  var left = Math.max(0, L.FREE - L.bagTotal());
  var txt = left ? "You are " + L.money(left) + " away from free same-day delivery" : "Free same-day delivery unlocked ✓";
  if (!nudge){ nudge = document.createElement("button"); nudge.type = "button"; nudge.className = "nudge"; nudge.setAttribute("data-open", "bag"); ann.appendChild(nudge); }
  nudge.textContent = txt; nudge.classList.toggle("ok", !left);
};

/* reading progress line */
var sp = document.createElement("div"); sp.className = "sprog"; document.body.appendChild(sp);
window.addEventListener("scroll", function(){ var m = document.documentElement.scrollHeight - innerHeight; sp.style.transform = "scaleX(" + (m > 0 ? Math.min(1, scrollY / m) : 0) + ")"; }, {passive:true});

/* checkout: on phones the order summary folds away so the form comes first */
var baseCheckout = V.checkout;
V.checkout = function(r){
  var v = baseCheckout(r), bi = v.init;
  if (!bi) return v;
  v.init = function(){
    var res = bi() || {}, co = $(".co-r");
    if (co){
      var b = document.createElement("button"); b.type = "button"; b.className = "sum-toggle";
      b.innerHTML = '<span>Show order summary</span><b>' + $("#stot").textContent + '</b>';
      co.insertBefore(b, co.firstChild);
      b.addEventListener("click", function(){ co.classList.toggle("open"); b.firstChild.textContent = co.classList.contains("open") ? "Hide order summary" : "Show order summary"; });
      $(".co-l").addEventListener("change", function(){ $("b", b).textContent = $("#stot").textContent; });
    }
    return res;
  };
  return v;
};

/* keep keyboard focus inside whichever overlay is open */
document.addEventListener("keydown", function(e){
  if (e.key !== "Tab") return;
  var box = $("#modal.open .mbox") || $("#drawer.open") || $("#srch.open") || $("#mmenu.open") || $("#lb.open");
  if (!box) return;
  var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex="0"]', box).filter(function(el){ return el.offsetParent !== null || el === document.activeElement; });
  if (!f.length) return;
  var first = f[0], last = f[f.length - 1];
  if (!box.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
  else if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

L.boot();
})();
