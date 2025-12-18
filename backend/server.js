const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement en premier
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chusu-note';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connecté à MongoDB:', MONGODB_URI))
    .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Routes
const authRoutes = require('./routes/auth');
const fruitRoutes = require('./routes/fruits');
const reminderRoutes = require('./routes/reminders');
const noteRoutes = require('./routes/notes');

app.use('/api/auth', authRoutes);
app.use('/api/fruits', fruitRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notes', noteRoutes);

// Route de bienvenue
app.get('/', (req, res) => {
    res.json({ 
        message: '🍊 Bienvenue sur l\'API CHUSU NOTE',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            fruits: '/api/fruits'
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📝 Ouvrir http://localhost:${PORT}`);
});





