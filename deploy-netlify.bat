@echo off
echo Deploying to Netlify
echo ======================

echo.
echo Building Hugo site...
hugo --gc --minify

if %errorlevel% equ 0 (
    echo Hugo build successful!
    
    echo.
    echo Deploying to Netlify...
    npx netlify-cli deploy --prod --dir=public
    
    if %errorlevel% neq 0 (
        echo.
        echo npx netlify-cli failed, trying alternative...
        echo.
        echo Manual Upload Instructions:
        echo 1. Go to: https://app.netlify.com/drop
        echo 2. Drag the 'public' folder to the drop zone
        echo 3. Or use the auto-deployment setup we created
        echo.
        echo Opening public directory...
        start "" "public"
    ) else (
        echo Netlify deployment successful!
    )
) else (
    echo Hugo build failed!
    echo Please check your Hugo configuration and try again
    pause
    exit /b 1
)

echo.
echo Deploy script completed!
pause
