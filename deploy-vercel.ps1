# Script de déploiement Vercel pour CHUSU NOTE
# Usage: .\deploy-vercel.ps1

Write-Host "🚀 Déploiement CHUSU NOTE sur Vercel" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Vercel CLI est installé
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI n'est pas installé" -ForegroundColor Red
    Write-Host "📦 Installation de Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation de Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Vercel CLI est installé" -ForegroundColor Green
Write-Host ""

# Vérifier que le projet est dans un dépôt Git
if (-not (Test-Path .git)) {
    Write-Host "⚠️  Ce projet n'est pas un dépôt Git" -ForegroundColor Yellow
    Write-Host "📝 Initialisation du dépôt Git..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
}

Write-Host "📋 Prérequis pour le déploiement:" -ForegroundColor Cyan
Write-Host "  1. ✓ Compte Vercel" -ForegroundColor White
Write-Host "  2. ✓ Base de données MongoDB Atlas configurée" -ForegroundColor White
Write-Host "  3. ✓ Variables d'environnement prêtes:" -ForegroundColor White
Write-Host "     - MONGODB_URI" -ForegroundColor Gray
Write-Host "     - JWT_SECRET" -ForegroundColor Gray
Write-Host ""

# Demander confirmation
$confirmation = Read-Host "Avez-vous configuré MongoDB Atlas et les variables d'environnement? (o/n)"
if ($confirmation -ne "o" -and $confirmation -ne "O") {
    Write-Host "❌ Déploiement annulé" -ForegroundColor Red
    Write-Host "📖 Consultez VERCEL-DEPLOY.md pour plus d'informations" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔧 Construction du frontend..." -ForegroundColor Yellow
cd frontend
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la construction du frontend" -ForegroundColor Red
    exit 1
}

cd ..
Write-Host "✅ Frontend construit avec succès" -ForegroundColor Green
Write-Host ""

# Déploiement sur Vercel
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
Write-Host "   (Vous serez peut-être invité à vous connecter)" -ForegroundColor Gray
Write-Host ""

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Déploiement réussi!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 N'oubliez pas de configurer les variables d'environnement:" -ForegroundColor Yellow
    Write-Host "   1. Allez sur https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   2. Sélectionnez votre projet" -ForegroundColor White
    Write-Host "   3. Settings → Environment Variables" -ForegroundColor White
    Write-Host "   4. Ajoutez MONGODB_URI et JWT_SECRET" -ForegroundColor White
    Write-Host "   5. Redéployez si nécessaire" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host "📖 Consultez VERCEL-DEPLOY.md pour résoudre les problèmes" -ForegroundColor Yellow
}
