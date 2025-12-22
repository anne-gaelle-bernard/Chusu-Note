# 🚀 Migration Rapide vers MongoDB Atlas

## ID Projet: 69483f1f5fb9bd46c36fcad1

### Étape 1: Obtenir la Chaîne de Connexion Atlas

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Cliquez sur **Connect** sur votre cluster
3. Choisissez **Connect your application**
4. Copiez la chaîne de connexion

**Format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/chusu_note
```

### Étape 2: Exécuter la Migration

**Option 1: Script PowerShell (Recommandé)**

```powershell
# Avec la chaîne de connexion
.\migrate-atlas.ps1 -AtlasUri "mongodb+srv://user:pass@cluster.mongodb.net/chusu_note"

# Ou sans paramètre (le script vous demandera l'URI)
.\migrate-atlas.ps1
```

**Option 2: Script Node.js Direct**

```powershell
# 1. Ajoutez MONGODB_URI_ATLAS dans backend/.env
notepad backend\.env

# 2. Ajoutez cette ligne:
# MONGODB_URI_ATLAS=mongodb+srv://user:pass@cluster.mongodb.net/chusu_note

# 3. Exécutez la migration
cd backend
npm run migrate
```

### Étape 3: Vérifier

```powershell
# Dans MongoDB Atlas → Database → Browse Collections
# Vous devriez voir vos données
```

### Étape 4: Déployer sur Railway

```powershell
# 1. Dans Railway Dashboard → Variables
# Ajoutez ou mettez à jour:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chusu_note

# 2. Railway redéploiera automatiquement
```

---

## ⚠️ Important

**Avant de migrer:**
- [ ] MongoDB local est démarré
- [ ] Cluster Atlas est créé
- [ ] Utilisateur de base de données créé dans Atlas
- [ ] IP autorisée (0.0.0.0/0) dans Network Access

**Après la migration:**
- [ ] Données vérifiées dans Atlas
- [ ] Variable MONGODB_URI mise à jour dans Railway
- [ ] Application testée

---

## 🆘 Aide

**Erreurs courantes:**

1. **"Authentication failed"**
   - Vérifiez username/password dans la chaîne de connexion
   - Encodez les caractères spéciaux (@ = %40, : = %3A)

2. **"Network timeout"**
   - Vérifiez Network Access dans Atlas (0.0.0.0/0)

3. **"No data to migrate"**
   - Vérifiez que MongoDB local contient des données
   - Utilisez MongoDB Compass pour visualiser

**Guide complet:** [MIGRATION-ATLAS.md](./MIGRATION-ATLAS.md)
