# ==============================================================================
# GarbaConnect Release Keystore Generator (PowerShell for Windows)
# ==============================================================================

$ErrorActionPreference = "Stop"

$KeystoreDir = Join-Path $PSScriptRoot "..\android\app"
$KeystorePath = Join-Path $KeystoreDir "release.jks"
$KeyAlias = if ($env:KEY_ALIAS) { $env:KEY_ALIAS } else { "garbaconnect" }
$KeyPass = if ($env:KEY_PASSWORD) { $env:KEY_PASSWORD } else { "GarbaConnect2026SecurePass" }
$StorePass = if ($env:KEYSTORE_PASSWORD) { $env:KEYSTORE_PASSWORD } else { "GarbaConnect2026SecurePass" }

if (-not (Test-Path $KeystoreDir)) {
    New-Item -ItemType Directory -Force -Path $KeystoreDir | Out-Null
}

if (Test-Path $KeystorePath) {
    Write-Host "Keystore already exists at $KeystorePath. Skipping generation."
    exit 0
}

Write-Host "Generating secure production RSA 2048-bit release keystore..."

$keytoolCmd = "keytool"
$keytoolArgs = @(
    "-genkeypair",
    "-v",
    "-keystore", $KeystorePath,
    "-alias", $KeyAlias,
    "-keyalg", "RSA",
    "-keysize", "2048",
    "-validity", "10000",
    "-storepass", $StorePass,
    "-keypass", $KeyPass,
    "-dname", "CN=GarbaConnect, OU=Mobile, O=HarshalBane, L=Ahmedabad, ST=Gujarat, C=IN"
)

& $keytoolCmd $keytoolArgs

if (Test-Path $KeystorePath) {
    Write-Host "Keystore successfully created at: $KeystorePath"
    $bytes = [System.IO.File]::ReadAllBytes($KeystorePath)
    $b64 = [Convert]::ToBase64String($bytes)
    Write-Host "Keystore generated. Base64 length: $($b64.Length)"
}
