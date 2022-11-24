const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// CREATE user - le mot de passe devra être hashé
router.post('/signup', userController.signup);

// READ user (Repris du cours. Pour la connexion ?)
router.get('/login', userController.login);

module.exports = router;