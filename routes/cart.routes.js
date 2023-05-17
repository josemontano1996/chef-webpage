const express = require('express');

const cartController = require('../controllers/cart.controller');

const csrfMiddleware = require('../middlewares/csrf');

const router = express.Router();

router.get('/', csrfMiddleware.generateCsrfToken, cartController.getCart);
router.get('/flash', cartController.flashCart);

router.post(
  '/items',
  csrfMiddleware.validateCsrfToken,
  cartController.addCartItem
);

router.patch(
  '/items',
  csrfMiddleware.validateCsrfToken,
  cartController.updateCartItem
);
router.patch(
  '/items/delete',
  csrfMiddleware.validateCsrfToken,
  cartController.deleteCartItem
);

module.exports = router;
