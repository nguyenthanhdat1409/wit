# Manual Deployment Script for HappyMarketDocs
# This script replaces Netlify CLI functionality

Write-Host "HappyMarketDocs Manual Deployment Script" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Step 1: Build Hugo site
Write-Host "Building Hugo site..." -ForegroundColor Yellow
hugo --gc --minify

if ($LASTEXITCODE -eq 0) {
    Write-Host "Hugo build successful!" -ForegroundColor Green
    
    # Step 2: Check if public directory exists
    if (Test-Path "public") {
        Write-Host "Public directory found" -ForegroundColor Green
        
        # Step 3: Show deployment options
        Write-Host "`nDeployment Options:" -ForegroundColor Cyan
        Write-Host "1. Manual upload to Netlify Dashboard" -ForegroundColor White
        Write-Host "2. Use Netlify Drop (drag & drop)" -ForegroundColor White
        Write-Host "3. Use Git-based deployment" -ForegroundColor White
        
        Write-Host "`nNext Steps:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://app.netlify.com/drop" -ForegroundColor White
        Write-Host "2. Drag the 'public' folder to the drop zone" -ForegroundColor White
        Write-Host "3. Or commit and push to your connected Git repository" -ForegroundColor White
        
        Write-Host "`nBuild Statistics:" -ForegroundColor Cyan
        $fileCount = (Get-ChildItem -Path "public" -Recurse -File).Count
        $totalSize = [math]::Round(((Get-ChildItem -Path "public" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB), 2)
        Write-Host "   Files: $fileCount" -ForegroundColor White
        Write-Host "   Size: $totalSize MB" -ForegroundColor White
        
        # Step 4: Open public directory
        Write-Host "`nOpening public directory..." -ForegroundColor Yellow
        Start-Process "public"
        
    } else {
        Write-Host "Public directory not found!" -ForegroundColor Red
    }
} else {
    Write-Host "Hugo build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nDeployment script completed!" -ForegroundColor Green
