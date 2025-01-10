import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import routes from './routes/index.js';
import dabRoutes from './routes/dab.js';
import chatRoutes from './routes/chatRoutes.js';
import { Server } from 'socket.io';
// import Utilisateur from './models/utilisateur.js';
import bodyParser from 'body-parser';
import sequelize from './config/sequelize.js';


const app = express();
const PORT = 3000;

const server = createServer(app);
const io = new Server(server);

// Fonction pour synchroniser la base de données
async function synchronizeDatabase() {
    try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données réussie.');
  
      await sequelize.sync({ alter: true });
      console.log('La base de données a été synchronisée avec succès.');
    } catch (err) {
      console.error('Erreur lors de la synchronisation de la base de données :', err);
    }
  }

// Middleware bodyParser
app.use(bodyParser.json());

// Middleware pour parser les données POST (formulaires)
app.use(express.urlencoded({ extended: true }));

// Middleware pour les sessions
app.use(session({
    secret: 'secretKey', // Clé secrète pour signer les sessions
    resave: false,       // Ne pas sauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: true, // Sauvegarder les sessions non initialisées
    cookie: { secure: false } // false si pas en HTTPS
}));

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Configuration du moteur de templates EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware pour rendre les infos de session accessibles aux templates
app.use((req, res, next) => {
    res.locals.login = req.session.login || null;
    next();
});

// Gestion du chat socket.io
//app.use("/socketio/", tchatSocketio(httpServer));

synchronizeDatabase();

// Utilisation des routes
app.use('/', routes);
app.use('/dab', dabRoutes);
app.use(chatRoutes);

//  Socket.io 
io.on('connection', (socket) => {
    const msg = `Un utilisateur vient de se connecter`
    io.emit('message', msg)
    console.log('Un utilisateur est connecté');

    // afficher le message dans la console
    socket.on('message', (msg) => {
        io.emit('message', {
            contenu : msg
        })
        console.log('Message :' + msg);
    });

    // déconnexion
    socket.on('disconnect', () => {
        const msg = `Un utilisateur vient de se déconnecter`
        io.emit('message', {
            message : msg
        })

        console.log('Un utilisateur s\'est déconnecté');
    });
  });

// Gestion des routes inexistantes (404)
app.use((req, res) => {
    res.status(404).render('404', { title: 'Erreur 404' });
});


// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

/* function sendMsg(options) {
    const options = 

    const msg = {
        time: new Date().toJSON(),
        message : 

}


}

*/