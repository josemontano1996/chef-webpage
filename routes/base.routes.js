const express = require('express');
const baseController = require('../controllers/base.controller');

const router = express.Router();

router.get('/', baseController.getIndex);
router.get('/about', baseController.getAbout);
router.get('/menu', baseController.getMenu);
router.get('/auth', baseController.getAuth);
router.get('/auth/signup', baseController.getSignup);
router.get('/auth/login', baseController.getLogin);
router.get('/orders', baseController.getOrders);

//error routes
router.get('/401', (req, res) => {
  res.status(401).render('shared/errors/401');
});
router.get('/403', (req, res) => {
  res.status(403).render('shared/errors/403');
});
router.get('/404', (req, res) => {
  res.status(404).render('shared/errors/404');
});
router.get('/500', (req, res) => {
  res.status(500).render('shared/errors/500');
});

router.post('/login', baseController.login);
router.post('/signup', baseController.signup);
router.post('/logout', baseController.logout);

module.exports = router;
