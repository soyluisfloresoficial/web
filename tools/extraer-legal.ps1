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

function InlineMd([string]$s) {
  $s = [regex]::Replace($s, '<strong\b[^>]*>([\s\S]*?)</strong>', '**$1**')
  $s = [regex]::Replace($s, '<em\b[^>]*>([\s\S]*?)</em>', '*$1*')
  $s = [regex]::Replace($s, '<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)</a>', '[$2]($1)')
  $s = [regex]::Replace($s, '<br\s*/?>', ' ')
  $s = [regex]::Replace($s, '<[^>]+>', '')
  return (Limpia ([regex]::Replace($s, '\s+', ' '))).Trim()
}

function Texto([string]$s) {
  return (Limpia ([regex]::Replace(([regex]::Replace($s, '<[^>]+>', '')), '\s+', ' '))).Trim()
}

function AMarkdown([string]$html) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($b in [regex]::Matches($html, '<(h2|h3|h4|p|ul|ol)\b[^>]*>([\s\S]*?)</\1>')) {
    $tag = $b.Groups[1].Value
    $cont = $b.Groups[2].Value
    switch ($tag) {
      "h2" { [void]$sb.AppendLine("## " + (Texto $cont)); [void]$sb.AppendLine() }
      "h3" { [void]$sb.AppendLine("### " + (Texto $cont)); [void]$sb.AppendLine() }
      "h4" { [void]$sb.AppendLine("#### " + (Texto $cont)); [void]$sb.AppendLine() }
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

$paginas = @(
  @{ slug = "aviso-legal"; archivo = "aviso-legal" },
  @{ slug = "politica-de-privacidad"; archivo = "politica-de-privacidad" },
  @{ slug = "politica-de-cookies"; archivo = "politica-de-cookies" }
)

$destino = Join-Path $Root "web\src\content\legal"
New-Item -ItemType Directory -Force -Path $destino | Out-Null

foreach ($p in $paginas) {
  $h = [System.IO.File]::ReadAllText((Join-Path $Root ("mirror\" + $p.archivo + ".html")))
  $titulo = Texto ([regex]::Match($h, '<h1[^>]*>([\s\S]*?)</h1>').Groups[1].Value)
  $metaTitle = Limpia ([regex]::Match($h, '<title>(.*?)</title>').Groups[1].Value)
  $desc = Limpia ([regex]::Match($h, '<meta name="description" content="([^"]*)"').Groups[1].Value)

  $main = [regex]::Match($h, '<main[\s\S]*?</main>').Value
  if ($main -eq "") { $main = [regex]::Match($h, '<body[\s\S]*</body>').Value }
  $main = [regex]::Replace($main, '<(script|style|nav|footer|header)[\s\S]*?</\1>', '')
  $main = [regex]::Replace($main, '<h1[\s\S]*?</h1>', '')

  $md = AMarkdown $main

  $fm = @(
    "---",
    ('title: "' + ($titulo -replace '"', '\"') + '"'),
    ('metaTitle: "' + ($metaTitle -replace '"', '\"') + '"'),
    ('description: "' + ($desc -replace '"', '\"') + '"'),
    "---",
    ""
  )
  [System.IO.File]::WriteAllText(
    (Join-Path $destino ($p.slug + ".md")),
    ($fm -join "`n") + $md,
    (New-Object System.Text.UTF8Encoding($false))
  )

  $palabras = (($md -split '\s+') | Where-Object { $_ -ne '' }).Count
  Write-Output ("{0,-26} {1,5} palabras" -f $p.slug, $palabras)
}
