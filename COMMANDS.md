# 🛠️ Commandes Utiles - CHUSU NOTE

## 📦 Installation & Démarrage

### Installation initiale
```bash
npm install
```

### Démarrer l'application
```bash
# Méthode 1 : Script automatique (vérifie MongoDB)
start.bat           # Windows CMD
.\start.ps1         # Windows PowerShell

# Méthode 2 : Manuel
npm start           # Production
npm run dev         # Développement (avec nodemon)
```

### Arrêter le serveur
```
Ctrl + C dans le terminal
```

## 🗄️ MongoDB

### Démarrer MongoDB
```bash
# Windows (service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Arrêter MongoDB
```bash
# Windows
net stop MongoDB

# macOS/Linux
sudo systemctl stop mongod
```

### Se connecter à MongoDB (shell)
```bash
mongosh
# ou
mongo
```

### Commandes utiles MongoDB
```javascript
// Voir toutes les bases de données
show dbs

// Utiliser la base chusu_note
use chusu_note

// Voir les collections
show collections

// Voir tous les utilisateurs
db.users.find().pretty()

// Voir tous les fruits
db.fruits.find().pretty()

// Compter les utilisateurs
db.users.countDocuments()

// Compter les fruits
db.fruits.countDocuments()

// Supprimer tous les fruits (ATTENTION!)
db.fruits.deleteMany({})

// Supprimer un utilisateur spécifique
db.users.deleteOne({ email: "exemple@email.com" })

// Trouver les fruits d'un utilisateur
db.fruits.find({ userId: ObjectId("...") }).pretty()
```

## 🔍 Debug & Tests

### Vérifier les ports utilisés
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :27017

# macOS/Linux
lsof -i :3000
lsof -i :27017
```

### Tester les routes API (avec curl)

#### Inscription
```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"123456\"}"
```

#### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"123456\"}"
```

#### Récupérer les fruits (avec token)
```bash
curl -X GET http://localhost:3000/api/fruits ^
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

#### Créer un fruit
```bash
curl -X POST http://localhost:3000/api/fruits ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" ^
  -d "{\"nomFruit\":\"Jean\",\"memo\":\"Test memo\",\"dateChatGui\":\"2025-12-17\",\"typeChatGui\":\"event\"}"
```

## 📝 Logs & Monitoring

### Voir les logs en temps réel
```bash
npm start
# Les logs s'affichent dans le terminal
```

### Logs MongoDB
```bash
# Windows
type C:\Program Files\MongoDB\Server\7.0\log\mongod.log

# macOS/Linux
tail -f /var/log/mongodb/mongod.log
```

## 🧹 Maintenance

### Nettoyer node_modules et réinstaller
```bash
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Réinitialiser la base de données
```javascript
// Dans mongosh/mongo
use chusu_note
db.dropDatabase()
```

### Vider le cache npm
```bash
npm cache clean --force
```

## 🔐 Sécurité

### Changer le JWT_SECRET (en production)
1. Ouvrir `.env`
2. Modifier `JWT_SECRET=nouvelle_valeur_tres_securisee`
3. Redémarrer le serveur

### Révoquer tous les tokens
Changez le `JWT_SECRET` dans `.env` - tous les tokens existants deviendront invalides.

## 🚀 Déploiement

### Variables d'environnement à configurer
- `MONGODB_URI` : URI de connexion MongoDB
- `JWT_SECRET` : Secret pour les tokens JWT (IMPORTANT!)
- `PORT` : Port du serveur (défaut: 3000)

### Build pour production
```bash
npm install --production
NODE_ENV=production npm start
```

## 📊 Statistiques

### Nombre total de lignes de code
```bash
# Windows PowerShell
(Get-ChildItem -Recurse -Include *.js,*.html,*.css | Select-String .).Count

# macOS/Linux
find . -name "*.js" -o -name "*.html" -o -name "*.css" | xargs wc -l
```

### Taille du projet
```bash
# Windows PowerShell
"{0:N2} MB" -f ((Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB)
```

## 🆘 Résolution de problèmes

### Le serveur ne démarre pas
1. Vérifier que MongoDB tourne : `tasklist | findstr mongod`
2. Vérifier que le port 3000 est libre
3. Vérifier les variables dans `.env`
4. Supprimer `node_modules` et réinstaller

### Erreur "Cannot connect to MongoDB"
1. Démarrer MongoDB : `net start MongoDB`
2. Vérifier l'URI dans `.env`
3. Vérifier que le port 27017 est ouvert

### Erreur "Token invalide"
1. Se reconnecter
2. Si le problème persiste, vérifier le `JWT_SECRET` dans `.env`

### Page blanche dans le navigateur
1. Vérifier que le serveur tourne
2. Ouvrir la console du navigateur (F12)
3. Vérifier les erreurs réseau
4. Vider le cache du navigateur (Ctrl + F5)
