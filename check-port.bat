@echo off
echo Checking if port 3002 is in use...
netstat -ano | findstr :3002
if %ERRORLEVEL% EQU 0 (
    echo Port 3002 is in use
) else (
    echo Port 3002 is NOT in use - Server is not running!
)
pause

