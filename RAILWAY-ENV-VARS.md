# 🚂 Variables d'Environnement pour Railway

## ⚠️ Erreur 500 - Configuration Requise

L'erreur 500 sur Railway est généralement due aux variables d'environnement manquantes.

## 📋 Variables à Configurer dans Railway Dashboard

Allez dans **Railway Dashboard** → **Votre Projet** → **Variables** → **Add Variable**

### Variables Obligatoires:

```env
NODE_ENV=production

MONGODB_URI=mongodb+srv://annegaellebernard_db_user:Mahlika.16@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=votre_secret_jwt_super_securise_a_changer_en_production_minimum_32_caracteres

PORT=3000
```

### ⚠️ IMPORTANT pour MongoDB Atlas

Le mot de passe contient un point (.), il faut l'encoder:

**Option 1 - Encoder le point:**
```env
MONGODB_URI=mongodb+srv://annegaellebernard_db_user:Mahlika%2E16@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0
```
(`.` devient `%2E`)

**Option 2 - Utiliser des guillemets (dans Railway):**
```env
MONGODB_URI="mongodb+srv://annegaellebernard_db_user:Mahlika.16@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0"
```

## 🔐 Générer un JWT_SECRET Sécurisé

Dans PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## ✅ Checklist de Déploiement

- [ ] Variable `NODE_ENV=production` ajoutée
- [ ] Variable `MONGODB_URI` avec le bon mot de passe (encodé si besoin)
- [ ] Variable `JWT_SECRET` ajoutée (32+ caractères)
- [ ] Variable `PORT=3000` ajoutée (optionnel, Railway détecte auto)
- [ ] Dans MongoDB Atlas → Network Access → 0.0.0.0/0 autorisé
- [ ] Redéploiement Railway lancé

## 🔍 Vérifier les Logs Railway

1. Dans Railway Dashboard → **Deployments**
2. Cliquez sur le dernier déploiement
3. Regardez les **Deploy Logs**
4. Cherchez les erreurs de connexion MongoDB

## 🆘 Erreurs Courantes

### "MongoNetworkError" ou "Authentication failed"
- Vérifiez `MONGODB_URI` est correct
- Vérifiez le mot de passe est encodé (`%2E` pour le point)
- Vérifiez Network Access dans Atlas

### "JWT_SECRET is not defined"
- Ajoutez la variable `JWT_SECRET` dans Railway

### "Cannot find module" ou "npm ERR!"
- Vérifiez que `railway.json` et `nixpacks.toml` sont bien poussés sur GitHub
- Relancez le build

## 🚀 Après Configuration

1. Sauvegardez les variables dans Railway
2. Railway redéploiera automatiquement
3. Attendez 2-3 minutes
4. Testez votre URL Railway: `https://votre-app.up.railway.app`

## 📝 Test de l'API

Une fois déployé, testez:
```
https://votre-app.up.railway.app/api/health
```

Devrait retourner:
```json
{
  "status": "OK",
  "database": "connected",
  "environment": "production"
}
```
