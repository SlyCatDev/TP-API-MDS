import { Router } from 'express';
import { User } from '../models/User.js';
import { authenticateJWT } from '../middleware/auth.js';
// import bcrypt from 'bcrypt';
// import { Role } from '../models/Role.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Utilisateur:
 *       type: object
 *       properties:
 *         idUtilisateur:
 *           type: integer
 *           description: Identifiant unique de l'utilisateur
 *         nom:
 *           type: string
 *           description: Nom de l'utilisateur
 *         prenom:
 *           type: string
 *           description: Prénom de l'utilisateur
 *         adresse_mail:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         telephone:
 *           type: string
 *           description: Numéro de téléphone
 *           nullable: true
 *         plaque_immatriculation:
 *           type: string
 *           description: Plaque d'immatriculation
 *           nullable: true
 *       required:
 *         - nom
 *         - prenom
 *         - adresse_mail
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Utilisateurs trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utilisateur'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const utilisateurs = await User.findAll({
      // include: [
      //   {
      //     model: Role,
      //     as: 'role',
      //     attributes: ['nom'], // Récupérer uniquement le nom du rôle
      //   },
      // ],
      // attributes: { exclude: ['password'] }, // Ne pas envoyer le mot de passe
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
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - adresse_mail
 *               - password
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Dupont
 *               prenom:
 *                 type: string
 *                 example: Jean
 *               adresse_mail:
 *                 type: string
 *                 format: email
 *                 example: jean.dupont@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nom:
 *                   type: string
 *                   example: Dupont
 *                 prenom:
 *                   type: string
 *                   example: Jean
 *                 adresse_mail:
 *                   type: string
 *                   example: jean.dupont@example.com
 *       400:
 *         description: Données invalides ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cet email est déjà utilisé
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur serveur
 */

router.post('/', async (req, res) => {
  const { nom, prenom, adresse_mail, password } = req.body;

  if (!nom || !prenom || !adresse_mail || !password) {
    return res
      .status(400)
      .json({ error: 'Tous les champs obligatoires doivent être remplis' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await User.findOne({ where: { adresse_mail } });
    if (utilisateurExistant) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hash du mot de passe
    // const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateur = await User.create({
      nom,
      prenom,
      adresse_mail,
      password: password,
    });

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
router.put('/:id', async (req, res) => {
  try {
    const utilisateur = await User.findByPk(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await User.update(req.body, {
      where: { idUtilisateur: req.params.id },
    });

    res.json({ message: 'Utilisateur a été modifié' });
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
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    // // Ensuite supprimer l'utilisateur
    // const deletedRows = await User.destroy({
    //   where: { idUtilisateur: userId }
    // });
    await user.destroy();

    // if (deletedRows === 0) {
    //   return res.status(404).json({ message: 'Utilisateur non trouvé' });
    // }

    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

export default router;
