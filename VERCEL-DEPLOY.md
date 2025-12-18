# 🚀 Guide de déploiement Vercel - CHUSU NOTE

## Configuration requise

### 1. MongoDB Atlas (Base de données cloud)

Votre application a besoin d'une base de données MongoDB accessible depuis Internet. MongoDB Atlas offre un tier gratuit.

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Dans "Database Access", créez un utilisateur avec un mot de passe
4. Dans "Network Access", ajoutez `0.0.0.0/0` pour autoriser toutes les connexions
5. Récupérez votre URI de connexion :
   - Cliquez sur "Connect" → "Connect your application"
   - Copiez l'URI (format : `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/chusu_note`)

### 2. Déploiement sur Vercel

#### Option 1 : Via l'interface Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur "New Project"
3. Importez votre dépôt GitHub
4. Vercel détectera automatiquement la configuration
5. Ajoutez les variables d'environnement :
   - `MONGODB_URI` : Votre URI MongoDB Atlas
   - `JWT_SECRET` : Une chaîne secrète aléatoire (ex: `mon-super-secret-jwt-2024`)
6. Cliquez sur "Deploy"

#### Option 2 : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# Redéployer avec les variables
vercel --prod
```

### 3. Vérifier le déploiement

Une fois déployé, testez l'API :
- URL de production : `https://votre-app.vercel.app`
- API : `https://votre-app.vercel.app/api/auth/login`

## Structure du projet pour Vercel

```
Chusu-Note/
├── api/
│   └── index.js          # Point d'entrée serverless pour l'API
├── frontend/
│   └── dist/             # Build du frontend (généré automatiquement)
├── backend/
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes Express
│   └── middleware/       # Middleware d'authentification
└── vercel.json           # Configuration Vercel
```

## Variables d'environnement requises

Sur Vercel Dashboard → Settings → Environment Variables :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGODB_URI` | URI de connexion MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/chusu_note` |
| `JWT_SECRET` | Secret pour les tokens JWT | `mon-secret-jwt-super-securise` |

## Problèmes courants

### Erreur de connexion MongoDB
- Vérifiez que `0.0.0.0/0` est dans Network Access de MongoDB Atlas
- Vérifiez que votre URI contient le bon nom d'utilisateur/mot de passe
- Le nom de la base de données doit être `chusu_note`

### API ne répond pas
- Vérifiez les logs dans Vercel Dashboard → Deployments → Function Logs
- Assurez-vous que les variables d'environnement sont définies

### Timeout
- Les fonctions serverless Vercel ont un timeout de 10 secondes (gratuit)
- La connexion MongoDB est mise en cache pour optimiser les performances

## Développement local vs Production

### Local (avec backend séparé)
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production (Vercel)
- Le frontend et l'API sont servis depuis le même domaine
- Pas besoin de CORS
- L'API est disponible sur `/api/*`
