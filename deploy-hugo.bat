@echo off
echo 🚀 Building and Deploying HappyMarketDocs...
echo ========================================

REM Check Hugo installation
echo 📋 Checking Hugo...
hugo version
if %errorlevel% neq 0 (
    echo ❌ Hugo not found. Please install Hugo first.
    pause
    exit /b 1
)

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist public rmdir /s /q public
if exist resources rmdir /s /q resources

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build Hugo site
echo 🏗️ Building Hugo site...
hugo --gc --minify
if %errorlevel% neq 0 (
    echo ❌ Hugo build failed
    pause
    exit /b 1
)

echo ✅ Hugo build completed successfully!

REM Deploy to Netlify
echo 🌐 Deploying to Netlify...
netlify deploy --prod --dir=public
if %errorlevel% neq 0 (
    echo ❌ Netlify deployment failed
    echo 💡 Try: netlify login first
    pause
    exit /b 1
)

echo ✅ DEPLOYMENT COMPLETED SUCCESSFULLY!
echo 🌐 Your site is now live on Netlify!
echo ========================================
pause
