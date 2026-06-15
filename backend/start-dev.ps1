$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir '.mail.env'
$rootEnvFile = Join-Path (Split-Path -Parent $scriptDir) '.env'

function Import-KeyValueEnvFile {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Path
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    return $false
  }

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) {
      return
    }

    $separatorIndex = $line.IndexOf('=')
    if ($separatorIndex -lt 1) {
      return
    }

    $key = $line.Substring(0, $separatorIndex).Trim()
    $value = $line.Substring($separatorIndex + 1).Trim()
    [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')

    $normalizedKey = ($key -replace '[\.\-]', '_').ToUpperInvariant()
    if ($normalizedKey -and $normalizedKey -ne $key) {
      [System.Environment]::SetEnvironmentVariable($normalizedKey, $value, 'Process')
    }
  }

  return $true
}

if (-not (Test-Path -LiteralPath $envFile)) {
  throw "Missing local secrets file: $envFile. Copy .mail.env.example to .mail.env and fill in your private values."
}

if (Import-KeyValueEnvFile -Path $rootEnvFile) {
  Write-Host "Loaded environment values from $rootEnvFile."
}

[void](Import-KeyValueEnvFile -Path $envFile)

if (-not $env:APP_JWT_SECRET) {
  throw 'APP_JWT_SECRET is missing from backend/.mail.env.'
}

$mvn = (Get-Command mvn.cmd -ErrorAction Stop).Source
& $mvn '-Dmaven.repo.local=..\.m2\repository' '-Dspring-boot.run.fork=true' 'spring-boot:run'
