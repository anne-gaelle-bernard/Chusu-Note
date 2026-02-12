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
const LOCAL_DB = 'mongodb://localhost:27017/chusu_note';
const ATLAS_DB = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI;

async function migrateData() {
    console.log('🔄 Démarrage de la migration vers MongoDB Atlas...\n');

    if (!ATLAS_DB || ATLAS_DB.includes('localhost')) {
        console.error('❌ ERREUR: Variable MONGODB_URI_ATLAS non configurée!');
        console.log('📝 Créez un fichier .env avec:');
        console.log('MONGODB_URI_ATLAS=mongodb+srv://username:password@cluster.mongodb.net/chusu_note');
        process.exit(1);
    }

    let localConnection, atlasConnection;
    
    try {
        // Connexion à la base locale
        console.log('📡 Connexion à la base de données locale...');
        localConnection = await mongoose.createConnection(LOCAL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connecté à la base locale\n');

        // Créer les modèles pour la connexion locale
        const LocalUser = localConnection.model('User', User.schema);
        const LocalFruit = localConnection.model('Fruit', Fruit.schema);
        const LocalNote = localConnection.model('Note', Note.schema);
        const LocalReminder = localConnection.model('Reminder', Reminder.schema);

        // Récupération des données locales
        console.log('📦 Récupération des données locales...');
        const users = await LocalUser.find({}).lean();
        const fruits = await LocalFruit.find({}).lean();
        const notes = await LocalNote.find({}).lean();
        const reminders = await LocalReminder.find({}).lean();

        console.log(`   👥 Utilisateurs: ${users.length}`);
        console.log(`   🍊 Fruits: ${fruits.length}`);
        console.log(`   📝 Notes: ${notes.length}`);
        console.log(`   ⏰ Rappels: ${reminders.length}\n`);

        if (users.length === 0 && fruits.length === 0 && notes.length === 0 && reminders.length === 0) {
            console.log('⚠️  Aucune donnée à migrer!');
            await localConnection.close();
            process.exit(0);
        }

        // Connexion à Atlas
        console.log('📡 Connexion à MongoDB Atlas...');
        atlasConnection = await mongoose.createConnection(ATLAS_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connecté à MongoDB Atlas\n');

        // Créer les modèles pour la connexion Atlas
        const AtlasUser = atlasConnection.model('User', User.schema);
        const AtlasFruit = atlasConnection.model('Fruit', Fruit.schema);
        const AtlasNote = atlasConnection.model('Note', Note.schema);
        const AtlasReminder = atlasConnection.model('Reminder', Reminder.schema);

        // Migration des données
        console.log('🚀 Migration en cours...\n');

        // Migrer les utilisateurs
        if (users.length > 0) {
            console.log('👥 Migration des utilisateurs...');
            for (const user of users) {
                const exists = await AtlasUser.findById(user._id);
                if (!exists) {
                    await AtlasUser.create(user);
                    console.log(`   ✅ ${user.username}`);
                } else {
                    console.log(`   ⏭️  ${user.username} (déjà existant)`);
                }
            }
        }

        // Migrer les fruits
        if (fruits.length > 0) {
            console.log('\n🍊 Migration des fruits...');
            for (const fruit of fruits) {
                const exists = await AtlasFruit.findById(fruit._id);
                if (!exists) {
                    await AtlasFruit.create(fruit);
                    console.log(`   ✅ ${fruit.name}`);
                } else {
                    console.log(`   ⏭️  ${fruit.name} (déjà existant)`);
                }
            }
        }

        // Migrer les notes
        if (notes.length > 0) {
            console.log('\n📝 Migration des notes...');
            for (const note of notes) {
                const exists = await AtlasNote.findById(note._id);
                if (!exists) {
                    await AtlasNote.create(note);
                    console.log(`   ✅ Note ID: ${note._id}`);
                } else {
                    console.log(`   ⏭️  Note ID: ${note._id} (déjà existante)`);
                }
            }
        }

        // Migrer les rappels
        if (reminders.length > 0) {
            console.log('\n⏰ Migration des rappels...');
            for (const reminder of reminders) {
                const exists = await AtlasReminder.findById(reminder._id);
                if (!exists) {
                    await AtlasReminder.create(reminder);
                    console.log(`   ✅ ${reminder.title}`);
                } else {
                    console.log(`   ⏭️  ${reminder.title} (déjà existant)`);
                }
            }
        }

        // Vérification finale
        console.log('\n📊 Vérification finale...');
        const atlasUserCount = await AtlasUser.countDocuments();
        const atlasFruitCount = await AtlasFruit.countDocuments();
        const atlasNoteCount = await AtlasNote.countDocuments();
        const atlasReminderCount = await AtlasReminder.countDocuments();

        console.log(`   👥 Utilisateurs dans Atlas: ${atlasUserCount}`);
        console.log(`   🍊 Fruits dans Atlas: ${atlasFruitCount}`);
        console.log(`   📝 Notes dans Atlas: ${atlasNoteCount}`);
        console.log(`   ⏰ Rappels dans Atlas: ${atlasReminderCount}`);

        console.log('\n✅ MIGRATION TERMINÉE AVEC SUCCÈS! 🎉\n');

    } catch (error) {
        console.error('\n❌ ERREUR DURANT LA MIGRATION:');
        console.error(error.message);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    } finally {
        // Fermer les connexions
        if (localConnection) {
            await localConnection.close();
            console.log('🔌 Connexion locale fermée');
        }
        if (atlasConnection) {
            await atlasConnection.close();
            console.log('🔌 Connexion Atlas fermée');
        }
    }
}

// Exécuter la migration
migrateData();
