#Requires -Version 7
<#
.SYNOPSIS
  ArcInvestments server management script.
.DESCRIPTION
  Start, stop, restart, or check the status of the Vite dev or preview server.
.PARAMETER Env
  Target environment: dev (port 5179) or prod (port 4179).
.PARAMETER Action
  Action to perform: start | stop | restart | status.
.EXAMPLE
  .\ArcInvestments.ps1 dev start
  .\ArcInvestments.ps1 prod stop
  .\ArcInvestments.ps1 dev status
#>

param(
  [Parameter(Position = 0, Mandatory)]
  [ValidateSet('dev', 'prod')]
  [string]$Env,

  [Parameter(Position = 1, Mandatory)]
  [ValidateSet('start', 'stop', 'restart', 'status')]
  [string]$Action
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ── paths & config ────────────────────────────────────────────────────────────

$Root      = $PSScriptRoot
$StateDir  = Join-Path $Root '.server'
$LogDir    = Join-Path $StateDir 'logs'

$Config = @{
  dev  = @{ Port = 5179; PidFile = Join-Path $StateDir 'dev.pid';  LogFile = Join-Path $LogDir 'dev.log';  Command = 'cmd'; Args = @('/c', 'npm run dev') }
  prod = @{ Port = 4179; PidFile = Join-Path $StateDir 'prod.pid'; LogFile = Join-Path $LogDir 'prod.log'; Command = 'cmd'; Args = @('/c', 'npm run preview') }
}

# ── helpers ───────────────────────────────────────────────────────────────────

function Write-Tag([string]$msg, [string]$color = 'Cyan') {
  Write-Host '[ArcInvestments] ' -NoNewline -ForegroundColor $color
  Write-Host $msg
}

function Test-ProcessRunning([string]$pidFile) {
  if (-not (Test-Path $pidFile)) { return $false }
  $pid = [int](Get-Content $pidFile -Raw).Trim()
  try {
    $proc = Get-Process -Id $pid -ErrorAction Stop
    return $true
  } catch {
    return $false
  }
}

function Get-StoredPid([string]$pidFile) {
  return [int](Get-Content $pidFile -Raw).Trim()
}

# ── actions ───────────────────────────────────────────────────────────────────

function Start-Server([string]$env) {
  $cfg = $Config[$env]

  if (Test-ProcessRunning $cfg.PidFile) {
    $existingPid = Get-StoredPid $cfg.PidFile
    Write-Tag "$env server is already running (PID $existingPid, port $($cfg.Port))" 'Yellow'
    return
  }

  # Build first if prod and no dist/
  if ($env -eq 'prod' -and -not (Test-Path (Join-Path $Root 'dist'))) {
    Write-Tag 'No dist/ folder found — building first...' 'Yellow'
    & cmd /c 'npm run build'
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
  }

  # Ensure directories exist
  New-Item -ItemType Directory -Force -Path $StateDir | Out-Null
  New-Item -ItemType Directory -Force -Path $LogDir  | Out-Null

  Write-Tag "Starting $env server on port $($cfg.Port)..."

  $proc = Start-Process `
    -FilePath     $cfg.Command `
    -ArgumentList $cfg.Args `
    -WorkingDirectory $Root `
    -RedirectStandardOutput $cfg.LogFile `
    -RedirectStandardError  ($cfg.LogFile -replace '\.log$', '.err.log') `
    -PassThru `
    -WindowStyle Hidden

  Set-Content -Path $cfg.PidFile -Value $proc.Id

  Start-Sleep -Milliseconds 1500

  if (Test-ProcessRunning $cfg.PidFile) {
    Write-Tag "$env server started (PID $($proc.Id))" 'Green'
    Write-Host "  URL  : http://localhost:$($cfg.Port)" -ForegroundColor Gray
    Write-Host "  Log  : $($cfg.LogFile)"              -ForegroundColor Gray
  } else {
    Write-Tag 'ERROR: server failed to start. Check log for details.' 'Red'
    Write-Host "  Log  : $($cfg.LogFile)" -ForegroundColor Gray
    Remove-Item -Force $cfg.PidFile -ErrorAction SilentlyContinue
    exit 1
  }
}

function Stop-Server([string]$env) {
  $cfg = $Config[$env]

  if (-not (Test-ProcessRunning $cfg.PidFile)) {
    Write-Tag "$env server is not running." 'Yellow'
    return
  }

  $storedPid = Get-StoredPid $cfg.PidFile
  Write-Tag "Stopping $env server (PID $storedPid)..."

  try {
    Stop-Process -Id $storedPid -ErrorAction Stop

    # Wait up to 5 s
    $deadline = (Get-Date).AddSeconds(5)
    while ((Get-Date) -lt $deadline) {
      try { Get-Process -Id $storedPid -ErrorAction Stop | Out-Null }
      catch { break }
      Start-Sleep -Milliseconds 500
    }

    # Force-kill if still alive
    try {
      Get-Process -Id $storedPid -ErrorAction Stop | Out-Null
      Write-Tag 'Process did not exit cleanly — force killing...' 'Yellow'
      Stop-Process -Id $storedPid -Force -ErrorAction SilentlyContinue
    } catch { <# already gone #> }

  } catch {
    Write-Tag "Could not stop process $storedPid — it may have already exited." 'Yellow'
  }

  Remove-Item -Force $cfg.PidFile -ErrorAction SilentlyContinue
  Write-Tag "$env server stopped." 'Green'
}

function Get-ServerStatus([string]$env) {
  $cfg = $Config[$env]

  if (Test-ProcessRunning $cfg.PidFile) {
    $storedPid = Get-StoredPid $cfg.PidFile
    Write-Tag "$env server is RUNNING" 'Green'
    Write-Host "  PID  : $storedPid"                          -ForegroundColor Gray
    Write-Host "  Port : $($cfg.Port)"                        -ForegroundColor Gray
    Write-Host "  URL  : http://localhost:$($cfg.Port)"       -ForegroundColor Gray
    Write-Host "  Log  : $($cfg.LogFile)"                     -ForegroundColor Gray
  } else {
    Write-Tag "$env server is STOPPED" 'Red'
    if (Test-Path $cfg.LogFile) {
      Write-Host "  Last log: $($cfg.LogFile)" -ForegroundColor Gray
    }
  }
}

# ── entry point ───────────────────────────────────────────────────────────────

switch ($Action) {
  'start'   { Start-Server $Env }
  'stop'    { Stop-Server  $Env }
  'restart' { Stop-Server  $Env; Start-Server $Env }
  'status'  { Get-ServerStatus $Env }
}
