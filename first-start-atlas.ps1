# Premier Démarrage avec MongoDB Atlas

Write-Host "🚀 Configuration CHUSU Note avec MongoDB Atlas" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Vérifier le fichier .env
Write-Host "📋 Étape 1: Vérification de la configuration..." -ForegroundColor Yellow
$envFile = "backend\.env"

if (-not (Test-Path $envFile)) {
    Write-Host "❌ Fichier .env non trouvé!" -ForegroundColor Red
    Write-Host "Création du fichier .env..." -ForegroundColor Yellow
    
    $envContent = @"
# Variables d'environnement pour CHUSU NOTE
NODE_ENV=development
PORT=3000

# MongoDB Atlas (Production & Development)
MONGODB_URI=mongodb+srv://annegaellebernard_db_user:<db_password>@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0

# MongoDB Local (Backup)
MONGODB_URI_LOCAL=mongodb://localhost:27017/chusu_note

# JWT Secret - Changez ceci en production!
JWT_SECRET=votre_secret_jwt_super_securise_a_changer_en_production
"@
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
}

$envContent = Get-Content $envFile -Raw

if ($envContent -match "<db_password>") {
    Write-Host "⚠️  Configuration du mot de passe requise" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Exécution du script de configuration..." -ForegroundColor Gray
    Write-Host ""
    
    .\setup-atlas-password.ps1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de la configuration" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Configuration OK" -ForegroundColor Green
}

Write-Host ""

# Étape 2: Installer les dépendances
Write-Host "📦 Étape 2: Installation des dépendances..." -ForegroundColor Yellow

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "   Installation backend..." -ForegroundColor Gray
    Set-Location backend
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation backend" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "   Installation frontend..." -ForegroundColor Gray
    Set-Location frontend
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation frontend" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    Set-Location ..
}

Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# Étape 3: Tester la connexion
Write-Host "🔍 Étape 3: Test de connexion à MongoDB Atlas..." -ForegroundColor Yellow
Set-Location backend
npm run test-atlas
$testResult = $LASTEXITCODE
Set-Location ..

if ($testResult -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ CONFIGURATION RÉUSSIE!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Votre application est prête! Pour démarrer:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "Frontend (dans un autre terminal):" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou utilisez le script de démarrage:" -ForegroundColor Yellow
    Write-Host "  .\start.ps1" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Problème de connexion à MongoDB Atlas" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vérifiez:" -ForegroundColor Cyan
    Write-Host "1. Le mot de passe est correct" -ForegroundColor White
    Write-Host "2. Network Access dans Atlas autorise 0.0.0.0/0" -ForegroundColor White
    Write-Host "3. L'utilisateur existe dans Database Access" -ForegroundColor White
    Write-Host ""
    Write-Host "Consultez SETUP-ATLAS.md pour plus d'aide" -ForegroundColor Gray
}
