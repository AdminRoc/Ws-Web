# Weapon thumbnail downloader for Warframe damage calculator

$targetDir = "C:\Users\Colin Roc\Documents\GitHub\Ws-Web\dmg\img\weapons"
$gameDataFile = "C:\Users\Colin Roc\Documents\GitHub\Ws-Web\dmg\js\game-data.js"
$baseUrl = "https://warframe-damage.com/data/img"
$delayMs = 80

if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

Write-Host "Reading weapon data..."
$lines = Get-Content $gameDataFile -Encoding UTF8

# Parse weaponList entries by reading line-by-line
$weaponNames = @()
$inWeaponList = $false
$currentName = $null

foreach ($line in $lines) {
    if ($line -match 'weaponList:') { $inWeaponList = $true; continue }
    if ($inWeaponList -and $line -match '^\s*\]') { break }
    if ($inWeaponList -and $line -match '"name"\s*:\s*"([^"]+)"') {
        $currentName = $Matches[1]
    }
    if ($inWeaponList -and $currentName -and $line -match '"nameZh"\s*:\s*"([^"]+)"') {
        $weaponNames += $currentName
        $currentName = $null
    }
}

Write-Host "Found $($weaponNames.Count) weapons"
Write-Host ""

$success = 0; $failed = 0; $skipped = 0; $i = 0

foreach ($name in $weaponNames) {
    $i++
    $filename = $name.ToLower().Replace(' ', '') + '.webp'
    $dest = Join-Path $targetDir $filename

    if (Test-Path $dest) { $skipped++; continue }

    $url = "$baseUrl/$filename"
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop -TimeoutSec 10
        $success++
        Write-Host "[$i/$($weaponNames.Count)] OK: $name" -ForegroundColor Green
    } catch {
        if (Test-Path $dest) { Remove-Item $dest -Force }
        $failed++
    }

    if ($delayMs -gt 0) { Start-Sleep -Milliseconds $delayMs }
}

Write-Host ""
Write-Host "===== Done =====" -ForegroundColor Cyan
Write-Host "Total weapons: $($weaponNames.Count)"
Write-Host "Downloaded: $success" -ForegroundColor Green
Write-Host "Skipped (exists): $skipped" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
