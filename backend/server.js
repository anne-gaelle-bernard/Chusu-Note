const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement en premier
dotenv.config();

// Vérification des variables critiques
console.log('🔍 Vérification des variables d\'environnement...');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'non défini');
console.log('   RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT || 'non défini');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ défini' : '❌ NON DÉFINI');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ défini' : '❌ NON DÉFINI');

if (!process.env.JWT_SECRET) {
    console.error('❌ ERREUR CRITIQUE: JWT_SECRET n\'est pas défini!');
    console.error('⚠️  L\'authentification ne fonctionnera pas.');
}

const app = express();

// Sanitize FRONTEND_URL to avoid "Invalid character in header content"
const getAllowedOrigins = () => {
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
        // Split by comma if multiple origins are provided, and trim each
        return frontendUrl.split(',').map(url => url.trim()).filter(url => url);
    }
    return '*';
};

// Middlewares
app.use(cors({
    origin: getAllowedOrigins(),
    credentials: true
}));
app.use(express.json());

// Serve static files from frontend build (for Railway deployment)
// Force serving frontend in Railway environment
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && process.env.SERVE_FRONTEND === 'true') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    console.log('📦 Serving static frontend from:', frontendPath);
    app.use(express.static(frontendPath));
} else {
    console.log('🔧 API Mode - Frontend hosted separately (Vercel)');
}

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chusu_note';
let lastDbError = null;

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('✅ Connecté à MongoDB:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
        lastDbError = null;
    })
    .catch(err => {
        lastDbError = err.message;
        console.error('❌ Erreur de connexion MongoDB:', err.message);
        if (err.message.includes('bad auth')) {
            console.error('💡 Vérifiez votre nom d\'utilisateur et mot de passe dans MONGODB_URI');
        } else if (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv ETIMEOUT')) {
            console.error('💡 Vérifiez que votre adresse IP est autorisée dans MongoDB Atlas (Network Access -> Allow Access from Anywhere)');
        }
        console.error('⚠️  L\'application continuera sans base de données');
    });

// Health check endpoint for Railway (Moved before DB check to allow monitoring)
app.get('/api/health', (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        dbError: lastDbError,
        environment: process.env.NODE_ENV || 'development'
    };
    // Return 200 even if DB is down, so Railway knows the container is running
    res.status(200).json(healthCheck);
});

// Middleware de vérification de la base de données
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
            message: 'Service temporairement indisponible. La base de données n\'est pas connectée.',
            code: 'DB_DISCONNECTED',
            details: lastDbError // Expose error details to help debugging
        });
    }
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const fruitRoutes = require('./routes/fruits');
const reminderRoutes = require('./routes/reminders');
const noteRoutes = require('./routes/notes');

app.use('/api/auth', authRoutes);
app.use('/api/fruits', fruitRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notes', noteRoutes);

// API info endpoint (only in development or when explicitly requested)
app.get('/api', (req, res) => {
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

// Serve frontend for all other routes in production
if (isProduction && process.env.SERVE_FRONTEND === 'true') {
    app.get('*', (req, res) => {
        const indexPath = path.join(__dirname, '../frontend/dist/index.html');
        console.log('🌐 Serving index.html for:', req.url);
        res.sendFile(indexPath);
    });
}

// 404 Handler for API routes - Ensure JSON response
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Route API non trouvée.' });
});

// Global Error Handler - Ensure JSON response
app.use((err, req, res, next) => {
    console.error('❌ Global Error:', err);
    res.status(500).json({ 
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Gérer les erreurs du serveur
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé`);
        process.exit(1);
    } else {
        console.error('❌ Erreur serveur:', error);
    }
});

// Gérer l'arrêt gracieux
process.on('SIGTERM', async () => {
    console.log('👋 SIGTERM reçu, arrêt gracieux...');
    server.close(async () => {
        console.log('💤 Serveur fermé');
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('👋 SIGINT reçu, arrêt gracieux...');
    server.close(async () => {
        console.log('💤 Serveur fermé');
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
        process.exit(0);
    });
});





