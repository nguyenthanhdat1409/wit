@echo off
echo 🔄 Git Commit and Push Script
echo ================================

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not a git repository!
    echo Please initialize git first:
    echo git init
    echo git remote add origin ^<your-repo-url^>
    pause
    exit /b 1
)

echo 📊 Checking git status...
git status --porcelain

echo 📝 Adding all changes...
git add .

REM Get current timestamp for commit message
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

echo 💾 Committing changes...
git commit -m "Update content - %timestamp%"

if %errorlevel% equ 0 (
    echo ✅ Commit successful!
    
    echo 🚀 Pushing to remote repository...
    git push origin main
    
    if %errorlevel% equ 0 (
        echo ✅ Push successful!
        echo 🎉 Auto-deployment should be triggered!
        echo 📱 Check your Netlify dashboard for deployment status
    ) else (
        echo ❌ Push failed!
        echo Please check your git configuration and try again
    )
) else (
    echo ❌ Commit failed!
)

echo.
echo ✨ Script completed!
pause
