# ⚡ Configuration Rapide MongoDB Atlas

## Votre URI Atlas
```
mongodb+srv://annegaellebernard_db_user:<db_password>@cluster0.af7jyxn.mongodb.net/chusu_note
```

## Étape 1: Configurer le Mot de Passe

### Option A: Script Automatique (Recommandé)
```powershell
.\setup-atlas-password.ps1
```
Le script vous demandera le mot de passe et configurera tout automatiquement.

### Option B: Manuellement
1. Ouvrez `backend\.env`
2. Remplacez `<db_password>` par votre vrai mot de passe
3. Si le mot de passe contient des caractères spéciaux (@, :, /, etc.), encodez-les:
   - @ → %40
   - : → %3A
   - / → %2F
   - ? → %3F
   - # → %23

**Exemple:**
```
Mot de passe: MyPass@123
Dans .env: MyPass%40123
```

## Étape 2: Tester la Connexion

```powershell
cd backend
npm run test-atlas
```

Vous devriez voir:
```
✅ Connexion réussie à MongoDB Atlas!
```

## Étape 3: Migrer les Données (Optionnel)

Si vous avez des données locales à migrer:
```powershell
.\migrate-atlas.ps1
```

## Étape 4: Démarrer l'Application

```powershell
# Backend
cd backend
npm start

# Frontend (dans un autre terminal)
cd frontend
npm run dev
```

## ✅ Vérification

L'application devrait maintenant:
- ✅ Se connecter à MongoDB Atlas
- ✅ Créer/lire des données dans le cloud
- ✅ Fonctionner même si MongoDB local n'est pas démarré

## 🚀 Pour Railway

Dans Railway Dashboard → Variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://annegaellebernard_db_user:VOTRE_MOT_DE_PASSE@cluster0.af7jyxn.mongodb.net/chusu_note?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=votre_secret_securise_32_caracteres_minimum
```

## 🔒 Sécurité

**Important:**
1. Ne partagez JAMAIS le fichier .env
2. Vérifiez que .env est dans .gitignore
3. Utilisez un mot de passe fort pour MongoDB Atlas
4. Changez JWT_SECRET en production

## 🆘 Problèmes?

**"Authentication failed"**
- Vérifiez le mot de passe
- Vérifiez que l'utilisateur existe dans Atlas → Database Access

**"Network timeout"**
- Allez dans Atlas → Network Access
- Ajoutez 0.0.0.0/0 (Allow access from anywhere)

**"Cannot connect"**
- Vérifiez votre connexion internet
- Vérifiez que le nom du cluster est correct (cluster0.af7jyxn)
