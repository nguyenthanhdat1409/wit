@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🚀 BUILDING HappyMarketDocs NOW...
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

REM Clean previous build
if exist public (
    echo 🧹 Cleaning public directory...
    rmdir /s /q public
    echo ✅ Cleaned public directory
)

if exist resources (
    echo 🧹 Cleaning resources directory...
    rmdir /s /q resources
    echo ✅ Cleaned resources directory
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

REM Build Hugo site
echo 🏗️  Building Hugo site...
hugo --gc --minify
if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo 📁 Output directory: public/
echo 📊 Build completed at: %date% %time%
echo.
echo 🌐 Next steps:
echo    1. Upload 'public' folder to your hosting
echo    2. Or run: deploy-direct-netlify.bat
echo    3. Or run: netlify deploy --prod --dir=public
echo.

REM Kiểm tra kích thước thư mục public
if exist public (
    echo 📊 Build statistics:
    dir public /s /-c | find "File(s)"
    echo.
)

echo 🎉 Happy Building!
echo.

pause
