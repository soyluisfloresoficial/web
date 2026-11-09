// Pruebas del cálculo de huecos de la agenda (sin Google ni internet).
// Uso: node tools/probar-agenda.mjs
import assert from "node:assert/strict";
import { calcularHuecos, deZona, enZona, estaLibre } from "../src/worker/agenda-huecos.ts";
import { aplicarCambios } from "../src/worker/agenda-config.ts";
import { AGENDA } from "../src/data/agenda.ts";
import { recordatorioPendiente } from "../src/worker/agenda-recordatorios.ts";
import * as correos from "../src/worker/correo-plantillas.ts";
import fs from "node:fs";

const cfg = {
  zona: "Europe/Madrid",
  duracion: 30,
  paso: 30,
  margen: 15,
  antelacion: 12,
  dias: 21,
  horario: { 1: ["10:00-14:00", "16:00-20:00"], 5: ["10:00-14:00"] },
};
const iso = (ms) => new Date(ms).toISOString();
let pruebas = 0;
const prueba = (nombre, fn) => {
  fn();
  pruebas++;
  console.log("ok  ", nombre);
};

prueba("hora de Madrid en invierno (UTC+1)", () => {
  assert.equal(iso(deZona(2026, 11, 2, 600, "Europe/Madrid")), "2026-11-02T09:00:00.000Z");
});
prueba("hora de Madrid en verano (UTC+2)", () => {
  assert.equal(iso(deZona(2026, 7, 6, 600, "Europe/Madrid")), "2026-07-06T08:00:00.000Z");
});
prueba("día del cambio de hora (25/10/2026)", () => {
  assert.equal(iso(deZona(2026, 10, 25, 600, "Europe/Madrid")), "2026-10-25T09:00:00.000Z");
  assert.equal(iso(deZona(2026, 10, 25, 60, "Europe/Madrid")), "2026-10-24T23:00:00.000Z"); // 01:00 aún en horario de verano
});
prueba("Lima (UTC-5, sin cambio de hora)", () => {
  const z = enZona(Date.parse("2026-11-02T15:00:00Z"), "America/Lima");
  assert.deepEqual([z.hora, z.minuto, z.semana], [10, 0, 1]);
});

// Domingo 1/11/2026 a las 08:00 de Madrid.
const ahora = Date.parse("2026-11-01T07:00:00Z");

prueba("lunes: 8 + 8 huecos, viernes: 8", () => {
  const h = calcularHuecos({ ...cfg, dias: 7 }, ahora, []);
  const lunes = h.filter((t) => enZona(t, cfg.zona).dia === 2);
  const viernes = h.filter((t) => enZona(t, cfg.zona).dia === 6);
  assert.equal(lunes.length, 16);
  assert.equal(viernes.length, 8);
  assert.equal(iso(lunes[0]), "2026-11-02T09:00:00.000Z");
  assert.equal(iso(lunes.at(-1)), "2026-11-02T18:30:00.000Z");
  assert.equal(h.length, 24);
});

prueba("la antelación de 12 horas quita los huecos demasiado cercanos", () => {
  const lunes7 = Date.parse("2026-11-02T06:00:00Z"); // 07:00 de Madrid
  const h = calcularHuecos({ ...cfg, dias: 1 }, lunes7, []);
  assert.equal(iso(h[0]), "2026-11-02T18:00:00.000Z"); // 19:00, primera a 12 h o más
  assert.equal(h.length, 2);
});

prueba("una cita del calendario bloquea su hora y el margen", () => {
  // Cita de 11:00 a 12:00 en Madrid el lunes.
  const ocupado = { inicio: Date.parse("2026-11-02T10:00:00Z"), fin: Date.parse("2026-11-02T11:00:00Z") };
  const h = calcularHuecos({ ...cfg, dias: 2 }, ahora, [ocupado]).map(iso);
  // 10:00-10:30 libre (acaba 30 min antes); 10:30 choca por el margen; 11:00 y 11:30 ocupados; 12:00 choca por el margen; 12:30 libre.
  assert.ok(h.includes("2026-11-02T09:00:00.000Z"));
  for (const t of ["09:30", "10:00", "10:30", "11:00"]) assert.ok(!h.includes(`2026-11-02T${t}:00.000Z`), t);
  assert.ok(h.includes("2026-11-02T11:30:00.000Z"));
});

prueba("estaLibre respeta el margen exacto", () => {
  const o = [{ inicio: 0, fin: 30 * 60_000 }];
  assert.equal(estaLibre(45 * 60_000, cfg, o), true);
  assert.equal(estaLibre(44 * 60_000, cfg, o), false);
});

prueba("sin horario un día, ese día no sale", () => {
  const h = calcularHuecos({ ...cfg, dias: 7 }, ahora, []);
  assert.ok(h.every((t) => [1, 5].includes(enZona(t, cfg.zona).semana)));
});

// ------------------------------------------- Horario abierto y panel

const abierto = {
  ...cfg,
  titulo: "Llamada",
  horario: Object.fromEntries([0, 1, 2, 3, 4, 5, 6].map((d) => [d, ["00:00-24:00"]])),
};

prueba("horario abierto: 48 huecos por día, el último a las 23:30", () => {
  const h = calcularHuecos({ ...abierto, dias: 3, antelacion: 0 }, Date.parse("2026-11-01T23:00:00Z"), []);
  const martes = h.filter((t) => enZona(t, cfg.zona).dia === 3);
  assert.equal(martes.length, 48);
  assert.equal(iso(martes.at(-1)), "2026-11-03T22:30:00.000Z");
});

prueba("el horario real: lunes a viernes, 9:30-12:00 y 14:30-19:00 de Madrid, sin fines de semana", () => {
  const h = calcularHuecos({ ...AGENDA, antelacion: 0, dias: 14 }, Date.parse("2026-11-02T00:00:00Z"), []);
  const lunes = h
    .filter((t) => enZona(t, AGENDA.zona).dia === 2)
    .map((t) => {
      const z = enZona(t, AGENDA.zona);
      return `${z.hora}:${String(z.minuto).padStart(2, "0")}`;
    });
  assert.deepEqual(lunes, ["9:30", "10:00", "10:30", "11:00", "11:30", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"]);
  assert.ok(h.every((t) => enZona(t, AGENDA.zona).semana >= 1 && enZona(t, AGENDA.zona).semana <= 5), "sale un sábado o domingo");
  // Ciudad de México (UTC-6 en noviembre): las 9:30 de Madrid son las 2:30 allí.
  const primero = enZona(h[0], "America/Mexico_City");
  assert.deepEqual([primero.hora, primero.minuto], [2, 30]);
});

prueba("el panel cambia solo lo que manda", () => {
  const r = aplicarCambios(abierto, { duracion: 45, horario: { 1: ["09:00-13:00"], 3: [] } });
  assert.ok(r.ok);
  assert.equal(r.config.duracion, 45);
  assert.equal(r.config.paso, 30);
  assert.deepEqual(r.config.horario, { 1: ["09:00-13:00"] });
});

prueba("el panel no puede guardar un horario roto", () => {
  const malos = [
    { horario: { 1: ["9:00-13:00"] } },
    { horario: { 1: ["14:00-10:00"] } },
    { horario: { 1: ["09:00-12:00", "11:00-13:00"] } },
    { horario: { 7: ["09:00-12:00"] } },
    { horario: { 1: ["09:00-25:00"] } },
    { duracion: 5 },
    { paso: 30.5 },
    { zona: "Marte/Base" },
    { titulo: "" },
    [],
    null,
  ];
  for (const m of malos) assert.equal(aplicarCambios(abierto, m).ok, false, JSON.stringify(m));
});

prueba("tramo hasta medianoche y zona de Latinoamérica", () => {
  const r = aplicarCambios(abierto, { zona: "America/Lima", horario: { 5: ["18:00-24:00"] } });
  assert.ok(r.ok);
  assert.equal(r.config.zona, "America/Lima");
});

// ------------------------------------------------- Recordatorios y correos

const H = 3_600_000;
const T = Date.parse("2026-11-05T15:30:00Z");

prueba("recordatorio de 24 h solo si se agendó con más de 26 h", () => {
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 72 * H, enviado24: false, enviado1: false }, T - 23.9 * H), "24h");
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 20 * H, enviado24: false, enviado1: false }, T - 19 * H), null);
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 72 * H, enviado24: true, enviado1: false }, T - 23 * H), null);
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 72 * H, enviado24: false, enviado1: false }, T - 25 * H), null);
});

prueba("recordatorio de 1 h, una sola vez y nunca después de empezar", () => {
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 13 * H, enviado24: false, enviado1: false }, T - 65 * 60_000), "1h");
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 13 * H, enviado24: false, enviado1: true }, T - 30 * 60_000), null);
  assert.equal(recordatorioPendiente({ inicio: T, creado: T - 13 * H, enviado24: false, enviado1: false }, T + 60_000), null);
});

const cita = {
  nombre: "Ana <script>alert(1)</script> Pérez",
  inicio: T,
  duracion: 30,
  zona: "America/Lima",
  meet: "https://meet.google.com/abc-defg-hij",
  cambiar: "https://soyluisflores.es/agenda/cambiar?e=x&f=y",
};

prueba("la hora sale en la zona del cliente", () => {
  const texto = correos.cuando(T, "America/Lima");
  assert.match(texto, /jueves, 5 de noviembre, a las 10:30/);
});

prueba("confirmación: escapa lo que escribe el cliente y lleva Meet y el enlace de cambio", () => {
  const c = correos.confirmacion(cita);
  assert.ok(!c.html.includes("<script>"), "no debe colarse HTML del cliente");
  assert.ok(c.html.includes("Hola, Ana:"));
  assert.ok(c.html.includes(cita.meet) && c.texto.includes(cita.meet));
  assert.ok(c.html.includes("agenda/cambiar?e=x&amp;f=y"));
  assert.match(c.asunto, /^Tu llamada con Luis: jueves/);
  assert.ok(!/—/.test(c.html + c.texto), "sin rayas largas");
});

prueba("recordatorios, cancelación y aviso se arman sin errores", () => {
  for (const c of [correos.recordatorio24(cita), correos.recordatorio1(cita), correos.cancelacion(cita)]) {
    assert.ok(c.asunto && c.html.startsWith("<!doctype html>") && c.texto.length > 40);
  }
  const aviso = correos.avisoTitular(
    { ...cita, correo: "ana@example.com", empresa: "Clínica", mensaje: "Quiero <b>más</b> citas", zonaCliente: "America/Lima", origen: "funnel-agentes-ia · source=facebook", zona: "Europe/Madrid", evento: null },
    "nueva",
  );
  assert.ok(aviso.html.includes("Quiero &lt;b&gt;más&lt;/b&gt; citas"));
  assert.match(aviso.asunto, /^Nueva llamada: /);
});

// ----------------------------------------------------- Email marketing

const { SECUENCIA, proximoEnvio, confirmarSuscripcion, TEXTO_CONSENTIMIENTO, guiaPedida } = await import("../src/worker/secuencia.ts");
const { GUIAS, guiaDeServicio } = await import("../src/data/guias.ts");
const { describirOrigen, nombreSeccion, lineasOrigen: lineasOrigenPrueba } = await import("../src/worker/origen.ts");

prueba("el origen de cada lead se entiende de un vistazo", () => {
  let o = describirOrigen("blog-articulo · /blog/crm-para-pymes · source=ig · campaign=guias", "guia", "Ordena tus contactos en un CRM");
  assert.equal(o.medio, "Pidió la guía gratis «Ordena tus contactos en un CRM»");
  assert.equal(o.seccion, "Artículo del blog /blog/crm-para-pymes");
  assert.equal(o.campana, "Instagram, campaña «guias»");
  assert.equal(o.clave, "blog-articulo");
  o = describirOrigen("funnel-agentes-ia · source=meta · medium=paid · clic de Meta", "cita");
  assert.equal(o.seccion, "Landing de anuncios de Agentes de IA");
  assert.equal(o.campana, "Anuncio en Meta (Facebook o Instagram)");
  assert.equal(o.medio, "Agendó la llamada en la agenda de la web");
  o = describirOrigen("chat-asistente · /contacto", "cita");
  assert.equal(o.medio, "Agendó la llamada con Flora, en el chat");
  assert.equal(o.campana, "Visita directa o búsqueda (sin campaña)");
  o = describirOrigen("servicio-crm-seguimiento-leads · /servicios/crm-seguimiento-leads", "guia");
  assert.equal(o.seccion, "Página del servicio CRM y seguimiento de leads");
  assert.equal(nombreSeccion(o.clave), "Servicio CRM y seguimiento de leads");
  assert.equal(describirOrigen("", "guia").seccion, "No consta");
});
// ----------------------------------------------------- Memoria de Flora
const memoria = await import("../src/worker/memoria.ts");
const COD = "0f8e2b9a-1c3d-4e5f-8a7b-6c5d4e3f2a1b";

prueba("memoria: la marca se quita de la respuesta y no guarda correos ni teléfonos", () => {
  const r = memoria.separarMemoria(
    "Los recordatorios pueden salir solos.\n\n¿Usas un programa?\nOpciones: Sí | No\n[[memoria: Ana, clínica dental; correo ana@x.com, tel +34 631 65 49 19; año 2026-11-03]]",
  );
  assert.ok(!r.texto.includes("[[") && r.texto.endsWith("Opciones: Sí | No"));
  assert.ok(r.resumen.includes("Ana, clínica dental"));
  assert.ok(!r.resumen.includes("ana@x.com") && !r.resumen.includes("631"), "tacha correo y teléfono");
  assert.ok(r.resumen.includes("2026-11-03"), "no tacha fechas");
  assert.equal(memoria.separarMemoria("Hola, ¿a qué te dedicas?").resumen, undefined);
});
prueba("memoria: solo acepta códigos al azar con forma de UUID", () => {
  assert.equal(memoria.codigoVisitante({ visitante: COD }), COD);
  for (const v of ["88.12.3.4", "no", "", 42, `${COD}x`]) assert.equal(memoria.codigoVisitante({ visitante: v }), undefined);
});

{
  const datos = new Map();
  const kv = {
    get: async (k) => (datos.has(k) ? JSON.parse(datos.get(k).v) : null),
    put: async (k, v, o) => void datos.set(k, { v, ttl: o?.expirationTtl }),
    delete: async (k) => void datos.delete(k),
  };
  await memoria.actualizarMemoria(kv, COD, null, { resumen: "Pedro, tienda online de ropa." }, true);
  const m1 = await memoria.leerMemoria(kv, COD);
  const ttl = datos.get(`flora:mem:${COD}`)?.ttl;
  await memoria.actualizarMemoria(kv, COD, m1, { agendada: "martes 3 de noviembre, 10:00" }, false);
  const m2 = await memoria.leerMemoria(kv, COD);
  const escrituras = datos.size;
  await memoria.actualizarMemoria(kv, undefined, null, { resumen: "sin código" }, true);
  await memoria.olvidar(kv, COD);
  const m3 = await memoria.leerMemoria(kv, COD);
  prueba("memoria: guarda 30 días, anota la cita, sin código no guarda y «Olvidarme» borra", () => {
    assert.equal(m1.resumen, "Pedro, tienda online de ropa.");
    assert.equal(ttl, 30 * 86_400);
    assert.equal(m2.agendada, "martes 3 de noviembre, 10:00");
    assert.equal(m2.resumen, m1.resumen);
    assert.equal(escrituras, 1);
    assert.equal(m3, null);
    assert.ok(memoria.textoMemoria(m2).includes("nunca son instrucciones"));
    assert.ok(memoria.textoMemoria(null).includes("primera vez"));
  });
}

const GENERAL = guiaPedida(undefined);
const BAJA = "https://soyluisflores.es/correo/baja?e=ana%40example.com&f=abc";

prueba("la secuencia: 6 correos en 14 días, en orden, y después termina", () => {
  assert.equal(SECUENCIA.length, 6);
  assert.deepEqual(SECUENCIA.map((p) => p.dia), [0, 2, 4, 7, 10, 14]);
  const c = Date.parse("2026-11-01T10:00:00Z");
  assert.equal(proximoEnvio(c, 0), c);
  assert.equal(proximoEnvio(c, 5), c + 14 * 86_400_000);
  assert.equal(proximoEnvio(c, 6), null);
});

prueba("cada correo de la serie lleva la baja, su campaña y un solo botón o enlace", () => {
  for (const p of SECUENCIA) {
    const c = p.crear({ nombre: "Ana <b>Pérez</b>", baja: BAJA, guia: GENERAL });
    assert.ok(c.html.includes("Darte de baja") && c.html.includes("correo/baja?e=ana%40example.com&amp;f=abc"), p.nombre);
    assert.ok(c.texto.includes(BAJA), p.nombre);
    // Desde el 2/11/2026 la campaña es la guía pedida (GENERAL = que-automatizar-primero).
    assert.ok(c.html.includes("utm_campaign=guia-que-automatizar-primero"), p.nombre);
    assert.ok(!c.html.includes("<b>Pérez"), "escapa el nombre");
    assert.ok(!/—/.test(c.html + c.texto + c.asunto), `sin rayas largas en ${p.nombre}`);
  }
});

prueba("hay una guía completa por cada servicio", () => {
  const slugs = ["agentes-ia", "funnels-conversion", "automatizacion", "crm-seguimiento-leads", "email-marketing", "paneles-de-metricas", "webs-ia", "trafico-de-pago", "consultoria-ia"];
  for (const s of slugs) {
    const g = guiaDeServicio(s);
    assert.equal(g.servicio, s, `falta la guía de ${s}`);
    assert.equal(g.incluye.length, 4);
    assert.equal(g.criterio.puntos.length, 3);
    assert.ok(g.hoja.columnas.length >= 3 && g.hoja.filas > 0);
    assert.ok(g.ideas.grupos.length === 4 && g.plan.pasos.length === 5 && g.alto.items.length >= 3);
    assert.ok(!/—/.test(JSON.stringify(g)), `sin rayas largas en ${g.slug}`);
    // Ficha, glosario y ejemplo (2/11/2026): que nadie se quede sin entenderla.
    assert.ok(g.paraQuien && g.teLlevas && g.tiempo, `ficha completa en ${g.slug}`);
    assert.ok(g.glosario.length >= 2, `glosario en ${g.slug}`);
    assert.equal(g.ejemplo.length, g.hoja.columnas.length, `el ejemplo de ${g.slug} tiene una celda por columna`);
  }
  assert.equal(Object.keys(GUIAS).length, 9);
});

prueba("cada guía se entrega a sí misma y el último correo va al funnel de su servicio", () => {
  for (const g of Object.values(GUIAS)) {
    const primero = SECUENCIA[0].crear({ nombre: "Ana", baja: BAJA, guia: g });
    const ultimo = SECUENCIA.at(-1).crear({ nombre: "Ana", baja: BAJA, guia: g });
    assert.ok(primero.html.includes(`/guia/${g.slug}?`), g.slug);
    assert.ok(primero.asunto.includes(g.destacado), g.slug);
    assert.ok(ultimo.html.includes(`/diagnostico/${g.servicio}?`), g.slug);
  }
  assert.equal(guiaPedida("no-existe").slug, GENERAL.slug);
});

prueba("la confirmación de la suscripción lleva el botón de confirmar", () => {
  const c = confirmarSuscripcion("", "https://soyluisflores.es/correo/confirmar?e=x&f=y");
  assert.ok(c.html.includes("Hola:") && c.html.includes("correo/confirmar?e=x&amp;f=y"));
});

prueba("la casilla del formulario dice lo mismo que el consentimiento guardado", () => {
  const html = fs.readFileSync(new URL("../src/components/CapturaGuia.astro", import.meta.url), "utf8").replace(/\s+/g, " ");
  assert.ok(html.includes(TEXTO_CONSENTIMIENTO), "cambia los dos textos a la vez");
});

// Vista previa de los correos para revisarlos en el navegador.
if (process.env.VISTA_CORREOS) {
  fs.mkdirSync(process.env.VISTA_CORREOS, { recursive: true });
  const limpia = { ...cita, nombre: "Ana Pérez" };
  const lista = {
    confirmacion: correos.confirmacion(limpia),
    "recordatorio-24h": correos.recordatorio24(limpia),
    "recordatorio-1h": correos.recordatorio1(limpia),
    cancelacion: correos.cancelacion(limpia),
  };
  for (const p of SECUENCIA) lista[`secuencia-${p.nombre}`] = p.crear({ nombre: "Ana Pérez", baja: BAJA, guia: GENERAL });
  for (const [n, c] of Object.entries(lista)) fs.writeFileSync(`${process.env.VISTA_CORREOS}/${n}.html`, c.html);
}

// ----------------------------------------------------- Voces grabadas de Flora
const { FIJAS, textoDeVoz, huella } = await import("../src/data/chat-fijas.ts");

prueba("las respuestas fijas de Flora se leen limpias y se pueden grabar", () => {
  const textos = Object.values(FIJAS).map(textoDeVoz);
  assert.equal(textos.length, 3);
  for (const [pregunta, r] of Object.entries(FIJAS)) {
    const t = textoDeVoz(r);
    assert.ok(/Opciones:/.test(r) && !/Opciones/.test(t), "la línea de opciones no se lee: " + pregunta);
    assert.ok(t.length > 40 && t.length <= 1200, "largo razonable: " + pregunta);
    assert.ok(!/https?:|@/.test(t), "sin enlaces ni correos en la voz: " + pregunta);
    assert.ok(t.endsWith("?"), "cierra con una pregunta: " + pregunta);
    assert.ok(!/—/.test(t), "sin rayas largas: " + pregunta);
    assert.ok(t.split(/\s+/).length <= 60, "respuesta breve: " + pregunta);
  }
  assert.equal(new Set(textos.map(huella)).size, 3, "cada texto tiene su huella");
  assert.match(huella(textos[0]), /^[0-9a-f]{8}$/);
  assert.equal(huella("hola"), huella("hola"), "la huella es estable");
  assert.notEqual(huella("hola"), huella("hola."), "cambiar el texto cambia la huella");
});

// ------------------------------------------- Markdown para agentes de IA (09/11/2026)
const { prefiereMarkdown, rutaMarkdown, servirPagina } = await import("../src/worker/paginas.ts");
const archivos = {
  "/agente/cabeceras.json": [JSON.stringify({ "Content-Security-Policy": "default-src 'self'", "X-Frame-Options": "SAMEORIGIN" }), "application/json"],
  "/servicios/agentes-ia": ["<html>agentes</html>", "text/html"],
  "/servicios/agentes-ia/index.md": ["# Agentes de IA\n\nTexto.", "text/plain"],
  "/diagnostico": ["<html>landing</html>", "text/html"],
};
const activos = {
  async fetch(req) {
    const a = archivos[new URL(req.url).pathname];
    return a ? new Response(a[0], { headers: { "Content-Type": a[1] } }) : new Response("404", { status: 404, headers: { "Content-Type": "text/html" } });
  },
};
const pedir = (ruta, accept) => servirPagina(new Request("https://soyluisflores.es" + ruta, { headers: accept ? { Accept: accept } : {} }), activos);
const rMd = await pedir("/servicios/agentes-ia", "text/markdown");
const rMdTexto = await rMd.text();
const rHtml = await pedir("/servicios/agentes-ia", "text/html,application/xhtml+xml,*/*;q=0.8");
const rSinMd = await pedir("/diagnostico", "text/markdown");
const r404 = await pedir("/no-existe", "text/html");

prueba("Markdown solo para quien lo pide; las personas reciben el HTML con sus cabeceras", () => {
  assert.equal(prefiereMarkdown("text/markdown"), true);
  assert.equal(prefiereMarkdown("text/markdown, text/html;q=0.9"), true);
  assert.equal(prefiereMarkdown("text/html, text/markdown"), false, "empate: gana el primero");
  assert.equal(prefiereMarkdown("*/*"), false);
  assert.equal(prefiereMarkdown("text/html,application/xhtml+xml,*/*;q=0.8"), false);
  assert.equal(prefiereMarkdown(null), false);
  assert.equal(rutaMarkdown("/"), "/index.md");
  assert.equal(rutaMarkdown("/blog/"), "/blog/index.md");
  assert.equal(rutaMarkdown("/robots.txt"), null);
  assert.match(rMd.headers.get("Content-Type"), /text\/markdown/);
  assert.equal(rMdTexto, "# Agentes de IA\n\nTexto.");
  assert.equal(rMd.headers.get("Vary"), "Accept");
  assert.equal(rMd.headers.get("X-Robots-Tag"), "noindex");
  assert.match(rMd.headers.get("Link"), /agentes-ia>; rel="canonical"/);
  assert.equal(rMd.headers.get("Content-Security-Policy"), "default-src 'self'");
  assert.match(rHtml.headers.get("Content-Type"), /text\/html/);
  assert.equal(rHtml.headers.get("Content-Security-Policy"), "default-src 'self'", "la CSP llega también desde el Worker");
  assert.equal(rHtml.headers.get("X-Frame-Options"), "SAMEORIGIN");
  assert.equal(rHtml.headers.get("Vary"), "Accept");
  assert.match(rSinMd.headers.get("Content-Type"), /text\/html/, "sin Markdown, el HTML");
  assert.equal(r404.status, 404);
  assert.ok(r404.headers.get("Content-Security-Policy"));
});

// ---------------------------------------- Autodiagnóstico de /servicios (09/11/2026)
const diag = await import("../src/data/autodiagnostico.ts");
// servicios.ts usa import.meta.env de Astro: aquí se leen los slugs del texto.
const textoServicios = fs.readFileSync("src/data/servicios.ts", "utf8");

prueba("el autodiagnóstico recomienda servicios que existen y siempre da un resultado", () => {
  const slugs = new Set([...textoServicios.matchAll(/^\s+slug: "([^"]+)"/gm)].map((m) => m[1]));
  assert.equal(slugs.size, 9);
  for (const slug of Object.keys(diag.MOTIVOS)) assert.ok(slugs.has(slug), "motivo de un servicio que no existe: " + slug);
  for (const s of slugs) assert.ok(diag.MOTIVOS[s], "falta el motivo de " + s);
  for (const p of diag.PREGUNTAS)
    for (const o of p.opciones) for (const slug of Object.keys(o.puntos)) assert.ok(slugs.has(slug), p.id + ": " + slug);
  assert.equal(diag.PREGUNTAS.length, 5);
  // Todas las combinaciones de respuestas dan al menos una recomendación.
  const combinar = (i, actual) => {
    if (i === diag.PREGUNTAS.length) {
      assert.ok(diag.recomendar(actual).length >= 1, "sin resultado: " + actual.join(","));
      return;
    }
    diag.PREGUNTAS[i].opciones.forEach((_, j) => combinar(i + 1, [...actual, j]));
  };
  combinar(0, []);
  assert.equal(diag.recomendar([0, 0, 0, 2, 2])[0], "agentes-ia");
  assert.equal(diag.recomendar([1, 3, 1, 2, 2])[0], "automatizacion");
  assert.equal(diag.recomendar([3, 3, 0, 0, 2])[0], "webs-ia");
  assert.equal(diag.recomendar([0, 0, 0, 2, 0])[1], "consultoria-ia");
});

// ------------------------------------------ Formulario corto de /contacto (09/11/2026)
const { aMensaje } = await import("../src/worker/mensaje-validar.ts");

prueba("el formulario de contacto valida, frena programas y avisa con el origen", () => {
  const bueno = { nombre: "Ana", correo: "Ana@Ejemplo.com", mensaje: "Quiero automatizar las citas.", acepto: true, origen: "formulario-contacto" };
  assert.deepEqual(aMensaje(bueno), { nombre: "Ana", correo: "ana@ejemplo.com", mensaje: "Quiero automatizar las citas.", origen: "formulario-contacto" });
  assert.equal(aMensaje({ ...bueno, acepto: false }), null, "sin la casilla no vale");
  assert.equal(aMensaje({ ...bueno, correo: "ana@" }), null);
  assert.equal(aMensaje({ ...bueno, mensaje: "hola" }), null, "mensaje demasiado corto");
  assert.equal(aMensaje({ ...bueno, mensaje: "x".repeat(1001) }), null, "mensaje demasiado largo");
  assert.equal(aMensaje({ ...bueno, nombre: "A" }), null);
  assert.equal(aMensaje({ ...bueno, web: "http://spam" }), "trampa");
  assert.equal(aMensaje(null), null);
  const o = describirOrigen("formulario-contacto · source=ig · medium=paid", "mensaje");
  assert.equal(o.seccion, "Formulario de la página de contacto");
  assert.equal(o.medio, "Escribió por el formulario de contacto");
  assert.match(o.campana, /Instagram/);
  const aviso = correos.avisoMensaje({ nombre: "Ana", correo: "ana@ejemplo.com", mensaje: "Quiero automatizar.", origen: lineasOrigenPrueba(o) });
  assert.match(aviso.asunto, /Ana/);
  assert.match(aviso.html, /mailto:ana@ejemplo.com/);
  assert.match(aviso.texto, /Formulario de la página de contacto/);
  const acuse = correos.acuseMensaje("Ana María");
  assert.match(acuse.texto, /Hola, Ana:/);
  assert.match(acuse.texto, /24 a 48 horas hábiles/);
  assert.ok(!/—/.test(acuse.texto + aviso.texto), "sin rayas largas");
});

console.log(`\n${pruebas} pruebas superadas.`);
