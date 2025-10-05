# Quick Deploy Script - PowerShell
# Chạy bằng: PowerShell -ExecutionPolicy Bypass -File quick-deploy.ps1

Write-Host "🚀 QUICK DEPLOY HappyMarketDocs" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Hugo
Write-Host "📋 Checking Hugo..." -ForegroundColor Yellow
try {
    $hugoVersion = hugo version
    Write-Host "✅ Hugo ready: $hugoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Hugo not found. Please install Hugo first." -ForegroundColor Red
    Write-Host "💡 Install with: choco install hugo-extended" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Kiểm tra Netlify CLI
Write-Host "📋 Checking Netlify CLI..." -ForegroundColor Yellow
try {
    $netlifyVersion = netlify --version
    Write-Host "✅ Netlify CLI ready: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Netlify CLI not found. Installing..." -ForegroundColor Yellow
    try {
        npm install -g netlify-cli
        Write-Host "✅ Netlify CLI installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Netlify CLI" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "🔧 Building project..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Clean previous build
if (Test-Path "public") {
    Remove-Item -Recurse -Force "public"
    Write-Host "🧹 Cleaned public directory" -ForegroundColor Yellow
}

if (Test-Path "resources") {
    Remove-Item -Recurse -Force "resources"
    Write-Host "🧹 Cleaned resources directory" -ForegroundColor Yellow
}

# Build Hugo site
Write-Host "🏗️  Building Hugo site..." -ForegroundColor Yellow
try {
    hugo --gc --minify
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if logged in to Netlify
Write-Host "🔐 Checking Netlify authentication..." -ForegroundColor Yellow
try {
    netlify status | Out-Null
    Write-Host "✅ Already logged in to Netlify" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Not logged in to Netlify. Please login..." -ForegroundColor Yellow
    Write-Host "🌐 Opening Netlify login in browser..." -ForegroundColor Cyan
    try {
        netlify login
        Write-Host "✅ Login successful" -ForegroundColor Green
    } catch {
        Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Deploy to Netlify
Write-Host "🌐 Deploying to production..." -ForegroundColor Yellow
try {
    netlify deploy --prod --dir=public --open
    Write-Host ""
    Write-Host "✅ DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "🌐 Your site is now live on Netlify!" -ForegroundColor Green
    Write-Host "📁 Build output: public/" -ForegroundColor Yellow
    Write-Host "🔗 Website should open in your browser automatically" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 Happy Deploying!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deploy failed!" -ForegroundColor Red
    Write-Host "💡 Try: netlify login first" -ForegroundColor Yellow
    Write-Host "💡 Or check your Netlify configuration" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"