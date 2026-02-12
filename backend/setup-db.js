// Script de migration pour créer les collections MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer les modèles
const User = require('./models/User');
const Fruit = require('./models/Fruit');
const Note = require('./models/Note');
const Reminder = require('./models/Reminder');

async function setupDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chusu_note';
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB:', MONGODB_URI);

    // Créer les collections si elles n'existent pas
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log('\n📦 Collections existantes:', collectionNames);

    // Créer les index pour optimiser les performances
    console.log('\n🔧 Création des index...');
    
    await User.createIndexes();
    console.log('✅ Index créés pour Users');

    await Fruit.createIndexes();
    console.log('✅ Index créés pour Fruits');

    await Note.createIndexes();
    console.log('✅ Index créés pour Notes');

    await Reminder.createIndexes();
    console.log('✅ Index créés pour Reminders');

    // Vérifier les collections après création
    const updatedCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n✨ Collections finales:', updatedCollections.map(c => c.name));

    console.log('\n🎉 Base de données configurée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Déconnexion de MongoDB');
  }
}

// Exécuter la migration
setupDatabase();
