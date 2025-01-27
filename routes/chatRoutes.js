import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Gestion des fonctionnalités de chat
 */

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Afficher la page du chat
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Page du chat rendue avec succès
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/chat', (req, res) => {
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