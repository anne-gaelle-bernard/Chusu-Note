# 🚀 CHUSU NOTE - Guide de Démarrage Rapide

## 📖 Table des matières
- [Développement Local](#développement-local)
- [Déploiement Vercel](#déploiement-vercel)
- [Scripts Disponibles](#scripts-disponibles)

---

## 🏠 Développement Local

### Installation
```powershell
# Installer toutes les dépendances
.\install.ps1

# OU manuellement
npm run install:all
```

### Configuration
1. Assurez-vous que MongoDB est installé et en cours d'exécution
2. Les variables d'environnement sont dans `backend\.env`

### Démarrage
```powershell
# Démarrer backend + frontend ensemble
.\start.ps1

# OU séparément
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Accès
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Documentation API**: http://localhost:3000/api

---

## ☁️ Déploiement Vercel

### Prérequis
1. ✅ Compte [Vercel](https://vercel.com)
2. ✅ Compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
3. ✅ Dépôt Git (GitHub, GitLab, ou Bitbucket)

### Étapes

#### 1. Configurer MongoDB Atlas
- Créez un cluster (tier gratuit disponible)
- Créez un utilisateur de base de données
- Dans "Network Access", ajoutez `0.0.0.0/0`
- Récupérez votre URI de connexion

#### 2. Déployer sur Vercel

**Option A : Via l'interface web (Recommandé)**
1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Importez votre dépôt GitHub
3. Vercel détectera automatiquement la configuration
4. Ajoutez les variables d'environnement (voir ci-dessous)
5. Cliquez sur "Deploy"

**Option B : Via CLI**
```powershell
# Utiliser le script automatique
.\deploy-vercel.ps1

# OU manuellement
vercel --prod
```

#### 3. Configurer les variables d'environnement

Sur Vercel Dashboard → Settings → Environment Variables :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/chusu_note` | Production, Preview, Development |
| `JWT_SECRET` | `votre-secret-super-securise` | Production, Preview, Development |

**Voir [VERCEL-ENV.md](VERCEL-ENV.md) pour plus de détails**

#### 4. Vérifier le déploiement
- URL : `https://votre-app.vercel.app`
- API : `https://votre-app.vercel.app/api`

---

## 📜 Scripts Disponibles

### PowerShell (Windows)
| Script | Description |
|--------|-------------|
| `.\install.ps1` | Installe toutes les dépendances |
| `.\start.ps1` | Démarre backend + frontend |
| `.\verify.ps1` | Vérifie l'installation |
| `.\deploy-vercel.ps1` | Déploie sur Vercel |
| `.\test-vercel-local.ps1` | Teste l'API Vercel localement |

### NPM
| Commande | Description |
|----------|-------------|
| `npm run install:all` | Installe toutes les dépendances |
| `npm run dev` | Démarre en mode développement |
| `npm run build` | Construit le frontend |
| `npm run setup:db` | Configure la base de données |

---

## 📁 Structure du Projet

```
Chusu-Note/
├── api/                    # API serverless pour Vercel
│   ├── index.js           # Point d'entrée
│   └── package.json       # Dépendances API
├── backend/               # Backend Express (dev local)
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes API
│   ├── middleware/       # Middleware auth
│   └── server.js         # Serveur local
├── frontend/             # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Composants React
│   │   └── styles/      # CSS
│   └── dist/            # Build (généré)
├── vercel.json           # Configuration Vercel
└── package.json          # Scripts principaux
```

---

## 🔧 Technologies

- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **Base de données**: MongoDB
- **Authentification**: JWT + bcrypt
- **Hébergement**: Vercel (serverless)

---

## 📚 Documentation Complète

- [QUICKSTART.md](QUICKSTART.md) - Guide de démarrage
- [COMMANDS.md](COMMANDS.md) - Liste des commandes
- [MONGODB.md](MONGODB.md) - Configuration MongoDB
- [DEPLOYMENT.md](DEPLOYMENT.md) - Déploiement détaillé
- [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md) - Guide Vercel
- [VERCEL-ENV.md](VERCEL-ENV.md) - Variables d'environnement

---

## 🐛 Problèmes Courants

### Erreur de connexion MongoDB
```
❌ Erreur de connexion MongoDB
```
**Solution**: Vérifiez que MongoDB est démarré
```powershell
Get-Service MongoDB
Start-Service MongoDB
```

### Port 3000 déjà utilisé
```
Error: EADDRINUSE: address already in use :::3000
```
**Solution**: Arrêtez le processus existant
```powershell
netstat -ano | findstr :3000
Stop-Process -Id <PID>
```

### API ne répond pas sur Vercel
**Solution**: Vérifiez les variables d'environnement sur Vercel et les logs de déploiement

---

## 📞 Support

Pour plus d'aide :
- Consultez les fichiers de documentation
- Vérifiez les logs dans Vercel Dashboard
- Consultez la documentation [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- Documentation [Vercel](https://vercel.com/docs)

---

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée
- 📝 Gestion de notes
- 🍊 Suivi de fruits
- ⏰ Rappels
- 📊 Statistiques
- 📱 Interface responsive

---

Made with 🍊 by CHUSU NOTE
