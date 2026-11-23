@echo off
setlocal

rem Edit these staff values before running this script.
rem MONGO_URI is read automatically from the backend .env file.
set "STAFF_NAME=Hotel Receptionist"
set "STAFF_EMAIL=receptionist@example.com"
set "STAFF_PASSWORD=ChangeMe123!"
set "STAFF_ROLE=receptionist"

cd /d "%~dp0.."
npx tsx scripts\createStaffUser.ts

endlocal
