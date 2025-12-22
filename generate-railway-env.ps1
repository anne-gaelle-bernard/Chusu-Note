# Génération des Variables d'Environnement pour Railway

Write-Host "🔐 Génération des Variables pour Railway" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Générer JWT Secret
Write-Host "🔑 Génération d'un JWT_SECRET sécurisé..." -ForegroundColor Yellow
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
Write-Host "✅ JWT_SECRET généré" -ForegroundColor Green
Write-Host ""

# Encoder le mot de passe pour MongoDB
$password = "Mahlika.16"
$encodedPassword = "Mahlika%2E16"  # Le point (.) devient %2E

$mongoUri = "mongodb+srv://annegaellebernard_db_user:$encodedPassword@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0"

# Afficher les variables
Write-Host "📋 COPIEZ CES VARIABLES DANS RAILWAY DASHBOARD" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host ""

Write-Host "MONGODB_URI=$mongoUri" -ForegroundColor White
Write-Host ""

Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host ""

Write-Host "PORT=3000" -ForegroundColor White
Write-Host ""

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Sauvegarder dans un fichier pour référence
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$envContent = @"
# Variables d'environnement pour Railway - $timestamp
# NE PAS COMMITTER CE FICHIER SUR GITHUB

NODE_ENV=production

MONGODB_URI=$mongoUri

JWT_SECRET=$jwtSecret

PORT=3000
"@

$envContent | Out-File -FilePath "railway-env.txt" -Encoding UTF8

Write-Host "💾 Variables sauvegardées dans: railway-env.txt" -ForegroundColor Green
Write-Host "⚠️  Ce fichier contient des secrets - NE PAS le committer!" -ForegroundColor Yellow
Write-Host ""

Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Allez sur Railway Dashboard" -ForegroundColor White
Write-Host "2. Sélectionnez votre projet" -ForegroundColor White
Write-Host "3. Allez dans Variables" -ForegroundColor White
Write-Host "4. Ajoutez chaque variable ci-dessus" -ForegroundColor White
Write-Host "5. Railway redéploiera automatiquement" -ForegroundColor White
Write-Host ""

Write-Host "🔍 Pour vérifier après déploiement:" -ForegroundColor Cyan
Write-Host "https://votre-app.up.railway.app/api/health" -ForegroundColor Gray
Write-Host ""
