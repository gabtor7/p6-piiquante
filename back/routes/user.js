const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// CREATE user
router.post('/signup', userController.signup);

// READ user
router.post('/login', userController.login);

module.exports = router;