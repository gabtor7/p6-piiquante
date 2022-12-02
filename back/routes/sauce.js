const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceController = require('../controllers/sauce');

router.get('/', auth, sauceController.getAllSauces);// ne marche pas avec auth ?

router.get('/:id', auth, sauceController.getOneSauce);// ne marche pas avec auth ?

router.post('/', auth, multer, sauceController.createSauce);

router.put('/:id', auth, multer, sauceController.updateSauce);

router.delete('/:id', auth, sauceController.deleteSauce);

router.post('/:id/like', auth, sauceController.userLikesSauce);

module.exports = router;