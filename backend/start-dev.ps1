$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir '.mail.env'

if (-not (Test-Path -LiteralPath $envFile)) {
  throw "Missing local secrets file: $envFile. Copy .mail.env.example to .mail.env and fill in your private values."
}

Get-Content -LiteralPath $envFile | ForEach-Object {
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
}

if (-not $env:APP_JWT_SECRET) {
  throw 'APP_JWT_SECRET is missing from backend/.mail.env.'
}

$mvn = (Get-Command mvn.cmd -ErrorAction Stop).Source
& $mvn '-Dmaven.repo.local=..\.m2\repository' '-Dspring-boot.run.fork=true' 'spring-boot:run'
