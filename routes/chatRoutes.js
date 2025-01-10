import { Router } from 'express';

const router = Router();

// Route pour afficher la page de chat
router.get('/chat', (req, res) => {
    res.render('chat', { 
        title: 'Chat', 
        message: 'Chat en direct' 
    });
});

export default router;