#!/usr/bin/env python3
"""Genera REDES-SOCIALES.html a partir de REDES-SOCIALES.md.

Uso: python3 tools/generar-redes-html.py
Vuelve a ejecutarlo cada vez que cambies el .md. Los bloques de código salen
con botón «Copiar» y las rutas de la web (/guia, /diagnostico...) se enlazan.
"""
import html, re, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
md = (RAIZ / "REDES-SOCIALES.md").read_text(encoding="utf-8")
WEB = "https://soyluisflores.es"

ENLACES = [
    ("Tu web", WEB),
    ("Guía gratis", WEB + "/guia"),
    ("Diagnóstico", WEB + "/diagnostico"),
    ("Diagnóstico agentes IA", WEB + "/diagnostico/agentes-ia"),
    ("Instagram", "https://www.instagram.com/soyluisfloresoficial/"),
    ("TikTok", "https://www.tiktok.com/@soyluisfloresoficial"),
    ("LinkedIn", "https://www.linkedin.com/in/soyluisflores/"),
    ("HeyGen", "https://app.heygen.com/"),
    ("HeyGen precios", "https://heygen.com/en-gb/pricing"),
    ("Metricool", "https://app.metricool.com/"),
    ("ManyChat", "https://app.manychat.com/"),
    ("ManyChat precios", "https://manychat.com/pricing"),
    ("Canva", "https://www.canva.com/"),
    ("CapCut", "https://www.capcut.com/"),
    ("Meta Business Suite", "https://business.facebook.com/"),
    ("Google Analytics", "https://analytics.google.com/"),
]


def inline(t: str) -> str:
    t = html.escape(t, quote=False)
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)",
               r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)

    def code(m):
        c = m.group(1)
        ruta = re.fullmatch(r"(/(guia|diagnostico)[a-z0-9/<>&;-]*)", c)
        if ruta and "&lt;" not in c:
            return f'<a href="{WEB}{c}" target="_blank" rel="noopener"><code>{c}</code></a>'
        if c.startswith("@soyluisfloresoficial"):
            return f'<a href="https://www.instagram.com/soyluisfloresoficial/" target="_blank" rel="noopener"><code>{c}</code></a>'
        if c == "/in/soyluisflores":
            return f'<a href="https://www.linkedin.com/in/soyluisflores/" target="_blank" rel="noopener"><code>{c}</code></a>'
        return f"<code>{c}</code>"

    t = re.sub(r"`([^`]+)`", code, t)
    t = re.sub(r"(?<![\"/>])(soyluisflores\.es(?:/[a-z0-9/-]+)?)",
               lambda m: f'<a href="https://{m.group(1)}" target="_blank" rel="noopener">{m.group(1)}</a>', t)
    return t


def slug(t: str) -> str:
    t = re.sub(r"^\d+\.\s*", "", t.lower())
    t = (t.replace("á", "a").replace("é", "e").replace("í", "i")
          .replace("ó", "o").replace("ú", "u").replace("ñ", "n"))
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:40]


out, toc, para, lista = [], [], [], None
lineas = md.splitlines()
i, ncode = 0, 0


def cerrar():
    global para, lista
    if para:
        out.append("<p>" + inline(" ".join(para)) + "</p>")
        para = []
    if lista:
        tag, items = lista
        out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>")
        lista = None


titulo = "Ecosistema de redes"
while i < len(lineas):
    l = lineas[i]
    if l.startswith("```"):
        cerrar()
        bloque = []
        i += 1
        while i < len(lineas) and not lineas[i].startswith("```"):
            bloque.append(lineas[i])
            i += 1
        ncode += 1
        out.append(f'<div class="copiable"><button type="button" class="copiar" data-c="c{ncode}">Copiar</button>'
                   f'<pre id="c{ncode}">{html.escape(chr(10).join(bloque))}</pre></div>')
    elif l.startswith("# "):
        cerrar()
        titulo = l[2:].strip()
    elif l.startswith("## "):
        cerrar()
        h = l[3:].strip()
        s = slug(h)
        toc.append((s, h))
        out.append(f'</section><section id="{s}"><h2>{inline(h)}</h2>')
    elif l.startswith("### "):
        cerrar()
        out.append(f"<h3>{inline(l[4:].strip())}</h3>")
    elif l.strip() == "---":
        cerrar()
    elif re.match(r"^\s*[-*] ", l):
        if para:
            cerrar()
        txt = re.sub(r"^\s*[-*] ", "", l)
        if lista and lista[0] == "ul" and not re.match(r"^\s", l) or (lista and lista[0] == "ul"):
            lista[1].append(txt)
        else:
            cerrar()
            lista = ("ul", [txt])
    elif re.match(r"^\d+\. ", l):
        if para:
            cerrar()
        txt = re.sub(r"^\d+\. ", "", l)
        if lista and lista[0] == "ol":
            lista[1].append(txt)
        else:
            cerrar()
            lista = ("ol", [txt])
    elif l.strip() == "":
        cerrar()
    elif lista and l.startswith("  "):
        lista[1][-1] += " " + l.strip()
    else:
        if lista:
            cerrar()
        para.append(l.strip())
    i += 1
cerrar()

cuerpo = "\n".join(out)
cuerpo = cuerpo.replace("</section>", "", 1)
intro, _, resto = cuerpo.partition("<section")
cuerpo = intro + "<section" + resto + "</section>"

def corto(h):
    h = re.split(r" \(|:", h)[0]
    return h if len(h) <= 32 else h[:30].rsplit(" ", 1)[0] + "…"


indice = "".join(f'<li><a href="#{s}">{html.escape(corto(h))}</a></li>' for s, h in toc)
chips = "".join(f'<a class="chip" href="{u}" target="_blank" rel="noopener">{html.escape(n)}</a>' for n, u in ENLACES)

pagina = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Ecosistema de redes Luis Flores</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap">
<style>
/* Layout: columna de lectura de 46rem con índice fijo arriba; bloques para copiar como fichas de trabajo. */
:root {{
  --bg: #f5f7fc; --surface: #ffffff; --fg: #0d1630; --muted: #4f5a78;
  --line: #dde3f0; --accent: #4f46e5; --accent-2: #007bff; --code-bg: #0d1630; --code-fg: #e6ebff;
  --grad: linear-gradient(110deg, #007bff 0%, #6366f1 50%, #8b5cf6 100%);
  --f-display: "Manrope", system-ui, sans-serif;
  --f-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --f-mono: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #0a1022; --surface: #111a33; --fg: #e9edf8; --muted: #a3adc8;
  --line: #22305a; --accent: #8b8cff; --accent-2: #5aa9ff; --code-bg: #060b19; --code-fg: #e6ebff; color-scheme: dark }} }}
:root[data-theme="dark"] {{
  --bg: #0a1022; --surface: #111a33; --fg: #e9edf8; --muted: #a3adc8;
  --line: #22305a; --accent: #8b8cff; --accent-2: #5aa9ff; --code-bg: #060b19; --code-fg: #e6ebff; color-scheme: dark }}
* {{ box-sizing: border-box }}
html {{ scroll-behavior: smooth; scroll-padding-top: 4rem }}
body {{ margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.65 var(--f-body);
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)) }}
.wrap {{ max-width: 46rem; margin: 0 auto; padding-block: 2rem 4rem }}
header.hero {{ padding-block: 1rem 1.5rem; border-bottom: 1px solid var(--line) }}
.eyebrow {{ font: 600 .75rem/1 var(--f-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted) }}
h1 {{ font: 800 clamp(1.9rem, 6vw, 2.8rem)/1.1 var(--f-display); margin: .6rem 0 .8rem; text-wrap: balance;
  background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent }}
h2 {{ font: 800 1.5rem/1.2 var(--f-display); margin: 0 0 .8rem; text-wrap: balance }}
h3 {{ font: 700 1.1rem/1.3 var(--f-display); margin: 1.6rem 0 .5rem; color: var(--accent) }}
section {{ padding-block: 2rem; border-bottom: 1px solid var(--line) }}
p, li {{ max-width: 65ch }}
a {{ color: var(--accent-2); text-underline-offset: 2px }}
a:focus-visible, button:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px }}
code {{ font: .88em var(--f-mono); background: color-mix(in srgb, var(--accent) 10%, transparent); padding: .1em .35em; border-radius: 4px; word-break: break-word }}
ul, ol {{ padding-left: 1.3rem }}
li {{ margin-block: .3rem }}
nav.indice {{ position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg);
  border-bottom: 1px solid var(--line); margin-inline: calc(-1 * max(16px, env(safe-area-inset-left, 0px))); padding: .5rem max(16px, env(safe-area-inset-left, 0px)) }}
nav.indice ol {{ display: flex; gap: .4rem; overflow-x: auto; list-style: none; margin: 0; padding: 0; scrollbar-width: none }}
nav.indice li {{ margin: 0; flex: none }}
nav.indice a {{ display: block; font: 600 .8rem/1 var(--f-body); padding: .5rem .7rem; border-radius: 999px;
  border: 1px solid var(--line); color: var(--fg); text-decoration: none; background: var(--surface) }}
body::before {{ content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg) }}
.enlaces {{ display: flex; flex-wrap: wrap; gap: .4rem; margin-top: 1rem }}
.chip {{ font: 500 .82rem/1 var(--f-body); padding: .55rem .75rem; border-radius: 8px; background: var(--surface);
  border: 1px solid var(--line); color: var(--fg); text-decoration: none }}
.chip:hover {{ border-color: var(--accent) }}
.copiable {{ position: relative; margin-block: .8rem 1.2rem }}
.copiable pre {{ margin: 0; background: var(--code-bg); color: var(--code-fg); font: .85rem/1.6 var(--f-mono);
  padding: 2.6rem 1rem 1rem; border-radius: 10px; white-space: pre-wrap; word-break: break-word; overflow-x: auto }}
.copiar {{ position: absolute; top: .5rem; right: .5rem; font: 600 .78rem/1 var(--f-body); padding: .5rem .8rem; border-radius: 6px;
  border: 0; cursor: pointer; color: #fff; background: var(--grad) }}
.copiar.ok {{ background: #15803d }}
footer {{ color: var(--muted); font-size: .85rem; padding-top: 2rem }}
@media (prefers-reduced-motion: reduce) {{ html {{ scroll-behavior: auto }} }}
</style>
</head>
<body>
<nav class="indice" aria-label="Secciones"><ol>{indice}</ol></nav>
<div class="wrap">
<header class="hero">
  <div class="eyebrow">Marca personal · Instagram · TikTok · LinkedIn · Facebook</div>
  <h1>{html.escape(titulo)}</h1>
  <p>Todo lo que va en un bloque oscuro se copia con un toque en «Copiar». Los enlaces abren en otra pestaña.</p>
  <div class="enlaces">{chips}</div>
</header>
{cuerpo}
<footer>Generado desde <code>REDES-SOCIALES.md</code> del repositorio soyluisfloresoficial/web. Si cambias el .md, ejecuta <code>python3 tools/generar-redes-html.py</code>.</footer>
</div>
<script>
document.addEventListener("click", async (e) => {{
  const b = e.target.closest(".copiar"); if (!b) return;
  const pre = document.getElementById(b.dataset.c);
  const t = pre.innerText;
  try {{ await navigator.clipboard.writeText(t); }}
  catch (_) {{ const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }}
  b.textContent = "Copiado"; b.classList.add("ok");
  setTimeout(() => {{ b.textContent = "Copiar"; b.classList.remove("ok"); }}, 1800);
}});
</script>
</body>
</html>
"""
(RAIZ / "REDES-SOCIALES.html").write_text(pagina, encoding="utf-8")
print("REDES-SOCIALES.html generado:", len(toc), "secciones,", ncode, "bloques para copiar")
