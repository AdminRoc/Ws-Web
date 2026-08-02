$targetDir = "C:\Users\Colin Roc\Documents\GitHub\Ws-Web\dmg\img\mods"
$baseUrl = "https://warframe-damage.com/data/mods"
$jsFile = "C:\Users\Colin Roc\.local\share\opencode\tool-output\modsProps_extracted.js"

if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "Created directory: $targetDir"
}

$content = Get-Content $jsFile -Raw
$matches = [regex]::Matches($content, 'img:"([^"]+)"')
$imgs = $matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

Write-Host "Total unique images to download: $($imgs.Count)"

$success = 0
$failed = 0
$skipped = 0

foreach ($img in $imgs) {
    $outFile = Join-Path $targetDir $img

    if (Test-Path $outFile) {
        $skipped++
        continue
    }

    $url = "$baseUrl/$img"
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -ErrorAction Stop -TimeoutSec 15
        $success++
        Write-Host "[OK] $img"
    }
    catch {
        $failed++
        Write-Host "[FAIL] $img - $($_.Exception.Message)"
    }

    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "=== Download Summary ==="
Write-Host "Skipped (already exist): $skipped"
Write-Host "Downloaded: $success"
Write-Host "Failed: $failed"
