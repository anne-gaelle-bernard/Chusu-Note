# 🍊 CHUSU NOTE

Application de suivi de vos "fruits" avec authentification et base de données MongoDB.
Architecture séparée Frontend/Backend.

## 📁 Structure du projet

```
chusu-note/
├── backend/              # API Node.js + Express + MongoDB
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes API
│   ├── middleware/      # Middlewares
│   ├── server.js        # Serveur principal
│   ├── package.json     # Dépendances backend
│   └── .env             # Variables d'environnement
│
├── frontend/            # Application web (HTML/CSS/JS)
│   ├── index.html       # Page principale
│   ├── auth.html        # Page connexion/inscription
│   ├── script.js        # Logique principale
│   ├── auth.js          # Logique authentification
│   ├── styles.css       # Styles CSS
│   └── package.json     # Dépendances frontend
│
└── Documentation/
    ├── README.md            # Ce fichier
    ├── ARCHITECTURE.md      # Architecture détaillée
    └── COMMANDS.md          # Commandes utiles
```

## 🚀 Installation

### Prérequis
- Node.js installé
- MongoDB en cours d'exécution sur `localhost:27017`

### Installation

**Installer les dépendances backend :**
```bash
cd backend
npm install
```

**Installer les dépendances frontend :**
```bash
cd frontend
npm install
```

## 🎯 Démarrage

### Script automatique (recommandé)
```bash
.\start.ps1
```

### Démarrage manuel

**Terminal 1 - Backend (Port 3000) :**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend (Port 8080) :**
```bash
cd frontend
npm start
```

Puis ouvrez `http://localhost:8080` dans votre navigateur.

## 🔧 Configuration Backend

### 🗄️ Configuration MongoDB

**Important:** Le nom de la base de données est `chusu-note` (avec tiret, pas underscore)

Fichier `backend/.env` :
```env
MONGODB_URI=mongodb://localhost:27017/chusu-note
JWT_SECRET=votre_secret_jwt_super_securise
PORT=3000
```

## 📱 Utilisation

1. Créez un compte via la page d'inscription
2. Connectez-vous avec vos identifiants
3. Ajoutez vos fruits avec toutes les informations
4. Suivez leur évolution et résultats

## 🔗 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil (protégé)

### Fruits (protégées par JWT)
- `GET /api/fruits` - Liste
- `POST /api/fruits` - Créer
- `PUT /api/fruits/:id` - Modifier
- `DELETE /api/fruits/:id` - Supprimer

## ✨ Fonctionnalités

- ✅ Authentification sécurisée (JWT + bcrypt)
- ✅ Gestion complète des fruits
- ✅ Suivi des dates et résultats
- ✅ Design mobile-first (jaune dominant)
- ✅ Base de données MongoDB persistante
- ✅ Isolation des données par utilisateur

## 🛠️ Technologies

**Backend :** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs  
**Frontend :** HTML5, CSS3, JavaScript Vanilla

## 📚 Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture détaillée
- [COMMANDS.md](COMMANDS.md) - Commandes et debug

## 🔐 Sécurité

- Mots de passe hashés (bcrypt)
- Tokens JWT avec expiration
- CORS configuré
- Validation Mongoose

---

Made with 💛 for tracking your fruits 🍊
