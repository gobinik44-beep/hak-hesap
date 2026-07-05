# Site yayinlaninca gercek adresi TEK KOMUTLA her yere isler.
# Kullanim:  .\alan-adi.ps1 https://kullanici.github.io/hak-hesap
param([Parameter(Mandatory=$true)][string]$YeniAdres)

$YeniAdres = $YeniAdres.TrimEnd("/")
Set-Location $PSScriptRoot

# Mevcut adresi veri.js'ten oku
$veri = Get-Content veri.js -Raw -Encoding utf8
if ($veri -match 'siteAdresi:\s*"([^"]+)"') { $eski = $Matches[1].TrimEnd("/") }
else { Write-Host "veri.js icinde siteAdresi bulunamadi."; exit 1 }

$dosyalar = @(Get-ChildItem *.html, *.xml, *.txt, *.js) + @(Get-Item ..\video-hatti\uret.py)
foreach ($d in $dosyalar) {
  $icerik = Get-Content $d.FullName -Raw -Encoding utf8
  if ($icerik -like "*$eski*") {
    ($icerik -replace [regex]::Escape($eski), $YeniAdres) |
      Set-Content $d.FullName -Encoding utf8 -NoNewline
    Write-Host "guncellendi: $($d.Name)"
  }
}
Write-Host "TAMAM: $eski -> $YeniAdres"
Write-Host "Simdi: (1) node test.js  (2) video-hatti'da 'python uret.py hepsi' ile aciklamalari yenile."
