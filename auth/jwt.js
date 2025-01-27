import jwt from 'jsonwebtoken';
// import 'dotenv/config'

// Charger les variables d'environnement
// dotenv.config();

// Utiliser la clé depuis les variables d'environnement
//const JWT_SECRET = process.env.JWT_SECRET;

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

    return jwt.sign(payload, JWT_SECRET, {
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
        return jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expiré');
        }
        throw new Error('Token invalide');
    }
}