# Generation des Variables Railway

$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
$encodedPassword = "Mahlika%2E16"
$mongoUri = "mongodb+srv://annegaellebernard_db_user:$encodedPassword@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0"

Write-Host "`nVARIABLES POUR RAILWAY DASHBOARD`n" -ForegroundColor Cyan

Write-Host "NODE_ENV=production`n"
Write-Host "MONGODB_URI=$mongoUri`n"
Write-Host "JWT_SECRET=$jwtSecret`n"
Write-Host "PORT=3000`n"

$content = "NODE_ENV=production`n`nMONGODB_URI=$mongoUri`n`nJWT_SECRET=$jwtSecret`n`nPORT=3000"
$content | Out-File "railway-env.txt" -Encoding ASCII

Write-Host "Sauvegarde dans railway-env.txt`n" -ForegroundColor Green
