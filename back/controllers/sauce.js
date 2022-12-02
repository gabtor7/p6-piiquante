const auth = require('../middleware/auth');
const Sauce = require('../models/sauce');
const multer = require('../middleware/multer-config');
const { JsonWebTokenError } = require('jsonwebtoken');
const user = require('../models/user');
const sauce = require('../models/sauce');
const fs = require ('fs');

exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
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

exports.likeSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        let userHasLiked = sauce.usersLiked.includes(req.body.userId);
        let userHasDisliked = sauce.usersDisliked.includes(req.body.userId);
        switch (req.body.like){
            case 1:
                if(!userHasLiked){
                    Sauce.updateOne(
                        {_id: req.params.id},
                        {
                            $inc: {likes: 1},
                            $push: {usersLiked: req.body.userId}
                        }
                    )
                    .then(() => res.status(201).json({ message: "Sauce liked +1"}))
                    .catch((error) => res.status(400).json({error}));
                }
                break;

            case -1:
                if(!userHasDisliked){
                    Sauce.updateOne(
                        {_id: req.params.id}, 
                        {
                            $inc: {dislikes: 1}, 
                            $push: {usersDisliked: req.body.userId}
                        }
                    )
                    .then(() => res.status(201).json({ message: "Sauce disliked +1"}))
                    .catch(error => res.status(400).json({error}));
                }
                break; 

                case 0:
                    if(userHasLiked){
                        Sauce.updateOne(
                            {_id: req.params.id}, 
                            {
                                $inc: {likes: -1}, 
                                $pull: {usersLiked: req.body.userId}
                            }
                        )
                        .then(() => res.status(201).json({ message: "Sauce unliked -1"}))
                        .catch(error => res.status(400).json({error}));
                    }
                    // si user a déjà disliké
                    if(userHasDisliked){
                        Sauce.updateOne(
                            {_id: req.params.id}, 
                            {
                                $inc: {dislikes: -1}, 
                                $pull: {usersDisliked: req.body.userId}
                            }
                        )
                        .then(() => res.status(201).json({ message: "Sauce undisliked -1"}))
                        .catch(error => res.status(400).json({error}));
                    }
                    break;
            }
        
    })
    .catch((error) => res.status(404).json({error}));

};