@echo off
echo 🚀 Simple Deploy Script
echo ======================

echo Building Hugo site...
hugo --gc --minify

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo Deploying to Netlify...
    netlify deploy --prod --dir=public
) else (
    echo ❌ Build failed!
)

pause