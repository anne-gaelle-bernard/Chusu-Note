const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// Récupérer l'URI depuis les variables d'environnement ou utiliser celle par défaut
// NOTE: Vous devez remplacer <db_password> par votre vrai mot de passe si vous modifiez ce fichier directement
const uri = process.env.MONGODB_URI || "mongodb+srv://annegaellebernard_db_user:<db_password>@cluster0.af7jyxn.mongodb.net/?appName=Cluster0";

// Vérification de sécurité pour le mot de passe
if (uri.includes('<db_password>')) {
    console.error("\n❌ ERREUR: Le mot de passe n'est pas défini !");
    console.error("👉 Veuillez remplacer '<db_password>' par votre vrai mot de passe MongoDB.");
    console.error("   Ou définissez la variable MONGODB_URI dans votre fichier .env\n");
    process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("🔌 Tentative de connexion à MongoDB Atlas...");
    console.log(`📍 URI: ${uri.replace(/:([^:@]+)@/, ':****@')}`); // Masquer le mot de passe dans les logs
    
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
      console.error("❌ Erreur de connexion:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
