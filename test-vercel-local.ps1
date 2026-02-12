# Script pour tester l'API Vercel localement
# Usage: .\test-vercel-api.ps1

Write-Host "🧪 Test de l'API Vercel (mode local)" -ForegroundColor Cyan
Write-Host ""

# Vérifier que les dépendances sont installées
if (-not (Test-Path "api\node_modules")) {
    Write-Host "📦 Installation des dépendances API..." -ForegroundColor Yellow
    cd api
    npm install
    cd ..
}

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# Vérifier que MongoDB est en cours d'exécution
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "✅ MongoDB est en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB n'est pas en cours d'exécution" -ForegroundColor Yellow
    Write-Host "   Démarrage de MongoDB..." -ForegroundColor Yellow
    Start-Service MongoDB -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB démarré" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de démarrer MongoDB" -ForegroundColor Red
        Write-Host "   Assurez-vous que MongoDB est installé" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 Démarrage du serveur Vercel en mode dev..." -ForegroundColor Yellow
Write-Host "   (Appuyez sur Ctrl+C pour arrêter)" -ForegroundColor Gray
Write-Host ""

# Installer vercel CLI si nécessaire
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Installation de Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Démarrer Vercel dev
vercel dev
