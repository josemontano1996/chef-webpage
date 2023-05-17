const express = require('express');

const menuController = require('../controllers/menu.controller');

const csrfMiddleware = require('../middlewares/csrf');

const router = express.Router();

router.get('/menu', csrfMiddleware.generateCsrfToken, menuController.getMenu);

module.exports = router;
