import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  try {
    res.render('chat', { 
      title: 'Chat', 
      message: 'Chat en direct' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;