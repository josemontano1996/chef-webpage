const express = require('express');
const baseController = require('../controllers/base.controller');

const router = express.Router();

router.get('/', baseController.getIndex);
router.get('/about', baseController.getAbout);
router.get('/menu', baseController.getMenu);
router.get('/auth', baseController.getAuth);
router.get('/login', baseController.login);
router.get('/customer/orders', baseController.gerOrders)

router.post('/signup', baseController.signup);

module.exports = router;
