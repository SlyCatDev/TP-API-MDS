import { Router } from 'express';
import { determineCoupureGeneric } from 'api_sylvain';

const router = Router();

/**
 * @swagger
 * /dab:
 *   get:
 *     summary: Afficher la page principale du distributeur de billets
 *     tags: [DAB]
 *     responses:
 *       200:
 *         description: Page affichée avec succès
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', (req, res) => {
  res.render('dab', {
    title: 'Distributeur de Billets (DAB)',
    message: 'Distributeur de billets automatique',
    //login: null, // gérer un utilisateur connecté
  });
});

/**
 * @swagger
 * /dab/smallest/{montant}/{devise}:
 *   get:
 *     summary: Déterminer les coupures les plus petites pour un montant donné
 *     tags: [DAB]
 *     parameters:
 *       - in: path
 *         name: montant
 *         required: true
 *         description: Montant à décomposer
 *         schema:
 *           type: number
 *       - in: path
 *         name: devise
 *         required: false
 *         description: Devise du montant (optionnel, par défaut en euros)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 smallest:
 *                   type: string
 *                   description: Coupures les plus petites nécessaires
 *       400:
 *         description: Montant invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur pour un montant invalide
 *       500:
 *         description: Erreur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur pour une erreur interne
 */
router.get('/smallest/:montant/:devise?', (req, res) => {
  // Récupération des paramètres depuis l'URL
  const montant = parseFloat(req.params.montant);
  const devise = req.params.devise;

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
