const express = require('express');

const ordersController = require('../controllers/orders.controller');

const csrfMiddleware = require('../middlewares/csrf');
const csrf = require('../middlewares/csrf');

const router = express.Router();

router.get('/', csrfMiddleware.generateCsrfToken, ordersController.getOrders);
router.get(
  '/checkout',
  csrfMiddleware.generateCsrfToken,
  ordersController.checkOut
);
router.get(
  '/:query',
  csrfMiddleware.generateCsrfToken,
  ordersController.getOrderForQueries
);

router.post('/', csrfMiddleware.validateCsrfToken, ordersController.placeOrder);

router.patch(
  '/:id',
  csrfMiddleware.validateCsrfToken,
  ordersController.cancelRequest
);

module.exports = router;
