// Importation du module http et du module app
const http = require('http');
const app = require('./app');

// Fonction pour normaliser le port d'écoute
const normalizePort = val => {
  const port = parseInt(val, 10); // Convertit le paramètre en entier

  if (isNaN(port)) { // Si le port n'est pas un nombre, retourne le paramètre
    return val;
  }
  if (port >= 0) { // Si le port est un nombre positif, retourne le port
    return port;
  }
  return false; // Sinon, retourne faux
};
// Définition du port d'écoute
const port = normalizePort(process.env.PORT || '3000'); // Récupère le port du système ou utilise le port 3000 par défaut
app.set('port', port); // Configure l'application avec le port d'écoute

// Gestionnaire d'erreur en cas de problème avec le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') { // Si le problème ne vient pas de la fonction listen()
    throw error; // Lève une erreur
  }
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Définit l'adresse d'écoute
  switch (error.code) { // Teste le code d'erreur
    case 'EACCES': // Si le serveur nécessite des privilèges élevés
      console.error(bind + ' nécessite des privilèges élevés.'); // Affiche un message d'erreur
      process.exit(1); // Termine le processus avec une erreur
      break;
    case 'EADDRINUSE': // Si le port est déjà utilisé
      console.error(bind + ' est déjà utilisé.'); // Affiche un message d'erreur
      process.exit(1); // Termine le processus avec une erreur
      break;
    default: // Si le code d'erreur est inconnu
      throw error; // Lève une erreur
  }
};

// Création du serveur
const server = http.createServer(app);

// Gestion des erreurs et des événements
server.on('error', errorHandler); // Gère les erreurs
server.on('listening', () => { // Gère les événements de type listening
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Définit l'adresse d'écoute
  console.log('En écoute sur ' + bind); // Affiche un message de confirmation
});

// Écoute le port défini
server.listen(port);
