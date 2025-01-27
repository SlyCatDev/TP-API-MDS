import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes/index.js';
import dabRoutes from './routes/dab.js';
import chatRoutes from './routes/chatRoutes.js';
import { initializeChat } from './services/chatService.js';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// import { synchronizeDatabase } from './config/sequelize.js';
// import sequelize from './config/sequelize.js';


const app = express();
const PORT = 3000;

const server = createServer(app);
const io = new Server(server);

// Configuration de swagger-jsdoc
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Documentation API',
        version: '1.0.0',
        description: 'Une API simple avec Express et Swagger',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./routes/*.js'], // Chemin des fichiers contenant des commentaires Swagger
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Initialize service chat
initializeChat(io);

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

//synchronizeDatabase();

// Utilisation des routes
app.use('/', routes);
app.use('/dab', dabRoutes);
app.use(chatRoutes);
// Route pour Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gestion des routes inexistantes (404)
app.use((req, res) => {
    res.status(404).render('404', { title: 'Erreur 404' });
});


// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
