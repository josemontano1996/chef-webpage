const express = require('express');

const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.get('/', ordersController.getOrders);
router.get('/checkout', ordersController.checkOut);
router.get('/:query', ordersController.getOrderForQueries);

router.post('/', ordersController.placeOrder);

router.patch('/:id', ordersController.cancelRequest);

module.exports = router;
