$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'
$rootEnvFile = Join-Path $repoRoot '.env'
$mailEnvFile = Join-Path $backendDir '.mail.env'

$backendStdout = Join-Path $backendDir 'backend-live.stdout.log'
$backendStderr = Join-Path $backendDir 'backend-live.stderr.log'
$frontendStdout = Join-Path $frontendDir 'frontend-live.stdout.log'
$frontendStderr = Join-Path $frontendDir 'frontend-live.stderr.log'
$mavenRepo = '..\.m2\repository'

$backendHealthUrl = 'http://localhost:8081/api/health'
$frontendUrl = 'http://localhost:4200'
$frontendProxyHealthUrl = 'http://localhost:4200/api/health'

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

function Wait-ForStableUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url,

        [int] $MaxAttempts = 60,
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

function Test-FrontendApiProxy {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Url
    )

    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 5
        $contentType = [string] $response.Headers['Content-Type']
        $content = [string] $response.Content

        if ($contentType -like 'application/json*') {
            return $true
        }

        if ($content -match '"status"\s*:\s*"(UP|OK|up|ok)"') {
            return $true
        }

        return $false
    } catch {
        return $false
    }
}

function Get-ListeningProcessIds {
    param(
        [Parameter(Mandatory = $true)]
        [int] $Port
    )

    return @(
        Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
    )
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

        $normalizedName = ($name -replace '[\.\-]', '_').ToUpperInvariant()
        if ($normalizedName -and $normalizedName -ne $name) {
            Set-Item -Path "Env:$normalizedName" -Value $value
        }
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

$maven = Get-Command mvn.cmd -ErrorAction Stop
$npm = Get-Command npm.cmd -ErrorAction Stop

if (Import-KeyValueEnvFile -Path $rootEnvFile) {
    Write-Host "Loaded environment values from $rootEnvFile."
}

if (Import-KeyValueEnvFile -Path $mailEnvFile) {
    Write-Host "Loaded mail configuration from $mailEnvFile."
} else {
    Write-Host "Mail configuration file not found. Password reset emails will stay in fallback mode until backend/.mail.env is created."
}

if (-not $env:APP_JWT_SECRET -or -not $env:APP_JWT_SECRET.Trim()) {
    $env:APP_JWT_SECRET = 'dev-only-jwt-secret-change-this-value-before-production-2026'
}

if (Test-Url -Url $backendHealthUrl) {
    Write-Host 'Backend already available on http://localhost:8081.'
    if (Test-Path $mailEnvFile) {
        Write-Host 'If you just updated backend/.mail.env, restart the backend process so the new mail settings are applied.'
    }
} else {
    Write-Host 'Starting backend and waiting for health check...'
    Set-Content -Path $backendStdout -Value ''
    Set-Content -Path $backendStderr -Value ''

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

    $backendPids = Get-ListeningProcessIds -Port 8081
    if ($backendPids.Count -gt 0) {
        Write-Host "Backend ready on http://localhost:8081 (PID $($backendPids -join ', '))."
    } else {
        Write-Host "Backend ready on http://localhost:8081 (launcher PID $($backendProcess.Id))."
    }
}

if (Test-Url -Url $frontendUrl) {
    if (Test-FrontendApiProxy -Url $frontendProxyHealthUrl) {
        Write-Host 'Frontend already available on http://localhost:4200 with API proxy enabled.'
    } else {
        Write-Host 'Frontend is running on port 4200, but API proxy is not active. Restarting frontend with proxy config...'
        $frontendPids = Get-ListeningProcessIds -Port 4200
        foreach ($processId in $frontendPids) {
            try {
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Write-Host "Stopped existing frontend process (PID $processId)."
            } catch {
                Write-Host "Warning: Failed to stop existing frontend process (PID $processId)."
            }
        }
    }
}

if (-not (Test-Url -Url $frontendUrl) -or -not (Test-FrontendApiProxy -Url $frontendProxyHealthUrl)) {
    Write-Host 'Starting frontend and waiting for health check...'
    Set-Content -Path $frontendStdout -Value ''
    Set-Content -Path $frontendStderr -Value ''

    $frontendProcess = Start-LoggedProcess `
        -FilePath $npm.Source `
        -ArgumentList @('start') `
        -WorkingDirectory $frontendDir `
        -StdoutPath $frontendStdout `
        -StderrPath $frontendStderr

    $frontendReady = Wait-ForStableUrl -Url $frontendUrl -MaxAttempts 60 -DelaySeconds 2 -StableSuccessCount 2

    if (-not $frontendReady) {
        Write-Host 'Frontend failed to become healthy. Check the log files below:'
        Write-Host "  $frontendStdout"
        Write-Host "  $frontendStderr"
        if ($frontendProcess.HasExited) {
            Write-Host "Frontend process exited with code $($frontendProcess.ExitCode)."
        }
        exit 1
    }

    Write-Host "Frontend ready on http://localhost:4200 (PID $($frontendProcess.Id))."
}

Write-Host ''
Write-Host 'Application is ready:'
Write-Host '  Frontend: http://localhost:4200'
Write-Host '  Backend:  http://localhost:8081/api/health'
Write-Host ''
Write-Host 'Live logs:'
Write-Host "  Backend stdout:  $backendStdout"
Write-Host "  Backend stderr:  $backendStderr"
Write-Host "  Frontend stdout: $frontendStdout"
Write-Host "  Frontend stderr: $frontendStderr"
