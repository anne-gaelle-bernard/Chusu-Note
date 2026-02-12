const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/auth');

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Route pour obtenir les rappels urgents (doit être avant /:id)
router.get('/urgent', async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const urgentReminders = await Reminder.find({
            userId: userId,
            date: { $gte: today, $lte: threeDaysLater },
            completed: false
        }).sort({ date: 1 });

        res.json(urgentReminders);
    } catch (error) {
        console.error('Erreur GET urgent reminders:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des rappels urgents', error: error.message });
    }
});

// Route pour obtenir tous les rappels de l'utilisateur
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const reminders = await Reminder.find({ userId: userId }).sort({ date: 1 });
        res.json(reminders);
    } catch (error) {
        console.error('Erreur GET reminders:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des rappels', error: error.message });
    }
});

// Route pour créer un nouveau rappel
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const { title, description, date, priority } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: 'Le titre et la date sont requis' });
        }

        const reminder = new Reminder({
            userId: userId,
            title,
            description,
            date,
            priority: priority || 'medium'
        });

        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Erreur POST reminder:', error);
        res.status(500).json({ message: 'Erreur lors de la création du rappel', error: error.message });
    }
});

// Route pour mettre à jour un rappel
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const { title, description, date, priority, completed } = req.body;
        const reminderId = req.params.id;

        const reminder = await Reminder.findOne({ _id: reminderId, userId: userId });

        if (!reminder) {
            return res.status(404).json({ message: 'Rappel non trouvé' });
        }

        if (title !== undefined) reminder.title = title;
        if (description !== undefined) reminder.description = description;
        if (date !== undefined) reminder.date = date;
        if (priority !== undefined) reminder.priority = priority;
        if (completed !== undefined) reminder.completed = completed;

        await reminder.save();
        res.json(reminder);
    } catch (error) {
        console.error('Erreur PUT reminder:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du rappel', error: error.message });
    }
});

// Route pour supprimer un rappel
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const reminderId = req.params.id;
        const reminder = await Reminder.findOneAndDelete({ _id: reminderId, userId: userId });

        if (!reminder) {
            return res.status(404).json({ message: 'Rappel non trouvé' });
        }

        res.json({ message: 'Rappel supprimé avec succès' });
    } catch (error) {
        console.error('Erreur DELETE reminder:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du rappel', error: error.message });
    }
});

module.exports = router;
