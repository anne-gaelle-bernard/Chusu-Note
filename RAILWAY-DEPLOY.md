# 🚂 Railway Deployment Guide - CHUSU Note

## ⚠️ Quick Fix for Your Failed Deployment

Your deployment likely failed because of missing configuration. I've added:
- ✅ **railway.json** - Railway configuration
- ✅ **nixpacks.toml** - Build instructions  
- ✅ **Procfile** - Start command
- ✅ **Updated server.js** - Production-ready with static file serving
- ✅ **Updated package.json** - Railway build scripts

---

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app/)
2. **GitHub Account**: For connecting your repository
3. **MongoDB Atlas Account**: For the database (free tier available)

## 🗂️ Project Structure

Railway will deploy:
- **Backend**: Express API server (Node.js)
- **Frontend**: Static React app (build output)
- **Database**: MongoDB Atlas (external)

## 📦 Deployment Steps

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Get your connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/chusu_note
   ```
5. **Important**: Whitelist Railway's IP or use `0.0.0.0/0` (allow all)

### Step 2: Push to GitHub

```powershell
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/yourusername/chusu-note.git

# Push
git push -u origin main
```

### Step 3: Deploy Backend on Railway

1. **Login to Railway**
   - Go to [railway.app](https://railway.app/)
   - Click "Login" and connect with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `chusu-note` repository
   - Railway will detect your project

3. **Configure Backend Service**
   - Click on the service
   - Go to "Settings"
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm start`
   - Set **Health Check Path**: `/api/health`

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add the following variables:

   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/chusu_note
   JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
   PORT=3000
   NODE_ENV=production
   ```

   **Generate a secure JWT_SECRET**:
   ```powershell
   # In PowerShell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.up.railway.app`)

### Step 4: Deploy Frontend on Railway

1. **Add Frontend Service**
   - In the same project, click "New"
   - Select "GitHub Repo" → Same repository
   - This creates a second service

2. **Configure Frontend Service**
   - Click on the frontend service
   - Go to "Settings"
   - Set **Root Directory**: `frontend`
   - Set **Build Command**: `npm run build`
   - Set **Start Command**: Leave empty (static site)

3. **Add Environment Variables**
   - Go to "Variables" tab
   - Add:
   ```env
   VITE_API_URL=https://your-backend-url.up.railway.app
   ```
   (Replace with your actual backend URL from Step 3)

4. **Configure Static Site Serving**
   
   Railway needs a way to serve your static files. Create a simple server:

   Create `frontend/serve.js`:
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();

   app.use(express.static(path.join(__dirname, 'dist')));

   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Frontend serving on port ${PORT}`);
   });
   ```

   Update `frontend/package.json`:
   ```json
   {
     "scripts": {
       "start": "node serve.js"
     },
     "dependencies": {
       "express": "^4.18.2"
     }
   }
   ```

5. **Update Start Command**
   - In Railway frontend settings
   - Set **Start Command**: `npm start`

### Step 5: Configure CORS

Update your backend CORS configuration in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL || 'https://your-frontend.up.railway.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Add to backend Railway variables:
```env
FRONTEND_URL=https://your-frontend.up.railway.app
```

## 🎯 Quick Deploy (Alternative Method)

If you prefer a single service:

### Option: Backend + Static Frontend in One Service

1. Deploy only the backend
2. Add this to `backend/server.js`:

```javascript
// Serve static files from frontend build
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  }
});
```

3. Update root `package.json`:
```json
{
  "scripts": {
    "railway:build": "cd frontend && npm install && npm run build && cd ../backend && npm install",
    "start": "cd backend && npm start"
  }
}
```

4. In Railway settings:
   - Root Directory: `.` (project root)
   - Build Command: `npm run railway:build`
   - Start Command: `npm start`

## ✅ Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Health check endpoint works: `https://your-backend.up.railway.app/api/health`
- [ ] Frontend loads correctly
- [ ] Frontend can connect to backend API
- [ ] MongoDB connection is successful
- [ ] User registration works
- [ ] Login works
- [ ] All features functional

## 🔧 Troubleshooting

### Backend won't start
- Check Railway logs: Click service → "Deployments" → Latest deployment → "View Logs"
- Verify MongoDB URI is correct
- Ensure all environment variables are set
- Check that `package.json` has `"start": "node server.js"`

### Frontend can't connect to backend
- Verify `VITE_API_URL` matches your backend URL
- Check CORS configuration
- Look at browser console for errors
- Test backend URL directly in browser

### MongoDB connection fails
- Verify connection string is correct
- Check MongoDB Atlas network access (whitelist 0.0.0.0/0)
- Ensure database user has correct permissions
- Test connection locally first

### Build fails
- Check Railway build logs
- Verify all dependencies are in `package.json`
- Ensure `node_modules/` is in `.gitignore`
- Try building locally first: `npm run build`

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to your GitHub repository:

```powershell
git add .
git commit -m "Update feature"
git push
```

Railway will:
1. Detect the push
2. Rebuild your services
3. Deploy automatically
4. Zero-downtime deployment

## 💰 Costs

- **Railway Free Tier**: $5 credit/month
- **Typical usage**:
  - Backend: ~$0.20-1/day (depending on traffic)
  - Frontend: ~$0.10-0.50/day
- **MongoDB Atlas**: Free tier (512MB) is sufficient for development

## 🌐 Custom Domains (Optional)

1. Go to Railway service settings
2. Click "Generate Domain" for a railway.app subdomain
3. Or add your own custom domain:
   - Click "Custom Domain"
   - Add your domain
   - Update DNS records as instructed

## 📱 Environment Variables Reference

### Backend Required Variables
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=minimum_32_character_secret
PORT=3000
NODE_ENV=production
```

### Frontend Required Variables
```env
VITE_API_URL=https://your-backend.up.railway.app
```

### Optional Variables
```env
# Backend
FRONTEND_URL=https://your-frontend.up.railway.app
CORS_ORIGIN=https://your-frontend.up.railway.app

# Logging
LOG_LEVEL=info
```

## 🎉 Success!

Once deployed:
- Backend: `https://your-backend.up.railway.app`
- Frontend: `https://your-frontend.up.railway.app`
- Health Check: `https://your-backend.up.railway.app/api/health`

Your CHUSU Note app is now live and accessible worldwide! 🚀

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
- [MongoDB Atlas Setup](https://www.mongodb.com/basics/mongodb-atlas-tutorial)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## 🆘 Support

If you encounter issues:
1. Check Railway logs
2. Review this guide
3. Consult Railway Discord community
4. Check Railway status page

---

**Happy Deploying! 🚂✨**
