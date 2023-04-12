const express = require('express');

const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.get('/checkout', ordersController.checkOut);

router.post('/', ordersController.makeOrder);

module.exports = router;
