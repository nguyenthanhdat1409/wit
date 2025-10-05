# PowerShell Script để Deploy HappyMarketDocs
# Chạy bằng: PowerShell -ExecutionPolicy Bypass -File deploy-now.ps1

Write-Host "🚀 DEPLOYING HappyMarketDocs..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Hugo
Write-Host "📋 Checking Hugo installation..." -ForegroundColor Yellow
try {
    $hugoVersion = hugo version
    Write-Host "✅ Hugo is installed: $hugoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Hugo is not installed. Please install Hugo first." -ForegroundColor Red
    Write-Host "💡 Install with: choco install hugo-extended" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Kiểm tra Node.js
Write-Host "📋 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Kiểm tra Netlify CLI
Write-Host "📋 Checking Netlify CLI..." -ForegroundColor Yellow
try {
    $netlifyVersion = netlify --version
    Write-Host "✅ Netlify CLI is ready: $netlifyVersion" -ForegroundColor Green
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
Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Deploy to Netlify
Write-Host "🌐 Deploying to production..." -ForegroundColor Yellow
try {
    netlify deploy --prod --dir=public
    Write-Host ""
    Write-Host "✅ DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "🌐 Your site is now live on Netlify!" -ForegroundColor Green
    Write-Host "📁 Build output: public/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🎉 Happy Deploying!" -ForegroundColor Green
} catch {
    Write-Host "❌ Deploy failed!" -ForegroundColor Red
    Write-Host "💡 Try: netlify login first" -ForegroundColor Yellow
    Write-Host "💡 Or check your Netlify configuration" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
