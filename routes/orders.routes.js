const express = require('express');

const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.get('/', ordersController.getOrders);
router.get('/checkout', ordersController.checkOut);

router.post('/', ordersController.placeOrder);

module.exports = router;
