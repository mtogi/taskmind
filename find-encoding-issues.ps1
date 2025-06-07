# PowerShell script to find files with potential encoding issues
$files = Get-ChildItem -Path . -Filter *.tsx -Recurse -ErrorAction SilentlyContinue
foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -ErrorAction SilentlyContinue
        if ($content -ne $null) {
            $contentStr = [string]::Join("", $content)
            if ($contentStr -match "\xEF\xBB\xBF" -or $contentStr -match "\uFEFF") {
                Write-Host "Found BOM mark in file: $($file.FullName)"
            }
        }
    } catch {
        Write-Host "Error processing file: $($file.FullName)" -ForegroundColor Red
    }
}

Write-Host "Scan complete." 