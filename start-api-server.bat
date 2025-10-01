@echo off
echo ========================================
echo   Starting API Server for HappyMarketDocs
echo ========================================
echo.
echo Starting API server on port 3001...
echo.

cd /d "%~dp0"
node simple-server.js

pause


