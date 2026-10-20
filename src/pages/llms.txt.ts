import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { servicios, proyectos, SITIO } from "../data/servicios";

/**
 * llms.txt generado desde los mismos datos que la web.
 *
 * Se genera en lugar de mantenerlo a mano porque el fichero anterior se había
 * desactualizado: describía páginas que ya no existían. Así, cuando se añade un
 * servicio o un post, el llms.txt se actualiza solo en el siguiente build.
 *
 * Deliberadamente NO incluye las métricas 73% / 12 h / 40%: son cifras sin un
 * caso publicado detrás, y este es justo el fichero del que una IA las citaría
 * como hecho verificado.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.datePublished.getTime() - a.data.datePublished.getTime(),
  );

  const lineas: string[] = [];

  lineas.push(`# ${SITIO.nombreCompleto}`);
  lineas.push("");
  lineas.push(
    `> ${SITIO.nombreCompleto} (marca: ${SITIO.nombre}) implementa IA aplicada a negocios reales para pymes y emprendedores de España y Latinoamérica: agentes de IA de voz y chat, automatización de procesos, funnels de conversión, webs con IA, tráfico de pago y consultoría de IA. Con base en ${SITIO.localidad} (${SITIO.region}, España).`,
  );
  lineas.push("");
  lineas.push(
    "- Enfoque: diagnóstico, implementación con documentación incluida, y medición y mejora continua.",
  );
  lineas.push(
    "- Herramientas habituales: Make, n8n, Zapier, GoHighLevel, ManyChat, ActiveCampaign, Airtable, Stripe.",
  );
  lineas.push("- Primera llamada: 30 minutos, gratuita.");
  lineas.push(`- Contacto: ${SITIO.email}`);
  lineas.push(`- Lema: "${SITIO.lema}"`);
  lineas.push("");

  lineas.push("## Páginas principales");
  lineas.push("");
  lineas.push(
    `- [Inicio](${SITIO.url}/): presentación, servicios, método y preguntas frecuentes.`,
  );
  lineas.push(`- [Servicios](${SITIO.url}/servicios): índice de los ${servicios.length} servicios.`);
  lineas.push(
    `- [Sobre mí](${SITIO.url}/sobre-mi): biografía, valores, formación y cómo se miden los resultados.`,
  );
  lineas.push(
    `- [Calculadora ROI](${SITIO.url}/roi): estimación orientativa, basada en hipótesis visibles, de horas ahorradas e ingresos adicionales. No muestra precios.`,
  );
  lineas.push(
    `- [Blog](${SITIO.url}/blog): guías prácticas sobre IA aplicada, automatización y funnels.`,
  );
  lineas.push(
    `- [Contacto](${SITIO.url}/contacto): llamada gratuita de 30 minutos, email y redes sociales.`,
  );
  lineas.push("");

  lineas.push("## Datos clave");
  lineas.push("");
  lineas.push(
    "- Precios: no se publican en la web. La propuesta se hace por escrito tras una llamada, según el caso.",
  );
  lineas.push("- Interacción con IA: se avisa en la web dónde se habla con un asistente de IA.");
  lineas.push("");

  lineas.push("## Servicios");
  lineas.push("");
  for (const s of servicios) {
    lineas.push(`- [${s.nombre}](${SITIO.url}/servicios/${s.slug}): ${s.definicion}`);
  }
  lineas.push("");

  lineas.push("## Proyectos propios");
  lineas.push("");
  for (const p of proyectos) {
    lineas.push(`- [${p.nombre}](${p.url})${p.descripcion ? `: ${p.descripcion}` : ""}`);
  }
  lineas.push("");

  lineas.push("## Blog");
  lineas.push("");
  for (const p of posts) {
    lineas.push(`- [${p.data.title}](${SITIO.url}/blog/${p.id}): ${p.data.description}`);
  }
  lineas.push("");

  lineas.push("## Perfiles");
  lineas.push("");
  lineas.push("- [Instagram](https://www.instagram.com/soyluisflores_/)");
  lineas.push("- [LinkedIn](https://www.linkedin.com/in/soyluisflores/)");
  lineas.push("- [TikTok](https://www.tiktok.com/@soyluisfloresoficial)");
  lineas.push("");

  lineas.push("## Legal");
  lineas.push("");
  lineas.push(`- [Aviso legal](${SITIO.url}/aviso-legal)`);
  lineas.push(`- [Política de privacidad](${SITIO.url}/politica-de-privacidad)`);
  lineas.push(`- [Política de cookies](${SITIO.url}/politica-de-cookies)`);
  lineas.push("");

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
