const mongoose = require('mongoose'); // Importe le module mongoose pour interagir avec une base de données MongoDB.
const uniqueValidator = require('mongoose-unique-validator'); // Importe le module mongoose-unique-validator pour valider l'unicité des champs.

const userSchema = mongoose.Schema({ // Définit le schéma de données pour un utilisateur.
  email: { type: String, required: true, unique: true }, // Définit un champ email de type string, requis et unique.
  password: { type: String, required: true } // Définit un champ password de type string, requis.
});

userSchema.plugin(uniqueValidator); // Utilise le plugin mongoose-unique-validator pour valider l'unicité du champ email.

module.exports = mongoose.model('User', userSchema); // Exporte le modèle mongoose pour le schéma userSchema en lui donnant le nom "User".
