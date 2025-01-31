import { Router } from 'express';
import { determineCoupureGeneric } from 'api_sylvain';

const router = Router();

router.get('/', (req, res) => {
  res.render('dab', {
    title: 'Distributeur de Billets (DAB)',
    message: 'Distributeur de billets automatique',
    //login: null, // gérer un utilisateur connecté
  });
});

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
