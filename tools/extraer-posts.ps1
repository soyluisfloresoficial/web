param(
  [string]$Root = "C:\Users\Luis Carlos\AppData\Roaming\Claude\scratch-workspaces\77cd63bb-136d-4f62-bbf2-37b501226a33\62746d41-b1d0-4d97-9577-f5b4763f36b9\scratch-2026-10-18-406a9d"
)

$ErrorActionPreference = "Stop"

function Limpia([string]$s) {
  $s = $s -replace '&nbsp;', ' '
  $s = $s -replace '&amp;', '&'
  $s = $s -replace '&lt;', '<'
  $s = $s -replace '&gt;', '>'
  $s = $s -replace '&quot;', '"'
  $s = $s -replace '&#39;', "'"
  $s = $s -replace '&hellip;', '...'
  $s = $s -replace '&mdash;', '—'
  $s = $s -replace '&ndash;', '–'
  return $s
}

function Texto([string]$s) {
  $s = [regex]::Replace($s, '<[^>]+>', '')
  return (Limpia ([regex]::Replace($s, '\s+', ' '))).Trim()
}

# Convierte el HTML del cuerpo a Markdown. Solo contempla lo que estos posts
# usan de verdad: h2, h3, p, ul/ol, strong, em y enlaces.
function AMarkdown([string]$html) {
  $html = [regex]::Replace($html, '<(script|style)[\s\S]*?</\1>', '')
  $sb = New-Object System.Text.StringBuilder

  $bloques = [regex]::Matches($html, '<(h2|h3|p|ul|ol|blockquote)\b[^>]*>([\s\S]*?)</\1>')
  foreach ($b in $bloques) {
    $tag = $b.Groups[1].Value
    $cont = $b.Groups[2].Value

    switch ($tag) {
      "h2" { [void]$sb.AppendLine("## " + (Texto $cont)); [void]$sb.AppendLine() }
      "h3" { [void]$sb.AppendLine("### " + (Texto $cont)); [void]$sb.AppendLine() }
      "blockquote" { [void]$sb.AppendLine("> " + (Texto $cont)); [void]$sb.AppendLine() }
      { $_ -in @("ul", "ol") } {
        $n = 0
        foreach ($li in [regex]::Matches($cont, '<li\b[^>]*>([\s\S]*?)</li>')) {
          $n++
          $marca = if ($tag -eq "ol") { "$n." } else { "-" }
          [void]$sb.AppendLine($marca + " " + (InlineMd $li.Groups[1].Value))
        }
        [void]$sb.AppendLine()
      }
      default {
        $t = InlineMd $cont
        if ($t -ne "") { [void]$sb.AppendLine($t); [void]$sb.AppendLine() }
      }
    }
  }
  return $sb.ToString()
}

# Conserva negrita, cursiva y enlaces internos dentro de un párrafo.
function InlineMd([string]$s) {
  $s = [regex]::Replace($s, '<strong\b[^>]*>([\s\S]*?)</strong>', '**$1**')
  $s = [regex]::Replace($s, '<b\b[^>]*>([\s\S]*?)</b>', '**$1**')
  $s = [regex]::Replace($s, '<em\b[^>]*>([\s\S]*?)</em>', '*$1*')
  $s = [regex]::Replace($s, '<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)</a>', '[$2]($1)')
  $s = [regex]::Replace($s, '<br\s*/?>', ' ')
  $s = [regex]::Replace($s, '<[^>]+>', '')
  return (Limpia ([regex]::Replace($s, '\s+', ' '))).Trim()
}

$slugs = @(
  "agentes-ia-sin-inventar",
  "que-automatizar-primero",
  "conectar-herramientas-sin-romper",
  "funnels-sin-spam",
  "que-medir-en-cada-etapa",
  "empezar-con-ia-sin-perder-tiempo"
)

# Servicio con el que enlaza cada post, por afinidad tematica.
$servicioDe = @{
  "agentes-ia-sin-inventar"          = "agentes-ia"
  "que-automatizar-primero"          = "automatizacion"
  "conectar-herramientas-sin-romper" = "automatizacion"
  "funnels-sin-spam"                 = "funnels-conversion"
  "que-medir-en-cada-etapa"          = "funnels-conversion"
  "empezar-con-ia-sin-perder-tiempo" = "consultoria-ia"
}

$destino = Join-Path $Root "web\src\content\blog"
New-Item -ItemType Directory -Force -Path $destino | Out-Null

foreach ($slug in $slugs) {
  $ruta = Join-Path $Root ("mirror\blog_" + $slug + ".html")
  $h = [System.IO.File]::ReadAllText($ruta)

  $titulo = Texto ([regex]::Match($h, '<h1[^>]*>([\s\S]*?)</h1>').Groups[1].Value)
  $desc = Limpia ([regex]::Match($h, '<meta name="description" content="([^"]*)"').Groups[1].Value)

  $ld = [regex]::Match($h, '<script type="application/ld\+json">([\s\S]*?)</script>').Groups[1].Value
  $publicado = ""
  try {
    $j = $ld | ConvertFrom-Json
    $bp = $j.'@graph' | Where-Object { $_.'@type' -eq 'BlogPosting' }
    if ($bp.datePublished) { $publicado = ([datetime]$bp.datePublished).ToString("yyyy-MM-dd") }
  } catch {}

  $art = [regex]::Match($h, '<article[\s\S]*?</article>').Value
  # Fuera el encabezado del articulo: el titulo y la fecha ya van en el frontmatter.
  $art = [regex]::Replace($art, '<h1[\s\S]*?</h1>', '')
  $md = AMarkdown $art
  # La firma del autor la pinta la plantilla a partir del frontmatter, así que
  # no debe quedar duplicada dentro del cuerpo.
  $md = [regex]::Replace($md, '^\s*Por Luis Carlos Flores[^\r\n]*\r?\n\r?\n?', '')

  $fm = @()
  $fm += "---"
  $fm += ('title: "' + ($titulo -replace '"', '\"') + '"')
  $fm += ('description: "' + ($desc -replace '"', '\"') + '"')
  $fm += ("datePublished: " + $publicado)
  $fm += ("dateModified: " + $publicado)
  $fm += ('servicio: "' + $servicioDe[$slug] + '"')
  $fm += "---"
  $fm += ""

  $salida = ($fm -join "`n") + $md
  [System.IO.File]::WriteAllText((Join-Path $destino ($slug + ".md")), $salida, (New-Object System.Text.UTF8Encoding($false)))

  $palabras = (($md -split '\s+') | Where-Object { $_ -ne '' }).Count
  Write-Output ("{0,-36} {1,-12} {2,4} palabras" -f $slug, $publicado, $palabras)
}
