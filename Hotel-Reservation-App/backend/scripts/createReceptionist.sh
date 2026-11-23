#!/usr/bin/env sh

# Edit these staff values before running this script.
# MONGO_URI is read automatically from the backend .env file.
STAFF_NAME="Hotel Receptionist"
STAFF_EMAIL="receptionist@example.com"
STAFF_PASSWORD="ChangeMe123!"
STAFF_ROLE="receptionist"

export STAFF_NAME STAFF_EMAIL STAFF_PASSWORD STAFF_ROLE

cd "$(dirname "$0")/.." || exit 1
npx tsx scripts/createStaffUser.ts
