/* LENO WEAR · v9 product page: a calm, persuasive purchase flow. Replaces V.product. */
(function(){
"use strict";
var L = window.LENO, V = L.V, $ = L.$, $$ = L.$$, G = L.G, RM = L.reduce;

function cutoff(){
  var now = new Date(), dxb = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000), cut = new Date(dxb); cut.setHours(14, 0, 0, 0);
  var ms = cut - dxb;
  if (ms > 0){ var h = Math.floor(ms / 3600000), m = Math.floor(ms % 3600000 / 60000); return {t:"Arrives today in Dubai", s:"Order within " + (h ? h + "h " : "") + m + "m"}; }
  return {t:"Arrives tomorrow in Dubai", s:"Next day to every other emirate"};
}
var SIGNATURE = {"pleat-white":1};

V.product = function(r){
  var p = L.byId(r.id), s = L.st(p), sib = L.sib(p), tot = L.total(p);
  var partner = L.byId(s.cat === "sets" ? (p.edit === "navy" ? "knot-navy" : "pleat-white") : (p.edit === "navy" ? "set-navy" : "set-white"));
  var also = L.P.filter(function(q){ return q.s !== p.s && q.id !== (partner && partner.id); }).sort(function(a, b){ return (b.edit === p.edit) - (a.edit === p.edit); }).slice(0, 4);
  var ones = L.SIZES.filter(function(z){ return p.stock[z] === 1; });
  var labels = '<span class="lbl">New season</span>' + (SIGNATURE[p.id] ? '<span class="lbl dark">Signature</span>' : "") +
    (tot === 0 ? '<span class="lbl mute">Sold out</span>' : tot === 1 ? '<span class="lbl red">Last one</span>' : tot <= 3 ? '<span class="lbl red">Low stock</span>' : "");
  var firstSz = function(q){ return L.SIZES.filter(function(z){ return q.stock[z]; })[0]; };
  var szSel = function(q, id){ return '<select id="' + id + '" aria-label="Size">' + L.SIZES.map(function(z){ return '<option value="' + z + '"' + (q.stock[z] ? "" : " disabled") + (z === firstSz(q) ? " selected" : "") + '>' + z + (q.stock[z] ? "" : " · sold out") + '</option>'; }).join("") + '</select>'; };
  var c = cutoff();

  var html =
  '<section class="pd">' +
    '<div class="pd-gal">' +
      '<div class="pd-thumbs" id="pdThumbs">' + p.im.map(function(n, i){ return '<button type="button" data-i="' + i + '" class="' + (i ? "" : "on") + '" aria-label="Image ' + (i + 1) + '"><img src="' + L.img(n) + '" alt=""></button>'; }).join("") + '</div>' +
      '<div class="pd-main"><div class="pd-track" id="pdTrack">' + p.im.map(function(n, i){ return '<div class="pd-sl" data-i="' + i + '" data-cursor="Zoom"><img src="' + L.img(n) + '" alt="' + L.esc(s.en + " in " + p.c.en + ", image " + (i + 1)) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' draggable="false"></div>'; }).join("") + '</div>' +
        '<span class="pd-count" id="pdCount">1 / ' + p.im.length + '</span>' +
        '<div class="pd-dots" id="pdDots">' + p.im.map(function(_, i){ return '<i class="' + (i ? "" : "on") + '"></i>'; }).join("") + '</div>' +
        '<button type="button" class="pd-arrow l" data-step="-1" aria-label="Previous image">' + L.I.arrow + '</button><button type="button" class="pd-arrow r" data-step="1" aria-label="Next image">' + L.I.arrow + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="pd-info" id="pdInfo">' +
      '<nav class="pd-crumb mono"><a href="#shop">Shop</a><span>/</span><a href="#' + s.cat + '">' + (s.cat === "sets" ? "Sets" : "Dresses") + '</a></nav>' +
      '<div class="pd-labels">' + labels + '</div>' +
      '<h1 class="pd-name">' + s.en + '</h1>' +
      '<div class="pd-price"><b>' + L.money(s.price) + '</b><span>incl. VAT</span></div>' +
      '<p class="pd-bnpl">Or 4 interest-free payments of ' + L.money(Math.round(s.price / 4)) + ' with <span class="tabby">tabby</span></p>' +
      '<div class="pd-opt"><div class="pd-row"><span>Colour <b>' + p.c.en + '</b></span></div>' +
        '<div class="pd-sw">' + sib.map(function(q){ return '<a href="#p-' + q.id + '" class="' + (q.id === p.id ? "on" : "") + '" aria-label="' + q.c.en + '"><img src="' + L.img(q.im[0]) + '" alt=""><span>' + q.c.en + '</span></a>'; }).join("") + '</div></div>' +
      '<div class="pd-opt"><div class="pd-row"><span>Size <b id="pdSz">Select</b></span><button type="button" class="pd-guide" data-sizeguide>' + L.ICON("ruler") + 'Size guide</button></div>' +
        '<div class="pd-sizes" id="pdSizes">' + L.SIZES.map(function(z){ var n = p.stock[z]; return '<button type="button" data-sz="' + z + '" class="' + (n ? "" : "out") + '" aria-label="Size ' + z + (n ? "" : ", sold out") + '">' + z + '</button>'; }).join("") + '</div>' +
        '<p class="pd-msg" id="pdMsg">' + (tot === 0 ? "Sold out in every size. Join the waitlist below." : ones.length ? "Only one left in " + ones.join(" and ") + "." : "In stock and ready to ship.") + '</p></div>' +
      '<div class="pd-buy"><button type="button" class="btn red pd-add" id="pdAdd"><span class="a1">' + (tot ? "Add to bag" : "Join the waitlist") + '</span><span class="a2">Added to bag ✓</span></button>' +
        '<button type="button" class="pd-wish" data-wish="' + p.id + '" aria-pressed="false" aria-label="Save to wishlist">' + L.I.heart + '</button></div>' +
      (tot ? '<button type="button" class="apay" id="pdPay">Buy now with Apple Pay</button>' : "") +
      '<ul class="pd-trust">' +
        '<li>' + L.ICON("truck") + '<div><b id="pdShipT">' + c.t + '</b><span id="pdShipS">' + c.s + ' · free over ' + L.money(L.FREE) + '</span></div></li>' +
        '<li>' + L.ICON("return") + '<div><b>Free 14-day returns</b><span>We collect from your door</span></div></li>' +
        '<li>' + L.ICON("lock") + '<div><b>Secure checkout</b><span>Apple Pay, cards, Tabby and Tamara</span></div></li>' +
      '</ul>' +
      '<div class="acc pd-acc">' +
        '<details open><summary>Description<i></i></summary><div class="ab"><p>' + s.desc.en + '</p></div></details>' +
        '<details><summary>Details<i></i></summary><div class="ab"><ul>' + s.pts.en.map(function(x){ return "<li>" + x + "</li>"; }).join("") + '</ul><span class="mono mute">Style ' + s.code + '</span></div></details>' +
        '<details><summary>Size &amp; fit<i></i></summary><div class="ab"><p>Available in S, M, L and XL. The full measurement chart is coming soon; our stylists can help you choose on WhatsApp.</p></div></details>' +
        '<details><summary>Fabric &amp; care<i></i></summary><div class="ab"><p>Composition and care instructions will be added once confirmed by the supplier.</p></div></details>' +
      '</div>' +
    '</div>' +
  '</section>' +
  (partner ? '<section class="g ctl2"><div class="w ctl2-in">' +
    '<div class="ctl2-m" data-reveal><img src="' + L.img(partner.im[0]) + '" alt="" loading="lazy"><img src="' + L.img(p.im[0]) + '" alt="" loading="lazy" class="b"></div>' +
    '<div class="ctl2-t"><span class="mono mute">Complete the look</span><h2 class="H" data-rise>Wear it <em>together</em></h2>' +
      '<div class="ctl2-l">' +
        '<div class="ctl2-i"><img src="' + L.img(p.im[0]) + '" alt=""><div><b>' + s.en + '</b><span>' + p.c.en + ' · ' + L.money(s.price) + '</span></div>' + szSel(p, "lk1") + '</div>' +
        '<div class="ctl2-i"><img src="' + L.img(partner.im[0]) + '" alt="" data-href="#p-' + partner.id + '"><div><b>' + L.st(partner).en + '</b><span>' + partner.c.en + ' · ' + L.money(L.st(partner).price) + '</span></div>' + szSel(partner, "lk2") + '</div>' +
      '</div>' +
      '<button type="button" class="btn red block" id="addboth">Add both · ' + L.money(s.price + L.st(partner).price) + '</button>' +
      '<span class="mute" style="font-size:12.5px">Together they qualify for free same-day delivery in Dubai.</span>' +
    '</div></div></section>' : "") +
  '<section class="g pd-more"><div class="w"><div class="sh-hd"><h2 class="H" data-rise>You may also <em>like</em></h2></div><div class="grid g4">' + also.map(function(q){ return L.card(q); }).join("") + '</div></div></section>' +
  '<div class="sticky-buy" id="sbuy"><img src="' + L.img(p.im[0]) + '" alt=""><span class="sb-t"><b>' + s.en + '</b><span id="sbSz">' + L.money(s.price) + '</span></span><button type="button" class="btn red" id="sbtn">' + (tot ? "Add to bag" : "Join the waitlist") + '</button></div>';

  return {title:s.en + " · " + p.c.en, html:html, init:function(){
    var size = null, kill = [], track = $("#pdTrack"), n = p.im.length, idx = 0;
    /* gallery */
    function show(i){ idx = (i + n) % n; track.scrollTo({left:idx * track.clientWidth, behavior:"smooth"}); }
    function sync(){ var i = Math.round(track.scrollLeft / (track.clientWidth || 1)); if (i === idx && $("#pdCount").textContent.indexOf(i + 1 + " ") === 0) return; idx = i;
      $("#pdCount").textContent = (i + 1) + " / " + n; $$("#pdDots i").forEach(function(d, j){ d.classList.toggle("on", j === i); }); $$("#pdThumbs button").forEach(function(b, j){ b.classList.toggle("on", j === i); }); }
    track.addEventListener("scroll", sync, {passive:true});
    $("#pdThumbs").addEventListener("click", function(e){ var b = e.target.closest("button"); if (b) show(+b.getAttribute("data-i")); });
    $$(".pd-arrow").forEach(function(b){ b.addEventListener("click", function(){ show(idx + (+b.getAttribute("data-step"))); }); });
    /* hover zoom (desktop) and full-screen view */
    if (L.fine) $$(".pd-sl").forEach(function(sl){
      var im = $("img", sl);
      sl.addEventListener("pointermove", function(e){ var rc = sl.getBoundingClientRect(); im.style.transformOrigin = ((e.clientX - rc.left) / rc.width * 100) + "% " + ((e.clientY - rc.top) / rc.height * 100) + "%"; });
      sl.addEventListener("pointerenter", function(){ sl.classList.add("zoom"); });
      sl.addEventListener("pointerleave", function(){ sl.classList.remove("zoom"); });
    });
    $$(".pd-sl").forEach(function(sl){ sl.addEventListener("click", function(){ L.openLb(p.im.map(L.img), +sl.getAttribute("data-i")); }); });

    /* size + stock message */
    function pick(z){
      if (!p.stock[z]){ L.notify(p.id, z); return; }
      size = z; $("#pdSz").textContent = z; $("#pdSizes").classList.remove("need");
      $$("#pdSizes button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-sz") === z); });
      var q = p.stock[z], msg = $("#pdMsg");
      msg.textContent = q === 1 ? "Only one left in " + z + "." : q === 2 ? "Two left in " + z + "." : "In stock in " + z + ", ready to ship.";
      msg.classList.toggle("low", q <= 2);
      $(".a1", $("#pdAdd")).textContent = "Add to bag · " + z; $("#sbtn").textContent = "Add to bag · " + z; $("#sbSz").textContent = L.money(s.price) + " · Size " + z;
      if (G && !RM) gsap.fromTo(msg, {opacity:0, y:6}, {opacity:1, y:0, duration:.4});
    }
    $("#pdSizes").addEventListener("click", function(e){ var b = e.target.closest("button"); if (b) pick(b.getAttribute("data-sz")); });
    function addNow(){
      if (!tot){ L.notify(p.id, null); return; }
      if (!size){
        var only = L.SIZES.filter(function(z){ return p.stock[z]; });
        if (only.length === 1){ pick(only[0]); }
        else {
          var o = $("#pdSizes"); o.classList.remove("need"); void o.offsetWidth; o.classList.add("need");
          $("#pdMsg").textContent = "Choose your size to continue."; $("#pdMsg").classList.add("low");
          if (innerWidth <= 900) window.scrollTo({top:o.getBoundingClientRect().top + scrollY - 140, behavior:"smooth"});
          return;
        }
      }
      var b = $("#pdAdd");
      if (L.add(p.id, size, $(".pd-sl img"))){ b.classList.add("done"); setTimeout(function(){ b.classList.remove("done"); }, 1600); }
    }
    $("#pdAdd").addEventListener("click", addNow);
    $("#sbtn").addEventListener("click", addNow);
    var pay = $("#pdPay");
    if (pay) pay.addEventListener("click", function(){ if (!size){ addNow(); return; } if (L.add(p.id, size, null, {silent:true})) location.hash = "#checkout"; });
    var ab = $("#addboth");
    if (ab) ab.addEventListener("click", function(){
      var ims = $$(".ctl2-i img");
      L.add(p.id, $("#lk1").value, ims[0], {silent:true});
      setTimeout(function(){ L.add(partner.id, $("#lk2").value, ims[1]); }, 260);
      ab.textContent = "Both added ✓";
    });
    /* delivery cut-off stays live */
    var iv = setInterval(function(){ var c2 = cutoff(), t = $("#pdShipT"); if (!t) return; t.textContent = c2.t; $("#pdShipS").textContent = c2.s + " · free over " + L.money(L.FREE); }, 30000);
    kill.push(function(){ clearInterval(iv); });
    /* sticky buy bar once the main button scrolls away */
    var sb = $("#sbuy"); document.body.appendChild(sb); kill.push(function(){ sb.parentNode && sb.parentNode.removeChild(sb); });
    if ("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(e){ sb.classList.toggle("on", !e[0].isIntersecting && e[0].boundingClientRect.top < 0); });
      io.observe($("#pdAdd")); kill.push(function(){ io.disconnect(); });
    }
    var gx = null;
    if (G && !RM && window.ScrollTrigger){
      gx = gsap.context(function(){
        $$("[data-rise]").forEach(function(h){ gsap.from(L.split(h), {yPercent:110, duration:1.1, ease:"expo.out", stagger:.018, scrollTrigger:{trigger:h, start:"top 88%"}}); });
        $$("[data-reveal]").forEach(function(el){ gsap.fromTo(el, {clipPath:"inset(10% 6% 10% 6%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:1.4, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 88%"}}); });
        gsap.from(".pd-more .card", {y:60, opacity:0, stagger:.06, duration:1, ease:"expo.out", clearProps:"transform,opacity", scrollTrigger:{trigger:".pd-more", start:"top 85%"}});
      });
    }
    return {cleanup:function(){ kill.forEach(function(f){ f(); }); gx && gx.revert(); }, enter:function(fromTravel){
      if (!G || RM) return;
      gsap.from("#pdInfo > *", {y:24, opacity:0, stagger:.04, duration:.9, ease:"expo.out", delay:fromTravel ? .1 : .15, clearProps:"transform,opacity"});
      gsap.from("#pdThumbs button", {x:-20, opacity:0, stagger:.05, duration:.8, ease:"expo.out", delay:.3, clearProps:"transform,opacity"});
    }};
  }};
};
})();
