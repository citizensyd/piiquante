// Importer les modules 'bcrypt' et 'jsonwebtoken'
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importer le modèle 'User'
const User = require("../models/user");

// Définir la fonction d'inscription des utilisateurs
exports.signup = (req, res, next) => {
  // Hasher le mot de passe avec une salage de 10 tours
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Créer un nouvel utilisateur avec l'email et le mot de passe hashé
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Sauvegarder l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Définir la fonction de connexion des utilisateurs
exports.login = (req, res, next) => {
  // Rechercher l'utilisateur correspondant à l'email fourni
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si l'utilisateur n'est pas trouvé, renvoyer une erreur d'authentification
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      // Comparer le mot de passe fourni avec celui stocké dans la base de données
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si les mots de passe ne correspondent pas, renvoyer une erreur d'authentification
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          // Si les mots de passe correspondent, renvoyer l'ID de l'utilisateur et un jeton d'authentification valide pour 24 heures
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET", // Cette clé secrète devrait être changée dans un environnement de production
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
