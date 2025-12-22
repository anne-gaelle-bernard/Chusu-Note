# Script de Migration MongoDB Atlas
# ID Projet: 69483f1f5fb9bd46c36fcad1

param(
    [string]$AtlasUri = ""
)

Write-Host "🔄 Migration CHUSU Note vers MongoDB Atlas" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si MongoDB local est en cours d'exécution
Write-Host "🔍 Vérification de MongoDB local..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
    if (-not $mongoProcess) {
        Write-Host "⚠️  MongoDB local ne semble pas être en cours d'exécution" -ForegroundColor Yellow
        Write-Host "   Démarrez MongoDB avec: mongod" -ForegroundColor Gray
        $continue = Read-Host "Continuer quand même? (o/N)"
        if ($continue -ne "o" -and $continue -ne "O") {
            exit 0
        }
    } else {
        Write-Host "✅ MongoDB local est en cours d'exécution" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Impossible de vérifier MongoDB local" -ForegroundColor Yellow
}
Write-Host ""

# Vérifier si .env existe
$envFile = "backend\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  Fichier .env non trouvé dans backend/" -ForegroundColor Yellow
    Write-Host "   Création du fichier .env..." -ForegroundColor Gray
    
    if ($AtlasUri -eq "") {
        Write-Host ""
        Write-Host "Veuillez entrer votre chaîne de connexion MongoDB Atlas:" -ForegroundColor Cyan
        Write-Host "Format: mongodb+srv://user:password@cluster.mongodb.net/chusu_note" -ForegroundColor Gray
        $AtlasUri = Read-Host "URI Atlas"
    }
    
    $envContent = @"
# Variables d'environnement pour CHUSU NOTE
NODE_ENV=development
PORT=3000

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/chusu_note

# MongoDB Atlas
MONGODB_URI_ATLAS=$AtlasUri

# JWT Secret
JWT_SECRET=votre_secret_jwt_super_securise_a_changer_en_production
"@
    
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
} else {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
    
    # Vérifier si MONGODB_URI_ATLAS est défini
    $envContent = Get-Content $envFile -Raw
    if ($envContent -notmatch "MONGODB_URI_ATLAS") {
        Write-Host "⚠️  MONGODB_URI_ATLAS non trouvé dans .env" -ForegroundColor Yellow
        
        if ($AtlasUri -eq "") {
            Write-Host ""
            Write-Host "Veuillez entrer votre chaîne de connexion MongoDB Atlas:" -ForegroundColor Cyan
            Write-Host "Format: mongodb+srv://user:password@cluster.mongodb.net/chusu_note" -ForegroundColor Gray
            $AtlasUri = Read-Host "URI Atlas"
        }
        
        Add-Content -Path $envFile -Value "`nMONGODB_URI_ATLAS=$AtlasUri"
        Write-Host "✅ MONGODB_URI_ATLAS ajouté au .env" -ForegroundColor Green
    }
}
Write-Host ""

# Vérifier les dépendances
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installation des dépendances..." -ForegroundColor Gray
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}
Write-Host "✅ Dépendances OK" -ForegroundColor Green
Write-Host ""

# Exécuter la migration
Write-Host "🚀 Lancement de la migration..." -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

node migrate-to-atlas.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "✅ MIGRATION RÉUSSIE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "1. Vérifiez vos données dans MongoDB Atlas" -ForegroundColor White
    Write-Host "2. Mettez à jour MONGODB_URI dans .env pour utiliser Atlas" -ForegroundColor White
    Write-Host "3. Testez l'application localement" -ForegroundColor White
    Write-Host "4. Déployez sur Railway avec la nouvelle URI" -ForegroundColor White
    Write-Host ""
    Write-Host "Pour utiliser Atlas localement, modifiez backend/.env:" -ForegroundColor Yellow
    Write-Host "MONGODB_URI=<copiez la valeur de MONGODB_URI_ATLAS>" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERREUR DURANT LA MIGRATION" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifiez:" -ForegroundColor Yellow
    Write-Host "- MongoDB local est démarré" -ForegroundColor White
    Write-Host "- La chaîne de connexion Atlas est correcte" -ForegroundColor White
    Write-Host "- Les accès réseau sont configurés dans Atlas" -ForegroundColor White
    Write-Host ""
    Write-Host "Consultez MIGRATION-ATLAS.md pour plus d'aide" -ForegroundColor Cyan
}

Set-Location ..
