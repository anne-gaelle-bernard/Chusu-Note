const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = connection;
  return connection;
}

// Routes
const authRoutes = require('../backend/routes/auth');
const fruitRoutes = require('../backend/routes/fruits');
const reminderRoutes = require('../backend/routes/reminders');
const noteRoutes = require('../backend/routes/notes');

app.use('/api/auth', authRoutes);
app.use('/api/fruits', fruitRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notes', noteRoutes);

// Route de bienvenue
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

// Vercel serverless handler
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
