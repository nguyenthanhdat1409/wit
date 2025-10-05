# Git Commit and Push Script for HappyMarketDocs
# This script commits changes and pushes to trigger auto-deployment

Write-Host "🔄 Git Commit and Push Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository!" -ForegroundColor Red
    Write-Host "Please initialize git first:" -ForegroundColor Yellow
    Write-Host "git init" -ForegroundColor White
    Write-Host "git remote add origin <your-repo-url>" -ForegroundColor White
    exit 1
}

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
git status --porcelain

$changes = git status --porcelain
if ([string]::IsNullOrEmpty($changes)) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Blue
    exit 0
}

# Add all changes
Write-Host "📝 Adding all changes..." -ForegroundColor Yellow
git add .

# Get current timestamp for commit message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Update content - $timestamp"

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    
    # Push to remote
    Write-Host "🚀 Pushing to remote repository..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push successful!" -ForegroundColor Green
        Write-Host "🎉 Auto-deployment should be triggered!" -ForegroundColor Green
        Write-Host "📱 Check your Netlify dashboard for deployment status" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Push failed!" -ForegroundColor Red
        Write-Host "Please check your git configuration and try again" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Commit failed!" -ForegroundColor Red
}

Write-Host "`n✨ Script completed!" -ForegroundColor Green
