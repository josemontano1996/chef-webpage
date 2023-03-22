const express = require('express');
const baseController = require('../controllers/base.controller');

const router = express.Router();

router.get('/', baseController.getIndex);
router.get('/about', baseController.getAbout);
router.get('/menu', baseController.getMenu);
router.get('/auth', baseController.getAuth);
router.get('/customer/orders', baseController.getOrders)

router.post('/login', baseController.login);
router.post('/signup', baseController.signup);

module.exports = router;
