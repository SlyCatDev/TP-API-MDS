import { Router } from 'express';
import utilisateur from '../models/utilisateur';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /utilisateurs:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utilisateur'
 *       500:
 *         description: Erreur serveur
 */
router.get('/utilisateurs', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll();
    res.json(utilisateurs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /utilisateurs/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/utilisateurs/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.json(utilisateur);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /utilisateurs:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Utilisateur'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       500:
 *         description: Erreur serveur
 */
router.post('/utilisateurs', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.create(req.body);
    res.status(201).json(utilisateur);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /utilisateurs/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Utilisateur'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       500:
 *         description: Erreur serveur
 */
router.put('/utilisateurs/:id', async (req, res) => {
  try {
    await Utilisateur.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: 'Utilisateur mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /utilisateurs/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/utilisateurs/:id', async (req, res) => {
  try {
    await Utilisateur.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;