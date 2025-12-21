# Test Railway Build Locally
# This script simulates what Railway will do

Write-Host "🚂 Testing Railway Deployment Locally" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install root dependencies
Write-Host "📦 Step 1: Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Root npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Root dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 2: Install backend dependencies
Write-Host "📦 Step 2: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend npm install failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 3: Install frontend dependencies
Write-Host "📦 Step 3: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 4: Build frontend
Write-Host "🏗️  Step 4: Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Frontend built successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Check if dist folder exists
if (Test-Path "frontend/dist") {
    Write-Host "✅ Frontend dist folder created" -ForegroundColor Green
    $fileCount = (Get-ChildItem "frontend/dist" -Recurse -File).Count
    Write-Host "   📁 $fileCount files in dist folder" -ForegroundColor Gray
} else {
    Write-Host "❌ Frontend dist folder not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Check environment variables
Write-Host "🔐 Step 5: Checking environment variables..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
    Write-Host "⚠️  Make sure these variables are set in Railway:" -ForegroundColor Yellow
    Write-Host "   - NODE_ENV=production" -ForegroundColor Gray
    Write-Host "   - MONGODB_URI=your_mongodb_connection_string" -ForegroundColor Gray
    Write-Host "   - JWT_SECRET=your_secure_secret" -ForegroundColor Gray
} else {
    Write-Host "⚠️  No .env file found in backend/" -ForegroundColor Yellow
    Write-Host "   This is OK for Railway (uses environment variables)" -ForegroundColor Gray
}
Write-Host ""

# Success message
Write-Host "🎉 LOCAL BUILD TEST SUCCESSFUL!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Configure Railway deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy to Railway:" -ForegroundColor White
Write-Host "   - Go to railway.app" -ForegroundColor Gray
Write-Host "   - Create new project from GitHub" -ForegroundColor Gray
Write-Host "   - Add environment variables" -ForegroundColor Gray
Write-Host "   - Wait for deployment!" -ForegroundColor Gray
Write-Host ""
Write-Host "3. See RAILWAY-CHECKLIST.md for detailed steps" -ForegroundColor White
Write-Host ""
