@echo off
echo 🚀 HappyMarketDocs Manual Deployment Script
echo ================================================

echo 📦 Building Hugo site...
hugo --gc --minify

if %errorlevel% equ 0 (
    echo ✅ Hugo build successful!
    
    if exist "public" (
        echo 📁 Public directory found
        
        echo.
        echo 🎯 Deployment Options:
        echo 1. Manual upload to Netlify Dashboard
        echo 2. Use Netlify Drop (drag & drop)
        echo 3. Use Git-based deployment
        
        echo.
        echo 📋 Next Steps:
        echo 1. Go to: https://app.netlify.com/drop
        echo 2. Drag the 'public' folder to the drop zone
        echo 3. Or commit and push to your connected Git repository
        
        echo.
        echo 📂 Opening public directory...
        start "" "public"
        
    ) else (
        echo ❌ Public directory not found!
    )
) else (
    echo ❌ Hugo build failed!
    exit /b 1
)

echo.
echo ✨ Deployment script completed!
pause
