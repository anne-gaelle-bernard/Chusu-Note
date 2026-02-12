# Configuration des variables d'environnement pour Vercel

## Méthode 1 : Via l'interface web Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet "chusu-note"
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

### MONGODB_URI
- **Name:** `MONGODB_URI`
- **Value:** Votre URI MongoDB Atlas (ex: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/chusu_note`)
- **Environment:** Production, Preview, Development (cochez les 3)

### JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** Une chaîne secrète aléatoire (ex: `mon-super-secret-jwt-2024-changez-moi`)
- **Environment:** Production, Preview, Development (cochez les 3)

5. Cliquez sur **Save**
6. Redéployez le projet : **Deployments** → **...** → **Redeploy**

## Méthode 2 : Via Vercel CLI

```powershell
# Se connecter à Vercel
vercel login

# Aller dans le dossier du projet
cd "C:\Users\User\Documents\Projet personnel\Chusu-Note"

# Ajouter les variables d'environnement
vercel env add MONGODB_URI production
# Entrez votre URI MongoDB quand demandé

vercel env add JWT_SECRET production
# Entrez votre secret JWT quand demandé

# Aussi pour preview et development
vercel env add MONGODB_URI preview
vercel env add JWT_SECRET preview

vercel env add MONGODB_URI development
vercel env add JWT_SECRET development

# Redéployer
vercel --prod
```

## Vérification

Après avoir configuré les variables et redéployé :

1. Testez l'API : `https://votre-app.vercel.app/api`
2. Testez l'authentification : `https://votre-app.vercel.app/api/auth/login`
3. Ouvrez l'application : `https://votre-app.vercel.app`

## Obtenir votre URI MongoDB Atlas

1. Connectez-vous à [MongoDB Atlas](https://cloud.mongodb.com)
2. Sélectionnez votre cluster
3. Cliquez sur **Connect**
4. Choisissez **Connect your application**
5. Copiez l'URI de connexion
6. Remplacez `<password>` par votre mot de passe réel
7. Remplacez `myFirstDatabase` par `chusu_note`

Exemple final :
```
mongodb+srv://monuser:monmotdepasse@cluster0.abc123.mongodb.net/chusu_note?retryWrites=true&w=majority
```

## Important

⚠️ **Ne commitez JAMAIS ces variables dans Git !**
- Les fichiers `.env` sont déjà dans `.gitignore`
- Configurez-les uniquement sur Vercel
