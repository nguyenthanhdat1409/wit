@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🚀 SIMPLE DEPLOY - HappyMarketDocs
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

echo.
echo 🔧 Building project...
echo ========================================

REM Clean và build
if exist public rmdir /s /q public
if exist resources rmdir /s /q resources

echo 📦 Installing dependencies...
call npm install

echo 🏗️  Building Hugo site...
hugo --gc --minify

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ BUILD COMPLETED!
echo ========================================
echo 📁 Output: public/
echo.
echo 🌐 Next steps:
echo    1. Upload 'public' folder to your hosting
echo    2. Or use: npm run deploy (if Netlify CLI installed)
echo    3. Or use: deploy-now.bat (full Netlify deploy)
echo.

pause
