# Deploy to Netlify Script - PowerShell Version
# Fixes the && syntax error in PowerShell

Write-Host "🚀 Deploying to Netlify" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Step 1: Build Hugo site
Write-Host "`n📦 Building Hugo site..." -ForegroundColor Yellow
hugo --gc --minify

# Check if Hugo build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Hugo build successful!" -ForegroundColor Green
    
    # Step 2: Deploy to Netlify
    Write-Host "`n🚀 Deploying to Netlify..." -ForegroundColor Yellow
    
    # Try different Netlify CLI methods
    Write-Host "Trying npx netlify-cli..." -ForegroundColor Cyan
    npx netlify-cli deploy --prod --dir=public
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n⚠️  npx netlify-cli failed, trying alternative..." -ForegroundColor Yellow
        
        # Alternative: Manual upload instruction
        Write-Host "`n📋 Manual Upload Instructions:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://app.netlify.com/drop" -ForegroundColor White
        Write-Host "2. Drag the 'public' folder to the drop zone" -ForegroundColor White
        Write-Host "3. Or use the auto-deployment setup we created" -ForegroundColor White
        
        Write-Host "`n📂 Opening public directory..." -ForegroundColor Yellow
        Start-Process "public"
    } else {
        Write-Host "✅ Netlify deployment successful!" -ForegroundColor Green
    }
    
} else {
    Write-Host "❌ Hugo build failed!" -ForegroundColor Red
    Write-Host "Please check your Hugo configuration and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✨ Deploy script completed!" -ForegroundColor Green
