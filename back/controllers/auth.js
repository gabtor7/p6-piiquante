const User = require('../models/user');

exports.createUser = (req, res, next) => {
    //hachage du mdp avant enregistrement dans BDD
    const user = new User({...req.body});
    user.save().then(res.status(201).json('Utilisateur enregistré'))
    .catch(res.status(400).json({error}));
};

exports.getUser = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({error}));
};

exports.updateUser = (req, res, next) => {
    User.updateOne({email: req.body.email}, {...req.body, email: req.body.email})
    .then(user => res.status(200).json({message: "User modifié"}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteUser = (req, res, next) => {
    User.deleteOne({email: req.body.email})
    .then(user => res.status(200).json({message: "User supprimé"}))
    .catch(error => res.status(400).json({error}));
}