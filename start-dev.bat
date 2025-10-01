@echo off
echo Starting HappyMarketDocs development environment...

echo Starting API server on port 3001...
start "API Server" cmd /k "node simple-server.js"

echo Waiting 3 seconds for API server to start...
timeout /t 3 /nobreak >nul

echo Starting Hugo development server on port 1313...
start "Hugo Server" cmd /k "hugo server -D --disableFastRender --bind 0.0.0.0 --baseURL http://localhost:1313"

echo.
echo ========================================
echo Development servers started!
echo ========================================
echo API Server: http://localhost:3001
echo Hugo Site:  http://localhost:1313
echo Admin Panel: http://localhost:1313/admin/
echo ========================================
echo.
echo Press any key to exit...
pause >nul
