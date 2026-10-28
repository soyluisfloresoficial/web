// Pruebas del cálculo de huecos de la agenda (sin Google ni internet).
// Uso: node tools/probar-agenda.mjs
import assert from "node:assert/strict";
import { calcularHuecos, deZona, enZona, estaLibre } from "../src/worker/agenda-huecos.ts";
import { aplicarCambios } from "../src/worker/agenda-config.ts";

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

console.log(`\n${pruebas} pruebas superadas.`);
