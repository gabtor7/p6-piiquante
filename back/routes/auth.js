const express = require('express');
const router = express.Router();

const userController = require('../controllers/auth');

// CREATE user - le mot de passe devra être hashé
router.post('/signup', userController.createUser);

// READ user (Repris du cours. Pour la connexion ?)
router.get('/login', userController.getUser);

// UPDATE user
router.put('/login', userController.updateUser);

// DELETE user
router.delete('/login', userController.deleteUser);

module.exports = router;