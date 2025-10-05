@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🚀 DEPLOY DIRECT TO NETLIFY (No GitHub)
echo ========================================
echo.

REM Kiểm tra Hugo
echo 📋 Checking Hugo...
hugo version >nul 2>&1
if errorlevel 1 (
    echo ❌ Hugo not found. Install with: choco install hugo-extended
    pause
    exit /b 1
)
echo ✅ Hugo ready

REM Kiểm tra Node.js
echo 📋 Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js
    pause
    exit /b 1
)
echo ✅ Node.js ready

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
)
echo ✅ Netlify CLI ready

echo.
echo 🔐 Checking Netlify Authentication...
netlify status >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Not logged in to Netlify. Please login first...
    echo.
    echo 🌐 Opening Netlify login in browser...
    netlify login
    if errorlevel 1 (
        echo ❌ Login failed. Please try again.
        pause
        exit /b 1
    )
)
echo ✅ Netlify authentication ready

echo.
echo 🔧 Building project...
echo ========================================

REM Clean previous build
if exist public rmdir /s /q public
if exist resources rmdir /s /q resources

echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🏗️  Building Hugo site...
hugo --gc --minify
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed!

echo.
echo 🚀 Deploying DIRECT to Netlify...
echo ========================================

REM Deploy trực tiếp lên Netlify
echo 🌐 Deploying to production (direct upload)...
netlify deploy --prod --dir=public --open
if errorlevel 1 (
    echo ❌ Deploy failed!
    echo.
    echo 💡 Troubleshooting:
    echo    1. Make sure you're logged in: netlify login
    echo    2. Check your internet connection
    echo    3. Try again: netlify deploy --prod --dir=public
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo 🌐 Your site is now live on Netlify!
echo 📁 Build output: public/
echo 🔗 Website should open in your browser automatically
echo.
echo 🎉 Happy Deploying!
echo.

pause
