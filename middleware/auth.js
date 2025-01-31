import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import { JWT_SECRET } from '../auth/jwt.js';

// Charger les variables d'environnement
dotenv.config();

// Vérifier que la clé secrète existe
// if (!JWT_SECRET) {
   // throw new Error('JWT_SECRET doit être défini dans les variables d\'environnement');
//}

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