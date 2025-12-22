const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ATLAS_URI = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI;

console.log('🔍 Test de connexion à MongoDB Atlas\n');
console.log('URI:', ATLAS_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'), '\n');

async function testConnection() {
    try {
        console.log('📡 Connexion en cours...');
        await mongoose.connect(ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connexion réussie à MongoDB Atlas!\n');
        
        // Récupérer les informations du serveur
        const admin = mongoose.connection.db.admin();
        const serverInfo = await admin.serverInfo();
        
        console.log('📊 Informations du serveur:');
        console.log(`   Version MongoDB: ${serverInfo.version}`);
        console.log(`   Git Version: ${serverInfo.gitVersion}`);
        console.log(`   Architecture: ${serverInfo.bits}-bit\n`);
        
        // Lister les bases de données
        const dbAdmin = mongoose.connection.db.admin();
        const dbs = await dbAdmin.listDatabases();
        
        console.log('💾 Bases de données:');
        dbs.databases.forEach(db => {
            const sizeMB = (db.sizeOnDisk / 1024 / 1024).toFixed(2);
            console.log(`   - ${db.name} (${sizeMB} MB)`);
        });
        console.log('');
        
        // Lister les collections dans chusu_note
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        if (collections.length > 0) {
            console.log('📚 Collections dans chusu_note:');
            for (const collection of collections) {
                const count = await mongoose.connection.db.collection(collection.name).countDocuments();
                console.log(`   - ${collection.name}: ${count} documents`);
            }
        } else {
            console.log('📚 Aucune collection trouvée dans chusu_note');
            console.log('   (Normal si c\'est une nouvelle base)\n');
        }
        
        console.log('\n✅ Test terminé avec succès!');
        
    } catch (error) {
        console.error('\n❌ Erreur de connexion:');
        console.error(`   ${error.message}\n`);
        
        if (error.message.includes('authentication')) {
            console.log('💡 Vérifiez:');
            console.log('   - Le nom d\'utilisateur et mot de passe');
            console.log('   - Les caractères spéciaux sont encodés en URL');
            console.log('   - L\'utilisateur existe dans Database Access\n');
        } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
            console.log('💡 Vérifiez:');
            console.log('   - Network Access dans Atlas (0.0.0.0/0)');
            console.log('   - Votre connexion internet');
            console.log('   - Le nom du cluster est correct\n');
        }
        
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connexion fermée\n');
    }
}

testConnection();
