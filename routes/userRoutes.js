import { Router } from 'express';
import { User } from '../models/User.js';
// import Role  from '../models/Role.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *  get:
 *   summary: Récupérer tous les utilisateurs
 *   tags: [users]
 *   responses:
 *    200:
 *    description: Utilisateurs trouvés
 *    content:
 *      application/json:
 *       schema:
 *        type: array
 * items:
 * $ref: '#/components/schemas/Utilisateur'
 * 500:
 * description: Erreur serveur
 */
router.get('/', async (req, res) => {
  try {
    const utilisateurs = await User.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['nom'], // Récupérer uniquement le nom du rôle
        },
      ],
      attributes: { exclude: ['password'] }, // Ne pas envoyer le mot de passe
    });
    res.json(utilisateurs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID
 *     tags: [users]
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
router.get('/:id', async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
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
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [users]
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
router.post('/', async (req, res) => {
  const { nom, prenom, adresse_mail, password } = req.body;

  if (!nom || !prenom || !adresse_mail || !password) {
    return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
  }
  
  try {
    const utilisateur = await User.create(req.body);
    res.status(201).json(utilisateur);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [users]
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
router.put('/:id', async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

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
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [users]
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
router.delete('/:id', async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

export default router;