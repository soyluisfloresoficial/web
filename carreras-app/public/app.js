"use strict";
const $app = document.getElementById("app");
const S = { me: null, unread: 0, tab: "inicio", clientId: null };

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const eur = (c) => (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const fdate = (d) => (d ? new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "");
const fdt = (d) => new Date(d).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const today = () => new Date().toISOString().slice(0, 10);

function toast(m) { const t = document.getElementById("toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2600); }
async function api(path, method = "GET", body) {
  const r = await fetch("/api" + path, { method, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== "/login" && path !== "/me") { S.me = null; return render(); }
  if (!r.ok) throw new Error(j.error || "Error");
  return j;
}
const guard = (fn) => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message); } };

function modal(html, onMount) {
  const m = document.createElement("div");
  m.className = "modal";
  m.innerHTML = `<div>${html}</div>`;
  m.addEventListener("click", (e) => { if (e.target === m) m.remove(); });
  document.body.appendChild(m);
  onMount && onMount(m);
  return m;
}
const formData = (el) => Object.fromEntries(new FormData(el).entries());

// ---------- Vistas
async function render() {
  if (!S.me) {
    try { const r = await api("/me"); S.me = r.user; S.unread = r.unread; } catch { S.me = null; }
  }
  if (!S.me) return loginView();
  const admin = S.me.role === "admin";
  const tabs = admin
    ? [["inicio", "📊", "Inicio"], ["clientes", "👥", "Clientes"], ["carreras", "🚗", "Carreras"], ["avisos", "🔔", "Avisos"]]
    : [["inicio", "💶", "Resumen"], ["carreras", "🚗", "Carreras"], ["pagos", "✅", "Pagos"], ["avisos", "🔔", "Avisos"]];
  $app.innerHTML = `<header><h1>${esc(S.me.name)}</h1><button class="sec sm" id="menu">Cuenta</button></header>
  <main id="view"></main>
  <nav>${tabs.map(([k, i, l]) => `<a href="#" data-t="${k}" class="${S.tab === k ? "on" : ""}"><b>${i}</b>${l}${k === "avisos" && S.unread ? `<span class="dot">${S.unread}</span>` : ""}</a>`).join("")}</nav>`;
  $app.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); S.tab = a.dataset.t; S.clientId = null; render(); }));
  document.getElementById("menu").onclick = accountModal;
  const v = document.getElementById("view");
  try {
    if (S.tab === "avisos") return await avisosView(v);
    if (admin) {
      if (S.clientId) return await clienteDetalle(v);
      if (S.tab === "inicio") return await adminInicio(v);
      if (S.tab === "clientes") return await adminClientes(v);
      if (S.tab === "carreras") return await adminCarreras(v);
    } else {
      if (S.tab === "inicio") return await clienteInicio(v);
      if (S.tab === "carreras") return await clienteCarreras(v);
      if (S.tab === "pagos") return await clientePagos(v);
    }
  } catch (e) { v.innerHTML = `<div class="card bad">${esc(e.message)}</div>`; }
}

function loginView() {
  $app.innerHTML = `<form class="login" id="f"><h1 style="margin-bottom:14px">Carreras</h1>
    <label>Correo</label><input name="email" type="email" autocomplete="username" required>
    <label>Contraseña</label><input name="password" type="password" autocomplete="current-password" required>
    <button style="width:100%">Entrar</button>
    <p class="mut">Si no tienes cuenta, pídesela a tu conductor.</p></form>`;
  document.getElementById("f").onsubmit = guard(async (e) => {
    e.preventDefault();
    await api("/login", "POST", formData(e.target));
    S.me = null; S.tab = "inicio"; render();
  });
}

function accountModal() {
  modal(`<h2>Mi cuenta</h2><p class="mut">${esc(S.me.email)}</p>
    <form id="pw"><label>Contraseña actual</label><input name="current" type="password" required>
    <label>Nueva contraseña (mínimo 10 caracteres)</label><input name="next" type="password" minlength="10" required>
    <button>Cambiar contraseña</button></form>
    <p><button class="danger" id="out">Cerrar sesión</button></p>`, (m) => {
    m.querySelector("#pw").onsubmit = guard(async (e) => { e.preventDefault(); await api("/password", "POST", formData(e.target)); m.remove(); toast("Contraseña actualizada"); });
    m.querySelector("#out").onclick = guard(async () => { await api("/logout", "POST", {}); S.me = null; m.remove(); render(); });
  });
}

// ---------- Componentes
const tripItem = (t, admin) => {
  const pend = t.pending_cents;
  const st = pend === 0 ? `<span class="badge ok">Pagada</span>` : t.paid_cents > 0 ? `<span class="badge warn">Parcial</span>` : `<span class="badge bad">Pendiente</span>`;
  return `<div class="item"><div class="row"><div><div class="route">${fdate(t.trip_date)}</div><div><span class="mut">Recogida:</span> ${esc(t.pickup)}</div><div><span class="mut">Destino:</span> ${esc(t.dropoff)}</div>
    ${t.notes ? `<div class="mut">${esc(t.notes)}</div>` : ""}
    ${t.paid_cents > 0 ? `<div class="mut">Pagado ${eur(t.paid_cents)}${pend === 0 && t.last_pay_date ? " el " + fdate(t.last_pay_date) : ""}</div>` : ""}</div>
    <div style="text-align:right"><b>${eur(t.amount_cents)}</b><br>${st}${pend > 0 && t.paid_cents > 0 ? `<div class="mut">Debe ${eur(pend)}</div>` : ""}</div></div>
    ${admin ? `<div style="margin-top:8px;display:flex;gap:6px"><button class="sec sm" data-edit="${t.id}">Editar</button><button class="danger sm" data-del="${t.id}">Borrar</button></div>` : ""}</div>`;
};
const payItem = (p, admin) => `<div class="item"><div class="row"><div><b>${eur(p.amount_cents)}</b> · ${esc(p.method)}<div class="mut">${fdate(p.pay_date)}${p.note ? " · " + esc(p.note) : ""}</div>
  ${p.applied_to ? `<div class="mut">Aplicado a: ${esc(p.applied_to).replace(/\d{4}-\d{2}-\d{2}/g, (d) => fdate(d)).replace(/ \| /g, "; ")}</div>` : ""}</div>${admin ? `<button class="danger sm" data-delpay="${p.id}">Anular</button>` : ""}</div></div>`;

function statusTabs(cur, cb) {
  const el = document.createElement("div");
  el.className = "tabs";
  el.innerHTML = [["all", "Todas"], ["pending", "Pendientes"], ["paid", "Pagadas"]].map(([k, l]) => `<button class="sec sm ${cur === k ? "on" : ""}" data-s="${k}">${l}</button>`).join("");
  el.querySelectorAll("button").forEach((b) => (b.onclick = () => cb(b.dataset.s)));
  return el;
}

// ---------- Cliente
async function clienteInicio(v) {
  const [s, t] = await Promise.all([api("/client/summary"), api("/client/trips?status=pending")]);
  v.innerHTML = `<div class="card"><div class="mut">Saldo pendiente</div><div class="big ${s.pending_cents > 0 ? "bad" : "ok"}">${eur(s.pending_cents)}</div></div>
    <div class="grid"><div class="card"><div class="mut">Total en carreras</div><b>${eur(s.charged_cents)}</b></div><div class="card"><div class="mut">Total pagado</div><b class="ok">${eur(s.paid_cents)}</b></div></div>
    <p><button class="sec" id="pdf">Descargar estado de cuenta</button></p>
    <h2>Carreras por pagar</h2><div class="card">${t.items.map((x) => tripItem(x, false)).join("") || `<span class="mut">No tienes carreras pendientes.</span>`}</div>`;
  v.querySelector("#pdf").onclick = guard(async () => {
    const [all, pays] = await Promise.all([api("/client/trips"), api("/client/payments")]);
    printStatement(S.me.name, s, all.items, pays.items);
  });
}
let cStatus = "all";
async function clienteCarreras(v) {
  const t = await api("/client/trips?status=" + cStatus);
  v.innerHTML = "";
  v.appendChild(statusTabs(cStatus, (s) => { cStatus = s; render(); }));
  const c = document.createElement("div"); c.className = "card";
  c.innerHTML = t.items.map((x) => tripItem(x, false)).join("") || `<span class="mut">Sin carreras.</span>`;
  v.appendChild(c);
}
async function clientePagos(v) {
  const p = await api("/client/payments");
  v.innerHTML = `<h2>Historial de pagos</h2><div class="card">${p.items.map((x) => payItem(x, false)).join("") || `<span class="mut">Aún no hay pagos registrados.</span>`}</div>`;
}
async function avisosView(v) {
  const r = await api("/notifications");
  v.innerHTML = `<h2>Notificaciones</h2>${r.items.map((n) => `<div class="card ${n.read ? "" : "unread"}"><b>${esc(n.title)}</b><div>${esc(n.body)}</div><div class="mut">${fdt(n.created_at)}</div></div>`).join("") || `<div class="card mut">Sin avisos.</div>`}`;
  if (S.unread) { await api("/notifications/read", "POST", {}); S.unread = 0; document.querySelector(".dot")?.remove(); }
}

// ---------- Admin
async function adminInicio(v) {
  const s = await api("/admin/summary");
  v.innerHTML = `<div class="card"><div class="mut">Total por cobrar</div><div class="big ${s.pending_cents > 0 ? "bad" : "ok"}">${eur(s.pending_cents)}</div></div>
    <div class="grid"><div class="card"><div class="mut">Carreras este mes</div><b>${s.month_trips}</b><div class="mut">${eur(s.month_charged_cents)}</div></div>
    <div class="card"><div class="mut">Cobrado este mes</div><b class="ok">${eur(s.month_collected_cents)}</b></div></div>
    <p><button id="nt" style="width:100%">+ Registrar carrera</button></p>
    <h2>Mayores deudas</h2><div class="card">${s.top_debtors.map((d) => `<div class="item row" data-c="${d.id}" style="cursor:pointer"><div><b>${esc(d.name)}</b>${d.oldest_unpaid ? `<div class="mut">Más antigua sin pagar: ${fdate(d.oldest_unpaid)}</div>` : ""}</div><b class="bad">${eur(d.pending_cents)}</b></div>`).join("") || `<span class="mut">Nadie te debe nada.</span>`}</div>
    <h2>Informe mensual</h2><input type="month" id="mes" value="${S.month || today().slice(0, 7)}"><div id="inf"></div>`;
  v.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => { S.clientId = el.dataset.c; render(); }));
  v.querySelector("#nt").onclick = () => tripForm();
  const load = guard(async () => {
    S.month = v.querySelector("#mes").value;
    const r = await api("/admin/report?month=" + S.month);
    v.querySelector("#inf").innerHTML = `<div class="card"><div class="grid" style="grid-template-columns:repeat(3,1fr)">
      <div><div class="mut">Carreras</div><b>${r.totals.trips}</b></div><div><div class="mut">Cargado</div><b>${eur(r.totals.charged_cents)}</b></div><div><div class="mut">Cobrado</div><b class="ok">${eur(r.totals.collected_cents)}</b></div></div>
      ${r.rows.map((x) => `<div class="item row" data-c="${x.id}" style="cursor:pointer"><div><b>${esc(x.name)}</b><div class="mut">${x.trips} ${x.trips === 1 ? "carrera" : "carreras"} · cargado ${eur(x.charged_cents)} · cobrado ${eur(x.collected_cents)}</div></div><div style="text-align:right;white-space:nowrap"><div class="mut">Debe hoy</div><b class="${x.pending_cents > 0 ? "bad" : "ok"}">${eur(x.pending_cents)}</b></div></div>`).join("") || `<div class="item mut">Sin movimientos ese mes.</div>`}</div>`;
    v.querySelectorAll("#inf [data-c]").forEach((el) => (el.onclick = () => { S.clientId = el.dataset.c; render(); }));
  });
  v.querySelector("#mes").onchange = load;
  load();
}
async function adminClientes(v) {
  const r = await api("/admin/clients");
  v.innerHTML = `<p><button id="nc" style="width:100%">+ Nuevo cliente</button></p><input type="search" id="q" placeholder="Buscar cliente por nombre, correo o teléfono"><div class="card">${r.items.map((c) => `<div class="item row" data-q="${esc((c.name + " " + c.email + " " + (c.phone || "")).toLowerCase())}" data-c="${c.id}" style="cursor:pointer"><div><b>${esc(c.name)}</b>${c.active ? "" : ` <span class="badge">Inactivo</span>`}<div class="mut">${esc(c.email)}</div></div><b class="${c.pending_cents > 0 ? "bad" : "ok"}">${eur(c.pending_cents)}</b></div>`).join("") || `<span class="mut">Aún no tienes clientes.</span>`}</div>`;
  v.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => { S.clientId = el.dataset.c; render(); }));
  v.querySelector("#nc").onclick = clientForm;
  v.querySelector("#q").oninput = (e) => { const q = e.target.value.trim().toLowerCase(); v.querySelectorAll("[data-q]").forEach((el) => (el.style.display = el.dataset.q.includes(q) ? "" : "none")); };
}
let aStatus = "pending";
async function adminCarreras(v) {
  const [t, cl] = await Promise.all([api("/admin/trips?status=" + aStatus), api("/admin/clients")]);
  const names = Object.fromEntries(cl.items.map((c) => [c.id, c.name]));
  v.innerHTML = `<p><button id="nt">+ Registrar carrera</button></p>`;
  v.appendChild(statusTabs(aStatus, (s) => { aStatus = s; render(); }));
  const c = document.createElement("div"); c.className = "card";
  c.innerHTML = t.items.map((x) => `<div class="mut" style="margin-top:8px">${esc(names[x.client_id] || "")}</div>${tripItem(x, true)}`).join("") || `<span class="mut">Sin carreras.</span>`;
  v.appendChild(c);
  v.querySelector("#nt").onclick = () => tripForm();
  bindTripActions(v, t.items);
}
function bindTripActions(v, trips) {
  v.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = () => tripForm(trips.find((t) => t.id === b.dataset.edit))));
  v.querySelectorAll("[data-del]").forEach((b) => (b.onclick = guard(async () => { if (confirm("¿Borrar esta carrera?")) { await api("/admin/trips/" + b.dataset.del, "DELETE"); render(); } })));
  v.querySelectorAll("[data-delpay]").forEach((b) => (b.onclick = guard(async () => { if (confirm("¿Anular este pago? Las carreras vuelven a quedar pendientes.")) { await api("/admin/payments/" + b.dataset.delpay, "DELETE"); render(); } })));
}
async function clienteDetalle(v) {
  const d = await api("/admin/clients/" + S.clientId);
  const c = d.client;
  v.innerHTML = `<p><button class="sec sm" id="back">← Volver</button></p>
    <div class="card"><div class="row"><div><h1>${esc(c.name)}</h1><div class="mut">${esc(c.email)}${c.phone ? " · " + esc(c.phone) : ""}</div></div>
    <button class="sec sm" id="ed">Editar</button></div>
    <div class="big ${d.totals.pending_cents > 0 ? "bad" : "ok"}" style="margin-top:8px">${eur(d.totals.pending_cents)}</div>
    <div class="mut">Cargado ${eur(d.totals.charged_cents)} · Pagado ${eur(d.totals.paid_cents)}</div></div>
    <div class="acciones"><button id="nt">+ Carrera</button><button id="np">+ Pago</button><button class="sec" id="rem">Recordar saldo</button><button class="sec" id="pdf">Estado de cuenta</button><button class="sec" id="csv">CSV</button></div>
    <h2>Carreras</h2><div class="card">${d.trips.map((x) => tripItem(x, true)).join("") || `<span class="mut">Sin carreras.</span>`}</div>
    <h2>Pagos</h2><div class="card">${d.payments.map((x) => payItem(x, true)).join("") || `<span class="mut">Sin pagos.</span>`}</div>`;
  v.querySelector("#back").onclick = () => { S.clientId = null; render(); };
  v.querySelector("#nt").onclick = () => tripForm(null, c.id);
  v.querySelector("#np").onclick = () => payForm(c.id, d.trips.filter((t) => t.pending_cents > 0), d.totals.pending_cents);
  v.querySelector("#rem").onclick = guard(async () => { await api(`/admin/clients/${c.id}/reminder`, "POST", {}); toast("Recordatorio enviado"); });
  v.querySelector("#ed").onclick = () => clientEdit(c);
  v.querySelector("#pdf").onclick = () => printStatement(c.name, d.totals, d.trips, d.payments);
  v.querySelector("#csv").onclick = () => {
    const q = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const rows = [["Fecha", "Recogida", "Destino", "Importe", "Pagado", "Pendiente"], ...d.trips.map((t) => [t.trip_date, t.pickup, t.dropoff, t.amount_cents / 100, t.paid_cents / 100, t.pending_cents / 100])];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + rows.map((r) => r.map(q).join(";")).join("\n")], { type: "text/csv" }));
    a.download = `carreras-${c.name.replace(/\W+/g, "_")}.csv`; a.click();
  };
  bindTripActions(v, d.trips);
}

// ---------- Estado de cuenta imprimible (se guarda como PDF desde el móvil)
function printStatement(name, totals, trips, payments) {
  const w = window.open("", "_blank");
  if (!w) return toast("Permite las ventanas emergentes para descargarlo");
  const tr = trips.slice().sort((a, b) => a.trip_date.localeCompare(b.trip_date)).map((t) => `<tr><td>${fdate(t.trip_date)}</td><td>${esc(t.pickup)}</td><td>${esc(t.dropoff)}</td><td class="n">${eur(t.amount_cents)}</td><td class="n">${eur(t.pending_cents)}</td></tr>`).join("");
  const pr = payments.slice().sort((a, b) => a.pay_date.localeCompare(b.pay_date)).map((p) => `<tr><td>${fdate(p.pay_date)}</td><td>${esc(p.method)}</td><td>${esc(p.note || "")}</td><td class="n">${eur(p.amount_cents)}</td></tr>`).join("");
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Estado de cuenta · ${esc(name)}</title>
  <style>body{font:13px/1.4 system-ui,sans-serif;color:#0f172a;margin:24px}h1{font-size:20px;margin:0}h2{font-size:15px;margin:22px 0 6px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #e2e8f0;padding:6px 4px;text-align:left;vertical-align:top}th{font-size:11px;color:#64748b;text-transform:uppercase}.n{text-align:right;white-space:nowrap}.box{display:flex;gap:24px;margin-top:12px}.box b{display:block;font-size:18px}.bad{color:#dc2626}.mut{color:#64748b}@media print{button{display:none}}</style></head><body>
  <h1>Estado de cuenta</h1><div class="mut">${esc(name)} · ${new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}</div>
  <div class="box"><div><span class="mut">Total carreras</span><b>${eur(totals.charged_cents)}</b></div><div><span class="mut">Total pagado</span><b>${eur(totals.paid_cents)}</b></div><div><span class="mut">Saldo pendiente</span><b class="bad">${eur(totals.pending_cents)}</b></div></div>
  <h2>Carreras</h2><table><tr><th>Fecha</th><th>Recogida</th><th>Destino</th><th class="n">Importe</th><th class="n">Pendiente</th></tr>${tr || `<tr><td colspan="5" class="mut">Sin carreras</td></tr>`}</table>
  <h2>Pagos</h2><table><tr><th>Fecha</th><th>Método</th><th>Nota</th><th class="n">Importe</th></tr>${pr || `<tr><td colspan="4" class="mut">Sin pagos</td></tr>`}</table>
  <p><button onclick="print()" style="width:100%;padding:12px;margin-top:20px;font:inherit;font-weight:700">Imprimir o guardar PDF</button></p>
  </body></html>`);
  w.document.close();
}

// ---------- Formularios admin
async function tripForm(trip, clientId) {
  const [all, pl] = await Promise.all([api("/admin/clients"), api("/admin/places")]);
  const cl = all.items.filter((c) => c.active);
  if (!cl.length && !trip) return toast("Primero crea un cliente");
  modal(`<h2>${trip ? "Editar" : "Nueva"} carrera</h2><form id="f">
    ${trip ? "" : `<label>Cliente</label><select name="client_id" required>${cl.map((c) => `<option value="${c.id}" ${c.id === clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>`}
    <label>Fecha</label><input type="date" name="trip_date" value="${trip?.trip_date || today()}" required>
    <label>Lugar de recogida (donde lo buscaste)</label><input name="pickup" list="lugares" autocomplete="off" value="${esc(trip?.pickup)}" required>
    <label>Lugar de destino (a dónde fue)</label><input name="dropoff" list="lugares" autocomplete="off" value="${esc(trip?.dropoff)}" required>
    <datalist id="lugares">${pl.items.map((x) => `<option value="${esc(x)}">`).join("")}</datalist>
    <label>Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" inputmode="decimal" value="${trip ? trip.amount_cents / 100 : ""}" required>
    <label>Notas (opcional)</label><input name="notes" value="${esc(trip?.notes)}">
    ${trip ? "" : `<label><input type="checkbox" name="notify" checked style="width:auto;margin-right:8px">Avisar al cliente</label>`}
    <button style="width:100%;margin-top:8px">Guardar</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target);
      b.notify = !!b.notify;
      await api(trip ? "/admin/trips/" + trip.id : "/admin/trips", trip ? "PATCH" : "POST", b);
      m.remove(); toast("Guardado"); render();
    });
  });
}
function payForm(clientId, pending, total) {
  modal(`<h2>Registrar pago</h2><p class="mut">Pendiente: ${eur(total)}. Se aplica primero a las carreras más antiguas.</p><form id="f">
    <label>Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" max="${total / 100}" value="${total / 100}" inputmode="decimal" required>
    <label>Fecha del pago</label><input type="date" name="pay_date" value="${today()}" required>
    <label>Método</label><select name="method"><option>Efectivo</option><option>Bizum</option><option>Transferencia</option><option>Tarjeta</option><option>Otro</option></select>
    <label>Aplicar a</label><select name="trip_id"><option value="">Las más antiguas primero</option>${pending.map((t) => `<option value="${t.id}">${fdate(t.trip_date)} · ${esc(t.pickup)} → ${esc(t.dropoff)} (${eur(t.pending_cents)})</option>`).join("")}</select>
    <label>Nota (opcional)</label><input name="note">
    <label><input type="checkbox" name="notify" checked style="width:auto;margin-right:8px">Avisar al cliente</label>
    <button style="width:100%;margin-top:8px">Registrar</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target);
      b.client_id = clientId; b.notify = !!b.notify;
      await api("/admin/payments", "POST", b);
      m.remove(); toast("Pago registrado"); render();
    });
  });
}
function clientForm() {
  modal(`<h2>Nuevo cliente</h2><form id="f"><label>Nombre</label><input name="name" required>
    <label>Correo (será su usuario)</label><input name="email" type="email" required>
    <label>Teléfono con prefijo (ej. 34600111222)</label><input name="phone" inputmode="tel">
    <label>Contraseña inicial (mínimo 8)</label><input name="password" minlength="8" required>
    <label><input type="checkbox" name="notify_whatsapp" style="width:auto;margin-right:8px">Avisos por WhatsApp</label>
    <label><input type="checkbox" name="consent" style="width:auto;margin-right:8px">El cliente aceptó recibir avisos (RGPD)</label>
    <button style="width:100%;margin-top:8px">Crear cliente</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target);
      b.notify_whatsapp = !!b.notify_whatsapp; b.consent = !!b.consent;
      await api("/admin/clients", "POST", b);
      m.remove(); toast("Cliente creado"); render();
    });
  });
}
function clientEdit(c) {
  modal(`<h2>Editar cliente</h2><form id="f"><label>Nombre</label><input name="name" value="${esc(c.name)}" required>
    <label>Teléfono</label><input name="phone" value="${esc(c.phone)}">
    <label><input type="checkbox" name="notify_email" ${c.notify_email ? "checked" : ""} style="width:auto;margin-right:8px">Avisos por correo</label>
    <label><input type="checkbox" name="notify_whatsapp" ${c.notify_whatsapp ? "checked" : ""} style="width:auto;margin-right:8px">Avisos por WhatsApp</label>
    <label><input type="checkbox" name="active" ${c.active ? "checked" : ""} style="width:auto;margin-right:8px">Cuenta activa</label>
    <button style="width:100%;margin-top:8px">Guardar</button></form>
    <h2>Nueva contraseña</h2><form id="pw"><input name="password" minlength="8" placeholder="Mínimo 8 caracteres" required><button class="sec">Cambiar contraseña</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target);
      b.notify_email = !!b.notify_email; b.notify_whatsapp = !!b.notify_whatsapp; b.active = !!b.active;
      await api("/admin/clients/" + c.id, "PATCH", b);
      m.remove(); toast("Guardado"); render();
    });
    m.querySelector("#pw").onsubmit = guard(async (e) => {
      e.preventDefault();
      await api(`/admin/clients/${c.id}/password`, "POST", formData(e.target));
      m.remove(); toast("Contraseña cambiada");
    });
  });
}

render();
