/* LENO WEAR store: data, state, i18n, chrome, overlays, router. */
(function(){
"use strict";
var L = window.LENO = {};
var mq = function(q){ return window.matchMedia ? matchMedia(q).matches : false; };
L.reduce = mq("(prefers-reduced-motion: reduce)");
L.fine = mq("(pointer: fine)");
L.G = typeof gsap !== "undefined";
if (L.G){ if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); if (window.Flip) gsap.registerPlugin(Flip); }
var $ = L.$ = function(s, r){ return (r || document).querySelector(s); };
var $$ = L.$$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

/* ---------------- data (from 2681401.xlsx) ---------------- */
L.STYLES = {
  pleat:{code:"YY9141", price:365, cat:"dresses", en:"The Pleat Dress", ar:"فستان الطيّات", verb:{en:"swings", ar:"يتمايل"},
    desc:{en:"Square neckline, wide straps and a bodice that dips into a V at the waist. Knife pleats swing with every step, and the back is cut wide open.",
          ar:"ياقة مربعة وحمالات عريضة وجزء علوي ينخفض على شكل V عند الخصر. طيّات حادة تتمايل مع كل خطوة، وظهر مفتوح بالكامل."},
    pts:{en:["Open back held by a band","Knife-pleated flared skirt","V-shaped front waist"], ar:["ظهر مفتوح مثبّت بشريط","تنورة واسعة بطيّات حادة","خصر أمامي على شكل V"]},
    hot:{x:46, y:66, en:"Knife pleats", ar:"طيّات حادة"}},
  knot:{code:"YY8793", price:345, cat:"dresses", en:"The Knot Dress", ar:"فستان العقدة", verb:{en:"ties", ar:"يُعقد"},
    desc:{en:"A sleeveless crew-neck dress with a wrap skirt that ties at the hip and opens as you move. Inner shorts underneath, and a low scoop back.",
          ar:"فستان بلا أكمام بياقة دائرية وتنورة ملفوفة تُربط عند الورك وتنفتح مع حركتك. شورت داخلي وظهر بفتحة منخفضة."},
    pts:{en:["Self-tie wrap skirt","Inner shorts","Low scoop back"], ar:["تنورة ملفوفة تُربط ذاتياً","شورت داخلي","ظهر بفتحة منخفضة"]},
    hot:{x:58, y:52, en:"Self-tie wrap", ar:"عقدة تُربط ذاتياً"}},
  tulle:{code:"YY9091", price:395, cat:"dresses", en:"The Tulle Dress", ar:"فستان التول", verb:{en:"floats", ar:"ينساب"},
    desc:{en:"A racer-back bodice with a square neckline over a layered tulle skirt with a piped hem. Inner shorts underneath.",
          ar:"جزء علوي بظهر رياضي وياقة مربعة فوق تنورة من طبقات التول بحافة مُحدّدة. مع شورت داخلي."},
    pts:{en:["Layered tulle skirt","Racer back","Inner shorts"], ar:["تنورة بطبقات من التول","ظهر رياضي","شورت داخلي"]},
    hot:{x:50, y:60, en:"Layered tulle", ar:"طبقات التول"}},
  set:{code:"YY8047", price:595, cat:"sets", en:"The Studio Set", ar:"طقم الاستوديو", verb:{en:"zips", ar:"يُغلق"},
    desc:{en:"A cropped zip jacket with a stand collar and thumbholes over a square-neck bra, with high-waisted shorts and leggings. Final set contents to be confirmed.",
          ar:"جاكيت قصير بسحّاب وياقة مرتفعة وفتحات للإبهام فوق حمالة صدر بياقة مربعة، مع شورت وليقنز بخصر عالٍ. تفاصيل محتويات الطقم قيد التأكيد."},
    pts:{en:["Cropped zip jacket, thumbholes","Square-neck bra","High-waisted shorts and leggings"], ar:["جاكيت قصير بسحّاب وفتحات للإبهام","حمالة صدر بياقة مربعة","شورت وليقنز بخصر عالٍ"]},
    hot:{x:50, y:30, en:"Stand collar, full zip", ar:"ياقة مرتفعة وسحّاب كامل"}}
};
L.P = [
  {id:"pleat-white", s:"pleat", c:{en:"White", ar:"أبيض"}, hex:"#F4F3EF", edit:"light", stock:{S:2,M:3,L:1,XL:0}, im:["pleat-white-3","pleat-white-2","pleat-white-1","pleat-white-4"], hero:"h-pleat-white"},
  {id:"knot-navy", s:"knot", c:{en:"Navy", ar:"كحلي"}, hex:"#1F2642", edit:"navy", stock:{S:3,M:3,L:2,XL:1}, im:["knot-navy-2","knot-navy-4","knot-navy-3","knot-navy-1"], hero:"h-knot-navy"},
  {id:"set-navy", s:"set", c:{en:"Navy", ar:"كحلي"}, hex:"#1F2642", edit:"navy", stock:{S:1,M:3,L:2,XL:1}, im:["set-navy-3","set-navy-4","set-navy-1","set-navy-2","set-navy-5"], hero:"h-set-navy"},
  {id:"pleat-blue", s:"pleat", c:{en:"Blue", ar:"أزرق"}, hex:"#1F3279", edit:"navy", stock:{S:2,M:3,L:2,XL:1}, im:["pleat-blue-2","pleat-blue-3","pleat-blue-crop","pleat-blue-1"], hero:"h-pleat-blue"},
  {id:"knot-sand", s:"knot", c:{en:"Sand", ar:"رملي"}, hex:"#D9D3C5", edit:"light", stock:{S:2,M:3,L:2,XL:0}, im:["knot-sand-1","knot-sand-3","knot-sand-2","knot-sand-4"]},
  {id:"set-white", s:"set", c:{en:"White", ar:"أبيض"}, hex:"#F2F1EC", edit:"light", stock:{S:1,M:2,L:2,XL:1}, im:["set-white-3","set-white-4","set-white-1","set-white-2"], hero:"h-set-white"},
  {id:"tulle-ivory", s:"tulle", c:{en:"Ivory", ar:"عاجي"}, hex:"#EEEADB", edit:"light", stock:{S:0,M:1,L:0,XL:0}, im:["tulle-ivory-1","tulle-ivory-2","tulle-ivory-lips","tulle-ivory-3"], hero:"h-tulle-ivory"}
];
L.SIZES = ["S","M","L","XL"];
L.FREE = 600;
L.byId = function(id){ for (var i = 0; i < L.P.length; i++) if (L.P[i].id === id) return L.P[i]; return null; };
L.sib = function(p){ return L.P.filter(function(q){ return q.s === p.s; }); };
L.st = function(p){ return L.STYLES[p.s]; };
L.total = function(p){ var n = 0; for (var k in p.stock) n += p.stock[k]; return n; };
L.img = function(n){ return "p/" + n + ".webp"; };

/* ---------------- i18n ---------------- */
var T = {
  shop:["Shop","تسوقي"], all:["Shop All","تسوقي الكل"], dresses:["Dresses","فساتين"], sets:["Sets","أطقم"], navyEdit:["Navy Edit","مجموعة الكحلي"], lightEdit:["Light Edit","مجموعة الألوان الفاتحة"],
  court:["Court 01","كورت 01"], search:["Search","بحث"], wish:["Wishlist","المفضلة"], bag:["Bag","الحقيبة"], menu:["Menu","القائمة"], close:["Close","إغلاق"],
  ann1:["Same-day delivery in Dubai","توصيل في نفس اليوم داخل دبي"], ann2:["Pay in 4 with Tabby or Tamara","ادفعي على 4 دفعات مع تابي أو تمارا"], ann3:["Free returns within 14 days","إرجاع مجاني خلال 14 يوماً"],
  heroL1:["Court","ساعات"], heroL2:["Hours","الملعب"], heroP:["Court-wear for the game","ملابس الملعب للمباراة"], heroP2:["and everything after.","وكل ما بعدها."],
  shopCourt:["Shop Court 01","تسوقي كورت 01"], shopNow:["Shop now","تسوقي الآن"], lineup:["The lineup","المجموعة"], lineupP:["Four styles, each built around one movement.","أربعة تصاميم، كل منها مبني على حركة واحدة."],
  ch1t:["The open back","الظهر المفتوح"], ch1a:["Knife pleats","طيّات حادة"], ch1ap:["Pleats that swing with every step, on court and off it.","طيّات تتمايل مع كل خطوة، داخل الملعب وخارجه."],
  ch1b:["The V waist","خصر على شكل V"], ch1bp:["The front waist dips into a V that lengthens the whole line.","ينخفض الخصر الأمامي على شكل V ليطيل القوام."],
  ch1c:["Cut wide open","ظهر مفتوح بالكامل"], ch1cp:["The back opens wide and is held in place by a single band.","ظهر مفتوح على اتساعه ومثبّت بشريط واحد."],
  shopWhite:["Shop White","تسوقي الأبيض"], shopBlue:["Shop Blue","تسوقي الأزرق"],
  navyH:["Navy hours","ساعات الكحلي"], lightH:["Light hours","ساعات الفاتح"], drag:["Drag","اسحبي"], explore:["Explore","اكتشفي"],
  cylT:["Four ways to wear it","أربع طرق لارتدائه"], cylS:["The Studio Set · Navy and White","طقم الاستوديو · كحلي وأبيض"], shopSet:["Shop the set","تسوقي الطقم"],
  gridT:["Shop Court 01","تسوقي كورت 01"], gridP:["Seven colourways. Small runs. When a size is gone, it is gone.","سبعة ألوان. كميات محدودة. عندما ينفد المقاس، ينفد."],
  edK:["Edition · Last piece","إصدار محدود · القطعة الأخيرة"], edT:["The Tulle Dress","فستان التول"], edP:["Ivory tulle over a racer-back bodice. One piece left in M. Join the list for the next release.","تول عاجي فوق جزء علوي بظهر رياضي. قطعة واحدة متبقية بمقاس M. انضمي إلى القائمة للإصدار القادم."],
  edBtn:["Join the list","انضمي للقائمة"], email:["Email or mobile","البريد الإلكتروني أو الجوال"], onList:["You are on the list","تمت إضافتك إلى القائمة"], viewLast:["View the last one","شاهدي القطعة الأخيرة"],
  s1:["Same-day Dubai","نفس اليوم في دبي"], s1p:["Order by 2 pm","اطلبي قبل الساعة 2 ظهراً"], s2:["Free returns","إرجاع مجاني"], s2p:["14 days, collected from you","خلال 14 يوماً، نستلمها منكِ"], s3:["Tabby · Tamara","تابي · تمارا"], s3p:["4 interest-free payments","4 دفعات بدون فوائد"], s4:["WhatsApp styling","تنسيق عبر واتساب"], s4p:["Real people, 10am to 10pm","فريق حقيقي، من 10 صباحاً حتى 10 مساءً"],
  fs:["First Serve","الإرسال الأول"], fsP:["Early access to every drop, by email or WhatsApp.","وصول مبكر لكل إصدار عبر البريد أو واتساب."], join:["Join","انضمي"],
  help:["Help","المساعدة"], track:["Track order","تتبع الطلب"], returns:["Returns","الإرجاع"], fit:["Fit & size","المقاس"], contact:["Contact","تواصلي معنا"], about:["About","عن العلامة"], clubs:["Clubs & teams","الأندية والفرق"],
  demo:["Demo store. Prices are placeholders and no orders are processed.","متجر تجريبي. الأسعار مبدئية ولا تتم معالجة أي طلبات."],
  items:["pieces","قطع"], addBag:["Add to bag","أضيفي إلى الحقيبة"], adding:["Adding…","جارٍ الإضافة…"], added:["Added","تمت الإضافة"], selectSize:["Select a size","اختاري المقاس"], soldOut:["Sold out","نفد"], notify:["Notify me","أعلميني"], left:["left","متبقٍ"], lastOne:["Last one","القطعة الأخيرة"], fewLeft:["Few left","كمية قليلة"],
  colour:["Colour","اللون"], size:["Size","المقاس"], sizeGuide:["Size guide","دليل المقاسات"], inclVat:["incl. VAT","شامل الضريبة"], payIn4:["or 4 payments of","أو 4 دفعات بقيمة"], with:["with","مع"],
  todayDxb:["Arrives today in Dubai","يصلك اليوم في دبي"], orderWithin:["Order within","اطلبي خلال"], tomorrow:["Arrives tomorrow in Dubai","يصلك غداً في دبي"], uae:["Next day to all other emirates","اليوم التالي لباقي الإمارات"],
  desc:["Description","الوصف"], details:["Details","التفاصيل"], fabric:["Fabric & care","القماش والعناية"], fabricP:["Fabric composition and care instructions will be added once confirmed by the supplier.","سيتم إضافة تركيبة القماش وتعليمات العناية بعد تأكيدها من المورد."],
  fitP:["Available in S, M, L and XL. A full size chart with measurements is coming soon.","متوفر بمقاسات S وM وL وXL. جدول المقاسات الكامل قريباً."], delivery:["Delivery & returns","التوصيل والإرجاع"],
  deliveryP:["Same-day delivery in Dubai on orders before 2 pm. Next-day delivery to all other emirates. Free returns within 14 days, collected from your door.","توصيل في نفس اليوم داخل دبي للطلبات قبل الساعة 2 ظهراً. توصيل في اليوم التالي لباقي الإمارات. إرجاع مجاني خلال 14 يوماً من باب منزلك."],
  askWa:["Ask a stylist on WhatsApp","اسألي منسّقة عبر واتساب"], dragTurn:["Drag to turn","اسحبي للتدوير"], ctl:["Complete the look","أكملي الإطلالة"], addBoth:["Add both","أضيفي الاثنين"], also:["You may also like","قد يعجبكِ أيضاً"],
  yourBag:["Your bag","حقيبتك"], empty:["Your bag is empty","حقيبتك فارغة"], emptyP:["Start with the Pleat Dress. It is the one everyone asks about.","ابدئي بفستان الطيّات، فهو الأكثر طلباً."],
  freeLeft:["away from free same-day delivery","تفصلك عن التوصيل المجاني في نفس اليوم"], freeOn:["Free same-day delivery unlocked","حصلتِ على توصيل مجاني في نفس اليوم"], remove:["Remove","إزالة"], subtotal:["Subtotal","المجموع الفرعي"], checkout:["Checkout","إتمام الطلب"], pairIt:["Pair it with","نسّقيه مع"], add:["Add","أضيفي"],
  wishT:["Wishlist","المفضلة"], wishEmpty:["Nothing saved yet","لا يوجد شيء محفوظ بعد"], wishEmptyP:["Tap the heart on any piece to keep it here.","اضغطي على القلب في أي قطعة لحفظها هنا."],
  searchPh:["Search","ابحثي"], popular:["Popular","الأكثر بحثاً"], noRes:["Nothing found. Try “white” or “dress”.","لا نتائج. جربي «أبيض» أو «فستان»."],
  sort:["Sort","ترتيب"], curated:["Curated","مختارات"], lowHigh:["Price: low to high","السعر: من الأقل"], highLow:["Price: high to low","السعر: من الأعلى"], allSizes:["All sizes","كل المقاسات"],
  shopP:["Court-wear in small runs. Seven colourways, four styles.","ملابس ملعب بكميات محدودة. سبعة ألوان وأربعة تصاميم."],
  coT:["Checkout","إتمام الطلب"], contactT:["Contact","التواصل"], deliveryT:["Delivery","التوصيل"], payT:["Payment","الدفع"], express:["Express checkout","دفع سريع"], orPay:["or pay another way","أو ادفعي بطريقة أخرى"],
  fName:["Full name","الاسم الكامل"], fEmirate:["Emirate","الإمارة"], fArea:["Area","المنطقة"], fBuilding:["Building, villa, apartment","المبنى، الفيلا، الشقة"], fLandmark:["Landmark (optional)","معلم قريب (اختياري)"],
  sameDay:["Same day · Dubai","نفس اليوم · دبي"], sameDayP:["Order before 2 pm","اطلبي قبل 2 ظهراً"], nextDay:["Next day","اليوم التالي"], nextDayP:["All emirates","جميع الإمارات"], free:["Free","مجاناً"],
  card:["Card","بطاقة"], cod:["Cash on delivery","الدفع عند الاستلام"], codP:["Confirmed by SMS","يتم التأكيد عبر رسالة"], tabbyP:["4 interest-free payments","4 دفعات بدون فوائد"], tamaraP:["Split in 4","قسّميها على 4"],
  place:["Place order","تأكيد الطلب"], demoPay:["Demo checkout: no payment is taken and no order is sent.","دفع تجريبي: لن يتم خصم أي مبلغ ولن يُرسل أي طلب."], summary:["Order summary","ملخص الطلب"], shipping:["Delivery","التوصيل"], total:["Total","الإجمالي"], vatIncl:["Including 5% VAT","شامل ضريبة 5%"],
  required:["Please fill in the highlighted fields","يرجى تعبئة الحقول المحددة"], thanks:["Thank you","شكراً لكِ"], confP:["Your order is confirmed. We have sent the details by email and WhatsApp.","تم تأكيد طلبك. أرسلنا التفاصيل عبر البريد وواتساب."],
  orderNo:["Order","رقم الطلب"], tl1:["Confirmed","مؤكد"], tl2:["Packed","تم التغليف"], tl3:["On the way","في الطريق"], tl4:["Delivered","تم التوصيل"], keep:["Keep shopping","تابعي التسوق"],
  notFound:["Out of bounds","خارج الملعب"], notFoundP:["This page does not exist.","هذه الصفحة غير موجودة."], back:["Back to home","العودة للرئيسية"],
  addedTo:["Added to your bag","أُضيفت إلى حقيبتك"], saved:["Saved to wishlist","حُفظت في المفضلة"], unsaved:["Removed from wishlist","أُزيلت من المفضلة"], maxStock:["No more stock in this size","لا يوجد مخزون إضافي بهذا المقاس"],
  front:["Front","أمام"], backV:["Back","خلف"], quick:["Quick add","إضافة سريعة"], view:["View","عرض"], editorial:["Court 01 · November 2026","كورت 01 · نوفمبر 2026"]
};
L.lang = "en";
L.t = function(k){ var v = T[k]; return v ? v[L.lang === "ar" ? 1 : 0] : k; };
L.tx = function(o){ return o ? (o[L.lang] || o.en) : ""; };
L.name = function(p){ return L.st(p)[L.lang]; };
L.money = function(n){ return L.lang === "ar" ? n.toLocaleString("en-US") + " د.إ" : "AED " + n.toLocaleString("en-US"); };
L.esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };

/* ---------------- icons ---------------- */
var sv = function(d, w){ return '<svg viewBox="0 0 24 24" width="' + (w || 20) + '" height="' + (w || 20) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
L.I = {
  search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
  heart: sv('<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z"/>'),
  bag: sv('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
  arrow: sv('<path d="M5 12h14M13 6l6 6-6 6"/>', 18),
  close: sv('<path d="M6 6l12 12M18 6 6 18"/>', 22),
  grid: sv('<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>'),
  turn: sv('<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>', 16),
  minus: sv('<path d="M6 12h12"/>', 14), plus: sv('<path d="M12 6v12M6 12h12"/>', 14),
  wa: sv('<path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1-1.2 1.8.8c-.2 1.3-1.2 2-2.6 1.8-2.7-.4-5.2-2.9-5.6-5.6-.2-1.4.5-2.4 1.8-2.6l.8 1.8z"/>', 18)
};
L.KISS = "p/kiss-print.svg";
L.LOGO = '<span class="kiss-m" aria-hidden="true"></span><span class="lw"><b>LENO WEAR</b><small>LEAVE YOUR MARK</small></span>';

/* ---------------- state ---------------- */
function load(k, d){ try { var v = JSON.parse(localStorage.getItem(k)); return v || d; } catch(e){ return d; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
L.bag = load("leno-bag", []).filter(function(l){ return L.byId(l.id); });
L.wish = load("leno-wish", []).filter(function(id){ return L.byId(id); });
L.bagCount = function(){ return L.bag.reduce(function(a, l){ return a + l.qty; }, 0); };
L.bagTotal = function(){ return L.bag.reduce(function(a, l){ return a + L.st(L.byId(l.id)).price * l.qty; }, 0); };
L.inBag = function(id, size){ var l = L.bag.filter(function(x){ return x.id === id && x.size === size; })[0]; return l ? l.qty : 0; };

L.toast = function(msg){
  var t = $("#toast"); t.innerHTML = '<img src="' + L.KISS + '" alt="" style="height:14px">' + L.esc(msg);
  t.classList.add("on"); clearTimeout(L._tt); L._tt = setTimeout(function(){ t.classList.remove("on"); }, 2400);
};

function bagTarget(){
  var m = window.innerWidth <= 900 ? $(".tabbar [data-open=bag]") : $(".hdr [data-open=bag]");
  return m || $(".hdr [data-open=bag]");
}
function popCounts(){
  $$("[data-cnt=bag]").forEach(function(c){ c.textContent = L.bagCount(); c.hidden = !L.bagCount(); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); });
}
L.syncCounts = function(){
  $$("[data-cnt=bag]").forEach(function(c){ c.textContent = L.bagCount(); c.hidden = !L.bagCount(); });
  $$("[data-cnt=wish]").forEach(function(c){ c.textContent = L.wish.length; c.hidden = !L.wish.length; });
  $$("[data-wish]").forEach(function(b){ b.setAttribute("aria-pressed", L.wish.indexOf(b.getAttribute("data-wish")) > -1 ? "true" : "false"); });
};

L.add = function(id, size, fromImg, opts){
  opts = opts || {};
  var p = L.byId(id); if (!p) return false;
  if ((p.stock[size] || 0) <= L.inBag(id, size)){ L.toast(L.t("maxStock")); return false; }
  var l = L.bag.filter(function(x){ return x.id === id && x.size === size; })[0];
  if (l) l.qty++; else L.bag.push({id:id, size:size, qty:1});
  save("leno-bag", L.bag);
  var finish = function(){ popCounts(); L.renderBag(); if (!opts.silent) setTimeout(function(){ L.openDrawer(); }, 120); };
  var tgt = bagTarget();
  if (fromImg && tgt && L.G && !L.reduce){
    var a = fromImg.getBoundingClientRect(), b = tgt.getBoundingClientRect();
    var f = document.createElement("div"); f.className = "flyer"; f.innerHTML = '<img src="' + (fromImg.currentSrc || fromImg.src) + '" alt="">';
    document.body.appendChild(f);
    var w = 80, sx = a.left + a.width / 2 - w / 2, sy = a.top + a.height / 2 - w * 0.66;
    gsap.set(f, {x:sx, y:sy, scale:Math.min(2.2, a.width / w), opacity:1});
    gsap.to(f, {x:b.left + b.width / 2 - w / 2, duration:.9, ease:"power1.inOut"});
    gsap.to(f, {keyframes:[{y:sy - 160, duration:.38, ease:"power2.out"}, {y:b.top + b.height / 2 - w * .66, duration:.52, ease:"power2.in"}]});
    gsap.to(f, {scale:.18, rotation:L.lang === "ar" ? -25 : 25, duration:.9, ease:"power2.in", onComplete:function(){ f.remove(); finish(); }});
  } else finish();
  return true;
};
L.setQty = function(i, q){ var l = L.bag[i]; if (!l) return; var p = L.byId(l.id); q = Math.max(0, Math.min(q, p.stock[l.size] || 0)); if (q === 0) L.bag.splice(i, 1); else l.qty = q; save("leno-bag", L.bag); L.renderBag(); L.syncCounts(); };
L.clearBag = function(){ L.bag = []; save("leno-bag", L.bag); L.renderBag(); L.syncCounts(); };
L.toggleWish = function(id){
  var i = L.wish.indexOf(id);
  if (i > -1){ L.wish.splice(i, 1); L.toast(L.t("unsaved")); } else { L.wish.push(id); L.toast(L.t("saved")); }
  save("leno-wish", L.wish); L.syncCounts();
  $$("[data-cnt=wish]").forEach(function(c){ c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); });
  if (L.route && L.route.name === "wishlist") L.rerender();
};

/* ---------------- shared components ---------------- */
L.card = function(p, cls){
  var s = L.st(p), tot = L.total(p);
  var badge = tot === 0 ? '<span class="badge">' + L.t("soldOut") + '</span>' : tot === 1 ? '<span class="badge red">' + L.t("lastOne") + '</span>' : tot <= 3 ? '<span class="badge">' + L.t("fewLeft") + '</span>' : "";
  var sizes = L.SIZES.map(function(z){ return '<button type="button" data-add="' + p.id + '" data-size="' + z + '"' + (p.stock[z] ? "" : " disabled") + ' aria-label="' + z + '">' + z + '</button>'; }).join("");
  var sw = L.sib(p).map(function(q){ return '<a href="#p-' + q.id + '" class="' + (q.id === p.id ? "on" : "") + '" style="background:' + q.hex + '" aria-label="' + L.esc(L.tx(q.c)) + '" data-travel></a>'; }).join("");
  return '<article class="card ' + (cls || "") + '" data-flip-id="' + p.id + '" data-id="' + p.id + '">' +
    '<div class="cm" role="link" tabindex="0" data-href="#p-' + p.id + '" data-cursor="' + L.t("view") + '" data-tilt>' +
      '<img class="a" src="' + L.img(p.im[0]) + '" alt="' + L.esc(s.en + " in " + p.c.en) + '" loading="lazy">' +
      '<img class="b" src="' + L.img(p.im[1]) + '" alt="" loading="lazy">' + badge +
      '<button type="button" class="wish" data-wish="' + p.id + '" aria-pressed="false" aria-label="' + L.t("wish") + '">' + L.I.heart + '</button>' +
      '<div class="quick"><span class="mono mute" style="font-size:9.5px">' + L.t("quick") + '</span><div class="r">' + sizes + '</div></div>' +
    '</div>' +
    '<div class="ci"><a class="nm" href="#p-' + p.id + '" data-travel>' + L.esc(s[L.lang]) + '<small>' + L.esc(L.tx(p.c)) + '</small></a><span class="pr">' + L.money(s.price) + '</span></div>' +
    '<div class="sws">' + sw + '</div></article>';
};

/* ---------------- chrome (header, overlays) ---------------- */
L.renderChrome = function(){
  var t = L.t;
  document.documentElement.lang = L.lang; document.documentElement.dir = L.lang === "ar" ? "rtl" : "ltr";
  $("#ann").innerHTML = ["ann1","ann2","ann3"].map(function(k, i){ return '<div class="' + (i === 0 ? "on" : "") + '">' + t(k) + '</div>'; }).join("");
  $("#hdr").innerHTML =
    '<nav class="l" aria-label="Primary">' +
      '<button class="burger" type="button" data-open="menu" aria-label="' + t("menu") + '"><i></i></button>' +
      '<a class="nl" href="#shop" data-mega>' + t("shop") + '</a><a class="nl" href="#dresses">' + t("dresses") + '</a><a class="nl" href="#sets">' + t("sets") + '</a><a class="nl" href="#story">Story</a>' +
    '</nav>' +
    '<a class="logo" href="#home" aria-label="LENO WEAR home">' + L.LOGO + '</a>' +
    '<nav class="r" aria-label="Utility">' +
      '<button class="nl ic hide-m" type="button" data-open="search" aria-label="' + t("search") + '">' + L.I.search + '<span>' + t("search") + '</span></button>' +
      '<a class="nl ic hide-m" href="#wishlist" aria-label="' + t("wish") + '">' + L.I.heart + '<span class="cnt" data-cnt="wish" hidden>0</span></a>' +
      '<button class="nl ic" type="button" data-open="bag" aria-label="' + t("bag") + '">' + L.I.bag + '<span>' + t("bag") + '</span><span class="cnt" data-cnt="bag" hidden>0</span></button>' +
    '</nav>' +
    '<div class="mega g" id="mega"><div class="big">' +
      '<a href="#shop" data-mimg="pleat-white-3">' + t("all") + '<sup>7</sup></a><a href="#dresses" data-mimg="knot-navy-2">' + t("dresses") + '<sup>5</sup></a><a href="#sets" data-mimg="set-navy-3">' + t("sets") + '<sup>2</sup></a><a href="#wishlist" data-mimg="tulle-ivory-lips">' + t("wish") + '</a>' +
    '</div><div class="sm"><span class="mono mute">' + t("court") + '</span><a class="ulink" href="#navy-edit" data-mimg="pleat-blue-2">' + t("navyEdit") + '</a><a class="ulink" href="#light-edit" data-mimg="set-white-3">' + t("lightEdit") + '</a>' +
      '<span class="mono mute" style="margin-top:18px">LENO WEAR</span><a class="ulink" href="#story">Our story</a><a class="ulink" href="#help">' + t("help") + '</a><span class="mute">' + t("s1") + ' · ' + t("s2") + '</span></div>' +
      '<a class="feat" href="#p-pleat-white"><img src="p/pleat-white-4.jpg" alt="" id="megaimg"><div class="cap"><span class="mono">' + t("court") + '</span><span class="H">' + L.name(L.byId("pleat-white")) + '</span></div></a>' +
    '</div>';
  $("#mmenu").innerHTML =
    '<div class="top g"><a class="logo" href="#home" style="color:var(--ivory)">' + L.LOGO + '</a><button type="button" data-close aria-label="' + t("close") + '">' + L.I.close + '</button></div>' +
    '<nav class="g"><a href="#shop">' + t("all") + '<small>07</small></a><a href="#dresses">' + t("dresses") + '<small>05</small></a><a href="#sets">' + t("sets") + '<small>02</small></a><a href="#navy-edit">' + t("navyEdit") + '</a><a href="#light-edit">' + t("lightEdit") + '</a><a href="#wishlist">' + t("wish") + '</a><a href="#story">Story</a><a href="#help">' + t("help") + '</a></nav>' +
    '<div class="foot g"><span class="mono" style="color:var(--mute)">LENO WEAR · Dubai</span><span class="mono" style="color:var(--mute)">AED · UAE</span></div>';
  $("#tabbar").innerHTML =
    '<a href="#shop">' + L.I.grid + '<span>' + t("shop") + '</span></a>' +
    '<button type="button" data-open="search">' + L.I.search + '<span>' + t("search") + '</span></button>' +
    '<a href="#wishlist" style="position:relative">' + L.I.heart + '<span>' + t("wish") + '</span></a>' +
    '<button type="button" data-open="bag" style="position:relative">' + L.I.bag + '<span>' + t("bag") + ' <b class="cnt" data-cnt="bag" hidden>0</b></span></button>';
  $("#srch .top").innerHTML = '<a class="logo" href="#home">' + L.LOGO + '</a><button type="button" data-close aria-label="' + t("close") + '">' + L.I.close + '</button>';
  $("#sq").placeholder = t("searchPh");
  $("#spop").innerHTML = '<span class="mono mute" style="align-self:center;margin-inline-end:6px">' + t("popular") + '</span>' + [["White","أبيض"],["Navy","كحلي"],["Dress","فستان"],["Set","طقم"],["Tulle","تول"]].map(function(w){ var v = L.lang === "ar" ? w[1] : w[0]; return '<button type="button" class="chip" data-q="' + v + '">' + v + '</button>'; }).join("");
  L.syncCounts(); L.renderBag(); L.markNav();
  bindMega();
};
L.markNav = function(){
  var h = location.hash || "#home";
  $$(".hdr .nl").forEach(function(a){ a.classList.toggle("on", a.getAttribute("href") === h); });
  $$(".tabbar a").forEach(function(a){ a.classList.toggle("on", a.getAttribute("href") === h); });
};

function bindMega(){
  var mega = $("#mega"), trig = $(".hdr [data-mega]"), tm;
  if (!mega || !trig) return;
  var open = function(){ clearTimeout(tm); tm = setTimeout(function(){ mega.classList.add("open"); }, 110); };
  var close = function(){ clearTimeout(tm); tm = setTimeout(function(){ mega.classList.remove("open"); }, 160); };
  trig.addEventListener("mouseenter", open); trig.addEventListener("mouseleave", close);
  mega.addEventListener("mouseenter", function(){ clearTimeout(tm); }); mega.addEventListener("mouseleave", close);
  mega.addEventListener("click", function(){ mega.classList.remove("open"); });
  $$("[data-mimg]", mega).forEach(function(a){
    a.addEventListener("mouseenter", function(){
      var img = $("#megaimg"), src = L.img(a.getAttribute("data-mimg"));
      if (img.getAttribute("src") === src) return;
      if (L.G) gsap.to(img, {opacity:0, duration:.2, onComplete:function(){ img.src = src; gsap.to(img, {opacity:1, duration:.4}); }}); else img.src = src;
    });
  });
}

/* bag drawer */
L.renderBag = function(){
  var t = L.t, body = $("#drbody"), ft = $("#drft"), ship = $("#drship");
  $("#drhd").innerHTML = '<span class="H">' + t("yourBag") + ' <sup class="mono" style="font-size:12px">' + L.bagCount() + '</sup></span><button type="button" data-close aria-label="' + t("close") + '">' + L.I.close + '</button>';
  if (!L.bag.length){
    ship.hidden = true; ft.hidden = true;
    body.innerHTML = '<div class="dr-empty"><img src="' + L.KISS + '" alt=""><span class="H" style="font-size:44px">' + t("empty") + '</span><p class="mute">' + t("emptyP") + '</p><a class="btn" href="#p-pleat-white" data-close>' + L.name(L.byId("pleat-white")) + '</a></div>';
    return;
  }
  ship.hidden = false; ft.hidden = false;
  var tot = L.bagTotal(), left = Math.max(0, L.FREE - tot);
  ship.innerHTML = '<span>' + (left ? "<b>" + L.money(left) + "</b> " + t("freeLeft") : t("freeOn")) + '</span><div class="meter' + (left ? "" : " full") + '"><i style="transform:scaleX(' + Math.min(1, tot / L.FREE) + ')"></i></div>';
  var html = L.bag.map(function(l, i){
    var p = L.byId(l.id), s = L.st(p);
    return '<div class="ln"><img src="' + L.img(p.im[0]) + '" alt="" data-href="#p-' + p.id + '"><div class="t"><b>' + s[L.lang] + '</b><span>' + L.tx(p.c) + ' · ' + l.size + '</span>' +
      '<div class="qty"><button type="button" data-qty="' + i + '" data-d="-1" aria-label="-">' + L.I.minus + '</button><span>' + l.qty + '</span><button type="button" data-qty="' + i + '" data-d="1" aria-label="+">' + L.I.plus + '</button></div>' +
      '<button type="button" class="rm" data-qty="' + i + '" data-d="x">' + t("remove") + '</button></div><span class="p">' + L.money(s.price * l.qty) + '</span></div>';
  }).join("");
  var first = L.byId(L.bag[0].id), sug = L.byId(first.s === "set" ? (first.edit === "navy" ? "knot-navy" : "pleat-white") : (first.edit === "navy" ? "set-navy" : "set-white"));
  if (sug && !L.bag.some(function(l){ return l.id === sug.id; })){
    var sz = L.SIZES.filter(function(z){ return sug.stock[z]; })[0];
    if (sz) html += '<div class="dr-sug"><img src="' + L.img(sug.im[0]) + '" alt=""><div style="font-size:13px"><span class="mute">' + t("pairIt") + '</span><br><b style="font-weight:500">' + L.name(sug) + '</b> · ' + L.tx(sug.c) + '</div><button type="button" class="add" data-add="' + sug.id + '" data-size="' + sz + '" data-silent>' + t("add") + ' ' + sz + '</button></div>';
  }
  body.innerHTML = html;
  ft.innerHTML = '<div class="tot"><span>' + t("subtotal") + ' <span class="mute" style="font-size:12px">' + t("inclVat") + '</span></span><b>' + L.money(tot) + '</b></div>' +
    '<button type="button" class="apay" data-go="#checkout">Apple Pay</button><a class="btn block" href="#checkout" data-close>' + t("checkout") + '</a>' +
    '<span class="mute" style="font-size:12px;text-align:center">' + t("payIn4") + ' ' + L.money(Math.round(tot / 4)) + ' ' + t("with") + ' <span class="tabby">tabby</span></span>';
};

/* overlays */
var openOv = null;
function lockScroll(on){ document.documentElement.style.overflow = on ? "hidden" : ""; if (L.lenis){ on ? L.lenis.stop() : L.lenis.start(); } }
L.openDrawer = function(){ closeAll(); $("#drawer").classList.add("open"); $("#scrim").classList.add("on"); lockScroll(true); openOv = "bag"; setTimeout(function(){ var b = $("#drhd button"); b && b.focus({preventScroll:true}); }, 400);
  if (L.G && !L.reduce) gsap.from("#drbody > *", {x:L.lang === "ar" ? -40 : 40, opacity:0, stagger:.06, duration:.7, ease:"expo.out", delay:.25}); };
L.openSearch = function(){ closeAll(); $("#srch").classList.add("open"); lockScroll(true); openOv = "search"; L.runSearch(); setTimeout(function(){ $("#sq").focus(); }, 300); };
L.openMenu = function(){ closeAll(); $("#mmenu").classList.add("open"); lockScroll(true); openOv = "menu";
  if (L.G && !L.reduce) gsap.from("#mmenu nav a", {yPercent:80, opacity:0, stagger:.05, duration:.9, ease:"expo.out", delay:.2}); };
function closeAll(){
  $("#drawer").classList.remove("open"); $("#scrim").classList.remove("on"); $("#srch").classList.remove("open"); $("#mmenu").classList.remove("open"); $("#lb").classList.remove("open");
  var m = $("#mega"); m && m.classList.remove("open");
  if (openOv) lockScroll(false); openOv = null;
}
L.closeAll = closeAll;

L.runSearch = function(){
  var q = $("#sq").value.trim().toLowerCase(), res = $("#sres");
  var list = L.P.filter(function(p){
    if (!q) return true;
    var s = L.st(p), hay = [s.en, s.ar, p.c.en, p.c.ar, s.cat, s.cat === "dresses" ? "dress فستان فساتين tennis padel" : "set طقم studio", p.edit, s.code, s.verb.en].join(" ").toLowerCase();
    return q.split(/\s+/).every(function(w){ return hay.indexOf(w) > -1; });
  });
  res.innerHTML = list.length ? '<div class="grid">' + list.map(function(p){ return L.card(p); }).join("") + '</div>' : '<p class="mute" style="font-size:18px;padding-top:20px">' + L.t("noRes") + '</p>';
  L.syncCounts();
  if (L.G && !L.reduce) gsap.from("#sres .card", {y:40, opacity:0, stagger:.04, duration:.7, ease:"expo.out"});
};

/* lightbox */
L.lb = {list:[], i:0};
L.openLb = function(list, i){ L.lb.list = list; L.lb.i = i; $("#lbimg").src = list[i]; closeAll(); $("#lb").classList.add("open"); lockScroll(true); openOv = "lb"; };
function lbStep(d){ var l = L.lb; l.i = (l.i + d + l.list.length) % l.list.length; var im = $("#lbimg");
  if (L.G) gsap.fromTo(im, {opacity:0, x:d * 40}, {opacity:1, x:0, duration:.5, ease:"expo.out"}); im.src = l.list[l.i]; }

/* global delegated events */
document.addEventListener("click", function(e){
  var el;
  if ((el = e.target.closest("[data-lang]"))){ L.setLang(L.lang === "ar" ? "en" : "ar"); return; }
  if ((el = e.target.closest("[data-open]"))){ var w = el.getAttribute("data-open"); if (w === "bag") L.openDrawer(); else if (w === "search") L.openSearch(); else L.openMenu(); return; }
  if ((el = e.target.closest("[data-wish]"))){ e.preventDefault(); e.stopPropagation(); L.toggleWish(el.getAttribute("data-wish")); return; }
  if ((el = e.target.closest("[data-add]"))){
    e.preventDefault(); e.stopPropagation();
    var card = el.closest(".card"), img = card ? card.querySelector(".cm img.a") : (el.closest(".dr-sug") ? el.closest(".dr-sug").querySelector("img") : null);
    L.add(el.getAttribute("data-add"), el.getAttribute("data-size"), img, {silent:el.hasAttribute("data-silent")});
    return;
  }
  if ((el = e.target.closest("[data-qty]"))){ var i = +el.getAttribute("data-qty"), d = el.getAttribute("data-d"); L.setQty(i, d === "x" ? 0 : L.bag[i].qty + (+d)); return; }
  if ((el = e.target.closest("[data-q]"))){ $("#sq").value = el.getAttribute("data-q"); L.runSearch(); return; }
  if ((el = e.target.closest("[data-go]"))){ closeAll(); location.hash = el.getAttribute("data-go"); return; }
  if ((el = e.target.closest("[data-href]"))){ var h = el.getAttribute("data-href"); var im = el.querySelector("img.a") || (el.tagName === "IMG" ? el : null); closeAll(); L.travelFrom = im && el.classList.contains("cm") ? im : null; if (location.hash === h) return; location.hash = h; return; }
  if ((el = e.target.closest("[data-close]"))){ closeAll(); return; }
  if (e.target.id === "scrim"){ closeAll(); return; }
  if ((el = e.target.closest("[data-lbn]"))){ lbStep(+el.getAttribute("data-lbn")); return; }
  if (e.target.closest("#lb")){ closeAll(); return; }
  if ((el = e.target.closest("a[href^='#']"))){
    closeAll();
    if (el.hasAttribute("data-travel")){ var c = el.closest(".card"); L.travelFrom = c ? c.querySelector(".cm img.a") : null; }
  }
});
document.addEventListener("keydown", function(e){
  if (e.key === "Escape") closeAll();
  if (openOv === "lb" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) lbStep(e.key === "ArrowRight" ? 1 : -1);
  if (e.key === "Enter" && e.target.matches && e.target.matches(".cm[data-href]")) e.target.click();
});
document.addEventListener("input", function(e){ if (e.target.id === "sq") L.runSearch(); });

L.setLang = function(l){
  L.lang = l; try { localStorage.setItem("leno-lang", l); } catch(e){}
  closeAll(); L.renderChrome();
  if (L.G && !L.reduce){ gsap.to("#view", {opacity:0, duration:.25, onComplete:function(){ L.rerender(); gsap.to("#view", {opacity:1, duration:.5}); }}); }
  else L.rerender();
};

/* ---------------- chrome behaviours ---------------- */
function annRotate(){
  var i = 0;
  setInterval(function(){
    var items = $$("#ann div"); if (items.length < 2) return;
    var cur = items[i % items.length], nx = items[(i + 1) % items.length];
    cur.classList.remove("on"); cur.classList.add("out");
    nx.classList.remove("out"); nx.classList.add("on");
    setTimeout(function(){ cur.classList.remove("out"); }, 800);
    i++;
  }, 4200);
}
function headerScroll(){
  var last = 0, hdr = $("#hdr"), tab = $("#tabbar");
  var on = function(){
    var y = window.scrollY || 0, home = L.route && L.route.name === "home";
    hdr.classList.toggle("solid", y > 30 || !home);
    var down = y > last && y > 400;
    hdr.classList.toggle("hide", down && !openOv && !($("#mega") && $("#mega").classList.contains("open")));
    tab.classList.toggle("hide", down);
    last = y;
  };
  window.addEventListener("scroll", on, {passive:true}); L.hdrUpdate = on; on();
}
function cursor(){
  if (!L.fine) return;
  var c = $("#cur"), lbl = $("#curl"), x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  window.addEventListener("pointermove", function(e){
    cx = e.clientX; cy = e.clientY;
    var t = e.target.closest ? e.target.closest("[data-cursor]") : null;
    if (t && !e.target.closest("button,input,select,.quick")){ c.classList.add("big"); lbl.textContent = t.getAttribute("data-cursor"); }
    else c.classList.remove("big");
  });
  document.addEventListener("mouseleave", function(){ c.classList.add("hide"); });
  document.addEventListener("mouseenter", function(){ c.classList.remove("hide"); });
  (function loop(){ x += (cx - x) * .22; y += (cy - y) * .22; c.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)"; requestAnimationFrame(loop); })();
}
function magnets(){
  if (!L.fine || L.reduce || !L.G) return;
  window.addEventListener("pointermove", function(e){
    $$("[data-mag]").forEach(function(m){
      var r = m.getBoundingClientRect(); if (!r.width) return;
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy), R = Math.max(110, r.width);
      if (d < R){ var p = (1 - d / R) * 16; gsap.to(m, {x:dx / (d || 1) * p, y:dy / (d || 1) * p, duration:.5, ease:"power3.out"}); m._m = 1; }
      else if (m._m){ m._m = 0; gsap.to(m, {x:0, y:0, duration:.9, ease:"elastic.out(1,.4)"}); }
    });
  });
}
L.tilt = function(root){
  if (!L.fine || L.reduce) return;
  $$("[data-tilt]", root).forEach(function(el){
    if (el._tilt) return; el._tilt = 1;
    el.addEventListener("pointermove", function(e){
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      el.style.transition = "transform .15s linear";
      el.style.transform = "perspective(1000px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 8).toFixed(2) + "deg)";
    });
    el.addEventListener("pointerleave", function(){ el.style.transition = "transform .9s cubic-bezier(.2,.7,.2,1)"; el.style.transform = ""; });
  });
};
function smooth(){
  if (!window.Lenis || L.reduce || !L.fine || !L.G) return;
  try {
    L.lenis = new Lenis({lerp:.09, smoothWheel:true});
    L.lenis.on("scroll", function(){ window.ScrollTrigger && ScrollTrigger.update(); });
    gsap.ticker.add(function(t){ L.lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  } catch(e){ L.lenis = null; }
}

/* ---------------- router ---------------- */
var view, ctx = null, first = true, busy = false, queued = false, pending = null, navTok = 0;
L.resolve = function(){
  var h = decodeURIComponent((location.hash || "#home").slice(1)) || "home";
  if (h.indexOf("p-") === 0 && L.byId(h.slice(2))) return {name:"product", id:h.slice(2)};
  if (["shop","dresses","sets","navy-edit","light-edit"].indexOf(h) > -1) return {name:"shop", kind:h};
  if (["home","wishlist","checkout","confirmed","story","help"].indexOf(h) > -1) return {name:h};
  return {name:"notfound"};
};
function swap(r){
  if (ctx && ctx.cleanup) try { ctx.cleanup(); } catch(e){}
  if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(function(s){ s.kill(); });
  L.route = r; pending = null;
  var v = L.V[r.name](r);
  view.innerHTML = v.html + (v.noFooter ? "" : L.V.footer());
  document.title = (v.title ? v.title + " · " : "") + "LENO WEAR";
  if (L.lenis) L.lenis.scrollTo(0, {immediate:true, force:true});
  window.scrollTo(0, 0);
  L.syncCounts(); L.markNav(); L.tilt(view);
  ctx = v.init ? (v.init() || null) : null;
  L.V.footerFx && L.V.footerFx();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
  L.hdrUpdate && L.hdrUpdate();
  return ctx;
}
L.rerender = function(){ swap(L.route || L.resolve()); if (ctx && ctx.enter) ctx.enter(); };
function curtain(r){
  var tl = gsap.timeline({onComplete:function(){ busy = false; if (queued){ queued = false; nav(); } }});
  tl.set("#curtain .cp", {transformOrigin:"50% 100%"})
    .to("#curtain .cp.b", {scaleY:1, duration:.6, ease:"expo.inOut"})
    .to("#curtain .cp.a", {scaleY:1, duration:.6, ease:"expo.inOut"}, "-=.48")
    .fromTo("#curtain .cur-kiss", {opacity:0, scale:.6, rotation:-12}, {opacity:1, scale:1, rotation:0, duration:.45, ease:"back.out(2)"}, "-=.2")
    .add(function(){ swap(r); })
    .set("#curtain .cp", {transformOrigin:"50% 0%"})
    .to("#curtain .cur-kiss", {opacity:0, scale:1.3, duration:.3, ease:"power2.in"}, "+=.08")
    .to("#curtain .cp.a", {scaleY:0, duration:.7, ease:"expo.inOut"}, "-=.1")
    .to("#curtain .cp.b", {scaleY:0, duration:.7, ease:"expo.inOut"}, "-=.58")
    .add(function(){ if (ctx && ctx.enter) ctx.enter(); }, "-=.55");
}
function travel(r, img){
  var a = img.getBoundingClientRect();
  var c = document.createElement("img"); c.className = "travel"; c.src = img.currentSrc || img.src; document.body.appendChild(c);
  gsap.set(c, {left:a.left, top:a.top, width:a.width, height:a.height});
  var mob = innerWidth <= 900, w = mob ? innerWidth - 8 : innerWidth * 1.25 / 2.25 - 8, h = w * 4.6 / 4;
  var top = 34 + 64 + 4;
  img.style.opacity = 0;
  gsap.to("#view", {opacity:0, duration:.35, ease:"power2.out"});
  gsap.to(c, {left:4, top:top, width:w, height:h, duration:.85, ease:"expo.inOut", onComplete:function(){
    swap(r);
    gsap.set("#view", {opacity:1});
    if (ctx && ctx.enter) ctx.enter(true);
    gsap.to(c, {opacity:0, duration:.5, delay:.15, onComplete:function(){ c.remove(); busy = false; if (queued){ queued = false; nav(); } }});
  }});
}
function fade(r){
  gsap.to("#view", {opacity:0, y:-10, duration:.3, ease:"power2.in", onComplete:function(){
    swap(r); gsap.fromTo("#view", {opacity:0, y:10}, {opacity:1, y:0, duration:.5, ease:"power2.out"});
    if (ctx && ctx.enter) ctx.enter(); busy = false; if (queued){ queued = false; nav(); }
  }});
}
function nav(){
  var r = L.resolve();
  closeAll();
  if (busy){ queued = true; return; }
  if (first || !L.G || L.reduce){ first = false; swap(r); if (ctx && ctx.enter) ctx.enter(); L.travelFrom = null; return; }
  busy = true; pending = r;
  var tok = ++navTok;
  setTimeout(function(){
    if (!busy || tok !== navTok) return;
    gsap.killTweensOf("#curtain .cp, #curtain .cur-kiss, #view");
    gsap.set("#curtain .cp", {scaleY:0}); gsap.set("#curtain .cur-kiss", {opacity:0}); gsap.set("#view", {opacity:1, y:0});
    $$(".travel").forEach(function(el){ el.parentNode && el.parentNode.removeChild(el); });
    if (pending){ swap(pending); if (ctx && ctx.enter) ctx.enter(); }
    busy = false; if (queued){ queued = false; nav(); }
  }, 2600);
  var from = L.travelFrom; L.travelFrom = null;
  var prev = L.route;
  if (prev && prev.name === "product" && r.name === "product" && L.byId(prev.id).s === L.byId(r.id).s) fade(r);
  else if (prev && prev.name === "shop" && r.name === "shop") fade(r);
  else if (from && r.name === "product" && document.body.contains(from)) travel(r, from);
  else curtain(r);
}
L.nav = nav;

/* ---------------- loader ---------------- */
function loader(done){
  var ld = $("#loader");
  if (!L.G){ ld.remove(); done(); return; }
  var seen = false; try { seen = sessionStorage.getItem("leno-seen") === "1"; sessionStorage.setItem("leno-seen", "1"); } catch(e){}
  if (L.reduce || seen){ gsap.to(ld, {opacity:0, duration:.4, onComplete:function(){ ld.remove(); }}); done(); return; }
  var srcs = ["h-pleat-white","h-knot-navy","h-tulle-ivory","h-set-white","pleat-white-3","knot-navy-2"].map(L.img), n = 0, o = {v:0};
  var num = $("#ldnum");
  srcs.forEach(function(s){ var i = new Image(); i.onload = i.onerror = function(){ n++; }; i.src = s; });
  gsap.from("#loader .ld-kiss", {scale:0, rotation:-25, duration:1.1, ease:"elastic.out(1,.5)"});
  gsap.from("#loader .ld-word span", {yPercent:110, stagger:.04, duration:.9, ease:"expo.out", delay:.25});
  var start = performance.now();
  (function tick(){
    var t = Math.min(1, (performance.now() - start) / 1150), target = Math.min(n / srcs.length, t) * 100;
    o.v += (target - o.v) * .15; num.textContent = Math.round(o.v);
    if ((n >= srcs.length && t >= 1 && o.v > 99) || performance.now() - start > 4500) out(); else requestAnimationFrame(tick);
  })();
  var gone = false;
  setTimeout(function(){ if (!gone){ gone = true; if (ld.parentNode) ld.parentNode.removeChild(ld); done(); } }, 5200);
  function out(){
    if (gone) return; gone = true; num.textContent = "100";
    var tl = gsap.timeline({onComplete:function(){ ld.remove(); }});
    tl.to("#loader .ld-kiss", {scale:16, opacity:0, duration:1, ease:"expo.in"})
      .to("#loader .ld-word span, #loader .ld-num, #loader .ld-cap", {yPercent:-120, opacity:0, stagger:.02, duration:.6, ease:"expo.in"}, 0)
      .to(ld, {clipPath:"inset(0 0 100% 0)", duration:1, ease:"expo.inOut"}, .6)
      .add(done, .9);
  }
  $("#ldskip").addEventListener("click", out);
}

/* ---------------- boot ---------------- */
L.boot = function(){
  view = $("#view");
  if (window.ScrollTrigger) ScrollTrigger.config({ignoreMobileResize:true});
  smooth(); L.renderChrome(); annRotate(); cursor(); magnets();
  window.addEventListener("hashchange", nav);
  nav();
  headerScroll();
  var started = false;
  loader(function(){ if (started) return; started = true; L.loaded = true; if (ctx && ctx.intro) ctx.intro(); });
  window.addEventListener("load", function(){ window.ScrollTrigger && ScrollTrigger.refresh(); });
};
})();
