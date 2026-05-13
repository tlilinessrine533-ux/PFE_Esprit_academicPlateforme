$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot 'backend'
$mailEnvFile = Join-Path $backendDir '.mail.env'
$backendStdout = Join-Path $backendDir 'backend-live.stdout.log'
$backendStderr = Join-Path $backendDir 'backend-live.stderr.log'
$backendHealthUrl = 'http://localhost:8081/api/health'
$mavenRepo = '..\.m2\repository'

function Test-Url {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url
    )

    try {
        Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 3 | Out-Null
        return $true
    } catch {
        return $false
    }
}

function Import-KeyValueEnvFile {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path
    )

    if (-not (Test-Path $Path)) {
        return $false
    }

    foreach ($rawLine in Get-Content -Path $Path) {
        $line = $rawLine.Trim()
        if (-not $line -or $line.StartsWith('#')) {
            continue
        }

        $separatorIndex = $line.IndexOf('=')
        if ($separatorIndex -lt 1) {
            continue
        }

        $name = $line.Substring(0, $separatorIndex).Trim()
        $value = $line.Substring($separatorIndex + 1).Trim()

        if (
            ($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'"))
        ) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        Set-Item -Path "Env:$name" -Value $value
    }

    return $true
}

function Start-LoggedProcess {
    param(
        [Parameter(Mandatory = $true)]
        [string] $FilePath,

        [Parameter(Mandatory = $true)]
        [string[]] $ArgumentList,

        [Parameter(Mandatory = $true)]
        [string] $WorkingDirectory,

        [Parameter(Mandatory = $true)]
        [string] $StdoutPath,

        [Parameter(Mandatory = $true)]
        [string] $StderrPath
    )

    if (-not (Test-Path $StdoutPath)) {
        New-Item -ItemType File -Path $StdoutPath | Out-Null
    }

    if (-not (Test-Path $StderrPath)) {
        New-Item -ItemType File -Path $StderrPath | Out-Null
    }

    return Start-Process `
        -FilePath $FilePath `
        -ArgumentList $ArgumentList `
        -WorkingDirectory $WorkingDirectory `
        -RedirectStandardOutput $StdoutPath `
        -RedirectStandardError $StderrPath `
        -PassThru
}

function Wait-ForStableUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url,

        [int] $MaxAttempts = 90,
        [int] $DelaySeconds = 2,
        [int] $StableSuccessCount = 3
    )

    $consecutiveSuccess = 0
    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        Start-Sleep -Seconds $DelaySeconds

        if (Test-Url -Url $Url) {
            $consecutiveSuccess += 1
            if ($consecutiveSuccess -ge $StableSuccessCount) {
                return $true
            }
            continue
        }

        $consecutiveSuccess = 0
    }

    return $false
}

$maven = Get-Command mvn.cmd -ErrorAction Stop

if (Import-KeyValueEnvFile -Path $mailEnvFile) {
    Write-Host "Loaded mail configuration from $mailEnvFile."
} else {
    Write-Host "Mail configuration file not found. Backend will start without backend/.mail.env."
}

if (-not $env:APP_JWT_SECRET -or -not $env:APP_JWT_SECRET.Trim()) {
    $env:APP_JWT_SECRET = 'dev-only-jwt-secret-change-this-value-before-production-2026'
}

$backendProcesses = @(Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique)

if ($backendProcesses.Count -gt 0) {
    foreach ($processId in $backendProcesses) {
        Write-Host "Stopping backend process on port 8081 (PID $processId)..."
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }

    foreach ($attempt in 1..20) {
        Start-Sleep -Milliseconds 500
        $remainingProcesses = @(Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique)
        if ($remainingProcesses.Count -eq 0) {
            break
        }
    }
} else {
    Write-Host 'No backend process was listening on port 8081.'
}

Set-Content -Path $backendStdout -Value ''
Set-Content -Path $backendStderr -Value ''

Write-Host 'Starting backend and waiting for health check...'
$backendProcess = Start-LoggedProcess `
    -FilePath $maven.Source `
    -ArgumentList @("-Dmaven.repo.local=$mavenRepo", 'spring-boot:run') `
    -WorkingDirectory $backendDir `
    -StdoutPath $backendStdout `
    -StderrPath $backendStderr

$backendReady = Wait-ForStableUrl -Url $backendHealthUrl -MaxAttempts 90 -DelaySeconds 2 -StableSuccessCount 3

if (-not $backendReady) {
    Write-Host 'Backend failed to become healthy. Check the log files below:'
    Write-Host "  $backendStdout"
    Write-Host "  $backendStderr"
    if ($backendProcess.HasExited) {
        Write-Host "Backend launcher process exited with code $($backendProcess.ExitCode)."
    }
    exit 1
}

Write-Host "Backend ready on http://localhost:8081 (PID $($backendProcess.Id))."
Write-Host "Backend stdout: $backendStdout"
Write-Host "Backend stderr: $backendStderr"
