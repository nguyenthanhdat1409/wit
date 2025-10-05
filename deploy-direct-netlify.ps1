# PowerShell Script để Deploy TRỰC TIẾP lên Netlify (không cần GitHub)
# Chạy bằng: PowerShell -ExecutionPolicy Bypass -File deploy-direct-netlify.ps1

Write-Host "🚀 DEPLOY DIRECT TO NETLIFY (No GitHub)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Hugo
Write-Host "📋 Checking Hugo..." -ForegroundColor Yellow
try {
    $hugoVersion = hugo version
    Write-Host "✅ Hugo ready: $hugoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Hugo not found. Install with: choco install hugo-extended" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Kiểm tra Node.js
Write-Host "📋 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js ready: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
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

# Kiểm tra Netlify Authentication
Write-Host "🔐 Checking Netlify Authentication..." -ForegroundColor Yellow
try {
    $netlifyStatus = netlify status
    Write-Host "✅ Netlify authentication ready" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Not logged in to Netlify. Please login first..." -ForegroundColor Yellow
    Write-Host "🌐 Opening Netlify login in browser..." -ForegroundColor Cyan
    try {
        netlify login
        Write-Host "✅ Netlify login completed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
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

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
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
Write-Host "🚀 Deploying DIRECT to Netlify..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Deploy trực tiếp lên Netlify
Write-Host "🌐 Deploying to production (direct upload)..." -ForegroundColor Yellow
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
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Make sure you're logged in: netlify login" -ForegroundColor White
    Write-Host "   2. Check your internet connection" -ForegroundColor White
    Write-Host "   3. Try again: netlify deploy --prod --dir=public" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
