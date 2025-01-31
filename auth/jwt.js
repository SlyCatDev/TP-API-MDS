import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Vérifier que la clé secrète existe
/*if (!JWT_SECRET) {
    throw new Error('JWT_SECRET doit être défini dans les variables d\'environnement');
}
*/
// Génération d'un token
export function generateToken(payload, expiresIn = '1h') {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Payload invalide');
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
        algorithm: 'HS256'
    });
}
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