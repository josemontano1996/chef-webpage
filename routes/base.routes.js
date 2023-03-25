const express = require('express');
const baseController = require('../controllers/base.controller');

const router = express.Router();

router.get('/', baseController.getIndex);
router.get('/about', baseController.getAbout);
router.get('/menu', baseController.getMenu);
router.get('/auth', baseController.getAuth);
router.get('/auth/signup', baseController.getSignup);
router.get('/auth/login', baseController.getLogin);
router.get('/customer/orders', baseController.getOrders);

router.post('/login', baseController.login);
router.post('/signup', baseController.signup);
router.post('/logout', baseController.logout);

module.exports = router;
