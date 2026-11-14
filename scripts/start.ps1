$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectPath
if (-not (Test-Path -LiteralPath (Join-Path $projectPath 'node_modules'))) { & npm.cmd ci; if ($LASTEXITCODE) { exit 1 } }
if (-not (Test-Path -LiteralPath (Join-Path $projectPath 'dist\index.html'))) { & npm.cmd run build; if ($LASTEXITCODE) { exit 1 } }
$ready = $false
try { $ready = (Invoke-RestMethod 'http://127.0.0.1:4173/health').app -eq 'estudos-mba' } catch {}
if (-not $ready) {
 Start-Process -FilePath 'node.exe' -ArgumentList 'scripts/server.mjs' -WorkingDirectory $projectPath -WindowStyle Hidden
 for ($tryCount = 0; $tryCount -lt 20; $tryCount++) {
  Start-Sleep -Milliseconds 250
  try { $ready = (Invoke-RestMethod 'http://127.0.0.1:4173/health').app -eq 'estudos-mba'; if ($ready) { break } } catch {}
 }
}
if (-not $ready) { throw 'Não foi possível iniciar o site na porta 4173.' }
Start-Process 'http://127.0.0.1:4173'
