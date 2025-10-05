@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🚀 DEPLOYING HappyMarketDocs...
echo ========================================
echo.

REM Kiểm tra Hugo
echo 📋 Checking Hugo installation...
hugo version >nul 2>&1
if errorlevel 1 (
    echo ❌ Hugo is not installed. Please install Hugo first.
    echo 💡 Install with: choco install hugo-extended
    pause
    exit /b 1
)
echo ✅ Hugo is installed

REM Kiểm tra Node.js
echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

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
echo ✅ Netlify CLI is ready

echo.
echo 🔧 Building project...
echo ========================================

REM Clean previous build
if exist public rmdir /s /q public
if exist resources rmdir /s /q resources

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build Hugo site
echo 🏗️  Building Hugo site...
hugo --gc --minify
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo.
echo 🚀 Deploying to Netlify...
echo ========================================

REM Deploy to Netlify
echo 🌐 Deploying to production...
netlify deploy --prod --dir=public
if errorlevel 1 (
    echo ❌ Deploy failed!
    echo 💡 Try: netlify login first
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo 🌐 Your site is now live on Netlify!
echo 📁 Build output: public/
echo.
echo 🎉 Happy Deploying!
echo.

pause
