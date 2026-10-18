import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Title de la etiqueta <title>, calibrado a 50-60 caracteres. */
      metaTitle: z.string(),
      description: z.string(),
      datePublished: z.coerce.date(),
      /** Si falta, se usa datePublished. Alimenta el <lastmod> del sitemap. */
      dateModified: z.coerce.date().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Slug del servicio con el que enlaza el post. */
      servicio: z.string().optional(),
    }),
});

/**
 * Páginas legales. El texto es el de producción y NO debe reescribirse:
 * cualquier cambio de fondo lo tiene que revisar un profesional.
 */
const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, legal };
