const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement en premier
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Serve static files from frontend build (for Railway deployment)
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));
}

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chusu_note';
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
            fruits: '/api/fruits',
            reminders: '/api/reminders',
            notes: '/api/notes'
        }
    });
});

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
    };
    res.status(200).json(healthCheck);
});

// Serve frontend for all other routes in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});





