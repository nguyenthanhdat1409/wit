@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo 🚀 COMMIT & DEPLOY - HappyMarketDocs
echo ========================================
echo.

REM Kiểm tra Git
echo 📋 Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git not found. Please install Git
    pause
    exit /b 1
)
echo ✅ Git ready

REM Kiểm tra trạng thái Git
echo 📋 Checking Git status...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ❌ Not a Git repository
    pause
    exit /b 1
)

echo 📊 Current changes:
git status --short

echo.
echo 🔧 Building project...
echo ========================================

REM Build trước khi commit
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

echo ✅ Build completed!

echo.
echo 📝 Committing changes...
echo ========================================

REM Add all changes
git add .

REM Commit với timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"

git commit -m "deploy: auto-deploy at %timestamp%"

if errorlevel 1 (
    echo ⚠️  No changes to commit
) else (
    echo ✅ Changes committed
)

echo.
echo 🚀 Pushing to remote...
echo ========================================

git push

if errorlevel 1 (
    echo ❌ Push failed!
    echo 💡 Check your Git credentials and remote URL
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOYMENT TRIGGERED!
echo ========================================
echo 🌐 Changes pushed to repository
echo ⏳ Netlify will auto-deploy in 2-3 minutes
echo.
echo 🎉 Happy Deploying!
echo.

pause
