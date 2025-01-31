import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Vérification d'un token
export function verifyToken(token) {
    if (!token) {
        throw new Error('Token manquant');
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expiré');
        }
        throw new Error('Token invalide');
    }
}