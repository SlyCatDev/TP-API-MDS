import { Router } from 'express';
import determineCoupureGeneric from 'api_sylvain';

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

router.get('/smallest/:montant/:devise?', (req, res) => {
  const montant = parseFloat(req.params.montant);
  const devise = req.params.devise || '€'; // Par défaut en euros

  // Validation du montant
  if (isNaN(montant) || montant <= 0) {
    return res.status(400).json({ error: 'Montant invalide. Veuillez entrer un montant positif.' });
  }

  try {
    const result = determineCoupureGeneric({ montant, devise });
    const smallest = result.split('\n').pop();
    // Format plus lisible pour le chat
    res.status(200).json({
      smallest: smallest.replace(/\[|\]/g, '').replace(/,/g, ', '),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur interne est survenue.' });
  }
});

export default router;