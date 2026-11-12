import type { APIRoute } from "astro";
import { GUIAS, GUIA_GENERAL, tituloGuia } from "../data/guias";
import { servicios, SITIO } from "../data/servicios";

/**
 * /guias.json (12/11/2026): la lista de las guías que entrega la web, para la
 * sección «Guías» del panel (panel.soyluisflores.es). Se genera en cada
 * compilación desde src/data/guias.ts: al añadir o cambiar una guía, el panel
 * la ve sola.
 *
 * Solo lleva lo que ya es público en /guia/<slug> (títulos, resúmenes y a
 * quién va). Nada de suscriptores ni datos de personas: eso lo cuenta el
 * panel con sus propios leads.
 *
 * Tipos:
 *  - regalo: la que se entrega por Instagram (ManyChat) desde /negocio-inteligente.
 *  - promocional: la de cada servicio; se ofrece en su página y en el blog, y
 *    su serie de correos lleva a la llamada de ese servicio.
 */

const REGALO = new Set(["negocio-inteligente"]);

export const GET: APIRoute = () => {
  const nombreServicio = new Map(servicios.map((s) => [s.slug, s.nombre]));

  const guias = Object.values(GUIAS).map((g) => {
    const regalo = REGALO.has(g.slug);
    const dondeSeOfrece = regalo
      ? ["Página /negocio-inteligente", "Mensaje automático de ManyChat en Instagram"]
      : [
          `Página del servicio /servicios/${g.servicio}`,
          "Artículos del blog de ese servicio",
          ...(g.slug === GUIA_GENERAL ? ["Índice del blog", "Página /guia"] : []),
        ];
    return {
      slug: g.slug,
      tipo: regalo ? "regalo" : "promocional",
      titulo: tituloGuia(g),
      resumen: g.resumen,
      servicio: g.servicio,
      servicioNombre: nombreServicio.get(g.servicio) ?? g.servicio,
      paraQuien: g.paraQuien,
      teLlevas: g.teLlevas,
      tiempo: g.tiempo,
      incluye: g.incluye,
      pasos: g.plan.pasos,
      dondeSeOfrece,
      general: g.slug === GUIA_GENERAL,
      urlLeer: `${SITIO.url}/guia/${g.slug}`,
      urlPedir: regalo ? `${SITIO.url}/negocio-inteligente` : `${SITIO.url}/servicios/${g.servicio}`,
      urlCompartir: regalo
        ? `${SITIO.url}/negocio-inteligente?utm_source=ig&utm_medium=manychat&utm_campaign=negocio-inteligente`
        : `${SITIO.url}/servicios/${g.servicio}?utm_source=panel&utm_medium=compartir&utm_campaign=guia-${g.slug}`,
      imagen: `${SITIO.url}/og/guia-${g.slug}.jpg`,
    };
  });

  return new Response(JSON.stringify({ actualizado: new Date().toISOString(), guias }, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
