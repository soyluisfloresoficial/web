/**
 * Palabras y minutos de lectura de un texto en Markdown, a 200 palabras por
 * minuto. Se cuentan solo las palabras: se quitan la sintaxis de enlaces, las
 * marcas de formato y los bloques de código.
 */
export function palabras(markdown: string | undefined): number {
  if (!markdown) return 0;
  const texto = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~-]/g, " ");
  return texto.split(/\s+/).filter(Boolean).length;
}

export function minutosLectura(markdown: string | undefined): number {
  return Math.max(1, Math.round(palabras(markdown) / 200));
}
