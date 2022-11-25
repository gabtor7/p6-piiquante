const express = require('express');
const router = express.Router();

const user = require('../middleware/user');
const multer = require('..middleware/multer-config');
const userController = require('../controllers/user');

// CREATE user
router.post('/signup', userController.signup);

// READ user
router.post('/login', userController.login);

module.exports = router;