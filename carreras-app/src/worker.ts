import { Hono, type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

type Env = {
  DB: D1Database;
  ASSETS: Fetcher;
  SETUP_TOKEN?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  WHATSAPP_TOKEN?: string;
  WHATSAPP_PHONE_ID?: string;
  WHATSAPP_TEMPLATE?: string;
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
  return c.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role }, unread: n!.n });
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
async function notify(c: C, target: { id: string; name: string; email: string; phone: string | null; notify_email: number; notify_whatsapp: number }, title: string, body: string) {
  await c.env.DB.prepare("INSERT INTO notifications(id,user_id,title,body,created_at) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(), target.id, title, body, now()).run();
  const e = c.env;
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
  if (jobs.length) c.executionCtx.waitUntil(Promise.all(jobs));
}

app.get("/api/notifications", async (c) => {
  const r = await c.env.DB.prepare("SELECT id,title,body,read,created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(c.get("user").id).all();
  return c.json({ items: r.results });
});
app.post("/api/notifications/read", async (c) => {
  await c.env.DB.prepare("UPDATE notifications SET read=1 WHERE user_id=?").bind(c.get("user").id).run();
  return c.json({ ok: true });
});

// ---- Consultas compartidas
const TRIP_SQL = `SELECT t.id,t.client_id,t.trip_date,t.pickup,t.dropoff,t.amount_cents,t.notes,
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
  const rows = (await db.prepare(`${TRIP_SQL} ${where} ORDER BY t.trip_date DESC, t.created_at DESC LIMIT 1000`).bind(...(clientId ? [clientId] : [])).all<Record<string, number | string>>()).results;
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
  return c.json({ ...(await clientTotals(c.env.DB, u.id)) });
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
  const [tot, m, top] = await Promise.all([
    db.prepare(`SELECT COALESCE((SELECT SUM(amount_cents) FROM trips),0) - COALESCE((SELECT SUM(amount_cents) FROM payments),0) pending`).first<{ pending: number }>(),
    db.prepare(`SELECT COALESCE((SELECT SUM(amount_cents) FROM trips WHERE trip_date LIKE ?1||'%'),0) charged,
                       COALESCE((SELECT COUNT(*) FROM trips WHERE trip_date LIKE ?1||'%'),0) trips,
                       COALESCE((SELECT SUM(amount_cents) FROM payments WHERE pay_date LIKE ?1||'%'),0) collected`).bind(month).first<{ charged: number; trips: number; collected: number }>(),
    db.prepare(`SELECT u.id,u.name,
        COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id),0) - COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id),0) pending_cents,
        (SELECT MIN(t.trip_date) FROM trips t WHERE t.client_id=u.id AND t.amount_cents > COALESCE((SELECT SUM(a.amount_cents) FROM allocations a WHERE a.trip_id=t.id),0)) oldest_unpaid
        FROM users u WHERE u.role='client' ORDER BY pending_cents DESC LIMIT 5`).all(),
  ]);
  return c.json({ pending_cents: tot!.pending, month_charged_cents: m!.charged, month_trips: m!.trips, month_collected_cents: m!.collected, top_debtors: top.results.filter((r) => (r.pending_cents as number) > 0) });
});

// ---- Admin: clientes
app.get("/api/admin/clients", async (c) => {
  const r = await c.env.DB.prepare(
    `SELECT u.id,u.name,u.email,u.phone,u.active,u.notify_email,u.notify_whatsapp,
       COALESCE((SELECT SUM(amount_cents) FROM trips WHERE client_id=u.id),0) charged_cents,
       COALESCE((SELECT SUM(amount_cents) FROM payments WHERE client_id=u.id),0) paid_cents
     FROM users u WHERE u.role='client' ORDER BY u.name`
  ).all<Record<string, number | string>>();
  return c.json({ items: r.results.map((x) => ({ ...x, pending_cents: (x.charged_cents as number) - (x.paid_cents as number) })) });
});
app.post("/api/admin/clients", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const name = str(b.name, 100), email = str(b.email).toLowerCase(), pass = str(b.password, 200), phone = str(b.phone, 30) || null;
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || pass.length < 8) return err(c, "Nombre, correo válido y contraseña de al menos 8 caracteres");
  if (await c.env.DB.prepare("SELECT 1 FROM users WHERE email=?").bind(email).first()) return err(c, "Ese correo ya existe", 409);
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO users(id,email,name,phone,role,pass_hash,pass_salt,notify_email,notify_whatsapp,consent_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id, email, name, phone, "client", await hashPass(pass, salt), salt, b.notify_email === false ? 0 : 1, b.notify_whatsapp && phone ? 1 : 0, b.consent ? now() : null, now()).run();
  return c.json({ id });
});
app.patch("/api/admin/clients/:id", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const id = c.req.param("id");
  const cur = await c.env.DB.prepare("SELECT * FROM users WHERE id=? AND role='client'").bind(id).first<Record<string, unknown>>();
  if (!cur) return err(c, "Cliente no encontrado", 404);
  const name = str(b.name, 100) || (cur.name as string);
  const phone = b.phone !== undefined ? str(b.phone, 30) || null : (cur.phone as string | null);
  const flag = (v: unknown, d: unknown) => (v === undefined ? (d as number) : v ? 1 : 0);
  await c.env.DB.prepare("UPDATE users SET name=?,phone=?,active=?,notify_email=?,notify_whatsapp=? WHERE id=?")
    .bind(name, phone, flag(b.active, cur.active), flag(b.notify_email, cur.notify_email), flag(b.notify_whatsapp, cur.notify_whatsapp), id).run();
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
    c.env.DB.prepare("UPDATE users SET pass_hash=?,pass_salt=? WHERE id=? AND role='client'").bind(await hashPass(pass, salt), salt, id),
    c.env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(id),
  ]);
  return c.json({ ok: true });
});
app.get("/api/admin/clients/:id", async (c) => {
  const id = c.req.param("id");
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,active,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client'").bind(id).first();
  if (!cl) return err(c, "Cliente no encontrado", 404);
  return c.json({ client: cl, totals: await clientTotals(c.env.DB, id), trips: await listTrips(c.env.DB, id, "all"), payments: await listPayments(c.env.DB, id) });
});
app.post("/api/admin/clients/:id/reminder", async (c) => {
  const id = c.req.param("id");
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client' AND active=1").bind(id).first<Parameters<typeof notify>[1]>();
  if (!cl) return err(c, "Cliente no encontrado", 404);
  const t = await clientTotals(c.env.DB, id);
  if (t.pending_cents <= 0) return err(c, "Este cliente no tiene saldo pendiente");
  await notify(c, cl, "Recordatorio de saldo pendiente", `Tienes un saldo pendiente de ${eur(t.pending_cents)}.`);
  return c.json({ ok: true });
});

// ---- Admin: carreras
app.get("/api/admin/trips", async (c) => c.json({ items: await listTrips(c.env.DB, null, c.req.query("status") || "all") }));
function tripFields(b: Record<string, unknown>) {
  const trip_date = str(b.trip_date, 10) || today(), pickup = str(b.pickup), dropoff = str(b.dropoff), amount = cents(b.amount), notes = str(b.notes, 500) || null;
  if (!isDate(trip_date) || !pickup || !dropoff || !(amount > 0)) return null;
  return { trip_date, pickup, dropoff, amount, notes };
}
app.post("/api/admin/trips", async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const f = tripFields(b);
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client' AND active=1").bind(str(b.client_id, 60)).first<Parameters<typeof notify>[1]>();
  if (!f || !cl) return err(c, "Revisa cliente, fecha, lugares e importe");
  const id = crypto.randomUUID();
  await c.env.DB.prepare("INSERT INTO trips(id,client_id,trip_date,pickup,dropoff,amount_cents,notes,created_at) VALUES(?,?,?,?,?,?,?,?)")
    .bind(id, cl.id, f.trip_date, f.pickup, f.dropoff, f.amount, f.notes, now()).run();
  if (b.notify !== false) {
    const t = await clientTotals(c.env.DB, cl.id);
    await notify(c, cl, "Nueva carrera registrada", `${f.trip_date}: de ${f.pickup} a ${f.dropoff} por ${eur(f.amount)}. Saldo pendiente: ${eur(t.pending_cents)}.`);
  }
  return c.json({ id });
});
app.patch("/api/admin/trips/:id", async (c) => {
  const f = tripFields(await c.req.json().catch(() => ({})));
  if (!f) return err(c, "Datos inválidos");
  const id = c.req.param("id");
  const paid = await c.env.DB.prepare("SELECT COALESCE(SUM(amount_cents),0) p FROM allocations WHERE trip_id=?").bind(id).first<{ p: number }>();
  if (f.amount < paid!.p) return err(c, "El importe no puede ser menor a lo ya pagado de esta carrera");
  await c.env.DB.prepare("UPDATE trips SET trip_date=?,pickup=?,dropoff=?,amount_cents=?,notes=? WHERE id=?").bind(f.trip_date, f.pickup, f.dropoff, f.amount, f.notes, id).run();
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
  const cl = await c.env.DB.prepare("SELECT id,name,email,phone,notify_email,notify_whatsapp FROM users WHERE id=? AND role='client' AND active=1").bind(str(b.client_id, 60)).first<Parameters<typeof notify>[1]>();
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
    await notify(c, cl, "Pago recibido", `Hemos registrado tu pago de ${eur(amount)} (${method}) del ${pay_date}. Saldo pendiente: ${eur(t.pending_cents)}.`);
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

app.all("/api/*", (c) => err(c, "No encontrado", 404));
app.onError((e, c) => { console.error(e); return c.json({ error: "Error del servidor" }, 500); });

export default app;
