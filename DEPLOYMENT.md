# 🚀 Déploiement sur Vercel

Ce guide explique comment déployer CHUSU NOTE sur Vercel.

## 📋 Pré-requis

1. Un compte [Vercel](https://vercel.com)
2. Un compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) avec une base de données configurée
3. Git installé et le projet poussé sur GitHub, GitLab ou Bitbucket

## 🔧 Configuration

### 1. Préparer MongoDB Atlas

1. Créez un cluster MongoDB Atlas (si ce n'est pas déjà fait)
2. Créez une base de données pour votre application
3. Dans "Network Access", ajoutez `0.0.0.0/0` pour autoriser les connexions depuis Vercel
4. Récupérez votre chaîne de connexion MongoDB URI

### 2. Variables d'environnement

Vous aurez besoin de configurer ces variables d'environnement dans Vercel :

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chusu-note?retryWrites=true&w=majority
JWT_SECRET=votre_cle_secrete_jwt_tres_longue_et_securisee
```

## 📦 Déploiement via Vercel Dashboard

### Option 1 : Déploiement depuis GitHub (Recommandé)

1. **Poussez votre code sur GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub

3. **Configurez le projet**
   - Framework Preset: `Other` (détecté automatiquement)
   - Root Directory: `./` (laisser par défaut)
   - Build Command: Laissez vide (géré par vercel.json)
   - Output Directory: Laissez vide

4. **Ajoutez les variables d'environnement**
   - Dans "Environment Variables", ajoutez :
     - `MONGODB_URI` : Votre URI MongoDB Atlas
     - `JWT_SECRET` : Une clé secrète forte (générez-en une avec `openssl rand -hex 32`)

5. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez que le build se termine (2-3 minutes)

### Option 2 : Déploiement via Vercel CLI

1. **Installez Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Authentifiez-vous**
   ```bash
   vercel login
   ```

3. **Déployez**
   ```bash
   vercel
   ```

4. **Ajoutez les variables d'environnement**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```

5. **Déployez en production**
   ```bash
   vercel --prod
   ```

## 🔍 Vérification du déploiement

Une fois déployé, testez votre application :

1. **Frontend** : Visitez votre URL Vercel (ex: `https://votre-app.vercel.app`)
2. **API** : Testez l'API à `https://votre-app.vercel.app/api`
3. **Authentification** : Essayez de créer un compte et de vous connecter

## 🐛 Dépannage

### Erreur de connexion MongoDB

- Vérifiez que votre IP est autorisée dans MongoDB Atlas (ajoutez `0.0.0.0/0`)
- Vérifiez que la variable `MONGODB_URI` est correctement configurée
- Consultez les logs Vercel : Dashboard > Votre projet > "Functions" tab

### Erreur 404 sur les routes API

- Vérifiez que le fichier `vercel.json` est bien à la racine
- Vérifiez que le dossier `api/` existe avec `index.js`

### Variables d'environnement non détectées

- Redéployez après avoir ajouté les variables :
  ```bash
  vercel --prod
  ```

## 🔄 Mises à jour automatiques

Avec GitHub connecté :
- Chaque push sur `main` déclenche un déploiement automatique
- Les pull requests créent des previews automatiques

## 📊 Monitoring

Dans le dashboard Vercel, vous pouvez :
- Voir les logs en temps réel
- Monitorer les performances
- Voir les métriques d'utilisation
- Configurer des alertes

## 🔒 Sécurité recommandée

1. **JWT_SECRET** : Utilisez une clé très longue et aléatoire
   ```bash
   openssl rand -hex 32
   ```

2. **MongoDB** : Limitez les IP autorisées après les tests

3. **CORS** : En production, configurez CORS pour accepter uniquement votre domaine

## 📝 Notes importantes

- Les fonctions serverless Vercel ont un timeout de 10 secondes (plan gratuit)
- Les connexions MongoDB sont mises en cache pour optimiser les performances
- Le plan gratuit offre :
  - 100 GB de bande passante
  - 100 heures de build
  - Déploiements illimités

## 🎉 C'est prêt !

Votre application CHUSU NOTE est maintenant déployée et accessible mondialement via Vercel ! 🌍
