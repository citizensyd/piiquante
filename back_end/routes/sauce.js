// Importation du framework Express et initialisation d'un routeur
const express = require('express');
const router = express.Router();

// Importation des middlewares pour l'authentification et la configuration de Multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multerConfiguration');

// Importation du contrôleur "sauce" qui gère les opérations relatives aux sauces
const sauceCtrl = require('../controllers/sauce');

// Définition des routes pour la gestion des sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Route pour créer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route pour récupérer une sauce par son identifiant
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route pour modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route pour supprimer une sauce existante
router.get('/', auth, sauceCtrl.getAllSauces); // Route pour récupérer toutes les sauces
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Route pour ajouter ou supprimer un like sur une sauce existante

// Exportation du routeur pour l'utiliser dans d'autres parties de l'application
module.exports = router;