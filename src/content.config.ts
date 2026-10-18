import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
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

export const collections = { blog };
