const express = require('express'); // Importe le module express pour créer et gérer l'application.
const mongoose = require('mongoose'); // Importe le module mongoose pour interagir avec une base de données MongoDB.
const bodyParser = require('body-parser'); // Importe le module body-parser pour extraire les données d'un corps de requête HTTP.
const path = require('path'); // Importe le module path pour résoudre des chemins de fichiers.
const dotenv = require('dotenv'); // Importer le module dotenv qui permet de charger des variables d'environnement depuis un fichier .env
const helmet = require('helmet'); // Importe le module helmet pour améliorer la sécurité de l'application.
const rateLimit = require("express-rate-limit"); // Importe le module express-rate-limit pour limiter le nombre de requêtes sur l'API.

const userRoutes = require('./routes/user'); // Importe les routes pour la gestion des utilisateurs.
const saucesRoutes = require('./routes/sauce'); // Importe les routes pour la gestion des sauces.

const app = express(); // Crée une instance de l'application express.

dotenv.config(); // Charger les variables d'environnement depuis un fichier .env à la racine du projet

mongoose.connect(process.env.MONGODB_URI, { // Se connecter à la base de données MongoDB en utilisant l'URI spécifié dans la variable d'environnement MONGODB_URI
  useNewUrlParser: true, // Options de configuration pour la connexion MongoDB
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected')) // Afficher un message de confirmation si la connexion réussit
  .catch((err) => console.log(err)); // Afficher l'erreur si la connexion échoue

app.use((req, res, next) => { // Middleware pour gérer les autorisations de CORS.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // Utilisation du middleware helmet pour améliorer la sécurité de l'application.

const limiter = rateLimit({ // Utilisation du middleware express-rate-limit pour limiter le nombre de requêtes sur l'API.
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});

app.use(limiter); // Utilisation du middleware express-rate-limit.

app.use(bodyParser.json()); // Utilisation du middleware body-parser pour extraire les données du corps de la requête HTTP.

app.use('/images', express.static(path.join(__dirname, 'images'))); // Définition du dossier contenant les images des sauces.

app.use('/api/auth', userRoutes); // Utilisation des routes pour la gestion des utilisateurs.
app.use('/api/sauces', saucesRoutes) // Utilisation des routes pour la gestion des sauces.

module.exports = app; // Exporte l'application express pour utilisation dans d'autres fichiers.
