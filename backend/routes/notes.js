const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// GET toutes les notes de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Erreur GET notes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET une note spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Erreur GET note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer une nouvelle note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Titre et contenu requis' });
    }

    const note = new Note({
      userId: req.user.id,
      title: title.trim(),
      content: content.trim()
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Erreur POST note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour une note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Titre et contenu requis' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        title: title.trim(), 
        content: content.trim(),
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    res.json(note);
  } catch (error) {
    console.error('Erreur PUT note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer une note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    res.json({ message: 'Note supprimée', note });
  } catch (error) {
    console.error('Erreur DELETE note:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
