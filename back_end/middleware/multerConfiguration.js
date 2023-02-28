const multer = require('multer'); // Importe le module multer pour gérer les fichiers reçus dans les requêtes HTTP.

const MIME_TYPES = { // Définit un objet qui fait la correspondance entre le type MIME du fichier et son extension.
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // Définit l'endroit où les fichiers seront stockés et leur nom.
  destination: (req, file, callback) => { // Définit la destination des fichiers reçus dans la requête.
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // Définit le nom des fichiers reçus dans la requête.
    const name = file.originalname.split(' ').join('_'); // Récupère le nom original du fichier et le remplace les espaces par des underscores.
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension du fichier en fonction de son type MIME.
    callback(null, name + Date.now() + '.' + extension); // Concatène le nom original du fichier avec la date actuelle et son extension.
  }
});

module.exports = multer({storage: storage}).single('image'); // Exporte le middleware multer configuré pour stocker un seul fichier image. Le champ du fichier dans la requête est "image".
