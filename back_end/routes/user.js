// Importation du framework Express et initialisation d'un routeur
const express = require('express');
const router = express.Router();

// Importation du contrôleur "user" qui gère les opérations relatives aux utilisateurs
const userCtrl = require('../controllers/user');

// Définition de deux routes accessibles par POST : une pour l'inscription et une pour la connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation du routeur pour l'utiliser dans d'autres parties de l'application
module.exports = router;