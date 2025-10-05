# Quick Deploy Script - PowerShell Syntax
# Equivalent to: hugo && netlify deploy --prod --dir=public

Write-Host "🚀 Quick Deploy to Netlify" -ForegroundColor Green

# PowerShell equivalent of && operator
try {
    # Run Hugo build
    Write-Host "Building Hugo..." -ForegroundColor Yellow
    hugo --gc --minify
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Hugo build successful!" -ForegroundColor Green
        
        # Run Netlify deploy
        Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
        npx netlify-cli deploy --prod --dir=public
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Netlify deployment successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Netlify deployment failed!" -ForegroundColor Red
            Write-Host "Try using: .\deploy-manual.ps1" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Hugo build failed!" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error occurred: $_" -ForegroundColor Red
    Write-Host "Try using: .\deploy-manual.ps1" -ForegroundColor Yellow
}
