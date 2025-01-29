import { Router } from 'express';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
// import { generateToken } from '../auth/jwt.js';
// import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = Router();

// Définir __dirname dans un environnement ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Pages statiques et authentification du site
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Afficher la page d'accueil
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Page d'accueil affichée avec succès
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', message: 'Bienvenue' });
});

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Afficher la page "À propos"
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Page "À propos" affichée avec succès
 */
router.get('/about', (req, res) => {
  res.render('about', { title: 'À propos', message: 'À propos de moi' });
});

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Afficher la page de contact
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Page de contact affichée avec succès
 */
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', message: 'Contactez-moi' });
});

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Afficher le formulaire de connexion
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Formulaire de connexion affiché avec succès
 */
router.get('/login', (req, res) => {
  res.render('login', { title: 'Connexion', error: null });
});

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Afficher la page d'administration
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Page d'administration affichée avec succès
 *       401:
 *         description: Utilisateur non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */
/* router.get('/admin', authenticateJWT, requireRole('admin'), (req, res) => {
  res.render('admin', {
    title: 'Admin',
    user: req.user,
  });
});
*/

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnecter un utilisateur
 *     tags: [Pages]
 *     responses:
 *       302:
 *         description: Redirection après déconnexion
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.redirect('/');
});

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Télécharger un fichier horodaté
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Fichier téléchargé avec succès
 *       500:
 *         description: Erreur lors de la génération ou du téléchargement du fichier
 */
router.get('/download', (req, res) => {
  const now = new Date();
  const dateFormatted = now.toISOString().replace(/[-:]/g, '').split('.')[0];
  const fileName = `${dateFormatted}.txt`;

  const fileContent = `Date et heure du téléchargement : ${now.toLocaleString()}`;

  const filePath = path.join(__dirname, '..', 'tmp', fileName);

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Erreur lors de la création du fichier :', err);
      return res.status(500).send('Erreur lors de la création du fichier');
    }

    res.download(filePath, fileName, (downloadErr) => {
      if (downloadErr) {
        console.error('Erreur lors du téléchargement du fichier :', downloadErr);
        return res.status(500).send('Erreur lors du téléchargement du fichier');
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erreur lors de la suppression du fichier temporaire :', unlinkErr);
        }
      });
    });
  });
});

export default router;