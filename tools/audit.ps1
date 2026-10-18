param([string]$MirrorDir = "mirror", [string]$OutFile = "AUDITORIA.md")

$ErrorActionPreference = "Stop"

function StripTags([string]$s) {
  $s = [regex]::Replace($s, '<[^>]+>', '')
  return ([regex]::Replace($s, '\s+', ' ')).Trim()
}

function NameToUrl([string]$n) {
  if ($n -eq 'home') { return 'https://soyluisflores.es/' }
  return 'https://soyluisflores.es/' + ($n -replace '_', '/')
}

$files = Get-ChildItem (Join-Path $MirrorDir "*.html") | Sort-Object Name
$rows = @()

foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $n = $f.BaseName

  $o = [ordered]@{}
  $o.name  = $n
  $o.url   = NameToUrl $n
  $o.title = StripTags ([regex]::Match($c, '<title>(.*?)</title>', 'Singleline').Groups[1].Value)
  $o.desc  = [regex]::Match($c, '<meta name="description" content="(.*?)"').Groups[1].Value
  $o.canonical = [regex]::Match($c, '<link rel="canonical" href="(.*?)"').Groups[1].Value
  $o.ogimg = [regex]::Match($c, '<meta property="og:image" content="(.*?)"').Groups[1].Value
  $o.ogurl = [regex]::Match($c, '<meta property="og:url" content="(.*?)"').Groups[1].Value
  $o.robots = [regex]::Match($c, '<meta name="robots" content="(.*?)"').Groups[1].Value
  $o.lang = [regex]::Match($c, '<html[^>]*lang="(.*?)"').Groups[1].Value

  # Encabezados en orden de aparicion
  $hs = [regex]::Matches($c, '<h([1-6])[^>]*>(.*?)</h\1>', 'Singleline')
  $levels = @()
  $headings = @()
  foreach ($h in $hs) {
    $lvl = [int]$h.Groups[1].Value
    $txt = StripTags $h.Groups[2].Value
    $levels += $lvl
    $headings += ("h$lvl" + ": " + $txt)
  }
  $o.h1count = ($levels | Where-Object { $_ -eq 1 }).Count
  $o.h1text = ($hs | Where-Object { $_.Groups[1].Value -eq '1' } | ForEach-Object { StripTags $_.Groups[2].Value }) -join ' || '
  $jumps = @()
  for ($i = 1; $i -lt $levels.Count; $i++) {
    if ($levels[$i] - $levels[$i-1] -gt 1) { $jumps += ("h" + $levels[$i-1] + "->h" + $levels[$i]) }
  }
  $o.headingJumps = ($jumps -join ', ')
  $o.headings = $headings

  # Imagenes
  $imgs = [regex]::Matches($c, '<img\b[^>]*>')
  $noAlt = 0; $emptyAlt = 0; $alts = @()
  foreach ($im in $imgs) {
    $tag = $im.Value
    $m = [regex]::Match($tag, '\balt="([^"]*)"')
    if (-not $m.Success) { $noAlt++ }
    elseif ($m.Groups[1].Value.Trim() -eq '') { $emptyAlt++ }
    else { $alts += $m.Groups[1].Value }
  }
  $o.imgTotal = $imgs.Count
  $o.imgNoAlt = $noAlt
  $o.imgEmptyAlt = $emptyAlt
  $o.imgDupAlt = (($alts | Group-Object | Where-Object { $_.Count -gt 1 } | ForEach-Object { $_.Name + " x" + $_.Count }) -join '; ')

  # JSON-LD
  $lds = [regex]::Matches($c, '<script type="application/ld\+json">(.*?)</script>', 'Singleline')
  $types = @()
  $parseOk = $true
  foreach ($l in $lds) {
    $raw = $l.Groups[1].Value
    try { ConvertFrom-Json $raw | Out-Null } catch { $parseOk = $false }
    $types += ([regex]::Matches($raw, '"@type"\s*:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
  }
  $o.ldBlocks = $lds.Count
  $o.ldParseOk = $parseOk
  $o.ldTypes = ($types | Select-Object -Unique) -join ', '

  # Metas de articulo
  $o.artPublished = [regex]::IsMatch($c, 'article:published_time')
  $o.artModified  = [regex]::IsMatch($c, 'article:modified_time')
  $o.dateModified = [regex]::IsMatch($c, '"dateModified"')
  $o.datePublished = [regex]::Match($c, '"datePublished"\s*:\s*"([^"]*)"').Groups[1].Value

  # Datos sensibles y metricas
  $o.hasNif = [regex]::IsMatch($c, 'NIF|NIE')
  $o.hasStreet = [regex]::IsMatch($c, 'Carrer|Pujada Roja')
  $o.m73 = ([regex]::Matches($c, '73\s*%')).Count
  $o.m40 = ([regex]::Matches($c, '40\s*%')).Count
  $o.m12h = ([regex]::Matches($c, '12\s*h')).Count

  # Enlaces internos
  $links = [regex]::Matches($c, 'href="(/[^"#?]*)"') | ForEach-Object { $_.Groups[1].Value }
  $o.internalLinks = ($links | Select-Object -Unique)

  # Texto del cuerpo del articulo
  $art = [regex]::Match($c, '<article[\s\S]*?</article>').Value
  if ($art) { $o.bodyWords = ((StripTags $art) -split '\s+' | Where-Object { $_ -ne '' }).Count } else { $o.bodyWords = 0 }

  $rows += [pscustomobject]$o
}

# ---------- Informe ----------
$sb = New-Object System.Text.StringBuilder
function W([string]$s) { [void]$sb.AppendLine($s) }

W "# Auditoria de soyluisflores.es"
W ""
W ("Generado el " + (Get-Date -Format "yyyy-MM-dd HH:mm") + " sobre " + $rows.Count + " paginas descargadas de produccion.")
W ""

W "## 1. Titles y descriptions"
W ""
W "| URL | Title | Len | Desc | Len |"
W "|---|---|---|---|---|"
foreach ($r in $rows) {
  $t = $r.title -replace '\|', '/'
  $d = $r.desc -replace '\|', '/'
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $t + " | " + $t.Length + " | " + $d + " | " + $d.Length + " |")
}
W ""
$badTitle = $rows | Where-Object { $_.title.Length -lt 50 -or $_.title.Length -gt 60 }
W ("Titles fuera de 50-60: " + (($badTitle | ForEach-Object { $_.name + " (" + $_.title.Length + ")" }) -join ', '))
$badDesc = $rows | Where-Object { $_.desc.Length -lt 150 -or $_.desc.Length -gt 160 }
W ("Descriptions fuera de 150-160: " + (($badDesc | ForEach-Object { $_.name + " (" + $_.desc.Length + ")" }) -join ', '))
W ""

W "## 2. Canonical, og:url y og:image"
W ""
W "| URL | Canonical coincide | og:url coincide | og:image |"
W "|---|---|---|---|"
foreach ($r in $rows) {
  $cOk = ($r.canonical -eq $r.url)
  $oOk = ($r.ogurl -eq $r.url)
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $cOk + " | " + $oOk + " | " + ($r.ogimg -replace 'https://soyluisflores.es','') + " |")
}
W ""
$ogDistinct = ($rows | Select-Object -ExpandProperty ogimg | Select-Object -Unique)
W ("Imagenes OG distintas en todo el sitio: " + @($ogDistinct).Count)
foreach ($o in @($ogDistinct)) { W ("- " + $o) }
W ""

W "## 3. JSON-LD"
W ""
W "| URL | Bloques | Parsea | Tipos |"
W "|---|---|---|---|"
foreach ($r in $rows) {
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $r.ldBlocks + " | " + $r.ldParseOk + " | " + $r.ldTypes + " |")
}
W ""

W "## 4. Encabezados"
W ""
W "| URL | H1 | Saltos | Texto del H1 |"
W "|---|---|---|---|"
foreach ($r in $rows) {
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $r.h1count + " | " + $r.headingJumps + " | " + ($r.h1text -replace '\|','/') + " |")
}
W ""

W "## 5. Imagenes y alt"
W ""
W "| URL | Total | Sin alt | alt vacio | alt duplicados |"
W "|---|---|---|---|---|"
foreach ($r in $rows) {
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $r.imgTotal + " | " + $r.imgNoAlt + " | " + $r.imgEmptyAlt + " | " + ($r.imgDupAlt -replace '\|','/') + " |")
}
W ""

W "## 6. Fechas y metas de articulo"
W ""
W "| URL | datePublished | dateModified | article:published | article:modified | Palabras |"
W "|---|---|---|---|---|---|"
foreach ($r in $rows) {
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $r.datePublished + " | " + $r.dateModified + " | " + $r.artPublished + " | " + $r.artModified + " | " + $r.bodyWords + " |")
}
W ""

W "## 7. Datos legales y metricas por pagina"
W ""
W "| URL | NIF/NIE | Calle | 73% | 40% | 12 h |"
W "|---|---|---|---|---|---|"
foreach ($r in $rows) {
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + $r.hasNif + " | " + $r.hasStreet + " | " + $r.m73 + " | " + $r.m40 + " | " + $r.m12h + " |")
}
W ""

W "## 8. Cobertura de enlaces a los 6 servicios"
W ""
$servicios = @('/servicios/agentes-ia','/servicios/automatizacion','/servicios/funnels-conversion','/servicios/webs-ia','/servicios/trafico-de-pago','/servicios/consultoria-ia')
W ("| Pagina | " + (($servicios | ForEach-Object { $_ -replace '/servicios/','' }) -join ' | ') + " |")
W ("|---|" + (($servicios | ForEach-Object { '---' }) -join '|') + "|")
foreach ($r in $rows) {
  $cells = @()
  foreach ($s in $servicios) { if ($r.internalLinks -contains $s) { $cells += 'si' } else { $cells += 'NO' } }
  W ("| " + ($r.url -replace 'https://soyluisflores.es','') + " | " + ($cells -join ' | ') + " |")
}
W ""

W "## 9. Enlaces internos a URLs que dan 404"
W ""
$dead = @('/servicios/trafficker-digital','/clientes','/blog/agente-ia-whatsapp-ventas-sin-programar','/blog/funnels-conversion-2026-errores-comunes','/blog/negocio-pierde-dinero-sin-automatizacion-ia')
$found = $false
foreach ($r in $rows) {
  foreach ($d in $dead) {
    if ($r.internalLinks -contains $d) { W ("- " + $r.url + " enlaza a " + $d); $found = $true }
  }
}
if (-not $found) { W "Ninguna pagina enlaza a las URLs rotas conocidas." }
W ""

W "## 10. Enlaces desde los posts a paginas de servicio"
W ""
foreach ($r in ($rows | Where-Object { $_.name -like 'blog_*' })) {
  $svc = $r.internalLinks | Where-Object { $_ -like '/servicios/*' }
  if ($svc) { W ("- " + $r.name + ": " + ($svc -join ', ')) } else { W ("- " + $r.name + ": NINGUNO") }
}
W ""

[System.IO.File]::WriteAllText((Join-Path (Get-Location) $OutFile), $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Output ("Informe escrito en " + $OutFile + " (" + $sb.Length + " caracteres)")
