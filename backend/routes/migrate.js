const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Fruit = require('../models/Fruit');
const Note = require('../models/Note');
const Reminder = require('../models/Reminder');

// POST /api/migrate - Trigger migration from Atlas to Railway
router.post('/migrate-from-atlas', async (req, res) => {
  const ATLAS_DB = process.env.MONGODB_URI_ATLAS;
  const RAILWAY_DB = process.env.MONGODB_URI;
  
  if (!ATLAS_DB || !RAILWAY_DB) {
    return res.status(400).json({
      success: false,
      error: 'Missing environment variables MONGODB_URI_ATLAS or MONGODB_URI'
    });
  }
  
  let atlasConnection, railwayConnection;
  
  try {
    // Connect to Atlas
    console.log('Connecting to Atlas...');
    atlasConnection = await mongoose.createConnection(ATLAS_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const AtlasUser = atlasConnection.model('User', User.schema);
    const AtlasFruit = atlasConnection.model('Fruit', Fruit.schema);
    const AtlasNote = atlasConnection.model('Note', Note.schema);
    const AtlasReminder = atlasConnection.model('Reminder', Reminder.schema);
    
    // Get data from Atlas
    const users = await AtlasUser.find({}).lean();
    const fruits = await AtlasFruit.find({}).lean();
    const notes = await AtlasNote.find({}).lean();
    const reminders = await AtlasReminder.find({}).lean();
    
    console.log(`Found: ${users.length} users, ${fruits.length} fruits, ${notes.length} notes, ${reminders.length} reminders`);
    
    // Connect to Railway
    console.log('Connecting to Railway...');
    railwayConnection = await mongoose.createConnection(RAILWAY_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const RailwayUser = railwayConnection.model('User', User.schema);
    const RailwayFruit = railwayConnection.model('Fruit', Fruit.schema);
    const RailwayNote = railwayConnection.model('Note', Note.schema);
    const RailwayReminder = railwayConnection.model('Reminder', Reminder.schema);
    
    const results = { users: 0, fruits: 0, notes: 0, reminders: 0 };
    
    // Migrate users
    for (const user of users) {
      const exists = await RailwayUser.findById(user._id);
      if (!exists) {
        await RailwayUser.create(user);
        results.users++;
      }
    }
    
    // Migrate fruits  
    for (const fruit of fruits) {
      const exists = await RailwayFruit.findById(fruit._id);
      if (!exists) {
        await RailwayFruit.create(fruit);
        results.fruits++;
      }
    }
    
    // Migrate notes
    for (const note of notes) {
      const exists = await RailwayNote.findById(note._id);
      if (!exists) {
        await RailwayNote.create(note);
        results.notes++;
      }
    }
    
    // Migrate reminders
    for (const reminder of reminders) {
      const exists = await RailwayReminder.findById(reminder._id);
      if (!exists) {
        await RailwayReminder.create(reminder);
        results.reminders++;
      }
    }
    
    // Close connections
    await atlasConnection.close();
    await railwayConnection.close();
    
    res.json({
      success: true,
      message: 'Migration completed successfully!',
      migrated: results,
      total: {
        users: users.length,
        fruits: fruits.length,
        notes: notes.length,
        reminders: reminders.length
      }
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    
    if (atlasConnection) await atlasConnection.close();
    if (railwayConnection) await railwayConnection.close();
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
