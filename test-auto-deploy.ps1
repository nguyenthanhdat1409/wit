# Test Auto-Deployment Script for wikiw.vn
# This script tests the auto-deployment workflow

Write-Host "🚀 Testing Auto-Deployment for wikiw.vn" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Check git status
Write-Host "`n📊 Checking Git status..." -ForegroundColor Yellow
git status --porcelain

# Add a test file to trigger deployment
$testContent = @"
# Auto-Deploy Test

Test deployment tại: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Kết quả mong đợi:
- ✅ Auto-deploy triggered
- ✅ Build successful  
- ✅ Website updated
- ✅ Available at: https://wikiw.netlify.app

## Build Settings:
- Build command: hugo --gc --minify
- Publish directory: public
- Hugo version: 0.150.0
"@

Write-Host "`n📝 Creating test file..." -ForegroundColor Yellow
$testContent | Out-File -FilePath "AUTO-DEPLOY-TEST.md" -Encoding UTF8

# Add and commit changes
Write-Host "`n📦 Adding changes..." -ForegroundColor Yellow
git add .

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Test auto-deployment - $timestamp"

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    
    Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push successful!" -ForegroundColor Green
        Write-Host "`n🎉 Auto-deployment should be triggered!" -ForegroundColor Green
        
        Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
        Write-Host "1. Check Netlify dashboard: https://app.netlify.com/projects/wikiw" -ForegroundColor White
        Write-Host "2. Monitor deploy progress in 'Deploys' tab" -ForegroundColor White
        Write-Host "3. Check website: https://wikiw.netlify.app" -ForegroundColor White
        Write-Host "4. Verify test file appears on website" -ForegroundColor White
        
        Write-Host "`n⏱️  Expected timeline:" -ForegroundColor Cyan
        Write-Host "- Build start: 1-2 minutes" -ForegroundColor White
        Write-Host "- Build complete: 3-5 minutes" -ForegroundColor White
        Write-Host "- Site live: 5-7 minutes total" -ForegroundColor White
        
    } else {
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host "Please check your Git configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Commit failed!" -ForegroundColor Red
}

Write-Host "`n✨ Test script completed!" -ForegroundColor Green
Write-Host "📖 See NETLIFY-AUTO-DEPLOY-SETUP.md for full setup guide" -ForegroundColor Cyan
