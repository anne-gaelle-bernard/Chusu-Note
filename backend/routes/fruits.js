const express = require('express');
const router = express.Router();
const Fruit = require('../models/Fruit');
const authMiddleware = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(authMiddleware);

// Obtenir tous les fruits de l'utilisateur connecté
router.get('/', async (req, res) => {
    try {
        const fruits = await Fruit.find({ userId: req.userId })
            .sort({ createdAt: -1 });
        res.json(fruits);
    } catch (error) {
        console.error('Erreur récupération fruits:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des fruits.' });
    }
});

// Obtenir un fruit spécifique
router.get('/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!fruit) {
            return res.status(404).json({ message: 'Fruit non trouvé.' });
        }
        
        res.json(fruit);
    } catch (error) {
        console.error('Erreur récupération fruit:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du fruit.' });
    }
});

// Créer un nouveau fruit
router.post('/', async (req, res) => {
    try {
        const fruitData = {
            ...req.body,
            userId: req.userId
        };
        
        const fruit = new Fruit(fruitData);
        await fruit.save();
        
        res.status(201).json({
            message: 'Fruit ajouté avec succès !',
            fruit
        });
    } catch (error) {
        console.error('Erreur création fruit:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du fruit.' });
    }
});

// Mettre à jour un fruit
router.put('/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!fruit) {
            return res.status(404).json({ message: 'Fruit non trouvé.' });
        }
        
        res.json({
            message: 'Fruit modifié avec succès !',
            fruit
        });
    } catch (error) {
        console.error('Erreur mise à jour fruit:', error);
        res.status(500).json({ message: 'Erreur lors de la modification du fruit.' });
    }
});

// Supprimer un fruit
router.delete('/:id', async (req, res) => {
    try {
        const fruit = await Fruit.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!fruit) {
            return res.status(404).json({ message: 'Fruit non trouvé.' });
        }
        
        res.json({ message: 'Fruit supprimé avec succès !' });
    } catch (error) {
        console.error('Erreur suppression fruit:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du fruit.' });
    }
});

module.exports = router;
