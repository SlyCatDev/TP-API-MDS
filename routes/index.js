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

router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', message: 'Bienvenue' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'À propos', message: 'À propos de moi' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', message: 'Contactez-moi' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Connexion', error: null });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.redirect('/');
});

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