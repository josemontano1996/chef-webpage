const express = require('express');
const customerController = require('../controllers/customer.controller');

const router = express.Router();

router.get('/cart', customerController.getCart)
router.get('/orders', customerController.getOrders);
router.get('/account', customerController.getAccount);

module.exports = router;
