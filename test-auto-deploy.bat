@echo off
echo Testing Auto-Deployment for wikiw.vn
echo ===========================================

echo.
echo Checking Git status...
git status --porcelain

echo.
echo Creating test file...
echo # Auto-Deploy Test > AUTO-DEPLOY-TEST.md
echo. >> AUTO-DEPLOY-TEST.md
echo Test deployment tai: %date% %time% >> AUTO-DEPLOY-TEST.md
echo. >> AUTO-DEPLOY-TEST.md
echo ## Ket qua mong doi: >> AUTO-DEPLOY-TEST.md
echo - Auto-deploy triggered >> AUTO-DEPLOY-TEST.md
echo - Build successful >> AUTO-DEPLOY-TEST.md
echo - Website updated >> AUTO-DEPLOY-TEST.md
echo - Available at: https://wikiw.netlify.app >> AUTO-DEPLOY-TEST.md

echo.
echo Adding changes...
git add .

for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo.
echo Committing changes...
git commit -m "Test auto-deployment - %timestamp%"

if %errorlevel% equ 0 (
    echo Commit successful!
    
    echo.
    echo Pushing to GitHub...
    git push origin main
    
    if %errorlevel% equ 0 (
        echo Push successful!
        echo.
        echo Auto-deployment should be triggered!
        echo.
        echo Next Steps:
        echo 1. Check Netlify dashboard: https://app.netlify.com/projects/wikiw
        echo 2. Monitor deploy progress in 'Deploys' tab
        echo 3. Check website: https://wikiw.netlify.app
        echo 4. Verify test file appears on website
        echo.
        echo Expected timeline:
        echo - Build start: 1-2 minutes
        echo - Build complete: 3-5 minutes
        echo - Site live: 5-7 minutes total
    ) else (
        echo Push failed!
        echo Please check your Git configuration
    )
) else (
    echo Commit failed!
)

echo.
echo Test script completed!
echo See NETLIFY-AUTO-DEPLOY-SETUP.md for full setup guide
pause
