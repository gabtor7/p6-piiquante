const Sauce = require('../models/sauce');
const User = require('../models/user');
const multer = require('../middleware/multer-config');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) =>{
        const allSauces = sauces.map((sauce) => {
            sauce.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + sauce.imageUrl;
            return sauces;
        });
        res.status(200).json(allSauces);
    })
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if(!sauce){
            return res.status(404).json({error: "Sauce not found"});
        }
        sauce.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + sauce.imageUrl;
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

/*exports.updateSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
};

/*
exports.deleteSauce = (req, res, next);

exports.userLikesSauce = (req, res, next);*/