const express = require('express'); // Importe le module express pour créer et gérer l'application.
const mongoose = require('mongoose'); // Importe le module mongoose pour interagir avec une base de données MongoDB.
const bodyParser = require('body-parser'); // Importe le module body-parser pour extraire les données d'un corps de requête HTTP.
const path = require('path'); // Importe le module path pour résoudre des chemins de fichiers.
const helmet = require('helmet'); // Importe le module helmet pour améliorer la sécurité de l'application.
const rateLimit = require("express-rate-limit"); // Importe le module express-rate-limit pour limiter le nombre de requêtes sur l'API.

const userRoutes = require('./routes/user'); // Importe les routes pour la gestion des utilisateurs.
const saucesRoutes = require('./routes/sauce'); // Importe les routes pour la gestion des sauces.

const app = express(); // Crée une instance de l'application express.

(async () => { // Utilisation d'une fonction asynchrone pour se connecter à la base de données MongoDB.
  try {
    await mongoose.connect("mongodb+srv://citizensyd:3ehQr6fkYudXHoMe@cluster0.ezfpv.mongodb.net/?retryWrites=true&w=majority"); // Connexion à la base de données MongoDB avec les identifiants d'accès.
    console.log("Connexion réussie avec la base de donnée"); // Affichage d'un message de confirmation de connexion.
  } catch (error) {
    console.log(error.message); // Affichage de l'erreur de connexion en cas d'échec.
  }
})();

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
