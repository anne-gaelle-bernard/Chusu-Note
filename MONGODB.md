# 🔧 Guide MongoDB pour CHUSU NOTE

## Configuration de la Base de Données

### Nom de la base de données
**Important:** `chusu-note` (avec tiret, pas underscore)

### Collections créées
- `users` - Utilisateurs de l'application
- `fruits` - Enregistrements de fruits
- `notes` - Notes personnelles
- `reminders` - Rappels

## 🚀 Démarrage Rapide

### 1. Vérifier que MongoDB est en cours d'exécution

```powershell
# Vérifier le statut
Get-Service MongoDB

# Si arrêté, le démarrer
Start-Service MongoDB
```

### 2. Configurer les variables d'environnement

Créez ou modifiez `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/chusu-note
JWT_SECRET=votre_secret_jwt_super_securise_a_changer_en_production
PORT=3000
```

### 3. Initialiser la base de données

```bash
cd backend
node setup-db.js
```

Ce script va:
- Se connecter à MongoDB
- Créer les collections nécessaires
- Créer les index pour optimiser les performances

## 🐛 Dépannage

### Erreur "Unexpected token 'A', "A server e"... is not valid JSON"

**Cause:** L'API retourne un message d'erreur texte au lieu de JSON, souvent dû à un problème de connexion MongoDB.

**Solutions:**

1. **Vérifier que MongoDB est démarré:**
   ```powershell
   Get-Service MongoDB
   Start-Service MongoDB  # si nécessaire
   ```

2. **Vérifier la variable MONGODB_URI:**
   - Doit être: `mongodb://localhost:27017/chusu-note`
   - Pas: `mongodb://localhost:27017/chusu_note`

3. **Tester la connexion:**
   ```bash
   cd backend
   node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ OK')).catch(err => console.error('❌', err.message));"
   ```

### Erreur "ECONNREFUSED"

**Cause:** MongoDB n'est pas accessible sur le port 27017.

**Solutions:**

1. Vérifier que MongoDB écoute sur le bon port:
   ```powershell
   netstat -ano | Select-String ":27017"
   ```

2. Redémarrer MongoDB:
   ```powershell
   Restart-Service MongoDB
   ```

### Port 3000 déjà utilisé

**Cause:** Un autre processus utilise le port 3000.

**Solutions:**

1. Trouver et arrêter le processus:
   ```powershell
   # Trouver le PID
   netstat -ano | Select-String ":3000"
   
   # Arrêter le processus (remplacer PID par le numéro)
   Stop-Process -Id PID -Force
   ```

2. Ou changer le port dans `backend/.env`:
   ```env
   PORT=3001
   ```

## 🔍 Vérification de la Base de Données

### Avec MongoDB Compass (GUI)

1. Téléchargez [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connectez-vous à: `mongodb://localhost:27017`
3. Sélectionnez la base `chusu-note`
4. Vous devriez voir les 4 collections

### Avec mongosh (CLI)

```bash
mongosh mongodb://localhost:27017/chusu-note

# Lister les collections
show collections

# Compter les documents
db.users.countDocuments()
db.fruits.countDocuments()
db.notes.countDocuments()
db.reminders.countDocuments()
```

## 📊 Commandes Utiles

### Réinitialiser complètement la base de données

**⚠️ ATTENTION: Ceci supprime toutes les données!**

```javascript
// Dans mongosh
use chusu-note
db.dropDatabase()
```

Puis relancez le script d'initialisation:
```bash
cd backend
node setup-db.js
```

### Backup de la base de données

```bash
# Créer un backup
mongodump --db=chusu-note --out=./backup

# Restaurer un backup
mongorestore --db=chusu-note ./backup/chusu-note
```

## 🌐 Production (Vercel)

Pour la production sur Vercel, utilisez MongoDB Atlas:

1. Créez un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Ajoutez `0.0.0.0/0` dans Network Access (pour Vercel)
3. Récupérez votre connection string
4. Dans Vercel, ajoutez la variable d'environnement:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chusu-note?retryWrites=true&w=majority
   ```

## ✅ Test de Connexion Complet

Utilisez ce script pour vérifier que tout fonctionne:

```bash
cd backend
npm install
node setup-db.js
npm run dev
```

Puis dans un autre terminal:
```powershell
curl http://localhost:3000
```

Vous devriez voir un message JSON de bienvenue.

## 📞 Support

Si les problèmes persistent:

1. Vérifiez les logs du backend (dans le terminal)
2. Vérifiez les logs MongoDB (dans Event Viewer > Windows Logs)
3. Consultez la documentation officielle [MongoDB](https://docs.mongodb.com/)
