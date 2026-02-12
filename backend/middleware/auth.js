const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Définir req.user avec id pour compatibilité
        req.user = {
            id: decoded.userId,
            userId: decoded.userId
        };
        req.userId = decoded.userId; // Gardé pour compatibilité
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

module.exports = authMiddleware;
