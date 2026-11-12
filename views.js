/* LENO WEAR store: views and their motion. */
(function(){
"use strict";
var L = window.LENO, $ = L.$, $$ = L.$$, t = function(k){ return L.t(k); };
var V = L.V = {};
var G = L.G, RM = L.reduce;
var isDesk = function(){ return window.innerWidth > 900; };

/* split text into animatable pieces (chars for Latin, words for Arabic so letters stay joined) */
function split(el){
  if (!el || el._split) return [];
  el._split = 1;
  var out = [];
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if (n.nodeType === 3){
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(word){
          if (!word) return;
          if (/^\s+$/.test(word)){ frag.appendChild(document.createTextNode(" ")); return; }
          var wr = document.createElement("span"); wr.style.display = "inline-block"; wr.style.whiteSpace = "nowrap";
          (L.lang === "ar" ? [word] : word.split("")).forEach(function(c){
            var w = document.createElement("span"); w.style.display = "inline-block"; w.style.overflow = "hidden"; w.style.verticalAlign = "top"; w.style.paddingBottom = ".04em";
            var s = document.createElement("span"); s.style.display = "inline-block"; s.textContent = c; w.appendChild(s); wr.appendChild(w); out.push(s);
          });
          frag.appendChild(wr);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== "SUP" && n.tagName !== "IMG") walk(n);
    });
  })(el);
  return out;
}
L.split = split;
function riseChars(el, delay){
  if (!G || RM || !el) return;
  var ch = split(el);
  gsap.from(ch, {yPercent:110, rotate:L.lang === "ar" ? 0 : 6, duration:1.2, ease:"expo.out", stagger:{each:.025, from:"start"}, delay:delay || 0});
}
function headReveal(root){
  if (!G || RM || !window.ScrollTrigger) return;
  $$("[data-rise]", root).forEach(function(h){
    var ch = split(h);
    gsap.from(ch, {yPercent:110, duration:1.2, ease:"expo.out", stagger:.02, scrollTrigger:{trigger:h, start:"top 88%"}});
  });
  $$("[data-fade]", root).forEach(function(el){
    gsap.from(el, {y:40, opacity:0, duration:1.1, ease:"expo.out", scrollTrigger:{trigger:el, start:"top 90%"}});
  });
}
function cardsReveal(root){
  if (!G || RM || !window.ScrollTrigger) return;
  ScrollTrigger.batch($$(".card", root), {start:"top 92%", once:true, onEnter:function(b){
    gsap.fromTo(b, {y:90, opacity:0, rotateX:-18, transformPerspective:1200}, {y:0, opacity:1, rotateX:0, duration:1.3, ease:"expo.out", stagger:.09, clearProps:"transform,opacity"});
  }});
}

/* ---------------- footer ---------------- */
V.footer = function(){
  return '<footer class="foot"><div class="g"><div class="w">' +
    '<div class="foot-top"><div class="nl"><span class="mono" style="color:var(--red)">' + t("fs") + '</span><span class="H">' + t("fsP") + '</span>' +
      '<form class="field" data-form="fs" style="max-width:460px"><input type="text" id="fs-in" placeholder="' + t("email") + '" aria-label="' + t("email") + '" required><button class="btn light" type="submit">' + t("join") + '</button></form></div>' +
      '<div><h4>' + t("shop") + '</h4><ul><li><a class="ulink" href="#shop">' + t("all") + '</a></li><li><a class="ulink" href="#dresses">' + t("dresses") + '</a></li><li><a class="ulink" href="#sets">' + t("sets") + '</a></li><li><a class="ulink" href="#navy-edit">' + t("navyEdit") + '</a></li><li><a class="ulink" href="#light-edit">' + t("lightEdit") + '</a></li></ul></div>' +
      '<div><h4>' + t("help") + '</h4><ul><li><a class="ulink" href="#help">' + t("track") + '</a></li><li><a class="ulink" href="#help">' + t("returns") + '</a></li><li><a class="ulink" href="#help">Delivery</a></li><li><a class="ulink" href="#help">' + t("contact") + '</a></li></ul></div>' +
      '<div><h4>LENO WEAR</h4><ul><li><a class="ulink" href="#story">Our story</a></li><li><a class="ulink" href="#help">' + t("clubs") + '</a></li><li>Instagram</li><li>TikTok</li></ul></div></div>' +
    '<div class="foot-word" aria-label="LENO WEAR" dir="ltr">' + "LENO".split("").map(function(c){ return "<span>" + c + "</span>"; }).join("") + '<img src="' + L.KISS + '" alt="">' + "WEAR".split("").map(function(c){ return "<span>" + c + "</span>"; }).join("") + '</div>' +
    '<div class="foot-bot"><span>© 2026 LENO WEAR · Dubai</span><span>' + t("demo") + '</span><span>AED · Visa · Mastercard · Apple Pay · Tabby · Tamara</span></div>' +
  '</div></div></footer>';
};
V.footerFx = function(){
  var f = $("[data-form=fs]");
  if (f) f.addEventListener("submit", function(e){ e.preventDefault(); f.reset(); L.toast(t("onList")); });
  if (!G || RM || !window.ScrollTrigger) return;
  gsap.from(".foot-word span", {yPercent:100, stagger:.05, ease:"none", scrollTrigger:{trigger:".foot-word", start:"top bottom", end:"bottom bottom", scrub:1}});
  gsap.from(".foot-word img", {scale:0, rotation:-40, ease:"none", scrollTrigger:{trigger:".foot-word", start:"top bottom", end:"bottom bottom", scrub:1}});
};

/* ---------------- WebGL hero ---------------- */
var VS = "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.);}";
var FS = [
"precision highp float;",
"uniform sampler2D t1,t2;uniform float prog,time,hov,scr;uniform vec2 res,r1,r2,mouse;varying vec2 vUv;",
"vec2 cover(vec2 uv,vec2 ir){float rs=res.x/res.y,ri=ir.x/ir.y;vec2 s=rs<ri?vec2(rs/ri,1.):vec2(1.,ri/rs);vec2 o=(1.-s)*vec2(.5,.7);return uv*s+o;}",
"float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
"float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
"float fbm(vec2 p){return n2(p)*.55+n2(p*2.1)*.3+n2(p*4.3)*.15;}",
"void main(){",
" vec2 uv=vUv;",
" uv=(uv-.5)*(1.-.07*scr-.015*sin(time*.3))+.5;",
" vec2 d=uv-mouse;float md=length(d*vec2(res.x/res.y,1.));",
" uv+=normalize(d+1e-4)*.014*hov*smoothstep(.5,0.,md)*sin(md*26.-time*4.);",
" float n=fbm(uv*3.+time*.06);",
" float v=mix(n,1.-uv.y,.55);",
" float m=smoothstep(v-.09,v+.09,prog*1.2-.1);",
" float e=m*(1.-m)*4.;",
" vec2 c1=cover(uv+vec2(0.,(n-.5)*.4*m),r1);",
" vec2 c2=cover(uv-vec2(0.,(n-.5)*.4*(1.-m)),r2);",
" vec4 a=texture2D(t1,c1);",
" float sh=.016*e;",
" vec3 b=vec3(texture2D(t2,c2+vec2(sh,0.)).r,texture2D(t2,c2).g,texture2D(t2,c2-vec2(sh,0.)).b);",
" vec3 col=mix(a.rgb,b,m);",
" col+=vec3(.83,.13,.23)*e*.18;",
" gl_FragColor=vec4(col,1.);",
"}"].join("\n");

function heroGL(box, srcs){
  if (typeof THREE === "undefined" || RM) return null;
  var renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:false, alpha:false, powerPreference:"high-performance"}); } catch(e){ return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.opacity = "0";
  box.appendChild(renderer.domElement);
  var scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var U = {t1:{value:null}, t2:{value:null}, prog:{value:0}, time:{value:0}, hov:{value:0}, scr:{value:0},
    res:{value:new THREE.Vector2(1, 1)}, r1:{value:new THREE.Vector2(1, 1)}, r2:{value:new THREE.Vector2(1, 1)}, mouse:{value:new THREE.Vector2(.5, .5)}};
  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({uniforms:U, vertexShader:VS, fragmentShader:FS}));
  scene.add(mesh);
  var tex = [], loaded = 0, cur = 0, anim = false, raf, vis = true, t0 = performance.now(), tm = {x:.5, y:.5};
  var ldr = new THREE.TextureLoader();
  var api = {ready:false, idx:function(){ return cur; }};
  srcs.forEach(function(s, i){
    ldr.load(s, function(tx){
      tx.minFilter = THREE.LinearFilter; tx.generateMipmaps = false; tex[i] = tx; loaded++;
      if (loaded === srcs.length){
        U.t1.value = tex[0]; U.t2.value = tex[1]; U.r1.value.set(tex[0].image.width, tex[0].image.height); U.r2.value.set(tex[1].image.width, tex[1].image.height);
        api.ready = true; gsap.to(renderer.domElement, {opacity:1, duration:.8});
        var fb = box.querySelector("img"); if (fb) gsap.to(fb, {opacity:0, duration:.8});
      }
    });
  });
  function size(){ var w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); U.res.value.set(w, h); }
  size(); window.addEventListener("resize", size);
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function(e){ vis = e[0].isIntersecting; }) : null;
  io && io.observe(box);
  function onMove(e){ var r = box.getBoundingClientRect(); tm.x = (e.clientX - r.left) / r.width; tm.y = 1 - (e.clientY - r.top) / r.height; }
  box.addEventListener("pointermove", onMove);
  box.addEventListener("pointerenter", function(){ gsap.to(U.hov, {value:1, duration:.8, ease:"power2.out"}); });
  box.addEventListener("pointerleave", function(){ gsap.to(U.hov, {value:0, duration:1.2, ease:"power2.out"}); });
  (function loop(){
    raf = requestAnimationFrame(loop);
    if (!vis || !api.ready) return;
    U.time.value = (performance.now() - t0) / 1000;
    U.mouse.value.x += (tm.x - U.mouse.value.x) * .08; U.mouse.value.y += (tm.y - U.mouse.value.y) * .08;
    renderer.render(scene, cam);
  })();
  api.go = function(i){
    if (!api.ready || anim || i === cur) return false;
    anim = true; U.t2.value = tex[i]; U.r2.value.set(tex[i].image.width, tex[i].image.height); U.prog.value = 0;
    gsap.to(U.prog, {value:1, duration:1.7, ease:"power2.inOut", onComplete:function(){
      U.t1.value = tex[i]; U.r1.value.copy(U.r2.value); U.prog.value = 0; cur = i; anim = false;
    }});
    return true;
  };
  api.scroll = function(p){ U.scr.value = p; };
  api.destroy = function(){
    cancelAnimationFrame(raf); window.removeEventListener("resize", size); io && io.disconnect();
    tex.forEach(function(x){ x && x.dispose(); }); mesh.geometry.dispose(); mesh.material.dispose(); renderer.dispose();
    renderer.domElement.remove();
  };
  return api;
}

/* ---------------- HOME ---------------- */
var SLIDES = ["pleat-white","knot-navy","tulle-ivory","set-white"];
V.home = function(){
  var S = SLIDES.map(L.byId);
  var lineup = ["pleat","knot","set","tulle"].map(function(k, i){
    var ps = L.P.filter(function(p){ return p.s === k; }), st = L.STYLES[k];
    return '<div class="lrow" data-href="#p-' + ps[0].id + '" data-img="' + ps[0].im[0] + '" data-img2="' + (ps[1] ? ps[1].im[0] : ps[0].im[1]) + '" role="link" tabindex="0">' +
      '<span class="mono mute">0' + (i + 1) + '</span><span class="H">' + st[L.lang] + '</span><span class="verb">' + st.verb[L.lang] + '.</span>' +
      '<span class="dots">' + ps.map(function(p){ return '<i style="background:' + p.hex + '"></i>'; }).join("") + '</span>' +
      '<span class="arr">' + L.I.arrow + '</span></div>';
  }).join("");
  var navyIm = ["knot-navy-2","set-navy-3","pleat-blue-2"], lightIm = ["pleat-white-3","tulle-ivory-1","set-white-3"];
  var cylIm = [["set-navy-1","set-navy"],["set-white-1","set-white"],["set-navy-3","set-navy"],["set-white-3","set-white"],["set-navy-2","set-navy"],["set-white-4","set-white"],["set-navy-5","set-navy"],["set-white-2","set-white"]];
  var marq = function(){ var w = L.lang === "ar" ? ["كورت 01","بادل","تنس","بيكلبول","استوديو","دبي"] : ["Court 01","padel","Tennis","pickleball","Studio","Dubai"];
    var one = w.map(function(x, i){ return (i % 2 ? "<em>" + x + "</em>" : "<span>" + x + "</span>") + '<img src="' + L.KISS + '" alt="">'; }).join("");
    return one + one + one + one; };
  var html =
  '<section class="hero" id="hero">' +
    '<div class="hero-media" id="hmedia" data-cursor="' + t("shopNow") + '" role="link" tabindex="0" aria-label="' + t("shopNow") + '"><img id="hfb" fetchpriority="high" decoding="async" src="' + L.img(S[0].hero) + '" alt="' + L.esc(L.STYLES.pleat.en) + '"></div>' +
    '<div class="hero-title" aria-hidden="true"><div class="H l1"><span class="ln">' + t("heroL1") + '</span></div><div class="H l2"><span class="ln">' + t("heroL2") + '</span></div></div>' +
    '<h1 class="sr">LENO WEAR · ' + t("heroL1") + " " + t("heroL2") + '</h1>' +
    '<div class="hero-cap"><span class="mono" id="hnum">01 / 04</span><span class="nm"><span id="hname">' + L.name(S[0]) + " · " + L.money(L.st(S[0]).price) + '</span></span><a class="ulink" id="hshop" href="#p-' + S[0].id + '">' + t("shopNow") + '</a></div>' +
    '<div class="hero-side"><div class="hero-copy"><p>' + t("heroP") + ' <em>' + t("heroP2") + '</em></p><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="#shop" data-mag>' + t("shopCourt") + '</a><a class="btn line" href="#dresses">' + t("dresses") + '</a></div></div>' +
      '<div class="hero-idx" id="hidx">' + S.map(function(p, i){ return '<button type="button" data-slide="' + i + '" class="' + (i ? "" : "on") + '"><span class="mono">0' + (i + 1) + '</span><span>' + L.name(p) + ' · ' + L.tx(p.c) + '</span><i><b></b></i></button>'; }).join("") + '</div></div>' +
  '</section>' +
  '<div class="marq" aria-hidden="true"><div class="t" id="mq">' + marq() + '</div></div>' +
  '<section class="g"><div class="w cats" id="cats">' +
    [["#dresses","Dresses","5 colourways","pleat-white-3"],["#sets","Sets","2 colourways","set-navy-3"],["#navy-edit","Navy Edit","3 pieces","knot-navy-2"],["#light-edit","Light Edit","4 pieces","tulle-ivory-1"]].map(function(c){
      return '<a class="cat" href="' + c[0] + '" data-cursor="Shop"><div class="cat-m"><img src="' + L.img(c[3]) + '" alt="" loading="lazy"></div><div class="cat-t"><span class="H">' + c[1] + '</span><span class="mono mute">' + c[2] + '</span></div></a>'; }).join("") +
  '</div></section>' +
  '<section class="g"><div class="w"><div class="shead"><div><div class="kick mono">' + t("editorial") + '</div><h2 class="H" data-rise>' + t("lineup") + '</h2></div><p data-fade>' + t("lineupP") + '</p></div><div class="lineup" id="lineup">' + lineup + '</div></div></section>' +
  '<div class="lfloat" id="lfloat"><img id="lf1" alt=""><img id="lf2" alt="" style="opacity:0"></div>' +
  '<section class="chap" id="chap" style="margin-top:120px"><div class="g"><div class="w chap-in">' +
    '<div class="chap-media" data-cursor="' + t("view") + '" data-href="#p-pleat-white"><span class="tag">' + L.STYLES.pleat[L.lang] + ' · ' + t("court") + '</span>' +
      '<div class="fr"><img src="p/h-pleat-white.webp" alt="Pleat Dress, front"></div><div class="fr f2"><img src="p/pleat-white-1.webp" alt="Pleat Dress, twirl"></div><div class="fr f3"><img src="p/pleat-white-4.webp" alt="Pleat Dress, open back"></div></div>' +
    '<div class="chap-txt"><div class="kick mono" style="color:var(--ivory)">' + t("court") + ' · I</div><h2 class="H" data-rise>' + t("ch1t") + '</h2>' +
      '<div class="chap-steps"><div class="chap-step s1"><b>01</b><h3 class="H" style="font-size:36px">' + t("ch1a") + '</h3><p>' + t("ch1ap") + '</p></div><div class="chap-step s2"><b>02</b><h3 class="H" style="font-size:36px">' + t("ch1b") + '</h3><p>' + t("ch1bp") + '</p></div><div class="chap-step s3"><b>03</b><h3 class="H" style="font-size:36px">' + t("ch1c") + '</h3><p>' + t("ch1cp") + '</p></div></div>' +
      '<div class="chap-bar"><i></i></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn light" href="#p-pleat-white" data-mag>' + t("shopWhite") + '</a><a class="btn line" href="#p-pleat-blue">' + t("shopBlue") + '</a></div></div>' +
  '</div></div></section>' +
  '<section class="duo" id="duo" data-cursor="' + t("drag") + '">' +
    '<div class="layer light">' + lightIm.map(function(n){ return '<img src="' + L.img(n) + '" alt="">'; }).join("") + '</div>' +
    '<div class="layer navy" id="duoNavy">' + navyIm.map(function(n){ return '<img src="' + L.img(n) + '" alt="">'; }).join("") + '</div>' +
    '<div class="shade"></div>' +
    '<div class="lab l"><span class="H">' + t("navyH") + '</span><a class="btn light" href="#navy-edit">' + t("navyEdit") + '</a></div>' +
    '<div class="lab r"><span class="H" style="color:#fff">' + t("lightH") + '</span><a class="btn" href="#light-edit">' + t("lightEdit") + '</a></div>' +
    '<div class="hdl" id="duoH"><span>⇆</span></div>' +
    '<input type="range" id="duoR" min="0" max="100" value="50" aria-label="' + t("navyEdit") + ' / ' + t("lightEdit") + '">' +
  '</section>' +
  '<section class="cyl-sec" id="cylsec"><div class="cyl-stage"><div class="cyl" id="cyl">' + cylIm.map(function(c, i){ return '<div class="cc" data-href="#p-' + c[1] + '" data-cursor="' + t("view") + '"><img src="' + L.img(c[0]) + '" alt=""><span>0' + (i % 4 + 1) + '</span></div>'; }).join("") + '</div>' +
    '<div class="cyl-txt"><div><span class="mono">' + t("cylS") + '</span><h2 class="H">' + t("cylT") + '</h2><a class="btn" href="#sets" data-mag>' + t("shopSet") + '</a></div></div></div></section>' +
  '<section class="g"><div class="w"><div class="shead"><div><div class="kick mono">' + t("court") + '</div><h2 class="H" data-rise>' + t("gridT") + '</h2></div><p data-fade>' + t("gridP") + '</p></div>' +
    '<div class="grid" id="hgrid">' + L.P.map(function(p, i){ return L.card(p, i === 0 ? "big" : ""); }).join("") + '</div></div></section>' +
  '<section class="edition" style="margin-top:140px"><div class="g"><div class="w ed-in">' +
    '<div class="ed-media" data-href="#p-tulle-ivory" data-cursor="' + t("view") + '"><img id="edimg" src="p/tulle-ivory-lips.webp" alt="The Tulle Dress in Ivory with the LENO WEAR kiss"></div>' +
    '<div class="ed-txt"><div class="ed-stock mono"><i></i>' + t("edK") + '</div><h2 class="H" data-rise>' + t("edT") + '</h2><p>' + t("edP") + '</p>' +
      '<form class="field" data-form="wl"><input type="text" placeholder="' + t("email") + '" aria-label="' + t("email") + '" required id="wl-in"><button class="btn light" type="submit">' + t("edBtn") + '</button></form>' +
      '<a class="ulink" href="#p-tulle-ivory" style="justify-self:start">' + t("viewLast") + ' →</a></div>' +
  '</div></div></section>' +
  '<section class="g"><div class="w svc">' +
    '<div data-fade><b>' + t("s1") + '</b><span>' + t("s1p") + '</span></div><div data-fade><b>' + t("s2") + '</b><span>' + t("s2p") + '</span></div><div data-fade><b>' + t("s3") + '</b><span>' + t("s3p") + '</span></div><div data-fade><b>' + t("s4") + '</b><span>' + t("s4p") + '</span></div>' +
  '</div></section>';

  return {title:"", html:html, init:function(){
    var kill = [], gl = null, introDone = false, slide = 0, prog = null;
    var gx = G ? gsap.context(function(){}) : null;
    var media = $("#hmedia"), fb = $("#hfb");
    gl = heroGL(media, S.map(function(p){ return L.img(p.hero); }));
    if (gl) kill.push(gl.destroy);

    function setSlide(i){
      if (i === slide) return;
      var ok = gl ? gl.go(i) : true;
      if (!ok) return;
      if (!gl){ if (G){ gsap.to(fb, {opacity:0, duration:.4, onComplete:function(){ fb.src = L.img(S[i].hero); gsap.to(fb, {opacity:1, duration:.6}); }}); } else fb.src = L.img(S[i].hero); }
      slide = i;
      var p = S[i];
      $("#hnum").textContent = "0" + (i + 1) + " / 04";
      $("#hshop").setAttribute("href", "#p-" + p.id);
      var nm = $("#hname");
      if (G && !RM){ gsap.to(nm, {yPercent:-110, duration:.4, ease:"power2.in", onComplete:function(){ nm.textContent = L.name(p) + " · " + L.money(L.st(p).price); gsap.fromTo(nm, {yPercent:110}, {yPercent:0, duration:.7, ease:"expo.out"}); }}); }
      else nm.textContent = L.name(p) + " · " + L.money(L.st(p).price);
      $$("#hidx button").forEach(function(b, j){ b.classList.toggle("on", j === i); });
      runBar();
    }
    function runBar(){
      if (!G || RM) return;
      prog && prog.kill();
      $$("#hidx b").forEach(function(b){ gsap.set(b, {scaleX:0}); });
      var b = $$("#hidx b")[slide];
      prog = gsap.to(b, {scaleX:1, duration:6, ease:"none", onComplete:function(){ setSlide((slide + 1) % S.length); }});
      if (!$("#hidx") || getComputedStyle($("#hidx")).display === "none"){ prog.kill(); prog = gsap.delayedCall(6, function(){ setSlide((slide + 1) % S.length); }); }
    }
    $$("#hidx button").forEach(function(b){ b.addEventListener("click", function(){ setSlide(+b.getAttribute("data-slide")); }); });
    media.addEventListener("click", function(){ L.travelFrom = null; location.hash = "#p-" + S[slide].id; });
    kill.push(function(){ prog && prog.kill(); });

    /* lineup floating image */
    var lf = $("#lfloat");
    document.body.appendChild(lf);
    kill.push(function(){ lf.remove(); });
    if (G && L.fine && !RM){
      var qx = gsap.quickTo(lf, "x", {duration:.6, ease:"power3"}), qy = gsap.quickTo(lf, "y", {duration:.6, ease:"power3"}), qr = gsap.quickTo(lf, "rotation", {duration:.8, ease:"power3"});
      var lastX = 0, on = 0;
      var lu = $("#lineup");
      var mv = function(e){ qx(e.clientX + (L.lang === "ar" ? -170 : 170)); qy(e.clientY); qr(Math.max(-14, Math.min(14, (e.clientX - lastX) * .6))); lastX = e.clientX; };
      lu.addEventListener("pointermove", mv);
      $$(".lrow", lu).forEach(function(r){
        r.addEventListener("pointerenter", function(){
          var a = $("#lf1"), b = $("#lf2"), src = L.img(r.getAttribute("data-img"));
          on ^= 1; var show = on ? b : a, hide = on ? a : b; show.src = src; show.style.opacity = 1; hide.style.opacity = 0;
          gsap.to(lf, {opacity:1, scale:1, duration:.5, ease:"expo.out"});
        });
      });
      lu.addEventListener("pointerleave", function(){ gsap.to(lf, {opacity:0, scale:.6, duration:.4, ease:"power2.in"}); });
    }

    /* edition + forms */
    var wl = $("[data-form=wl]");
    wl.addEventListener("submit", function(e){ e.preventDefault(); wl.reset(); L.toast(t("onList")); });

    /* duo slider */
    var duoR = $("#duoR"), dn = $("#duoNavy"), dh = $("#duoH");
    function duo(v){ dn.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)"; dh.style.left = v + "%"; }
    duoR.addEventListener("input", function(){ duo(+duoR.value); }); duo(50);

    /* cylinder geometry */
    var cyl = $("#cyl"), cards = $$(".cc", cyl);
    function cylLayout(){ var w = cyl.offsetWidth, R = Math.round((w / 2) / Math.tan(Math.PI / cards.length) + (isDesk() ? 60 : 30));
      cards.forEach(function(c, i){ c.style.transform = "rotateY(" + (i * 360 / cards.length) + "deg) translateZ(" + R + "px)"; }); cyl._R = R; }
    cylLayout(); window.addEventListener("resize", cylLayout); kill.push(function(){ window.removeEventListener("resize", cylLayout); });

    if (gx) gx.add(function(){
      if (RM || !window.ScrollTrigger) return;
      /* pre-intro states */
      if (!introDone){ gsap.set("#hmedia", {clipPath:"inset(100% 0% 0% 0%)"}); gsap.set(".hero-copy > *, .hero-idx button, .hero-cap", {opacity:0, y:30}); }
      /* hero scroll + parallax */
      ScrollTrigger.create({trigger:"#hero", start:"top top", end:"bottom top", scrub:true, onUpdate:function(s){ gl && gl.scroll(s.progress); }});
      if (isDesk()){
        gsap.to(".hero-title .l1", {xPercent:-30, ease:"none", scrollTrigger:{trigger:"#hero", start:"top top", end:"bottom top", scrub:true}});
        gsap.to(".hero-title .l2", {xPercent:30, ease:"none", scrollTrigger:{trigger:"#hero", start:"top top", end:"bottom top", scrub:true}});
        gsap.to("#hmedia", {yPercent:-12, scale:1.12, ease:"none", scrollTrigger:{trigger:"#hero", start:"top top", end:"bottom top", scrub:true}});
        gsap.to(".hero-side, .hero-cap", {opacity:0, ease:"none", scrollTrigger:{trigger:"#hero", start:"10% top", end:"45% top", scrub:true}});
        if (L.fine){
          var h = $("#hero");
          var a1 = gsap.quickTo(".hero-title .l1", "x", {duration:1.2, ease:"power3"}), a2 = gsap.quickTo(".hero-title .l2", "x", {duration:1.2, ease:"power3"});
          var b1 = gsap.quickTo(".hero-title .l1", "y", {duration:1.2, ease:"power3"}), b2 = gsap.quickTo(".hero-title .l2", "y", {duration:1.2, ease:"power3"});
          var mr = gsap.quickTo("#hmedia", "rotationY", {duration:1.2, ease:"power3"}), mx = gsap.quickTo("#hmedia", "rotationX", {duration:1.2, ease:"power3"});
          gsap.set("#hmedia", {transformPerspective:1400});
          h.addEventListener("pointermove", function(e){ var px = e.clientX / innerWidth - .5, py = e.clientY / innerHeight - .5;
            a1(-px * 60); a2(px * 60); b1(-py * 30); b2(py * 30); mr(px * 10); mx(-py * 8); });
        }
      }
      /* marquee driven by scroll velocity */
      var mq = $("#mq"), mxv = 0, vel = 0, dir = 1, half = 0;
      var measure = function(){ half = mq.scrollWidth / 2; }; measure(); setTimeout(measure, 800);
      ScrollTrigger.create({trigger:".marq", start:"top bottom", end:"bottom top", onUpdate:function(s){ vel = s.getVelocity(); dir = s.direction; }});
      var tick = function(){ vel *= .92; mxv -= (1.1 + Math.min(Math.abs(vel) * .006, 14)) * dir; if (half){ if (mxv < -half) mxv += half; if (mxv > 0) mxv -= half; }
        mq.style.transform = "translate3d(" + mxv.toFixed(1) + "px,0,0) skewX(" + Math.max(-12, Math.min(12, -vel * .003)).toFixed(2) + "deg)"; };
      gsap.ticker.add(tick); kill.push(function(){ gsap.ticker.remove(tick); });
      /* lineup rows */
      gsap.from(".lrow", {yPercent:60, opacity:0, stagger:.08, duration:1.2, ease:"expo.out", scrollTrigger:{trigger:"#lineup", start:"top 85%"}});
      /* chapter */
      if (isDesk()){
        gsap.set(".chap-media .f2, .chap-media .f3", {clipPath:"inset(100% 0% 0% 0%)"});
        var tl = gsap.timeline({scrollTrigger:{trigger:"#chap", start:"top top", end:"+=230%", pin:true, scrub:1}});
        tl.to(".chap-media .f2", {clipPath:"inset(0% 0% 0% 0%)", duration:1, ease:"none"})
          .from(".chap-media .f2 img", {scale:1.35, duration:1, ease:"none"}, "<")
          .to(".chap-media .fr:first-child img", {scale:.9, opacity:.4, duration:1, ease:"none"}, "<")
          .to(".chap-step.s1", {opacity:0, y:-30, duration:.4}, "<.1").fromTo(".chap-step.s2", {opacity:0, y:30}, {opacity:1, y:0, duration:.4}, ">-.1")
          .to(".chap-bar i", {scaleX:.66, duration:1, ease:"none"}, "<-.5")
          .to(".chap-media .f3", {clipPath:"inset(0% 0% 0% 0%)", duration:1, ease:"none"})
          .from(".chap-media .f3 img", {scale:1.35, duration:1, ease:"none"}, "<")
          .to(".chap-step.s2", {opacity:0, y:-30, duration:.4}, "<.1").fromTo(".chap-step.s3", {opacity:0, y:30}, {opacity:1, y:0, duration:.4}, ">-.1")
          .to(".chap-bar i", {scaleX:1, duration:1, ease:"none"}, "<-.5");
        gsap.from(".chap-media", {rotateY:-25, rotateX:8, scale:.85, transformPerspective:1600, ease:"none", scrollTrigger:{trigger:"#chap", start:"top bottom", end:"top top", scrub:1}});
      }
      /* duo hint */
      ScrollTrigger.create({trigger:"#duo", start:"top 60%", once:true, onEnter:function(){
        var o = {v:50}; gsap.timeline().to(o, {v:18, duration:.9, ease:"power2.inOut", onUpdate:function(){ duo(o.v); duoR.value = o.v; }})
          .to(o, {v:82, duration:1.2, ease:"power2.inOut", onUpdate:function(){ duo(o.v); duoR.value = o.v; }})
          .to(o, {v:50, duration:.9, ease:"power2.inOut", onUpdate:function(){ duo(o.v); duoR.value = o.v; }}); }});
      gsap.from(".duo .lab .H", {yPercent:60, opacity:0, duration:1.2, ease:"expo.out", scrollTrigger:{trigger:"#duo", start:"top 70%"}});
      /* cylinder */
      if (isDesk()){
        gsap.fromTo("#cyl", {rotateY:0, rotateX:-6}, {rotateY:-360 + 45, rotateX:6, ease:"none", scrollTrigger:{trigger:"#cylsec", start:"top top", end:"+=180%", pin:true, scrub:1}});
      } else {
        gsap.fromTo("#cyl", {rotateY:40}, {rotateY:-280, ease:"none", scrollTrigger:{trigger:"#cylsec", start:"top bottom", end:"bottom top", scrub:1}});
      }
      gsap.from(".cyl-txt .H", {scale:.6, opacity:0, ease:"none", scrollTrigger:{trigger:"#cylsec", start:"top 80%", end:"top 20%", scrub:1}});
      /* edition parallax */
      gsap.fromTo("#edimg", {yPercent:-7}, {yPercent:7, ease:"none", scrollTrigger:{trigger:".edition", start:"top bottom", end:"bottom top", scrub:true}});
      gsap.from(".ed-media", {clipPath:"inset(0% 0% 100% 0%)", duration:1.6, ease:"expo.inOut", scrollTrigger:{trigger:".edition", start:"top 75%"}});
      headReveal(document); cardsReveal($("#hgrid"));
      gsap.from(".cat", {y:80, opacity:0, rotateX:-20, transformPerspective:1200, stagger:.08, duration:1.2, ease:"expo.out", scrollTrigger:{trigger:"#cats", start:"top 88%"}, clearProps:"transform,opacity"});
    });
    if (gx) kill.push(function(){ gx.revert(); });

    function intro(){
      if (introDone) return; introDone = true;
      if (!G || RM){ return; }
      var ch = [];
      $$(".hero-title .ln").forEach(function(el){ ch = ch.concat(split(el)); });
      gsap.from(ch, {yPercent:115, rotate:L.lang === "ar" ? 0 : 8, duration:1.5, ease:"expo.out", stagger:.045});
      gsap.to("#hmedia", {clipPath:"inset(0% 0% 0% 0%)", duration:1.6, ease:"expo.inOut", delay:.1});
      gsap.to(".hero-copy > *, .hero-idx button, .hero-cap", {opacity:1, y:0, duration:1.1, ease:"expo.out", stagger:.07, delay:.7, onComplete:runBar});
    }
    if (!G || RM) runBar();
    return {cleanup:function(){ kill.forEach(function(f){ try { f(); } catch(e){} }); }, intro:intro, enter:function(){ if (L.loaded) intro(); }};
  }};
};

/* ---------------- SHOP ---------------- */
var KINDS = {
  "shop":{k:"all", f:function(){ return true; }},
  "dresses":{k:"dresses", f:function(p){ return L.st(p).cat === "dresses"; }},
  "sets":{k:"sets", f:function(p){ return L.st(p).cat === "sets"; }},
  "navy-edit":{k:"navyEdit", f:function(p){ return p.edit === "navy"; }},
  "light-edit":{k:"lightEdit", f:function(p){ return p.edit === "light"; }}
};
V.shop = function(r){
  var html = '<section class="g"><div class="w"><div class="shop-hd"><div class="kick mono">' + t("court") + '</div>' +
    '<h1 class="H" id="shopT"><span id="shopTt">' + t(KINDS[r.kind].k) + '</span><sup id="shopN">0</sup></h1><p class="mute" style="max-width:44ch">' + t("shopP") + '</p></div>' +
    '<div class="bar" id="bar">' + Object.keys(KINDS).map(function(k){ return '<button type="button" class="chip' + (k === r.kind ? " on" : "") + '" data-kind="' + k + '">' + t(KINDS[k].k) + '</button>'; }).join("") +
      '<span class="sp"></span><div class="sizes-f" role="group" aria-label="' + t("size") + '">' + L.SIZES.map(function(z){ return '<button type="button" data-fsize="' + z + '">' + z + '</button>'; }).join("") + '</div>' +
      '<select id="sort" aria-label="' + t("sort") + '"><option value="cur">' + t("curated") + '</option><option value="asc">' + t("lowHigh") + '</option><option value="desc">' + t("highLow") + '</option></select></div>' +
    '<div class="grid g3" id="sgrid">' + L.P.map(function(p){ return L.card(p); }).join("") + '</div>' +
    '<div class="empty" id="sempty" hidden><span class="H">' + t("soldOut") + '</span><button type="button" class="btn" data-reset>' + t("allSizes") + '</button></div>' +
  '</div></section>';
  return {title:t(KINDS[r.kind].k), html:html, init:function(){
    var st = {kind:r.kind, size:null, sort:"cur"}, grid = $("#sgrid");
    function apply(anim){
      var K = KINDS[st.kind];
      var list = L.P.filter(function(p){ return K.f(p) && (!st.size || p.stock[st.size] > 0); });
      if (st.sort !== "cur") list.sort(function(a, b){ var d = L.st(a).price - L.st(b).price; return st.sort === "asc" ? d : -d; });
      else list.sort(function(a, b){ return (L.total(b) > 0) - (L.total(a) > 0); });
      var state = anim && G && window.Flip && !RM ? Flip.getState($$(".card", grid)) : null;
      $$(".card", grid).forEach(function(c){ c.style.display = "none"; });
      list.forEach(function(p){ var c = $('.card[data-id="' + p.id + '"]', grid); c.style.display = ""; grid.appendChild(c); });
      $("#shopN").textContent = list.length;
      $("#sempty").hidden = list.length > 0;
      $$("#bar [data-kind]").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-kind") === st.kind); });
      $$("#bar [data-fsize]").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-fsize") === st.size); });
      if (state) Flip.from(state, {duration:.8, ease:"expo.inOut", absolute:true, scale:true, stagger:.03,
        onEnter:function(els){ return gsap.fromTo(els, {opacity:0, scale:.8, y:40}, {opacity:1, scale:1, y:0, duration:.8, ease:"expo.out"}); },
        onLeave:function(els){ return gsap.to(els, {opacity:0, scale:.8, duration:.4}); }});
    }
    $("#bar").addEventListener("click", function(e){
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-kind")){
        var k = b.getAttribute("data-kind"); if (k === st.kind) return;
        st.kind = k; L.route.kind = k;
        try { history.replaceState(null, "", "#" + k); } catch(err){}
        L.markNav();
        var tt = $("#shopTt");
        if (G && !RM){ gsap.to(tt, {yPercent:-100, opacity:0, duration:.35, ease:"power2.in", onComplete:function(){ tt.textContent = t(KINDS[k].k); tt._split = 0; gsap.fromTo(tt, {yPercent:100, opacity:0}, {yPercent:0, opacity:1, duration:.7, ease:"expo.out"}); }}); }
        else tt.textContent = t(KINDS[k].k);
        apply(true);
      } else if (b.hasAttribute("data-fsize")){ var z = b.getAttribute("data-fsize"); st.size = st.size === z ? null : z; apply(true); }
    });
    $("#sort").addEventListener("change", function(e){ st.sort = e.target.value; apply(true); });
    $("[data-reset]").addEventListener("click", function(){ st.size = null; apply(true); });
    apply(false);
    $("#shopTt").style.display = "inline-block";
    return {enter:function(){
      if (!G || RM) return;
      riseChars($("#shopTt"));
      gsap.from("#bar > *", {y:20, opacity:0, stagger:.03, duration:.8, ease:"expo.out", delay:.2});
      gsap.from($$(".card", grid).filter(function(c){ return c.style.display !== "none"; }), {y:120, opacity:0, rotateX:-20, transformPerspective:1200, stagger:.08, duration:1.4, ease:"expo.out", delay:.25, clearProps:"transform,opacity"});
    }};
  }};
};

/* ---------------- PRODUCT ---------------- */
function cutoff(){
  var now = new Date(), dxb = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000), cut = new Date(dxb); cut.setHours(14, 0, 0, 0);
  var ms = cut - dxb;
  if (ms > 0){ var h = Math.floor(ms / 3600000), m = Math.floor(ms % 3600000 / 60000);
    return '<b>' + t("todayDxb") + '</b><span class="live"><i></i>' + t("orderWithin") + ' ' + (L.lang === "ar" ? h + " س " + m + " د" : h + " h " + m + " min") + '</span>'; }
  return '<b>' + t("tomorrow") + '</b>';
}
V.product = function(r){
  var p = L.byId(r.id), s = L.st(p), sib = L.sib(p), H = s.hot;
  var partner = L.byId(s.cat === "sets" ? (p.edit === "navy" ? "knot-navy" : "pleat-white") : (p.edit === "navy" ? "set-navy" : "set-white"));
  var also = L.P.filter(function(q){ return q.s !== p.s; }).sort(function(a, b){ return (b.edit === p.edit) - (a.edit === p.edit); }).slice(0, 4);
  var gal = p.im.slice(2).map(function(n, i){ return '<div class="im" data-lbi="' + (i + 2) + '" data-cursor="' + t("view") + '"><img src="' + L.img(n) + '" alt="' + L.esc(s.en + ", " + p.c.en + ", view " + (i + 3)) + '" loading="lazy"></div>'; }).join("");
  if (p.im.length - 2 === 1) gal += '<div class="im" data-lbi="1"><img src="' + L.img(p.im[1]) + '" alt="" loading="lazy"></div>';
  var szSel = function(q, id){ return '<select id="' + id + '" class="chip" aria-label="' + t("size") + '">' + L.SIZES.map(function(z){ return '<option value="' + z + '"' + (q.stock[z] ? "" : " disabled") + '>' + z + (q.stock[z] ? "" : " · " + t("soldOut")) + '</option>'; }).join("") + '</select>'; };
  var firstSz = function(q){ return L.SIZES.filter(function(z){ return q.stock[z]; })[0]; };
  var html =
  '<section class="pdp">' +
    '<div class="pg">' +
      '<div class="main" id="pmain" data-cursor="' + t("drag") + '"><div class="spin" id="spin"><div class="face"><img id="pfront" src="' + L.img(p.im[0]) + '" alt="' + L.esc(s.en + " in " + p.c.en + ", front") + '"></div><div class="face bk"><img src="' + L.img(p.im[1]) + '" alt="' + L.esc(s.en + " in " + p.c.en + ", second view") + '"></div></div>' +
        '<span class="hot" id="phot" tabindex="0" style="left:' + H.x + '%;top:' + H.y + '%">+<span class="tip">' + L.tx(H) + '</span></span>' +
        '<span class="hint">' + L.I.turn + '<span class="hint-d">' + t("dragTurn") + '</span><span class="hint-m">Tap to turn</span></span></div>' + gal +
    '</div>' +
    '<div class="pg-dots" id="pgd" aria-hidden="true">' + p.im.slice(1).map(function(_, i){ return '<i class="' + (i ? "" : "on") + '"></i>'; }).join("") + '</div>' +
    '<div class="pi" id="pi">' +
      '<span class="crumb"><a class="ulink" href="#shop">' + t("shop") + '</a> / <a class="ulink" href="#' + s.cat + '">' + t(s.cat) + '</a> / ' + s.code + '</span>' +
      '<h1 class="H" id="pname"><span>' + s[L.lang] + '</span><em>' + s.verb[L.lang] + '.</em></h1>' +
      '<div class="price"><b>' + L.money(s.price) + '</b><span>' + t("inclVat") + '</span></div>' +
      '<span style="font-size:13px" class="mute">' + t("payIn4") + ' ' + L.money(Math.round(s.price / 4)) + ' ' + t("with") + ' <span class="tabby">tabby</span></span>' +
      '<div class="prow"><span class="mono">' + t("colour") + ' · ' + L.tx(p.c) + '</span><span class="mono mute">' + sib.length + '</span></div>' +
      '<div class="colours">' + sib.map(function(q){ return '<a href="#p-' + q.id + '" class="' + (q.id === p.id ? "on" : "") + '" aria-label="' + L.esc(L.tx(q.c)) + '"><img src="' + L.img(q.im[0]) + '" alt=""></a>'; }).join("") + '</div>' +
      '<div class="prow"><span class="mono">' + t("size") + ' · <span id="selsz">—</span></span><button type="button" class="mono ulink" data-sizeguide>' + t("sizeGuide") + '</button></div>' +
      '<div class="szs" id="szs">' + L.SIZES.map(function(z){ var n = p.stock[z]; return '<button type="button" data-sz="' + z + '" class="' + (n ? "" : "out") + '" aria-label="' + z + (n ? "" : ", " + t("soldOut")) + '">' + z + (n && n <= 2 ? '<small>' + n + ' ' + t("left") + '</small>' : "") + '</button>'; }).join("") + '</div>' +
      '<div class="addrow"><button type="button" class="btn atb" id="atb"><span class="lbl">' + (L.total(p) ? t("addBag") : t("notify")) + '</span><span class="lbl2" id="atb2">' + t("adding") + '</span></button>' +
        '<button type="button" class="wishbig" data-wish="' + p.id + '" aria-pressed="false" aria-label="' + t("wish") + '">' + L.I.heart + '</button></div>' +
      '<button type="button" class="apay" id="apay">Apple Pay</button>' +
      '<div class="dl" id="dl">' + cutoff() + '<span class="mute">' + t("uae") + '</span></div>' +
      '<div class="acc">' +
        '<details open><summary>' + t("desc") + '<i></i></summary><div class="ab"><p>' + L.tx(s.desc) + '</p></div></details>' +
        '<details><summary>' + t("details") + '<i></i></summary><div class="ab"><ul>' + s.pts[L.lang].map(function(x){ return "<li>" + x + "</li>"; }).join("") + '</ul><span class="mono mute">' + s.code + '</span></div></details>' +
        '<details><summary>' + t("fit") + '<i></i></summary><div class="ab"><p>' + t("fitP") + '</p></div></details>' +
        '<details><summary>' + t("fabric") + '<i></i></summary><div class="ab"><p>' + t("fabricP") + '</p></div></details>' +
        '<details><summary>' + t("delivery") + '<i></i></summary><div class="ab"><p>' + t("deliveryP") + '</p></div></details>' +
      '</div>' +
      '<button type="button" class="wa" data-toast="s4p">' + L.I.wa + '<span class="ulink">' + t("askWa") + '</span></button>' +
    '</div>' +
  '</section>' +
  (partner ? '<section class="g ctl"><div class="w"><div class="kick mono">' + t("court") + '</div><h2 class="H" data-rise>' + t("ctl") + '</h2>' +
    '<div class="look"><div class="lk"><img src="' + L.img(p.im[0]) + '" alt=""><div style="display:grid;gap:8px"><b style="font-weight:500">' + s[L.lang] + '</b><span class="mute">' + L.tx(p.c) + ' · ' + L.money(s.price) + '</span>' + szSel(p, "lk1") + '</div></div>' +
    '<span class="plus">+</span><div class="lk"><img src="' + L.img(partner.im[0]) + '" alt="" data-href="#p-' + partner.id + '" style="cursor:pointer"><div style="display:grid;gap:8px"><b style="font-weight:500">' + L.name(partner) + '</b><span class="mute">' + L.tx(partner.c) + ' · ' + L.money(L.st(partner).price) + '</span>' + szSel(partner, "lk2") + '</div></div>' +
    '<button type="button" class="btn" id="addboth" data-mag>' + t("addBoth") + ' · ' + L.money(s.price + L.st(partner).price) + '</button></div></div></section>' : "") +
  '<section class="g" style="padding-bottom:120px"><div class="w"><div class="shead" style="padding-top:60px"><h2 class="H" data-rise style="font-size:clamp(50px,7vw,110px)">' + t("also") + '</h2></div><div class="grid">' + also.map(function(q){ return L.card(q); }).join("") + '</div></div></section>' +
  '<div class="sticky-buy" id="sbuy"><span style="font-size:13px"><b style="font-weight:500">' + s[L.lang] + '</b><br><span class="mute">' + L.money(s.price) + '</span></span><button type="button" class="btn" id="sbtn">' + t("addBag") + '</button></div>';

  return {title:s.en + " · " + p.c.en, html:html, init:function(){
    var size = null, kill = [];
    var fz = firstSz(p);
    if ($("#lk1") && fz) $("#lk1").value = fz;
    if ($("#lk2") && partner && firstSz(partner)) $("#lk2").value = firstSz(partner);
    function pick(z){
      if (!p.stock[z]){ L.notify(p.id, z); return; }
      size = z; $("#selsz").textContent = z;
      $$("#szs button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-sz") === z); });
      $("#atb .lbl").textContent = t("addBag") + " · " + z; $("#sbtn").textContent = t("addBag") + " · " + z;
    }
    $("#szs").addEventListener("click", function(e){ var b = e.target.closest("button"); if (b) pick(b.getAttribute("data-sz")); });
    function addNow(btn){
      if (!L.total(p)){ L.notify(p.id, null); return; }
      if (!size){
        L.toast(t("selectSize"));
        if (G) gsap.fromTo("#szs", {x:-10}, {x:0, duration:.6, ease:"elastic.out(1,.3)"});
        $("#szs").scrollIntoView && isDesk() || window.scrollTo({top:$("#szs").getBoundingClientRect().top + scrollY - 160, behavior:"smooth"});
        return;
      }
      var b = $("#atb"); b.classList.add("busy");
      var ok = L.add(p.id, size, $("#pfront"));
      setTimeout(function(){ if (ok){ $("#atb2").textContent = t("added") + " ✓"; b.classList.add("done"); } setTimeout(function(){ b.classList.remove("busy", "done"); $("#atb2").textContent = t("adding"); }, 1300); }, 500);
    }
    $("#atb").addEventListener("click", function(){ addNow(); });
    $("#sbtn").addEventListener("click", function(){ addNow(); });
    $("#apay").addEventListener("click", function(){ if (!size){ addNow(); return; } if (L.add(p.id, size, null, {silent:true})) location.hash = "#checkout"; });
    $$("[data-toast]").forEach(function(b){ b.addEventListener("click", function(){ L.toast(t(b.getAttribute("data-toast"))); }); });
    var ab = $("#addboth");
    if (ab) ab.addEventListener("click", function(){
      var z1 = $("#lk1").value, z2 = $("#lk2").value;
      var ok1 = L.add(p.id, z1, $(".look .lk img"), {silent:true});
      setTimeout(function(){ L.add(partner.id, z2, $$(".look .lk img")[1]); }, 250);
    });
    /* lightbox */
    var all = p.im.map(L.img);
    $$(".pg .im").forEach(function(el){ el.addEventListener("click", function(){ L.openLb(all, +el.getAttribute("data-lbi")); }); });
    /* delivery countdown */
    var iv = setInterval(function(){ var d = $("#dl"); if (d) d.innerHTML = cutoff() + '<span class="mute">' + t("uae") + '</span>'; }, 30000);
    kill.push(function(){ clearInterval(iv); });
    /* 3D drag-to-turn viewer */
    var spin = $("#spin"), main = $("#pmain"), hot = $("#phot"), ang = 0, v = 0, drag = null, raf;
    function setA(a){ spin.style.transform = "rotateY(" + a + "deg)"; var n = ((a % 360) + 360) % 360; hot.style.opacity = (n < 40 || n > 320) ? 1 : 0; }
    /* touch: tap turns the dress, horizontal swipe scrolls the gallery */
    var tapX = null;
    main.addEventListener("touchstart", function(e){ tapX = e.touches[0].clientX; }, {passive:true});
    main.addEventListener("touchend", function(e){
      if (tapX === null || e.target.closest(".hot")) return;
      if (Math.abs(e.changedTouches[0].clientX - tapX) < 8){ var to = Math.round(ang / 180) * 180 + 180;
        if (G){ o.a = ang; gsap.to(o, {a:to, duration:1, ease:"expo.inOut", onUpdate:function(){ ang = o.a; setA(ang); }}); } else { ang = to; setA(ang); } }
      tapX = null;
    }, {passive:true});
    var pg = $(".pg"), dots = $$("#pgd i");
    pg.addEventListener("scroll", function(){ var i = Math.round(pg.scrollLeft / (pg.clientWidth || 1)); dots.forEach(function(d, j){ d.classList.toggle("on", j === Math.abs(i)); }); }, {passive:true});
    main.addEventListener("pointerdown", function(e){ if (e.pointerType !== "mouse" || e.target.closest(".hot")) return; drag = {x:e.clientX, last:e.clientX}; main.setPointerCapture(e.pointerId); cancelAnimationFrame(raf); if (G) gsap.killTweensOf(o); });
    main.addEventListener("pointermove", function(e){ if (!drag) return; var dx = e.clientX - drag.last; drag.last = e.clientX; v = dx * .5; ang += v; setA(ang); });
    var o = {a:0};
    function release(){
      if (!drag) return; drag = null;
      var target = Math.round((ang + v * 8) / 180) * 180;
      if (G){ o.a = ang; gsap.to(o, {a:target, duration:1.1, ease:"elastic.out(1,.55)", onUpdate:function(){ ang = o.a; setA(ang); }}); } else { ang = target; setA(ang); }
    }
    main.addEventListener("pointerup", release); main.addEventListener("pointercancel", release);
    /* mobile sticky buy */
    if ("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(e){ $("#sbuy").classList.toggle("on", !e[0].isIntersecting && e[0].boundingClientRect.top < 0); });
      io.observe($("#atb")); kill.push(function(){ io.disconnect(); });
    }
    var sb = $("#sbuy"); document.body.appendChild(sb); kill.push(function(){ sb.remove(); });
    if (G && !RM && window.ScrollTrigger){
      headReveal(document); cardsReveal(document);
      $$(".pg .im").forEach(function(im){ gsap.from(im, {clipPath:"inset(100% 0% 0% 0%)", duration:1.4, ease:"expo.inOut", scrollTrigger:{trigger:im, start:"top 90%"}}); gsap.fromTo($("img", im), {scale:1.3}, {scale:1, ease:"none", scrollTrigger:{trigger:im, start:"top bottom", end:"bottom top", scrub:true}}); });
    }
    return {cleanup:function(){ kill.forEach(function(f){ f(); }); }, enter:function(fromTravel){
      if (!G || RM) return;
      riseChars($("#pname span"), fromTravel ? .1 : 0);
      gsap.from("#pname em", {opacity:0, x:L.lang === "ar" ? 40 : -40, duration:1.2, ease:"expo.out", delay:.35});
      gsap.from("#pi > *:not(h1)", {y:30, opacity:0, stagger:.045, duration:1, ease:"expo.out", delay:.2});
      o.a = 0; gsap.timeline({delay:.9}).to(o, {a:-28, duration:.9, ease:"power2.inOut", onUpdate:function(){ ang = o.a; setA(ang); }}).to(o, {a:0, duration:1.4, ease:"elastic.out(1,.5)", onUpdate:function(){ ang = o.a; setA(ang); }});
    }};
  }};
};

/* ---------------- WISHLIST ---------------- */
V.wishlist = function(){
  var list = L.wish.map(L.byId).filter(Boolean);
  var html = '<section class="g"><div class="w"><div class="ph"><div class="kick mono">LENO WEAR</div><h1 class="H" id="wt">' + t("wishT") + ' <sup class="mono red" style="font-size:14px;vertical-align:top">' + list.length + '</sup></h1></div>' +
    (list.length ? '<div class="grid g3" style="padding-bottom:120px">' + list.map(function(p){ return L.card(p); }).join("") + '</div>'
      : '<div class="empty" style="padding-bottom:140px"><img src="' + L.KISS + '" alt="" style="width:80px"><span class="H">' + t("wishEmpty") + '</span><p class="mute">' + t("wishEmptyP") + '</p><a class="btn" href="#shop" data-mag>' + t("all") + '</a></div>') +
  '</div></section>';
  return {title:t("wishT"), html:html, init:function(){ return {enter:function(){ if (!G || RM) return; gsap.from(".ph .H, .empty > *", {y:60, opacity:0, stagger:.06, duration:1.1, ease:"expo.out"}); gsap.from(".grid .card", {y:90, opacity:0, stagger:.07, duration:1.2, ease:"expo.out", clearProps:"all"}); }}; }};
};

/* ---------------- CHECKOUT ---------------- */
var EMIRATES = [["Dubai","دبي"],["Abu Dhabi","أبوظبي"],["Sharjah","الشارقة"],["Ajman","عجمان"],["Umm Al Quwain","أم القيوين"],["Ras Al Khaimah","رأس الخيمة"],["Fujairah","الفجيرة"]];
V.checkout = function(){
  if (!L.bag.length) return {title:t("coT"), noFooter:false, html:'<section class="g"><div class="w empty" style="min-height:70svh;align-content:center"><img src="' + L.KISS + '" alt="" style="width:80px"><span class="H">' + t("empty") + '</span><a class="btn" href="#shop">' + t("all") + '</a></div></section>'};
  var inp = function(id, k, type, cls){ return '<div class="inp ' + (cls || "") + '"><input id="' + id + '" type="' + (type || "text") + '" placeholder=" " autocomplete="on"><label for="' + id + '">' + t(k) + '</label></div>'; };
  var html = '<section class="co">' +
    '<div class="co-l"><h1 class="H">' + t("coT") + '</h1>' +
      '<div class="demo-note">' + t("demoPay") + '</div>' +
      '<div class="step"><span class="mono mute">' + t("express") + '</span><div class="xp"><button type="button" class="ap" data-pay="apple">Apple Pay</button><button type="button" class="tb" data-pay="tabby">tabby</button><button type="button" class="tm" data-pay="tamara">tamara</button></div><div class="or">' + t("orPay") + '</div></div>' +
      '<div class="step"><h3><span>01</span>' + t("contactT") + '</h3>' + inp("c-em", "email", "text") + '</div>' +
      '<div class="step"><h3><span>02</span>' + t("deliveryT") + '</h3><div class="fg">' + inp("c-nm", "fName", "text", "full") +
        '<div class="inp"><select id="c-emi">' + EMIRATES.map(function(e){ return '<option value="' + e[0] + '">' + e[L.lang === "ar" ? 1 : 0] + '</option>'; }).join("") + '</select><label for="c-emi">' + t("fEmirate") + '</label></div>' +
        inp("c-ar", "fArea") + inp("c-bd", "fBuilding", "text", "full") + inp("c-lm", "fLandmark", "text", "full") + '</div>' +
        '<div class="opt" id="speed"><label><input type="radio" name="spd" value="same" checked><span>' + t("sameDay") + '<small>' + t("sameDayP") + '</small></span><b id="sameFee"></b></label><label><input type="radio" name="spd" value="next"><span>' + t("nextDay") + '<small>' + t("nextDayP") + '</small></span><b>' + t("free") + '</b></label></div></div>' +
      '<div class="step"><h3><span>03</span>' + t("payT") + '</h3><div class="opt">' +
        '<label><input type="radio" name="pay" value="card" checked><span>' + t("card") + '<small>Visa · Mastercard · Amex</small></span><span></span></label>' +
        '<label><input type="radio" name="pay" value="tabby"><span><span class="tabby">tabby</span><small>' + t("tabbyP") + '</small></span><span></span></label>' +
        '<label><input type="radio" name="pay" value="tamara"><span>tamara<small>' + t("tamaraP") + '</small></span><span></span></label>' +
        '<label><input type="radio" name="pay" value="cod"><span>' + t("cod") + '<small>' + t("codP") + '</small></span><span></span></label></div></div>' +
      '<button type="button" class="btn block" id="place" style="height:60px" data-mag>' + t("place") + ' · <span id="ptot"></span></button>' +
    '</div>' +
    '<aside class="co-r"><div class="in"><span class="mono">' + t("summary") + '</span>' +
      L.bag.map(function(l){ var p = L.byId(l.id); return '<div class="sum-ln"><div class="th"><img src="' + L.img(p.im[0]) + '" alt=""><b>' + l.qty + '</b></div><span>' + L.name(p) + '<br><span class="mute">' + L.tx(p.c) + ' · ' + l.size + '</span></span><span>' + L.money(L.st(p).price * l.qty) + '</span></div>'; }).join("") +
      '<div class="sum-row"><span>' + t("subtotal") + '</span><span>' + L.money(L.bagTotal()) + '</span></div><div class="sum-row"><span>' + t("shipping") + '</span><span id="sfee"></span></div>' +
      '<div class="sum-row big"><span>' + t("total") + '</span><span id="stot"></span></div><span class="mute" style="font-size:12px">' + t("vatIncl") + '</span></div></aside>' +
  '</section>';
  return {title:t("coT"), noFooter:true, html:html, init:function(){
    var sub = L.bagTotal();
    function fee(){ var emi = $("#c-emi").value, same = $("input[name=spd][value=same]");
      same.disabled = emi !== "Dubai"; if (same.disabled && same.checked) $("input[name=spd][value=next]").checked = true;
      same.closest("label").style.opacity = same.disabled ? .45 : 1;
      var f = same.checked && sub < L.FREE ? 25 : 0;
      $("#sameFee").textContent = sub >= L.FREE ? t("free") : L.money(25);
      $("#sfee").textContent = f ? L.money(f) : t("free");
      $("#stot").textContent = L.money(sub + f); $("#ptot").textContent = L.money(sub + f);
      return f; }
    fee();
    $(".co-l").addEventListener("change", fee);
    function place(method){
      var req = ["c-em","c-nm","c-ar","c-bd"], bad = req.filter(function(id){ var el = $("#" + id); var b = !el.value.trim(); el.parentNode.classList.toggle("err", b); return b; });
      if (bad.length){ L.toast(t("required")); var el = $("#" + bad[0]); el.focus(); if (G) gsap.fromTo(el.parentNode, {x:-8}, {x:0, duration:.6, ease:"elastic.out(1,.3)"}); return; }
      var f = fee();
      L.lastOrder = {no:"LW-" + (Math.floor(Math.random() * 90000) + 10000), items:L.bag.slice(), total:sub + f, method:method || $("input[name=pay]:checked").value, name:$("#c-nm").value.trim().split(" ")[0]};
      L.clearBag();
      location.hash = "#confirmed";
    }
    $("#place").addEventListener("click", function(){ place(); });
    $$("[data-pay]").forEach(function(b){ b.addEventListener("click", function(){ place(b.getAttribute("data-pay")); }); });
    $$(".inp input").forEach(function(i){ i.addEventListener("input", function(){ i.parentNode.classList.remove("err"); }); });
    return {enter:function(){ if (!G || RM) return; gsap.from(".co-l > *", {y:40, opacity:0, stagger:.06, duration:1, ease:"expo.out"}); gsap.from(".co-r .in > *", {x:L.lang === "ar" ? -30 : 30, opacity:0, stagger:.05, duration:1, ease:"expo.out", delay:.2}); }};
  }};
};

/* ---------------- CONFIRMED ---------------- */
V.confirmed = function(){
  var o = L.lastOrder;
  if (!o) return {title:t("thanks"), html:'<section class="g"><div class="w empty" style="min-height:70svh;align-content:center"><img src="' + L.KISS + '" alt="" style="width:80px"><span class="H">' + t("keep") + '</span><a class="btn" href="#shop">' + t("all") + '</a></div></section>'};
  var html = '<section class="conf g"><div class="kissrain" id="rain"></div><div class="in">' +
    '<svg class="ck" viewBox="0 0 86 86" aria-hidden="true"><circle cx="43" cy="43" r="41"/><path d="M27 44l11 11 22-24"/></svg>' +
    '<span class="mono">' + t("orderNo") + ' ' + o.no + '</span><h1 class="H">' + t("thanks") + (o.name ? ", " + L.esc(o.name) : "") + '</h1><p class="mute" style="font-size:17px;max-width:44ch">' + t("confP") + '</p>' +
    '<div class="tl"><div class="on"><i></i>' + t("tl1") + '</div><div><i></i>' + t("tl2") + '</div><div><i></i>' + t("tl3") + '</div><div><i></i>' + t("tl4") + '</div></div>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px">' + o.items.map(function(l){ var p = L.byId(l.id); return '<img src="' + L.img(p.im[0]) + '" alt="" style="width:74px;aspect-ratio:3/4;object-fit:cover;border-radius:3px">'; }).join("") + '</div>' +
    '<b style="font-size:18px">' + t("total") + ' · ' + L.money(o.total) + '</b><span class="mute" style="font-size:12px">' + t("demoPay") + '</span>' +
    '<a class="btn" href="#shop" data-mag>' + t("keep") + '</a></div></section>';
  return {title:t("thanks"), html:html, init:function(){
    return {enter:function(){
      if (!G || RM) return;
      riseChars($(".conf .H"), .3);
      gsap.from(".conf .in > *:not(h1):not(svg)", {y:30, opacity:0, stagger:.07, duration:1, ease:"expo.out", delay:.5});
      var rain = $("#rain");
      for (var i = 0; i < 26; i++){
        var k = document.createElement("img"); k.src = L.KISS; k.alt = ""; rain.appendChild(k);
        gsap.set(k, {left:Math.random() * 100 + "%", rotation:Math.random() * 60 - 30, scale:.5 + Math.random() * .8});
        gsap.to(k, {y:innerHeight + 200, rotation:"+=" + (Math.random() * 180 - 90), duration:2.4 + Math.random() * 2.2, ease:"power1.in", delay:.2 + Math.random() * 1.2, opacity:0});
      }
    }};
  }};
};

V.notfound = function(){
  return {title:t("notFound"), html:'<section class="g"><div class="w empty" style="min-height:70svh;align-content:center"><img src="' + L.KISS + '" alt="" style="width:80px"><span class="H">' + t("notFound") + '</span><p class="mute">' + t("notFoundP") + '</p><a class="btn" href="#home">' + t("back") + '</a></div></section>'};
};

})();
