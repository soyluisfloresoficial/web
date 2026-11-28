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
const avatar = (n, cls = "", id = null, v = 0) => {
  if (id && v > 0) return `<img class="av ${cls}" src="/api/avatar/${esc(id)}?v=${Number(v)}" alt="" loading="lazy">`;
  let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `<div class="av ${cls}" style="background:${AVC[h % AVC.length]}">${esc(initials(n))}</div>`;
};
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
  key: "M21 9a6 6 0 0 1-7.7 5.7L11 17H9v2H7v2H3v-3.6l6.3-6.3A6 6 0 1 1 21 9zM16 8h.01",
  copy: "M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
  crosshair: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM22 12h-4M6 12H2M12 6V2M12 22v-4",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  swap: "M7 4v16M7 4 3 8M7 4l4 4M17 20V4M17 20l-4-4M17 20l4-4",
  nav: "M3 11 22 2l-9 19-2-8z",
  repeat: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54z",
  sort: "M3 6h18M6 12h12M10 18h4",
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
function modal(html, onMount, onClose) {
  const m = document.createElement("div");
  m.className = "modal";
  m.innerHTML = `<div role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  m.close = () => { m.remove(); onClose && onClose(); };
  m.addEventListener("click", (e) => { if (e.target === m) m.close(); });
  document.body.appendChild(m);
  m.querySelector("input,select")?.focus({ preventScroll: true });
  onMount && onMount(m);
  return m;
}
const empty = (icon, title, text = "") => `<div class="empty"><div class="ic">${ic(icon)}</div><b>${title}</b>${text}</div>`;
const skeleton = () => `<div class="sk" style="height:170px;border-radius:24px"></div><div class="stats"><div class="sk" style="height:76px"></div><div class="sk" style="height:76px"></div></div><div class="sk" style="height:220px"></div>`;
// ---------- En vivo: consulta una firma ligera cada 15 s y refresca si algo cambió
const LIVE = { sig: null, at: null, timer: null, busy: false };
const hhmm = (d) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
function liveStamp() { const el = document.getElementById("livebar"); if (el && LIVE.at) el.textContent = "Actualizado a las " + hhmm(LIVE.at); }
async function liveCheck(force) {
  if (!S.me || LIVE.busy || document.hidden || document.querySelector(".modal")) return;
  LIVE.busy = true;
  try {
    const r = await api("/pulse");
    const changed = LIVE.sig !== null && r.sig !== LIVE.sig;
    LIVE.sig = r.sig; LIVE.at = new Date();
    const typing = S.tab === "pedir" || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "");
    if (changed && !force && typing) { LIVE.sig = null; LIVE.pendingSig = r.sig; }
    else if (changed && !force) { const y = scrollY; await render(true); scrollTo(0, y); toast("Hay novedades: datos actualizados"); }
    else if (r.unread !== S.unread) { S.unread = r.unread; }
    liveStamp();
  } catch { /* sin conexión: se reintenta en el siguiente ciclo */ } finally { LIVE.busy = false; }
}
function liveStart() {
  if (LIVE.timer) return;
  LIVE.timer = setInterval(() => liveCheck(), 15000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) liveCheck(); });
  window.addEventListener("focus", () => liveCheck());
}
const go = (tab, clientId = null) => { S.tab = tab; S.clientId = clientId; window.scrollTo(0, 0); render(); };

// ---------- Estructura
async function render(fromLive) {
  const inv = location.pathname.match(/^\/invitar\/([0-9a-f]{48})$/);
  if (inv) return inviteView(inv[1]);
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
    <div class="t"><b>${admin ? "Panel de carreras" : "Hola, " + esc(S.me.name.split(" ")[0])}</b><span><i class="live"></i>${admin ? "Administrador · en vivo" : "En vivo"}</span></div>
    ${admin ? `<button class="iconbtn" id="bell" aria-label="Avisos">${ic("bell")}${S.unread ? `<span class="dot">${S.unread}</span>` : ""}</button>` : ""}
    <button class="me-btn" id="menu" aria-label="Mi perfil">${avatar(S.me.name, "sm", S.me.id, S.me.avatar_v)}</button></header>
    <main id="view">${skeleton()}</main>
    <nav class="bn"><div class="in">${tabs.map(([k, i, l]) => k === "nuevo" || k === "pedir"
      ? `<a href="#" data-t="${k}" class="fab" aria-label="${k === "nuevo" ? "Añadir" : "Pedir carrera"}"><span class="c" data-l="${k === "nuevo" ? "Añadir" : "Pedir carrera"}">${ic(i)}</span><span class="fl">${k === "pedir" ? "Pedir" : ""}</span></a>`
      : `<a href="#" data-t="${k}" class="${S.tab === k ? "on" : ""}">${ic(i)}${l}${k === "avisos" && S.unread ? `<span class="dot" style="position:absolute;top:0;right:calc(50% - 20px);background:var(--bad);color:#fff;border-radius:9px;font-size:.62rem;padding:1px 5px">${S.unread}</span>` : ""}</a>`).join("")}</div></nav>`;
  $app.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); if (a.dataset.t === "nuevo") return quickAdd(); go(a.dataset.t); }));
  document.getElementById("menu").onclick = () => go("perfil");
  document.getElementById("bell")?.addEventListener("click", () => go("avisos"));
  const v = document.getElementById("view");
  try {
    const views = admin
      ? { inicio: adminInicio, clientes: adminClientes, carreras: adminCarreras, gastos: adminGastos, avisos: avisosView, perfil: perfilView }
      : { inicio: clienteInicio, carreras: clienteCarreras, pedir: clientePedir, pagos: clientePagos, avisos: avisosView, perfil: perfilView };
    if (admin && S.clientId) await clienteDetalle(v);
    else await (views[S.tab] || views.inicio)(v);
    liveStart();
    if (!fromLive) { LIVE.sig = null; await liveCheck(true); } else liveStamp();
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
    <p class="mut" style="text-align:center;margin-top:16px">¿Primera vez? Abre el enlace de invitación que te envió tu conductor.<br>¿Olvidaste la contraseña? Pídele un enlace nuevo.</p></div>`;
  document.getElementById("f").onsubmit = guard(async (e) => {
    e.preventDefault();
    const b = e.target.querySelector("button"); b.disabled = true;
    try { await api("/login", "POST", formData(e.target)); S.me = null; S.tab = "inicio"; render(); } finally { b.disabled = false; }
  });
}

async function inviteView(token) {
  document.body.classList.add("auth");
  let info;
  try { info = await api("/invite/" + token); }
  catch (e) {
    $app.innerHTML = `<div class="login"><div class="brand"><div class="logo">${ic("car")}</div><b style="font-size:1.1rem">Carreras</b></div>
      <div class="card">${empty("alert", "Enlace no válido", esc(e.message))}</div><button class="ghost block" id="gl">Ir a iniciar sesión</button></div>`;
    document.getElementById("gl").onclick = () => { history.replaceState(null, "", "/"); render(); };
    return;
  }
  $app.innerHTML = `<div class="login">
    <div class="brand"><div class="logo">${ic("car")}</div><div><b style="font-size:1.1rem">Carreras</b><div class="mut">Activa tu cuenta</div></div></div>
    <h1>Hola, ${esc(info.name.split(" ")[0])}</h1>
    <p class="mut" style="margin:0 0 6px">Elige una contraseña para tu cuenta. Después entrarás siempre con tu correo y esta contraseña.</p>
    <form id="f"><label class="f">Tu correo (usuario)</label><input value="${esc(info.email)}" disabled autocomplete="username">
    <label class="f">Contraseña nueva (mínimo 8 caracteres)</label><input name="password" type="password" minlength="8" autocomplete="new-password" required>
    <label class="f">Repite la contraseña</label><input name="password2" type="password" minlength="8" autocomplete="new-password" required>
    <label class="check"><input type="checkbox" name="consent" checked>Acepto recibir avisos de mis carreras y pagos</label>
    <button class="acc block" style="margin-top:16px">${ic("check")}Activar y entrar</button></form>
    <p class="mut" style="text-align:center;margin-top:16px">Solo verás tus propias carreras, pagos y avisos.</p></div>`;
  document.getElementById("f").onsubmit = guard(async (e) => {
    e.preventDefault();
    const b = formData(e.target);
    if (b.password !== b.password2) return toast("Las contraseñas no coinciden");
    await api("/invite/" + token, "POST", { password: b.password, consent: !!b.consent });
    history.replaceState(null, "", "/");
    S.me = null; S.tab = "inicio"; toast("Cuenta activada"); render();
  });
}

// ---------- Perfil (cliente y administrador)
function resizeImage(file, size = 320) {
  return new Promise((res, rej) => {
    if (!/^image\//.test(file.type)) return rej(new Error("Elige una imagen"));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s0 = Math.min(img.width, img.height), cv = document.createElement("canvas");
      cv.width = cv.height = size;
      cv.getContext("2d").drawImage(img, (img.width - s0) / 2, (img.height - s0) / 2, s0, s0, 0, 0, size, size);
      URL.revokeObjectURL(url); res(cv.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => rej(new Error("No pude leer la imagen"));
    img.src = url;
  });
}
async function perfilView(v) {
  const admin = S.me.role === "admin";
  const [{ profile: p }, st, biz] = await Promise.all([api("/profile"), admin ? api("/settings") : null, admin ? api("/driver") : null]);
  const b = biz?.business || {};
  v.innerHTML = `<div class="hero prof"><div class="hid">
      <label class="avedit" title="Cambiar foto">${avatar(p.name, "xl", p.id, p.avatar_v)}<span class="cam">${ic("camera")}</span><input type="file" id="foto" accept="image/*" hidden></label>
      <div style="flex:1;min-width:0"><b style="font-size:1.2rem;display:block">${esc(p.name)}</b><span style="opacity:.75;font-size:.85rem">${esc(p.email)}</span>
      <div style="margin-top:6px"><span class="chip ${admin ? "" : "ok"}" style="${admin ? "background:var(--acc);color:var(--acc-ink)" : ""}">${admin ? "Administrador" : "Cliente"}</span></div></div></div>
      <div class="acts"><button class="glass sm" id="fotob">${ic("camera")}${p.avatar_v ? "Cambiar foto" : "Subir foto"}</button>${p.avatar_v ? `<button class="glass sm" id="fotox">${ic("trash")}Quitar foto</button>` : ""}</div></div>

    <div class="sec"><h2>Datos personales</h2></div>
    <form class="card" id="datos"><label class="f">Nombre</label><input name="name" value="${esc(p.name)}" required>
      <label class="f">Correo (tu usuario)</label><input name="email" type="email" value="${esc(p.email)}" required>
      <div id="emailpw" hidden><label class="f">Contraseña actual (para cambiar el correo)</label><input name="current" type="password" autocomplete="current-password"></div>
      <label class="f">Teléfono con prefijo</label><input name="phone" value="${esc(p.phone || "")}" inputmode="tel" placeholder="34600111222">
      ${admin ? "" : `<label class="check"><input type="checkbox" name="notify_email" ${p.notify_email ? "checked" : ""}>Recibir avisos por correo</label>
      <label class="check"><input type="checkbox" name="notify_whatsapp" ${p.notify_whatsapp ? "checked" : ""}>Recibir avisos por WhatsApp</label>`}
      <button class="block" style="margin-top:14px">${ic("check")}Guardar datos</button></form>

    ${admin ? `<div class="sec"><h2>Mi negocio</h2><span class="mut">Lo ven tus clientes</span></div>
    <form class="card" id="biz"><label class="f">Nombre comercial</label><input name="biz_name" value="${esc(b.biz_name)}" placeholder="Ej.: Taxi Luis">
      <label class="f">Teléfono de contacto para clientes</label><input name="biz_phone" value="${esc(b.biz_phone)}" inputmode="tel" placeholder="34600111222">
      <div class="two"><div><label class="f">Vehículo</label><input name="vehicle" value="${esc(b.vehicle)}" placeholder="Ej.: Toyota Corolla gris"></div><div><label class="f">Matrícula</label><input name="plate" value="${esc(b.plate)}" placeholder="1234 ABC"></div></div>
      <label class="f">Bizum (número)</label><input name="bizum" value="${esc(b.bizum)}" inputmode="tel">
      <label class="f">IBAN para transferencias</label><input name="iban" value="${esc(b.iban)}" placeholder="ES00 0000 0000 0000 0000 0000">
      <label class="f">Nota de pago (opcional)</label><input name="pay_note" value="${esc(b.pay_note)}" placeholder="Ej.: indica tu nombre en el concepto">
      <button class="block" style="margin-top:14px">${ic("check")}Guardar negocio</button></form>

    <div class="sec"><h2>Tarifa orientativa</h2></div>
    <form class="card" id="tar"><p class="mut" style="margin:0">Sugiere el importe según los km. Tú decides el precio final.</p>
      <div class="two"><div><label class="f">Bajada de bandera (€)</label><input name="base_eur" type="number" step="0.01" min="0" inputmode="decimal" value="${st.base_eur ?? ""}"></div><div><label class="f">Precio por km (€)</label><input name="per_km_eur" type="number" step="0.01" min="0" inputmode="decimal" value="${st.per_km_eur ?? ""}"></div></div>
      <div class="two"><div><label class="f">Mínimo por carrera (€)</label><input name="min_eur" type="number" step="0.01" min="0" inputmode="decimal" value="${st.min_eur ?? ""}"></div><div><label class="f">Factor carretera</label><input name="road_factor" type="number" step="0.05" min="1" max="2" inputmode="decimal" value="${st.road_factor ?? 1.3}"></div></div>
      <label class="check"><input type="checkbox" name="show_estimate" ${st.show_estimate ? "checked" : ""}>Mostrar el precio orientativo al cliente al pedir</label>
      <button class="ghost block" style="margin-top:10px">${ic("check")}Guardar tarifa</button></form>` : ""}

    <div class="sec"><h2>Seguridad</h2></div>
    <form class="card" id="pw"><label class="f">Contraseña actual</label><input name="current" type="password" autocomplete="current-password" required>
      <label class="f">Nueva contraseña (mínimo 10 caracteres)</label><input name="next" type="password" minlength="10" autocomplete="new-password" required>
      <button class="ghost block" style="margin-top:14px">${ic("lock")}Cambiar contraseña</button></form>

    ${admin ? "" : `<div class="sec"><h2>Tus datos</h2></div>
    <div class="card"><p class="mut" style="margin:0 0 10px">Puedes descargar todo lo que guardo de ti o pedir que elimine tu cuenta.</p>
      <div class="two"><a class="btn ghost" href="/api/client/export" download>${ic("download")}Descargar mis datos</a><button class="danger" id="baja">${ic("trash")}Pedir la baja</button></div></div>`}
    <div class="mut" style="text-align:center;margin:16px 0 6px">Cuenta creada el ${fdate(String(p.created_at).slice(0, 10))}</div>
    <button class="danger block" id="out">${ic("logout")}Cerrar sesión</button>`;
  const foto = v.querySelector("#foto");
  v.querySelector("#fotob").onclick = () => foto.click();
  foto.onchange = guard(async () => {
    const f = foto.files[0]; if (!f) return;
    const r = await api("/profile/avatar", "PUT", { data: await resizeImage(f) });
    S.me.avatar_v = r.avatar_v; toast("Foto actualizada"); render();
  });
  v.querySelector("#fotox")?.addEventListener("click", guard(async () => { await api("/profile/avatar", "DELETE"); S.me.avatar_v = 0; toast("Foto quitada"); render(); }));
  const em = v.querySelector("#datos [name=email]");
  em.oninput = () => (v.querySelector("#emailpw").hidden = em.value.trim().toLowerCase() === p.email);
  v.querySelector("#datos").onsubmit = guard(async (e) => {
    e.preventDefault();
    const b = formData(e.target);
    if (!admin) { b.notify_email = !!b.notify_email; b.notify_whatsapp = !!b.notify_whatsapp; }
    await api("/profile", "PATCH", b);
    S.me.name = b.name; S.me.email = b.email.toLowerCase(); toast("Datos guardados"); render();
  });
  v.querySelector("#biz")?.addEventListener("submit", guard(async (e) => { e.preventDefault(); await api("/admin/business", "PUT", formData(e.target)); toast("Datos del negocio guardados"); }));
  v.querySelector("#tar")?.addEventListener("submit", guard(async (e) => { e.preventDefault(); const b = formData(e.target); b.show_estimate = !!b.show_estimate; S.settings = await api("/admin/settings", "PUT", b); toast("Tarifa guardada"); }));
  v.querySelector("#pw").onsubmit = guard(async (e) => { e.preventDefault(); await api("/password", "POST", formData(e.target)); e.target.reset(); toast("Contraseña actualizada"); });
  v.querySelector("#baja")?.addEventListener("click", guard(async () => {
    if (!confirm("¿Pedir que se elimine tu cuenta? Te contactaré para cerrarla. Si tienes saldo pendiente, habrá que saldarlo antes.")) return;
    await api("/client/delete-request", "POST", {}); toast("Solicitud enviada");
  }));
  v.querySelector("#out").onclick = guard(async () => { await api("/logout", "POST", {}); S.me = null; render(); });
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
    ${opts.admin ? `<div class="ft">${navButtons(t)}</div>` : ""}
    ${opts.repeat ? `<div class="ft"><button class="ghost sm" data-again="${t.id}">${ic("repeat")}Pedir de nuevo</button><button class="ghost sm" data-back="${t.id}">${ic("swap")}Pedir la vuelta</button></div>` : ""}
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
function driverCard(dr, opts = {}) {
  if (!dr || !dr.driver) return "";
  const d = dr.driver, b = dr.business, ph = String(d.phone || "").replace(/\D/g, "");
  const pay = b.bizum || b.iban;
  return `<div class="card drv">
    ${opts.payOnly ? "" : `<div class="row">${avatar(d.name, "lg", d.id, d.avatar_v)}<div class="grow"><span class="mut">Tu conductor</span><b style="display:block;font-size:1.05rem">${esc(b.biz_name || d.name)}</b>
      ${b.vehicle || b.plate ? `<span class="mut">${ic("car")} ${esc(b.vehicle)}${b.plate ? ` · <b class="plate">${esc(b.plate)}</b>` : ""}</span>` : ""}</div></div>
    ${ph ? `<div class="two" style="margin-top:12px"><a class="btn ghost" href="tel:+${ph}">${ic("phone")}Llamar</a><a class="btn ghost" href="https://wa.me/${ph}" target="_blank" rel="noopener">${ic("chat")}WhatsApp</a></div>` : ""}`}
    ${pay ? `<div class="paybox"><b>${ic("wallet")} Cómo pagarme</b>
      ${b.bizum ? `<div class="payrow"><span><small>Bizum</small>${esc(b.bizum)}</span><button type="button" class="ghost sm" data-copy="${esc(b.bizum)}">${ic("copy")}Copiar</button></div>` : ""}
      ${b.iban ? `<div class="payrow"><span><small>Transferencia (IBAN)</small>${esc(b.iban)}</span><button type="button" class="ghost sm" data-copy="${esc(b.iban.replace(/\s/g, ""))}">${ic("copy")}Copiar</button></div>` : ""}
      ${b.pay_note ? `<div class="mut" style="margin-top:6px">${esc(b.pay_note)}</div>` : ""}</div>` : ""}
  </div>`;
}
function bindCopy(v) {
  v.querySelectorAll("[data-copy]").forEach((b) => (b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.copy); toast("Copiado"); } catch { toast(b.dataset.copy); } }));
}
async function clienteInicio(v) {
  const [s, t, rq, dr] = await Promise.all([api("/client/summary"), api("/client/trips?status=pending"), api("/client/requests"), api("/driver").catch(() => null)]);
  const pendReq = rq.items.filter((r) => r.status === "pending");
  v.innerHTML = `<div class="hero"><div class="lbl">${ic("wallet")}Saldo pendiente</div><div class="big">${bigEur(s.pending_cents)}</div>
    <div class="sub">${s.pending_cents > 0 ? plural(t.items.length, "carrera por pagar", "carreras por pagar") : "Estás al día. Gracias."}</div>
    <div class="row"><div><span>Total carreras</span><b>${eur(s.charged_cents)}</b></div><div><span>Pagado</span><b>${eur(s.paid_cents)}</b></div><div><span>Pendiente</span><b>${eur(s.pending_cents)}</b></div></div>
    <div class="acts"><button class="acc sm" id="pedir">${ic("plus")}Pedir carrera</button><button class="glass sm" id="pdf">${ic("download")}Estado de cuenta</button></div></div>
    <div class="sec"><h2>Tu resumen</h2><span class="mut" id="livebar"></span></div>
    <div class="card">
      <div class="row" style="justify-content:space-between"><span class="mut">Pagado del total</span><b>${s.charged_cents ? Math.round((s.paid_cents / s.charged_cents) * 100) : 100}%</b></div>
      <div class="bar" style="height:10px"><b style="width:${s.charged_cents ? Math.round((s.paid_cents / s.charged_cents) * 100) : 100}%"></b></div>
      <div class="sum2">
        <div class="box bad"><span>${ic("clock")}Por pagar</span><b>${eur(s.pending_cents)}</b><small>${plural(s.trips_pending, "carrera", "carreras")}${s.trips_partial ? ` · ${s.trips_partial} con abono` : ""}</small></div>
        <div class="box ok"><span>${ic("check")}Pagadas</span><b>${eur(s.paid_trips_cents)}</b><small>${plural(s.trips_paid, "carrera", "carreras")}</small></div>
      </div>
      <div class="facts">
        <div><span>Carrera más antigua sin pagar</span><b>${s.oldest_unpaid ? fdate(s.oldest_unpaid) : "Ninguna"}</b></div>
        <div><span>Último pago</span><b>${s.last_payment ? `${eur(s.last_payment.amount_cents)} · ${fdate(s.last_payment.pay_date)}` : "Aún no hay"}</b></div>
        <div><span>Carreras este mes</span><b>${s.month_trips}</b></div>
        <div><span>Carreras en total</span><b>${s.trips_total}</b></div>
      </div></div>
    ${dr && dr.driver ? `<div class="sec"><h2>Tu conductor</h2></div>${driverCard(dr)}` : ""}
    ${pendReq.length ? `<div class="sec"><h2>Solicitudes en espera</h2></div><div class="card flush">${pendReq.map((r) => `<div class="li" style="cursor:default"><div class="av" style="background:var(--warn-bg);color:var(--warn)">${ic("clock")}</div><div class="grow"><div class="name">${esc(r.pickup)} → ${esc(r.dropoff)}</div><div class="mut">${fdateS(r.req_date)}${r.req_time ? " · " + esc(r.req_time) : ""}</div></div>${reqChip(r.status)}</div>`).join("")}</div>` : ""}
    <div class="sec"><h2>Por pagar</h2>${t.items.length ? `<a id="all">Ver todas</a>` : ""}</div>
    <div class="card">${t.items.map((x) => tripCard(x, { repeat: true })).join("") || empty("check", "Nada pendiente", "Todas tus carreras están pagadas.")}</div>`;
  bindRepeat(v, t.items); bindCopy(v);
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
  c.innerHTML = t.items.map((x) => tripCard(x, { repeat: true })).join("") || empty("car", "Sin carreras", "Aquí verás cada viaje con su recogida, destino e importe.");
  v.appendChild(c);
  bindRepeat(v, t.items);
}
function bindRepeat(v, trips) {
  const pick = (t, back) => back
    ? { pickup: t.dropoff, pickup_lat: t.dropoff_lat, pickup_lng: t.dropoff_lng, dropoff: t.pickup, dropoff_lat: t.pickup_lat, dropoff_lng: t.pickup_lng }
    : { pickup: t.pickup, pickup_lat: t.pickup_lat, pickup_lng: t.pickup_lng, dropoff: t.dropoff, dropoff_lat: t.dropoff_lat, dropoff_lng: t.dropoff_lng };
  v.querySelectorAll("[data-again],[data-back]").forEach((b) => (b.onclick = () => {
    const t = trips.find((x) => x.id === (b.dataset.again || b.dataset.back));
    S.prefill = pick(t, !!b.dataset.back); go("pedir");
  }));
}
async function clientePedir(v) {
  const r = await api("/client/requests");
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Pedir una carrera</h2></div>
    <form class="card" id="f"><div class="two"><div><label class="f">Fecha</label><input type="date" name="req_date" min="${today()}" value="${today()}" required></div>
    <div><label class="f">Hora</label><input type="time" name="req_time"></div></div>
    ${routeFields(S.prefill || {})}
    <div class="mut" id="geonote" style="margin-top:6px" hidden></div>
    <label class="f">Nota (opcional)</label><input name="note" placeholder="Ej.: llevo maleta, somos 3">
    <button class="acc block" style="margin-top:16px">${ic("send")}Enviar solicitud</button>
    <p class="mut" style="margin:10px 0 0">Te aviso cuando la confirme, con el importe.</p></form>
    <div class="sec"><h2>Mis solicitudes</h2></div>
    <div class="card flush">${r.items.map((x) => `<div class="li" style="cursor:default"><div class="grow"><div class="name">${esc(x.pickup)} → ${esc(x.dropoff)}</div>
      <div class="mut">${fdateS(x.req_date)}${x.req_time ? " · " + esc(x.req_time) : ""}${x.answer_note ? " · " + esc(x.answer_note) : ""}</div></div>
      <div style="text-align:right">${reqChip(x.status)}${x.status === "pending" ? `<div><button class="danger sm" style="margin-top:6px" data-cancel="${x.id}">Cancelar</button></div>` : ""}</div></div>`).join("") || empty("inbox", "Sin solicitudes", "Cuando pidas una carrera aparecerá aquí.")}</div>`;
  const pre = S.prefill; S.prefill = null;
  const rt = await bindRoute(v.querySelector("#f"));
  if (!pre || !pre.pickup) {
    getPos().then(async (pos) => {
      if (!pos || rt.get("pickup").address) return;
      try {
        rt.set("pickup", (await api(`/geo/reverse?lat=${pos.lat}&lng=${pos.lng}`)).item);
        const n = v.querySelector("#geonote"); n.hidden = false; n.innerHTML = `${ic("crosshair")} Puse tu ubicación actual como recogida. Cámbiala si quieres.`;
      } catch { /* sin dirección */ }
    });
  }
  v.querySelector("#f").onsubmit = guard(async (e) => {
    e.preventDefault();
    await api("/client/requests", "POST", formData(e.target));
    toast("Solicitud enviada"); render();
  });
  v.querySelectorAll("[data-cancel]").forEach((b) => (b.onclick = guard(async () => { await api(`/client/requests/${b.dataset.cancel}/cancel`, "POST", {}); toast("Solicitud cancelada"); render(); })));
}
async function clientePagos(v) {
  const [p, s, dr] = await Promise.all([api("/client/payments"), api("/client/summary"), api("/driver").catch(() => null)]);
  v.innerHTML = `<div class="stats" style="margin-top:8px"><div class="stat"><div class="k">${ic("check")}Total pagado</div><div class="v ok">${eur(s.paid_cents)}</div></div>
    <div class="stat"><div class="k">${ic("wallet")}Pendiente</div><div class="v ${s.pending_cents > 0 ? "bad" : "ok"}">${eur(s.pending_cents)}</div></div></div>
    ${s.pending_cents > 0 && dr && (dr.business.bizum || dr.business.iban) ? driverCard(dr, { payOnly: true }) : ""}
    <div class="sec"><h2>Historial de pagos</h2></div>
    <div class="card flush">${p.items.map((x) => payItem(x, false)).join("") || empty("wallet", "Aún no hay pagos", "Cada pago que registre aparecerá aquí con su fecha.")}</div>`;
  bindCopy(v);
}
async function avisosView(v) {
  const r = await api("/notifications");
  const nIcon = (t) => /pago/i.test(t) ? "check" : /solicitud|confirmada|disponible/i.test(t) ? "inbox" : /recordatorio/i.test(t) ? "clock" : "car";
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Avisos</h2></div><div class="card flush">${r.items.map((n) => `<div class="nt ${n.read ? "" : "new"}"><div class="ic">${ic(nIcon(n.title))}</div><div><b>${esc(n.title)}</b><div style="font-size:.9rem">${esc(n.body)}</div><div class="mut">${fdt(n.created_at)}</div></div></div>`).join("") || empty("bell", "Sin avisos", "Aquí llegan las carreras nuevas, los pagos y los recordatorios.")}</div>`;
  if (S.unread) { await api("/notifications/read", "POST", {}); S.unread = 0; document.querySelectorAll(".dot").forEach((d) => d.remove()); }
}

// ---------- Admin
async function adminInicio(v) {
  const [s, rq, up] = await Promise.all([api("/admin/summary"), api("/admin/requests"), api("/admin/upcoming")]);
  const net = s.month_collected_cents - s.month_expenses_cents;
  v.innerHTML = `<div class="hero"><div class="lbl">${ic("wallet")}Total por cobrar</div><div class="big">${bigEur(s.pending_cents)}</div>
    <div class="sub">${s.top_debtors.length ? plural(s.top_debtors.length, "cliente te debe", "clientes te deben") + " dinero" : "Nadie te debe nada"}</div>
    <div class="row"><div><span>Carreras</span><b>${s.month_trips}</b></div><div><span>Cargado</span><b>${eur(s.month_charged_cents)}</b></div><div><span>Cobrado</span><b>${eur(s.month_collected_cents)}</b></div></div></div>
    <div class="stats"><div class="stat"><div class="k">${ic("fuel")}Gastos del mes</div><div class="v warn">${eur(s.month_expenses_cents)}</div></div>
    <div class="stat"><div class="k">${ic("chart")}Neto del mes</div><div class="v ${net >= 0 ? "ok" : "bad"}">${eur(net)}</div></div></div>
    ${rq.items.length ? `<div class="sec"><h2>Solicitudes nuevas <span class="chip warn">${rq.items.length}</span></h2></div>${rq.items.map((r) => `<div class="card req">
      <div class="row">${avatar(r.client_name, "", r.client_id, r.client_avatar_v)}<div class="grow"><b>${esc(r.client_name)}</b><div class="mut">${fdateS(r.req_date)}${r.req_time ? " · " + esc(r.req_time) : ""}</div></div>${reqChip(r.status)}</div>
      <div class="route" style="margin-top:10px"><div class="rail"><i></i><s></s><u></u></div><div class="pl"><small>Recogida</small>${esc(r.pickup)}</div><div></div><div class="pl"><small>Destino</small>${esc(r.dropoff)}</div></div>
      ${r.note ? `<div class="mut" style="margin-top:8px">“${esc(r.note)}”</div>` : ""}
      <div class="minimap" data-map="${r.id}"></div>
      <div class="ft" style="margin-top:10px">${navButtons(r)}</div>
      <div class="acts"><button class="danger" data-rej="${r.id}">${ic("x")}Rechazar</button><button class="ok" data-acc="${r.id}">${ic("check")}Aceptar</button></div></div>`).join("")}` : ""}
    ${up.items.length ? `<div class="sec"><h2>Próximas carreras</h2><span class="mut">Hoy y siguientes</span></div><div class="card">${up.items.map((x) => tripCard(x, { admin: true, client: x.client_name, compact: true })).join("")}</div>` : ""}
    <div class="sec"><h2>Últimos 6 meses</h2></div><div class="card">${barChart(s.series)}</div>
    <div class="sec"><h2>Mayores deudas</h2><a id="vc">Ver clientes</a></div>
    <div class="card flush">${s.top_debtors.map((d) => `<div class="li" data-c="${d.id}">${avatar(d.name, "", d.id, d.avatar_v)}<div class="grow"><div class="name">${esc(d.name)}</div>${d.oldest_unpaid ? `<div class="mut">Sin pagar desde ${fdate(d.oldest_unpaid)}</div>` : ""}</div><span class="amt bad">${eur(d.pending_cents)}</span><span class="chev">${ic("chev")}</span></div>`).join("") || empty("check", "Todo cobrado", "Nadie tiene saldo pendiente.")}</div>
    <div class="sec"><h2>Informe mensual</h2></div><input type="month" id="mes" value="${S.month || today().slice(0, 7)}"><div id="inf"></div>`;
  v.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => go("clientes", el.dataset.c)));
  v.querySelector("#vc").onclick = () => go("clientes");
  v.querySelectorAll("[data-acc]").forEach((b) => (b.onclick = () => acceptRequest(rq.items.find((r) => r.id === b.dataset.acc))));
  v.querySelectorAll("[data-rej]").forEach((b) => (b.onclick = () => rejectRequest(b.dataset.rej)));
  v.querySelectorAll(".minimap[data-map]").forEach((el) => routeMap(el, rq.items.find((r) => r.id === el.dataset.map)));
  bindTripActions(v, up.items);
  const load = guard(async () => {
    S.month = v.querySelector("#mes").value;
    const r = await api("/admin/report?month=" + S.month);
    v.querySelector("#inf").innerHTML = `<div class="card"><div class="stats" style="grid-template-columns:repeat(3,1fr)">
      <div><div class="mut">Carreras</div><b>${r.totals.trips}</b></div><div><div class="mut">Cargado</div><b>${eur(r.totals.charged_cents)}</b></div><div><div class="mut">Cobrado</div><b class="ok">${eur(r.totals.collected_cents)}</b></div></div>
      ${r.rows.map((x) => `<div class="li" data-c="${x.id}">${avatar(x.name, "", x.id, x.avatar_v)}<div class="grow"><div class="name">${esc(x.name)}</div><div class="mut">${plural(x.trips, "carrera", "carreras")} · cobrado ${eur(x.collected_cents)}</div></div><div style="text-align:right"><div class="mut">Debe hoy</div><span class="amt ${x.pending_cents > 0 ? "bad" : "ok"}">${eur(x.pending_cents)}</span></div></div>`).join("") || empty("calendar", "Sin movimientos ese mes")}</div>`;
    v.querySelectorAll("#inf [data-c]").forEach((el) => (el.onclick = () => go("clientes", el.dataset.c)));
  });
  v.querySelector("#mes").onchange = load;
  load();
}
async function acceptRequest(r) {
  const st = await settings();
  const km = hasC(r.pickup_lat, r.pickup_lng) && hasC(r.dropoff_lat, r.dropoff_lng) ? kmBetween({ lat: r.pickup_lat, lng: r.pickup_lng }, { lat: r.dropoff_lat, lng: r.dropoff_lng }) * (st.road_factor || 1.3) : null;
  const sug = km !== null ? estimate(st, km) : null;
  modal(`<h2>Aceptar carrera</h2><p class="mut">${esc(r.client_name)} · ${fdateS(r.req_date)}${r.req_time ? " · " + esc(r.req_time) : ""}<br>${esc(r.pickup)} → ${esc(r.dropoff)}</p>
    ${km !== null ? `<div class="dist">${ic("map")}<span>≈ <b>${km.toFixed(1).replace(".", ",")} km</b> por carretera (estimado)${sug !== null ? ` · Tarifa sugerida <b>${eur(sug * 100)}</b>` : ` · Configura tu tarifa en «Mi cuenta» para ver un precio sugerido`}</span></div>` : ""}
    <form id="f"><label class="f">Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" inputmode="decimal" value="${sug ?? ""}" required>
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
let cFilter = "all", cSort = "debt";
async function adminClientes(v) {
  const r = await api("/admin/clients");
  const debt = r.items.reduce((a, c) => a + Math.max(0, c.pending_cents), 0);
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Clientes</h2><span class="mut">${plural(r.items.length, "cliente", "clientes")} · ${eur(debt)} por cobrar</span></div>
    <div class="search">${ic("search")}<input type="search" id="q" placeholder="Buscar por nombre, correo o teléfono"></div>
    <div class="filters"><div class="seg" id="cf" style="margin:10px 0 0;flex:1">${[["all", "Todos"], ["debt", "Con deuda"], ["inactive", "Sin activar"]].map(([k, l]) => `<button class="${cFilter === k ? "on" : ""}" data-f="${k}">${l}</button>`).join("")}</div>
      <select id="cs" aria-label="Ordenar" style="width:auto;margin-top:10px">${[["debt", "Mayor deuda"], ["name", "Nombre A-Z"], ["new", "Más recientes"]].map(([k, l]) => `<option value="${k}" ${cSort === k ? "selected" : ""}>${l}</option>`).join("")}</select></div>
    <div class="card flush">${r.items.filter((c) => cFilter === "all" || (cFilter === "debt" ? c.pending_cents > 0 : c.active && !c.pass_set)).sort((a, b) => cSort === "name" ? a.name.localeCompare(b.name, "es") : cSort === "new" ? String(b.created_at).localeCompare(String(a.created_at)) : b.pending_cents - a.pending_cents).map((c) => `<div class="li" data-q="${esc((c.name + " " + c.email + " " + (c.phone || "")).toLowerCase())}" data-c="${c.id}">${avatar(c.name, "", c.id, c.avatar_v)}
      <div class="grow"><div class="name">${esc(c.name)}${c.active ? "" : ` <span class="chip n">Inactivo</span>`}${c.active && !c.pass_set ? ` <span class="chip info">Sin activar</span>` : ""}</div><div class="mut">${esc(c.phone || c.email)}</div></div>
      <div style="text-align:right"><span class="amt ${c.pending_cents > 0 ? "bad" : "ok"}">${eur(c.pending_cents)}</span><div class="mut" style="font-size:.74rem">${c.pending_cents > 0 ? "pendiente" : "al día"}</div></div><span class="chev">${ic("chev")}</span></div>`).join("") || empty("users", "Aún no tienes clientes", "Crea el primero con el botón de abajo.")}</div>
    <button class="acc block" id="nc" style="margin-top:6px">${ic("plus")}Nuevo cliente</button>`;
  v.querySelectorAll("[data-c]").forEach((el) => (el.onclick = () => go("clientes", el.dataset.c)));
  v.querySelector("#nc").onclick = clientForm;
  v.querySelectorAll("#cf [data-f]").forEach((b) => (b.onclick = () => { cFilter = b.dataset.f; render(); }));
  v.querySelector("#cs").onchange = (e) => { cSort = e.target.value; render(); };
  v.querySelector("#q").oninput = (e) => { const q = e.target.value.trim().toLowerCase(); v.querySelectorAll("[data-q]").forEach((el) => (el.style.display = el.dataset.q.includes(q) ? "" : "none")); };
}
let aStatus = "pending";
const TF = { q: "", client: "", month: "" };
async function adminCarreras(v) {
  const [t, cl] = await Promise.all([api("/admin/trips?status=" + aStatus), api("/admin/clients")]);
  const names = Object.fromEntries(cl.items.map((c) => [c.id, c.name]));
  v.innerHTML = `<div class="sec" style="margin-top:8px"><h2>Carreras</h2><span class="mut" id="tsum"></span></div>`;
  v.appendChild(seg(STATUS_OPTS, aStatus, (s) => { aStatus = s; render(); }));
  const f = document.createElement("div"); f.className = "filters";
  f.innerHTML = `<div class="search" style="flex:1 1 100%">${ic("search")}<input type="search" id="tq" placeholder="Buscar lugar o nota" value="${esc(TF.q)}"></div>
    <select id="tc" aria-label="Cliente"><option value="">Todos los clientes</option>${cl.items.map((c) => `<option value="${c.id}" ${TF.client === c.id ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>
    <input type="month" id="tm" value="${esc(TF.month)}" aria-label="Mes">`;
  v.appendChild(f);
  const c = document.createElement("div"); c.className = "card"; v.appendChild(c);
  const draw = () => {
    const q = TF.q.trim().toLowerCase();
    const items = t.items.filter((x) => (!TF.client || x.client_id === TF.client) && (!TF.month || x.trip_date.startsWith(TF.month)) && (!q || `${x.pickup} ${x.dropoff} ${x.notes || ""} ${names[x.client_id] || ""}`.toLowerCase().includes(q)));
    const sum = items.reduce((a, x) => a + (aStatus === "pending" ? x.pending_cents : x.amount_cents), 0);
    v.querySelector("#tsum").textContent = `${plural(items.length, "carrera", "carreras")} · ${eur(sum)}`;
    c.innerHTML = items.map((x) => tripCard(x, { admin: true, client: names[x.client_id] })).join("") || empty("car", "Sin carreras con estos filtros");
    bindTripActions(v, items);
  };
  f.querySelector("#tq").oninput = (e) => { TF.q = e.target.value; draw(); };
  f.querySelector("#tc").onchange = (e) => { TF.client = e.target.value; draw(); };
  f.querySelector("#tm").onchange = (e) => { TF.month = e.target.value; draw(); };
  draw();
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
    <div class="hero"><div class="hid">${avatar(c.name, "lg", c.id, c.avatar_v)}<div style="flex:1;min-width:0"><b style="font-size:1.15rem;display:block">${esc(c.name)}</b><span style="opacity:.75;font-size:.82rem">${esc(c.phone || c.email)}</span></div>${c.active ? (c.pass_set ? "" : `<span class="chip info">Sin activar</span>`) : `<span class="chip n">Inactivo</span>`}<button class="glass sm" id="ed" aria-label="Editar cliente">${ic("edit")}</button></div>
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
      <button class="tile" id="acc"><span class="ic">${ic("key")}</span>Acceso</button></div>
    ${c.admin_note ? `<div class="card note">${ic("file")}<div><b>Notas internas</b><div>${esc(c.admin_note).replace(/\n/g, "<br>")}</div></div></div>` : ""}
    <div class="mut" style="margin:4px 2px 0">Cliente desde ${fdate(String(c.created_at).slice(0, 10))}${c.consent_at ? " · aceptó avisos" : ""}</div>
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
  v.querySelector("#acc").onclick = guard(async () => {
    if (!c.active) return toast("Activa la cuenta del cliente primero");
    if (c.pass_set && !confirm(`${c.name} ya tiene contraseña. ¿Generar un enlace nuevo para que elija otra? La actual seguirá valiendo hasta que la cambie.`)) return;
    shareAccess(c, await api(`/admin/clients/${c.id}/invite`, "POST", {}));
  });
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

// ---------- Direcciones, ubicación y mapa (OpenStreetMap)
const GEO = { pos: null };
const DEFAULT_CENTER = { lat: 41.7286, lng: 1.8236 };
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
function getPos() {
  if (GEO.pos) return Promise.resolve(GEO.pos);
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise((res) => navigator.geolocation.getCurrentPosition(
    (p) => { GEO.pos = { lat: p.coords.latitude, lng: p.coords.longitude }; res(GEO.pos); },
    () => res(null), { enableHighAccuracy: true, timeout: 9000, maximumAge: 120000 }));
}
let leafletP;
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  leafletP = leafletP || new Promise((res, rej) => {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "/vendor/leaflet.css"; document.head.appendChild(l);
    const sc = document.createElement("script"); sc.src = "/vendor/leaflet.js"; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc);
  });
  return leafletP;
}
const tiles = (map) => L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
const pinIcon = (k) => L.divIcon({ className: "", html: `<div class="mk ${k}"></div>`, iconSize: [22, 22], iconAnchor: [11, 11] });
const hasC = (lat, lng) => lat !== null && lat !== undefined && lat !== "" && lng !== null && lng !== undefined && lng !== "";
function kmBetween(a, b) {
  const R = 6371, r = (x) => (x * Math.PI) / 180, dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
async function settings() { if (!S.settings) S.settings = await api("/settings").catch(() => ({ show_estimate: false, road_factor: 1.3 })); return S.settings; }
function estimate(st, km) {
  if (!st || !(st.per_km_eur > 0 || st.base_eur > 0)) return null;
  const v = Math.max(st.min_eur || 0, (st.base_eur || 0) + km * (st.per_km_eur || 0));
  return Math.round(v * 2) / 2;
}
const ptText = (lat, lng, text) => (hasC(lat, lng) ? `${lat},${lng}` : text);
const gmapsUrl = (o) => `https://www.google.com/maps/dir/?api=1${o.from ? "&origin=" + encodeURIComponent(o.from) : ""}&destination=${encodeURIComponent(o.to)}&travelmode=driving`;
const wazeUrl = (lat, lng, text) => (hasC(lat, lng) ? `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` : `https://waze.com/ul?q=${encodeURIComponent(text)}&navigate=yes`);
function navButtons(x) {
  const from = ptText(x.pickup_lat, x.pickup_lng, x.pickup), to = ptText(x.dropoff_lat, x.dropoff_lng, x.dropoff);
  return `<a class="btn ghost sm" target="_blank" rel="noopener" href="${wazeUrl(x.pickup_lat, x.pickup_lng, x.pickup)}">${ic("nav")}Ir a recogida</a>
    <a class="btn ghost sm" target="_blank" rel="noopener" href="${gmapsUrl({ from, to })}">${ic("map")}Ver ruta</a>`;
}

function addrField(prefix, label, v = {}, placeholder = "") {
  return `<div class="addr" data-p="${prefix}"><label class="f">${label}</label>
    <div class="addr-in"><span class="mk ${prefix === "pickup" ? "a" : "b"}"></span><input name="${prefix}" value="${esc(v[prefix] || "")}" autocomplete="off" placeholder="${esc(placeholder)}" required>
    <button type="button" class="addr-x" aria-label="Borrar">${ic("x")}</button></div>
    <input type="hidden" name="${prefix}_lat" value="${hasC(v[prefix + "_lat"], v[prefix + "_lng"]) ? v[prefix + "_lat"] : ""}"><input type="hidden" name="${prefix}_lng" value="${hasC(v[prefix + "_lat"], v[prefix + "_lng"]) ? v[prefix + "_lng"] : ""}">
    <div class="sug" hidden></div>
    <div class="addr-acts"><button type="button" class="ghost sm" data-loc>${ic("crosshair")}Mi ubicación</button><button type="button" class="ghost sm" data-map>${ic("map")}Mapa</button><button type="button" class="ghost sm" data-fav aria-label="Guardar lugar">${ic("star")}Guardar</button></div></div>`;
}
const routeFields = (v = {}, labels = ["¿Dónde te busco?", "¿A dónde vas?"]) => `<div class="chips" id="chips"></div>
  ${addrField("pickup", labels[0], v, "Calle, número o lugar")}
  <div class="swapw"><button type="button" class="iconbtn" id="swap" aria-label="Intercambiar recogida y destino">${ic("swap")}</button></div>
  ${addrField("dropoff", labels[1], v, "Calle, número o lugar")}
  <div class="dist" id="dist" hidden></div>`;
async function bindRoute(root, { admin = false, onEstimate } = {}) {
  const st = await settings();
  const F = (p) => root.querySelector(`.addr[data-p="${p}"]`);
  const get = (p) => { const w = F(p); return { address: w.querySelector(`[name=${p}]`).value.trim(), lat: w.querySelector(`[name=${p}_lat]`).value, lng: w.querySelector(`[name=${p}_lng]`).value }; };
  const set = (p, it) => {
    const w = F(p);
    w.querySelector(`[name=${p}]`).value = it.address || "";
    w.querySelector(`[name=${p}_lat]`).value = hasC(it.lat, it.lng) ? it.lat : "";
    w.querySelector(`[name=${p}_lng]`).value = hasC(it.lat, it.lng) ? it.lng : "";
    w.querySelector(".sug").hidden = true;
    update();
  };
  let active = "pickup";
  function update() {
    const a = get("pickup"), b = get("dropoff"), el = root.querySelector("#dist");
    if (hasC(a.lat, a.lng) && hasC(b.lat, b.lng)) {
      const km = kmBetween({ lat: +a.lat, lng: +a.lng }, { lat: +b.lat, lng: +b.lng }) * (st.road_factor || 1.3);
      const price = (admin || st.show_estimate) ? estimate(st, km) : null;
      el.hidden = false;
      el.innerHTML = `${ic("map")}<span>≈ <b>${km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)} km</b> por carretera (estimado)${price !== null ? ` · Precio orientativo <b>${eur(price * 100)}</b>` : ""}</span>`;
      onEstimate && onEstimate(km, price);
    } else { el.hidden = true; onEstimate && onEstimate(null, null); }
  }
  async function drawChips() {
    const pl = await api("/places").catch(() => ({ saved: [], recent: [] }));
    const saved = pl.saved.map((x) => ({ ...x, fav: true }));
    const rec = pl.recent.filter((r) => !saved.some((s) => s.address === r.address)).slice(0, 5);
    const all = [...saved, ...rec];
    const box = root.querySelector("#chips");
    box.innerHTML = all.map((x, i) => `<button type="button" class="pchip ${x.fav ? "fav" : ""}" data-i="${i}" title="${esc(x.address)}">${ic(x.fav ? "star" : "clock")}<span>${esc(x.fav ? x.label : x.address.split(",")[0])}</span>${x.fav ? `<i data-del="${x.id}" aria-label="Quitar">×</i>` : ""}</button>`).join("");
    box.hidden = !all.length;
    box.querySelectorAll(".pchip").forEach((b) => (b.onclick = guard(async (e) => {
      const del = e.target.closest("[data-del]");
      if (del) { e.stopPropagation(); if (confirm("¿Quitar este lugar guardado?")) { await api("/places/" + del.dataset.del, "DELETE"); drawChips(); } return; }
      const x = all[b.dataset.i];
      const target = active === "pickup" && get("pickup").address && !get("dropoff").address ? "dropoff" : active;
      set(target, x);
      if (target === "pickup" && !get("dropoff").address) active = "dropoff";
    })));
  }
  root.querySelectorAll(".addr").forEach((w) => {
    const p = w.dataset.p, inp = w.querySelector(`[name=${p}]`), sug = w.querySelector(".sug");
    let items = [];
    const search = debounce(async () => {
      const q = inp.value.trim();
      if (q.length < 3) { sug.hidden = true; return; }
      const pos = GEO.pos || DEFAULT_CENTER;
      try {
        const r = await api(`/geo/search?q=${encodeURIComponent(q)}&lat=${pos.lat}&lng=${pos.lng}`);
        items = r.items;
        sug.innerHTML = items.map((x, i) => `<button type="button" data-i="${i}">${ic("crosshair")}<span><b>${esc(x.label)}</b><small>${esc(x.sub)}</small></span></button>`).join("") || `<div class="mut" style="padding:10px 12px">Sin resultados. Prueba con el mapa.</div>`;
        sug.hidden = false;
        sug.querySelectorAll("[data-i]").forEach((b) => b.addEventListener("mousedown", (e) => { e.preventDefault(); set(p, items[b.dataset.i]); }));
      } catch (e) { sug.hidden = true; }
    }, 350);
    inp.addEventListener("focus", () => { active = p; });
    inp.addEventListener("input", () => { w.querySelector(`[name=${p}_lat]`).value = ""; w.querySelector(`[name=${p}_lng]`).value = ""; update(); search(); });
    inp.addEventListener("blur", () => setTimeout(() => (sug.hidden = true), 150));
    w.querySelector(".addr-x").onclick = () => { set(p, {}); inp.focus(); };
    w.querySelector("[data-loc]").onclick = guard(async (e) => {
      const b = e.currentTarget; b.disabled = true;
      try {
        const pos = await getPos();
        if (!pos) return toast("Activa la ubicación del navegador para usar esta opción");
        set(p, (await api(`/geo/reverse?lat=${pos.lat}&lng=${pos.lng}`)).item);
      } finally { b.disabled = false; }
    });
    w.querySelector("[data-map]").onclick = guard(async () => {
      const cur = get(p);
      const start = hasC(cur.lat, cur.lng) ? { lat: +cur.lat, lng: +cur.lng } : GEO.pos || (await getPos()) || DEFAULT_CENTER;
      const it = await mapPicker(start, p === "pickup" ? "Punto de recogida" : "Punto de destino", p === "pickup" ? "a" : "b");
      if (it) set(p, it);
    });
    w.querySelector("[data-fav]").onclick = guard(async () => {
      const cur = get(p);
      if (!cur.address) return toast("Primero escribe o elige una dirección");
      const label = (prompt("Nombre para este lugar (ej.: Casa, Trabajo, Gimnasio)") || "").trim();
      if (!label) return;
      await api("/places", "POST", { label, address: cur.address, lat: cur.lat, lng: cur.lng });
      toast("Lugar guardado"); drawChips();
    });
  });
  root.querySelector("#swap").onclick = () => { const a = get("pickup"), b = get("dropoff"); set("pickup", b); set("dropoff", a); };
  drawChips(); update();
  return { get, set, update };
}
async function mapPicker(start, title, kind) {
  await loadLeaflet();
  return new Promise((resolve) => {
    let cur = null, done = false;
    const m = modal(`<h2>${title}</h2><p class="mut" style="margin:2px 0 10px">Mueve el mapa hasta dejar el pin en el punto exacto.</p>
      <div class="mapwrap"><div id="pmap"></div><div class="pin ${kind}"></div><button type="button" class="iconbtn locbtn" id="me" aria-label="Mi ubicación">${ic("crosshair")}</button></div>
      <div class="mapaddr" id="ma"><span class="mut">Buscando dirección…</span></div>
      <button class="acc block" id="ok" style="margin-top:12px">${ic("check")}Usar esta ubicación</button>`, null, () => { if (!done) resolve(null); });
    const map = L.map(m.querySelector("#pmap"), { zoomControl: false }).setView([start.lat, start.lng], 17);
    tiles(map);
    const ma = m.querySelector("#ma");
    const upd = debounce(async () => {
      const c = map.getCenter();
      ma.innerHTML = `<span class="mut">Buscando dirección…</span>`;
      try { cur = (await api(`/geo/reverse?lat=${c.lat}&lng=${c.lng}`)).item; ma.innerHTML = `<b>${esc(cur.label)}</b><span class="mut">${esc(cur.sub)}</span>`; }
      catch { cur = { address: `${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`, lat: c.lat, lng: c.lng }; ma.innerHTML = `<b>${cur.address}</b>`; }
    }, 450);
    map.on("movestart", () => m.querySelector(".pin").classList.add("up"));
    map.on("moveend", () => { m.querySelector(".pin").classList.remove("up"); upd(); });
    setTimeout(() => { map.invalidateSize(); upd(); }, 280);
    m.querySelector("#me").onclick = guard(async () => { const p = await getPos(); if (!p) return toast("Activa la ubicación del navegador"); map.setView([p.lat, p.lng], 17); });
    m.querySelector("#ok").onclick = () => { if (!cur) return toast("Espera a que cargue la dirección"); done = true; m.remove(); resolve(cur); };
  });
}
async function routeMap(el, x) {
  if (!hasC(x.pickup_lat, x.pickup_lng) || !hasC(x.dropoff_lat, x.dropoff_lng)) { el.remove(); return; }
  await loadLeaflet();
  const a = [+x.pickup_lat, +x.pickup_lng], b = [+x.dropoff_lat, +x.dropoff_lng];
  const map = L.map(el, { zoomControl: false, attributionControl: true, dragging: true, scrollWheelZoom: false });
  tiles(map);
  L.polyline([a, b], { color: "#173563", weight: 3, dashArray: "6 8" }).addTo(map);
  L.marker(a, { icon: pinIcon("a") }).addTo(map);
  L.marker(b, { icon: pinIcon("b") }).addTo(map);
  setTimeout(() => { map.invalidateSize(); map.fitBounds([a, b], { padding: [30, 30], maxZoom: 15 }); }, 250);
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
  const all = await api("/admin/clients");
  const cl = all.items.filter((c) => c.active);
  if (!cl.length && !trip) return toast("Primero crea un cliente");
  modal(`<h2>${trip ? "Editar carrera" : "Nueva carrera"}</h2><form id="f">
    ${trip ? "" : `<label class="f">Cliente</label><select name="client_id" required>${cl.map((c) => `<option value="${c.id}" ${c.id === clientId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>`}
    <div class="two"><div><label class="f">Fecha</label><input type="date" name="trip_date" value="${trip?.trip_date || today()}" required></div>
    <div><label class="f">Hora</label><input type="time" name="trip_time" value="${esc(trip?.trip_time || "")}"></div></div>
    ${routeFields(trip || {}, ["Recogida (dónde lo buscaste)", "Destino (a dónde fue)"])}
    <label class="f">Importe (€)</label><input name="amount" type="number" step="0.01" min="0.01" inputmode="decimal" value="${trip ? trip.amount_cents / 100 : ""}" required>
    <label class="f">Notas (opcional)</label><input name="notes" value="${esc(trip?.notes)}">
    ${trip ? "" : `<label class="check"><input type="checkbox" name="notify" checked>Avisar al cliente</label>`}
    <button class="acc block" style="margin-top:14px">${ic("check")}Guardar carrera</button></form>`, async (m) => {
    const amt = m.querySelector("[name=amount]"); let touched = !!trip;
    amt.addEventListener("input", () => (touched = true));
    await bindRoute(m.querySelector("#f"), { admin: true, onEstimate: (km, price) => { if (!touched && price !== null) amt.value = price; } });
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
function shareAccess(c, r) {
  const first = c.name.split(" ")[0];
  const exp = new Date(r.invite_expires).toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  const msg = `Hola ${first}, te creé tu cuenta para ver tus carreras, lo pendiente y tus pagos. Entra en este enlace y elige tu contraseña (vale hasta el ${exp}): ${r.invite_url}\n\nDespués entra siempre en ${location.origin} con tu correo (${c.email}) y tu contraseña.`;
  const ph = String(c.phone || "").replace(/\D/g, "");
  modal(`<div style="text-align:center"><div class="logo" style="width:56px;height:56px;border-radius:18px;margin:4px auto 10px">${ic("key")}</div>
    <h2>Acceso listo para ${esc(first)}</h2><p class="mut" style="margin:4px 0 0">Envíale este enlace. Lo abre, elige su contraseña y queda dentro. Vale hasta el ${exp} y sirve una sola vez.</p></div>
    <label class="f">Enlace de invitación</label><input id="lk" value="${esc(r.invite_url)}" readonly>
    <div class="menu">
      ${ph ? `<button data-a="wa"><span class="ic" style="color:#139E4B">${ic("chat")}</span><span>Enviar por WhatsApp<small>Al ${esc(c.phone)}</small></span></button>` : ""}
      <button data-a="mail"><span class="ic">${ic("mail")}</span><span>Enviar por correo<small>${esc(c.email)}</small></span></button>
      <button data-a="copy"><span class="ic">${ic("copy")}</span><span>Copiar mensaje<small>Para pegarlo donde quieras</small></span></button>
      ${navigator.share ? `<button data-a="share"><span class="ic">${ic("share")}</span><span>Compartir<small>Telegram, SMS…</small></span></button>` : ""}
    </div><button class="ghost block" id="done" style="margin-top:12px">Listo</button>`, (m) => {
    const act = {
      wa: () => window.open(`https://wa.me/${ph}?text=${encodeURIComponent(msg)}`, "_blank", "noopener"),
      mail: () => { location.href = `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent("Tu cuenta de carreras")}&body=${encodeURIComponent(msg)}`; },
      copy: async () => { try { await navigator.clipboard.writeText(msg); toast("Mensaje copiado"); } catch { m.querySelector("#lk").select(); toast("Copia el enlace manualmente"); } },
      share: () => navigator.share({ title: "Tu cuenta de carreras", text: msg }).catch(() => {}),
    };
    m.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => act[b.dataset.a]()));
    m.querySelector("#done").onclick = () => { m.remove(); go("clientes", c.id); };
  });
}

function clientForm() {
  modal(`<h2>Nuevo cliente</h2><form id="f"><p class="mut" style="margin:0">Al crearlo te doy un enlace para que el cliente elija su contraseña.</p><label class="f">Nombre</label><input name="name" required>
    <label class="f">Correo (será su usuario)</label><input name="email" type="email" inputmode="email" required>
    <label class="f">Teléfono con prefijo (ej. 34600111222)</label><input name="phone" inputmode="tel">
    <label class="check"><input type="checkbox" name="notify_whatsapp">Avisos por WhatsApp</label>
    <label class="check"><input type="checkbox" name="consent">El cliente aceptó recibir avisos (RGPD)</label>
    <button class="acc block" style="margin-top:14px">${ic("key")}Crear y obtener enlace</button></form>`, (m) => {
    m.querySelector("#f").onsubmit = guard(async (e) => {
      e.preventDefault();
      const b = formData(e.target); b.notify_whatsapp = !!b.notify_whatsapp; b.consent = !!b.consent;
      const r = await api("/admin/clients", "POST", b);
      m.remove(); shareAccess({ id: r.id, name: b.name, email: b.email, phone: b.phone }, r);
    });
  });
}
function clientEdit(c) {
  modal(`<h2>Editar cliente</h2><form id="f"><label class="f">Nombre</label><input name="name" value="${esc(c.name)}" required>
    <label class="f">Correo (usuario)</label><input name="email" type="email" value="${esc(c.email)}" required>
    <label class="f">Teléfono</label><input name="phone" value="${esc(c.phone)}" inputmode="tel">
    <label class="f">Notas internas (solo las ves tú)</label><textarea name="admin_note" rows="3" placeholder="Ej.: paga los viernes, prefiere Bizum">${esc(c.admin_note || "")}</textarea>
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
