// Test simple de connexion MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chusu_note';

console.log('🔌 Test de connexion à MongoDB...');
console.log('📍 URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ SUCCÈS: Connecté à MongoDB!');
        console.log('📊 Base de données:', mongoose.connection.db.databaseName);
        console.log('🌐 Hôte:', mongoose.connection.host);
        mongoose.connection.close();
        console.log('👋 Déconnexion réussie');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ ERREUR de connexion MongoDB:', err.message);
        process.exit(1);
    });
