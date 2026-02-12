# Script de démarrage CHUSU NOTE (Frontend + Backend)
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "   CHUSU NOTE - Démarrage complet" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Vérifier MongoDB
Write-Host "[1/4] Vérification de MongoDB..." -ForegroundColor Cyan
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✓ MongoDB en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "× MongoDB non démarré" -ForegroundColor Red
    Write-Host "Démarrez MongoDB avec: net start MongoDB" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "[2/4] Vérification des dépendances backend..." -ForegroundColor Cyan
cd backend
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances backend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Dépendances backend OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Vérification des dépendances frontend..." -ForegroundColor Cyan
cd ../frontend
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances frontend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Dépendances frontend OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/4] Démarrage des serveurs..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Retour à la racine
cd ..

# Démarrer le backend dans un nouveau terminal
Write-Host "Démarrage du backend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🚀 Backend CHUSU NOTE' -ForegroundColor Yellow; npm start"

# Attendre 3 secondes pour laisser le backend démarrer
Start-Sleep -Seconds 3

# Démarrer le frontend dans un nouveau terminal
Write-Host "Démarrage du frontend (Port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🎨 Frontend CHUSU NOTE' -ForegroundColor Yellow; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Serveurs démarrés avec succès!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API : " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend    : " -NoNewline
Write-Host "http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ouvrez http://localhost:8080 dans votre navigateur" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour arrêter les serveurs, fermez les fenêtres PowerShell" -ForegroundColor Gray
Write-Host ""

pause
