const express = require('express');
const customerController = require('../controllers/customer.controller');

const router = express.Router();

router.get('/account', customerController.getAccount);

router.patch('/account/:id', customerController.updateUserData)

module.exports = router;
