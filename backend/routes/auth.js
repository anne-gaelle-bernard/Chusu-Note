const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' 
            });
        }

        // Créer le nouvel utilisateur
        const user = new User({ username, email, password });
        await user.save();

        // Créer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Inscription réussie !',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Connexion réussie !',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
});

// Vérifier le token (route protégée)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Get statistics
        const Fruit = require('../models/Fruit');
        const Reminder = require('../models/Reminder');
        
        const fruitsCount = await Fruit.countDocuments({ utilisateurId: req.userId });
        const ttCount = await Fruit.countDocuments({ 
            utilisateurId: req.userId, 
            resultatManam: 'TT' 
        });
        const remindersCount = await Reminder.countDocuments({ 
            userId: req.userId, 
            completed: false 
        });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            fruitsCount,
            ttCount,
            remindersCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Update profile
router.put('/update', authMiddleware, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Check if username or email is already taken by another user
        if (username !== user.username || email !== user.email) {
            const existingUser = await User.findOne({
                _id: { $ne: req.userId },
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' 
                });
            }
        }

        user.username = username;
        user.email = email;
        await user.save();

        res.json({
            message: 'Profil mis à jour !',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur mise à jour:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
    }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Mot de passe modifié avec succès !' });
    } catch (error) {
        console.error('Erreur changement mot de passe:', error);
        res.status(500).json({ message: 'Erreur lors du changement de mot de passe.' });
    }
});

module.exports = router;
