import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Middleware pour vérifier le token JWT
export function authenticateJWT(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Token manquant, authorization denied' });
      }
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
      } catch (err) {
        res.status(401).json({ message: 'Token invalide'});
      }
    };