/* LENO WEAR · demo admin. Reads the same product data as the store and writes
   overrides to this browser's storage (key "leno-admin"); orders live in "leno-orders". */
(function(){
"use strict";
var L = window.LENO;
var $ = function(s, r){ return (r || document).querySelector(s); }, $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var KEY = "leno-admin", OKEY = "leno-orders";
function load(k, d){ try { return JSON.parse(localStorage.getItem(k)) || d; } catch(e){ return d; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
var money = function(n){ return "AED " + Math.round(n).toLocaleString("en-US"); };
var STATUSES = ["Confirmed","Packed","Out for delivery","Delivered"];
var BADGES = ["","New","Best seller","Signature","Limited"];
var sv = function(d){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
var ICON = {
  dash:sv('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  orders:sv('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8a3 3 0 0 1 6 0"/>'),
  prods:sv('<path d="M8 3 4 6v4l3 1v10h10V11l3-1V6l-4-3c-.6 1.6-2.2 3-4 3S8.6 4.6 8 3z"/>'),
  offers:sv('<path d="M20 12 12 20 4 12V4h8z"/><circle cx="8.5" cy="8.5" r="1.5"/>')
};

/* ---------- data ---------- */
function base(p){ return {price:L.STYLES[p.s].price, stock:Object.assign({}, p.stock)}; }
var BASE = {}; L.P.forEach(function(p){ BASE[p.id] = base(p); });
var BASEPRICE = {}; Object.keys(L.STYLES).forEach(function(k){ BASEPRICE[k] = L.STYLES[k].price; });
function adm(){ var a = load(KEY, {}); a.products = a.products || {}; a.prices = a.prices || {}; a.cfg = a.cfg || {}; return a; }
function cur(p, a){ var o = a.products[p.id] || {}; return {price:+(a.prices[p.s] || BASEPRICE[p.s]), stock:Object.assign({}, BASE[p.id].stock, o.stock || {}), badge:o.badge || "", hidden:!!o.hidden}; }
function orders(){ return load(OKEY, []); }
function totalStock(st){ return L.SIZES.reduce(function(a, z){ return a + (+st[z] || 0); }, 0); }

/* ---------- shell ---------- */
var VIEW = "dash";
var toastT;
function toast(m){ var t = $("#atoast"); t.textContent = m; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function(){ t.classList.remove("on"); }, 2400); }
function nav(){
  var open = orders().filter(function(o){ return o.status !== "Delivered"; }).length;
  $("#nav").innerHTML = [["dash","Dashboard"],["orders","Orders"],["prods","Products"],["offers","Offers & settings"]].map(function(n){
    return '<button type="button" data-v="' + n[0] + '" class="' + (VIEW === n[0] ? "on" : "") + '">' + ICON[n[0]] + n[1] + (n[0] === "orders" && open ? '<span class="cnt">' + open + '</span>' : "") + '</button>'; }).join("");
}
function go(v){ VIEW = v; try { history.replaceState(null, "", "#" + v); } catch(e){} render(); window.scrollTo(0, 0); }
$("#nav").addEventListener("click", function(e){ var b = e.target.closest("[data-v]"); if (b) go(b.getAttribute("data-v")); });
function render(){ nav(); ({dash:dash, orders:ordersView, prods:prodsView, offers:offersView})[VIEW](); }

/* ---------- dashboard ---------- */
function dash(){
  var os = orders(), a = adm();
  var rev = os.reduce(function(s, o){ return s + o.total; }, 0), units = os.reduce(function(s, o){ return s + o.items.reduce(function(x, i){ return x + i.qty; }, 0); }, 0);
  var aov = os.length ? rev / os.length : 0;
  /* last 14 days */
  var days = [], now = new Date(); now.setHours(0, 0, 0, 0);
  for (var i = 13; i >= 0; i--){ var d = new Date(now); d.setDate(d.getDate() - i); days.push({d:d, v:0}); }
  os.forEach(function(o){ var od = new Date(o.date); od.setHours(0, 0, 0, 0); days.forEach(function(x){ if (+x.d === +od) x.v += o.total; }); });
  var max = Math.max.apply(null, days.map(function(x){ return x.v; }).concat([1]));
  var W = 700, H = 220, pad = 30, bw = (W - pad * 2) / days.length;
  var nice = Math.ceil(max / 500) * 500 || 500;
  var bars = days.map(function(x, i){ var h = (x.v / nice) * (H - 50); return '<rect class="bar' + (i === days.length - 1 ? " hi" : "") + '" x="' + (pad + i * bw + 4).toFixed(1) + '" y="' + (H - 26 - h).toFixed(1) + '" width="' + (bw - 8).toFixed(1) + '" height="' + Math.max(h, x.v ? 2 : 0).toFixed(1) + '" rx="3"><title>' + x.d.toDateString() + ': ' + money(x.v) + '</title></rect>' +
    (i % 2 === 0 ? '<text x="' + (pad + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + x.d.getDate() + '/' + (x.d.getMonth() + 1) + '</text>' : ""); }).join("");
  var grid = [0, .5, 1].map(function(f){ var y = H - 26 - f * (H - 50); return '<line class="gl" x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (pad - 6) + '" y="' + (y + 3) + '" text-anchor="end">' + (f ? Math.round(nice * f / 1000 * 10) / 10 + "k" : "0") + '</text>'; }).join("");
  /* low stock */
  var low = [];
  L.P.forEach(function(p){ var c = cur(p, a); L.SIZES.forEach(function(z){ if (c.stock[z] <= 1) low.push({p:p, z:z, n:c.stock[z]}); }); });
  low.sort(function(x, y){ return x.n - y.n; });
  /* top products by units */
  var tally = {}; os.forEach(function(o){ o.items.forEach(function(i){ tally[i.id] = (tally[i.id] || 0) + i.qty; }); });
  var top = Object.keys(tally).sort(function(x, y){ return tally[y] - tally[x]; }).slice(0, 5);
  var sample = os.some(function(o){ return o.sample; });
  $("#main").innerHTML =
    '<div class="top"><div><h1>Dashboard</h1><p>' + new Date().toLocaleDateString("en-GB", {weekday:"long", day:"numeric", month:"long"}) + (sample ? ' · <span class="tag">includes sample orders</span>' : "") + '</p></div>' +
      '<div class="actions">' + (os.length ? "" : '<button type="button" class="btn ghost" id="seed">Load sample orders</button>') + '<button type="button" class="btn" data-go="prods">Edit products</button></div></div>' +
    '<div class="grid kpis">' +
      kpi("Revenue", money(rev), os.length + " orders, incl. VAT") + kpi("Orders", os.length, os.filter(function(o){ return o.status !== "Delivered"; }).length + " to fulfil") +
      kpi("Avg. order value", money(aov), "Free delivery from " + money(+a.cfg.free || L.FREE)) + kpi("Units sold", units, "Across " + Object.keys(tally).length + " colourways") +
    '</div>' +
    '<div class="grid two" style="margin-top:14px">' +
      '<div class="card"><h2>Revenue <span>last 14 days</span></h2>' + (os.length ? '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Revenue per day for the last 14 days">' + grid + bars + '</svg>' : '<div class="empty">No orders yet. Place an order in the store, or load sample orders to preview the dashboard.</div>') + '</div>' +
      '<div class="card"><h2>Low stock <span>' + low.length + ' sizes at 1 or 0</span></h2><div class="list">' + (low.length ? low.slice(0, 7).map(function(x){
        return '<div class="row"><img src="' + L.img(x.p.im[0]) + '" alt=""><div><b>' + L.STYLES[x.p.s].en + '</b><span>' + x.p.c.en + ' · Size ' + x.z + '</span></div><span class="pill ' + (x.n ? "low" : "zero") + '">' + (x.n ? "1 left" : "Sold out") + '</span></div>'; }).join("") : '<div class="empty">Every size has at least 2 in stock.</div>') + '</div>' +
        '<button type="button" class="btn ghost" style="margin-top:12px;width:100%" data-go="prods">Restock</button></div>' +
    '</div>' +
    '<div class="grid two" style="margin-top:14px">' +
      '<div class="card"><h2>Recent orders <button type="button" class="btn ghost" data-go="orders">All orders</button></h2>' + (os.length ? '<div class="list">' + os.slice(0, 5).map(function(o){
        return '<div class="row"><img src="' + L.img(L.byId(o.items[0].id).im[0]) + '" alt=""><div><b>' + esc(o.no) + ' · ' + esc(o.name) + '</b><span>' + new Date(o.date).toLocaleDateString("en-GB", {day:"numeric", month:"short"}) + ' · ' + money(o.total) + '</span></div><span class="pill ' + pillCls(o.status) + '">' + o.status + '</span></div>'; }).join("") + '</div>' : '<div class="empty">Orders placed in the store appear here.</div>') + '</div>' +
      '<div class="card"><h2>Top products <span>by units</span></h2>' + (top.length ? '<div class="list">' + top.map(function(id){ var p = L.byId(id);
        return '<div class="row"><img src="' + L.img(p.im[0]) + '" alt=""><div><b>' + L.STYLES[p.s].en + '</b><span>' + p.c.en + '</span></div><b>' + tally[id] + '</b></div>'; }).join("") + '</div>' : '<div class="empty">No sales yet.</div>') + '</div>' +
    '</div>';
  var sd = $("#seed"); if (sd) sd.addEventListener("click", seed);
}
function kpi(l, v, s){ return '<div class="card kpi"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s + '</span></div>'; }
function pillCls(s){ return s === "Out for delivery" ? "out" : s; }

/* sample orders, clearly marked, for previewing the dashboard */
function seed(){
  var names = ["Sara","Mariam","Noor","Layla","Hessa","Aisha","Dana","Reem","Farah","Lina","Maya","Yasmin"], methods = ["apple","card","tabby","tamara","cod"];
  var os = [], n = 14;
  for (var i = 0; i < n; i++){
    var d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 14)); d.setHours(9 + Math.floor(Math.random() * 12));
    var k = 1 + (Math.random() < .35 ? 1 : 0), items = [];
    for (var j = 0; j < k; j++){ var p = L.P[Math.floor(Math.random() * L.P.length)], zs = L.SIZES.filter(function(z){ return BASE[p.id].stock[z]; }); if (!zs.length) continue; items.push({id:p.id, size:zs[Math.floor(Math.random() * zs.length)], qty:1, price:L.STYLES[p.s].price}); }
    if (!items.length) continue;
    var sub = items.reduce(function(a, x){ return a + x.price; }, 0);
    var age = (Date.now() - d) / 864e5;
    os.push({no:"SAMPLE-" + (1000 + i), date:d.toISOString(), name:names[i % names.length], method:methods[i % methods.length], total:sub + (sub < 600 ? 25 : 0), items:items, sample:true,
      status:age > 4 ? "Delivered" : age > 2 ? "Out for delivery" : age > 1 ? "Packed" : "Confirmed"});
  }
  os.sort(function(x, y){ return new Date(y.date) - new Date(x.date); });
  save(OKEY, os.concat(orders()));
  toast("Loaded " + os.length + " sample orders"); render();
}

/* ---------- orders ---------- */
var OFILTER = "all";
function ordersView(){
  var os = orders();
  var shown = os.filter(function(o){ return OFILTER === "all" || o.status === OFILTER; });
  $("#main").innerHTML =
    '<div class="top"><div><h1>Orders</h1><p>' + os.length + ' total · update status as you fulfil</p></div><div class="actions">' + (os.length ? "" : '<button type="button" class="btn ghost" id="seed">Load sample orders</button>') + '</div></div>' +
    '<div class="chips" id="ofil">' + ["all"].concat(STATUSES).map(function(s){ var c = s === "all" ? os.length : os.filter(function(o){ return o.status === s; }).length; return '<button type="button" data-f="' + s + '" class="' + (OFILTER === s ? "on" : "") + '">' + (s === "all" ? "All" : s) + ' · ' + c + '</button>'; }).join("") + '</div>' +
    '<div class="card tbl">' + (shown.length ? '<table><thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Items</th><th>Payment</th><th class="num">Total</th><th>Status</th></tr></thead><tbody>' + shown.map(function(o){
      return '<tr><td><b>' + esc(o.no) + '</b>' + (o.sample ? ' <span class="tag">sample</span>' : "") + '</td><td>' + new Date(o.date).toLocaleString("en-GB", {day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"}) + '</td><td>' + esc(o.name) + '</td>' +
        '<td><div class="items">' + o.items.map(function(i){ var p = L.byId(i.id); return p ? '<img src="' + L.img(p.im[0]) + '" alt="' + esc(L.STYLES[p.s].en + " " + p.c.en + " " + i.size) + '" title="' + esc(L.STYLES[p.s].en + " · " + p.c.en + " · " + i.size + " × " + i.qty) + '">' : ""; }).join("") + '</div></td>' +
        '<td>' + ({apple:"Apple Pay", card:"Card", tabby:"Tabby", tamara:"Tamara", cod:"Cash on delivery"}[o.method] || esc(o.method)) + '</td><td class="num">' + money(o.total) + '</td>' +
        '<td><select class="st" data-no="' + esc(o.no) + '" aria-label="Status for ' + esc(o.no) + '">' + STATUSES.map(function(s){ return '<option' + (s === o.status ? " selected" : "") + '>' + s + '</option>'; }).join("") + '</select></td></tr>'; }).join("") + '</tbody></table>'
      : '<div class="empty">' + (os.length ? "No orders with this status." : "No orders yet. Orders placed through the store checkout appear here automatically.") + '</div>') + '</div>';
  $("#ofil").addEventListener("click", function(e){ var b = e.target.closest("[data-f]"); if (b){ OFILTER = b.getAttribute("data-f"); ordersView(); nav(); } });
  $$("select.st").forEach(function(s){ s.addEventListener("change", function(){
    var all = orders(), o = all.filter(function(x){ return x.no === s.getAttribute("data-no"); })[0]; if (!o) return;
    o.status = s.value; save(OKEY, all); toast(o.no + " marked " + s.value); nav();
  }); });
  var sd = $("#seed"); if (sd) sd.addEventListener("click", seed);
}

/* ---------- products ---------- */
function prodsView(){
  var a = adm();
  $("#main").innerHTML =
    '<div class="top"><div><h1>Products</h1><p>Prices are per style; stock, labels and visibility per colourway. Changes go live in the store when you save.</p></div>' +
      '<div class="actions"><a class="btn ghost" href="../shop/" target="_blank" rel="noopener">Preview shop ↗</a></div></div>' +
    '<div class="prods" id="prods">' + L.P.map(function(p){ var c = cur(p, a), tot = totalStock(c.stock);
      return '<div class="card prod" data-id="' + p.id + '"><img src="' + L.img(p.im[0]) + '" alt="">' +
        '<div class="nm"><b>' + L.STYLES[p.s].en + '</b><span>' + p.c.en + ' · ' + L.STYLES[p.s].code + '</span><br>' + (tot === 0 ? '<span class="pill zero">Sold out</span>' : tot <= 3 ? '<span class="pill low">' + tot + ' left</span>' : '<span class="pill Delivered">' + tot + ' in stock</span>') + '</div>' +
        '<label class="f">Price (AED)<input type="number" min="1" step="5" data-k="price" data-style="' + p.s + '" value="' + c.price + '"></label>' +
        '<div class="stock">' + L.SIZES.map(function(z){ return '<label>' + z + '<input type="number" min="0" step="1" data-k="stock" data-z="' + z + '" value="' + c.stock[z] + '" class="' + (c.stock[z] ? "" : "zero") + '"></label>'; }).join("") + '</div>' +
        '<label class="f bd">Label<select class="sel" data-k="badge">' + BADGES.map(function(b){ return '<option value="' + b + '"' + (b === c.badge ? " selected" : "") + '>' + (b || "None") + '</option>'; }).join("") + '</select></label>' +
        '<label class="tog vis"><input type="checkbox" data-k="vis"' + (c.hidden ? "" : " checked") + '><i></i>' + (c.hidden ? "Hidden" : "Visible") + '</label></div>'; }).join("") + '</div>' +
    '<div class="savebar" id="savebar"><span id="sbtxt">Unsaved changes</span><div class="actions"><button type="button" class="btn ghost" id="discard">Discard</button><button type="button" class="btn red" id="savep">Save changes</button></div></div>' +
    '<div class="card" style="margin-top:18px"><div class="set"><div><b>Reset to the stock sheet</b><span>Restores the prices and quantities from the original purchase file. Orders are kept.</span></div><div class="ctl"><button type="button" class="btn ghost" id="reset">Reset products</button><span class="confirm" id="rcf" hidden><span>Are you sure?</span><button type="button" class="btn red" id="rok">Reset</button><button type="button" class="btn ghost" id="rno">Cancel</button></span></div></div></div>';
  var dirty = 0;
  var mark = function(){ dirty++; $("#savebar").classList.add("on"); $("#sbtxt").textContent = "Unsaved changes"; };
  $("#prods").addEventListener("input", function(e){ var t = e.target; if (t.matches("input[type=number]")){ t.classList.add("changed"); if (t.dataset.z) t.classList.toggle("zero", !+t.value);
    if (t.dataset.k === "price") $$('input[data-style="' + t.dataset.style + '"]').forEach(function(o){ if (o !== t){ o.value = t.value; o.classList.add("changed"); } }); mark(); } });
  $("#prods").addEventListener("change", function(e){ var t = e.target; if (t.dataset.k === "vis"){ t.parentNode.lastChild.textContent = t.checked ? "Visible" : "Hidden"; } if (t.dataset.k === "badge" || t.dataset.k === "vis") mark(); });
  $("#discard").addEventListener("click", prodsView);
  $("#savep").addEventListener("click", function(){
    var x = adm();
    $$(".prod").forEach(function(row){
      var id = row.getAttribute("data-id"), p = L.byId(id), e = x.products[id] = x.products[id] || {};
      var pr = +$('[data-k="price"]', row).value; if (pr > 0) x.prices[p.s] = pr;
      e.stock = {}; $$('[data-k="stock"]', row).forEach(function(i){ e.stock[i.dataset.z] = Math.max(0, Math.floor(+i.value || 0)); });
      e.badge = $('[data-k="badge"]', row).value; e.hidden = !$('[data-k="vis"]', row).checked;
    });
    save(KEY, x); toast("Saved. The store now shows your changes."); prodsView();
  });
  $("#reset").addEventListener("click", function(){ $("#rcf").hidden = false; $("#reset").hidden = true; });
  $("#rno").addEventListener("click", function(){ $("#rcf").hidden = true; $("#reset").hidden = false; });
  $("#rok").addEventListener("click", function(){ var x = adm(); x.products = {}; x.prices = {}; save(KEY, x); toast("Products reset to the stock sheet"); prodsView(); });
}

/* ---------- offers & settings ---------- */
function offersView(){
  var a = adm(), c = a.cfg;
  var on = function(k){ return c[k] !== false; };
  $("#main").innerHTML =
    '<div class="top"><div><h1>Offers &amp; settings</h1><p>Turn promotions on or off. Every offer here is a placeholder until you confirm it.</p></div></div>' +
    '<div class="card">' +
      '<div class="set"><div><b>Welcome offer</b><span>Quiet corner card for new visitors; code LENO10 applies automatically.</span></div><div class="ctl"><input type="number" min="1" max="50" id="wp" value="' + (+c.welcomePct || 10) + '" aria-label="Welcome discount percent">%<label class="tog"><input type="checkbox" id="won"' + (on("welcomeOn") ? " checked" : "") + '><i></i></label></div></div>' +
      '<div class="set"><div><b>Look bundle</b><span>Discount when a dress and a set are in the bag together. Never stacks with the welcome offer.</span></div><div class="ctl"><input type="number" min="1" max="50" id="bp" value="' + (+c.bundlePct || 10) + '" aria-label="Bundle discount percent">%<label class="tog"><input type="checkbox" id="bon"' + (on("bundleOn") ? " checked" : "") + '><i></i></label></div></div>' +
      '<div class="set"><div><b>Free same-day delivery threshold</b><span>Shown in the top bar, bag and product pages.</span></div><div class="ctl">AED <input type="number" min="0" step="50" id="fr" value="' + (+c.free || 600) + '" aria-label="Free delivery threshold in AED"></div></div>' +
      '<div style="display:flex;justify-content:flex-end;padding-top:14px"><button type="button" class="btn red" id="saveo">Save settings</button></div>' +
    '</div>' +
    '<div class="card" style="margin-top:14px">' +
      '<div class="set"><div><b>Clear orders</b><span>Removes every order saved in this browser, including sample orders. Stock is not changed.</span></div><div class="ctl"><button type="button" class="btn ghost" id="clr">Clear orders</button><span class="confirm" id="ccf" hidden><span>Delete all orders?</span><button type="button" class="btn red" id="cok">Delete</button><button type="button" class="btn ghost" id="cno">Cancel</button></span></div></div>' +
      '<div class="set"><div><b>Connect Shopify</b><span>Next step: replace this browser storage with the Shopify Admin API so orders, stock and prices are real and shared across devices.</span></div><div class="ctl"><span class="tag">coming next</span></div></div>' +
    '</div>';
  $("#saveo").addEventListener("click", function(){
    var x = adm();
    x.cfg.welcomeOn = $("#won").checked; x.cfg.welcomePct = Math.min(50, Math.max(1, +$("#wp").value || 10));
    x.cfg.bundleOn = $("#bon").checked; x.cfg.bundlePct = Math.min(50, Math.max(1, +$("#bp").value || 10));
    x.cfg.free = Math.max(0, +$("#fr").value || 600);
    save(KEY, x); toast("Settings saved");
  });
  $("#clr").addEventListener("click", function(){ $("#ccf").hidden = false; $("#clr").hidden = true; });
  $("#cno").addEventListener("click", function(){ $("#ccf").hidden = true; $("#clr").hidden = false; });
  $("#cok").addEventListener("click", function(){ save(OKEY, []); toast("Orders cleared"); offersView(); nav(); });
}

document.addEventListener("click", function(e){ var g = e.target.closest("[data-go]"); if (g && g.closest("#main")){ e.preventDefault(); go(g.getAttribute("data-go")); } });
var start = (location.hash || "").slice(1);
if (["dash","orders","prods","offers"].indexOf(start) > -1) VIEW = start;
render();
})();
