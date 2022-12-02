const express = require('express');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const sauceController = require('../controllers/sauce');
const router = express.Router();

router.get('/', auth, sauceController.getAllSauces);

router.get('/:id', auth, sauceController.getOneSauce);

router.post('/', auth, multer, sauceController.createSauce);

// router.put('/:id', auth, multer, sauceController.updateSauce);

// router.delete('/:id', auth, sauceController.deleteSauce);

// router.post('/:id/like', auth, sauceController.userLikesSauce);

module.exports = router;