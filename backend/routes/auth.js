const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Inscription
router.post('/register', async (req, res) => {
    console.log('📝 [REGISTER] Tentative d\'inscription:', { username: req.body.username, email: req.body.email });
    console.log('🔐 [REGISTER] JWT_SECRET défini:', !!process.env.JWT_SECRET);
    
    try {
        const { username, email, password } = req.body;

        // Validation des champs
        if (!username || !email || !password) {
            console.log('❌ [REGISTER] Champs manquants');
            return res.status(400).json({ 
                message: 'Tous les champs sont requis.' 
            });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ 
                message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Le mot de passe doit contenir au moins 6 caractères.' 
            });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Email invalide.' 
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }] 
        });
        if (existingUser) {
            if (existingUser.email === email.toLowerCase().trim()) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé.' });
        }

        // Créer le nouvel utilisateur
        const user = new User({ 
            username: username.trim(), 
            email: email.toLowerCase().trim(), 
            password 
        });
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
        console.error('❌ [REGISTER] Erreur inscription:', error.message);
        console.error('❌ [REGISTER] Stack:', error.stack);
        
        // Gestion des erreurs de validation MongoDB
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.log('⚠️  [REGISTER] Erreur de validation:', messages);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        // Erreur de duplication (code 11000)
        if (error.code === 11000) {
            console.log('⚠️  [REGISTER] Duplicate key');
            return res.status(400).json({ 
                message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' 
            });
        }
        
        res.status(500).json({ 
            message: 'Erreur lors de l\'inscription.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    console.log('🔑 [LOGIN] Tentative de connexion:', { email: req.body.email });
    console.log('🔐 [LOGIN] JWT_SECRET défini:', !!process.env.JWT_SECRET);
    
    try {
        const { email, password } = req.body;

        // Validation des champs
        if (!email || !password) {
            console.log('❌ [LOGIN] Champs manquants');
            return res.status(400).json({ 
                message: 'Email et mot de passe requis.' 
            });
        }

        // Trouver l'utilisateur
        const user = await User.findOne({ email: email.toLowerCase().trim() });
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
        console.error('❌ [LOGIN] Erreur connexion:', error.message);
        console.error('❌ [LOGIN] Stack:', error.stack);
        res.status(500).json({ 
            message: 'Erreur lors de la connexion.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
