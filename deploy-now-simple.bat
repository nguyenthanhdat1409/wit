@echo off
echo 🚀 DEPLOY NOW - HappyMarketDocs
echo ========================================
echo.

REM Build Hugo
echo 🏗️ Building Hugo site...
hugo --gc --minify
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

REM Deploy to Netlify
echo 🌐 Deploying to Netlify...
netlify deploy --prod --dir=public
if %errorlevel% neq 0 (
    echo ❌ Deploy failed!
    echo 💡 Try: netlify login first
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOYMENT COMPLETED!
echo 🌐 Your site is now live on Netlify!
echo ========================================
pause
