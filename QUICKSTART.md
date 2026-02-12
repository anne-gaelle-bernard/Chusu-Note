# 🚀 Guide de Démarrage Rapide - CHUSU NOTE

## Statut Actuel ✅

- ✅ **Backend**: Démarré sur http://localhost:3000
- ✅ **Frontend**: Démarré sur http://localhost:5173
- ✅ **MongoDB**: Connecté et fonctionnel
- ✅ **API**: Toutes les routes fonctionnent

## 🎯 Utiliser l'Application

### Ouvrir l'application
```
http://localhost:5173
```

### Créer un compte
1. Cliquez sur "Créer un compte" ou "S'inscrire"
2. Remplissez le formulaire:
   - **Nom d'utilisateur**: Minimum 3 caractères
   - **Email**: Format email valide
   - **Mot de passe**: Minimum 6 caractères
3. Cliquez sur "S'INSCRIRE"

### Se connecter
1. Utilisez votre email et mot de passe
2. Cliquez sur "Se connecter"

## 🔧 Redémarrer les Serveurs

Si vous devez redémarrer:

### Option 1: Scripts PowerShell (Recommandé)
```powershell
# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\User\Documents\Projet personnel\Chusu-Note\backend'; npm run dev"

# Frontend (attendre 3 secondes après le backend)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\User\Documents\Projet personnel\Chusu-Note\frontend'; npm run dev"
```

### Option 2: Manuellement
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🐛 Résolution des Problèmes

### Erreur "Unexpected token A"
**Cause**: Le backend n'est pas démarré

**Solution**:
1. Vérifiez que le backend tourne sur le port 3000
2. Ouvrez http://localhost:3000 - vous devriez voir un message JSON
3. Si non, redémarrez le backend

### Port déjà utilisé
```powershell
# Tuer tous les processus Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Redémarrer
```

### MongoDB non connecté
```powershell
# Vérifier le service
Get-Service MongoDB

# Démarrer si nécessaire
Start-Service MongoDB
```

## ✅ Vérification Rapide

Testez que tout fonctionne:

```powershell
# Backend
Invoke-RestMethod -Uri "http://localhost:3000/"

# Frontend
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```

## 📝 Utilisateurs de Test

Vous pouvez utiliser ces comptes de test:

- **Username**: testuser / **Email**: test@example.com / **Password**: password123
- **Username**: anne2 / **Email**: anne2@gmail.com / **Password**: azerty123

## 🎨 Fonctionnalités Disponibles

Une fois connecté:
- 📊 **Dashboard**: Vue d'ensemble de vos données
- 🍊 **Fruits**: Gestion de consommation de fruits
- 📝 **Notes**: Prise de notes personnelles
- 📅 **Rappels**: Gestion de rappels
- 👤 **Profil**: Modification de vos informations

## 🌐 URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000 (voir les endpoints disponibles)

## 💡 Astuces

1. Le backend doit TOUJOURS être démarré avant le frontend
2. Si vous voyez une erreur JSON, rechargez la page une fois que le backend est prêt
3. Les tokens sont stockés dans localStorage du navigateur
4. Pour vous déconnecter, utilisez le bouton de déconnexion dans l'interface

---

**Tout fonctionne maintenant! Profitez de CHUSU NOTE! 🍊**
