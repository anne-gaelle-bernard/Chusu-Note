# Configuration Rapide MongoDB Atlas
# Pour le projet CHUSU Note

Write-Host "🔐 Configuration MongoDB Atlas" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$envFile = "backend\.env"

# Lire le fichier .env
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    
    if ($content -match "<db_password>") {
        Write-Host "⚠️  Le mot de passe de la base de données n'est pas encore configuré!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Veuillez entrer votre mot de passe MongoDB Atlas:" -ForegroundColor Cyan
        Write-Host "(Le mot de passe que vous avez créé pour l'utilisateur 'annegaellebernard_db_user')" -ForegroundColor Gray
        Write-Host ""
        
        $password = Read-Host "Mot de passe" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
        $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        
        # Encoder les caractères spéciaux
        $encodedPassword = [System.Web.HttpUtility]::UrlEncode($plainPassword)
        
        # Remplacer dans le fichier
        $content = $content -replace "<db_password>", $encodedPassword
        Set-Content -Path $envFile -Value $content -NoNewline
        
        Write-Host ""
        Write-Host "✅ Mot de passe configuré avec succès!" -ForegroundColor Green
        Write-Host ""
        
        # Test de connexion
        Write-Host "🔍 Test de la connexion..." -ForegroundColor Yellow
        Set-Location backend
        npm run test-atlas
        Set-Location ..
        
    } else {
        Write-Host "✅ Le mot de passe est déjà configuré!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Pour tester la connexion:" -ForegroundColor Cyan
        Write-Host "cd backend" -ForegroundColor Gray
        Write-Host "npm run test-atlas" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host "❌ Fichier .env non trouvé dans backend/" -ForegroundColor Red
}
