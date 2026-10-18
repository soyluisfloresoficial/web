param([string]$MirrorDir = "mirror")

function VisibleText([string]$c) {
  $c = [regex]::Replace($c, '<script[\s\S]*?</script>', ' ')
  $c = [regex]::Replace($c, '<style[\s\S]*?</style>', ' ')
  $c = [regex]::Replace($c, '<noscript[\s\S]*?</noscript>', ' ')
  $c = [regex]::Replace($c, '<[^>]+>', ' ')
  return [regex]::Replace($c, '\s+', ' ')
}

$files = Get-ChildItem (Join-Path $MirrorDir "*.html") | Sort-Object Name

Write-Output "===== A. Imagenes OG distintas ====="
$ogset = @{}
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $og = [regex]::Match($c, '<meta property="og:image" content="(.*?)"').Groups[1].Value
  if (-not $ogset.ContainsKey($og)) { $ogset[$og] = 0 }
  $ogset[$og] = $ogset[$og] + 1
}
foreach ($k in $ogset.Keys) { Write-Output ("  " + $k + "  -> usada en " + $ogset[$k] + " paginas") }
Write-Output ("  TOTAL distintas: " + $ogset.Keys.Count)

Write-Output ""
Write-Output "===== B. Metricas en texto visible (sin CSS ni JS) ====="
foreach ($f in $files) {
  $t = VisibleText ([System.IO.File]::ReadAllText($f.FullName))
  $hits = @()
  foreach ($p in @('73\s*%', '40\s*%', '12\s*h(oras)?')) {
    $ms = [regex]::Matches($t, $p)
    if ($ms.Count -gt 0) { $hits += ($p + " x" + $ms.Count) }
  }
  if ($hits.Count -gt 0) { Write-Output ("  " + $f.BaseName + ": " + ($hits -join ' | ')) }
}

Write-Output ""
Write-Output "===== C. Contexto de las cifras en la home ====="
$t = VisibleText ([System.IO.File]::ReadAllText((Join-Path $MirrorDir "home.html")))
foreach ($p in @('73\s*%', '40\s*%', '12\s*h')) {
  foreach ($m in [regex]::Matches($t, $p)) {
    $s = [Math]::Max(0, $m.Index - 90)
    $len = [Math]::Min(200, $t.Length - $s)
    Write-Output ("  [" + $m.Value + "] ..." + $t.Substring($s, $len).Trim() + "...")
  }
}

Write-Output ""
Write-Output "===== D. Imagenes sin atributo alt ====="
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  $bad = @()
  foreach ($im in [regex]::Matches($c, '<img\b[^>]*>')) {
    if (-not [regex]::IsMatch($im.Value, '\balt=')) {
      $src = [regex]::Match($im.Value, '\bsrc="([^"]*)"').Groups[1].Value
      if ($src -eq '') { $src = '(sin src, usa srcset)' }
      $bad += $src
    }
  }
  if ($bad.Count -gt 0) {
    Write-Output ("  " + $f.BaseName + " (" + $bad.Count + "):")
    foreach ($b in ($bad | Select-Object -Unique)) { Write-Output ("     " + $b) }
  }
}

Write-Output ""
Write-Output "===== E. H1 de la home: espaciado entre spans ====="
$c = [System.IO.File]::ReadAllText((Join-Path $MirrorDir "home.html"))
$h1 = [regex]::Match($c, '<h1[\s\S]*?</h1>').Value
Write-Output ("  MARCADO: " + ($h1 -replace '\s+', ' '))
Write-Output ("  TEXTO EXTRAIDO: " + (VisibleText $h1).Trim())

Write-Output ""
Write-Output "===== F. Marquee: aria-hidden en la copia duplicada ====="
foreach ($nm in @("home","servicios","blog")) {
  $c = [System.IO.File]::ReadAllText((Join-Path $MirrorDir ($nm + ".html")))
  $mq = [regex]::Matches($c, '<[^>]*marquee[^>]*>')
  Write-Output ("  " + $nm + ": " + $mq.Count + " elementos con 'marquee' en el tag")
  foreach ($m in $mq) { Write-Output ("     " + ($m.Value -replace '\s+',' ')) }
}

Write-Output ""
Write-Output "===== G. GTM ====="
$c = [System.IO.File]::ReadAllText((Join-Path $MirrorDir "home.html"))
$gtm = [regex]::Matches($c, 'GTM-[A-Z0-9]+')
Write-Output ("  IDs GTM encontrados: " + $gtm.Count)
foreach ($g in ($gtm | Select-Object -Unique)) { Write-Output ("     " + $g.Value) }
Write-Output ("  Test contra cadena vacia presente: " + [regex]::IsMatch($c, '\^GTM-\[A-Z0-9\]\+\$/\.test\(``\)'))
