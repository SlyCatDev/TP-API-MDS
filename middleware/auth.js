import { verifyToken } from '../auth/jwt.js';

export function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Header d\'autorisation manquant' 
            });
        }

        const token = authHeader.split(' ')[1];
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ 
            error: err.message || 'Token invalide' 
        });
    }
}

export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ 
                error: 'Accès non autorisé' 
            });
        }
        next();
    };
}
