const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB (cached pour serverless)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chusu_note';
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI non définie dans les variables d\'environnement');
    }

    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    cachedDb = connection;
    console.log('✅ Connecté à MongoDB:', MONGODB_URI);
    return connection;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    throw error;
  }
}

// Routes
const authRoutes = require('../backend/routes/auth');
const fruitRoutes = require('../backend/routes/fruits');
const reminderRoutes = require('../backend/routes/reminders');
const noteRoutes = require('../backend/routes/notes');

// Les routes doivent correspondre au path après /api/
app.use('/auth', authRoutes);
app.use('/fruits', fruitRoutes);
app.use('/reminders', reminderRoutes);
app.use('/notes', noteRoutes);

// Route de bienvenue
app.get('/', (req, res) => {
    res.json({ 
        message: '🍊 Bienvenue sur l\'API CHUSU NOTE',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            fruits: '/api/fruits',
            reminders: '/api/reminders',
            notes: '/api/notes'
        }
    });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: err.message 
  });
});

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Erreur handler:', error);
    return res.status(500).json({ 
      error: 'Erreur de connexion à la base de données',
      message: error.message 
    });
  }
};
