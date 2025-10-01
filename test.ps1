Write-Host "Running quick test..." -ForegroundColor Green
node quick-test.js
Write-Host "Test completed. Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
