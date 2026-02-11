const express = require('express');
const router = express.Router();
const Fruit = require('../models/Fruit');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
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

// Exporter tous les fruits en CSV
router.get('/export/csv', async (req, res) => {
    try {
        const fruits = await Fruit.find({ userId: req.userId }).sort({ createdAt: -1 });

        const fields = [
            'nomFruit', 'memo', 'priere', 'dateChatGui', 'typeChatGui',
            'dateManam', 'dateReminder', 'resultatManam', 'raison', 'createdAt', 'updatedAt'
        ];

        const data = fruits.map(f => ({
            nomFruit: f.nomFruit || '',
            memo: f.memo || '',
            priere: f.priere || '',
            dateChatGui: f.dateChatGui ? f.dateChatGui.toISOString() : '',
            typeChatGui: f.typeChatGui || '',
            dateManam: f.dateManam ? f.dateManam.toISOString() : '',
            dateReminder: f.dateReminder ? f.dateReminder.toISOString() : '',
            resultatManam: f.resultatManam || '',
            raison: f.raison || '',
            createdAt: f.createdAt ? f.createdAt.toISOString() : '',
            updatedAt: f.updatedAt ? f.updatedAt.toISOString() : ''
        }));

        const parser = new Parser({ fields });
        const csv = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('fruits.csv');
        res.send(csv);
    } catch (error) {
        console.error('Erreur export CSV:', error);
        res.status(500).json({ message: 'Erreur lors de l\'export CSV.' });
    }
});

// Exporter tous les fruits en PDF
router.get('/export/pdf', async (req, res) => {
    try {
        const fruits = await Fruit.find({ userId: req.userId }).sort({ createdAt: -1 });

        res.setHeader('Content-disposition', 'attachment; filename=fruits.pdf');
        res.setHeader('Content-type', 'application/pdf');

        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        doc.pipe(res);

        doc.fontSize(18).text('Export des Fruits', { align: 'center' });
        doc.moveDown();

        fruits.forEach((f, idx) => {
            doc.fontSize(12).fillColor('black').text(`${idx + 1}. ${f.nomFruit || '—'}`, { underline: false });
            doc.moveDown(0.2);
            doc.fontSize(10).text(`Memo: ${f.memo || ''}`);
            if (f.priere) doc.text(`Priere: ${f.priere}`);
            doc.text(`Type: ${f.typeChatGui || ''}`);
            if (f.dateChatGui) doc.text(`Date chat: ${f.dateChatGui.toISOString()}`);
            if (f.dateManam) doc.text(`Date manam: ${f.dateManam.toISOString()}`);
            if (f.dateReminder) doc.text(`Date reminder: ${f.dateReminder.toISOString()}`);
            if (f.resultatManam) doc.text(`Resultat manam: ${f.resultatManam}`);
            if (f.raison) doc.text(`Raison: ${f.raison}`);
            doc.text(`Created at: ${f.createdAt ? f.createdAt.toISOString() : ''}`);
            doc.text(`Updated at: ${f.updatedAt ? f.updatedAt.toISOString() : ''}`);
            doc.moveDown();
            doc.moveDown(0.2);
            // add a horizontal rule
            doc.strokeColor('#aaaaaa').lineWidth(0.5).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error('Erreur export PDF:', error);
        res.status(500).json({ message: 'Erreur lors de l\'export PDF.' });
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
