const jwt = require('jsonwebtoken'); // Importation du package jsonwebtoken
 
module.exports = (req, res, next) => { // Exportation de la fonction middleware qui prend trois paramètres : la requête (req), la réponse (res) et la fonction next.
   try { // Début du bloc d'essai qui contient le code à exécuter.
       const token = req.headers.authorization.split(' ')[1]; // Extraction du token d'authentification de la requête. Ce token est stocké dans le header "Authorization" de la requête.
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Décodage du token à l'aide de la clé secrète "RANDOM_TOKEN_SECRET". Le résultat est stocké dans la variable decodedToken.
       const userId = decodedToken.userId; // Récupération de l'identifiant de l'utilisateur à partir du token décodé. L'identifiant est stocké dans la variable userId.
       req.auth = { userId: userId }; // Ajout de l'identifiant de l'utilisateur à l'objet "auth" de la requête.
       next(); // Appel de la fonction next pour passer au middleware suivant.
   } catch(error) { // Bloc catch qui s'exécute en cas d'erreur.
       res.status(401).json({ error }); // Envoi d'une réponse d'erreur avec le code HTTP 401 (non autorisé) et le message d'erreur correspondant.
   }
};
