#!/usr/bin/env bash
# ==============================================================================
# GarbaConnect Release Keystore Generator (RSA 2048-bit, 10,000 days validity)
# ==============================================================================

set -euo pipefail

KEYSTORE_DIR="./android/app"
KEYSTORE_PATH="${KEYSTORE_DIR}/release.jks"
KEY_ALIAS="${KEY_ALIAS:-garbaconnect}"
KEY_PASSWORD="${KEY_PASSWORD:-GarbaConnect2026SecurePass}"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-GarbaConnect2026SecurePass}"

mkdir -p "${KEYSTORE_DIR}"

if [ -f "${KEYSTORE_PATH}" ]; then
  echo "⚠️ Keystore already exists at ${KEYSTORE_PATH}. Skipping generation."
  exit 0
fi

echo "🔐 Generating secure production RSA 2048-bit release keystore..."

keytool -genkeypair -v \
  -keystore "${KEYSTORE_PATH}" \
  -alias "${KEY_ALIAS}" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "${KEYSTORE_PASSWORD}" \
  -keypass "${KEY_PASSWORD}" \
  -dname "CN=GarbaConnect, OU=Mobile, O=HarshalBane, L=Ahmedabad, ST=Gujarat, C=IN"

echo "✅ Keystore successfully created at: ${KEYSTORE_PATH}"
echo "--------------------------------------------------------"
echo "To export for GitHub Actions CI/CD secret 'KEYSTORE_BASE64':"
echo "base64 -w 0 ${KEYSTORE_PATH}"
echo "--------------------------------------------------------"
