const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart);
router.get('/flash', cartController.flashCart);

router.post('/items', cartController.addCartItem);

router.patch('/items', cartController.updateCartItem);
router.patch('/items/delete', cartController.deleteCartItem);

module.exports = router;
