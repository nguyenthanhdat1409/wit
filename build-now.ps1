# PowerShell Script để Build HappyMarketDocs
# Chạy bằng: PowerShell -ExecutionPolicy Bypass -File build-now.ps1

Write-Host "🚀 BUILDING HappyMarketDocs NOW..." -ForegroundColor Green
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
Write-Host "✅ BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📁 Output directory: public/" -ForegroundColor Yellow
Write-Host "📊 Build completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
Write-Host ""

# Kiểm tra kích thước thư mục public
if (Test-Path "public") {
    try {
        $publicFiles = Get-ChildItem -Path "public" -Recurse -File
        $totalSize = ($publicFiles | Measure-Object -Property Length -Sum).Sum
        $fileCount = $publicFiles.Count
        
        Write-Host "📊 Build statistics:" -ForegroundColor Cyan
        Write-Host "   📁 Public directory created" -ForegroundColor White
        Write-Host "   📄 Total files: $fileCount" -ForegroundColor White
        Write-Host "   💾 Total size: $([math]::Round($totalSize/1MB, 2)) MB" -ForegroundColor White
    } catch {
        Write-Host "   ⚠️  Could not get build statistics" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Upload 'public' folder to your hosting" -ForegroundColor White
Write-Host "   2. Or run: deploy-direct-netlify.bat" -ForegroundColor White
Write-Host "   3. Or run: netlify deploy --prod --dir=public" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy Building!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
