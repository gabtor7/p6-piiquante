const auth = require('../middleware/auth');
const Sauce = require('../models/sauce');
const multer = require('../middleware/multer-config');
const { JsonWebTokenError } = require('jsonwebtoken');
const user = require('../models/user');
const sauce = require('../models/sauce');
const fs = require ('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => { 
        res.setHeader('Authorization', 'Bearer' + process.env.TOKEN_KEY);  
        res.status(200).json(sauces);
    })
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if(!sauce){
            return res.status(404).json({error: "Sauce not found"});
        }
        res.status(200).json(sauce);
    })
    .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) => {
    const newSauceObject = JSON.parse(req.body.sauce);
    delete newSauceObject._id;
    delete newSauceObject._userId;

    const newSauce = new Sauce({
        userId: req.auth.userId,
        ...newSauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    newSauce.save()
    .then(() => res.status(201).json({message: "Nouvelle sauce créée !"}))
    .catch(error => res.status(400).json({error}));
    
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){
           return res.status(401).json({error: "Not authorized"});
        } else {
            updateQuery = { _id: req.params.id };
            updateSauce = {...sauceObject, _id: req.params.id};
            Sauce.updateOne(updateQuery, updateSauce)
            .then(() => res.status(201).json({message: "La sauce a été modifiée"}))
            .catch(error => res.status(400).json({error}));
        }
    })
    .catch(error => res.status(400).json({error}));

};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => { 
        if(sauce.userId != req.auth.userId){
            return res.status(401).json({error: "Not authorized"});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(201).json({message: "Sauce supprimée avec succès"}))
                .catch(error => res.status(400).json({error}));
            });
        }
    })
    .catch((error) => res.status(500).json({error}));
};

exports.userLikesSauce = (req, res, next) => {
    // Définit le statut « Like » pour
    // l' userId fourni. 
    // L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié. Cela permet de garder une trace de leurs préférences 
    // et les empêche de liker ou de ne pas disliker la même sauce plusieurs fois : 
    // un utilisateur ne peut avoir qu'une seule valeur pour chaque sauce. 
    // Le nombre total de « Like » et de « Dislike » est mis à jour à chaque nouvelle notation.
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        
        let userHasLiked = sauce.usersLiked.indexOf(req.body.userId); 
        let userHasDisliked = sauce.usersLiked.indexOf(req.body.userId);

        switch (req.body.like){
            // annulation de like ou dislike
            case 0:
                // si user a déjà liké
                if(userHasLiked != -1){
                    delete sauce.usersLiked[userHasLiked];
                    sauce.likes--;
                }
                // si user a déjà disliké
                if(userHasDisliked != -1){
                    this.deleteSauce.usersDisliked[userHasDisliked];
                    sauce.dislikes--;
                }
                break;
            // LIKE
            case 1:
                // si user n'a pas déjà liké
                if(userHasLiked == -1){
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes++;
                }
                break;
            // DISLIKE
            case -1:
                // si user n'a pas déjà disliké
                if(userHasDisliked == -1){
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes++;
                }
                break;                
        }
        res.status(201).json({message: "Succès"});
    })
    .catch(error => res.status(500).json({error}));

};