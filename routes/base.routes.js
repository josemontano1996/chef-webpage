const express = require('express');
const baseController = require('../controllers/base.controller');

const csrfMiddleware = require('../middlewares/csrf');

const router = express.Router();

router.get('/', baseController.getIndex);
router.get('/about', baseController.getAbout);
router.get('/auth', csrfMiddleware.createCSRFToken, baseController.getAuth);
router.get(
  '/auth/signup',
  csrfMiddleware.createCSRFToken,
  baseController.getSignup
);
router.get(
  '/auth/login',
  csrfMiddleware.createCSRFToken,
  baseController.getLogin
);

router.post('/login', baseController.login);
router.post('/signup', baseController.signup);
router.post('/logout', baseController.logout);

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

module.exports = router;
