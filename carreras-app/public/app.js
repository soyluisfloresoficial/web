"use strict";
const $app = document.getElementById("app");
const S = { me: null, unread: 0, tab: "inicio", clientId: null, month: null };

// ---------- Utilidades
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const eur = (c) => (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const bigEur = (c) => { const [e, d] = (Math.abs(c) / 100).toFixed(2).split("."); return `${c < 0 ? "-" : ""}${Number(e).toLocaleString("es-ES")}<small>,${d} €</small>`; };
const fdate = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "");
const fdateS = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }) : "");
const fdt = (d) => new Date(d).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const fmonth = (m) => new Date(m + "-15T12:00:00").toLocaleDateString("es-ES", { month: "long", year: "numeric" });
const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
const initials = (n) => String(n || "?").replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const AVC = ["#3B6FD8", "#0F9F62", "#C2410C", "#7C3AED", "#DB2777", "#0E7490", "#B45309", "#4F46E5"];
const avatar = (n, cls = "") => { let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return `<div class="av ${cls}" style="background:${AVC[h % AVC.length]}">${esc(initials(n))}</div>`; };
const formData = (el) => Object.fromEntries(new FormData(el).entries());

// ---------- Iconos (trazos propios, 24×24)
const P = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  car: "M5 17h14M6.5 17v2M17.5 17v2M3 13l2-5.5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5L21 13v4H3zM7 13.5h.01M17 13.5h.01",
  receipt: "M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6M9 16h3",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  plus: "M12 5v14M5 12h14",
  euro: "M18 7a6.5 6.5 0 1 0 0 10M4 10h10M4 14h10",
  check: "M20 6 9 17l-5-5",
  x: "M18 6 6 18M6 6l12 12",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  wallet: "M20 7H5a2 2 0 0 1 0-4h13v4M3 5v14a2 2 0 0 0 2 2h15V7M16 14h.01",
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1z",
  chat: "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.1A8.4 8.4 0 1 1 21 11.5z",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  back: "M15 18l-6-6 6-6",
  chev: "M9 18l6-6-6-6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11",
  chart: "M3 3v18h18M7 15v2M12 10v7M17 6v11",
  fuel: "M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17M3 22h12M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 4 0V8l-4-4M7 8h4",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  calendar: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
};
const ic = (n, extra = "") => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${extra}><path d="${P[n]}"/></svg>`;

function toast(m) { const t = document.getElementById("toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2800); }
async function api(path, method = "GET", body) {
  const r = await fetch("/api" + path, { method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== "/login" && path !== "/me") { S.me = null; render(); throw new Error("Tu sesión terminó"); }
  if (!r.ok) throw new Error(j.error || "Algo salió mal");
  return j;
}
const guard = (fn) => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message); } };
function modal(html, onMount) {
  const m = document.createElement("div");
  m.className = "modal";
  m.innerHTML = `<div role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  m.addEventListener("click", (e) => { if (e.target === m) m.remove(); });
  document.body.appendChild(m);
  m.querySelector("input,select")?.focus({ preventScroll: true });
  onMount && onMount(m);
  return m;
}
const empty = (icon, title, text = "") => `<div class="empty"><div class="ic">${ic(icon)}</div><b>${title}</b>${text}</div>`;
const skeleton = () => `<div class="sk" style="height:170px;border-radius:24px"></div><div class="stats"><div class="sk" style="height:76px"></div><div class="sk" style="height:76px"></div></div><div class="sk" style="height:220px"></div>`;
const go = (tab, clientId = null) => { S.tab = tab; S.clientId = clientId; window.scrollTo(0, 0); render(); };

// ---------- Estructura
async function render() {
  if (!S.me) {
    try { const r = await api("/me"); S.me = r.user; S.unread = r.unread; } catch { S.me = null; }
  }
  if (!S.me) return loginView();
  document.body.classList.remove("auth");
  const admin = S.me.role === "admin";
  const tabs = admin
    ? [["inicio", "home", "Inicio"], ["clientes", "users", "Clientes"], ["nuevo", "plus", ""], ["carreras", "car", "Carreras"], ["gastos", "receipt", "Gastos"]]
    : [["inicio", "home", "Inicio"], ["carreras", "car", "Carreras"], ["pedir", "plus", ""], ["pagos", "wallet", "Pagos"], ["avisos", "bell", "Avisos"]];
  $app.innerHTML = `<header class="top"><div class="logo">${ic("car")}</div>
    <div class="t"><b>${admin ? "Panel de carreras" : "Hola, " + esc(S.me.name.split(" ")[0])}</b><span>${admin ? "Administrador" : "Tu cuenta de carreras"}</span></div>
    ${admin ? `<button class="iconbtn" id="bell" aria-label="Avisos">${ic("bell")}${S.unread ? `<span class="dot">${S.unread}</span>` : ""}</button>` : ""}
    <button class="iconbtn" id="menu" aria-label="Mi cuenta">${ic("user")}</button></header>
    <main id="view">${skeleton()}</main>
    <nav class="bn"><div class="in">${tabs.map(([k, i, l]) => k === "nuevo" || k === "pedir"
      ? `<a href="#" data-t="${k}" class="fab" aria-label="${k === "nuevo" ? "Añadir" : "Pedir carrera"}"><span class="c">${ic(i)}</span>${k === "pedir" ? "Pedir" : ""}</a>`
      : `<a href="#" data-t="${k}" class="${S.tab === k ? "on" : ""}">${ic(i)}${l}${k === "avisos" && S.unread ? `<span class="dot" style="position:absolute;top:0;right:calc(50% - 20px);background:var(--bad);color:#fff;border-radius:9px;font-size:.62rem;padding:1px 5px">${S.unread}</span>` : ""}</a>`).join("")}</div></nav>`;
  $app.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); if (a.dataset.t === "nuevo") return quickAdd(); go(a.dataset.t); }));
  document.getElementById("menu").onclick = accountModal;
  document.getElementById("bell")?.addEventListener("click", () => go("avisos"));
  const v = document.getElementById("view");
  try {
    const views = admin
      ? { inicio: adminInicio, clientes: adminClientes, carreras: adminCarreras, gastos: adminGastos, avisos: avisosView }
      : { inicio: clienteInicio, carreras: clienteCarreras, pedir: clientePedir, pagos: clientePagos, avisos: avisosView };
    if (admin && S.clientId) return await clienteDetalle(v);
    await (views[S.tab] || views.inicio)(v);
  } catch (e) { v.innerHTML = `<div class="card">${empty("alert", "No se pudo cargar", esc(e.message))}</div>`; }
}

function loginView() {
  document.body.classList.add("auth");
  $app.innerHTML = `<div class="login">
    <div class="brand"><div class="logo">${ic("car")}</div><div><b style="font-size:1.1rem">Carreras</b><div class="mut">Cuentas claras de cada viaje</div></div></div>
    <div class="art"><div class="route"><div class="rail"><i></i><s></s><u></u></div>
      <div class="pl"><small>Recogida</small>Donde te busco</div><div class="price"><span class="chip">${ic("check")}Al día</span></div>
      <div class="pl"><small>Destino</small>A donde vas</div></div>
      <div style="margin-top:14px;font-size:.88rem;opacity:.8">Consulta tus carreras, lo pendiente y tus pagos con fecha.</div></div>
    <h1>Entra a tu cuenta</h1>
    <form id="f"><label class="f">Correo</label><input name="email" type="email" autocomplete="username" inputmode="email" required>
    <label class="f">Contraseña</label><input name="password" type="password" autocomplete="current-password" required>
    <button class="acc block" style="margin-top:18px">${ic("lock")}Entrar</button></form>
    <p class="mut" style="text-align:center;margin-top:16px">¿No tienes cuenta o la olvidaste? Pídesela a tu conductor.</p></div>`;
  document.getElementById("f").onsubmit = guard(async (e) => {
    e.preventDefault();
    const b = e.target.querySelector("button"); b.disabled = true;
    try { await api("/login", "POST", formData(e.target)); S.me = null; S.tab = "inicio"; render(); } finally { b.disabled = false; }
  });
}

function accountModal() {
  modal(`<div class="row" style="margin-bottom:10px">${avatar(S.me.name, "lg")}<div class="grow"><h2>${esc(S.me.name)}</h2><div class="mut">${esc(S.me.email)}</div></div></div>
    <form id="pw"><label class="f">Contraseña actual</label><input name="current" type="password" autocomplete="current-password" required>
    <label class="f">Nueva contraseña (mínimo 10 caracteres)</label><input name="next" type="password" minlength="10" autocomplete="new-password" required>
    <button class="block" style="margin-top:14px">${ic("lock")}Cambiar contraseña</button></form>
    <button class="danger block" id="out" style="margin-top:10px">${ic("logout")}Cerrar sesión</button>`, (m) => {
    m.querySelector("#pw").onsubmit = guard(async (e) => { e.preventDefault(); await api("/password", "POST", formData(e.target)); m.remove(); toast("Contraseña actualizada"); });
    m.querySelector("#out").onclick = guard(async () => { await api("/logout", "POST", {}); S.me = null; m.remove(); render(); });
  });
}

// ---------- Componentes
function statusChip(t) {
  if (t.pending_cents === 0) return `<span class="chip ok">${ic("check")}Pagada</span>`;
  if (t.paid_cents > 0) return `<span class="chip warn">Parcial</span>`;
  return `<span class="chip bad">Pendiente</span>`;
}
function tripCard(t, opts = {}) {
  const pct = Math.round((t.paid_cents / t.amount_cents) * 100);
  return `<div class="trip">
    <div class="hd"><span class="when">${fdateS(t.trip_date)}</span>${t.trip_time ? `<span class="chip n">${ic("clock")}${esc(t.trip_time)}</span>` : ""}
      ${opts.client ? `<span class="mut" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">· ${esc(opts.client)}</span>` : ""}<span class="grow"></span>${statusChip(t)}</div>
    <div class="route"><div class="rail"><i></i><s></s><u></u></div>
      <div class="pl"><small>Recogida</small>${esc(t.pickup)}</div>
      <div class="price"><div class="amt">${eur(t.amount_cents)}</div>${t.pending_cents > 0 && t.paid_cents > 0 ? `<div class="mut">Debe ${eur(t.pending_cents)}</div>` : ""}</div>
      <div class="pl"><small>Destino</small>${esc(t.dropoff)}</div></div>
    ${t.paid_cents > 0 && t.pending_cents > 0 ? `<div class="bar"><b style="width:${pct}%"></b></div>` : ""}
    ${t.notes || (t.pending_cents === 0 && t.last_pay_date) || opts.admin ? `<div class="ft">
      ${t.notes ? `<span class="mut">${esc(t.notes)}</span>` : ""}
      ${t.pending_cents === 0 && t.last_pay_date ? `<span class="mut">Pagada el ${fdate(t.last_pay_date)}</span>` : ""}
      <span class="grow"></span>
      ${opts.admin ? `<button class="ghost sm" data-edit="${t.id}">${ic("edit")}Editar</button><button class="danger sm" data-del="${t.id}" aria-label="Borrar">${ic("trash")}</button>` : ""}</div>` : ""}
  </div>`;
}
const payItem = (p, admin) => `<div class="li" style="cursor:default"><div class="av" style="background:var(--ok-bg);color:var(--ok)">${ic("check")}</div>
  <div class="grow"><div class="name">${eur(p.amount_cents)} <span class="mut" style="font-weight:600">· ${esc(p.method)}</span></div>
  <div class="mut">${fdate(p.pay_date)}${p.note ? " · " + esc(p.note) : ""}</div>
  ${p.applied_to ? `<div class="mut" style="font-size:.78rem">Aplicado a: ${esc(p.applied_to).replace(/\d{4}-\d{2}-\d{2}/g, (d) => fdate(d)).replace(/ \| /g, "; ")}</div>` : ""}</div>
  ${admin ? `<button class="danger sm" data-delpay="${p.id}">Anular</button>` : ""}</div>`;
function seg(options, cur, cb) {
  const el = document.createElement("div");
  el.className = "seg";
  el.innerHTML = options.map(([k, l]) => `<button class="${cur === k ? "on" : ""}" data-s="${k}">${l}</button>`).join("");
  el.querySelectorAll("button").forEach((b) => (b.onclick = () => cb(b.dataset.s)));
  return el;
}
const STATUS_OPTS = [["all", "Todas"], ["pending", "Pendientes"], ["paid", "Pagadas"]];
const reqChip = (s) => ({ pending: `<span class="chip warn">${ic("clock")}Esperando</span>`, accepted: `<span class="chip ok">${ic("check")}Confirmada</span>`, rejected: `<span class="chip bad">${ic("x")}No disponible</span>`, cancelled: `<span class="chip n">Cancelada</span>` }[s] || "");

function barChart(series) {
  const W = 340, H = 170, pad = { l: 8, r: 8, t: 10, b: 26 };
  const max = Math.max(1, ...series.flatMap((s) => [s.charged_cents, s.collected_cents, s.expenses_cents]));
  const gw = (W - pad.l - pad.r) / series.length, bw = Math.min(12, gw / 4.2);
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const bars = series.map((s, i) => {
    const x0 = pad.l + gw * i + gw / 2 - bw * 1.5 - 2;
    const b = (v, k, j) => { const yy = y(v), h = Math.max(v ? 2 : 0, H - pad.b - yy); return `<rect x="${x0 + j * (bw + 2)}" y="${H - pad.b - h}" width="${bw}" height="${h}" rx="3" fill="var(--s-${k})"><title>${fmonth(s.month)}: ${eur(v)}</title></rect>`; };
    const lbl = new Date(s.month + "-15T12:00:00").toLocaleDateString("es-ES", { month: "short" }).replace(".", "");
    return b(s.charged_cents, "c", 0) + b(s.collected_cents, "p", 1) + b(s.expenses_cents, "e", 2) + `<text x="${pad.l + gw * i + gw / 2}" y="${H - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--mut)">${lbl}</text>`;
  }).join("");
  const grid = [0.25, 0.5, 0.75, 1].map((f) => `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(max * f)}" y2="${y(max * f)}" stroke="var(--line)" stroke-dasharray="3 4"/>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cargado, cobrado y gastos de los últimos seis meses">${grid}<line x1="${pad.l}" x2="${W - pad.r}" y1="${H - pad.b}" y2="${H - pad.b}" stroke="var(--line)"/>${bars}</svg>
    <div class="legend"><span><i style="background:var(--s-c)"></i>Cargado</span><span><i style="background:var(--s-p)"></i>Cobrado</span><span><i style="background:var(--s-e)"></i>Gastos</span></div></div>`;
}

// ---------- Cliente
async function clienteInicio(v) {
  const [s, t, rq] = await Promise.all([api("/client/summary"), api("/client/trips?status=pending"), api("/client/requests")]);
  const pendReq = rq.items.filter((r) => r.status === "pending");
  v.innerHTML = `<div class="hero"><div class="lbl">${ic("wallet")}Saldo pendiente</div><div class="big">${bigEur(s.pending_cents)}</div>
    <div class="sub">${s.pending_cents > 0 ? plural(t.items.length, "carrera por pagar", "carreras por pagar") : "Estás al día. Gracias."}</div>
    <div class="row"><div><span>Total carreras</span><b>${eur(s.charged_cents)}</b></div><div><span>Pagado</span><b>${eur(s.paid_cents)}</b></div><div><span>Pendiente</span><b>${eur(s.pending_cents)}</b></div></div>
    <div class="acts"><button class="acc sm" id="pedir">${ic("plus")}Pedir carrera</button><button class="glass sm" id="pdf">${ic("download")}Estado de cuenta</button></div></div>
    ${pendReq.length ? `<div class="sec"><h2>Solicitudes en espera</h2></div><div class="card flush">${pendReq.map((r) => `<div class="li" style="cursor:default"><div class="av" style="background:var(--warn-bg);color:var(--warn)">${ic("clock")}</div><div class="grow"><div class="name">${esc(r.pickup)} → ${esc(r.dropoff)}</div><div class="mut">${fdateS(r.req_date)}${r.req_time ? " · " + esc(r.req_time) : ""}</div></div>${reqChip(r.status)}</div>`).join("")}</div>` : ""}
    <div class="sec"><h2>Por pagar</h2>${t.items.length ? `<a id="all">Ver todas</a>` : ""}</div>
    <div class="card">${t.items.map((x) => tripCard(x)).join("") || empty("check", "Nada pendiente", "Todas tus carreras están pagadas.")}</div>`;
  v.querySelector("#pedir").onclick = () => go("pedir");
  v.querySelector("#all")?.addEventListener("click", () => { cStatus = "all"; go("carreras"); });
  v.querySelector("#pdf").onclick = guard(async () => {
    const [all, pays] = await Promise.all([api("/client/trips"), api("/client/payments")]);
    printStatement(S.me.name, s, all.items, pays.items);
  });
}
let cStatus = "all";
async function clienteCarreras(v) {
  const t = await api("/client/trips?status=" + cStatus);
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Mis carreras</h2><span class="mut">${plural(t.items.length, "carrera", "carreras")}</span></div>`;
  v.appendChild(seg(STATUS_OPTS, cStatus, (s) => { cStatus = s; render(); }));
  const c = document.createElement("div"); c.className = "card";
  c.innerHTML = t.items.map((x) => tripCard(x)).join("") || empty("car", "Sin carreras", "Aquí verás cada viaje con su recogida, destino e importe.");
  v.appendChild(c);
}
async function clientePedir(v) {
  const r = await api("/client/requests");
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Pedir una carrera</h2></div>
    <form class="card" id="f"><div class="two"><div><label class="f">Fecha</label><input type="date" name="req_date" min="${today()}" value="${today()}" required></div>
    <div><label class="f">Hora</label><input type="time" name="req_time"></div></div>
    <label class="f">¿Dónde te busco?</label><input name="pickup" placeholder="Dirección o lugar de recogida" required>
    <label class="f">¿A dónde vas?</label><input name="dropoff" placeholder="Destino" required>
    <label class="f">Nota (opcional)</label><input name="note" placeholder="Ej.: llevo maleta, somos 3">
    <button class="acc block" style="margin-top:16px">${ic("send")}Enviar solicitud</button>
    <p class="mut" style="margin:10px 0 0">Te aviso cuando la confirme, con el importe.</p></form>
    <div class="sec"><h2>Mis solicitudes</h2></div>
    <div class="card flush">${r.items.map((x) => `<div class="li" style="cursor:default"><div class="grow"><div class="name">${esc(x.pickup)} → ${esc(x.dropoff)}</div>
      <div class="mut">${fdateS(x.req_date)}${x.req_time ? " · " + esc(x.req_time) : ""}${x.answer_note ? " · " + esc(x.answer_note) : ""}</div></div>
      <div style="text-align:right">${reqChip(x.status)}${x.status === "pending" ? `<div><button class="danger sm" style="margin-top:6px" data-cancel="${x.id}">Cancelar</button></div>` : ""}</div></div>`).join("") || empty("inbox", "Sin solicitudes", "Cuando pidas una carrera aparecerá aquí.")}</div>`;
  v.querySelector("#f").onsubmit = guard(async (e) => {
    e.preventDefault();
    await api("/client/requests", "POST", formData(e.target));
    toast("Solicitud enviada"); render();
  });
  v.querySelectorAll("[data-cancel]").forEach((b) => (b.onclick = guard(async () => { await api(`/client/requests/${b.dataset.cancel}/cancel`, "POST", {}); toast("Solicitud cancelada"); render(); })));
}
async function clientePagos(v) {
  const [p, s] = await Promise.all([api("/client/payments"), api("/client/summary")]);
  v.innerHTML = `<div class="stats" style="margin-top:8px"><div class="stat"><div class="k">${ic("check")}Total pagado</div><div class="v ok">${eur(s.paid_cents)}</div></div>
    <div class="stat"><div class="k">${ic("wallet")}Pendiente</div><div class="v ${s.pending_cents > 0 ? "bad" : "ok"}">${eur(s.pending_cents)}</div></div></div>
    <div class="sec"><h2>Historial de pagos</h2></div>
    <div class="card flush">${p.items.map((x) => payItem(x, false)).join("") || empty("wallet", "Aún no hay pagos", "Cada pago que registre aparecerá aquí con su fecha.")}</div>`;
}
async function avisosView(v) {
  const r = await api("/notifications");
  const nIcon = (t) => /pago/i.test(t) ? "check" : /solicitud|confirmada|disponible/i.test(t) ? "inbox" : /recordatorio/i.test(t) ? "clock" : "car";
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Avisos</h2></div><div class="card flush">${r.items.map((n) => `<div class="nt ${n.read ? "" : "new"}"><div class="ic">${ic(nIcon(n.title))}</div><div><b>${esc(n.title)}</b><div style="font-size:.9rem">${esc(n.body)}</div><div class="mut">${fdt(n.created_at)}</div></div></div>`).join("") || empty("bell", "Sin avisos", "Aquí llegan las carreras nuevas, los pagos y los recordatorios.")}</div>`;
  if (S.unread) { await api("/notifications/read", "POST", {}); S.unread = 0; document.querySelectorAll(".dot").forEach((d) => d.remove()); }
}

// ---------- Admin
async function adminInicio(v) {
  const [s, rq] = await Promise.all([api("/admin/summary"), api("/admin/requests")]);
  const net = s.month_collected_cents - s.month_expenses_cents;
  v.innerHTML = `<div class="hero"><div class="lbl">${ic("wallet")}Total por cobrar</div><div class="big">${bigEur(s.pending_cents)}</div>
    <div class="sub">${s.top_debtors.length ? plural(s.top_debtors.length, "cliente te debe", "clientes te deben") + " dinero" : "Nadie te debe nada"}</div>
    <div class="row"><div><span>Carreras</span><b>${s.month_trips}</b></div><div><span>Cargado</span><b>${eur(s.month_charged_cents)}</b></div><div><span>Cobrado</span><b>${eur(s.month_collected_cents)}</b></div></div></div>
    <div class="stats"><div class="stat"><div class="k">${ic("fuel")}Gastos del mes</div><div class="v warn">${eur(s.month_expenses_cents)}</div></div>
    <div class="stat"><div class="k">${ic("chart")}Neto del mes</div><div class="v ${net >= 0 ? "ok" : "bad"}">${eur(net)}</div></div></div>
    ${rq.items.length ? `<div class="sec"><h2>Solicitudes nuevas <span class="chip warn">${rq.items.length}</span></h2></div>${rq.items.map((r) => `<div class="card req">
      <div class="row"><div class="grow"><b>${esc(r.client_name)}</b><div class="mut">${fdateS(r.req_date)}${r.req_time ? " · " + esc(r.req_time) : ""}</div></div>${reqChip(r.status)}</div>
      <div class="route" style="margin-top:10px"><div class="rail"><i></i><s></s><u></u></div><div class="pl"><small>Recogida</small>${esc(r.pickup)}</div><div></div><div class="pl"><small>Destino</small>${esc(r.dropoff)}</div></div>
      ${r.note ? `<div class="mut" style="margin-top:8px">“${esc(r.note)}”</div>` : ""}
      <div class="acts"><button class="danger" data-rej="${r.id}">${ic("x")}Rechazar</button><button class="ok" data-acc="${r.id}">${ic("check")}Aceptar</button></div></div>`).join("")}` : ""}
    <div class="sec"><h2>Últimos 6 meses</h2></div><div class="card">${barChart(s.series)}</div>
    <div class="sec"><h2>Mayores deudas</h2><a id="vc">Ver clientes</a></div>
    <div class="card flush">${s.top_debtors.map((d) => `<div class="li" data-c="${d.id}">${avatar(d.name)}<div class="grow"><div class="name">${esc(d.name)}</div>${d.oldest_unpaid ? `<div class="mut">Sin pagar desde ${fdate(d.oldest_unpaid)}</div>` : ""}</div><span class="amt bad">${eur(d.pending_cents)}</span><span class="chev">${ic("chev")}</span></div>`).join("") || empty("check", "Todo cobrado", "Nadie tiene saldo pendiente.")}</div>
    <div class="sec"><h2>Informe mensual</h2></div><input type="month" id="mes" value="${S.month || today().slice(0, 7)}"><div id="inf"></div>`;
  v.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => go("clientes", el.dataset.c)));
  v.querySelector("#vc").onclick = () => go("clientes");
  v.querySelectorAll("[data-acc]").forEach((b) => (b.onclick = () => acceptRequest(rq.items.find((r) => r.id === b.dataset.acc))));
  v.querySelectorAll("[data-rej]").forEach((b) => (b.onclick = () => rejectRequest(b.dataset.rej)));
  const load = guard(async () => {
    S.month = v.querySelector("#mes").value;
    const r = await api("/admin/report?month=" + S.month);
    v.querySelector("#inf").innerHTML = `<div class="card"><div class="stats" style="grid-template-columns:repeat(3,1fr)">
      <div><div class="mut">Carreras</div><b>${r.totals.trips}</b></div><div><div class="mut">Cargado</div><b>${eur(r.totals.charged_cents)}</b></div><div><div class="mut">Cobrado</div><b class="ok">${eur(r.totals.collected_cents)}</b></div></div>
      ${r.rows.map((x) => `<div class="li" data-c="${x.id}">${avatar(x.name)}<div class="grow"><div class="name">${esc(x.name)}</div><div class="mut">${plural(x.trips, "carrera", "carreras")} · cobrado ${eur(x.collected_cents)}</div></div><div style="text-align:right"><div class="mut">Debe hoy</div><span class="amt ${x.pending_cents > 0 ? "bad" : "ok"}">${eur(x.pending_cents)}</span></div></div>`).join("") || empty("calendar", "Sin movimientos ese mes")}</div>`;
    v.querySelectorAll("#inf [data-c]").forEach((el) => (el.onclick = () => go("clientes", el.dataset.c)));
  });
  v.querySelector("#mes").onchange = load;
  load();
}
function acceptRequest(r) {
  modal(`<h2>Aceptar carrera</h2><p class="mut">${esc(r.client_name)} · ${fdateS(r.req_date)}${r.req_time ? " · " + esc(r.req_time) : ""}<br>${esc(r.pickup)} → ${esc(r.dropoff)}</p>
    <form id="f"><label class="f">Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" inputmode="decimal" required>
    <label class="f">Mensaje para el cliente (opcional)</label><input name="note" placeholder="Ej.: paso 10 minutos antes">
    <button class="ok block" style="margin-top:16px">${ic("check")}Confirmar y registrar carrera</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => { e.preventDefault(); await api(`/admin/requests/${r.id}/accept`, "POST", formData(e.target)); m.remove(); toast("Carrera confirmada"); render(); });
  });
}
function rejectRequest(id) {
  modal(`<h2>Rechazar solicitud</h2><form id="f"><label class="f">Motivo para el cliente (opcional)</label><input name="note" placeholder="Ej.: ese día no estoy disponible">
    <button class="danger block" style="margin-top:16px">${ic("x")}Rechazar</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => { e.preventDefault(); await api(`/admin/requests/${id}/reject`, "POST", formData(e.target)); m.remove(); toast("Solicitud rechazada"); render(); });
  });
}
async function adminClientes(v) {
  const r = await api("/admin/clients");
  const debt = r.items.reduce((a, c) => a + Math.max(0, c.pending_cents), 0);
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Clientes</h2><span class="mut">${plural(r.items.length, "cliente", "clientes")} · ${eur(debt)} por cobrar</span></div>
    <div class="search">${ic("search")}<input type="search" id="q" placeholder="Buscar por nombre, correo o teléfono"></div>
    <div class="card flush">${r.items.map((c) => `<div class="li" data-q="${esc((c.name + " " + c.email + " " + (c.phone || "")).toLowerCase())}" data-c="${c.id}">${avatar(c.name)}
      <div class="grow"><div class="name">${esc(c.name)}${c.active ? "" : ` <span class="chip n">Inactivo</span>`}</div><div class="mut">${esc(c.phone || c.email)}</div></div>
      <div style="text-align:right"><span class="amt ${c.pending_cents > 0 ? "bad" : "ok"}">${eur(c.pending_cents)}</span><div class="mut" style="font-size:.74rem">${c.pending_cents > 0 ? "pendiente" : "al día"}</div></div><span class="chev">${ic("chev")}</span></div>`).join("") || empty("users", "Aún no tienes clientes", "Crea el primero con el botón de abajo.")}</div>
    <button class="acc block" id="nc" style="margin-top:6px">${ic("plus")}Nuevo cliente</button>`;
  v.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => go("clientes", el.dataset.c)));
  v.querySelector("#nc").onclick = clientForm;
  v.querySelector("#q").oninput = (e) => { const q = e.target.value.trim().toLowerCase(); v.querySelectorAll("[data-q]").forEach((el) => (el.style.display = el.dataset.q.includes(q) ? "" : "none")); };
}
let aStatus = "pending";
async function adminCarreras(v) {
  const [t, cl] = await Promise.all([api("/admin/trips?status=" + aStatus), api("/admin/clients")]);
  const names = Object.fromEntries(cl.items.map((c) => [c.id, c.name]));
  const sum = t.items.reduce((a, x) => a + (aStatus === "pending" ? x.pending_cents : x.amount_cents), 0);
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Carreras</h2><span class="mut">${plural(t.items.length, "carrera", "carreras")} · ${eur(sum)}</span></div>`;
  v.appendChild(seg(STATUS_OPTS, aStatus, (s) => { aStatus = s; render(); }));
  const c = document.createElement("div"); c.className = "card";
  c.innerHTML = t.items.map((x) => tripCard(x, { admin: true, client: names[x.client_id] })).join("") || empty("car", "Sin carreras aquí");
  v.appendChild(c);
  bindTripActions(v, t.items);
}
function bindTripActions(v, trips) {
  v.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => tripForm(trips.find((t) => t.id === b.dataset.edit))));
  v.querySelectorAll("[data-del]").forEach((b) => (b.onclick = guard(async () => { if (confirm("¿Borrar esta carrera?")) { await api("/admin/trips/" + b.dataset.del, "DELETE"); toast("Carrera borrada"); render(); } })));
  v.querySelectorAll("[data-delpay]").forEach((b) => (b.onclick = guard(async () => { if (confirm("¿Anular este pago? Sus carreras vuelven a quedar pendientes.")) { await api("/admin/payments/" + b.dataset.delpay, "DELETE"); toast("Pago anulado"); render(); } })));
}
let dTab = "trips";
async function clienteDetalle(v) {
  const d = await api("/admin/clients/" + S.clientId);
  const c = d.client, p = d.totals.pending_cents;
  const waText = `Hola ${c.name.split(" ")[0]}, te escribo por las carreras. Tu saldo pendiente es de ${eur(p)}. Puedes ver el detalle en tu cuenta: ${location.origin}`;
  v.innerHTML = `<button class="ghost sm" id="back" style="margin:6px 0 2px">${ic("back")}Clientes</button>
    <div class="hero"><div class="hid">${avatar(c.name, "lg")}<div style="flex:1;min-width:0"><b style="font-size:1.15rem;display:block">${esc(c.name)}</b><span style="opacity:.75;font-size:.82rem">${esc(c.phone || c.email)}</span></div>${c.active ? "" : `<span class="chip n">Inactivo</span>`}</div>
      <div class="lbl" style="margin-top:14px">Saldo pendiente</div><div class="big">${bigEur(p)}</div>
      <div class="row"><div><span>Cargado</span><b>${eur(d.totals.charged_cents)}</b></div><div><span>Pagado</span><b>${eur(d.totals.paid_cents)}</b></div><div><span>Carreras</span><b>${d.trips.length}</b></div></div></div>
    <div class="tiles">
      <button class="tile hi" id="nt"><span class="ic">${ic("car")}</span>Carrera</button>
      <button class="tile" id="np"><span class="ic">${ic("euro")}</span>Cobrar</button>
      <button class="tile" id="all"><span class="ic">${ic("check")}</span>Cobrar todo</button>
      <button class="tile wa" id="wa"><span class="ic">${ic("chat")}</span>WhatsApp</button>
      <button class="tile" id="rem"><span class="ic">${ic("bell")}</span>Recordar</button>
      <button class="tile" id="pdf"><span class="ic">${ic("file")}</span>Estado</button>
      <button class="tile" id="csv"><span class="ic">${ic("download")}</span>CSV</button>
      <button class="tile" id="ed"><span class="ic">${ic("edit")}</span>Editar</button></div>
    <div id="segw"></div><div class="card" id="list"></div>`;
  const drawList = () => {
    const L = v.querySelector("#list");
    L.className = dTab === "pays" ? "card flush" : "card";
    L.innerHTML = dTab === "trips" ? d.trips.map((x) => tripCard(x, { admin: true })).join("") || empty("car", "Sin carreras") : d.payments.map((x) => payItem(x, true)).join("") || empty("wallet", "Sin pagos");
    bindTripActions(v, d.trips);
  };
  v.querySelector("#segw").appendChild(seg([["trips", `Carreras (${d.trips.length})`], ["pays", `Pagos (${d.payments.length})`]], dTab, (s) => { dTab = s; v.querySelectorAll(".seg button").forEach((b) => b.classList.toggle("on", b.dataset.s === s)); drawList(); }));
  drawList();
  v.querySelector("#back").onclick = () => go("clientes");
  v.querySelector("#nt").onclick = () => tripForm(null, c.id);
  v.querySelector("#np").onclick = () => p > 0 ? payForm(c.id, d.trips.filter((t) => t.pending_cents > 0), p) : toast("No tiene saldo pendiente");
  v.querySelector("#all").onclick = guard(async () => {
    if (p <= 0) return toast("No tiene saldo pendiente");
    if (!confirm(`¿Registrar un pago de ${eur(p)} que salda toda la deuda de ${c.name}?`)) return;
    await api("/admin/payments", "POST", { client_id: c.id, amount: p / 100, method: "Efectivo", pay_date: today(), notify: true });
    toast("Deuda saldada"); render();
  });
  v.querySelector("#wa").onclick = () => { const ph = String(c.phone || "").replace(/\D/g, ""); if (!ph) return toast("Este cliente no tiene teléfono"); window.open(`https://wa.me/${ph}?text=${encodeURIComponent(waText)}`, "_blank", "noopener"); };
  v.querySelector("#rem").onclick = guard(async () => { await api(`/admin/clients/${c.id}/reminder`, "POST", {}); toast("Recordatorio enviado"); });
  v.querySelector("#ed").onclick = () => clientEdit(c);
  v.querySelector("#pdf").onclick = () => printStatement(c.name, d.totals, d.trips, d.payments);
  v.querySelector("#csv").onclick = () => {
    const q = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const rows = [["Fecha", "Hora", "Recogida", "Destino", "Importe", "Pagado", "Pendiente"], ...d.trips.map((t) => [t.trip_date, t.trip_time || "", t.pickup, t.dropoff, (t.amount_cents / 100).toFixed(2).replace(".", ","), (t.paid_cents / 100).toFixed(2).replace(".", ","), (t.pending_cents / 100).toFixed(2).replace(".", ",")])];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + rows.map((r) => r.map(q).join(";")).join("\n")], { type: "text/csv" }));
    a.download = `carreras-${c.name.replace(/\W+/g, "_")}.csv`; a.click();
  };
}

async function adminGastos(v) {
  const month = S.gMonth || today().slice(0, 7);
  const [g, r] = await Promise.all([api("/admin/expenses?month=" + month), api("/admin/report?month=" + month)]);
  const net = r.totals.collected_cents - g.total_cents;
  const cats = Object.entries(g.by_category).sort((a, b) => b[1] - a[1]);
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Gastos del vehículo</h2></div>
    <input type="month" id="gm" value="${month}">
    <div class="hero" style="margin-top:12px"><div class="lbl">${ic("fuel")}Gastos de ${fmonth(month)}</div><div class="big">${bigEur(g.total_cents)}</div>
      <div class="row"><div><span>Cobrado</span><b>${eur(r.totals.collected_cents)}</b></div><div><span>Gastos</span><b>${eur(g.total_cents)}</b></div><div><span>Neto</span><b>${eur(net)}</b></div></div>
      <div class="acts"><button class="acc sm" id="ng">${ic("plus")}Añadir gasto</button></div></div>
    ${cats.length ? `<div class="card">${cats.map(([k, val]) => `<div class="cat"><div class="row"><span class="grow">${esc(k)}</span><span class="amt">${eur(val)}</span></div><div class="bar"><b style="width:${Math.round((val / g.total_cents) * 100)}%"></b></div></div>`).join("")}</div>` : ""}
    <div class="sec"><h2>Movimientos</h2></div>
    <div class="card flush">${g.items.map((e) => `<div class="li" style="cursor:default"><div class="av" style="background:var(--warn-bg);color:var(--warn)">${ic(e.category === "Combustible" ? "fuel" : "receipt")}</div>
      <div class="grow"><div class="name">${esc(e.category)}</div><div class="mut">${fdate(e.exp_date)}${e.note ? " · " + esc(e.note) : ""}</div></div><span class="amt">${eur(e.amount_cents)}</span>
      <button class="danger sm" data-dg="${e.id}" aria-label="Borrar gasto">${ic("trash")}</button></div>`).join("") || empty("receipt", "Sin gastos este mes", "Registra combustible, mantenimiento o peajes para ver tu beneficio real.")}</div>`;
  v.querySelector("#gm").onchange = (e) => { S.gMonth = e.target.value; render(); };
  v.querySelector("#ng").onclick = () => expenseForm(g.categories);
  v.querySelectorAll("[data-dg]").forEach((b) => (b.onclick = guard(async () => { if (confirm("¿Borrar este gasto?")) { await api("/admin/expenses/" + b.dataset.dg, "DELETE"); toast("Gasto borrado"); render(); } })));
}

// ---------- Estado de cuenta imprimible
function printStatement(name, totals, trips, payments) {
  const w = window.open("", "_blank");
  if (!w) return toast("Permite las ventanas emergentes para descargarlo");
  const tr = trips.slice().sort((a, b) => (a.trip_date + (a.trip_time || "")).localeCompare(b.trip_date + (b.trip_time || ""))).map((t) => `<tr><td>${fdate(t.trip_date)}${t.trip_time ? "<br><span class=mut>" + esc(t.trip_time) + "</span>" : ""}</td><td>${esc(t.pickup)}</td><td>${esc(t.dropoff)}</td><td class="n">${eur(t.amount_cents)}</td><td class="n">${eur(t.pending_cents)}</td></tr>`).join("");
  const pr = payments.slice().sort((a, b) => a.pay_date.localeCompare(b.pay_date)).map((p) => `<tr><td>${fdate(p.pay_date)}</td><td>${esc(p.method)}</td><td>${esc(p.note || "")}</td><td class="n">${eur(p.amount_cents)}</td></tr>`).join("");
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Estado de cuenta · ${esc(name)}</title>
  <style>body{font:13px/1.45 system-ui,sans-serif;color:#0B1220;margin:24px}.hd{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:3px solid #F5B400}.lg{width:40px;height:40px;border-radius:12px;background:#F5B400;display:grid;place-items:center;font-weight:900;color:#271A00}h1{font-size:20px;margin:0}h2{font-size:14px;margin:22px 0 6px;text-transform:uppercase;letter-spacing:.05em;color:#173563}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #E6E9F0;padding:7px 4px;text-align:left;vertical-align:top}th{font-size:10.5px;color:#667085;text-transform:uppercase}.n{text-align:right;white-space:nowrap}.box{display:flex;gap:10px;margin-top:16px}.box div{flex:1;background:#F3F5F9;border-radius:12px;padding:10px}.box b{display:block;font-size:17px}.bad{color:#E5372B}.mut{color:#667085}@media print{button{display:none}}</style></head><body>
  <div class="hd"><div class="lg">€</div><div><h1>Estado de cuenta</h1><div class="mut">${esc(name)} · ${new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</div></div></div>
  <div class="box"><div><span class="mut">Total carreras</span><b>${eur(totals.charged_cents)}</b></div><div><span class="mut">Total pagado</span><b>${eur(totals.paid_cents)}</b></div><div><span class="mut">Saldo pendiente</span><b class="bad">${eur(totals.pending_cents)}</b></div></div>
  <h2>Carreras</h2><table><tr><th>Fecha</th><th>Recogida</th><th>Destino</th><th class="n">Importe</th><th class="n">Pendiente</th></tr>${tr || `<tr><td colspan="5" class="mut">Sin carreras</td></tr>`}</table>
  <h2>Pagos</h2><table><tr><th>Fecha</th><th>Método</th><th>Nota</th><th class="n">Importe</th></tr>${pr || `<tr><td colspan="4" class="mut">Sin pagos</td></tr>`}</table>
  <p><button id="imprimir" style="width:100%;padding:12px;margin-top:20px;font:inherit;font-weight:700;border:0;border-radius:10px;background:#0B1B33;color:#fff">Imprimir o guardar PDF</button></p>
  </body></html>`);
  w.document.close();
  w.document.getElementById("imprimir").onclick = () => w.print();
}

// ---------- Formularios admin
function quickAdd() {
  modal(`<h2>¿Qué quieres registrar?</h2><div class="menu">
    <button data-k="trip"><span class="ic">${ic("car")}</span><span>Carrera<small>Un viaje fiado a un cliente</small></span></button>
    <button data-k="pay"><span class="ic">${ic("euro")}</span><span>Pago<small>Lo que te abonó un cliente</small></span></button>
    <button data-k="exp"><span class="ic">${ic("fuel")}</span><span>Gasto<small>Combustible, taller, peajes…</small></span></button>
    <button data-k="cli"><span class="ic">${ic("user")}</span><span>Cliente<small>Crear una cuenta nueva</small></span></button></div>`, (m) => {
    m.querySelectorAll("[data-k]").forEach((b) => (b.onclick = guard(async () => {
      m.remove();
      const k = b.dataset.k;
      if (k === "trip") return tripForm();
      if (k === "cli") return clientForm();
      if (k === "exp") return expenseForm((await api("/admin/expenses")).categories);
      const cl = (await api("/admin/clients")).items.filter((c) => c.pending_cents > 0);
      if (!cl.length) return toast("Nadie tiene saldo pendiente");
      payForm(null, [], 0, cl);
    })));
  });
}
async function tripForm(trip, clientId) {
  const [all, pl] = await Promise.all([api("/admin/clients"), api("/admin/places")]);
  const cl = all.items.filter((c) => c.active);
  if (!cl.length && !trip) return toast("Primero crea un cliente");
  modal(`<h2>${trip ? "Editar carrera" : "Nueva carrera"}</h2><form id="f">
    ${trip ? "" : `<label class="f">Cliente</label><select name="client_id" required>${cl.map((c) => `<option value="${c.id}" ${c.id === clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>`}
    <div class="two"><div><label class="f">Fecha</label><input type="date" name="trip_date" value="${trip?.trip_date || today()}" required></div>
    <div><label class="f">Hora</label><input type="time" name="trip_time" value="${esc(trip?.trip_time || "")}"></div></div>
    <label class="f">Recogida (dónde lo buscaste)</label><input name="pickup" list="lugares" autocomplete="off" value="${esc(trip?.pickup)}" required>
    <label class="f">Destino (a dónde fue)</label><input name="dropoff" list="lugares" autocomplete="off" value="${esc(trip?.dropoff)}" required>
    <datalist id="lugares">${pl.items.map((x) => `<option value="${esc(x)}">`).join("")}</datalist>
    <label class="f">Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" inputmode="decimal" value="${trip ? trip.amount_cents / 100 : ""}" required>
    <label class="f">Notas (opcional)</label><input name="notes" value="${esc(trip?.notes)}">
    ${trip ? "" : `<label class="check"><input type="checkbox" name="notify" checked>Avisar al cliente</label>`}
    <button class="acc block" style="margin-top:14px">${ic("check")}Guardar carrera</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target); b.notify = !!b.notify;
      await api(trip ? "/admin/trips/" + trip.id : "/admin/trips", trip ? "PATCH" : "POST", b);
      m.remove(); toast(trip ? "Carrera actualizada" : "Carrera registrada"); render();
    });
  });
}
function payForm(clientId, pending, total, clients) {
  modal(`<h2>Registrar pago</h2>${clients ? "" : `<p class="mut">Pendiente: <b>${eur(total)}</b>. Se aplica primero a las carreras más antiguas.</p>`}<form id="f">
    ${clients ? `<label class="f">Cliente</label><select name="client_id" id="pc">${clients.map((c) => `<option value="${c.id}" data-p="${c.pending_cents}">${esc(c.name)} · debe ${eur(c.pending_cents)}</option>`).join("")}</select>` : ""}
    <label class="f">Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" ${clients ? `value="${clients[0].pending_cents / 100}" max="${clients[0].pending_cents / 100}"` : `max="${total / 100}" value="${total / 100}"`} inputmode="decimal" required>
    <div class="two"><div><label class="f">Fecha</label><input type="date" name="pay_date" value="${today()}" required></div>
    <div><label class="f">Método</label><select name="method"><option>Efectivo</option><option>Bizum</option><option>Transferencia</option><option>Tarjeta</option><option>Otro</option></select></div></div>
    ${pending.length ? `<label class="f">Aplicar a</label><select name="trip_id"><option value="">Las más antiguas primero</option>${pending.map((t) => `<option value="${t.id}">${fdate(t.trip_date)} · ${esc(t.pickup)} → ${esc(t.dropoff)} (${eur(t.pending_cents)})</option>`).join("")}</select>` : ""}
    <label class="f">Nota (opcional)</label><input name="note">
    <label class="check"><input type="checkbox" name="notify" checked>Avisar al cliente</label>
    <button class="ok block" style="margin-top:14px">${ic("check")}Registrar pago</button></form>`, (m) => {
    const pc = m.querySelector("#pc");
    if (pc) pc.onchange = () => { const v = pc.selectedOptions[0].dataset.p / 100; const a = m.querySelector("[name=amount]"); a.value = v; a.max = v; };
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target);
      if (clientId) b.client_id = clientId;
      b.notify = !!b.notify;
      await api("/admin/payments", "POST", b);
      m.remove(); toast("Pago registrado"); render();
    });
  });
}
function expenseForm(categories) {
  modal(`<h2>Nuevo gasto</h2><form id="f">
    <label class="f">Categoría</label><select name="category">${categories.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
    <div class="two"><div><label class="f">Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" inputmode="decimal" required></div>
    <div><label class="f">Fecha</label><input type="date" name="exp_date" value="${today()}" required></div></div>
    <label class="f">Nota (opcional)</label><input name="note" placeholder="Ej.: cambio de aceite">
    <button class="acc block" style="margin-top:16px">${ic("check")}Guardar gasto</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => { e.preventDefault(); await api("/admin/expenses", "POST", formData(e.target)); m.remove(); toast("Gasto guardado"); if (S.tab !== "gastos") go("gastos"); else render(); });
  });
}
function clientForm() {
  modal(`<h2>Nuevo cliente</h2><form id="f"><label class="f">Nombre</label><input name="name" required>
    <label class="f">Correo (será su usuario)</label><input name="email" type="email" inputmode="email" required>
    <label class="f">Teléfono con prefijo (ej. 34600111222)</label><input name="phone" inputmode="tel">
    <label class="f">Contraseña inicial (mínimo 8)</label><input name="password" minlength="8" required>
    <label class="check"><input type="checkbox" name="notify_whatsapp">Avisos por WhatsApp</label>
    <label class="check"><input type="checkbox" name="consent">El cliente aceptó recibir avisos (RGPD)</label>
    <button class="acc block" style="margin-top:14px">${ic("check")}Crear cliente</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target); b.notify_whatsapp = !!b.notify_whatsapp; b.consent = !!b.consent;
      const r = await api("/admin/clients", "POST", b);
      m.remove(); toast("Cliente creado"); go("clientes", r.id);
    });
  });
}
function clientEdit(c) {
  modal(`<h2>Editar cliente</h2><form id="f"><label class="f">Nombre</label><input name="name" value="${esc(c.name)}" required>
    <label class="f">Teléfono</label><input name="phone" value="${esc(c.phone)}" inputmode="tel">
    <label class="check"><input type="checkbox" name="notify_email" ${c.notify_email ? "checked" : ""}>Avisos por correo</label>
    <label class="check"><input type="checkbox" name="notify_whatsapp" ${c.notify_whatsapp ? "checked" : ""}>Avisos por WhatsApp</label>
    <label class="check"><input type="checkbox" name="active" ${c.active ? "checked" : ""}>Cuenta activa</label>
    <button class="block" style="margin-top:14px">${ic("check")}Guardar</button></form>
    <form id="pw"><label class="f">Nueva contraseña para el cliente</label><input name="password" minlength="8" placeholder="Mínimo 8 caracteres" required><button class="ghost block" style="margin-top:10px">${ic("lock")}Cambiar contraseña</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target); b.notify_email = !!b.notify_email; b.notify_whatsapp = !!b.notify_whatsapp; b.active = !!b.active;
      await api("/admin/clients/" + c.id, "PATCH", b);
      m.remove(); toast("Cliente actualizado"); render();
    });
    m.querySelector("#pw").onsubmit = guard(async (e) => { e.preventDefault(); await api(`/admin/clients/${c.id}/password`, "POST", formData(e.target)); m.remove(); toast("Contraseña cambiada"); });
  });
}

render();
