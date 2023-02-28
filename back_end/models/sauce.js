const mongoose = require('mongoose'); // Importe le module mongoose pour interagir avec une base de données MongoDB.

const sauceSchema = mongoose.Schema({ // Définit le schéma de données pour une sauce.
  name: { type: String, required: true }, // Définit un champ name de type string, requis.
  manufacturer: { type: String, required: true }, // Définit un champ manufacturer de type string, requis.
  description: { type: String, required: true }, // Définit un champ description de type string, requis.
  mainPepper: { type: String, required: true }, // Définit un champ mainPepper de type string, requis.
  imageUrl: {type: String }, // Définit un champ imageUrl de type string.
  heat: { type: Number, required: true }, // Définit un champ heat de type nombre, requis.
  likes: { type: Number, default: 0}, // Définit un champ likes de type nombre, avec une valeur par défaut de 0.
  dislikes: { type: Number, default: 0 }, // Définit un champ dislikes de type nombre, avec une valeur par défaut de 0.
  userId: { type: String }, // Définit un champ userId de type string.
  usersLiked: [String], // Définit un champ usersLiked comme un tableau de strings.
  usersDisliked: [String]  // Définit un champ usersDisliked comme un tableau de strings.
});

module.exports = mongoose.model('Sauce', sauceSchema); // Exporte le modèle mongoose pour le schéma sauceSchema en lui donnant le nom "Sauce".
