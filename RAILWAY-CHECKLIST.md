# 🚀 Railway Deployment Checklist

## Before Deploying

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string ready
- [ ] JWT secret generated (32+ random characters)

## In Railway Dashboard

### 1. Create New Project
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your Chusu-Note repository
- [ ] Wait for initial deployment attempt

### 2. Set Environment Variables

Go to: **Your Project** → **Variables** → **Add Variables**

Required variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/chusu_note
JWT_SECRET=your_super_secure_random_string_min_32_chars
```

Optional:
```env
PORT=3000
FRONTEND_URL=https://your-app.up.railway.app
```

### 3. Generate JWT_SECRET

**PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use an online generator:**
- [randomkeygen.com](https://randomkeygen.com/)
- Choose "256-bit WEP Key" or longer

### 4. MongoDB Atlas Configuration

- [ ] Go to MongoDB Atlas → Network Access
- [ ] Click "Add IP Address"
- [ ] Click "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] Click "Confirm"

### 5. Redeploy

- [ ] After adding variables, go to Deployments
- [ ] Click "Redeploy" on latest deployment
- [ ] Wait for build to complete

## Verify Deployment

### Check Build Logs
- [ ] Frontend build completes
- [ ] No npm errors
- [ ] "dist" folder created

### Check Deploy Logs
- [ ] Server starts successfully
- [ ] MongoDB connection successful
- [ ] No errors in logs

### Test Endpoints

Visit these URLs (replace with your Railway URL):

```
https://your-app.up.railway.app/
https://your-app.up.railway.app/api/health
```

Health endpoint should return:
```json
{
  "uptime": 123.45,
  "status": "OK",
  "timestamp": 1703174400000,
  "database": "connected",
  "environment": "production"
}
```

### Test Application

- [ ] Frontend loads correctly
- [ ] Can create account
- [ ] Can login
- [ ] Can add fruits/notes
- [ ] API calls work
- [ ] PWA install prompt appears

## Common Issues & Fixes

### ❌ Build Fails
**Problem**: npm install errors

**Solution**:
```powershell
git add .
git commit -m "Fix dependencies"
git push origin main
```

### ❌ Database Connection Fails
**Problem**: MongoDB connection error

**Solutions**:
1. Check IP whitelist includes `0.0.0.0/0`
2. Verify `MONGODB_URI` in Railway variables
3. Check password has no special characters (or URL-encode them)

### ❌ Server Won't Start
**Problem**: Port binding error

**Solution**: Verify environment variables are set correctly

### ❌ Frontend Shows 404
**Problem**: Static files not served

**Solution**: 
1. Check `NODE_ENV=production` is set
2. Verify frontend build completed successfully
3. Check deploy logs for errors

### ❌ CORS Errors
**Problem**: Cross-origin request blocked

**Solution**: Add `FRONTEND_URL` variable with your Railway app URL

## Configuration Files

The following files configure Railway deployment:

### railway.json
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = [
  "npm install",
  "cd backend && npm install",
  "cd frontend && npm install"
]

[phases.build]
cmds = [
  "cd frontend && npm run build"
]

[start]
cmd = "cd backend && npm start"
```

### Procfile
```
web: cd backend && npm start
```

## Success Indicators

Your deployment is successful when you see:

✅ Build completed without errors
✅ Deploy logs show "🚀 Serveur démarré"
✅ MongoDB shows "✅ Connecté à MongoDB"
✅ Health endpoint returns connected status
✅ Frontend loads at Railway URL
✅ Can login and use all features

## Post-Deployment

- [ ] Test all features thoroughly
- [ ] Monitor logs for errors
- [ ] Set up custom domain (optional)
- [ ] Share your app URL!

## Get Help

- **Railway Status**: [railway.app/status](https://railway.app/status)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Docs**: [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md)

---

**Your Railway URL will be something like:**
`https://chusu-note-production.up.railway.app`

Railway assigns this automatically - find it in the Dashboard!
