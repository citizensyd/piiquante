// Importation du modèle Sauce
const Sauce = require("../models/sauce");
// Importation de la librairie fs-extra
const fse = require("fs-extra");

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // Extraction de l'objet sauce depuis la requête sous forme de JSON
  const sauceObject = JSON.parse(req.body.sauce);
  // Suppression de l'identifiant de la sauce pour éviter les doublons
  delete sauceObject._id;
  // Création d'une nouvelle instance de Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // Ajout de l'URL de l'image à la sauce
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Sauvegarde de la sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce sauvegardée" }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour récupérer une sauce spécifique
exports.getOneSauce = (req, res, next) => {
  // Recherche d'une sauce dans la base de données en utilisant l'identifiant de la requête
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      // Si une sauce est trouvée, renvoie la sauce sous forme de JSON
      res.status(200).json(sauce);
    })
    .catch((error) => {
      // Sinon, renvoie une erreur 404
      res.status(404).json({
        error: error,
      });
    });
};

// Fonction pour modifier une sauce existante
exports.modifySauce = (req, res) => {
  // Déclaration d'un objet vide pour stocker les modifications de la sauce
  let sauceObject = {};
  // Si une nouvelle image est ajoutée, vérifie que l'utilisateur est bien le créateur de la sauce
  if (req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      if (req.auth.userId !== sauce.userId) {
        res.status(403).json({ message: `Non autorisé !` });
      } else {
        // Si l'utilisateur est bien le créateur, supprime l'ancienne image de la sauce
        const filename = sauce.imageUrl.split("/").at(-1);
        fse.unlinkSync(`images/${filename}`);
      }
    });
    // Met à jour l'objet sauceObject avec les modifications de la requête
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
  } else {
    // Si aucune nouvelle image n'est ajoutée, met simplement à jour l'objet sauceObject avec les modifications de la requête
    sauceObject = { ...req.body };
  }
  // Met à jour la sauce dans la base de données
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // On cherche la sauce correspondant à l'identifiant de la requête
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Si l'utilisateur qui a fait la requête n'est pas l'auteur de la sauce, on renvoie une erreur d'autorisation
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({ message: "Not authorized" });
    } else {
      // Si l'utilisateur est bien l'auteur de la sauce, on supprime l'image associée à la sauce et on supprime la sauce de la base de données
      const filename = sauce.imageUrl.split("/images/")[1];
      fse.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    }
  });
};

// Fonction pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // On utilise la méthode find() de Mongoose pour récupérer toutes les sauces dans la base de données
  Sauce.find()
    .then((sauces) => {
      // Si la requête réussit, on renvoie toutes les sauces en format JSON
      res.status(200).json(sauces);
    })
    .catch((error) => {
      // Si la requête échoue, on renvoie une erreur en format JSON avec le message d'erreur
      res.status(400).json({
        error: error,
      });
    });
};

// Fonction pour liker ou disliker une sauce
exports.likeSauce = async (req, res, next) => {
  try {
    // On récupère les informations nécessaires à partir de la requête
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    
    // On cherche la sauce correspondant à l'identifiant de la requête
    const sauce = await Sauce.findOne({ _id: sauceId });

    // Si l'utilisateur like la sauce et n'a pas déjà liké cette sauce, on incrémente le nombre de likes et on ajoute l'utilisateur à la liste des utilisateurs qui ont liké la sauce
    if (like === 1 && !sauce.usersLiked.includes(userId)) {
      await Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        }
      );      
      return res.status(201).json({ message: "La sauce est liké" });
    }

    // Si l'utilisateur dislike la sauce et n'a pas déjà disliké cette sauce, on incrémente le nombre de dislikes et on ajoute l'utilisateur à la liste des utilisateurs qui ont disliké la sauce
    if (like === -1 && !sauce.usersDisliked.includes(userId)) {
      await Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        }
      );
      return res.status(201).json({ message: "La sauce n'est pas aimé" });
    }

    if (like === 0) {
      // Si like = 0, cela signifie que l'utilisateur veut retirer son like ou dislike sur la sauce.
      if (sauce.usersLiked.includes(userId)) {
        // Si l'utilisateur a aimé la sauce précédemment, alors nous retirons son like en décrémentant la propriété "likes" et en retirant l'ID de l'utilisateur de la liste "usersLiked".
        await Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }
        );
        return res.status(201).json({ message: "On retire le Like" });
      }

      if (sauce.usersDisliked.includes(userId)) {
        // Si l'utilisateur a précédemment disliké la sauce, alors nous retirons son dislike en décrémentant la propriété "dislikes" et en retirant l'ID de l'utilisateur de la liste "usersDisliked".
        await Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }
        );
        return res.status(201).json({ message: "On retire le Dislike" });
      }
    }

    // Si nous n'avons pas besoin de retirer un like ou dislike, nous renvoyons simplement une réponse HTTP 200 OK.
    res.status(200).send();

    // Si une erreur se produit lors de l'exécution du code, nous renvoyons une réponse HTTP 400 Bad Request avec l'erreur associée.
  } catch (error) {
    res.status(400).json({ error });
  }
};
