/* LENO WEAR · v10 conversion layer: looks, bundle saving, free-delivery gap filler, bag reminder.
   All offers here are configurable placeholders the brand must confirm before launch. */
(function(){
"use strict";
var L = window.LENO, V = L.V, $ = L.$, $$ = L.$$, G = L.G, RM = L.reduce;

L.BUNDLE = .10;   // dress + set bought together
L.isBundle = function(){
  var cats = L.bag.map(function(l){ return L.st(L.byId(l.id)).cat; });
  return cats.indexOf("dresses") > -1 && cats.indexOf("sets") > -1;
};
/* one saving at a time, never stacked: the welcome code or the look bundle */
L.disc = function(){ return (L.promo || L.isBundle()) ? Math.round(L.bagTotal() * .10) : 0; };
L.discLabel = function(){ return L.isBundle() ? "Look bundle · 10% off" : "Welcome 10% · LENO10"; };

/* ---------- curated looks ---------- */
var LOOKS = [
  {id:"navy", name:"The Navy Look", img:"set-navy-2", items:["knot-navy","set-navy"]},
  {id:"light", name:"The Light Look", img:"set-white-1", items:["pleat-white","set-white"]}
];
function firstSz(p){ return L.SIZES.filter(function(z){ return p.stock[z]; })[0]; }
function lookHTML(lk){
  var ps = lk.items.map(L.byId), full = ps.reduce(function(a, p){ return a + L.st(p).price; }, 0), now = Math.round(full * (1 - L.BUNDLE));
  return '<article class="lk" data-look="' + lk.id + '">' +
    '<div class="lk-m" data-reveal><img src="' + L.img(lk.img) + '" alt="" loading="lazy">' +
      ps.map(function(p, i){ return '<button type="button" class="hs" data-qv="' + p.id + '" style="left:' + (i ? 58 : 44) + '%;top:' + (i ? 36 : 66) + '%" aria-label="' + L.st(p).en + '"><span>' + L.st(p).en + ' · ' + p.c.en + '</span></button>'; }).join("") + '</div>' +
    '<div class="lk-t"><div class="lk-h"><h3 class="H">' + lk.name + '</h3><span class="lk-save">Save ' + L.money(full - now) + '</span></div>' +
      ps.map(function(p, i){ return '<div class="lk-i"><img src="' + L.img(p.im[0]) + '" alt="" data-href="#p-' + p.id + '"><div><b>' + L.st(p).en + '</b><span>' + p.c.en + ' · ' + L.money(L.st(p).price) + '</span></div>' +
        '<select data-lks="' + i + '" aria-label="Size for ' + L.st(p).en + '">' + L.SIZES.map(function(z){ return '<option value="' + z + '"' + (p.stock[z] ? "" : " disabled") + (z === firstSz(p) ? " selected" : "") + '>' + z + (p.stock[z] ? (p.stock[z] === 1 ? " · last one" : "") : " · sold out") + '</option>'; }).join("") + '</select></div>'; }).join("") +
      '<button type="button" class="btn red block lk-add">Add the look · ' + L.money(now) + ' <s>' + L.money(full) + '</s></button></div></article>';
}
var baseHome = V.home;
V.home = function(r){
  var v = baseHome(r);
  v.html = v.html.replace('<section class="chap"', '<section class="g looks"><div class="w"><div class="sh-hd"><h2 class="H" data-rise>Shop the <em>look</em></h2><span class="mono mute">Buy the outfit together and save 10%</span></div>' +
    '<div class="looks-grid">' + LOOKS.map(lookHTML).join("") + '</div></div></section><section class="chap"');
  var bi = v.init;
  v.init = function(){
    var res = bi() || {};
    $$(".lk").forEach(function(el){
      var lk = LOOKS.filter(function(x){ return x.id === el.getAttribute("data-look"); })[0];
      $(".lk-add", el).addEventListener("click", function(){
        var b = this, ims = $$(".lk-i img", el);
        lk.items.forEach(function(id, i){ var z = $('[data-lks="' + i + '"]', el).value; setTimeout(function(){ L.add(id, z, ims[i], {silent:i === 0}); }, i * 280); });
        b.innerHTML = "Look added ✓"; b.classList.add("ok");
        setTimeout(function(){ b.classList.remove("ok"); }, 2500);
      });
    });
    if (G && !RM && window.ScrollTrigger){
      $$(".lk").forEach(function(el, i){ gsap.from(el, {y:70, opacity:0, duration:1.2, ease:"expo.out", delay:i * .12, clearProps:"transform,opacity", scrollTrigger:{trigger:".looks", start:"top 80%"}}); });
    }
    return res;
  };
  return v;
};

/* ---------- product page: show the bundle saving on "Add both" ---------- */
var baseProduct = V.product;
V.product = function(r){
  var v = baseProduct(r);
  v.html = v.html.replace(/(<button type="button" class="btn red block" id="addboth">)Add both · AED ([\d,]+)(<\/button>)/, function(m, a, amt, c){
    var full = +amt.replace(/,/g, ""), now = Math.round(full * (1 - L.BUNDLE));
    return a + 'Add both · ' + L.money(now) + ' <s>' + L.money(full) + '</s>' + c;
  }).replace('Together they qualify for free same-day delivery in Dubai.', 'Save 10% when you buy the look together. Free same-day delivery in Dubai included.');
  return v;
};

/* ---------- bag: correct saving label + free-delivery gap filler ---------- */
var baseBag = L.renderBag;
L.renderBag = function(){
  baseBag();
  var promoRow = $("#drft .tot.promo span");
  if (promoRow) promoRow.textContent = L.discLabel();
  if (!L.bag.length) return;
  var left = L.FREE - L.bagTotal();
  var sug = $("#drbody .dr-sug");
  if (left > 0){
    var inBag = L.bag.map(function(l){ return l.id; });
    var picks = L.P.filter(function(p){ return inBag.indexOf(p.id) < 0 && L.total(p) > 0; })
      .sort(function(a, b){ var da = L.st(a).price - left, db = L.st(b).price - left; return (da >= 0 ? da : 9999 - da) - (db >= 0 ? db : 9999 - db); }).slice(0, 2);
    if (sug) sug.parentNode.removeChild(sug);
    var box = document.createElement("div"); box.className = "gap";
    box.innerHTML = '<span class="mono">Add ' + L.money(left) + ' for free same-day delivery</span><div class="gap-r">' + picks.map(function(p){
      var z = firstSz(p); return '<div class="gap-i"><img src="' + L.img(p.im[0]) + '" alt="" data-href="#p-' + p.id + '"><div><b>' + L.st(p).en + '</b><span>' + p.c.en + ' · ' + L.money(L.st(p).price) + '</span></div><button type="button" class="add" data-add="' + p.id + '" data-size="' + z + '" data-silent>Add ' + z + '</button></div>'; }).join("") + '</div>';
    $("#drbody").appendChild(box);
  }
  if (L.isBundle() && !$("#drbody .bundle-ok")){
    var ok = document.createElement("div"); ok.className = "bundle-ok"; ok.textContent = "Look bundle unlocked: 10% off your order"; $("#drbody").insertBefore(ok, $("#drbody").firstChild);
  }
};

/* ---------- returning visitor: a gentle reminder of what they left ---------- */
window.addEventListener("load", function(){
  var shown = false; try { shown = sessionStorage.getItem("leno-remind") === "1"; } catch(e){}
  if (shown || !L.bag.length) return;
  setTimeout(function(){
    if (!L.bag.length || document.querySelector(".drawer.open")) return;
    try { sessionStorage.setItem("leno-remind", "1"); } catch(e){}
    var n = L.bagCount(), el = document.createElement("aside"); el.className = "remind";
    var p = L.byId(L.bag[0].id);
    el.innerHTML = '<img src="' + L.img(p.im[0]) + '" alt=""><div><b>Your bag is waiting</b><span>' + n + (n > 1 ? " pieces" : " piece") + ' · ' + L.money(L.bagTotal()) + '</span></div><button type="button" class="btn red" data-open="bag">View bag</button><button type="button" class="rx" aria-label="Dismiss">' + L.I.close + '</button>';
    document.body.appendChild(el);
    if (G && !RM) gsap.fromTo(el, {y:-40, opacity:0}, {y:0, opacity:1, duration:.8, ease:"expo.out"});
    var close = function(){ el.parentNode && el.parentNode.removeChild(el); };
    $(".rx", el).addEventListener("click", close);
    el.addEventListener("click", function(e){ if (e.target.closest("[data-open]")) close(); });
    setTimeout(close, 9000);
  }, 2600);
});
})();
