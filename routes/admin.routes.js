const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/orders', adminController.getOrders);
router.get('/account', adminController.getAccount);

module.exports = router;
