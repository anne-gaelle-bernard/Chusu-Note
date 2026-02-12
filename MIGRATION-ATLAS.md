# 🔄 Migration vers MongoDB Atlas

## ID Projet: 69483f1f5fb9bd46c36fcad1

Guide rapide pour migrer votre base de données locale vers MongoDB Atlas.

## Étape 1: Configurer MongoDB Atlas

### 1. Créer un Cluster (si pas déjà fait)

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Connectez-vous ou créez un compte
3. Créez un cluster gratuit (M0)

### 2. Créer un Utilisateur de Base de Données

1. Dans Atlas: **Database Access** → **Add New Database User**
2. Choisissez **Password** comme méthode d'authentification
3. Nom d'utilisateur: `chusu_admin` (ou votre choix)
4. Mot de passe: Générez un mot de passe fort
5. **Database User Privileges**: "Read and write to any database"
6. Cliquez **Add User**

### 3. Autoriser l'Accès Réseau

1. Dans Atlas: **Network Access** → **Add IP Address**
2. Cliquez **Allow Access from Anywhere** (0.0.0.0/0)
3. Cliquez **Confirm**

⚠️ Pour la production, limitez à des IPs spécifiques!

### 4. Obtenir la Chaîne de Connexion

1. Dans Atlas: **Database** → **Connect**
2. Choisissez **Connect your application**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copiez la chaîne de connexion:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chusu_note?retryWrites=true&w=majority
```

5. Remplacez:
   - `<username>` par votre nom d'utilisateur
   - `<password>` par votre mot de passe
   - `cluster0.xxxxx` sera différent pour vous

## Étape 2: Configurer la Connexion

### Créer/Modifier .env dans backend/

```powershell
cd backend
notepad .env
```

Ajoutez cette ligne (remplacez avec votre vraie chaîne de connexion):

```env
MONGODB_URI_ATLAS=mongodb+srv://chusu_admin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/chusu_note?retryWrites=true&w=majority
```

**⚠️ Important:**
- Remplacez `VotreMotDePasse` par le vrai mot de passe
- Si le mot de passe contient des caractères spéciaux (@, :, /), encodez-les en URL:
  - @ = %40
  - : = %3A
  - / = %2F

**Exemple:**
```
Mot de passe: Pass@123!
Encodé: Pass%40123!
```

## Étape 3: Exécuter la Migration

### Option A: Script de Migration (Recommandé)

```powershell
cd backend
node migrate-to-atlas.js
```

Vous verrez:
```
🔄 Démarrage de la migration vers MongoDB Atlas...
📡 Connexion à la base de données locale...
✅ Connecté à la base locale

📦 Récupération des données locales...
   👥 Utilisateurs: 2
   🍊 Fruits: 15
   📝 Notes: 8
   ⏰ Rappels: 5

📡 Connexion à MongoDB Atlas...
✅ Connecté à MongoDB Atlas

🚀 Migration en cours...
...
✅ MIGRATION TERMINÉE AVEC SUCCÈS! 🎉
```

### Option B: Export/Import Manuel

**Export de la base locale:**
```powershell
# Export vers un dossier
mongodump --db chusu_note --out ./backup

# Ou export vers un fichier JSON
mongoexport --db chusu_note --collection users --out users.json
mongoexport --db chusu_note --collection fruits --out fruits.json
mongoexport --db chusu_note --collection notes --out notes.json
mongoexport --db chusu_note --collection reminders --out reminders.json
```

**Import vers Atlas:**
```powershell
# Avec mongorestore (si vous avez utilisé mongodump)
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net" --nsInclude "chusu_note.*" ./backup

# Ou avec mongoimport (si vous avez des fichiers JSON)
mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/chusu_note" --collection users --file users.json
mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/chusu_note" --collection fruits --file fruits.json
mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/chusu_note" --collection notes --file notes.json
mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/chusu_note" --collection reminders --file reminders.json
```

## Étape 4: Vérifier la Migration

### Test de Connexion

```powershell
cd backend
node test-connection.js
```

Modifiez d'abord `test-connection.js` pour utiliser `MONGODB_URI_ATLAS`:

```javascript
const MONGODB_URI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI;
```

### Vérifier dans Atlas

1. Dans MongoDB Atlas → **Database** → **Browse Collections**
2. Vous devriez voir la base `chusu_note` avec les collections:
   - users
   - fruits
   - notes
   - reminders

## Étape 5: Mettre à Jour l'Application

### Pour le Développement Local

Dans `backend/.env`:
```env
# Utiliser Atlas au lieu de local
MONGODB_URI=mongodb+srv://chusu_admin:password@cluster0.xxxxx.mongodb.net/chusu_note
```

### Pour Railway

Dans Railway Dashboard → Variables:
```env
MONGODB_URI=mongodb+srv://chusu_admin:password@cluster0.xxxxx.mongodb.net/chusu_note
```

## Étape 6: Redéployer

```powershell
# Commit les changements
git add .
git commit -m "Configure MongoDB Atlas"
git push origin main

# Railway redéploiera automatiquement
```

## ✅ Checklist de Migration

- [ ] Cluster MongoDB Atlas créé
- [ ] Utilisateur de base de données créé
- [ ] IP autorisée (0.0.0.0/0)
- [ ] Chaîne de connexion obtenue
- [ ] Variable `MONGODB_URI_ATLAS` ajoutée dans .env
- [ ] Script de migration exécuté
- [ ] Données vérifiées dans Atlas
- [ ] Application testée localement
- [ ] Variables mises à jour dans Railway
- [ ] Application redéployée

## 🔒 Sécurité

**Important pour la production:**

1. **IP Whitelist**: Au lieu de `0.0.0.0/0`, ajoutez uniquement:
   - Votre IP locale pour le dev
   - Les IPs de Railway pour la prod

2. **Mot de passe fort**: Utilisez un générateur de mots de passe

3. **Ne commitez JAMAIS** le fichier .env:
   ```powershell
   # Vérifiez que .env est dans .gitignore
   cat .gitignore | Select-String ".env"
   ```

## 🆘 Dépannage

### Erreur: "Authentication failed"
- Vérifiez le nom d'utilisateur et mot de passe
- Encodez les caractères spéciaux dans le mot de passe

### Erreur: "Network timeout"
- Vérifiez que 0.0.0.0/0 est dans Network Access
- Vérifiez votre connexion internet

### Erreur: "Database not found"
- La base sera créée automatiquement au premier insert
- Vérifiez le nom de la base dans la chaîne de connexion

### Les données ne migrent pas
- Vérifiez que MongoDB local est démarré
- Vérifiez les logs du script de migration
- Essayez l'export/import manuel

## 📊 Monitoring

Dans MongoDB Atlas, vous pouvez voir:
- **Metrics**: Performance, connexions, requêtes
- **Real-Time**: Opérations en temps réel
- **Alerts**: Configurez des alertes

## 💰 Coûts

**Free Tier (M0):**
- ✅ 512 MB de stockage
- ✅ Parfait pour développement et petite production
- ✅ Pas de carte de crédit requise

**Upgrade** si besoin:
- M2: $9/mois
- M5: $25/mois

---

**Besoin d'aide?** Consultez [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
