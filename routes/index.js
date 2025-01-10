import { Router } from 'express';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const router = Router();


// Définir __dirname dans un environnement ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Page d'accueil
router.get('/', (req, res) => {
    res.render('index', { title: 'Accueil', message: 'Bienvenue' });
});

// Page "À propos"
router.get('/about', (req, res) => {
    res.render('about', { title: 'À propos', message: 'À propos de moi' });
});

// Page de contact
router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact', message: 'Contactez-moi' });
});

// Page de connexion
router.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion', error: null });
});

// Traitement du formulaire de connexion
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Vérification des identifiants
    if (username === 'admin' && password === 'admin') {
        req.session.login = username; // Stocke l'identifiant dans la session
        res.redirect('/');
    } else {
        res.render('login', { title: 'Connexion', error: 'Identifiants incorrects' });
    }
});

// Page d'administration (accessible uniquement si connecté)
router.get('/admin', (req, res) => {
    if (req.session.login) {
        res.render('admin', { title: 'À propos', login: req.session.login });
    } else {
        res.redirect('/login');
    }
});

// Déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Supprime le cookie de session
        res.redirect('/');
    });
});

// Télécharger un fichier avec la date
router.get('/download', (req, res) => {
    // Générer la date et l'heure au format YYYYMMDD_HHmmss
    const now = new Date();
    const dateFormatted = now.toISOString().replace(/[-:]/g, '').split('.')[0];
    const fileName = `${dateFormatted}.txt`;

    // Contenu du fichier
    const fileContent = `Date et heure du téléchargement : ${now.toLocaleString()}`;

    // Chemin temporaire pour le fichier
    const filePath = path.join(__dirname, '..', 'tmp', fileName);

    // Créer le fichier temporaire
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Erreur lors de la création du fichier :', err);
            return res.status(500).send('Erreur lors de la création du fichier');
        }

        // Envoyer le fichier au client
        res.download(filePath, fileName, (downloadErr) => {
            if (downloadErr) {
                console.error('Erreur lors du téléchargement du fichier :', downloadErr);
                return res.status(500).send('Erreur lors du téléchargement du fichier');
            }

            // Supprimer le fichier après le téléchargement
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Erreur lors de la suppression du fichier temporaire :', unlinkErr);
                }
            });
        });
    });
});



export default router;
