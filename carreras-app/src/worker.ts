import { Hono, type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { FILES } from "./static";

type Env = {
  DB: D1Database;
  SETUP_TOKEN?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_ID?: string;
  WHATSAPP_TEMPLATE?: string;
  REMINDER_DAYS?: string;
  GEO_BASE?: string;
};
type User = {
  id: string; email: string; name: string; phone: string | null; role: "admin" | "client";
  active: number; notify_email: number; notify_whatsapp: number;
};
type Vars = { user: User };
type C = Context<{ Bindings: Env; Variables: Vars }>;

const app = new Hono<{ Bindings: Env; Variables: Vars }>();
const enc = new TextEncoder();
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);
const eur = (c: number) => (c / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const SESSION_DAYS = 30;

async function sha256(s: string) { return hex(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
async function hashPass(pass: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: 100000 }, key, 256);
  return hex(bits);
}
function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
const err = (c: C, msg: string, status = 400) => c.json({ error: msg }, status as 400);
const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const cents = (v: unknown) => { const n = Math.round(Number(v) * 100); return Number.isFinite(n) ? n : NaN; };
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
const coord = (v: unknown, max: number) => { const n = Number(v); return v !== "" && v !== null && v !== undefined && Number.isFinite(n) && Math.abs(n) <= max ? Math.round(n * 1e6) / 1e6 : null; };
const coords = (b: Record<string, unknown>) => ({
  pickup_lat: coord(b.pickup_lat, 90), pickup_lng: coord(b.pickup_lng, 180), dropoff_lat: coord(b.dropoff_lat, 90), dropoff_lng: coord(b.dropoff_lng, 180),
});
const phoneE164 = (p: string | null) => (p ? p.replace(/[^\d]/g, "") : "");

async function createSession(c: C, userId: string) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const exp = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await c.env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)").bind(await sha256(token), userId, exp).run();
  setCookie(c, "sid", token, { httpOnly: true, secure: true, sameSite: "Strict", path: "/", maxAge: SESSION_DAYS * 86400 });
}

// ---- Protección básica: solo JSON en escrituras (frena CSRF junto con SameSite=Strict)
app.use("/api/*", async (c, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(c.req.method) && !(c.req.header("content-type") || "").includes("application/json"))
    return err(c, "Content-Type inválido", 415);
  await next();
});

const auth = async (c: C, next: () => Promise<void>) => {
  const tok = getCookie(c, "sid");
  if (!tok) return err(c, "No has iniciado sesión", 401);
  const u = await c.env.DB.prepare(
    `SELECT u.id,u.email,u.name,u.phone,u.role,u.active,u.notify_email,u.notify_whatsapp
     FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`
  ).bind(await sha256(tok), now()).first<User>();
  if (!u || !u.active) return err(c, "Sesión no válida", 401);
  c.set("user", u);
  await next();
};
const adminOnly = async (c: C, next: () => Promise<void>) => {
  if (c.get("user").role !== "admin") return err(c, "Solo el administrador", 403);
  await next();
};
app.use("/api/admin/*", auth as never, adminOnly as never);
app.use("/api/client/*", auth as never);
app.use("/api/notifications/*", auth as never);
app.use("/api/me", auth as never);
app.use("/api/pulse", auth as never);
app.use("/api/password", auth as never);

// ---- Alta del primer administrador (solo si no hay usuarios y con SETUP_TOKEN)
app.post("/api/setup", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const n = await c.env.DB.prepare("SELECT COUNT(*) n FROM users").first<{ n: number }>();
  if (n!.n > 0) return err(c, "Ya está configurada", 403);
  if (!c.env.SETUP_TOKEN || !safeEq(str(b.token, 200), c.env.SETUP_TOKEN)) return err(c, "Token de configuración incorrecto", 403);
  const email = str(b.email).toLowerCase(), pass = str(b.password, 200), name = str(b.name, 100);
  if (!/^\S+@\S+\.\S+$/.test(email) || pass.length < 10 || !name) return err(c, "Datos inválidos (contraseña mínima de 10 caracteres)");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  await c.env.DB.prepare("INSERT INTO users(id,email,name,role,pass_hash,pass_salt,created_at) VALUES(?,?,?,?,?,?,?)")
    .bind(crypto.randomUUID(), email, name, "admin", await hashPass(pass, salt), salt, now()).run();
  return c.json({ ok: true });
});

app.post("/api/login", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = str(b.email).toLowerCase(), pass = str(b.password, 200);
  const since = new Date(Date.now() - 15 * 60e3).toISOString();
  const tries = await c.env.DB.prepare("SELECT COUNT(*) n FROM login_attempts WHERE email=? AND at>?").bind(email, since).first<{ n: number }>();
  if (tries!.n >= 8) return err(c, "Demasiados intentos. Espera 15 minutos.", 429);
  const u = await c.env.DB.prepare("SELECT * FROM users WHERE email=?").bind(email).first<User & { pass_hash: string; pass_salt: string }>();
  const ok = u && u.active && safeEq(await hashPass(pass, u.pass_salt), u.pass_hash);
  if (!ok) {
    await c.env.DB.batch([
      c.env.DB.prepare("INSERT INTO login_attempts(email,at) VALUES(?,?)").bind(email, now()),
      c.env.DB.prepare("DELETE FROM login_attempts WHERE at<?").bind(since),
    ]);
    return err(c, "Correo o contraseña incorrectos", 401);
  }
  await createSession(c, u!.id);
  return c.json({ ok: true, role: u!.role });
});

app.post("/api/logout", async (c) => {
  const tok = getCookie(c, "sid");
  if (tok) await c.env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await sha256(tok)).run();
  deleteCookie(c, "sid", { path: "/" });
  return c.json({ ok: true });
});

app.get("/api/me", async (c) => {
  const u = c.get("user");
  const n = await c.env.DB.prepare("SELECT COUNT(*) n FROM notifications WHERE user_id=? AND read=0").bind(u.id).first<{ n: number }>();
  const av = await c.env.DB.prepare("SELECT avatar_v FROM users WHERE id=?").bind(u.id).first<{ avatar_v: number }>();
  return c.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar_v: av?.avatar_v || 0 }, unread: n!.n });
});

app.post("/api/password", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const u = c.get("user");
  const row = await c.env.DB.prepare("SELECT pass_hash,pass_salt FROM users WHERE id=?").bind(u.id).first<{ pass_hash: string; pass_salt: string }>();
  if (!safeEq(await hashPass(str(b.current, 200), row!.pass_salt), row!.pass_hash)) return err(c, "La contraseña actual no coincide", 403);
  const np = str(b.next, 200);
  if (np.length < 10) return err(c, "Mínimo 10 caracteres");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  await c.env.DB.prepare("UPDATE users SET pass_hash=?,pass_salt=? WHERE id=?").bind(await hashPass(np, salt), salt, u.id).run();
  return c.json({ ok: true });
});

// ---- Notificaciones (app + correo + WhatsApp)
type Ctx = { waitUntil(p: Promise<unknown>): void };
type Target = { id: string; name: string; email: string; phone: string | null; notify_email: number; notify_whatsapp: number };
async function notify(env: Env, ctx: Ctx, target: { id: string; name: string; email: string; phone: string | null; notify_email: number; notify_whatsapp: number }, title: string, body: string) {
  await env.DB.prepare("INSERT INTO notifications(id,user_id,title,body,created_at) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(), target.id, title, body, now()).run();
  const e = env;
  const jobs: Promise<unknown>[] = [];
  if (target.notify_email && e.RESEND_API_KEY && e.EMAIL_FROM) {
    jobs.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: e.EMAIL_FROM, to: target.email, subject: title, text: `Hola ${target.name},\n\n${body}\n\nPuedes ver el detalle en tu cuenta.` }),
    }).catch(() => null));
  }
  if (target.notify_whatsapp && e.WHATSAPP_TOKEN && e.WHATSAPP_PHONE_ID && phoneE164(target.phone)) {
    jobs.push(fetch(`https://graph.facebook.com/v21.0/${e.WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${e.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp", to: phoneE164(target.phone), type: "template",
        template: { name: e.WHATSAPP_TEMPLATE || "aviso_carreras", language: { code: "es" },
          components: [{ type: "body", parameters: [{ type: "text", text: `${title}. ${body}`.replace(/\s+/g, " ").slice(0, 900) }] }] },
      }),
    }).catch(() => null));
  }
  if (jobs.length) ctx.waitUntil(Promise.all(jobs));
}

// ---- Pulso: firma barata de los datos para refrescar la app en vivo
app.get("/api/pulse", async (c) => {
  const u = c.get("user");
  const q = u.role === "admin"
    ? c.env.DB.prepare(`SELECT (SELECT COUNT(*)||':'||COALESCE(SUM(amount_cents),0) FROM trips)||'|'||(SELECT COUNT(*)||':'||COALESCE(SUM(amount_cents),0) FROM payments)||'|'||
        (SELECT COUNT(*) FROM trip_requests WHERE status='pending')||'|'||(SELECT COUNT(*) FROM expenses)||'|'||(SELECT COUNT(*) FROM users)||'|'||
        (SELECT COUNT(*) FROM notifications WHERE user_id=?1 AND read=0) sig`).bind(u.id)
    : c.env.DB.prepare(`SELECT (SELECT COUNT(*)||':'||COALESCE(SUM(amount_cents),0)||':'||COALESCE(MAX(created_at),'') FROM trips WHERE client_id=?1)||'|'||
        (SELECT COUNT(*)||':'||COALESCE(SUM(amount_cents),0) FROM payments WHERE client_id=?1)||'|'||
        (SELECT COUNT(*)||':'||COALESCE(MAX(answered_at),'') FROM trip_requests WHERE client_id=?1)||'|'||
        (SELECT COUNT(*) FROM notifications WHERE user_id=?1 AND read=0) sig`).bind(u.id);
  const r = await q.first<{ sig: string }>();
  const unread = Number(r!.sig.split("|").pop());
  return c.json({ sig: r!.sig, unread });
});

app.get("/api/notifications", async (c) => {
  const r = await c.env.DB.prepare("SELECT id,title,body,read,created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(c.get("user").id).all();
  return c.json({ items: r.results });
});
app.post("/api/notifications/read", async (c) => {
  await c.env.DB.prepare("UPDATE notifications SET read=1 WHERE user_id=?").bind(c.get("user").id).run();
  return c.json({ ok: true });
});

// ---- Consultas compartidas
const TRIP_SQL = `SELECT t.id,t.client_id,t.trip_date,t.trip_time,t.pickup,t.pickup_lat,t.pickup_lng,t.dropoff_lat,t.dropoff_lng,t.dropoff,t.amount_cents,t.notes,
  COALESCE((SELECT SUM(a.amount_cents) FROM allocations a WHERE a.trip_id=t.id),0) paid_cents,
  (SELECT MAX(p.pay_date) FROM allocations a JOIN payments p ON p.id=a.payment_id WHERE a.trip_id=t.id) last_pay_date
  FROM trips t`;
async function clientTotals(db: D1Database, clientId: string) {
  const r = await db.prepare(
    `SELECT COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=?1),0) charged,
            COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=?1),0) paid`
  ).bind(clientId).first<{ charged: number; paid: number }>();
  return { charged_cents: r!.charged, paid_cents: r!.paid, pending_cents: r!.charged - r!.paid };
}
async function listTrips(db: D1Database, clientId: string | null, status: string) {
  const where = clientId ? "WHERE t.client_id=?" : "";
  const rows = (await db.prepare(`${TRIP_SQL} ${where} ORDER BY t.trip_date DESC, t.trip_time DESC, t.created_at DESC LIMIT 1000`).bind(...(clientId ? [clientId] : [])).all<Record<string, number | string>>()).results;
  const out = rows.map((t) => ({ ...t, pending_cents: (t.amount_cents as number) - (t.paid_cents as number) }));
  if (status === "pending") return out.filter((t) => t.pending_cents > 0);
  if (status === "paid") return out.filter((t) => t.pending_cents === 0);
  return out;
}
async function listPayments(db: D1Database, clientId: string) {
  return (await db.prepare(
    `SELECT p.id,p.pay_date,p.amount_cents,p.method,p.note,
       (SELECT GROUP_CONCAT(t.trip_date||' · '||t.pickup||' → '||t.dropoff, ' | ') FROM allocations a JOIN trips t ON t.id=a.trip_id WHERE a.payment_id=p.id) applied_to
     FROM payments p WHERE p.client_id=? ORDER BY p.pay_date DESC, p.created_at DESC LIMIT 1000`
  ).bind(clientId).all()).results;
}

// ---- Cliente
app.get("/api/client/summary", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  const trips = await listTrips(c.env.DB, u.id, "all") as unknown as { trip_date: string; amount_cents: number; paid_cents: number; pending_cents: number }[];
  const pend = trips.filter((t) => t.pending_cents > 0), paid = trips.filter((t) => t.pending_cents === 0);
  const last = await c.env.DB.prepare("SELECT pay_date, amount_cents FROM payments WHERE client_id=? ORDER BY pay_date DESC, created_at DESC LIMIT 1").bind(u.id).first<{ pay_date: string; amount_cents: number }>();
  return c.json({
    ...(await clientTotals(c.env.DB, u.id)),
    trips_total: trips.length,
    trips_pending: pend.length, trips_partial: pend.filter((t) => t.paid_cents > 0).length, trips_paid: paid.length,
    paid_trips_cents: paid.reduce((a, t) => a + t.amount_cents, 0),
    oldest_unpaid: pend.length ? pend.map((t) => t.trip_date).sort()[0] : null,
    last_payment: last || null,
    month_trips: trips.filter((t) => t.trip_date.startsWith(today().slice(0, 7))).length,
  });
});
app.get("/api/client/trips", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  return c.json({ items: await listTrips(c.env.DB, u.id, c.req.query("status") || "all") });
});
app.get("/api/client/payments", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  return c.json({ items: await listPayments(c.env.DB, u.id) });
});

// ---- Admin: resumen
app.get("/api/admin/summary", async (c) => {
  const month = today().slice(0, 7);
  const db = c.env.DB;
  const months: string[] = [];
  const d0 = new Date(today().slice(0, 7) + "-01T12:00:00Z");
  for (let i = 5; i >= 0; i--) { const d = new Date(d0); d.setUTCMonth(d.getUTCMonth() - i); months.push(d.toISOString().slice(0, 7)); }
  const [tot, m, top, ser, req] = await Promise.all([
    db.prepare(`SELECT COALESCE((SELECT SUM(amount_cents) FROM trips),0) - COALESCE((SELECT SUM(amount_cents) FROM payments),0) pending`).first<{ pending: number }>(),
    db.prepare(`SELECT COALESCE((SELECT SUM(amount_cents) FROM trips WHERE trip_date LIKE ?1||'%'),0) charged,
                       COALESCE((SELECT COUNT(*) FROM trips WHERE trip_date LIKE ?1||'%'),0) trips,
                       COALESCE((SELECT SUM(amount_cents) FROM payments WHERE pay_date LIKE ?1||'%'),0) collected`).bind(month).first<{ charged: number; trips: number; collected: number }>(),
    db.prepare(`SELECT u.id,u.name,u.avatar_v,
        COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id),0) - COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id),0) pending_cents,
        (SELECT MIN(t.trip_date) FROM trips t WHERE t.client_id=u.id AND t.amount_cents > COALESCE((SELECT SUM(a.amount_cents) FROM allocations a WHERE a.trip_id=t.id),0)) oldest_unpaid
        FROM users u WHERE u.role='client' ORDER BY pending_cents DESC LIMIT 5`).all(),
    db.prepare(`SELECT substr(trip_date,1,7) m, 'c' k, SUM(amount_cents) v FROM trips WHERE trip_date >= ?1 GROUP BY m
                UNION ALL SELECT substr(pay_date,1,7), 'p', SUM(amount_cents) FROM payments WHERE pay_date >= ?1 GROUP BY 1
                UNION ALL SELECT substr(exp_date,1,7), 'e', SUM(amount_cents) FROM expenses WHERE exp_date >= ?1 GROUP BY 1`).bind(months[0] + "-01").all<{ m: string; k: string; v: number }>(),
    db.prepare("SELECT COUNT(*) n FROM trip_requests WHERE status='pending'").first<{ n: number }>(),
  ]);
  const series = months.map((mm) => {
    const g = (k: string) => ser.results.find((r) => r.m === mm && r.k === k)?.v || 0;
    return { month: mm, charged_cents: g("c"), collected_cents: g("p"), expenses_cents: g("e") };
  });
  return c.json({ pending_cents: tot!.pending, month_charged_cents: m!.charged, month_trips: m!.trips, month_collected_cents: m!.collected, month_expenses_cents: series[5].expenses_cents, series, pending_requests: req!.n, top_debtors: top.results.filter((r) => (r.pending_cents as number) > 0) });
});

// ---- Admin: clientes
app.get("/api/admin/clients", async (c) => {
  const r = await c.env.DB.prepare(
    `SELECT u.id,u.name,u.email,u.phone,u.active,u.notify_email,u.notify_whatsapp,u.pass_set,u.avatar_v,u.created_at,
       COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id),0) charged_cents,
       COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id),0) paid_cents
     FROM users u WHERE u.role='client' ORDER BY u.name`
  ).all<Record<string, number | string>>();
  return c.json({ items: r.results.map((x) => ({ ...x, pending_cents: (x.charged_cents as number) - (x.paid_cents as number) })) });
});
app.post("/api/admin/clients", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const name = str(b.name, 100), email = str(b.email).toLowerCase(), phone = str(b.phone, 30) || null;
  let pass = str(b.password, 200);
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) return err(c, "Indica nombre y un correo válido");
  if (pass && pass.length < 8) return err(c, "La contraseña debe tener al menos 8 caracteres");
  const invite = !pass;
  if (invite) pass = hex(crypto.getRandomValues(new Uint8Array(32)));
  if (await c.env.DB.prepare("SELECT 1 FROM users WHERE email=?").bind(email).first()) return err(c, "Ese correo ya existe", 409);
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO users(id,email,name,phone,role,pass_hash,pass_salt,notify_email,notify_whatsapp,consent_at,created_at,pass_set) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id, email, name, phone, "client", await hashPass(pass, salt), salt, b.notify_email === false ? 0 : 1, b.notify_whatsapp && phone ? 1 : 0, b.consent ? now() : null, now(), invite ? 0 : 1).run();
  return c.json({ id, ...(invite ? await createInvite(c, id) : {}) });
});
app.patch("/api/admin/clients/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const id = c.req.param("id");
  const cur = await c.env.DB.prepare("SELECT * FROM users WHERE id=? AND role='client'").bind(id).first<Record<string, unknown>>();
  if (!cur) return err(c, "Cliente no encontrado", 404);
  const name = str(b.name, 100) || (cur.name as string);
  const phone = b.phone !== undefined ? str(b.phone, 30) || null : (cur.phone as string | null);
  const flag = (v: unknown, d: unknown) => (v === undefined ? (d as number) : v ? 1 : 0);
  let email = cur.email as string;
  if (b.email !== undefined && str(b.email).toLowerCase() !== email) {
    email = str(b.email).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return err(c, "Correo no válido");
    if (await c.env.DB.prepare("SELECT 1 FROM users WHERE email=? AND id<>?").bind(email, id).first()) return err(c, "Ese correo ya lo usa otra cuenta", 409);
  }
  const note = b.admin_note !== undefined ? str(b.admin_note, 1000) || null : (cur.admin_note as string | null);
  await c.env.DB.prepare("UPDATE users SET name=?,phone=?,email=?,admin_note=?,active=?,notify_email=?,notify_whatsapp=? WHERE id=?")
    .bind(name, phone, email, note, flag(b.active, cur.active), flag(b.notify_email, cur.notify_email), flag(b.notify_whatsapp, cur.notify_whatsapp), id).run();
  if (b.active === false) await c.env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id).run();
  return c.json({ ok: true });
});
app.post("/api/admin/clients/:id/password", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const pass = str(b.password, 200);
  if (pass.length < 8) return err(c, "Mínimo 8 caracteres");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const id = c.req.param("id");
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET pass_hash=?,pass_salt=?,pass_set=1 WHERE id=? AND role='client'").bind(await hashPass(pass, salt), salt, id),
    c.env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id),
  ]);
  return c.json({ ok: true });
});
app.get("/api/admin/clients/:id", async (c) => {
  const id = c.req.param("id");
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,active,notify_email,notify_whatsapp,pass_set,avatar_v,admin_note,created_at,consent_at FROM users WHERE id=? AND role='client'").bind(id).first();
  if (!cl) return err(c, "Cliente no encontrado", 404);
  return c.json({ client: cl, totals: await clientTotals(c.env.DB, id), trips: await listTrips(c.env.DB, id, "all"), payments: await listPayments(c.env.DB, id) });
});
app.post("/api/admin/clients/:id/reminder", async (c) => {
  const id = c.req.param("id");
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client' AND active=1").bind(id).first<Target>();
  if (!cl) return err(c, "Cliente no encontrado", 404);
  const t = await clientTotals(c.env.DB, id);
  if (t.pending_cents <= 0) return err(c, "Este cliente no tiene saldo pendiente");
  await notify(c.env, c.executionCtx, cl, "Recordatorio de saldo pendiente", `Tienes un saldo pendiente de ${eur(t.pending_cents)}.`);
  await c.env.DB.prepare("UPDATE users SET last_reminder_at=? WHERE id=?").bind(now(), id).run();
  return c.json({ ok: true });
});

// ---- Admin: carreras
app.get("/api/admin/trips", async (c) => c.json({ items: await listTrips(c.env.DB, null, c.req.query("status") || "all") }));
function tripFields(b: Record<string, unknown>) {
  const tt = str(b.trip_time, 5), trip_time = /^\d{2}:\d{2}$/.test(tt) ? tt : null;
  const trip_date = str(b.trip_date, 10) || today(), pickup = str(b.pickup), dropoff = str(b.dropoff), amount = cents(b.amount), notes = str(b.notes, 500) || null;
  if (!isDate(trip_date) || !pickup || !dropoff || !(amount > 0)) return null;
  return { trip_date, trip_time, pickup, dropoff, amount, notes, ...coords(b) };
}
app.post("/api/admin/trips", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const f = tripFields(b);
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client' AND active=1").bind(str(b.client_id, 60)).first<Target>();
  if (!f || !cl) return err(c, "Revisa cliente, fecha, lugares e importe");
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO trips(id,client_id,trip_date,trip_time,pickup,dropoff,amount_cents,notes,created_at,pickup_lat,pickup_lng,dropoff_lat,dropoff_lng) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id, cl.id, f.trip_date, f.trip_time, f.pickup, f.dropoff, f.amount, f.notes, now(), f.pickup_lat, f.pickup_lng, f.dropoff_lat, f.dropoff_lng).run();
  if (b.notify !== false) {
    const t = await clientTotals(c.env.DB, cl.id);
    await notify(c.env, c.executionCtx, cl, "Nueva carrera registrada", `${f.trip_date}: de ${f.pickup} a ${f.dropoff} por ${eur(f.amount)}. Saldo pendiente: ${eur(t.pending_cents)}.`);
  }
  return c.json({ id });
});
app.patch("/api/admin/trips/:id", async (c) => {
  const f = tripFields(await c.req.json().catch(() => ({})));
  if (!f) return err(c, "Datos inválidos");
  const id = c.req.param("id");
  const paid = await c.env.DB.prepare("SELECT COALESCE(SUM(amount_cents),0) p FROM allocations WHERE trip_id=?").bind(id).first<{ p: number }>();
  if (f.amount < paid!.p) return err(c, "El importe no puede ser menor a lo ya pagado de esta carrera");
  await c.env.DB.prepare("UPDATE trips SET trip_date=?,trip_time=?,pickup=?,dropoff=?,amount_cents=?,notes=?,pickup_lat=?,pickup_lng=?,dropoff_lat=?,dropoff_lng=? WHERE id=?").bind(f.trip_date, f.trip_time, f.pickup, f.dropoff, f.amount, f.notes, f.pickup_lat, f.pickup_lng, f.dropoff_lat, f.dropoff_lng, id).run();
  return c.json({ ok: true });
});
app.delete("/api/admin/trips/:id", async (c) => {
  const id = c.req.param("id");
  const has = await c.env.DB.prepare("SELECT 1 FROM allocations WHERE trip_id=? LIMIT 1").bind(id).first();
  if (has) return err(c, "Esta carrera ya tiene pagos aplicados. Elimina primero esos pagos.", 409);
  await c.env.DB.prepare("DELETE FROM trips WHERE id=?").bind(id).run();
  return c.json({ ok: true });
});

// ---- Admin: pagos (se aplican a las carreras más antiguas primero, o a una carrera concreta)
app.post("/api/admin/payments", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const amount = cents(b.amount), method = str(b.method, 40) || "Efectivo", pay_date = str(b.pay_date, 10) || today(), note = str(b.note, 300) || null;
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client' AND active=1").bind(str(b.client_id, 60)).first<Target>();
  if (!cl || !(amount > 0) || !isDate(pay_date)) return err(c, "Revisa cliente, fecha e importe");
  const only = str(b.trip_id, 60);
  const pend = (await listTrips(c.env.DB, cl.id, "pending")).reverse() as unknown as { id: string; pending_cents: number }[];
  const pendSel = only ? pend.filter((t) => t.id === only) : pend;
  const totalPending = pendSel.reduce((s, t) => s + t.pending_cents, 0);
  if (amount > totalPending) return err(c, `El pago (${eur(amount)}) supera lo pendiente (${eur(totalPending)})`);
  const pid = crypto.randomUUID();
  const stmts = [c.env.DB.prepare("INSERT INTO payments(id,client_id,pay_date,amount_cents,method,note,created_at) VALUES(?,?,?,?,?,?,?)").bind(pid, cl.id, pay_date, amount, method, note, now())];
  let left = amount;
  for (const t of pendSel) {
    if (left <= 0) break;
    const a = Math.min(left, t.pending_cents);
    stmts.push(c.env.DB.prepare("INSERT INTO allocations(payment_id,trip_id,amount_cents) VALUES(?,?,?)").bind(pid, t.id, a));
    left -= a;
  }
  await c.env.DB.batch(stmts);
  if (b.notify !== false) {
    const t = await clientTotals(c.env.DB, cl.id);
    await notify(c.env, c.executionCtx, cl, "Pago recibido", `Hemos registrado tu pago de ${eur(amount)} (${method}) del ${pay_date}. Saldo pendiente: ${eur(t.pending_cents)}.`);
  }
  return c.json({ id: pid });
});
app.delete("/api/admin/payments/:id", async (c) => {
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM allocations WHERE payment_id=?").bind(c.req.param("id")),
    c.env.DB.prepare("DELETE FROM payments WHERE id=?").bind(c.req.param("id")),
  ]);
  return c.json({ ok: true });
});

// ---- Gastos del vehículo (solo admin)
const EXP_CATS = ["Combustible", "Mantenimiento", "Peajes", "Parking", "Seguro", "Lavado", "Otros"];
app.get("/api/admin/expenses", async (c) => {
  const month = str(c.req.query("month"), 7) || today().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(month)) return err(c, "Mes inválido");
  const r = await c.env.DB.prepare("SELECT id,exp_date,category,amount_cents,note FROM expenses WHERE exp_date LIKE ?||'%' ORDER BY exp_date DESC, created_at DESC").bind(month).all<{ category: string; amount_cents: number }>();
  const by: Record<string, number> = {};
  for (const e of r.results) by[e.category] = (by[e.category] || 0) + e.amount_cents;
  return c.json({ month, items: r.results, by_category: by, total_cents: r.results.reduce((a, e) => a + e.amount_cents, 0), categories: EXP_CATS });
});
app.post("/api/admin/expenses", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const exp_date = str(b.exp_date, 10) || today(), category = EXP_CATS.includes(str(b.category, 30)) ? str(b.category, 30) : "Otros", amount = cents(b.amount), note = str(b.note, 300) || null;
  if (!isDate(exp_date) || !(amount > 0)) return err(c, "Revisa fecha e importe");
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO expenses(id,exp_date,category,amount_cents,note,created_at) VALUES(?,?,?,?,?,?)").bind(id, exp_date, category, amount, note, now()).run();
  return c.json({ id });
});
app.delete("/api/admin/expenses/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM expenses WHERE id=?").bind(c.req.param("id")).run();
  return c.json({ ok: true });
});

// ---- Solicitudes de carrera (el cliente pide, el admin acepta con importe o rechaza)
async function admins(db: D1Database) {
  return (await db.prepare("SELECT id,name,email,phone,notify_email,0 notify_whatsapp FROM users WHERE role='admin' AND active=1").all<Target>()).results;
}
app.post("/api/client/requests", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  const b = await c.req.json().catch(() => ({}));
  const req_date = str(b.req_date, 10) || today(), tt = str(b.req_time, 5), req_time = /^\d{2}:\d{2}$/.test(tt) ? tt : null;
  const pickup = str(b.pickup), dropoff = str(b.dropoff), note = str(b.note, 300) || null;
  if (!isDate(req_date) || !pickup || !dropoff) return err(c, "Indica fecha, recogida y destino");
  if (req_date < today()) return err(c, "La fecha no puede ser pasada");
  const open = await c.env.DB.prepare("SELECT COUNT(*) n FROM trip_requests WHERE client_id=? AND status='pending'").bind(u.id).first<{ n: number }>();
  if (open!.n >= 5) return err(c, "Tienes 5 solicitudes pendientes. Espera a que las respondan.", 429);
  const id = crypto.randomUUID(), k = coords(b);
  await c.env.DB.prepare("INSERT INTO trip_requests(id,client_id,req_date,req_time,pickup,dropoff,note,created_at,pickup_lat,pickup_lng,dropoff_lat,dropoff_lng) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id, u.id, req_date, req_time, pickup, dropoff, note, now(), k.pickup_lat, k.pickup_lng, k.dropoff_lat, k.dropoff_lng).run();
  for (const a of await admins(c.env.DB))
    await notify(c.env, c.executionCtx, a, "Nueva solicitud de carrera", `${u.name} pide carrera el ${req_date}${req_time ? " a las " + req_time : ""}: de ${pickup} a ${dropoff}.`);
  return c.json({ id });
});
app.get("/api/client/requests", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  const r = await c.env.DB.prepare("SELECT id,req_date,req_time,pickup,dropoff,note,status,answer_note,created_at,pickup_lat,pickup_lng,dropoff_lat,dropoff_lng FROM trip_requests WHERE client_id=? ORDER BY created_at DESC LIMIT 50").bind(u.id).all();
  return c.json({ items: r.results });
});
app.post("/api/client/requests/:id/cancel", async (c) => {
  const u = c.get("user");
  const r = await c.env.DB.prepare("UPDATE trip_requests SET status='cancelled', answered_at=? WHERE id=? AND client_id=? AND status='pending'").bind(now(), c.req.param("id"), u.id).run();
  if (!r.meta.changes) return err(c, "No se puede cancelar", 409);
  return c.json({ ok: true });
});
app.get("/api/admin/requests", async (c) => {
  const st = c.req.query("status") === "all" ? "" : "WHERE r.status='pending'";
  const r = await c.env.DB.prepare(`SELECT r.*, u.name client_name, u.avatar_v client_avatar_v FROM trip_requests r JOIN users u ON u.id=r.client_id ${st} ORDER BY r.status='pending' DESC, r.req_date, r.req_time LIMIT 100`).all();
  return c.json({ items: r.results });
});
app.post("/api/admin/requests/:id/accept", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const amount = cents(b.amount);
  if (!(amount > 0)) return err(c, "Indica el importe de la carrera");
  const r = await c.env.DB.prepare("SELECT * FROM trip_requests WHERE id=? AND status='pending'").bind(c.req.param("id")).first<Record<string, string>>();
  if (!r) return err(c, "La solicitud ya no está pendiente", 409);
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND active=1").bind(r.client_id).first<Target>();
  if (!cl) return err(c, "Cliente inactivo", 409);
  const tid = crypto.randomUUID(), note = str(b.note, 300) || null;
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO trips(id,client_id,trip_date,trip_time,pickup,dropoff,amount_cents,notes,created_at,pickup_lat,pickup_lng,dropoff_lat,dropoff_lng) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(tid, r.client_id, r.req_date, r.req_time, r.pickup, r.dropoff, amount, r.note, now(), r.pickup_lat ?? null, r.pickup_lng ?? null, r.dropoff_lat ?? null, r.dropoff_lng ?? null),
    c.env.DB.prepare("UPDATE trip_requests SET status='accepted', trip_id=?, answer_note=?, answered_at=? WHERE id=?").bind(tid, note, now(), r.id),
  ]);
  const t = await clientTotals(c.env.DB, cl.id);
  await notify(c.env, c.executionCtx, cl, "Carrera confirmada", `Tu carrera del ${r.req_date}${r.req_time ? " a las " + r.req_time : ""} de ${r.pickup} a ${r.dropoff} está confirmada por ${eur(amount)}.${note ? " " + note : ""} Saldo pendiente: ${eur(t.pending_cents)}.`);
  return c.json({ trip_id: tid });
});
app.post("/api/admin/requests/:id/reject", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const note = str(b.note, 300) || null;
  const r = await c.env.DB.prepare("SELECT * FROM trip_requests WHERE id=? AND status='pending'").bind(c.req.param("id")).first<Record<string, string>>();
  if (!r) return err(c, "La solicitud ya no está pendiente", 409);
  await c.env.DB.prepare("UPDATE trip_requests SET status='rejected', answer_note=?, answered_at=? WHERE id=?").bind(note, now(), r.id).run();
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=?").bind(r.client_id).first<Target>();
  if (cl) await notify(c.env, c.executionCtx, cl, "Carrera no disponible", `No puedo hacer la carrera del ${r.req_date}${r.req_time ? " a las " + r.req_time : ""} de ${r.pickup} a ${r.dropoff}.${note ? " " + note : ""}`);
  return c.json({ ok: true });
});

// ---- Invitaciones: enlace de un solo uso para que el cliente elija su contraseña
const INVITE_DAYS = 7;
async function createInvite(c: C, userId: string) {
  const token = hex(crypto.getRandomValues(new Uint8Array(24)));
  const exp = new Date(Date.now() + INVITE_DAYS * 864e5).toISOString();
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM invites WHERE user_id=?").bind(userId),
    c.env.DB.prepare("INSERT INTO invites(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)").bind(await sha256(token), userId, exp, now()),
  ]);
  return { invite_url: `${new URL(c.req.url).origin}/invitar/${token}`, invite_expires: exp };
}
async function findInvite(c: C, token: string) {
  if (!/^[0-9a-f]{48}$/.test(token)) return null;
  return c.env.DB.prepare(
    `SELECT i.token_hash,u.id,u.name,u.email FROM invites i JOIN users u ON u.id=i.user_id
     WHERE i.token_hash=? AND i.used_at IS NULL AND i.expires_at>? AND u.active=1 AND u.role='client'`
  ).bind(await sha256(token), now()).first<{ token_hash: string; id: string; name: string; email: string }>();
}
app.post("/api/admin/clients/:id/invite", async (c) => {
  const id = c.req.param("id");
  const u = await c.env.DB.prepare("SELECT id FROM users WHERE id=? AND role='client' AND active=1").bind(id).first();
  if (!u) return err(c, "Cliente no encontrado o inactivo", 404);
  return c.json(await createInvite(c, id));
});
app.get("/api/invite/:token", async (c) => {
  const i = await findInvite(c, c.req.param("token"));
  if (!i) return err(c, "Este enlace ya se usó o caducó. Pide uno nuevo a tu conductor.", 404);
  return c.json({ name: i.name, email: i.email });
});
app.post("/api/invite/:token", async (c) => {
  const i = await findInvite(c, c.req.param("token"));
  if (!i) return err(c, "Este enlace ya se usó o caducó. Pide uno nuevo a tu conductor.", 404);
  const b = await c.req.json().catch(() => ({}));
  const pass = str(b.password, 200);
  if (pass.length < 8) return err(c, "La contraseña debe tener al menos 8 caracteres");
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  await c.env.DB.batch([
    c.env.DB.prepare("UPDATE users SET pass_hash=?,pass_salt=?,pass_set=1,consent_at=COALESCE(consent_at,?) WHERE id=?").bind(await hashPass(pass, salt), salt, b.consent ? now() : null, i.id),
    c.env.DB.prepare("UPDATE invites SET used_at=? WHERE token_hash=?").bind(now(), i.token_hash),
    c.env.DB.prepare("DELETE FROM invites WHERE user_id=? AND token_hash<>?").bind(i.id, i.token_hash),
    c.env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(i.id),
  ]);
  await createSession(c, i.id);
  return c.json({ ok: true });
});

// ---- Direcciones y mapa (OpenStreetMap vía Photon). Pasa por el servidor: el proveedor no ve la IP ni la cuenta del usuario.
type PhotonF = { properties: Record<string, string>; geometry: { coordinates: [number, number] } };
function photonLabel(p: Record<string, string>) {
  const street = p.street ? `${p.street}${p.housenumber ? " " + p.housenumber : ""}` : "";
  const main = p.name && p.name !== p.street ? p.name : street || p.name || p.locality || p.city || "";
  const rest = [p.name && p.name !== p.street && street ? street : "", p.city || p.town || p.village || p.locality, p.state && p.state !== (p.city || "") ? p.state : "", p.countrycode !== "ES" ? p.country : ""].filter(Boolean);
  return { label: main, sub: [...new Set(rest)].join(", ") };
}
async function photon(c: C, path: string) {
  const url = (c.env.GEO_BASE || "https://photon.komoot.io") + path;
  const cache = (caches as unknown as { default: Cache }).default, key = new Request(url);
  let r = await cache.match(key);
  if (!r) {
    const up = await fetch(url, { headers: { "User-Agent": "CarrerasApp/1.0 (gestion privada de carreras)", Accept: "application/json" } });
    if (!up.ok) throw new Error("geo " + up.status);
    r = new Response(up.body, { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=86400" } });
    c.executionCtx.waitUntil(cache.put(key, r.clone()));
  }
  const j = (await r.json()) as { features: PhotonF[] };
  return j.features.map((f) => { const l = photonLabel(f.properties); return { ...l, address: [l.label, l.sub].filter(Boolean).join(", "), lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }; });
}
app.use("/api/geo/*", auth as never);
app.get("/api/geo/search", async (c) => {
  const q = str(c.req.query("q"), 120);
  if (q.length < 3) return c.json({ items: [] });
  const lat = coord(c.req.query("lat"), 90), lng = coord(c.req.query("lng"), 180);
  const bias = lat !== null && lng !== null ? `&lat=${lat.toFixed(3)}&lon=${lng.toFixed(3)}&location_bias_scale=0.4` : "";
  try { return c.json({ items: await photon(c, `/api/?q=${encodeURIComponent(q)}&limit=6${bias}`) }); }
  catch { return err(c, "El buscador de direcciones no responde. Escríbela a mano.", 502); }
});
app.get("/api/geo/reverse", async (c) => {
  const lat = coord(c.req.query("lat"), 90), lng = coord(c.req.query("lng"), 180);
  if (lat === null || lng === null) return err(c, "Coordenadas inválidas");
  try { const it = await photon(c, `/reverse?lat=${lat.toFixed(5)}&lon=${lng.toFixed(5)}&limit=1`); return c.json({ item: it[0] ? { ...it[0], lat, lng } : { label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, sub: "", address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng } }); }
  catch { return err(c, "No pude obtener la dirección de ese punto", 502); }
});

// ---- Lugares guardados (Casa, Trabajo…) y recientes de cada usuario
app.use("/api/places", auth as never);
app.use("/api/places/*", auth as never);
app.get("/api/places", async (c) => {
  const u = c.get("user");
  const saved = (await c.env.DB.prepare("SELECT id,label,address,lat,lng FROM saved_places WHERE user_id=? ORDER BY created_at").bind(u.id).all()).results;
  const recentSql = u.role === "admin"
    ? `SELECT address,lat,lng FROM (SELECT pickup address,pickup_lat lat,pickup_lng lng,created_at FROM trips UNION ALL SELECT dropoff,dropoff_lat,dropoff_lng,created_at FROM trips) GROUP BY address ORDER BY COUNT(*) DESC, MAX(created_at) DESC LIMIT 8`
    : `SELECT address,lat,lng FROM (SELECT pickup address,pickup_lat lat,pickup_lng lng,created_at FROM trips WHERE client_id=?1 UNION ALL SELECT dropoff,dropoff_lat,dropoff_lng,created_at FROM trips WHERE client_id=?1
        UNION ALL SELECT pickup,pickup_lat,pickup_lng,created_at FROM trip_requests WHERE client_id=?1 UNION ALL SELECT dropoff,dropoff_lat,dropoff_lng,created_at FROM trip_requests WHERE client_id=?1) GROUP BY address ORDER BY MAX(created_at) DESC LIMIT 6`;
  const st = c.env.DB.prepare(recentSql);
  const recent = (await (u.role === "admin" ? st : st.bind(u.id)).all()).results;
  return c.json({ saved, recent });
});
app.post("/api/places", async (c) => {
  const u = c.get("user");
  const b = await c.req.json().catch(() => ({}));
  const label = str(b.label, 30), address = str(b.address, 300);
  if (!label || !address) return err(c, "Indica nombre y dirección");
  const n = await c.env.DB.prepare("SELECT COUNT(*) n FROM saved_places WHERE user_id=?").bind(u.id).first<{ n: number }>();
  if (n!.n >= 12) return err(c, "Máximo 12 lugares guardados");
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO saved_places(id,user_id,label,address,lat,lng,created_at) VALUES(?,?,?,?,?,?,?)").bind(id, u.id, label, address, coord(b.lat, 90), coord(b.lng, 180), now()).run();
  return c.json({ id });
});
app.delete("/api/places/:id", async (c) => {
  await c.env.DB.prepare("DELETE FROM saved_places WHERE id=? AND user_id=?").bind(c.req.param("id"), c.get("user").id).run();
  return c.json({ ok: true });
});

// ---- Tarifa orientativa (la define el admin; el cliente solo la ve si el admin lo activa)
async function getSettings(db: D1Database) {
  const rows = (await db.prepare("SELECT key,value FROM settings").all<{ key: string; value: string }>()).results;
  const m = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { base_eur: Number(m.base_eur ?? 0), per_km_eur: Number(m.per_km_eur ?? 0), min_eur: Number(m.min_eur ?? 0), road_factor: Number(m.road_factor ?? 1.3), show_estimate: m.show_estimate === "1" };
}
app.use("/api/settings", auth as never);
app.get("/api/settings", async (c) => {
  const s = await getSettings(c.env.DB);
  if (c.get("user").role !== "admin" && !s.show_estimate) return c.json({ show_estimate: false, road_factor: s.road_factor });
  return c.json(s);
});
app.put("/api/admin/settings", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const num = (v: unknown, max: number) => { const n = Number(String(v ?? "").replace(",", ".")); return Number.isFinite(n) && n >= 0 && n <= max ? String(Math.round(n * 100) / 100) : "0"; };
  const vals: [string, string][] = [["base_eur", num(b.base_eur, 1000)], ["per_km_eur", num(b.per_km_eur, 100)], ["min_eur", num(b.min_eur, 1000)], ["road_factor", String(Math.min(2, Math.max(1, Number(b.road_factor) || 1.3)))], ["show_estimate", b.show_estimate ? "1" : "0"]];
  await c.env.DB.batch(vals.map(([k, v]) => c.env.DB.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k, v)));
  return c.json(await getSettings(c.env.DB));
});

// ---- Perfil propio (cliente y administrador): datos, preferencias y foto
app.use("/api/profile", auth as never);
app.use("/api/profile/*", auth as never);
app.use("/api/avatar/*", auth as never);
app.use("/api/driver", auth as never);
app.get("/api/profile", async (c) => {
  const p = await c.env.DB.prepare("SELECT id,name,email,phone,role,notify_email,notify_whatsapp,avatar_v,created_at,consent_at FROM users WHERE id=?").bind(c.get("user").id).first();
  return c.json({ profile: p });
});
app.patch("/api/profile", async (c) => {
  const u = c.get("user");
  const b = await c.req.json().catch(() => ({}));
  const cur = await c.env.DB.prepare("SELECT * FROM users WHERE id=?").bind(u.id).first<Record<string, unknown>>();
  const name = str(b.name, 100) || (cur!.name as string);
  const phone = b.phone !== undefined ? str(b.phone, 30) || null : (cur!.phone as string | null);
  let email = cur!.email as string;
  if (b.email !== undefined && str(b.email).toLowerCase() !== email) {
    email = str(b.email).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return err(c, "Correo no válido");
    if (!safeEq(await hashPass(str(b.current, 200), cur!.pass_salt as string), cur!.pass_hash as string)) return err(c, "Para cambiar el correo escribe tu contraseña actual", 403);
    if (await c.env.DB.prepare("SELECT 1 FROM users WHERE email=? AND id<>?").bind(email, u.id).first()) return err(c, "Ese correo ya lo usa otra cuenta", 409);
  }
  const flag = (v: unknown, d: unknown) => (v === undefined ? (d as number) : v ? 1 : 0);
  await c.env.DB.prepare("UPDATE users SET name=?,phone=?,email=?,notify_email=?,notify_whatsapp=? WHERE id=?")
    .bind(name, phone, email, flag(b.notify_email, cur!.notify_email), flag(b.notify_whatsapp, cur!.notify_whatsapp) && phone ? 1 : 0, u.id).run();
  return c.json({ ok: true });
});
app.put("/api/profile/avatar", async (c) => {
  const u = c.get("user");
  const b = await c.req.json().catch(() => ({}));
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(b.data || ""));
  if (!m) return err(c, "Imagen no válida (JPG, PNG o WebP)");
  if (m[2].length > 300_000) return err(c, "La imagen es demasiado grande");
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO avatars(user_id,mime,data,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET mime=excluded.mime,data=excluded.data,updated_at=excluded.updated_at").bind(u.id, m[1], m[2], now()),
    c.env.DB.prepare("UPDATE users SET avatar_v=avatar_v+1 WHERE id=?").bind(u.id),
  ]);
  const v = await c.env.DB.prepare("SELECT avatar_v FROM users WHERE id=?").bind(u.id).first<{ avatar_v: number }>();
  return c.json({ avatar_v: v!.avatar_v });
});
app.delete("/api/profile/avatar", async (c) => {
  const u = c.get("user");
  await c.env.DB.batch([c.env.DB.prepare("DELETE FROM avatars WHERE user_id=?").bind(u.id), c.env.DB.prepare("UPDATE users SET avatar_v=0 WHERE id=?").bind(u.id)]);
  return c.json({ avatar_v: 0 });
});
// Fotos: cada uno ve la suya; el admin ve todas; los clientes ven la del admin (su conductor)
app.get("/api/avatar/:id", async (c) => {
  const u = c.get("user"), id = c.req.param("id");
  if (u.role !== "admin" && u.id !== id) {
    const t = await c.env.DB.prepare("SELECT role FROM users WHERE id=?").bind(id).first<{ role: string }>();
    if (t?.role !== "admin") return err(c, "No disponible", 404);
  }
  const a = await c.env.DB.prepare("SELECT mime,data FROM avatars WHERE user_id=?").bind(id).first<{ mime: string; data: string }>();
  if (!a) return err(c, "Sin foto", 404);
  const bin = Uint8Array.from(atob(a.data), (ch) => ch.charCodeAt(0));
  return new Response(bin, { headers: { "Content-Type": a.mime, "Cache-Control": "private, max-age=604800", "X-Content-Type-Options": "nosniff" } });
});

// ---- Perfil del negocio (lo edita el admin; los clientes ven conductor, vehículo y cómo pagar)
const BIZ_KEYS = ["biz_name", "biz_phone", "vehicle", "plate", "bizum", "iban", "pay_note"] as const;
async function getBusiness(db: D1Database) {
  const rows = (await db.prepare(`SELECT key,value FROM settings WHERE key IN (${BIZ_KEYS.map(() => "?").join(",")})`).bind(...BIZ_KEYS).all<{ key: string; value: string }>()).results;
  const m = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(BIZ_KEYS.map((k) => [k, m[k] || ""])) as Record<(typeof BIZ_KEYS)[number], string>;
}
app.get("/api/driver", async (c) => {
  const a = await c.env.DB.prepare("SELECT id,name,phone,avatar_v FROM users WHERE role='admin' AND active=1 ORDER BY created_at LIMIT 1").first<{ id: string; name: string; phone: string | null; avatar_v: number }>();
  const biz = await getBusiness(c.env.DB);
  return c.json({ driver: a ? { id: a.id, name: a.name, avatar_v: a.avatar_v, phone: biz.biz_phone || a.phone || "" } : null, business: biz });
});
app.put("/api/admin/business", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const lim: Record<string, number> = { biz_name: 80, biz_phone: 30, vehicle: 80, plate: 15, bizum: 30, iban: 40, pay_note: 300 };
  await c.env.DB.batch(BIZ_KEYS.map((k) => c.env.DB.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k, str(b[k], lim[k]))));
  return c.json(await getBusiness(c.env.DB));
});

// ---- RGPD del cliente: descargar sus datos y pedir la baja
app.get("/api/client/export", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  const q = (sql: string) => c.env.DB.prepare(sql).bind(u.id).all().then((r) => r.results);
  const data = {
    generado: now(),
    perfil: await c.env.DB.prepare("SELECT name,email,phone,notify_email,notify_whatsapp,created_at,consent_at FROM users WHERE id=?").bind(u.id).first(),
    carreras: await q("SELECT trip_date,trip_time,pickup,dropoff,amount_cents,notes FROM trips WHERE client_id=? ORDER BY trip_date"),
    pagos: await q("SELECT pay_date,amount_cents,method,note FROM payments WHERE client_id=? ORDER BY pay_date"),
    solicitudes: await q("SELECT req_date,req_time,pickup,dropoff,note,status,created_at FROM trip_requests WHERE client_id=? ORDER BY created_at"),
    lugares_guardados: await q("SELECT label,address FROM saved_places WHERE user_id=?"),
    avisos: await q("SELECT title,body,created_at FROM notifications WHERE user_id=? ORDER BY created_at"),
  };
  return new Response(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="mis-datos-carreras.json"' } });
});
app.post("/api/client/delete-request", async (c) => {
  const u = c.get("user");
  if (u.role !== "client") return err(c, "Solo clientes", 403);
  const t = await clientTotals(c.env.DB, u.id);
  for (const a of await admins(c.env.DB))
    await notify(c.env, c.executionCtx, a, "Solicitud de baja", `${u.name} (${u.email}) pide eliminar su cuenta.${t.pending_cents > 0 ? " Tiene un saldo pendiente de " + eur(t.pending_cents) + "." : ""}`);
  return c.json({ ok: true });
});

// ---- Admin: próximas carreras (hoy y siguientes)
app.get("/api/admin/upcoming", async (c) => {
  const r = await c.env.DB.prepare(`${TRIP_SQL.replace("FROM trips t", ", u.name client_name, u.avatar_v client_avatar_v FROM trips t JOIN users u ON u.id=t.client_id")} WHERE t.trip_date >= ? ORDER BY t.trip_date, t.trip_time LIMIT 10`).bind(today()).all<Record<string, number>>();
  return c.json({ items: r.results.map((t) => ({ ...t, pending_cents: t.amount_cents - t.paid_cents })) });
});

// ---- Admin: lugares frecuentes (autocompletar)
app.get("/api/admin/places", async (c) => {
  const r = await c.env.DB.prepare(
    `SELECT place, COUNT(*) n FROM (SELECT pickup place FROM trips UNION ALL SELECT dropoff FROM trips) GROUP BY place ORDER BY n DESC LIMIT 40`
  ).all<{ place: string }>();
  return c.json({ items: r.results.map((x) => x.place) });
});

// ---- Admin: informe mensual por cliente
app.get("/api/admin/report", async (c) => {
  const month = str(c.req.query("month"), 7) || today().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(month)) return err(c, "Mes inválido");
  const r = await c.env.DB.prepare(
    `SELECT u.id,u.name,u.avatar_v,
       (SELECT COUNT(*) FROM trips WHERE client_id=u.id AND trip_date LIKE ?1||'%') trips,
       COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id AND trip_date LIKE ?1||'%'),0) charged_cents,
       COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id AND pay_date LIKE ?1||'%'),0) collected_cents,
       COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id),0) - COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id),0) pending_cents
     FROM users u WHERE u.role='client' ORDER BY charged_cents DESC, u.name`
  ).bind(month).all<{ trips: number; charged_cents: number; collected_cents: number; pending_cents: number }>();
  const rows = r.results.filter((x) => x.trips || x.collected_cents || x.pending_cents);
  const sum = (k: "trips" | "charged_cents" | "collected_cents" | "pending_cents") => rows.reduce((a, x) => a + x[k], 0);
  return c.json({ month, rows, totals: { trips: sum("trips"), charged_cents: sum("charged_cents"), collected_cents: sum("collected_cents"), pending_cents: sum("pending_cents") } });
});

app.all("/api/*", (c) => err(c, "No encontrado", 404));
// ---- Archivos de la app (embebidos en el Worker); cualquier otra ruta devuelve la app
app.get("*", (c) => {
  const f = FILES[c.req.path] || FILES["/index.html"];
  const html = f.type.startsWith("text/html");
  return new Response(f.body, { headers: {
    "Content-Type": f.type,
    "Cache-Control": html ? "no-cache" : "public, max-age=300",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    ...(html ? { "Content-Security-Policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self'; img-src 'self' data: blob: https://tile.openstreetmap.org; connect-src 'self'; frame-ancestors 'none'", "X-Frame-Options": "DENY" } : {}),
  } });
});

app.onError((e, c) => { console.error(e); return c.json({ error: "Error del servidor" }, 500); });

// ---- Recordatorio automático: cada lunes, a quien tenga carreras sin pagar de hace más de REMINDER_DAYS días
async function weeklyReminders(env: Env, ctx: Ctx) {
  const days = Number(env.REMINDER_DAYS || 7);
  const limitDate = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const lastOk = new Date(Date.now() - 6 * 864e5).toISOString();
  const rows = (await env.DB.prepare(
    `SELECT u.id,u.name,u.email,u.phone,u.notify_email,u.notify_whatsapp,
       COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id),0) - COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id),0) pending_cents
     FROM users u
     WHERE u.role='client' AND u.active=1 AND (u.last_reminder_at IS NULL OR u.last_reminder_at < ?2)
       AND EXISTS (SELECT 1 FROM trips t WHERE t.client_id=u.id AND t.trip_date <= ?1
                   AND t.amount_cents > COALESCE((SELECT SUM(a.amount_cents) FROM allocations a WHERE a.trip_id=t.id),0))`
  ).bind(limitDate, lastOk).all<Target & { pending_cents: number }>()).results;
  for (const r of rows) {
    if (r.pending_cents <= 0) continue;
    await notify(env, ctx, r, "Recordatorio de saldo pendiente", `Tienes un saldo pendiente de ${eur(r.pending_cents)}. Puedes ver el detalle de cada carrera en tu cuenta.`);
    await env.DB.prepare("UPDATE users SET last_reminder_at=? WHERE id=?").bind(now(), r.id).run();
  }
  await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE expires_at<?").bind(now()),
    env.DB.prepare("DELETE FROM invites WHERE expires_at<?").bind(now()),
    env.DB.prepare("DELETE FROM login_attempts WHERE at<?").bind(new Date(Date.now() - 864e5).toISOString()),
  ]);
  return rows.length;
}

export default {
  fetch: app.fetch,
  scheduled: (_e: ScheduledController, env: Env, ctx: ExecutionContext) => ctx.waitUntil(weeklyReminders(env, ctx)),
};
