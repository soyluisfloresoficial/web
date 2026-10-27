import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { servicios, PILARES, serviciosDe, SITIO } from "../../data/servicios";
import { detalles } from "../../data/servicios-detalle";
import { faq, proceso, estandares, herramientas, queMido, publicos } from "../../data/home";

/**
 * Base de conocimiento del asistente de IA de la web (27/10/2026).
 *
 * Se genera en cada build desde los mismos datos que pintan la web, igual que
 * llms.txt: si cambia un servicio, una pregunta frecuente o un artículo, el
 * asistente lo sabe en la siguiente publicación sin tocar nada más. El Worker
 * (src/worker/index.ts) la lee de los archivos estáticos y la manda a Claude
 * como contexto; las reglas de comportamiento están en src/worker/instrucciones.ts.
 *
 * Es pública a propósito: solo contiene lo que ya dice la web. No se indexa
 * (X-Robots-Tag en public/_headers) ni está en el sitemap.
 *
 * Fuera a propósito: cifras de resultados (no hay un caso publicado que las
 * respalde), el NIE (solo va en /aviso-legal) y el texto de las páginas
 * legales, que el asistente no debe resumir ni interpretar.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime(),
  );
  const url = (ruta: string) => `${SITIO.url}${ruta}`;
  const l: string[] = [];

  l.push("# Base de conocimiento de soyluisflores.es");
  l.push("");
  l.push("Todo lo que sigue sale de la web. Es la única información que el asistente puede dar por cierta.");
  l.push("Muchos textos están en primera persona porque en la web habla Luis («reviso», «te mando»). El asistente no es Luis: al usarlos, habla de él en tercera persona.");
  l.push("");

  // ------------------------------------------------------------ Quién
  l.push("## Quién es");
  l.push("");
  l.push(`- ${SITIO.descripcion}`);
  l.push(`- Nombre completo: ${SITIO.nombreCompleto}. Marca: ${SITIO.nombre}.`);
  l.push(`- Base: ${SITIO.localidad}, ${SITIO.region}, España. Trabaja en remoto con negocios de España y de toda Latinoamérica, en español, y acomoda los horarios a la zona de cada cliente.`);
  l.push(`- Producto propio: Smilbot (https://smilbot.com), recepcionista de IA para clínicas dentales.`);
  l.push(`- Lema: ${SITIO.lema}`);
  l.push("");
  l.push("## Para quién trabaja");
  l.push("");
  for (const p of publicos) l.push(`- ${p.titulo}: ${p.texto}`);
  l.push("");

  // ------------------------------------------------------------ Contacto
  l.push("## Cómo contactar");
  l.push("");
  l.push(`- Llamada de diagnóstico: videollamada gratis de 30 minutos, sin compromiso. Se agenda en ${url("/contacto")} eligiendo día y hora en la agenda de la página. Es el siguiente paso recomendado para cualquier caso concreto.`);
  l.push(`- WhatsApp: ${SITIO.whatsappVisible} (https://wa.me/${SITIO.telefono.replace("+", "")}).`);
  l.push(`- Correo: ${SITIO.email}. Responde en 24 a 48 horas hábiles.`);
  l.push(`- Página con todos los canales: ${url("/contacto")}.`);
  l.push("");

  // ------------------------------------------------------------ Método
  l.push("## Cómo trabaja (proceso general)");
  l.push("");
  proceso.forEach((p, i) => {
    l.push(`${i + 1}. ${p.titulo}: ${p.texto} Qué hace Luis: ${p.yo} Qué hace el cliente: ${p.tu}`);
  });
  l.push("");
  l.push("## Compromisos de trabajo");
  l.push("");
  for (const e of estandares) l.push(`- ${e.titulo}: ${e.texto}`);
  l.push("");
  l.push("## Qué se mide en cada proyecto");
  l.push("");
  for (const m of queMido) l.push(`- ${m.titulo}: ${m.texto} ${m.como}`);
  l.push("");
  l.push(`## Herramientas con las que trabaja`);
  l.push("");
  l.push(`${herramientas.join(", ")}. Si el cliente ya usa otras, primero revisa si se pueden conectar antes de sugerir un cambio.`);
  l.push("");

  // ------------------------------------------------------------ Servicios
  l.push("## Servicios");
  l.push("");
  l.push(`Hay ${servicios.length} servicios, agrupados en tres frentes:`);
  for (const pilar of PILARES) {
    l.push(`- ${pilar.nombre} (${pilar.descripcion}): ${serviciosDe(pilar).map((s) => s.nombre).join(", ")}.`);
  }
  l.push("");
  for (const s of servicios) {
    const d = detalles[s.slug];
    l.push(`### ${s.nombre}`);
    l.push("");
    l.push(`Página: ${url(`/servicios/${s.slug}`)}`);
    l.push("");
    l.push(`${s.definicion} ${s.resumen}`);
    if (d) {
      l.push("");
      l.push(d.intro);
      l.push("");
      l.push("Lo que consigues:");
      for (const r of d.resultado) l.push(`- ${r}`);
      l.push("Para quién es:");
      for (const p of d.paraQuien) l.push(`- ${p}`);
      l.push("Qué incluye:");
      for (const q of d.queIncluye) l.push(`- ${q}`);
      if (d.proceso) {
        l.push("Cómo se trabaja en este servicio:");
        d.proceso.forEach((p, i) => l.push(`${i + 1}. ${p.titulo}: ${p.texto} Luis: ${p.yo} Cliente: ${p.tu}`));
      }
      l.push("Preguntas frecuentes de este servicio:");
      for (const p of d.faq) l.push(`- ${p.pregunta} ${p.respuesta}`);
    }
    l.push("");
  }

  // ------------------------------------------------------------ FAQ
  l.push("## Preguntas frecuentes generales");
  l.push("");
  for (const g of faq) {
    l.push(`### ${g.grupo}`);
    for (const p of g.preguntas) l.push(`- ${p.pregunta} ${p.respuesta}`);
    l.push("");
  }

  // ------------------------------------------------------------ Blog
  l.push("## Artículos del blog");
  l.push("");
  for (const p of posts) {
    l.push(`- ${p.data.title}: ${p.data.description} ${url(`/blog/${p.id}`)}`);
  }
  l.push("");

  // ------------------------------------------------------------ Páginas
  l.push("## Otras páginas de la web");
  l.push("");
  l.push(`- Inicio: ${url("/")}`);
  l.push(`- Todos los servicios: ${url("/servicios")}`);
  l.push(`- Sobre Luis: ${url("/sobre-mi")}`);
  l.push(`- Calculadora de retorno de la automatización: ${url("/roi")}`);
  l.push(`- Blog: ${url("/blog")}`);
  l.push(`- Política de privacidad: ${url("/politica-de-privacidad")}`);
  l.push(`- Aviso de privacidad para Latinoamérica: ${url("/aviso-de-privacidad-latinoamerica")}`);
  l.push(`- Política de cookies: ${url("/politica-de-cookies")}`);
  l.push(`- Aviso legal: ${url("/aviso-legal")}`);
  l.push("");

  return new Response(l.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
