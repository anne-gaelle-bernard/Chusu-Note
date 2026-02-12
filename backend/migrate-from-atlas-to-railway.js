const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Modèles
const User = require('./models/User');
const Fruit = require('./models/Fruit');
const Note = require('./models/Note');
const Reminder = require('./models/Reminder');

// Configuration
const ATLAS_DB = process.env.MONGODB_URI_ATLAS || 'mongodb+srv://user:pass@cluster.mongodb.net/Chusu_note';
const RAILWAY_DB = process.env.MONGODB_URI || process.env.MONGO_URL;

async function migrateData() {
  console.log('🔄 Démarrage de la migration d\'Atlas vers Railway MongoDB...\n');
  
  if (!RAILWAY_DB) {
    console.error('❌ ERREUR: Variable MONGODB_URI non configurée!');
    console.log('📝 Configurez MONGODB_URI dans vos variables d\'environnement');
    process.exit(1);
  }
  
  if (!ATLAS_DB || ATLAS_DB === 'mongodb+srv://user:pass@cluster.mongodb.net/Chusu_note') {
    console.error('❌ ERREUR: Variable MONGODB_URI_ATLAS non configurée!');
    console.log('📝 Créez un fichier .env avec:');
    console.log('MONGODB_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/Chusu_note');
    process.exit(1);
  }

  let atlasConnection, railwayConnection;
  
  try {
    // Connexion à MongoDB Atlas
    console.log('📡 Connexion à MongoDB Atlas...');
    atlasConnection = await mongoose.createConnection(ATLAS_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à Atlas\n');
    
    // Créer les modèles pour la connexion Atlas
    const AtlasUser = atlasConnection.model('User', User.schema);
    const AtlasFruit = atlasConnection.model('Fruit', Fruit.schema);
    const AtlasNote = atlasConnection.model('Note', Note.schema);
    const AtlasReminder = atlasConnection.model('Reminder', Reminder.schema);
    
    // Récupération des données d'Atlas
    console.log('📦 Récupération des données d\'Atlas...');
    const users = await AtlasUser.find({}).lean();
    const fruits = await AtlasFruit.find({}).lean();
    const notes = await AtlasNote.find({}).lean();
    const reminders = await AtlasReminder.find({}).lean();
    
    console.log(` 👥 Utilisateurs: ${users.length}`);
    console.log(` 🍊 Fruits: ${fruits.length}`);
    console.log(` 📝 Notes: ${notes.length}`);
    console.log(` ⏰ Rappels: ${reminders.length}\n`);
    
    if (users.length === 0 && fruits.length === 0 && notes.length === 0 && reminders.length === 0) {
      console.log('⚠️  Aucune donnée à migrer!');
      await atlasConnection.close();
      process.exit(0);
    }
    
    // Connexion à Railway MongoDB
    console.log('📡 Connexion à Railway MongoDB...');
    railwayConnection = await mongoose.createConnection(RAILWAY_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connecté à Railway\n');
    
    // Créer les modèles pour la connexion Railway
    const RailwayUser = railwayConnection.model('User', User.schema);
    const RailwayFruit = railwayConnection.model('Fruit', Fruit.schema);
    const RailwayNote = railwayConnection.model('Note', Note.schema);
    const RailwayReminder = railwayConnection.model('Reminder', Reminder.schema);
    
    // Migration des données
    console.log('🚀 Migration en cours...\n');
    
    // Migrer les utilisateurs
    if (users.length > 0) {
      console.log('👥 Migration des utilisateurs...');
      for (const user of users) {
        const exists = await RailwayUser.findById(user._id);
        if (!exists) {
          await RailwayUser.create(user);
          console.log(` ✅ ${user.username}`);
        } else {
          console.log(` ⏭️  ${user.username} (déjà existant)`);
        }
      }
    }
    
    // Migrer les fruits
    if (fruits.length > 0) {
      console.log('\n🍊 Migration des fruits...');
      for (const fruit of fruits) {
        const exists = await RailwayFruit.findById(fruit._id);
        if (!exists) {
          await RailwayFruit.create(fruit);
          console.log(` ✅ ${fruit.nomFruit}`);
        } else {
          console.log(` ⏭️  ${fruit.nomFruit} (déjà existant)`);
        }
      }
    }
    
    // Migrer les notes
    if (notes.length > 0) {
      console.log('\n📝 Migration des notes...');
      for (const note of notes) {
        const exists = await RailwayNote.findById(note._id);
        if (!exists) {
          await RailwayNote.create(note);
          console.log(` ✅ Note: ${note.title}`);
        } else {
          console.log(` ⏭️  Note: ${note.title} (déjà existante)`);
        }
      }
    }
    
    // Migrer les rappels
    if (reminders.length > 0) {
      console.log('\n⏰ Migration des rappels...');
      for (const reminder of reminders) {
        const exists = await RailwayReminder.findById(reminder._id);
        if (!exists) {
          await RailwayReminder.create(reminder);
          console.log(` ✅ ${reminder.title}`);
        } else {
          console.log(` ⏭️  ${reminder.title} (déjà existant)`);
        }
      }
    }
    
    // Vérification finale
    console.log('\n📊 Vérification finale...');
    const railwayUserCount = await RailwayUser.countDocuments();
    const railwayFruitCount = await RailwayFruit.countDocuments();
    const railwayNoteCount = await RailwayNote.countDocuments();
    const railwayReminderCount = await RailwayReminder.countDocuments();
    
    console.log(` 👥 Utilisateurs dans Railway: ${railwayUserCount}`);
    console.log(` 🍊 Fruits dans Railway: ${railwayFruitCount}`);
    console.log(` 📝 Notes dans Railway: ${railwayNoteCount}`);
    console.log(` ⏰ Rappels dans Railway: ${railwayReminderCount}`);
    
    console.log('\n✅ MIGRATION TERMINÉE AVEC SUCCÈS! 🎉\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR DURANT LA MIGRATION:');
    console.error(error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    // Fermer les connexions
    if (atlasConnection) {
      await atlasConnection.close();
      console.log('🔌 Connexion Atlas fermée');
    }
    if (railwayConnection) {
      await railwayConnection.close();
      console.log('🔌 Connexion Railway fermée');
    }
  }
}

// Exécuter la migration
migrateData();
