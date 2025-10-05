@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🔐 SETUP NETLIFY AUTHENTICATION
echo ========================================
echo.

REM Kiểm tra Netlify CLI
echo 📋 Checking Netlify CLI...
netlify --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Netlify CLI not found. Installing...
    npm install -g netlify-cli
    if errorlevel 1 (
        echo ❌ Failed to install Netlify CLI
        pause
        exit /b 1
    )
    echo ✅ Netlify CLI installed
) else (
    echo ✅ Netlify CLI ready
)

echo.
echo 🔐 Setting up Netlify Authentication...
echo ========================================

REM Kiểm tra trạng thái login
netlify status >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Not logged in to Netlify
    echo.
    echo 🌐 Opening Netlify login in browser...
    echo 📝 Please follow these steps:
    echo    1. Browser will open to Netlify login page
    echo    2. Login with your Netlify account
    echo    3. Authorize the CLI access
    echo    4. Return to this window
    echo.
    pause
    
    netlify login
    if errorlevel 1 (
        echo ❌ Login failed. Please try again.
        pause
        exit /b 1
    )
    echo ✅ Login successful!
) else (
    echo ✅ Already logged in to Netlify
)

echo.
echo 📊 Netlify Status:
netlify status

echo.
echo ✅ NETLIFY AUTHENTICATION SETUP COMPLETE!
echo ========================================
echo 🚀 You can now deploy directly to Netlify
echo 💡 Run: deploy-direct-netlify.bat
echo.

pause
