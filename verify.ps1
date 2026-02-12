# Script de vérification de l'architecture
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CHUSU NOTE - Vérification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Fonction pour vérifier l'existence d'un fichier
function Test-FileExists {
    param($path, $description)
    if (Test-Path $path) {
        Write-Host "✓ $description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "× $description manquant" -ForegroundColor Red
        $script:errors++
        return $false
    }
}

# Vérification des dossiers
Write-Host "[1] Vérification des dossiers..." -ForegroundColor Yellow
Test-FileExists "models" "Dossier models/"
Test-FileExists "routes" "Dossier routes/"
Test-FileExists "middleware" "Dossier middleware/"
Test-FileExists "public" "Dossier public/"

Write-Host ""

# Vérification des modèles
Write-Host "[2] Vérification des modèles..." -ForegroundColor Yellow
Test-FileExists "models/User.js" "Modèle User"
Test-FileExists "models/Fruit.js" "Modèle Fruit"

Write-Host ""

# Vérification des routes
Write-Host "[3] Vérification des routes..." -ForegroundColor Yellow
Test-FileExists "routes/auth.js" "Routes d'authentification"
Test-FileExists "routes/fruits.js" "Routes des fruits"

Write-Host ""

# Vérification du middleware
Write-Host "[4] Vérification du middleware..." -ForegroundColor Yellow
Test-FileExists "middleware/auth.js" "Middleware d'authentification"

Write-Host ""

# Vérification du frontend
Write-Host "[5] Vérification du frontend..." -ForegroundColor Yellow
Test-FileExists "public/index.html" "Page principale"
Test-FileExists "public/script.js" "Script principal"
Test-FileExists "public/styles.css" "Feuille de style"
Test-FileExists "public/auth.html" "Page d'authentification"
Test-FileExists "public/auth.js" "Script d'authentification"

Write-Host ""

# Vérification des fichiers de configuration
Write-Host "[6] Vérification de la configuration..." -ForegroundColor Yellow
Test-FileExists "server.js" "Serveur principal"
Test-FileExists "package.json" "Configuration npm"
Test-FileExists ".env" "Variables d'environnement"
Test-FileExists ".gitignore" "Fichier gitignore"

Write-Host ""

# Vérification de la documentation
Write-Host "[7] Vérification de la documentation..." -ForegroundColor Yellow
Test-FileExists "README.md" "Documentation utilisateur"
Test-FileExists "ARCHITECTURE.md" "Documentation architecture"
Test-FileExists "COMMANDS.md" "Documentation des commandes"

Write-Host ""

# Vérification des scripts
Write-Host "[8] Vérification des scripts..." -ForegroundColor Yellow
Test-FileExists "start.bat" "Script de démarrage (CMD)"
Test-FileExists "start.ps1" "Script de démarrage (PowerShell)"

Write-Host ""

# Vérification des dépendances
Write-Host "[9] Vérification des dépendances..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules présent" -ForegroundColor Green
    
    # Vérifier les packages critiques
    $criticalPackages = @("express", "mongoose", "jsonwebtoken", "bcryptjs", "cors", "dotenv")
    foreach ($package in $criticalPackages) {
        if (Test-Path "node_modules/$package") {
            Write-Host "  ✓ $package installé" -ForegroundColor Green
        } else {
            Write-Host "  × $package manquant" -ForegroundColor Red
            $script:warnings++
        }
    }
} else {
    Write-Host "⚠ node_modules non installé - Exécutez 'npm install'" -ForegroundColor Yellow
    $script:warnings++
}

Write-Host ""

# Vérification de MongoDB
Write-Host "[10] Vérification de MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✓ MongoDB en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB non démarré - Démarrez MongoDB avant de lancer le serveur" -ForegroundColor Yellow
    $script:warnings++
}

Write-Host ""

# Vérification du fichier .env
Write-Host "[11] Vérification des variables d'environnement..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "MONGODB_URI") {
        Write-Host "✓ MONGODB_URI configuré" -ForegroundColor Green
    } else {
        Write-Host "× MONGODB_URI manquant dans .env" -ForegroundColor Red
        $script:errors++
    }
    
    if ($envContent -match "JWT_SECRET") {
        Write-Host "✓ JWT_SECRET configuré" -ForegroundColor Green
        if ($envContent -match "votre_secret_jwt_super_securise") {
            Write-Host "  ⚠ JWT_SECRET utilise la valeur par défaut - Changez-le en production!" -ForegroundColor Yellow
            $script:warnings++
        }
    } else {
        Write-Host "× JWT_SECRET manquant dans .env" -ForegroundColor Red
        $script:errors++
    }
    
    if ($envContent -match "PORT") {
        Write-Host "✓ PORT configuré" -ForegroundColor Green
    } else {
        Write-Host "× PORT manquant dans .env" -ForegroundColor Red
        $script:errors++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RÉSUMÉ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✓ Architecture complète et valide!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Vous pouvez démarrer l'application avec:" -ForegroundColor Cyan
    Write-Host "  .\start.ps1" -ForegroundColor White
    Write-Host "  ou" -ForegroundColor White
    Write-Host "  npm start" -ForegroundColor White
} else {
    if ($errors -gt 0) {
        Write-Host "× $errors erreur(s) trouvée(s)" -ForegroundColor Red
    }
    if ($warnings -gt 0) {
        Write-Host "⚠ $warnings avertissement(s)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Corrigez les problèmes avant de démarrer l'application." -ForegroundColor Yellow
}

Write-Host ""
