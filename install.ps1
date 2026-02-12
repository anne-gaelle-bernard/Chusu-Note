# Script d'installation complète
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CHUSU NOTE - Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Installation des dépendances backend..." -ForegroundColor Yellow
cd backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend installé avec succès" -ForegroundColor Green
} else {
    Write-Host "× Erreur lors de l'installation du backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/2] Installation des dépendances frontend..." -ForegroundColor Yellow
cd ../frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend installé avec succès" -ForegroundColor Green
} else {
    Write-Host "× Erreur lors de l'installation du frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Installation terminée avec succès!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour démarrer l'application, utilisez:" -ForegroundColor Cyan
Write-Host "  .\start.ps1" -ForegroundColor White
Write-Host ""

cd ..
pause
