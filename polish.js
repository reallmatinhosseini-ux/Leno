/* LENO WEAR · v11 polish: swatch previews, continue browsing, richer shop page, calmer checkout. */
(function(){
"use strict";
var L = window.LENO, V = L.V, $ = L.$, $$ = L.$$, G = L.G, RM = L.reduce;

/* ---------- 1. hovering a colour dot previews that colour on the card ---------- */
document.addEventListener("mouseover", function(e){
  var a = e.target.closest && e.target.closest(".card .sws a"); if (!a) return;
  var card = a.closest(".card"), img = $(".cm img.a", card), p = L.byId(a.getAttribute("href").slice(3));
  if (!img || !p) return;
  if (!img.dataset.orig) img.dataset.orig = img.getAttribute("src");
  var src = L.img(p.im[0]); if (img.getAttribute("src") === src) return;
  if (G && !RM) gsap.fromTo(img, {opacity:.35}, {opacity:1, duration:.45, ease:"power2.out"});
  img.src = src;
});
document.addEventListener("mouseout", function(e){
  var sw = e.target.closest && e.target.closest(".card .sws"); if (!sw || (e.relatedTarget && sw.contains(e.relatedTarget))) return;
  var img = $(".cm img.a", sw.closest(".card")); if (img && img.dataset.orig){ img.src = img.dataset.orig; }
});

/* ---------- 2. returning visitors: continue where they left off ---------- */
function recent(){ try { return (JSON.parse(localStorage.getItem("leno-recent")) || []).filter(function(id){ return L.byId(id); }); } catch(e){ return []; } }
var baseHome = V.home;
V.home = function(r){
  var v = baseHome(r), rec = recent().slice(0, 4);
  if (rec.length >= 2){
    v.html = v.html.replace('<section class="g cat2">', '<section class="g cont"><div class="w"><div class="sh-hd"><h2 class="H" data-rise>Continue <em>browsing</em></h2><span class="mono mute">Picked up from your last visit</span></div>' +
      '<div class="grid g4">' + rec.map(function(id){ return L.card(L.byId(id)); }).join("") + '</div></div></section><section class="g cat2">');
  }
  return v;
};

/* ---------- 3. shop page: four columns and an editorial tile ---------- */
var baseShop = V.shop;
V.shop = function(r){
  var v = baseShop(r);
  v.html = v.html.replace('<div class="grid g3" id="sgrid">', '<div class="grid g4" id="sgrid">')
    .replace(/(<div class="grid g4" id="sgrid">[\s\S]*?)(<\/div>\s*<div class="empty")/, function(m, a, b){
      return a + '<a class="ed-tile" href="#home" data-tolooks><img src="' + L.img("set-navy-2") + '" alt="" loading="lazy"><span class="mono">Shop the look</span><b class="H">Wear it <em>together</em></b><span class="ed-tile-c">Save 10% on a dress and a set →</span></a>' + b;
    });
  return v;
};
document.addEventListener("click", function(e){
  if (!e.target.closest("[data-tolooks]")) return;
  var go = function(){ var el = $(".looks"); if (!el) return false; if (L.lenis) L.lenis.scrollTo(el, {offset:-40}); else el.scrollIntoView({behavior:"smooth"}); return true; };
  var tries = 0; (function wait(){ if (!go() && ++tries < 30) setTimeout(wait, 150); })();
});

/* ---------- 4. checkout: progress, gift wrap, reassurance ---------- */
var baseCo = V.checkout;
V.checkout = function(r){
  var v = baseCo(r);
  if (!L.bag.length) return v;
  v.html = v.html
    .replace('<div class="demo-note">', '<ol class="co-steps"><li class="done"><button type="button" data-open="bag">Bag</button></li><li class="on">Details</li><li>Payment</li><li>Done</li></ol><div class="demo-note">')
    .replace('<button type="button" class="btn block" id="place"', '<label class="gift"><input type="checkbox" id="c-gift"><span><b>Free gift wrap</b> in our kiss-print tissue, with a handwritten note</span></label>' +
      '<div class="inp gift-note" hidden><input id="c-note" placeholder=" "><label for="c-note">Your note (optional)</label></div>' +
      '<button type="button" class="btn block" id="place"')
    .replace(/(id="place"[\s\S]*?<\/button>)/, '$1<ul class="co-trust"><li>' + L.ICON("lock") + 'Encrypted, secure payment</li><li>' + L.ICON("return") + 'Free 14-day returns</li><li>' + L.ICON("truck") + 'Same-day delivery in Dubai</li></ul>');
  var bi = v.init;
  v.init = function(){
    var res = bi ? (bi() || {}) : {};
    var g = $("#c-gift"); if (g) g.addEventListener("change", function(){ $(".gift-note").hidden = !g.checked; if (g.checked) L.toast("Gift wrap added, free"); });
    return res;
  };
  return v;
};
})();
